

  /* ── STEP 1 카드·칩 선택 ── */
  function pickCard(el) {
    document.querySelectorAll('.place-card').forEach(c => c.classList.remove('on'));
    el.classList.add('on');
    checkStep0Btn();
  }
  function pickChip(el) {
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('on'));
    el.classList.add('on');
    checkStep0Btn();
  }
  function checkStep0Btn() {
    const hasCard = !!document.querySelector('.place-card.on');
    const hasChip = !!document.querySelector('.chip.on');
    document.getElementById('btnStep0Next').disabled = !(hasCard && hasChip);
  }

  /* ══ Scenario tab switch (새 섹션) ══ */
  function setScenario(id, tabEl) {
    document.querySelectorAll('.scenario-sec .scenario-tab').forEach(t => t.classList.remove('on'));
    tabEl.classList.add('on');
    document.querySelectorAll('.scenario-panel').forEach(p => p.classList.remove('show'));
    document.getElementById(id).classList.add('show');
  }

  /* ══ Tab switch ══ */
  function switchTab(btn) {
    btn.closest('.demo-tabs').querySelectorAll('.demo-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
  }

  /* ══ FAQ accordion ══ */
  function toggleFaq(idx) {
    const item = document.getElementById('faq-' + idx);
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  }

  /* ══ Modal ══ */
  const modalOverlay   = document.getElementById('modalOverlay');
  const openModalBtn   = document.getElementById('openModalBtn');
  const closeModalBtn  = document.getElementById('closeModalBtn');
  const heroCtaBtn     = document.getElementById('heroCtaBtn');
  const formSection    = document.getElementById('formSection');
  const paymentSection = document.getElementById('paymentSection');
  const form           = document.getElementById('experienceForm');

  /* ── Modal Step Control ── */
  function showModalStep(n) {
    /* step0 제거 후: modalStep1=index 0, modalStep2=index 1 */
    const steps = document.querySelectorAll('.modal-step');
    steps.forEach((s, i) => s.classList.toggle('active', i === n));
    const pct = [50, 100];
    document.getElementById('modalPbar').style.width = pct[n] + '%';
  }

  function openModal() {
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    showModalStep(0);   /* 바로 가입 정보 단계로 시작 */
  }

  openModalBtn.onclick = openModal;
  if (heroCtaBtn) heroCtaBtn.onclick = openModal;
  closeModalBtn.onclick = () => { modalOverlay.classList.remove('active'); document.body.style.overflow = ''; };

  /* ══ 휴대폰 인증 ══ */
  const phoneInput     = document.getElementById('phoneInput');
  const sendCodeBtn    = document.getElementById('sendCodeBtn');
  const verifyCodeRow  = document.getElementById('verifyCodeRow');
  const codeInput      = document.getElementById('codeInput');
  const verifyTimer    = document.getElementById('verifyTimer');
  const confirmCodeBtn = document.getElementById('confirmCodeBtn');
  const verifyStatus   = document.getElementById('verifyStatus');

  let timerInterval = null, phoneVerified = false, generatedCode = '';

  function startTimer(seconds) {
    clearInterval(timerInterval);
    let remain = seconds;
    timerInterval = setInterval(() => {
      remain--;
      const m = String(Math.floor(remain / 60)).padStart(1, '0');
      const s = String(remain % 60).padStart(2, '0');
      verifyTimer.textContent = m + ':' + s;
      if (remain <= 0) {
        clearInterval(timerInterval);
        verifyTimer.textContent = '0:00';
        verifyStatus.className = 'verify-status error';
        verifyStatus.textContent = '인증 시간이 만료되었습니다. 다시 발송해주세요.';
        codeInput.disabled = true;
        confirmCodeBtn.disabled = true;
      }
    }, 1000);
  }

  sendCodeBtn.addEventListener('click', () => {
    const phone = phoneInput.value.replace(/\D/g, '');
    if (phone.length < 10 || phone.length > 11) {
      verifyStatus.className = 'verify-status error';
      verifyStatus.textContent = '올바른 휴대폰 번호를 입력해주세요.';
      verifyStatus.style.display = 'block';
      phoneInput.classList.add('input-error');
      setTimeout(() => phoneInput.classList.remove('input-error'), 400);
      return;
    }
    generatedCode = String(Math.floor(100000 + Math.random() * 900000));
    console.log('[개발용] 인증번호:', generatedCode);
    phoneInput.disabled = true;
    sendCodeBtn.textContent = '재발송';
    sendCodeBtn.classList.add('sent');
    codeInput.disabled = false;
    confirmCodeBtn.disabled = false;
    phoneVerified = false;
    verifyCodeRow.classList.add('visible');
    verifyStatus.className = 'verify-status success';
    verifyStatus.textContent = '인증번호가 발송되었습니다. (3분 내 입력)';
    verifyStatus.style.display = 'block';
    codeInput.value = '';
    startTimer(180);
  });

  confirmCodeBtn.addEventListener('click', () => {
    if (codeInput.value.trim().length > 0) {
      clearInterval(timerInterval);
      phoneVerified = true;
      phoneInput.disabled = false;
      codeInput.disabled = true;
      confirmCodeBtn.disabled = true;
      sendCodeBtn.disabled = true;
      verifyTimer.textContent = '';
      verifyStatus.className = 'verify-status success';
      verifyStatus.textContent = '✓ 인증이 완료되었습니다.';
    } else {
      verifyStatus.className = 'verify-status error';
      verifyStatus.textContent = '인증번호를 입력해주세요.';
      codeInput.classList.add('input-error');
      setTimeout(() => codeInput.classList.remove('input-error'), 400);
    }
  });

  /* ══ 약관 전체 동의 ══ */
  const agreeAll   = document.getElementById('agreeAll');
  const agreeItems = document.querySelectorAll('.agree-item');
  if (agreeAll) {
    agreeAll.addEventListener('change', () => { agreeItems.forEach(item => item.checked = agreeAll.checked); });
    agreeItems.forEach(item => { item.addEventListener('change', () => { agreeAll.checked = [...agreeItems].every(i => i.checked); }); });
  }

  /* ══ 비밀번호 실시간 유효성 표시 ══ */
  (function () {
    const pwInput = document.getElementById('passwordInput');
    const pwConfirmInput = document.getElementById('passwordConfirmInput');
    const pwHint = document.getElementById('passwordHint');
    const pwPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,16}$/;
    if (pwInput) {
      pwInput.addEventListener('input', () => {
        if (pwPattern.test(pwInput.value)) {
          pwHint.style.color = '#3182f6';
          pwHint.textContent = '사용 가능한 비밀번호입니다.';
        } else {
          pwHint.style.color = '#f04452';
          pwHint.textContent = '6~16자의 영문, 숫자, 특수문자를 조합하여 만들어 주세요.';
        }
      });
    }
    if (pwConfirmInput) {
      pwConfirmInput.addEventListener('input', () => {
        if (pwConfirmInput.value && pwInput.value !== pwConfirmInput.value) {
          pwHint.style.color = '#f04452';
          pwHint.textContent = '비밀번호가 일치하지 않습니다.';
        } else if (pwConfirmInput.value && pwInput.value === pwConfirmInput.value) {
          pwHint.style.color = '#3182f6';
          pwHint.textContent = '비밀번호가 일치합니다.';
        }
      });
    }
  })();

  /* ══ 폼 제출 → 결제 섹션 ══ */
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let hasError = false;
    form.querySelectorAll('input[required]').forEach(input => {
      if (input.type === 'checkbox') {
        if (!input.checked) {
          const agreeItem = input.closest('.agreement-item');
          agreeItem.classList.add('agree-error');
          setTimeout(() => agreeItem.classList.remove('agree-error'), 400);
          hasError = true;
        }
      } else {
        if (!input.value.trim()) {
          input.classList.add('input-error');
          setTimeout(() => input.classList.remove('input-error'), 400);
          hasError = true;
        }
      }
    });
    if (hasError) return;

    /* ── 비밀번호 유효성 검사 ── */
    const pwInput = document.getElementById('passwordInput');
    const pwConfirmInput = document.getElementById('passwordConfirmInput');
    const pwHint = document.getElementById('passwordHint');
    const pwPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,16}$/;
    if (!pwPattern.test(pwInput.value)) {
      pwInput.classList.add('input-error');
      setTimeout(() => pwInput.classList.remove('input-error'), 400);
      pwHint.style.color = '#f04452';
      pwInput.focus();
      return;
    }
    if (pwInput.value !== pwConfirmInput.value) {
      pwConfirmInput.classList.add('input-error');
      setTimeout(() => pwConfirmInput.classList.remove('input-error'), 400);
      pwHint.style.color = '#f04452';
      pwHint.textContent = '비밀번호가 일치하지 않습니다.';
      pwConfirmInput.focus();
      return;
    }
    pwHint.style.color = '#8b95a1';

    if (!phoneVerified) {
      verifyStatus.className = 'verify-status error';
      verifyStatus.textContent = '휴대폰 번호 인증을 완료해주세요.';
      verifyStatus.style.display = 'block';
      phoneInput.classList.add('input-error');
      setTimeout(() => phoneInput.classList.remove('input-error'), 400);
      return;
    }
    showModalStep(1);
    document.querySelector('.modal-content').scrollTop = 0;
  });

  document.getElementById('paymentPrevBtn').onclick = () => {
    showModalStep(0);
    document.querySelector('.modal-content').scrollTop = 0;
  };

  document.getElementById('cardRegisterBtn').onclick = () => {
    const agree = document.getElementById('paymentAgree');
    if (!agree.checked) { alert('참빛북클럽 정기 결제 약관에 동의해주세요.'); return; }
    alert('카드등록 PG 연동 예정');
  };

  /* ══ 배너: 푸터 진입 시 숨김, 벗어나면 표시 ══ */
  (function () {
    const footer = document.querySelector('.site-footer');
    const banner = document.getElementById('floatingBanner');
    if (!footer || !banner) return;
    const obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          banner.classList.add('banner-hidden');
        } else {
          banner.classList.remove('banner-hidden');
        }
      });
    }, { threshold: 0.1 });
    obs.observe(footer);
  })();

