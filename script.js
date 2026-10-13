/**
 * PORTFOLIO - JAKUB ANDERS
 * Vanilla JavaScript pro dynamické efekty, navigaci a interakce
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. ZÁKLADNÍ ELEMENTY
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinksList = document.getElementById('navLinks');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const contactForm = document.getElementById('portfolioContactForm');
  const formStatus = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');

  // 2. STICKY HLAVIČKA PŘI SCROLLOVÁNÍ
  const handleHeaderScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll(); // Inicializace při načtení

  // 3. MOBILNÍ HAMBURGER MENU
  if (mobileToggle && navLinksList) {
    const toggleMenu = (forceClose = false) => {
      const isOpen = forceClose ? false : !navLinksList.classList.contains('active');
      mobileToggle.classList.toggle('active', isOpen);
      navLinksList.classList.toggle('active', isOpen);
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    mobileToggle.addEventListener('click', () => toggleMenu());

    // Zavření menu po kliknutí na libovolný navigační odkaz
    navLinks.forEach(link => {
      link.addEventListener('click', () => toggleMenu(true));
    });

    // Zavření kliknutím mimo menu na mobilu
    document.addEventListener('click', (event) => {
      if (
        navLinksList.classList.contains('active') &&
        !navLinksList.contains(event.target) &&
        !mobileToggle.contains(event.target)
      ) {
        toggleMenu(true);
      }
    });
  }

  // 4. SCROLLSPY - AKTIVNÍ ODKAZ V NAVIGACI PODLE VIDITELNÉ SEKCE
  const scrollSpyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  });

  sections.forEach(section => scrollSpyObserver.observe(section));

  // 5. SCROLL-REVEAL ANIMACE (POSTUPNÉ VZPLYNUTÍ PRVKŮ)
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target); // Animovat pouze jednou
      }
    });
  }, {
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // 6. KONTAKTNÍ FORMULÁŘ - INTERAKTIVNÍ VALIDACE A FEEDBACK
  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('userName');
      const emailInput = document.getElementById('userEmail');
      const messageInput = document.getElementById('userMessage');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';

      // Jednoduchá validace
      if (!name || !email || !message) {
        formStatus.textContent = 'Prosím, vyplňte všechna povinná pole (Jméno, E-mail a Zpráva).';
        formStatus.className = 'form-status-msg error';
        return;
      }

      // Validace formátu e-mailu
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        formStatus.textContent = 'Prosím, zadejte platnou e-mailovou adresu.';
        formStatus.className = 'form-status-msg error';
        return;
      }

      // Vizuální simulace odesílání
      const originalBtnHtml = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Odesílám zprávu...</span>';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;

        // Úspěšná zpráva
        formStatus.textContent = `Děkuji za zprávu, ${name}! Váš dotaz byl úspěšně zaznamenán. Jakub Anders se vám brzy ozve zpět.`;
        formStatus.className = 'form-status-msg success';

        contactForm.reset();

        // Skrytí potvrzení po 8 sekundách
        setTimeout(() => {
          formStatus.className = 'form-status-msg';
        }, 8000);
      }, 700);
    });
  }
});
