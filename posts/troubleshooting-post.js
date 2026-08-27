const sections = [...document.querySelectorAll('.section[id]')];
const navLinks = [...document.querySelectorAll('.tab-nav a')];

function updateActiveSection() {
  const threshold = 140;
  let current = sections[0]?.id;

  sections.forEach((section) => {
    if (section.getBoundingClientRect().top <= threshold) current = section.id;
  });

  navLinks.forEach((link) => {
    link.classList.toggle('active', link.dataset.section === current);
  });
}

document.addEventListener('scroll', updateActiveSection, { passive: true });
updateActiveSection();