/* ── 물감 번짐 Paint Fill ── */
  (function paintFill() {
    const canvas = document.getElementById('paintCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    var lastWidth = 0;

    function resize() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      lastWidth = canvas.offsetWidth;
    }
    resize();

    /* 모바일에서 스크롤 시 주소창 높이 변화로 resize 이벤트가 발생해
       캔버스가 초기화되는 문제를 방지 — 가로 너비가 실제로 바뀔 때만 재초기화 */
    var resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        var newWidth = canvas.offsetWidth;
        if (Math.abs(newWidth - lastWidth) > 5) {
          resize();
          init();
        }
      }, 200);
    });

    /* 물감 팔레트 — 밝고 따뜻한 노란색 + 베이지 계열 */
    const PALETTE = [
    [49, 130, 246],  // 메인 블루 (브랜드 컬러와 일치)
    [124, 58, 237],  // 포인트 퍼플
    [186, 230, 253], // 연한 하늘색 (부드러운 번짐용)
    [221, 214, 254], // 연한 연보라
    [240, 249, 255], // 아주 밝은 베이스 블루
];

    /* 방울이 떨어지는 위치 (비율) */
    const SPOTS = [
      [0.10, 0.12],
      [0.90, 0.88],
      [0.52, 0.50],
      [0.18, 0.82],
      [0.82, 0.18],
    ];

    let drops = [];

    function maxRadius(x, y) {
      const w = canvas.width, h = canvas.height;
      return Math.max(
        Math.hypot(x, y),
        Math.hypot(w - x, y),
        Math.hypot(x, h - y),
        Math.hypot(w - x, h - y)
      ) * 1.08;
    }

    /* 방울 하나를 초기화 (처음 등장 or 리셋) */
    function resetDrop(d, i) {
      var px = SPOTS[i % SPOTS.length][0];
      var py = SPOTS[i % SPOTS.length][1];
      d.x      = px * canvas.width;
      d.y      = py * canvas.height;
      d.color  = PALETTE[i % PALETTE.length];
      d.r      = 2;
      d.maxR   = maxRadius(d.x, d.y) * 0.55; /* 전체를 채우지 않도록 최대 반지름 제한 */
      d.alpha  = 1;
      d.dead   = false;
    }

    function init() {
      drops = [];
      /* 5개 방울을 1초 간격으로 순차 등장 */
      for (var i = 0; i < 5; i++) {
        var d = {};
        resetDrop(d, i);
        d.r = 2; /* 아직 시작 전 */
        drops.push(d);
        (function(drop){ drop.active = false; setTimeout(function(){ drop.active = true; }, i * 1000); })(d);
      }
    }

    function drawFrame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < drops.length; i++) {
        var d = drops[i];
        if (!d.active || d.r < 1) continue;
        var r = d.color[0], g = d.color[1], b = d.color[2];
        var prog = d.r / d.maxR;
        var a    = d.alpha;
        var grad;

        if (prog < 0.07) {
          /* 물방울 단계: 작고 선명 */
          grad = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r);
          grad.addColorStop(0,    'rgba('+r+','+g+','+b+','+(0.62*a)+')');
          grad.addColorStop(0.45, 'rgba('+r+','+g+','+b+','+(0.44*a)+')');
          grad.addColorStop(0.78, 'rgba('+r+','+g+','+b+','+(0.18*a)+')');
          grad.addColorStop(1,    'rgba('+r+','+g+','+b+',0)');
        } else {
          /* 번짐 단계: 퍼지면서 점점 흐려짐 */
          grad = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r);
          grad.addColorStop(0,    'rgba('+r+','+g+','+b+','+(0.50*a)+')');
          grad.addColorStop(0.5,  'rgba('+r+','+g+','+b+','+(0.38*a)+')');
          grad.addColorStop(0.82, 'rgba('+r+','+g+','+b+','+(0.24*a)+')');
          grad.addColorStop(1,    'rgba('+r+','+g+','+b+',0)');
        }

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }
    }

    var lastTs = 0;
    function frame(ts) {
      var dt = Math.min(ts - lastTs, 50);
      lastTs = ts;

      for (var i = 0; i < drops.length; i++) {
        var d = drops[i];
        if (!d.active) continue;

        /* 성장: 물방울 → 번짐 */
        if (d.r < d.maxR) {
          var prog = d.r / d.maxR;
          var spd  = prog < 0.07
            ? d.maxR / 30                              /* 물방울 순간 등장 */
            : (d.maxR / 190) * (1 - prog * 0.65);     /* 번짐 — 느리게 */
          d.r = Math.min(d.r + spd * (dt / 16), d.maxR);
        }

        /* 번진 뒤 서서히 사라짐 */
        if (d.r >= d.maxR * 0.92) {
          d.alpha -= 0.004 * (dt / 16);
          if (d.alpha <= 0) {
            /* 리셋 후 잠시 대기했다가 다시 등장 */
            d.active = false;
            (function(drop, idx){
              setTimeout(function(){
                resetDrop(drop, idx);
                drop.active = true;
              }, 800 + Math.random() * 600);
            })(d, i);
          }
        }
      }

      drawFrame();
      requestAnimationFrame(frame);
    }

    init();
    requestAnimationFrame(frame);
  })();
