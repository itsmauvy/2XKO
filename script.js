window.addEventListener('load', () => {
  if (window.gsap) {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // 1. 배경 먼저 페이드인
    tl.from('.bg-img', { opacity: 0, duration: 0.8, stagger: 0.08 });
    // 2. 네브바
    tl.from('.navbar', { y: -40, opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.5');
    // 3. [1단계] 왼팀 — Ekko + Vi 캐릭터와 이름 동시 등장
    tl.addLabel('leftTeam', '-=0.3');
    tl.from('.ekko-img', { x: -100, opacity: 0, duration: 1.0, ease: 'power2.out' }, 'leftTeam');
    tl.from('.vi-img',   { x:  -60, opacity: 0, duration: 1.0, ease: 'power2.out' }, 'leftTeam');
    tl.from('.ekko-label, .vi-label', { opacity: 0, y: 10, duration: 0.4, ease: 'power2.out' }, 'leftTeam+=0.2');

    // 4. [2단계] 오른팀 — Jinx + Ahri 캐릭터와 이름 동시 등장
    tl.addLabel('rightTeam', 'leftTeam+=0.7');
    tl.from('.jinx-img', { x: 100, opacity: 0, duration: 1.0, ease: 'power2.out' }, 'rightTeam');
    tl.from('.ahri-img', { x:  60, opacity: 0, duration: 1.0, ease: 'power2.out' }, 'rightTeam');
    tl.from('.jinx-label, .ahri-label', { opacity: 0, y: 10, duration: 0.4, ease: 'power2.out' }, 'rightTeam+=0.2');

    // 5. [3단계] 가운데 문구 — 오른팀 등장 중간쯤에 전부 한번에
    tl.addLabel('center', 'rightTeam+=0.5');
    tl.to('.hero-title',   { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(1.2)' }, 'center');
    tl.to('.hero-tagline', { opacity: 1, y: 0, duration: 0.45 }, 'center');
    tl.to('.hero-sub',     { opacity: 1, duration: 0.35 }, 'center');
    tl.to('.cta-wrap',     { opacity: 1, y: 0, duration: 0.4 }, 'center');
    tl.to('.platforms',    { opacity: 1, duration: 0.35 }, 'center');

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

  // 챔피언 이미지 프리로드
  Object.values(champData).forEach(d => {
    if (d.img) { const img = new Image(); img.src = d.img; }
  });

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
            { x: 0, rotation: 0, scale: 1, duration: 0.55, ease: 'back.out(1.4)' }
          );
        } else if (key === 'boltz') {
          // 멀리서 돌진 그랩 — 작게 시작해 카메라 앞으로 빠르게 달려오다 오버슛 후 딱 잡힘
          gsap.timeline()
            .fromTo(imgEl,
              { scale: 0.22, x: 40, y: 20, opacity: 1 },
              { scale: 1.1, x: 0, y: 0, duration: 0.32, ease: 'power4.out' }
            )
            .to(imgEl, { scale: 1, duration: 0.2, ease: 'back.out(2.5)' });
        } else {
          // 케이틀린 — 스코프 포커스: 블러+확대 → 선명하게 스냅
          gsap.fromTo(imgEl,
            { x: 30, scale: 1.12, filter: 'blur(8px)', opacity: 1 },
            { x: 0, scale: 1, filter: 'blur(0px)', duration: 0.5, ease: 'power4.out' }
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
      tag: 'ANNOUNCEMENTS', category: '공지',
      title: '라이엇 게임즈 개인정보 처리방침\n변경 사항 안내',
      desc: '개인정보 처리방침의 일부 내용이 변경됩니다.',
      bgImg: 'images/jinx update bg.jpg',
      charImg: 'images/jinx update character.png',
      type: 'notice',
    },
    {
      tag: 'ANNOUNCEMENTS', category: '공지',
      title: 'PC방 전용 아바타\n아이템 안내',
      desc: 'PC방에서만 사용 가능한 아바타 아이템을 소개합니다.',
      bgImg: 'images/pc avatar bg.jpg',
      items: ['images/avatar item headphone.png', 'images/avatar item riot.png', 'images/avatar item backpack.png'],
      bg: 'linear-gradient(160deg, #0a1e2e 0%, #040e1c 100%)',
      type: 'notice',
    },
    {
      tag: '', category: '공지',
      title: '세나 기술 목록',
      desc: '세나의 모든 기술을 정리했습니다. 6월 10일에 2XKO에서 플레이하세요.',
      youtubeId: '8xbRJvATrsI',
      bg: 'linear-gradient(160deg, #1a0808 0%, #0d0404 100%)',
      type: 'notice',
    },
    {
      tag: 'UPDATE', category: '업데이트',
      title: '정상 등반: 2XKO의\n새로운 PvE 모드',
      desc: '좋아하는 챔피언으로 매번 색다른 빌드를 실험해 보세요. PvP에선 경험할 수 없었던 재미를 지금 소개합니다.',
      bgImg: 'images/pve mode bg.jpg',
      charImg: 'images/sena thresh.png',
      bg: 'linear-gradient(160deg, #0a1e0a 0%, #040e04 100%)',
      type: 'update',
    },
    {
      tag: 'UPDATE', category: '업데이트',
      title: '수영장 파티 메가 세트 출시',
      desc: '분위기를 달굴 때로군요. 수영장 파티 및 야밤의 수영장 파티 메가 세트를 만나 보세요.',
      youtubeId: 'enfAc20FFf4',
      bg: 'linear-gradient(160deg, #0a1a2e 0%, #040a1c 100%)',
      type: 'update',
    },
    {
      tag: 'UPDATE', category: '업데이트',
      title: '2XKO 긴급 패치: 1.1.5\n(2026년 4월 29일)',
      desc: '이번 긴급 패치에서는 분노의 위력과 해방 미터 생성량, 관전 기능의 버그가 수정됩니다.',
      bgImg: 'images/bug fix bg.jpg',
      bg: 'linear-gradient(160deg, #1a0e0a 0%, #0d0604 100%)',
      type: 'update',
    },
    {
      tag: 'COMMUNITY', category: '커뮤니티',
      title: '2026 EVO 2XKO\n부문 안내',
      desc: '6월 26일, 2026 EVO의 막이 오릅니다. 2XKO 부문에 대해 알아야 할 모든 것을 지금 확인하세요.',
      bgImg: 'images/2xko x evo bg.jpg',
      logoItems: ['images/2xko major.png', 'images/evo.png'],
      bg: 'linear-gradient(160deg, #1a0a2e 0%, #0d0520 100%)',
      type: 'community',
    },
    {
      tag: 'COMMUNITY', category: '커뮤니티',
      title: '2026 EVO Japan:\n2XKO 부문 참가 신청 안내',
      desc: '2XKO의 다음 메이저 대회가 EVO Japan에서 열립니다. 참가상인 핏빛달 아칼리 스킨도 기대해 주세요.',
      bgImg: 'images/2xko x evo jp.jpg',
      bg: 'linear-gradient(160deg, #0a1a2e 0%, #04101c 100%)',
      type: 'community',
    },
    {
      tag: 'COMMUNITY', category: '커뮤니티',
      title: '2XKO 커뮤니티 대회 지원\n- 프로그램 개시',
      desc: '2XKO의 지역 대회에 참가하고 게임 내 보상을 획득하세요. 전 세계 플레이어를 대상으로 시행됩니다.',
      bgImg: 'images/community.jpg',
      bg: 'linear-gradient(160deg, #0a1a1a 0%, #040e0e 100%)',
      type: 'community',
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
        FEATURED_W: Math.round(areaW * 0.50),
        CARD_W:     Math.round(areaW * 0.38),
        CARD_GAP:   Math.round(areaW * 0.02),
      };
    };
    let { FEATURED_W, CARD_W, CARD_GAP } = getCardSizes();
    const FEATURED_SCALE = 1;
    const SIDE_SCALE = 1;

    const newsSection = document.querySelector('.news-section');
    const newsBgEl = document.getElementById('newsBg');
    const updateSectionBg = (idx) => {
      const item = filteredData[idx];
      if (!item) return;
      if (newsBgEl) {
        if (item.bgImg) {
          newsBgEl.style.backgroundImage = `url('${item.bgImg}')`;
          newsBgEl.classList.add('has-img');
        } else {
          newsBgEl.classList.remove('has-img');
          newsBgEl.style.backgroundImage = '';
        }
      }
      if (newsSection && item.bg) {
        newsSection.style.transition = 'background 0.5s ease';
        newsSection.style.background = item.bg.replace('160deg', '135deg');
      }
    };

    const buildNewsCards = () => {
      newsCarousel.innerHTML = '';
      newsDots.innerHTML = '';

      filteredData.forEach((item, i) => {
        // 카드
        const card = document.createElement('div');
        card.className = 'news-card' + (i === newsIndex ? ' is-featured' : '');
        card.dataset.index = i;
        const bgStyle = item.bgImg
          ? `background-image:url('${item.bgImg}');background-size:cover;background-position:center`
          : `background:${item.bg || '#0d1629'}`;
        const bgClass = item.bgImg ? 'news-card-bg has-img' : 'news-card-bg';
        card.innerHTML = `
          <div class="news-card-inner">
            <div class="${bgClass}" style="${bgStyle}"></div>
            ${item.youtubeId ? `
              <div class="news-card-yt-thumb" style="background-image:url('https://img.youtube.com/vi/${item.youtubeId}/maxresdefault.jpg');background-size:cover;background-position:center;position:absolute;inset:0;z-index:1;"></div>
              <iframe class="news-card-yt" src="" data-ytid="${item.youtubeId}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen style="opacity:0;transition:opacity 0.5s;"></iframe>
            ` : ''}
            ${!item.youtubeId ? `<div class="news-card-overlay"></div>` : ''}
            ${item.charImg ? `<img class="news-card-char" src="${item.charImg}" alt="" aria-hidden="true">` : ''}
            ${item.items ? item.items.map((src, idx) => `<img class="news-card-item news-card-item--${idx}" src="${src}" alt="" aria-hidden="true">`).join('') : ''}
            ${item.logoItems ? `<div class="news-card-logos">${item.logoItems.map(src => `<img src="${src}" alt="" aria-hidden="true">`).join('<span class="news-card-logo-divider"></span>')}</div>` : ''}
            ${item.tag ? `<span class="news-card-tag">${item.tag}</span>` : ''}
            <div class="news-card-body">
              ${item.category ? `<p class="news-card-category">${item.category}</p>` : ''}
              <h3 class="news-card-title">${item.title.replace(/\n/g,'<br>')}</h3>
              <p class="news-card-desc">${item.desc}</p>
              <button class="news-card-btn">자세히 보기 <svg class="btn-arrow" viewBox="0 0 80 30" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="butt" width="40" height="15"><line class="btn-arrow-line" x1="8" y1="20" x2="72" y2="20"/><line class="btn-arrow-head" x1="72" y1="20" x2="58" y2="6"/></svg></button>
            </div>
          </div>`;
        newsCarousel.appendChild(card);

        // 캐릭터 이미지: 초기 위치 고정 후 featured일 때 fade-in
        if (item.charImg) {
          const charEl = card.querySelector('.news-card-char');
          if (charEl) {
            gsap.set(charEl, { opacity: 0, y: 0, xPercent: -50 });
          }
        }

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

    const animateCharOnFeatured = () => {
      const item = filteredData[newsIndex];
      const cards = newsCarousel.querySelectorAll('.news-card');
      const featuredCard = Array.from(cards).find(c => parseInt(c.dataset.index) === newsIndex);

      // 나머지 카드 캐릭터/아이템 숨김
      cards.forEach(c => {
        if (parseInt(c.dataset.index) !== newsIndex) {
          c.querySelectorAll('.news-card-char').forEach(el => { gsap.killTweensOf(el); gsap.set(el, { opacity: 0, y: 0, xPercent: -50 }); });
          c.querySelectorAll('.news-card-item').forEach(el => { gsap.killTweensOf(el); gsap.set(el, { opacity: 0, y: 0 }); });
        }
      });

      if (!featuredCard || !item) return;

      // 캐릭터 fade-in + float
      const charEl = featuredCard.querySelector('.news-card-char');
      if (charEl) {
        gsap.killTweensOf(charEl);
        gsap.fromTo(charEl,
          { opacity: 0, y: 40, xPercent: -50 },
          {
            opacity: 1, y: 0, xPercent: -50, duration: 0.8, ease: 'power2.out',
            onComplete: () => {
              gsap.to(charEl, { y: -10, xPercent: -50, duration: 2.8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
            }
          }
        );
      }

      // 아이템 순차 fade-in + float
      featuredCard.querySelectorAll('.news-card-item').forEach((el, i) => {
        gsap.killTweensOf(el);
        gsap.fromTo(el,
          { opacity: 0, y: 24 },
          {
            opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.15 + i * 0.12,
            onComplete: () => {
              gsap.to(el, { y: -8, duration: 2.4 + i * 0.3, repeat: -1, yoyo: true, ease: 'sine.inOut' });
            }
          }
        );
      });
    };

    const stopAllYoutube = () => {
      newsCarousel.querySelectorAll('.news-card-yt').forEach(iframe => {
        iframe.src = '';
        iframe.style.opacity = '0';
      });
    };

    const playFeaturedYoutube = () => {
      const item = filteredData[newsIndex];
      if (!item || !item.youtubeId) return;
      const cards = newsCarousel.querySelectorAll('.news-card');
      const featuredCard = Array.from(cards).find(c => parseInt(c.dataset.index) === newsIndex);
      if (!featuredCard) return;
      const iframe = featuredCard.querySelector('.news-card-yt');
      if (iframe) {
        iframe.style.opacity = '0';
        iframe.src = `https://www.youtube.com/embed/${item.youtubeId}?autoplay=1&mute=1&loop=1&playlist=${item.youtubeId}&controls=0&rel=0`;
        iframe.onload = () => { iframe.style.opacity = '1'; };
      }
    };

    const goNews = (idx) => {
      newsIndex = ((idx % filteredData.length) + filteredData.length) % filteredData.length;
      // 이전 featured 카드 캐릭터/아이템/유튜브 즉시 초기화
      newsCarousel.querySelectorAll('.news-card-char').forEach(el => { gsap.killTweensOf(el); gsap.set(el, { opacity: 0, y: 0, xPercent: -50 }); });
      newsCarousel.querySelectorAll('.news-card-item').forEach(el => { gsap.killTweensOf(el); gsap.set(el, { opacity: 0, y: 0 }); });
      stopAllYoutube();
      positionCards(true);
      updateSectionBg(newsIndex);
      playFeaturedYoutube();
      gsap.delayedCall(0.2, animateCharOnFeatured);
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

        const total = cards.length;
        cards.forEach((card, i) => {
          let offset = i - newsIndex;
          if (offset > total / 2)  offset -= total;
          if (offset < -total / 2) offset += total;
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
        newsIndex = 0;
        buildNewsCards();
        animateCharOnFeatured();
        playFeaturedYoutube();
      });
    });

    buildNewsCards();
    animateCharOnFeatured();
    playFeaturedYoutube();
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

  /* ── 모바일 햄버거 메뉴 ── */
  const hamBtn = document.querySelector('.ham-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileBackdrop = document.querySelector('.mobile-menu-backdrop');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .mobile-nav-cta');

  const openMenu = () => {
    hamBtn.classList.add('is-open');
    hamBtn.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('is-open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    hamBtn.classList.remove('is-open');
    hamBtn.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  hamBtn.addEventListener('click', () => {
    mobileMenu.classList.contains('is-open') ? closeMenu() : openMenu();
  });

  mobileBackdrop.addEventListener('click', closeMenu);
  mobileNavLinks.forEach(link => link.addEventListener('click', closeMenu));
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) closeMenu();
  });
});
