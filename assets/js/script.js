
/* ── Theme Toggle ── */
const toggleBtn = document.getElementById('toggle-theme');
let isDark = false;
toggleBtn.addEventListener('click', () => {
  isDark = !isDark;
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  toggleBtn.textContent = isDark ? '☀️' : '🌙';
});



/* ── Mobile Menu ── */
const burger = document.getElementById('nav-burger');
const menu = document.getElementById('nav-menu');
burger.addEventListener('click', () => menu.classList.toggle('open'));
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));

/* ── Nav scroll state ── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── Reveal on scroll ── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); observer.unobserve(e.target); } });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ── Horizontal drag-scroll (Story / Journey / Projects tracks) ── */
function enableDragScroll(id) {
  const scroller = document.getElementById(id);
  if (!scroller) return;
  let isDown = false, startX, scrollLeft;
  scroller.addEventListener('mousedown', e => {
    isDown = true; scroller.style.cursor = 'grabbing';
    startX = e.pageX - scroller.offsetLeft;
    scrollLeft = scroller.scrollLeft;
  });
  scroller.addEventListener('mouseleave', () => { isDown = false; scroller.style.cursor = 'grab'; });
  scroller.addEventListener('mouseup', () => { isDown = false; scroller.style.cursor = 'grab'; });
  scroller.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - scroller.offsetLeft;
    scroller.scrollLeft = scrollLeft - (x - startX) * 1.4;
  });
}
['story-scroll', 'journey-scroll', 'projects-scroll'].forEach(enableDragScroll);

/* ── Active nav link ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a');
const onScroll = () => {
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 140) current = s.id; });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--gold)' : '';
  });
};
window.addEventListener('scroll', onScroll, { passive: true });

/* ── Contact form ── */
function sendForm() {
  const name = document.getElementById('cf-name').value.trim();
  const email = document.getElementById('cf-email').value.trim();
  if (!name || !email) { alert('Please fill in your name and email to continue.'); return; }
  // Wire to Formspree: fetch('https://formspree.io/f/YOUR_ID', { method:'POST', body: new FormData(document.querySelector('form')) })
  document.getElementById('form-success').style.display = 'flex';
  ['cf-name','cf-email','cf-org','cf-context','cf-msg'].forEach(id => document.getElementById(id).value = '');
}

/* ════════════════════════════════════
   3D DEPTH EFFECTS
════════════════════════════════════ */
const isTouch = window.matchMedia('(hover: none)').matches || window.innerWidth <= 768;

if (!isTouch) {
  /* — Hero photo 3D mouse-tracking tilt — */
  const heroSection = document.getElementById('hero');
  const hero3d = document.getElementById('hero-3d');
  if (heroSection && hero3d) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const rotateY = x * 10;
      const rotateX = y * -8;
      hero3d.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
    });
    heroSection.addEventListener('mouseleave', () => {
      hero3d.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });
  }

  /* — Generic tilt-on-hover for cards — */
  const tiltEls = document.querySelectorAll('.tilt');
  tiltEls.forEach(el => {
    let rafId = null;
    el.addEventListener('mousemove', (e) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const rotateY = x * 8;
        const rotateX = y * -8;
        el.style.transform = `perspective(900px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) translateY(-4px) translateZ(10px)`;
        rafId = null;
      });
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg) translateY(0) translateZ(0)';
    });
  });

  /* — Project image subtle tilt on hover — */
  document.querySelectorAll('.project-img').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(1000px) rotateY(${x * 6}deg) rotateX(${y * -6}deg)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
    });
  });

  /* — Story photo stack tilt — */
  const storyStack = document.querySelector('.story-photo-stack');
  if (storyStack) {
    const storyMain = storyStack.querySelector('.story-photo-main');
    storyStack.addEventListener('mousemove', (e) => {
      const rect = storyStack.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      storyMain.style.transform = `rotateY(${x * 10}deg) rotateX(${y * -8}deg)`;
    });
    storyStack.addEventListener('mouseleave', () => {
      storyMain.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });
  }
}

/* — Subtle scroll parallax on hero radial / background (works on all devices) — */
const heroRight = document.querySelector('.hero-right');
window.addEventListener('scroll', () => {
  if (!heroRight) return;
  const scrolled = window.scrollY;
  if (scrolled < window.innerHeight) {
    heroRight.style.transform = `translateY(${scrolled * 0.15}px)`;
  }
}, { passive: true });


/* ==========================================
   Scroll To Top
========================================== */

const scrollTopBtn = document.getElementById("scrollTopBtn");

window.addEventListener("scroll", () => {

    if (window.scrollY > 400) {
        scrollTopBtn.classList.add("show");
    } else {
        scrollTopBtn.classList.remove("show");
    }

});

scrollTopBtn.addEventListener("click", () => {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});