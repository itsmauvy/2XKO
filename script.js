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
      engName: 'CAITLYN',
      name: '케이틀린',
      subtitle: '필트오버의 보안관',
      desc: '날카로운 눈썰미로 범죄자를 추적하고,<br>덫과 정밀한 사격으로 상대를 제압합니다.',
      quote: '어디, 이번 사건도 파헤쳐볼까?',
      role: '공간 장악',
      style: '원거리 견제 / 거리 유지',
      img: 'images/caitlyn character.png',
      imgHeight: '175vh',
      voiceFile: 'video/caitlyn voice.MP3',
      skillVideos: ['video/caitlyn ulti.webm', 'video/caitlyn skill preview.webm', 'video/caitlyn skill trap.webm'],
      stats: { difficulty: 45, speed: 55, power: 70, range: 90 },
    },
    teemo: {
      color: '#4caf2a',
      engName: 'TEEMO',
      name: '티모',
      subtitle: '날쌘 정찰병',
      desc: '다양한 속임수로 상대의 허를 찌르며,<br>원거리에서 빈틈을 노려 싸웁니다.',
      quote: '정찰 다녀오겠습니다.',
      role: '덫사냥꾼',
      style: '속임수 / 기습',
      img: 'images/teemo img.png',
      imgHeight: '105vh',
      imgTop: '-18vh',
      voiceFile: 'video/teemo voice(1).MP3',
      skillVideos: ['video/teemo skill 1.webm', 'video/teemo skill2.webm', 'video/teemo ult.webm'],
      stats: { difficulty: 65, speed: 70, power: 55, range: 65 },
    },
    ahri: {
      color: '#e8174f',
      engName: 'AHRI',
      name: '아리',
      subtitle: '매혹적인 구미호',
      desc: '높은 기동성을 갖춘 마법사 챔피언으로,<br>다양한 기술을 활용해 상대를 압박합니다.',
      quote: '내 본성을 보여주지.',
      role: '공격 일변도',
      style: '빠른 접근 / 연속 공격',
      img: 'images/ahri character.png',
      imgHeight: '175vh',
      imgTop: '5vh',
      voiceFile: 'video/ahri voice(1).MP3',
      skillVideos: ['video/ahri skill1.webm', 'video/ahri skill2.webm', 'video/ahri ult.webm'],
      stats: { difficulty: 60, speed: 80, power: 70, range: 75 },
    },
    boltz: {
      color: '#f5a623',
      engName: 'BLITZCRANK',
      name: '블리츠크랭크',
      subtitle: '거대 증기 골렘',
      desc: '로켓 손으로 상대를 가까이 끌어당겨 강력한 잡기 기술과<br>에너지 폭발로 공격을 이어 가는 챔피언입니다.',
      quote: '인간 시대의 끝이 도래했다.',
      role: '잡기 특화',
      style: '상대 끌어오기 / 근접 제압',
      img: 'images/blitzcrank character.png',
      imgHeight: '87vh',
      voiceFile: 'video/blitzcrank voice(1).MP3',
      skillVideos: ['video/blitzcrank skill1.webm', 'video/blitzcrank skill2.webm', 'video/blitzcrank ult.webm'],
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
    const skillPreviewEl = champSection.querySelector('.skill-preview');
    const skillStack = champSection.querySelector('.skill-stack');
    const voiceBtn = champSection.querySelector('.champ-voice-btn');
    let skillCards = [];
    let skillIndex = 0;
    let voiceAudio = null;

    const champOrder = ['caitlyn', 'teemo', 'ahri', 'boltz'];
    let champIndex = 0;

    if (voiceBtn) {
      voiceBtn.addEventListener('click', () => {
        const key = champOrder[champIndex];
        const src = champData[key]?.voiceFile;
        if (!src) return;
        if (voiceAudio) { voiceAudio.pause(); voiceAudio.currentTime = 0; }
        voiceAudio = new Audio(src);
        voiceBtn.classList.add('playing');
        voiceAudio.play().catch(() => {});
        voiceAudio.addEventListener('ended', () => voiceBtn.classList.remove('playing'));
      });
    }

    const dotsContainer = skillPreviewEl.querySelector('.skill-hud-dots');
    let totalVideos = 0;
    let currentVideoIndex = 0;

    const updateDots = (activeIdx) => {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      for (let i = 0; i < totalVideos; i++) {
        const dot = document.createElement('div');
        dot.className = 'skill-hud-dot' + (i === activeIdx ? ' active' : '');
        dotsContainer.appendChild(dot);
      }
    };

    const buildStack = (videos) => {
      skillStack.innerHTML = '';
      skillCards = [];
      if (!videos || !videos.length) {
        skillPreviewEl.style.display = 'none';
        dotsContainer.innerHTML = '';
        return;
      }
      skillPreviewEl.style.display = '';
      totalVideos = videos.length;
      currentVideoIndex = 0;
      updateDots(0);

      // 최대 3장 생성 — index 0 = 뒤, index count-1 = 앞(맨 위)
      const count = Math.min(videos.length, 3);
      for (let i = 0; i < count; i++) {
        const card = document.createElement('div');
        card.className = 'skill-card';
        const vid = document.createElement('video');
        vid.muted = true;
        vid.playsInline = true;
        vid.autoplay = true;
        vid.src = videos[i % videos.length];
        card.appendChild(vid);
        skillStack.appendChild(card);
        skillCards.push(card);

        const depth = count - 1 - i;
        gsap.set(card, { x: depth * -6, y: depth * 6, scale: 1 - depth * 0.03, zIndex: i });
      }

      skillIndex = count - 1;
      const frontVid = skillCards[skillCards.length - 1].querySelector('video');
      frontVid.play().catch(() => {});
      frontVid.addEventListener('ended', swapCard);
    };

    const swapCard = () => {
      if (!skillCards.length) return;

      // 앞 카드 = 배열 마지막
      const outCard = skillCards.pop();
      const outVid = outCard.querySelector('video');
      outVid.removeEventListener('ended', swapCard);

      // 앞 카드 위로 날리기
      gsap.to(outCard, {
        y: -160, opacity: 0, rotation: -8, duration: 0.5, ease: 'power2.in',
        onComplete: () => outCard.remove(),
      });

      // 남은 카드들 앞으로 당기기 (마지막이 앞)
      skillCards.forEach((card, i) => {
        const depth = skillCards.length - 1 - i;
        gsap.to(card, {
          x: depth * -6, y: depth * 6, scale: 1 - depth * 0.03, zIndex: i + 1,
          duration: 0.4, ease: 'power2.out',
        });
      });

      // 다음 영상 재생 (새 앞 카드 = 마지막)
      if (skillCards.length > 0) {
        const nextVid = skillCards[skillCards.length - 1].querySelector('video');
        nextVid.play().catch(() => {});
        nextVid.addEventListener('ended', swapCard);
      }

      // dot 업데이트
      currentVideoIndex = (currentVideoIndex + 1) % totalVideos;
      updateDots(currentVideoIndex);

      // 새 카드를 뒤(DOM 맨 앞, 배열 index 0)에 추가
      const currentChampKey = champSection.querySelector('.champ-tab.active')?.dataset.champ;
      const vids = champData[currentChampKey]?.skillVideos;
      if (vids && vids.length > 1) {
        skillIndex = (skillIndex + 1) % vids.length;
        const newCard = document.createElement('div');
        newCard.className = 'skill-card';
        const newVid = document.createElement('video');
        newVid.muted = true;
        newVid.playsInline = true;
        newVid.autoplay = true;
        newVid.src = vids[skillIndex % vids.length];
        newCard.appendChild(newVid);
        skillStack.insertBefore(newCard, skillStack.firstChild);
        skillCards.unshift(newCard);
        const backDepth = skillCards.length - 1;
        gsap.set(newCard, { x: backDepth * -6, y: backDepth * 6, scale: 1 - backDepth * 0.03, zIndex: 0 });
      }
    };
    // 스킬 프리뷰 클릭 → 카드 전환
    const skillPlayBtn = skillPreviewEl.querySelector('.skill-play-btn');
    if (skillPlayBtn) skillPlayBtn.addEventListener('click', swapCard);
    skillStack.addEventListener('click', swapCard);

    const artBg = champSection.querySelector('.champ-art-bg');
    const flashEl = champSection.querySelector('.champ-flash');
    const fills = champSection.querySelectorAll('.champ-stat-fill');

    const champPanel = champSection.querySelector('.champ-panel');
    const champOrb = champSection.querySelector('.champ-orb');
    const champMushs = document.querySelectorAll('.champ-mush');

    // 초기 캐릭터 데이터 즉시 적용 (스크롤 여부와 무관)
    const activeKey0 = champOrder[champIndex];
    const activeData0 = champData[activeKey0];
    if (activeData0) {
      imgEl.style.height = activeData0.imgHeight || '90vh';
      if (activeData0.imgTop !== undefined) imgEl.style.top = activeData0.imgTop;
      buildStack(activeData0.skillVideos);
    }

    // 섹션 진입 인트로 애니메이션 (슬라이드인 효과)
    let introPlayed = false;
    const playIntro = () => {
      if (introPlayed) return;
      introPlayed = true;

      const activeKey = champOrder[champIndex];
      const activeData = champData[activeKey];
      if (activeData) {
        imgEl.style.height = activeData.imgHeight || '90vh';
        if (activeData.imgTop !== undefined) imgEl.style.top = activeData.imgTop;
      }

      // 초기 상태 세팅
      gsap.set(imgEl, { x: 120, opacity: 0 });
      gsap.set(champOrb, { x: 80, opacity: 0, scale: 0.6 });
      gsap.set(champPanel.children, { x: -40, opacity: 0 });

      const isAhri = activeKey === 'ahri';
      champSection.classList.toggle('ahri-active', isAhri);

      const tl = gsap.timeline({
        onComplete: () => {},
        onInterrupt: () => {
          gsap.set(imgEl, { x: 0, opacity: 1 });
          gsap.set(champPanel.children, { x: 0, opacity: 1 });
        }
      });

      // 캐릭터 슬램인
      tl.to(imgEl, { x: 0, opacity: 1, duration: 0.35, ease: 'expo.out' })
        // 오브 팝 (ahri만)
        .to(champOrb, { x: 0, opacity: isAhri ? 1 : 0, scale: 1, duration: 0.4, ease: 'back.out(2)' }, '-=0.2')
        // 텍스트 순차 등장
        .to(champPanel.children, { x: 0, opacity: 1, duration: 0.3, stagger: 0.06, ease: 'power2.out' }, '-=0.15');
    };

    // 섹션이 뷰포트에 들어오면 playIntro 실행 (viewport 기준)
    const champObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) playIntro(); });
    }, { threshold: 0.3 });
    champObserver.observe(champSection);

    // snap 스크롤 이벤트 fallback
    const onSnapScroll = () => {
      if (introPlayed) { snapWrap.removeEventListener('scroll', onSnapScroll); return; }
      const rect = champSection.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.7 && rect.bottom > 0) playIntro();
    };
    snapWrap.addEventListener('scroll', onSnapScroll, { passive: true });

    const switchChamp = (key) => {
      const d = champData[key];
      if (!d) return;

      // 진행 중인 트윈 즉시 종료 (잔상 방지)
      gsap.killTweensOf([imgEl, champOrb, ...champMushs]);
      gsap.set(champOrb, { opacity: 0, scale: 0.6 });
      champMushs.forEach(m => gsap.set(m, { opacity: 0, scale: 0.4 }));

      bgNames.forEach(el => el.textContent = d.engName || d.name);
      nameEl.textContent = d.name;
      subtitleEl.textContent = d.subtitle;
      descEl.innerHTML = d.desc;
      quoteEl.textContent = d.quote;
      roleEl.innerHTML = `<strong>유형</strong> ${d.role}`;
      styleEl.innerHTML = `<strong>전투 방식</strong> ${d.style}`;
      if (artBg) artBg.style.background = `linear-gradient(-14deg, #fff 0%, #fff 28%, ${d.color} 28%, ${d.color} 72%, #fff 72%, #fff 100%)`;

      // 스킬 프리뷰 카드 스택 교체
      buildStack(d.skillVideos);

      // 캐릭터 전환 임팩트
      // 1. 플래시 버스트
      if (flashEl) {
        gsap.killTweensOf(flashEl);
        gsap.set(flashEl, { background: d.color, opacity: 0 });
        gsap.to(flashEl, { opacity: 0.35, duration: 0.08, ease: 'power4.out',
          onComplete: () => gsap.to(flashEl, { opacity: 0, duration: 0.3, ease: 'power2.out' })
        });
      }

      gsap.to(imgEl, { x: 80, opacity: 0, duration: 0.12, ease: 'power3.in', onComplete: () => {
        imgEl.src = d.img || '';
        imgEl.style.height = d.imgHeight || '90vh';
        imgEl.style.top = d.imgTop !== undefined ? d.imgTop : '-4vh';

        // 2. 슬램인 (챔피언별 개성 모션)
        gsap.set(imgEl, { opacity: 1 });
        if (key === 'teemo') {
          gsap.fromTo(imgEl,
            { y: -300, x: 0, rotation: -4 },
            { y: 0, x: 0, rotation: 0, duration: 1.2, ease: 'power1.out' }
          );
        } else if (key === 'ahri') {
          gsap.fromTo(imgEl,
            { x: 200, rotation: 12, scale: 0.85 },
            { x: 0, rotation: 0, scale: 1, duration: 0.55, ease: 'back.out(1.4)',
              onComplete: () => gsap.fromTo(imgEl, { x: 6 }, { x: 0, duration: 0.3, ease: 'elastic.out(3, 0.4)' })
            }
          );
        } else if (key === 'boltz') {
          gsap.fromTo(imgEl,
            { scale: 0.4, x: 80, y: -30 },
            { scale: 1, x: 0, y: 0, duration: 0.45, ease: 'expo.out',
              onComplete: () => gsap.fromTo(champSection, { x: -10 }, { x: 0, duration: 0.3, ease: 'elastic.out(5, 0.3)' })
            }
          );
        } else {
          // 케이틀린 기본 슬램인
          gsap.fromTo(imgEl,
            { x: 120, scale: 1.06 },
            { x: 0, scale: 1, duration: 0.35, ease: 'expo.out',
              onComplete: () => gsap.fromTo(champSection, { x: -6 }, { x: 0, duration: 0.25, ease: 'elastic.out(4, 0.3)' })
            }
          );
        }

        // 전환 완료 후 각 요소 등장
        champSection.classList.toggle('ahri-active', key === 'ahri');
        if (key === 'ahri') {
          gsap.fromTo(champOrb, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' });
        }
        if (key === 'teemo') {
          champMushs.forEach((mush, i) => {
            gsap.fromTo(mush, { opacity: 0, scale: 0.4, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(2)', delay: i * 0.1 });
          });
        }
      }});

      const vals = [d.stats.difficulty, d.stats.speed, d.stats.power, d.stats.range];
      fills.forEach((f, i) => { f.style.width = vals[i] + '%'; });
    };

    const goToChamp = (idx) => {
      champIndex = (idx + champOrder.length) % champOrder.length;
      const key = champOrder[champIndex];
      tabs.forEach(t => t.classList.toggle('active', t.dataset.champ === key));
      switchChamp(key);
    };

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        goToChamp(champOrder.indexOf(tab.dataset.champ));
      });
    });

    const prevBtn = champSection.querySelector('.champ-nav-prev');
    const nextBtn = champSection.querySelector('.champ-nav-next');
    if (prevBtn) prevBtn.addEventListener('click', () => goToChamp(champIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToChamp(champIndex + 1));

    // 초기 배경색 + subtitle 색 설정
    const initD = champData[champOrder[0]];
    if (initD && artBg) artBg.style.background = `linear-gradient(-14deg, #fff 0%, #fff 28%, ${initD.color} 28%, ${initD.color} 72%, #fff 72%, #fff 100%)`;
  }

  // ===================== NEWS SECTION =====================
  const newsCarousel = document.getElementById('newsCarousel');
  const newsDots = document.getElementById('newsDots');

  const newsData = [
    {
      tag: 'NEW CHAMPION', category: '신규 챔피언',
      title: '케이틀린 참전!',
      desc: '정밀한 한 방, 완벽한 제압. 필트오버의 보안관 케이틀린이 2XKO에 합류합니다.',
      bg: 'linear-gradient(160deg, #2a1550 0%, #0d0a2a 100%)',
      type: 'champion',
    },
    {
      tag: 'FEATURED', category: 'PATCH NOTES', featured: true,
      title: '2XKO 패치 0.3.0\n밸런스 조정 및 신규 기능 추가!',
      desc: '챔피언 밸런스 조정, 연습 모드 개선, 랭크 시즌 보상 업데이트 등 다양한 변화가 적용되었습니다. 지금 바로 확인하세요!',
      bg: 'linear-gradient(160deg, #0a1e4a 0%, #04162e 100%)',
      type: 'update',
    },
    {
      tag: 'EVENT', category: '',
      title: '2XKO\n오픈 베타 테스트\n6월 12일 시작!',
      desc: '친구와 함께 2XKO를 가장 먼저 경험하세요. 보상 이벤트 및 스트리머 드롭스 진행!',
      bg: 'linear-gradient(160deg, #1a2e04 0%, #0a1a00 100%)',
      type: 'event',
    },
    {
      tag: 'UPDATE', category: '업데이트',
      title: '새로운 아레나 맵\n업데이트 공개!',
      desc: '필트오버 도심부를 배경으로 한 새로운 전투 무대가 추가됩니다.',
      bg: 'linear-gradient(160deg, #1a0a2e 0%, #0d0520 100%)',
      type: 'update',
    },
    {
      tag: 'NOTICE', category: '공지',
      title: '시즌 2 랭크\n사전 등록 시작',
      desc: '시즌 2 랭크 모드 사전 등록을 지금 바로 시작하세요. 특별 보상이 기다립니다.',
      bg: 'linear-gradient(160deg, #0a1e1a 0%, #040e0c 100%)',
      type: 'notice',
    },
    {
      tag: 'VIDEO', category: '영상',
      title: '2XKO 공식\n게임플레이 트레일러',
      desc: '신규 챔피언과 새로운 시스템을 담은 공식 게임플레이 트레일러를 확인하세요.',
      bg: 'linear-gradient(160deg, #1e0a0a 0%, #140404 100%)',
      type: 'video',
    },
  ];

  if (newsCarousel && newsDots) {
    let newsIndex = 1; // 가운데 featured 카드 시작
    let allNewsData = [...newsData];
    let filteredData = [...allNewsData];
    let dragStartX = 0;
    let isDragging = false;

    const getCardSizes = () => {
      const areaW = newsCarousel.closest('.news-carousel-area').offsetWidth;
      return {
        FEATURED_W: Math.round(areaW * 0.62),
        CARD_W:     Math.round(areaW * 0.46),
        CARD_GAP:   Math.round(areaW * 0.03),
      };
    };
    let { FEATURED_W, CARD_W, CARD_GAP } = getCardSizes();
    const FEATURED_SCALE = 1;
    const SIDE_SCALE = 1;

    const newsSection = document.querySelector('.news-section');
    const updateSectionBg = (idx) => {
      const item = filteredData[idx];
      if (!item || !newsSection) return;
      newsSection.style.transition = 'background 0.5s ease';
      newsSection.style.background = item.bg.replace('160deg', '135deg');
    };

    const buildNewsCards = () => {
      newsCarousel.innerHTML = '';
      newsDots.innerHTML = '';

      filteredData.forEach((item, i) => {
        // 카드
        const card = document.createElement('div');
        card.className = 'news-card' + (i === newsIndex ? ' is-featured' : '');
        card.dataset.index = i;
        card.innerHTML = `
          <div class="news-card-inner">
            <div class="news-card-bg" style="background:${item.bg}"></div>
            <div class="news-card-overlay"></div>
            <span class="news-card-tag">${item.tag}</span>
            <div class="news-card-body">
              ${item.category ? `<p class="news-card-category">${item.category}</p>` : ''}
              <h3 class="news-card-title">${item.title.replace(/\n/g,'<br>')}</h3>
              <p class="news-card-desc">${item.desc}</p>
              <button class="news-card-btn">자세히 보기 <svg viewBox="0 0 24 8" width="28" height="8" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="0" y1="4" x2="22" y2="4"/><polyline points="18,1 22,4 18,7"/></svg></button>
            </div>
          </div>`;
        newsCarousel.appendChild(card);

        // 도트
        const dot = document.createElement('button');
        dot.className = 'news-dot' + (i === newsIndex ? ' active' : '');
        dot.setAttribute('aria-label', `뉴스 ${i + 1}`);
        dot.addEventListener('click', () => goNews(i));
        newsDots.appendChild(dot);
      });

      positionCards(false);
      updateSectionBg(newsIndex);
      bindDrag();
    };

    const positionCards = (animate = true) => {
      ({ FEATURED_W, CARD_W, CARD_GAP } = getCardSizes());
      const cards = newsCarousel.querySelectorAll('.news-card');
      const areaW = newsCarousel.closest('.news-carousel-area').offsetWidth;
      const areaH = newsCarousel.closest('.news-carousel-area').offsetHeight;
      const centerX = areaW / 2 - FEATURED_W / 2;

      const total = cards.length;
      cards.forEach((card, i) => {
        // 순환 offset: 항상 최단 경로로 계산
        let offset = i - newsIndex;
        if (offset > total / 2)  offset -= total;
        if (offset < -total / 2) offset += total;

        const isFeat = offset === 0;
        const absOff = Math.abs(offset);
        const cardH = isFeat ? Math.round(FEATURED_W * 0.75) : Math.round(CARD_W * 0.75);

        let x;
        if (isFeat) {
          x = centerX;
        } else if (offset < 0) {
          x = centerX - (CARD_W + CARD_GAP) - (absOff - 1) * (CARD_W + CARD_GAP);
        } else {
          x = centerX + FEATURED_W + CARD_GAP + (absOff - 1) * (CARD_W + CARD_GAP);
        }

        const opacity = absOff === 0 ? 1 : absOff === 1 ? 0.6 : 0;
        const zIndex = isFeat ? 10 : Math.max(1, 5 - absOff);
        const y = (areaH - cardH) / 2;

        card.classList.toggle('is-featured', isFeat);
        card.style.zIndex = zIndex;
        card.style.width = (isFeat ? FEATURED_W : CARD_W) + 'px';
        card.style.height = cardH + 'px';

        if (animate) {
          gsap.to(card, { x, y, opacity, duration: 0.45, ease: 'power2.out' });
        } else {
          gsap.set(card, { x, y, opacity });
        }
      });

      // 도트 업데이트
      newsDots.querySelectorAll('.news-dot').forEach((d, i) => {
        d.classList.toggle('active', i === newsIndex);
      });
    };

    const goNews = (idx) => {
      newsIndex = ((idx % filteredData.length) + filteredData.length) % filteredData.length;
      positionCards(true);
      updateSectionBg(newsIndex);
    };

    const bindDrag = () => {
      let dragCurrentX = 0;

      newsCarousel.addEventListener('pointerdown', (e) => {
        isDragging = true;
        dragStartX = e.clientX;
        dragCurrentX = e.clientX;
        newsCarousel.setPointerCapture(e.pointerId);
        newsCarousel.style.cursor = 'grabbing';
      });

      newsCarousel.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        dragCurrentX = e.clientX;
        const dx = dragCurrentX - dragStartX;

        const cards = newsCarousel.querySelectorAll('.news-card');
        const areaW = newsCarousel.closest('.news-carousel-area').offsetWidth;
        const areaH = newsCarousel.closest('.news-carousel-area').offsetHeight;
        const centerX = areaW / 2 - FEATURED_W / 2;

        cards.forEach((card, i) => {
          const offset = i - newsIndex;
          const isFeat = offset === 0;
          const absOff = Math.abs(offset);
          const cardH = isFeat ? Math.round(FEATURED_W * 0.75) : Math.round(CARD_W * 0.75);

          let baseX;
          if (isFeat) {
            baseX = centerX;
          } else if (offset < 0) {
            baseX = centerX - (CARD_W + CARD_GAP) - (absOff - 1) * (CARD_W + CARD_GAP);
          } else {
            baseX = centerX + FEATURED_W + CARD_GAP + (absOff - 1) * (CARD_W + CARD_GAP);
          }

          const y = (areaH - cardH) / 2;
          const resistance = absOff > 0 ? 0.6 : 1;
          gsap.set(card, { x: baseX + dx * resistance, y });
        });
      });

      newsCarousel.addEventListener('pointerup', (e) => {
        if (!isDragging) return;
        isDragging = false;
        newsCarousel.style.cursor = '';
        const dx = e.clientX - dragStartX;
        if (dx < -50) goNews(newsIndex + 1);
        else if (dx > 50) goNews(newsIndex - 1);
        else positionCards(true);
      });

      newsCarousel.addEventListener('pointercancel', () => {
        if (!isDragging) return;
        isDragging = false;
        newsCarousel.style.cursor = '';
        positionCards(true);
      });
    };

    // 화살표
    const newsPrev = document.querySelector('.news-nav--prev');
    const newsNext = document.querySelector('.news-nav--next');
    if (newsPrev) newsPrev.addEventListener('click', () => goNews(newsIndex - 1));
    if (newsNext) newsNext.addEventListener('click', () => goNews(newsIndex + 1));

    // 필터
    document.querySelectorAll('.news-filter').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.news-filter').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.dataset.filter;
        filteredData = f === 'all' ? [...allNewsData] : allNewsData.filter(n => n.type === f);
        newsIndex = Math.min(newsIndex, Math.max(0, filteredData.length - 1));
        buildNewsCards();
      });
    });

    buildNewsCards();
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
