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
