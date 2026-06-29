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
    gsap.to('.champ-orb', { y: -14, duration: 2.2, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.2 });
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

  // Champions section
  const champData = {
    caitlyn: {
      color: '#092F75',
      name: 'CAITLYN',
      subtitle: '필트오버의 보안관',
      desc: '텍스트 준비 중입니다.',
      quote: '"범죄자들, 한 명씩 잡아드리죠."',
      role: 'MARKSMAN',
      style: 'ZONING / KEEP AWAY',
      img: 'images/caitlyn character.png',
      imgHeight: '180vh',
      stats: { difficulty: 45, speed: 55, power: 70, range: 90 },
    },
    teemo: {
      color: '#4caf2a',
      name: 'TEEMO',
      subtitle: '요들 정찰대',
      desc: '텍스트 준비 중입니다.',
      quote: '"죽음은 독처럼 천천히 스며들지."',
      role: 'SPECIALIST',
      style: 'TRAP / PRESSURE',
      img: 'images/teemo img.png',
      imgHeight: '90vh',
      stats: { difficulty: 65, speed: 70, power: 55, range: 65 },
    },
    ahri: {
      color: '#e8174f',
      name: 'AHRI',
      subtitle: '매혹적인 구미호',
      desc: '텍스트 준비 중입니다.',
      quote: '"당신의 마음, 이미 제 손안에 있어요."',
      role: 'ASSASSIN',
      style: 'RUSH DOWN / MIX-UP',
      img: 'images/ahri character.png',
      imgHeight: '180vh',
      stats: { difficulty: 60, speed: 80, power: 70, range: 75 },
    },
    boltz: {
      color: '#f5a623',
      name: 'BLITZCRANK',
      subtitle: '텍스트 준비 중입니다.',
      desc: '텍스트 준비 중입니다.',
      quote: '"텍스트 준비 중입니다."',
      role: 'FIGHTER',
      style: 'RUSHDOWN / PRESSURE',
      img: 'images/blitzcrank character.png',
      imgHeight: '90vh',
      stats: { difficulty: 55, speed: 85, power: 75, range: 45 },
    },
  };

  const champSection = document.querySelector('.champions');
  if (champSection) {
    const tabs = champSection.querySelectorAll('.champ-tab');
    const bgNames = champSection.querySelectorAll('.champ-bg-name');
    const nameEl = champSection.querySelector('.champ-name');
    const subtitleEl = champSection.querySelector('.champ-subtitle');
    const descEl = champSection.querySelector('.champ-desc');
    const quoteEl = champSection.querySelector('.champ-quote');
    const roleEl = champSection.querySelector('.champ-role');
    const styleEl = champSection.querySelector('.champ-style');
    const imgEl = champSection.querySelector('.champ-img');
    const artBg = champSection.querySelector('.champ-art-bg');
    const fills = champSection.querySelectorAll('.champ-stat-fill');

    const champPanel = champSection.querySelector('.champ-panel');
    const champOrb = champSection.querySelector('.champ-orb');
    const champMushs = document.querySelectorAll('.champ-mush');

    // 섹션 진입 인트로 애니메이션
    let introPlayed = false;
    const playIntro = () => {
      if (introPlayed) return;
      introPlayed = true;

      // 초기 상태 세팅
      gsap.set(artBg, { scaleX: 0, transformOrigin: 'left center' });
      gsap.set(imgEl, { x: 120, opacity: 0 });
      gsap.set(champOrb, { x: 80, opacity: 0, scale: 0.6 });
      gsap.set(champPanel.children, { x: -40, opacity: 0 });

      const tl = gsap.timeline();

      const isAhri = champSection.querySelector('.champ-tab.active')?.dataset.champ === 'ahri';

      // 1. 빨간 배경 쾅
      tl.to(artBg, { scaleX: 1, duration: 0.45, ease: 'expo.out' })
        // 2. 캐릭터 슬램인
        .to(imgEl, { x: 0, opacity: 1, duration: 0.35, ease: 'expo.out' }, '-=0.05')
        // 3. 오브 팝 (ahri만)
        .to(champOrb, { x: 0, opacity: isAhri ? 1 : 0, scale: 1, duration: 0.4, ease: 'back.out(2)' }, '-=0.2')
        // 4. 텍스트 순차 등장
        .to(champPanel.children, { x: 0, opacity: 1, duration: 0.3, stagger: 0.06, ease: 'power2.out' }, '-=0.15');
    };

    // IntersectionObserver로 섹션 진입 감지
    const champObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) playIntro(); });
    }, { root: snapWrap, threshold: 0.4 });
    champObserver.observe(champSection);

    const switchChamp = (key) => {
      const d = champData[key];
      if (!d) return;
      bgNames.forEach(el => el.textContent = d.name);
      nameEl.textContent = d.name;
      subtitleEl.textContent = d.subtitle;
      descEl.textContent = d.desc;
      quoteEl.textContent = d.quote;
      roleEl.innerHTML = `<strong>ROLE</strong> ${d.role}`;
      styleEl.innerHTML = `<strong>STYLE</strong> ${d.style}`;
      if (artBg) artBg.style.background = `linear-gradient(-14deg, #fff 0%, #fff 28%, ${d.color} 28%, ${d.color} 72%, #fff 72%, #fff 100%)`;

      // 캐릭터 전환 임팩트
      gsap.to(imgEl, { x: 60, opacity: 0, duration: 0.15, ease: 'power2.in', onComplete: () => {
        imgEl.src = d.img || '';
        imgEl.style.height = d.imgHeight || '90vh';
        gsap.fromTo(imgEl, { x: 80, opacity: 0 }, { x: 0, opacity: d.img ? 1 : 0, duration: 0.3, ease: 'expo.out' });
      }});

      // orb: ahri만 표시
      if (key === 'ahri') {
        gsap.fromTo(champOrb, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2)', delay: 0.2 });
      } else {
        gsap.to(champOrb, { opacity: 0, scale: 0.6, duration: 0.2, ease: 'power2.in' });
      }

      // mush: teemo만 표시
      champMushs.forEach((mush, i) => {
        if (key === 'teemo') {
          gsap.fromTo(mush, { opacity: 0, scale: 0.4, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(2)', delay: 0.3 + i * 0.1 });
        } else {
          gsap.to(mush, { opacity: 0, scale: 0.4, duration: 0.2, ease: 'power2.in' });
        }
      });

      const vals = [d.stats.difficulty, d.stats.speed, d.stats.power, d.stats.range];
      fills.forEach((f, i) => { f.style.width = vals[i] + '%'; });
    };

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        switchChamp(tab.dataset.champ);
      });
    });

    // 초기 활성 탭 기준으로 배경색 설정
    const activeTab = champSection.querySelector('.champ-tab.active');
    if (activeTab && artBg) {
      const d = champData[activeTab.dataset.champ];
      if (d) artBg.style.background = `linear-gradient(-14deg, #fff 0%, #fff 28%, ${d.color} 28%, ${d.color} 72%, #fff 72%, #fff 100%)`;
    }
  }

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
