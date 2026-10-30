/**
 * FLOWVERSE LANDING PAGE — MAIN INTERACTIVE ENGINE
 * Lightweight vanilla JavaScript with 60fps animations & accessibility
 */

document.addEventListener('DOMContentLoaded', () => {
  // Respect user preference for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ==========================================================================
     1. LOADING INTRO DISMISSAL
     ========================================================================== */
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    const dismissLoading = () => {
      loadingScreen.classList.add('dismissed');
      setTimeout(() => {
        loadingScreen.remove();
      }, 700);
    };

    if (prefersReducedMotion) {
      dismissLoading();
    } else {
      // Auto dismiss after 1.2s or on immediate interaction
      const timer = setTimeout(dismissLoading, 1200);
      window.addEventListener('keydown', () => { clearTimeout(timer); dismissLoading(); }, { once: true });
      window.addEventListener('pointerdown', () => { clearTimeout(timer); dismissLoading(); }, { once: true });
    }
  }

  /* ==========================================================================
     2. SCROLL PROGRESS BAR & STICKY NAV BLUR
     ========================================================================== */
  const scrollProgress = document.getElementById('scroll-progress');
  const siteNav = document.getElementById('site-nav');
  const backToTopBtn = document.getElementById('back-to-top');

  const onScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progressPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (scrollProgress) {
      scrollProgress.style.width = `${progressPercent}%`;
    }

    if (siteNav) {
      if (scrollTop > 24) {
        siteNav.classList.add('scrolled');
      } else {
        siteNav.classList.remove('scrolled');
      }
    }

    if (backToTopBtn) {
      if (scrollTop > 450) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ==========================================================================
     3. DESKTOP POINTER GLOW & CARD SPOTLIGHT
     ========================================================================== */
  const cursorGlow = document.getElementById('cursor-glow');

  if (isFinePointer) {
    let mouseX = -1000;
    let mouseY = -1000;

    window.addEventListener('pointermove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (cursorGlow) {
        cursorGlow.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      }
    }, { passive: true });

    // Track pointer inside spotlight cards
    const spotlightCards = document.querySelectorAll('.glass-card, .feature-card, .step-card, .problem-card, .roadmap-phase-card');
    spotlightCards.forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      }, { passive: true });
    });

    // 3D Tilt on Feature Cards
    const tiltCards = document.querySelectorAll('.feature-card');
    tiltCards.forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        if (prefersReducedMotion) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('pointerleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      });
    });

    // Magnetic pull on primary buttons
    const magneticBtns = document.querySelectorAll('.btn-primary');
    magneticBtns.forEach((btn) => {
      btn.addEventListener('pointermove', (e) => {
        if (prefersReducedMotion) return;
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px) translateY(-2px)`;
      });

      btn.addEventListener('pointerleave', () => {
        btn.style.transform = 'translate(0px, 0px) translateY(0)';
      });
    });
  }

  /* ==========================================================================
     4. SCROLL REVEALS & INTERSECTION OBSERVER
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('is-visible'));
  }

  /* ==========================================================================
     5. SCROLLSPY (NAVBAR & DESKTOP DOTS)
     ========================================================================== */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const dotLinks = document.querySelectorAll('.scroll-dot-link');

  const highlightNav = () => {
    let currentId = '';
    const scrollPos = window.scrollY + 180;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === `#${currentId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    dotLinks.forEach((dot) => {
      const href = dot.getAttribute('href');
      if (href === `#${currentId}`) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav();

  /* ==========================================================================
     6. INTERACTIVE TIMETOU DEMO (PREVIEW STATE MACHINE)
     ========================================================================== */
  const demoServiceItems = document.querySelectorAll('.demo-service-item');
  const demoDateBtns = document.querySelectorAll('.demo-date-btn');
  const demoSlotBtns = document.querySelectorAll('.demo-slot-btn');
  const demoSubmitBtn = document.getElementById('demo-submit-btn');
  const demoBookingView = document.getElementById('demo-booking-view');
  const demoConfirmView = document.getElementById('demo-confirm-view');
  const demoResetBtn = document.getElementById('demo-reset-btn');

  const demoSummaryService = document.getElementById('demo-summary-service');
  const demoSummaryDateTime = document.getElementById('demo-summary-datetime');

  let selectedService = 'Signature Haircut & Style (₹350)';
  let selectedDate = 'Today, 24 Oct';
  let selectedTime = '10:30 AM';

  demoServiceItems.forEach((item) => {
    item.addEventListener('click', () => {
      demoServiceItems.forEach((i) => i.classList.remove('selected'));
      item.classList.add('selected');
      selectedService = item.getAttribute('data-service-name') || item.querySelector('.demo-service-title').textContent;
    });
  });

  demoDateBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      demoDateBtns.forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');
      const day = btn.querySelector('.demo-date-day').textContent;
      const num = btn.querySelector('.demo-date-num').textContent;
      selectedDate = `${day}, ${num} Oct`;
    });
  });

  demoSlotBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      demoSlotBtns.forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedTime = btn.textContent.trim();
    });
  });

  if (demoSubmitBtn && demoBookingView && demoConfirmView) {
    demoSubmitBtn.addEventListener('click', () => {
      demoSubmitBtn.disabled = true;
      demoSubmitBtn.textContent = 'Processing request...';

      setTimeout(() => {
        if (demoSummaryService) demoSummaryService.textContent = selectedService;
        if (demoSummaryDateTime) demoSummaryDateTime.textContent = `${selectedDate} at ${selectedTime}`;

        demoBookingView.style.display = 'none';
        demoConfirmView.style.display = 'block';
        demoSubmitBtn.disabled = false;
        demoSubmitBtn.textContent = 'Request appointment';
      }, 500);
    });
  }

  if (demoResetBtn && demoBookingView && demoConfirmView) {
    demoResetBtn.addEventListener('click', () => {
      demoConfirmView.style.display = 'none';
      demoBookingView.style.display = 'block';
    });
  }

  /* ==========================================================================
     7. CUSTOMER / PROVIDER TOGGLE (HOW IT WORKS)
     ========================================================================== */
  const toggleContainer = document.getElementById('flow-toggle-container');
  const toggleCustomerBtn = document.getElementById('toggle-customer');
  const toggleProviderBtn = document.getElementById('toggle-provider');
  const customerView = document.getElementById('flow-view-customers');
  const providerView = document.getElementById('flow-view-providers');
  const lineFill = document.getElementById('steps-connecting-fill');

  const setFlowMode = (mode) => {
    if (mode === 'provider') {
      toggleContainer.classList.add('provider-active');
      toggleCustomerBtn.classList.remove('active');
      toggleProviderBtn.classList.add('active');
      toggleCustomerBtn.setAttribute('aria-selected', 'false');
      toggleProviderBtn.setAttribute('aria-selected', 'true');

      if (customerView && providerView) {
        customerView.classList.add('hidden');
        providerView.classList.remove('hidden');
      }
      if (lineFill) lineFill.style.width = '100%';
    } else {
      toggleContainer.classList.remove('provider-active');
      toggleCustomerBtn.classList.add('active');
      toggleProviderBtn.classList.remove('active');
      toggleCustomerBtn.setAttribute('aria-selected', 'true');
      toggleProviderBtn.setAttribute('aria-selected', 'false');

      if (customerView && providerView) {
        providerView.classList.add('hidden');
        customerView.classList.remove('hidden');
      }
      if (lineFill) lineFill.style.width = '100%';
    }
  };

  if (toggleCustomerBtn && toggleProviderBtn) {
    toggleCustomerBtn.addEventListener('click', () => setFlowMode('customer'));
    toggleProviderBtn.addEventListener('click', () => setFlowMode('provider'));
  }

  // Trigger self-drawing line when How It Works enters viewport
  const howItWorksSection = document.getElementById('how-it-works');
  if (howItWorksSection && lineFill && 'IntersectionObserver' in window) {
    const lineObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          lineFill.style.width = '100%';
        }
      });
    }, { threshold: 0.3 });
    lineObserver.observe(howItWorksSection);
  }

  /* ==========================================================================
     8. EXPANDABLE FEATURE CARDS
     ========================================================================== */
  const featureCards = document.querySelectorAll('.feature-card');

  featureCards.forEach((card) => {
    card.addEventListener('click', (e) => {
      // Toggle expansion
      const isExpanded = card.classList.contains('expanded');

      // Close all others for single-open elegance
      featureCards.forEach((c) => {
        c.classList.remove('expanded');
        const btn = c.querySelector('.feature-expand-btn');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });

      if (!isExpanded) {
        card.classList.add('expanded');
        const btn = card.querySelector('.feature-expand-btn');
        if (btn) btn.setAttribute('aria-expanded', 'true');
      }
    });

    // Keyboard support (Enter/Space on expand button)
    const expandBtn = card.querySelector('.feature-expand-btn');
    if (expandBtn) {
      expandBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    }
  });

  /* ==========================================================================
     9. ROADMAP PHASE TIMELINE INTERACTION
     ========================================================================== */
  const roadmapCards = document.querySelectorAll('.roadmap-phase-card');
  const roadmapFill = document.getElementById('roadmap-connector-fill');

  roadmapCards.forEach((card, index) => {
    card.addEventListener('click', () => {
      roadmapCards.forEach((c) => c.classList.remove('active'));
      card.classList.add('active');

      if (roadmapFill) {
        if (index === 0) roadmapFill.style.width = '33%';
        else if (index === 1) roadmapFill.style.width = '66%';
        else roadmapFill.style.width = '100%';
      }
    });
  });

  /* ==========================================================================
     10. FAQ ACCORDION
     ========================================================================== */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      // Don't toggle if clicking on an interactive link inside the answer
      if (e.target.tagName === 'A') return;

      const isActive = item.classList.contains('active');

      // Close other items for refined single-open feel
      faqItems.forEach((other) => {
        other.classList.remove('active');
        const btn = other.querySelector('.faq-question-btn');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        item.classList.add('active');
        const btn = item.querySelector('.faq-question-btn');
        if (btn) btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ==========================================================================
     11. CONTACT FORM VALIDATION & DELIGHTFUL CONFETTI
     ========================================================================== */
  const contactForm = document.getElementById('early-provider-form');
  const formSubmitBtn = document.getElementById('form-submit-btn');
  const formSuccessBanner = document.getElementById('form-success-banner');
  const confettiCanvas = document.getElementById('confetti-canvas');

  // Input fields
  const nameInput = document.getElementById('contact-name');
  const businessInput = document.getElementById('contact-business');
  const localityInput = document.getElementById('contact-locality');
  const serviceInput = document.getElementById('contact-service');
  const contactInfoInput = document.getElementById('contact-info');
  const messageInput = document.getElementById('contact-message');

  const validateEmailOrPhone = (val) => {
    const clean = val.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    return emailRegex.test(clean) || phoneRegex.test(clean.replace(/\s+/g, ''));
  };

  const setFieldError = (input, msg) => {
    input.classList.add('invalid');
    const group = input.closest('.form-group');
    if (group) {
      let err = group.querySelector('.field-error-msg');
      if (!err) {
        err = document.createElement('span');
        err.className = 'field-error-msg';
        group.appendChild(err);
      }
      err.textContent = msg;
    }
  };

  const clearFieldError = (input) => {
    input.classList.remove('invalid');
    const group = input.closest('.form-group');
    if (group) {
      const err = group.querySelector('.field-error-msg');
      if (err) err.remove();
    }
  };

  [nameInput, businessInput, localityInput, serviceInput, contactInfoInput].forEach((input) => {
    if (input) {
      input.addEventListener('input', () => clearFieldError(input));
      input.addEventListener('blur', () => {
        if (!input.value.trim() && input.hasAttribute('required')) {
          setFieldError(input, 'This field is required');
        } else if (input === contactInfoInput && !validateEmailOrPhone(input.value)) {
          setFieldError(input, 'Please enter a valid email or phone number');
        }
      });
    }
  });

  // Confetti Particle System
  const burstConfetti = () => {
    if (!confettiCanvas) return;
    const ctx = confettiCanvas.getContext('2d');
    const width = confettiCanvas.width = confettiCanvas.offsetWidth;
    const height = confettiCanvas.height = confettiCanvas.offsetHeight;

    const colors = ['#27C4FF', '#2D7BFF', '#7A4DFF', '#3D5AFE', '#2EE6A6', '#FFFFFF'];
    const particles = [];

    for (let i = 0; i < 70; i++) {
      particles.push({
        x: width / 2,
        y: height / 2,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.7) * 16,
        size: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rSpeed: (Math.random() - 0.5) * 10,
        alpha: 1,
        decay: Math.random() * 0.015 + 0.01
      });
    }

    const animateParticles = () => {
      ctx.clearRect(0, 0, width, height);
      let alive = false;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // gravity
        p.rotation += p.rSpeed;
        p.alpha -= p.decay;

        if (p.alpha > 0) {
          alive = true;
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5);
          ctx.restore();
        }
      });

      if (alive) {
        requestAnimationFrame(animateParticles);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    };

    requestAnimationFrame(animateParticles);
  };

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      if (!nameInput.value.trim()) {
        setFieldError(nameInput, 'Please share your name');
        isValid = false;
      }
      if (!businessInput.value.trim()) {
        setFieldError(businessInput, 'Please enter your salon or parlour name');
        isValid = false;
      }
      if (!localityInput.value.trim()) {
        setFieldError(localityInput, 'Please select your Chennai neighborhood');
        isValid = false;
      }
      if (!serviceInput.value.trim()) {
        setFieldError(serviceInput, 'Please choose a primary service');
        isValid = false;
      }
      if (!validateEmailOrPhone(contactInfoInput.value)) {
        setFieldError(contactInfoInput, 'Please provide a valid phone number or email');
        isValid = false;
      }

      if (!isValid) return;

      // Submission animation
      formSubmitBtn.classList.add('loading');
      formSubmitBtn.disabled = true;

      setTimeout(() => {
        formSubmitBtn.classList.remove('loading');
        formSubmitBtn.style.display = 'none';
        if (formSuccessBanner) {
          formSuccessBanner.style.display = 'block';
        }
        burstConfetti();
      }, 1100);
    });
  }

  /* ==========================================================================
     12. MOBILE HAMBURGER MENU DRAWER
     ========================================================================== */
  const mobileToggle = document.getElementById('mobile-nav-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-drawer .btn');

  const toggleMobileMenu = (forceState) => {
    const isOpen = typeof forceState === 'boolean' ? forceState : !mobileDrawer.classList.contains('open');
    if (isOpen) {
      mobileDrawer.classList.add('open');
      mobileToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    } else {
      mobileDrawer.classList.remove('open');
      mobileToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  };

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => toggleMobileMenu());

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => toggleMobileMenu(false));
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        toggleMobileMenu(false);
      }
    });
  }

  /* ==========================================================================
     13. SMOOTH ANCHOR SCROLLING WITH OFFSET
     ========================================================================== */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '#!') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});
