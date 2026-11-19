/* INTERACCIONES.JS — menú, submenús, audio global, video y ventana modal */

document.addEventListener('DOMContentLoaded', () => {
  // ===== AUDIO GLOBAL =====
  // El navegador exige una interacción del usuario antes de iniciar audio.
  const audio = document.createElement('audio');
  audio.id = 'site-background-audio';
  audio.preload = 'metadata';
  audio.loop = true;
  audio.src = 'audio/fondo-relajante.mp3';
  audio.setAttribute('aria-hidden', 'true');
  document.body.appendChild(audio);

  const audioButton = document.createElement('button');
  audioButton.type = 'button';
  audioButton.className = 'site-audio-control';
  audioButton.setAttribute('aria-label', 'Reproducir audio ambiental');
  audioButton.setAttribute('aria-pressed', 'false');
  audioButton.innerHTML = '<span class="site-audio-icon" aria-hidden="true">▶</span><span class="site-audio-label">Audio</span>';
  document.body.appendChild(audioButton);

  const icon = audioButton.querySelector('.site-audio-icon');
  const label = audioButton.querySelector('.site-audio-label');

  function updateAudioButton() {
    const playing = !audio.paused;
    audioButton.setAttribute('aria-pressed', String(playing));
    audioButton.setAttribute('aria-label', playing ? 'Pausar audio ambiental' : 'Reproducir audio ambiental');
    icon.textContent = playing ? 'Ⅱ' : '▶';
    label.textContent = playing ? 'Pausar' : 'Audio';
  }

  audioButton.addEventListener('click', async () => {
    try {
      if (audio.paused) {
        await audio.play();
      } else {
        audio.pause();
      }
    } catch (error) {
      audioButton.setAttribute('title', 'Haz clic nuevamente para reproducir el audio');
    }
    updateAudioButton();
  });

  audio.addEventListener('play', updateAudioButton);
  audio.addEventListener('pause', updateAudioButton);
  updateAudioButton();

  // ===== MICROINTERACCIONES DE LA PÁGINA PRINCIPAL =====
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.addEventListener('pointermove', (event) => {
      const rect = hero.getBoundingClientRect();
      hero.style.setProperty('--mx', `${event.clientX - rect.left}px`);
      hero.style.setProperty('--my', `${event.clientY - rect.top}px`);
    });

    hero.addEventListener('pointerleave', () => {
      hero.style.setProperty('--mx', '50%');
      hero.style.setProperty('--my', '42%');
    });
  }

  const revealItems = document.querySelectorAll('.content');
  if ('IntersectionObserver' in window && revealItems.length) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  // ===== MOVIMIENTO COMPARTIDO EN TODAS LAS PÁGINAS =====
  const motionLayer = document.createElement('div');
  motionLayer.className = 'site-motion-layer';
  motionLayer.setAttribute('aria-hidden', 'true');
  document.body.appendChild(motionLayer);

  const revealTargets = document.querySelectorAll(
    'main > section:not(.hero), .page-header, .content, .experience-block, .contact-card, .info-layout > *, .grupo1, .grupo2, .profile, .info-topic, .manifestation-grid > article, .situations-grid > article, .actions-grid > article'
  );

  revealTargets.forEach((target, index) => {
    target.classList.add('motion-reveal');
    target.style.transitionDelay = `${Math.min(index * 45, 240)}ms`;
  });

  if ('IntersectionObserver' in window && revealTargets.length) {
    const motionObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealTargets.forEach((target) => motionObserver.observe(target));
  } else {
    revealTargets.forEach((target) => target.classList.add('is-visible'));
  }

  const tiltTargets = document.querySelectorAll('.contact-card, .info-topic, .profile, .air-wrap, .video-box, .experience-block img');
  tiltTargets.forEach((target) => {
    target.classList.add('motion-tilt');
    target.addEventListener('pointermove', (event) => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const rect = target.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      target.classList.add('is-tilting');
      target.style.transform = `perspective(700px) rotateX(${(-y * 2.2).toFixed(2)}deg) rotateY(${(x * 2.2).toFixed(2)}deg) translateY(-2px)`;
    });
    target.addEventListener('pointerleave', () => {
      target.classList.remove('is-tilting');
      target.style.transform = '';
    });
  });

  document.addEventListener('pointermove', (event) => {
    const x = `${Math.round((event.clientX / window.innerWidth) * 100)}%`;
    const y = `${Math.round((event.clientY / window.innerHeight) * 100)}%`;
    motionLayer.style.setProperty('--motion-x', x);
    motionLayer.style.setProperty('--motion-y', y);
  }, { passive: true });

  // ===== MENÚ RESPONSIVE Y SUBMENÚS =====
  const menuButton = document.querySelector('.menu-button');
  const navigation = document.querySelector('nav');

  if (menuButton && navigation) {
    menuButton.addEventListener('click', () => {
      navigation.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('.has-submenu > a').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (window.innerWidth <= 620) {
        event.preventDefault();
        link.parentElement.classList.toggle('open');
      }
    });
  });

  // ===== VIDEO DE LA PÁGINA DE INICIO =====
  const video = document.querySelector('.video-box video');
  const videoButton = document.querySelector('.video-play');

  if (video && videoButton) {
    videoButton.addEventListener('click', () => {
      if (video.paused) {
        video.play();
        videoButton.innerHTML = 'Pausar video <span>Ⅱ</span>';
      } else {
        video.pause();
        videoButton.innerHTML = 'Reproducir video <span>▶</span>';
      }
    });
  }

  // ===== VENTANA DE LECTURA DE EXPERIENCIAS =====
  const modal = document.querySelector('#experience-modal');
  const modalTitle = document.querySelector('#modal-title');
  const modalText = document.querySelector('#modal-text');
  const modalClose = document.querySelector('.modal-close');

  if (!modal || !modalTitle || !modalText || !modalClose) return;

  function openExperience(copy) {
    modalTitle.textContent = copy.querySelector('h2').textContent.replace(/\s+/g, ' ').trim();
    modalText.textContent = copy.dataset.full || copy.querySelector('p:not(.eyebrow)').textContent;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    modalClose.focus();
  }

  function closeExperience() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

  document.querySelectorAll('.experience-trigger').forEach((copy) => {
    copy.addEventListener('click', (event) => {
      if (!event.target.closest('a')) openExperience(copy);
    });

    copy.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openExperience(copy);
      }
    });
  });

  document.querySelectorAll('[data-close-modal]').forEach((element) => {
    element.addEventListener('click', closeExperience);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) {
      closeExperience();
    }
  });
});
