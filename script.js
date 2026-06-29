window.addEventListener('load', () => {
  if (window.gsap) {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // 1. 배경 먼저 페이드인
    tl.from('.bg-img', { opacity: 0, duration: 0.8, stagger: 0.08 });
    // 2. 네브바
    tl.from('.navbar', { y: -40, opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.5');
    // 3. 왼팀 먼저 (Ekko + Vi 동시)
    tl.from('.ekko-img', { x: -100, opacity: 0, duration: 1.0, ease: 'power2.out' }, '-=0.3');
    tl.from('.vi-img',   { x:  -60, opacity: 0, duration: 1.0, ease: 'power2.out' }, '<');
    // 4. 오른팀 (Jinx + Ahri 동시)
    tl.from('.jinx-img', { x:  100, opacity: 0, duration: 1.0, ease: 'power2.out' }, '-=0.5');
    tl.from('.ahri-img', { x:   60, opacity: 0, duration: 1.0, ease: 'power2.out' }, '<');
    // 5. 이름 라벨
    tl.from('.char-label', { opacity: 0, y: 10, duration: 0.4, stagger: 0.08, ease: 'power2.out' }, '-=0.2');
    // 6. 타이틀 → 태그라인 → 나머지
    tl.to('.hero-title',   { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(1.2)' }, '-=0.1');
    tl.to('.hero-tagline', { opacity: 1, y: 0, duration: 0.45 }, '-=0.2');
    tl.to('.hero-sub',     { opacity: 1, duration: 0.35 }, '-=0.15');
    tl.to('.cta-wrap',     { opacity: 1, y: 0, duration: 0.4 }, '-=0.15');
    tl.to('.platforms',    { opacity: 1, duration: 0.35 }, '-=0.1');

    // 제목 둥둥
    gsap.to('.hero-title',   { y: -8, duration: 2.5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2 });
    gsap.to('.hero-tagline', { y: -5, duration: 3,   repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2.3 });

    // 캐릭터 idle float — y축만, 각각 타이밍 다르게
    gsap.to('.ekko-img', { y: -14, duration: 2.8, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0 });
    gsap.to('.vi-img',   { y: -10, duration: 3.2, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.5 });
    gsap.to('.jinx-img', { y: -12, duration: 3.0, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.3 });
    gsap.to('.ahri-img', { y:  -9, duration: 2.6, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.8 });

    // 마우스 시차 — x축만 (y는 float에 양보)
    const hero = document.querySelector('.hero');
    hero.addEventListener('mousemove', (e) => {
      const cx = window.innerWidth / 2;
      const dx = (e.clientX - cx) / cx;

      gsap.to('.ekko-img',     { x: dx * -18, duration: 0.8, ease: 'power1.out' });
      gsap.to('.vi-img',       { x: dx * -12, duration: 0.8, ease: 'power1.out' });
      gsap.to('.jinx-img',     { x: dx *  18, duration: 0.8, ease: 'power1.out' });
      gsap.to('.ahri-img',     { x: dx *  12, duration: 0.8, ease: 'power1.out' });
      gsap.to('.hero-title',   { x: dx *   8, duration: 1,   ease: 'power1.out' });
      gsap.to('.hero-tagline', { x: dx *   5, duration: 1,   ease: 'power1.out' });
    });
  } else {
    document.querySelectorAll('.hero-title, .hero-tagline, .hero-sub, .cta-wrap, .platforms')
      .forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
  }

  // 게임 인트로 영상 — 섹션 진입 시 자동재생, 이탈 시 정지
  const snapWrap = document.querySelector('.snap-wrap');
  const gameIntro = document.querySelector('.game-intro');
  if (gameIntro && snapWrap) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          slideVideos[current]?.play().catch(() => {});
        } else {
          slideVideos.forEach(v => { if (v) { v.pause(); v.currentTime = 0; } });
        }
      });
    }, { root: snapWrap, threshold: 0.5 });
    observer.observe(gameIntro);
  }

  // Game Intro Slider
  const slides = document.querySelectorAll('.gi-slide');
  const dots = document.querySelectorAll('.gi-progress-dot');
  const prevBtn = document.querySelector('.gi-prev');
  const nextBtn = document.querySelector('.gi-next');
  let current = 0;

  const slideVideos = [
    document.querySelector('.gi-inline-video'),
    document.querySelector('.gi-pve-video'),
    document.querySelector('.gi-slide2-video'),
  ];

  const goTo = (idx) => {
    slideVideos[current]?.pause();
    slides[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    slideVideos[current]?.play().catch(() => {});
  };

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

  // Hero inline video
  const heroInlineWrap = document.querySelector('.hero-inline-video');
  const heroInlinePlayer = document.querySelector('.hero-inline-player');
  const heroVideoOpenBtn = document.querySelector('.hero-video-open');
  const heroInlineClose = document.querySelector('.hero-inline-close');

  if (heroVideoOpenBtn && heroInlineWrap && heroInlinePlayer) {
    heroVideoOpenBtn.addEventListener('click', () => {
      heroInlineWrap.classList.add('is-open');
      heroInlinePlayer.currentTime = 0;
      heroInlinePlayer.play().catch(() => {});
    });
    heroInlineClose.addEventListener('click', () => {
      heroInlineWrap.classList.remove('is-open');
      heroInlinePlayer.pause();
      heroInlinePlayer.currentTime = 0;
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && heroInlineWrap.classList.contains('is-open')) {
        heroInlineClose.click();
      }
    });
  }

  const videoModal = document.querySelector('.video-modal');
  const videoPlayer = document.querySelector('.video-player');
  const videoOpenTargets = document.querySelectorAll('.video-open');
  const videoCloseTargets = document.querySelectorAll('[data-video-close]');

  const openVideo = (src) => {
    if (src && videoPlayer.src !== new URL(src, location.href).href) {
      videoPlayer.src = src;
    }
    videoModal.classList.add('is-open');
    videoModal.setAttribute('aria-hidden', 'false');
    videoPlayer.currentTime = 0;
    videoPlayer.play().catch(() => {});
  };

  const closeVideo = () => {
    videoModal.classList.remove('is-open');
    videoModal.setAttribute('aria-hidden', 'true');
    videoPlayer.pause();
  };

  videoOpenTargets.forEach((target) => target.addEventListener('click', () => {
    openVideo(target.dataset.videoSrc || null);
  }));
  videoCloseTargets.forEach((target) => target.addEventListener('click', closeVideo));
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal.classList.contains('is-open')) closeVideo();
  });
});
