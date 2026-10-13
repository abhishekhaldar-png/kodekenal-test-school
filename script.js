// Footer year
document.querySelectorAll('#year').forEach(el => el.textContent = new Date().getFullYear());

// Mobile menu
const menuToggle = document.getElementById('menuToggle');
const menu = document.getElementById('menu');
if (menuToggle && menu) {
  menuToggle.addEventListener('click', () => {
    menu.classList.toggle('open');
    menuToggle.textContent = menu.classList.contains('open') ? '✕' : '☰';
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    menu.classList.remove('open');
    menuToggle.textContent = '☰';
  }));
}

// Header shadow, back-to-top button, active nav link
const header = document.getElementById('header');
const toTop = document.getElementById('toTop');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (header) header.classList.toggle('scrolled', y > 50);
  if (toTop) toTop.classList.toggle('show', y > 400);

  sections.forEach(sec => {
    const top = sec.offsetTop - 100;
    const link = document.querySelector(`.menu a[href="#${sec.id}"]`);
    if (link) link.classList.toggle('active', y >= top && y < top + sec.offsetHeight);
  });
});

if (toTop) toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Counter animation
const counters = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = +el.dataset.target;
    let current = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = current + '+';
    }, 25);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));

// Reveal on scroll
const revealEls = document.querySelectorAll('.card, .facility, .vm-card, .event, .info, .section-head, .notices');
revealEls.forEach(el => el.classList.add('reveal'));
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

// Testimonial slider
const slides = document.querySelectorAll('.slide');
const dotsWrap = document.getElementById('dots');
let slideIndex = 0;
let slideTimer;

function showSlide(i) {
  slides.forEach((s, idx) => s.classList.toggle('active', idx === i));
  dotsWrap.querySelectorAll('button').forEach((d, idx) => d.classList.toggle('active', idx === i));
  slideIndex = i;
}

function restartSlider() {
  clearInterval(slideTimer);
  slideTimer = setInterval(() => showSlide((slideIndex + 1) % slides.length), 5000);
}

if (slides.length && dotsWrap) {
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Show testimonial ${i + 1}`);
    dot.addEventListener('click', () => { showSlide(i); restartSlider(); });
    dotsWrap.appendChild(dot);
  });
  showSlide(0);
  restartSlider();
}

// Form validation
function validateForm(form, msgEl, successText) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    msgEl.className = 'form-msg';

    form.querySelectorAll('[required]').forEach(field => {
      let ok = field.type === 'checkbox' ? field.checked : field.value.trim() !== '';
      if (ok && field.type === 'email') ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
      if (ok && field.type === 'tel') ok = /^[6-9]\d{9}$/.test(field.value.replace(/\D/g, '').slice(-10));
      field.classList.toggle('invalid', !ok);
      if (!ok) valid = false;
    });

    if (!valid) {
      msgEl.textContent = 'Please fill all required fields correctly.';
      msgEl.classList.add('error');
      return;
    }
    msgEl.textContent = successText;
    msgEl.classList.add('success');
    form.reset();
  });
}

const admissionForm = document.getElementById('admissionForm');
if (admissionForm) validateForm(admissionForm, document.getElementById('admissionMsg'),
  '✅ Thank you! Our admission team will contact you soon.');

const contactForm = document.getElementById('contactForm');
if (contactForm) validateForm(contactForm, document.getElementById('contactMsg'),
  '✅ Message sent successfully! We will reply within 24 hours.');
