/* ========================================
   PORTFOLIO INTERACTIONS
   Premium editorial-style animations
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ---- Loading Screen ----
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('hide');
    // Trigger hero animations after loader
    document.querySelectorAll('.hero-content .anim-reveal').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), 200 + i * 150);
    });
  }, 1800);

  // ---- Navbar scroll effect ----
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ---- Mobile menu toggle ----
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ---- Reveal on scroll (IntersectionObserver) ----
  const revealElements = document.querySelectorAll('.anim-reveal:not(.hero-content .anim-reveal)');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
  );

  revealElements.forEach(el => revealObserver.observe(el));

  // ---- Counter Animation (Stats) ----
  const statValues = document.querySelectorAll('.stat-value[data-target]');
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statValues.forEach(el => counterObserver.observe(el));

  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const isDecimal = target % 1 !== 0;
    const duration = 1800;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;

      if (isDecimal) {
        el.textContent = current.toFixed(1);
      } else {
        el.textContent = Math.round(current);
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = isDecimal ? target.toFixed(1) : target;
      }
    }

    requestAnimationFrame(update);
  }

  // ---- Smooth scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ---- Custom Cursor (desktop only) ----
  if (window.matchMedia('(hover: hover)').matches && window.innerWidth > 768) {
    document.body.classList.add('has-custom-cursor');

    const dot = document.createElement('div');
    dot.classList.add('cursor-dot');
    document.body.appendChild(dot);

    const ring = document.createElement('div');
    ring.classList.add('cursor-ring');
    document.body.appendChild(ring);

    let mouseX = -100, mouseY = -100;
    let dotX = -100, dotY = -100;
    let ringX = -100, ringY = -100;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.classList.remove('hidden');
      ring.classList.remove('hidden');
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
      dot.classList.add('hidden');
      ring.classList.add('hidden');
    });

    // Animate positions
    const animate = () => {
      // Dot follows tightly
      dotX += (mouseX - dotX) * 0.25;
      dotY += (mouseY - dotY) * 0.25;
      dot.style.left = `${dotX}px`;
      dot.style.top = `${dotY}px`;

      // Ring follows with lag (elastic feel)
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;

      requestAnimationFrame(animate);
    };
    animate();

    // Hover detection for interactive elements
    const interactiveSelector = 'a, button, [role="button"], .btn-primary, .btn-ghost, .btn-resume, .nav-cta, .case-image-link, .skill, .social-link, .case-link';

    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveSelector)) {
        dot.classList.add('hovering');
        ring.classList.add('hovering');
      }
      // Text cursor for inputs/textareas
      if (e.target.matches('input[type="text"], input[type="email"], textarea')) {
        dot.classList.add('text-hover');
        ring.classList.add('text-hover');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveSelector)) {
        dot.classList.remove('hovering');
        ring.classList.remove('hovering');
      }
      if (e.target.matches('input[type="text"], input[type="email"], textarea')) {
        dot.classList.remove('text-hover');
        ring.classList.remove('text-hover');
      }
    });

    // Click squeeze
    document.addEventListener('mousedown', () => ring.classList.add('clicking'));
    document.addEventListener('mouseup', () => ring.classList.remove('clicking'));
  }

  // ---- Parallax glow on hero mouse move ----
  const hero = document.getElementById('hero');
  const glow1 = document.querySelector('.hero-gradient--1');
  const glow2 = document.querySelector('.hero-gradient--2');

  if (hero && glow1 && glow2) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      glow1.style.transform = `translate(${x * 50}px, ${y * 50}px)`;
      glow2.style.transform = `translate(${x * -35}px, ${y * -35}px)`;
    });
  }



  // ---- Tilt effect on carousels ----
  document.querySelectorAll('.case-carousel').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transition = 'border-color 0.4s';
      el.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${y * -6}deg)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transition = 'border-color 0.4s, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      el.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg)';
    });
  });

  // ---- Tilt effect on about cards ----
  document.querySelectorAll('.about-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transition = 'border-color 0.35s, background 0.35s';
      card.style.transform = `perspective(600px) rotateY(${x * 10}deg) rotateX(${y * -10}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'border-color 0.35s, background 0.35s, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      card.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg) translateY(0)';
    });
  });

  // ---- Contact section curtain reveal on scroll ----
  const contactSection = document.getElementById('contact');
  const contactCurtain = document.getElementById('contactCurtain');

  if (contactSection && contactCurtain) {
    let ticking = false;

    function updateCurtain() {
      const rect = contactSection.getBoundingClientRect();
      const windowH = window.innerHeight;
      const sectionH = rect.height;

      // Start revealing when section enters viewport from bottom
      // Progress: 0 = section just entering, 1 = fully revealed
      if (rect.top < windowH && rect.bottom > 0) {
        // How far the section top has traveled into the viewport
        const traveled = windowH - rect.top;
        // Reveal over the first 60% of scroll through the section
        const revealDistance = sectionH * 0.6;
        const progress = Math.min(Math.max(traveled / revealDistance, 0), 1);

        // Translate curtain upward
        contactCurtain.style.transform = `translateY(-${progress * 100}%)`;
      } else if (rect.top >= windowH) {
        // Section below viewport — curtain fully covers
        contactCurtain.style.transform = 'translateY(0)';
      } else {
        // Section above viewport — curtain fully gone
        contactCurtain.style.transform = 'translateY(-100%)';
      }
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateCurtain);
        ticking = true;
      }
    }, { passive: true });

    // Initial check
    updateCurtain();
  }

  // ---- Show/hide scroll cue based on hero visibility ----
  const scrollCue = document.getElementById('scrollCue');
  if (scrollCue) {
    const heroEl = document.getElementById('hero');
    const cueObserver = new IntersectionObserver(
      ([entry]) => {
        scrollCue.style.opacity = entry.isIntersecting ? '1' : '0';
      },
      { threshold: 0.6 }
    );
    scrollCue.style.transition = 'opacity 0.5s';
    cueObserver.observe(heroEl);
  }

  // ---- About cards stagger animation ----
  const aboutCards = document.querySelectorAll('.about-card');
  const aboutObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const cards = entry.target.closest('.about-card-grid')?.querySelectorAll('.about-card');
          if (cards) {
            cards.forEach((card, index) => {
              setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
              }, index * 100);
            });
          }
          aboutObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  aboutCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(24px)';
    card.style.transition = 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
    aboutObserver.observe(card);
  });
});
