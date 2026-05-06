document.addEventListener('DOMContentLoaded', function () {
  const modal = document.querySelector('.project-modal');
  const modalTitle = modal.querySelector('.project-modal-title');
  const modalSubtitle = modal.querySelector('.project-modal-subtitle');
  const modalDate = modal.querySelector('.project-modal-date');
  const modalDescription = modal.querySelector('.project-modal-description');
  const modalLink = modal.querySelector('.project-modal-link');
  const modalImage = modal.querySelector('.project-modal-image');
  const closeButtons = modal.querySelectorAll('[data-modal-close], .project-modal-close');

  async function openModal(card, href) {
    const title = card.querySelector('h3').innerText;
    const subtitle = card.querySelector('.item-subtitle').innerText;
    const date = card.querySelector('.item-header span').innerText;
    
    const detailsElement = card.querySelector('.experience-details');
    let description = detailsElement?.innerHTML || '';

    // If the element has an external content URL, fetch it
    const contentUrl = detailsElement?.getAttribute('data-content-url');
    if (contentUrl) {
      modalDescription.innerHTML = '<p>Loading content...</p>';
      try {
        const response = await fetch(contentUrl);
        if (response.ok) {
          description = await response.text();
        } else {
          description = '<p>Error: Could not load the external content.</p>';
        }
      } catch (error) {
        description = '<p>Error: A network error occurred while loading content.</p>';
      }
    }

    const cardImage = card.querySelector('.project-image');
    if (cardImage) {
      modalImage.src = cardImage.src;
      modalImage.alt = cardImage.alt;
      modalImage.style.display = 'block';
    } else {
      modalImage.style.display = 'none';
    }

    modalTitle.textContent = title;
    modalSubtitle.textContent = subtitle;
    modalDate.textContent = date;
    modalDescription.innerHTML = description;
    if (modalLink) {
      if (href && href !== '#') {
        modalLink.href = href;
        modalLink.parentElement.style.display = 'flex';
      } else {
        modalLink.parentElement.style.display = 'none';
      }
    }
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

  document.querySelectorAll('.experience-card .project-image, .experience-card .item-header h3 a').forEach(function (element) {
    element.addEventListener('click', async function (event) {
      event.preventDefault();
      const card = event.target.closest('.experience-card');
      const link = card.querySelector('.item-header h3 a');
      await openModal(card, link ? link.getAttribute('href') : '#');
    });
  });

  closeButtons.forEach(function (button) {
    button.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
});
