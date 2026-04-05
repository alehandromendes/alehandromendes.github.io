/* ============================================================
   SENTINEL CONSULTORIA — main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* TEMA CLARO / ESCURO */
  const themeToggleBtn = document.getElementById('themeToggle');
  const htmlEl         = document.documentElement;

  function setThemeIcon(theme) {
    themeToggleBtn.innerHTML = theme === 'dark'
      ? '<i data-lucide="moon"></i>'
      : '<i data-lucide="sun"></i>';
    lucide.createIcons({ nodes: [themeToggleBtn] });
  }

  const savedTheme = localStorage.getItem('sentinel-theme') || 'dark';
  htmlEl.setAttribute('data-theme', savedTheme);
  setThemeIcon(savedTheme);

  themeToggleBtn.addEventListener('click', () => {
    const current = htmlEl.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    htmlEl.setAttribute('data-theme', next);
    setThemeIcon(next);
    localStorage.setItem('sentinel-theme', next);
  });

  /* MENU MOBILE */
  const hamburgerBtn = document.getElementById('hamburger');
  const navLinksList = document.getElementById('navLinks');

  hamburgerBtn.addEventListener('click', () => {
    navLinksList.classList.toggle('open');
  });

  navLinksList.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinksList.classList.remove('open'));
  });

  /* NAVBAR SOMBRA */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.style.boxShadow = window.scrollY > 20
      ? '0 4px 24px rgba(0, 0, 0, 0.35)'
      : 'none';
  });

  /* GALERIA SLIDER */
  const track       = document.getElementById('galleryTrack');
  const dotsWrap    = document.getElementById('galleryDots');
  const prevBtn     = document.getElementById('galleryPrev');
  const nextBtn     = document.getElementById('galleryNext');
  const dots        = dotsWrap ? dotsWrap.querySelectorAll('.dot') : [];
  const totalSlides = dots.length;

  let currentSlide  = 0;
  let autoPlayTimer = null;

  function goToSlide(index) {
    currentSlide = (index + totalSlides) % totalSlides;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
  }

  function startAutoPlay() {
    autoPlayTimer = setInterval(() => goToSlide(currentSlide + 1), 5000);
  }

  function stopAutoPlay() {
    clearInterval(autoPlayTimer);
  }

  if (track && totalSlides > 0) {
    prevBtn.addEventListener('click', () => { stopAutoPlay(); goToSlide(currentSlide - 1); startAutoPlay(); });
    nextBtn.addEventListener('click', () => { stopAutoPlay(); goToSlide(currentSlide + 1); startAutoPlay(); });

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        stopAutoPlay();
        goToSlide(parseInt(dot.dataset.index, 10));
        startAutoPlay();
      });
    });

    track.parentElement.addEventListener('mouseenter', stopAutoPlay);
    track.parentElement.addEventListener('mouseleave', startAutoPlay);

    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        stopAutoPlay();
        goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
        startAutoPlay();
      }
    });

    startAutoPlay();
  }

  /* SCROLL REVEAL */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealEls.forEach(el => revealObserver.observe(el));

  /* FORMULÁRIO DE CONTATO */
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn      = contactForm.querySelector('.form-submit');
      const original = btn.innerHTML;
      btn.innerHTML  = '<span>Enviando...</span>';
      btn.disabled   = true;

      // Substitua pelo fetch/AJAX real aqui
      setTimeout(() => {
        btn.innerHTML        = '<span>Mensagem Enviada! ✓</span>';
        btn.style.background = '#1d4ed8';
        setTimeout(() => {
          btn.innerHTML        = original;
          btn.style.background = '';
          btn.disabled         = false;
          contactForm.reset();
        }, 3000);
      }, 1500);
    });
  }

  /* SCROLL SPY */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === '#' + entry.target.id
          );
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(sec => spyObserver.observe(sec));

  /* INICIALIZAR ÍCONES LUCIDE */
  lucide.createIcons();

});
