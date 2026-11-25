// Aktualizacja wartości i wypełnienia suwaków.
document.querySelectorAll('[data-trait]').forEach((trait) => {
  const slider = trait.querySelector('input[type="range"]');
  const output = trait.querySelector('output');
  if (!slider || !output) return;

  const update = () => {
    const value = Number(slider.value);
    output.textContent = `${value}%`;
    slider.style.setProperty('--value', `${value}%`);
  };

  slider.addEventListener('input', update);
  update();
});

// Delikatne pojawianie się sekcji podczas przewijania.
const sections = document.querySelectorAll('.section-block');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  sections.forEach((section) => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(14px)';
    section.style.transition = 'opacity .7s ease, transform .7s ease';
    observer.observe(section);
  });

  const style = document.createElement('style');
  style.textContent = '.section-block.is-visible{opacity:1!important;transform:translateY(0)!important}';
  document.head.appendChild(style);
}

// Zapis drobnych edycji w przeglądarce, żeby tekst nie znikał po odświeżeniu.
// Dotyczy tylko elementów contenteditable; nie zapisuje haseł ani danych formularzy.
const editableElements = [...document.querySelectorAll('[contenteditable="true"]')];
editableElements.forEach((element, index) => {
  const key = `gothic-profile-edit-${index}`;
  const saved = localStorage.getItem(key);
  if (saved !== null) element.innerHTML = saved;

  element.addEventListener('input', () => {
    localStorage.setItem(key, element.innerHTML);
  });
});


// Zapisywanie pól LVL, Klasa i Subklasa.
document.querySelectorAll('[data-stat]').forEach((field) => {
  const key = `gothic-profile-stat-${field.dataset.stat}`;
  const saved = localStorage.getItem(key);
  if (saved !== null) field.value = saved;
  field.addEventListener('input', () => localStorage.setItem(key, field.value));
});


// Powiększanie zdjęć w galeriach oraz grafik gier.
const lightbox = document.querySelector('#imageLightbox');

if (lightbox) {
  const lightboxImage = lightbox.querySelector('.lightbox-image');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const closeButton = lightbox.querySelector('.lightbox-close');
  let previouslyFocused = null;

  const openLightbox = (image) => {
    if (!image || !image.src) return;
    previouslyFocused = document.activeElement;
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt || 'Powiększona grafika';
    const galleryCaption = image.closest('.gallery-item')?.querySelector('figcaption');
    const gameTitle = image.closest('.game-card')?.querySelector('.game-art b, .game-info h3');
    lightboxCaption.textContent = galleryCaption
      ? galleryCaption.innerText.replace(/\s+/g, ' ').trim()
      : (gameTitle?.innerText.trim() || image.alt || '');
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
    closeButton.focus();
  };

  const closeLightbox = () => {
    if (!lightbox.classList.contains('is-open')) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    lightboxImage.src = '';
    if (previouslyFocused && typeof previouslyFocused.focus === 'function') previouslyFocused.focus();
  };

  document.querySelectorAll('.gallery-item img, .game-art-image').forEach((image) => {
    image.addEventListener('click', () => openLightbox(image));
    image.setAttribute('tabindex', '0');
    image.setAttribute('role', 'button');
    image.setAttribute('aria-label', `${image.alt || 'Grafika'} - kliknij, aby powiększyć`);
    image.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openLightbox(image); }
    });
  });

  closeButton.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (event) => { if (event.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeLightbox(); });
}
