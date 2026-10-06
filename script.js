document.addEventListener('DOMContentLoaded', () => {

  // ─── INIT LUCIDE ICONS ─────────────────────────────────────
  if (window.lucide) {
    lucide.createIcons();
  }

  // ─── TYPING ANIMATION ──────────────────────────────────────
  const typingEl = document.getElementById('typingText');
  const phrases  = [
    'AI-powered tools.',
    'full-stack platforms.',
    'developer experiences.',
    'intelligent systems.',
    'clean, fast software.',
  ];

  let phraseIdx = 0;
  let charIdx   = 0;
  let isDeleting = false;
  let pauseTimer = null;

  function typeLoop() {
    if (!typingEl) return;

    const current = phrases[phraseIdx];

    if (!isDeleting) {
      // Typing forward
      typingEl.textContent = current.slice(0, ++charIdx);

      if (charIdx === current.length) {
        // Pause at full phrase, then start deleting
        isDeleting = true;
        pauseTimer = setTimeout(typeLoop, 1800);
        return;
      }
    } else {
      // Deleting backwards
      typingEl.textContent = current.slice(0, --charIdx);

      if (charIdx === 0) {
        isDeleting  = false;
        phraseIdx   = (phraseIdx + 1) % phrases.length;
        clearTimeout(pauseTimer);
        setTimeout(typeLoop, 300);
        return;
      }
    }

    // Typing speed: faster when deleting
    const speed = isDeleting ? 45 : 80;
    setTimeout(typeLoop, speed);
  }

  // Kick off after a short delay
  setTimeout(typeLoop, 600);

  // ─── SCROLL REVEAL (Intersection Observer) ─────────────────
  const fadeEls = document.querySelectorAll('.fade-up');

  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Unobserve once visible to save resources
          revealObs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  fadeEls.forEach(el => revealObs.observe(el));

  // ─── NAV SCROLL BEHAVIOUR ───────────────────────────────────
  const navWrapper = document.querySelector('.nav-wrapper');

  const handleNavScroll = () => {
    if (window.scrollY > 20) {
      navWrapper.classList.add('scrolled');
    } else {
      navWrapper.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // Run once on load

  // ─── MOBILE MENU ────────────────────────────────────────────
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  const closeMenu = () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
  };

  hamburger?.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    mobileMenu.setAttribute('aria-hidden', !isOpen);
  });

  // Close menu on link click
  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

  // ─── DARK / LIGHT THEME TOGGLE ──────────────────────────────
  const themeToggle = document.getElementById('themeToggle');
  const htmlEl      = document.documentElement;

  // Persist across sessions
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  htmlEl.setAttribute('data-theme', savedTheme);

  themeToggle?.addEventListener('click', () => {
    const current = htmlEl.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    htmlEl.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);

    // Re-init Lucide icons so sun/moon swap renders cleanly
    if (window.lucide) {
      lucide.createIcons();
    }
  });

  // ─── ACTIVE NAV LINK (scroll spy) ───────────────────────────
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const spyObs = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === `#${id}`
            );
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(s => spyObs.observe(s));

  // ─── BACK TO TOP BUTTON ─────────────────────────────────────
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }, { passive: true });

  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ─── CONTACT FORM ────────────────────────────────────────────
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validation
    const fields = contactForm.querySelectorAll('[required]');
    let valid = true;

    fields.forEach(field => {
      field.style.borderColor = '';
      if (!field.value.trim()) {
        field.style.borderColor = '#ff6b6b';
        valid = false;
      }
    });

    if (!valid) return;

    // Simulate send (replace with real backend/EmailJS/Formspree)
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.disabled  = true;
    submitBtn.innerHTML = '<span>Sending…</span>';

    setTimeout(() => {
      contactForm.reset();
      submitBtn.disabled  = false;
      submitBtn.innerHTML = '<i data-lucide="send"></i> Send Message';

      if (formSuccess) {
        formSuccess.hidden = false;
        // Re-init icon
        if (window.lucide) lucide.createIcons();
        // Hide after 5s
        setTimeout(() => { formSuccess.hidden = true; }, 5000);
      }

      if (window.lucide) lucide.createIcons();
    }, 1200);
  });

  // ─── SMOOTH SCROLL for all anchor links ─────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = document.querySelector('.nav-wrapper')?.offsetHeight || 68;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

});

/* ─── ACTIVE NAV LINK STYLE (injected once) ──────────────── */
const style = document.createElement('style');
style.textContent = `
  .nav-link.active {
    color: var(--accent) !important;
  }
  .nav-link.active::after {
    width: 100% !important;
  }
`;
document.head.appendChild(style);