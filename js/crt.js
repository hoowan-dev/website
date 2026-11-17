// VHS / CRT backdrop: draws an animated "old TV" filter on a fixed canvas
// behind the page.
//  - thick, always-wavy scanlines split into Gruvbox colours (aqua on the
//    left, orange on the right, cream between) rolling downward at a drifting speed
//  - soft bright patches drifting behind the lines
//  - one wide soft "rolling bar" sweeping down the screen
//  - a VHS tracking band: a strip of horizontal static streaks
//  - flickering grain and a slight brightness flicker
//  - occasional glitches where the scanlines warp, shear, or form moire patterns
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.createElement('canvas');
  canvas.className = 'crt-scanlines';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const SHOW_LINES = false;       // wavy scanlines; off because they hurt readability
  const LINE_GAP = 9;              // px between scanlines
  const LINE_WIDTH = 2.5;          // thickness of each colour pass
  const LINE_ALPHA = 0.07;         // brightness of each colour pass (3 passes stack)
  const FRINGE = 1.6;              // px between the colour passes (RGB split)
  const WAVE_AMP = 3;              // px of constant waviness
  const GRAIN_ALPHA = 0.4;         // overall strength of the grain layer
  const SEGMENTS = 28;             // samples per line while warping
  const FRAME_MS = 1000 / 30;      // cap at 30fps; plenty for this effect
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  let width = 0;
  let height = 0;
  let offset = 0;                  // scroll position of the raster
  let speed = 30;                  // current px/s, drifts toward targetSpeed
  let targetSpeed = 30;
  let nextSpeedChange = 0;
  let glitch = null;               // active glitch event, if any
  let nextGlitch = 0;
  let lastTime = 0;
  let lastDraw = 0;
  let grainIndex = 0;
  let passes = [];                 // colour passes; gradients rebuilt on resize

  // Soft bright patches that drift slowly behind the lines
  const blobs = Array.from({ length: 3 }, (_, i) => ({
    phase: Math.random() * Math.PI * 2,
    speed: 0.05 + Math.random() * 0.08,
    radius: 0.35 + Math.random() * 0.25,
    hue: i
  }));

  const rand = (min, max) => min + Math.random() * (max - min);

  // Wide soft bar that rolls down and wraps, like an unsynced CRT
  const rollBar = { y: 0, size: 0, speed: 45 };
  // VHS tracking band: a strip of static that drifts down and wraps
  const tracking = { y: 0, size: 40, speed: 25, intensity: 1 };

  // Pre-render a few grain tiles and cycle them each frame
  const GRAIN_SIZE = 192;
  const grainTiles = Array.from({ length: 4 }, () => {
    const tile = document.createElement('canvas');
    tile.width = tile.height = GRAIN_SIZE;
    const tctx = tile.getContext('2d');
    const img = tctx.createImageData(GRAIN_SIZE, GRAIN_SIZE);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = Math.random();
      const light = v > 0.5;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = light ? 235 : 0;
      img.data[i + 3] = Math.random() < 0.35 ? Math.floor(rand(8, 40)) : 0;
    }
    tctx.putImageData(img, 0, 0);
    return tile;
  });

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    rollBar.size = height * 0.35;

    // Each colour pass fades across the screen using Gruvbox colours:
    // aqua strongest on the left, orange strongest on the right, cream throughout.
    const pass = (dy, stops) => {
      const g = ctx.createLinearGradient(0, 0, width, 0);
      stops.forEach(([at, color]) => g.addColorStop(at, color));
      return { dy, style: g };
    };
    passes = [
      pass(-FRINGE, [[0, `rgba(142, 192, 124, ${LINE_ALPHA * 1.3})`], [0.6, `rgba(142, 192, 124, ${LINE_ALPHA * 0.6})`], [1, `rgba(142, 192, 124, ${LINE_ALPHA * 0.2})`]]),
      pass(0, [[0, `rgba(131, 165, 152, ${LINE_ALPHA})`], [1, `rgba(235, 219, 178, ${LINE_ALPHA * 0.8})`]]),
      pass(FRINGE, [[0, `rgba(254, 128, 25, ${LINE_ALPHA * 0.2})`], [0.45, `rgba(254, 128, 25, ${LINE_ALPHA * 0.6})`], [1, `rgba(254, 128, 25, ${LINE_ALPHA * 1.3})`]])
    ];
  };

  const startGlitch = (now) => {
    const kinds = ['wave', 'shear', 'moire', 'roll'];
    glitch = {
      kind: kinds[Math.floor(Math.random() * kinds.length)],
      start: now,
      duration: rand(400, 1400),
      amp: rand(4, 12),
      freq: rand(0.004, 0.02),
      phaseSpeed: rand(2, 8) * (Math.random() < 0.5 ? -1 : 1),
      tilt: rand(-0.06, 0.06)
    };
    // Glitches kick the tracking band up a notch too
    tracking.intensity = rand(1.3, 1.8);
  };

  // Vertical displacement of a scanline at x; zero when the raster is calm.
  const warp = (x, y, t, strength) => {
    if (!glitch || strength <= 0) return 0;
    const g = glitch;
    switch (g.kind) {
      case 'wave':
        return strength * g.amp * Math.sin(x * g.freq + t * g.phaseSpeed);
      case 'shear':
        return strength * (g.tilt * (x - width / 2) + g.amp * 0.3 * Math.sin(t * g.phaseSpeed));
      case 'moire':
        // Phase depends on y too, so neighbouring lines cross and interfere
        return strength * g.amp * Math.sin(x * g.freq * 3 + y * 0.09 + t * g.phaseSpeed);
      case 'roll':
      default:
        return strength * g.amp * Math.sin(y * 0.02 + t * g.phaseSpeed) * Math.cos(x * g.freq);
    }
  };

  // Constant gentle undulation; two slow waves at different scales so the
  // lines bend into the drifting, moire-like shapes of a worn CRT.
  const baseWave = (x, y, t) =>
    WAVE_AMP * Math.sin(x * 0.0045 + y * 0.004 + t * 0.4) +
    WAVE_AMP * 0.6 * Math.sin(x * 0.011 - y * 0.007 - t * 0.6);

  const drawScanlines = (t, strength) => {
    const margin = WAVE_AMP * 2 + FRINGE * 2 + (glitch ? glitch.amp + Math.abs(glitch.tilt) * width : 0);
    const start = (offset % LINE_GAP) - LINE_GAP;

    ctx.lineWidth = LINE_WIDTH;
    ctx.globalCompositeOperation = 'lighter'; // overlapping passes blend toward white
    passes.forEach(({ dy, style }, index) => {
      // The fringe spacing breathes across the screen, so colours separate
      // more in some places than others.
      const spread = 1 + 0.5 * Math.sin(t * 0.6 + index);
      ctx.beginPath();
      for (let y = start - margin; y < height + margin; y += LINE_GAP) {
        for (let i = 0; i <= SEGMENTS; i++) {
          const x = (i / SEGMENTS) * width;
          const fringe = dy * spread * (1 + 0.6 * Math.sin(x * 0.003 + t * 0.4));
          const yy = y + baseWave(x, y, t) + warp(x, y, t, strength) + fringe;
          if (i === 0) ctx.moveTo(x, yy);
          else ctx.lineTo(x, yy);
        }
      }
      ctx.strokeStyle = style;
      ctx.stroke();
    });
    ctx.globalCompositeOperation = 'source-over';
  };

  const drawBlobs = (t) => {
    const colors = ['142, 192, 124', '250, 189, 47', '254, 128, 25']; // Gruvbox aqua, yellow, orange
    ctx.globalCompositeOperation = 'lighter';
    blobs.forEach((b) => {
      const cx = width * (0.5 + 0.35 * Math.sin(t * b.speed + b.phase));
      const cy = height * (0.5 + 0.3 * Math.cos(t * b.speed * 0.8 + b.phase));
      const r = Math.max(width, height) * b.radius;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, `rgba(${colors[b.hue]}, 0.03)`);
      g.addColorStop(1, `rgba(${colors[b.hue]}, 0)`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);
    });
    ctx.globalCompositeOperation = 'source-over';
  };

  const drawRollBar = () => {
    const { y, size } = rollBar;
    const grad = ctx.createLinearGradient(0, y, 0, y + size);
    grad.addColorStop(0, 'rgba(235, 219, 178, 0)');
    grad.addColorStop(0.5, 'rgba(235, 219, 178, 0.05)');
    grad.addColorStop(1, 'rgba(235, 219, 178, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, y, width, size);
  };

  const drawTracking = () => {
    const { y, size, intensity } = tracking;
    // Soft haze behind the streaks
    const haze = ctx.createLinearGradient(0, y, 0, y + size);
    haze.addColorStop(0, 'rgba(235, 219, 178, 0)');
    haze.addColorStop(0.5, `rgba(235, 219, 178, ${0.035 * intensity})`);
    haze.addColorStop(1, 'rgba(235, 219, 178, 0)');
    ctx.fillStyle = haze;
    ctx.fillRect(0, y, width, size);

    // Horizontal static streaks, densest in the middle of the band
    const count = Math.floor((width / 22) * intensity);
    for (let i = 0; i < count; i++) {
      const centered = (Math.random() + Math.random()) / 2; // bias toward middle
      const sy = y + centered * size;
      const sx = Math.random() * width;
      const w = rand(4, 90);
      ctx.fillStyle = Math.random() < 0.8
        ? `rgba(235, 219, 178, ${rand(0.04, 0.18)})`
        : `rgba(0, 0, 0, ${rand(0.2, 0.5)})`;
      ctx.fillRect(sx, sy, w, Math.random() < 0.85 ? 1 : 2);
    }
  };

  const drawGrain = () => {
    const tile = grainTiles[grainIndex];
    // Jitter the tile origin so the pattern never sits still
    const ox = -Math.floor(Math.random() * GRAIN_SIZE);
    const oy = -Math.floor(Math.random() * GRAIN_SIZE);
    ctx.globalAlpha = GRAIN_ALPHA;
    for (let y = oy; y < height; y += GRAIN_SIZE) {
      for (let x = ox; x < width; x += GRAIN_SIZE) {
        ctx.drawImage(tile, x, y);
      }
    }
    ctx.globalAlpha = 1;
  };

  const draw = (now, animated) => {
    const t = now / 1000;
    ctx.clearRect(0, 0, width, height);

    // Glitch envelope: eases in and out over the event's duration
    let strength = 0;
    if (glitch) {
      const p = (now - glitch.start) / glitch.duration;
      if (p >= 1) {
        glitch = null;
        nextGlitch = now + rand(6000, 14000);
      } else {
        strength = Math.sin(Math.PI * p);
      }
    }

    drawBlobs(t);
    if (SHOW_LINES) drawScanlines(t, strength);
    if (!animated) return;

    drawRollBar();
    drawTracking();
    drawGrain();

    // Brightness flicker
    const flicker = Math.random() * 0.012 + strength * 0.015;
    ctx.fillStyle = `rgba(235, 219, 178, ${flicker})`;
    ctx.fillRect(0, 0, width, height);
  };

  const step = (now) => {
    requestAnimationFrame(step);
    if (now - lastDraw < FRAME_MS) return;

    const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.1) : 0;
    lastTime = now;
    lastDraw = now;

    // Semi-random roll speed: pick a new target now and then and ease toward it
    if (now >= nextSpeedChange) {
      targetSpeed = rand(8, 50);
      nextSpeedChange = now + rand(1000, 3500);
    }
    speed += (targetSpeed - speed) * Math.min(dt * 2, 1);
    offset += speed * dt * (glitch ? 1 + 2 * Math.random() : 1);

    // Rolling bar and tracking band wrap from bottom back to top
    rollBar.y += rollBar.speed * dt;
    if (rollBar.y > height) rollBar.y = -rollBar.size;

    tracking.y += tracking.speed * dt + (Math.random() - 0.5) * 2; // slight jitter
    tracking.size = Math.max(20, tracking.size + (Math.random() - 0.5) * 4);
    tracking.size = Math.min(tracking.size, 80);
    tracking.intensity += (1 - tracking.intensity) * Math.min(dt * 1.5, 1);
    if (tracking.y > height) {
      tracking.y = -tracking.size;
      tracking.speed = rand(15, 60);
    }

    if (!glitch && now >= nextGlitch) startGlitch(now);

    grainIndex = (grainIndex + 1) % grainTiles.length;
    draw(now, true);
  };

  window.addEventListener('resize', () => {
    resize();
    if (reducedMotion.matches) draw(0, false);
  });
  resize();
  rollBar.y = rand(-rollBar.size, height);
  tracking.y = rand(height * 0.5, height);

  if (reducedMotion.matches) {
    draw(0, false); // static scanlines only
  } else {
    nextGlitch = performance.now() + rand(1500, 4000);
    requestAnimationFrame(step);
  }
});
