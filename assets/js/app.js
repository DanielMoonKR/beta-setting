/* 땡큐캠핑 베타 앱 설치 안내 - 페이지 동작 스크립트 */
(function () {
  'use strict';

  /* ===== 설정: 여기만 바꾸면 됩니다 ===== */
  var CONFIG = {
    // true로 바꾸면 안드로이드 STEP 1 '테스트 참여하기' 버튼이 Google Play 테스트 링크로 열립니다.
    androidLinkOpen: false,
    // 열리는 시각이 확정되면 적어두세요. 이 시각이 지나면 버튼이 자동으로 열립니다.
    // 예: '2026-11-24T14:00:00+09:00'  (사용하지 않으면 null)
    androidLinkOpenAt: null,
    // 오픈채팅방 참여 코드 (본문 index.html의 #oc-code 글자와 같게 맞춰주세요)
    openChatCode: 'beta2026'
  };

  /* 크게 보기용 목업 목록 (기종별 순서) */
  var SHOTS = {
      android: [
        { id: 'a2', step: 2, src: 'assets/img/android-step2.webp', alt: 'Google Play 테스트 참여 페이지에서 Become a tester 버튼이 보이는 화면' },
        { id: 'a3', step: 3, src: 'assets/img/android-step3.webp', alt: '‘You are a tester.’ 문구로 테스터 승인이 확인된 화면' },
        { id: 'a4', step: 4, src: 'assets/img/android-step4.webp', alt: 'Google Play에서 땡큐캠핑 앱을 검색한 화면' },
        { id: 'a5', step: 5, src: 'assets/img/android-step5.webp', alt: '땡큐캠핑 베타 앱 시작 화면' }
      ],
      ios: [
        { id: 'i1', step: 1, src: 'assets/img/ios-step1.webp', alt: '받은메일함에서 ‘Dong Koo Kang via TestFlight’ 메일이 보이는 화면' },
        { id: 'i2', step: 2, src: 'assets/img/ios-step2.webp', alt: '초대 메일 본문의 View in TestFlight 버튼 화면' },
        { id: 'i3', step: 3, src: 'assets/img/ios-step3.webp', alt: 'TestFlight 초대 페이지의 3번 항목 초대코드와 TestFlight from the App Store 링크 화면' },
        { id: 'i4', step: 4, src: 'assets/img/ios-step4.webp', alt: 'App Store의 TestFlight 앱 화면' },
        { id: 'i5', step: 5, src: 'assets/img/ios-step5.webp', alt: 'TestFlight 시작하기 화면의 계속 버튼' },
        { id: 'i6', step: 6, src: 'assets/img/ios-step6.webp', alt: '코드 교환 창에 초대코드를 입력한 화면' },
        { id: 'i7', step: 7, src: 'assets/img/ios-step7.webp', alt: 'TestFlight 앱 목록에서 땡큐캠핑 설치 버튼이 보이는 화면' },
        { id: 'i8', step: 8, src: 'assets/img/ios-step8.webp', alt: '땡큐캠핑 베타 앱 시작 화면' }
      ],
      bug: [
        { id: 'b1', step: 1, src: 'assets/img/bug-step1.webp', alt: '마이페이지의 버그 제보 영역 화면' },
        { id: 'b2', step: 2, src: 'assets/img/bug-step2.webp', alt: '버그 제보의 4가지 구분 선택 화면' },
        { id: 'b3', step: 3, src: 'assets/img/bug-step3.webp', alt: '제보 내용 작성과 사진 첨부 화면' },
        { id: 'b4', step: 4, src: 'assets/img/bug-step4.webp', alt: '버그 제보 내역에서 답변완료 상태가 표시된 화면' }
      ]
    };

  var state = { os: '', detected: '', alertOpen: false, zoom: null, zoomFrom: '', osOpen: false, osFrom: '', bugOpen: false };
  var copyTimer = null;

  function $(id) { return document.getElementById(id); }
  function each(list, fn) { Array.prototype.forEach.call(list, fn); }
  function focusId(id) { var el = id && $(id); if (el && el.focus) el.focus(); }

  function joinIsOpen() {
    if (CONFIG.androidLinkOpen) return true;
    if (CONFIG.androidLinkOpenAt) {
      var t = Date.parse(CONFIG.androidLinkOpenAt);
      return !isNaN(t) && Date.now() >= t;
    }
    return false;
  }

  function cond(name) {
    switch (name) {
      case 'and.mine': return state.detected === 'android';
      case 'ios.mine': return state.detected === 'ios';
      case 'and.on': return state.os === 'android';
      case 'ios.on': return state.os === 'ios';
      case 'hasOs': return !!state.os;
      case 'noOs': return !state.os;
      case 'isAndroid': return state.os === 'android';
      case 'isIos': return state.os === 'ios';
      case 'joinLocked': return !joinIsOpen();
      case 'joinOpen': return joinIsOpen();
      case 'alertOpen': return state.alertOpen;
      case 'zoomOpen': return !!state.zoom;
      case 'osOpen': return state.osOpen;
      case 'bugOpen': return state.bugOpen;
    }
    return false;
  }

  function render() {
    each(document.querySelectorAll('[data-if]'), function (el) {
      el.hidden = !cond(el.getAttribute('data-if'));
    });
    each(document.querySelectorAll('[data-action="pick"][aria-pressed]'), function (b) {
      b.setAttribute('aria-pressed', String(state.os === b.getAttribute('data-os')));
    });
    if (state.zoom) {
      var list = SHOTS[state.zoom.group];
      var cur = list[state.zoom.idx];
      var img = $('zoom-img');
      img.src = cur.src;
      img.alt = cur.alt;
      $('zoom-label').textContent = 'STEP ' + cur.step;
      $('zoom-dialog').setAttribute('aria-label', 'STEP ' + cur.step + ' 화면 크게 보기');
      $('zoom-prev').setAttribute('aria-disabled', String(state.zoom.idx === 0));
      $('zoom-next').setAttribute('aria-disabled', String(state.zoom.idx === list.length - 1));
    }
    var lock = state.alertOpen || !!state.zoom || state.osOpen || state.bugOpen;
    document.documentElement.style.overflow = lock ? 'hidden' : '';
    document.body.style.overflow = lock ? 'hidden' : '';
  }

  function setState(patch) {
    var prev = {};
    var k;
    for (k in state) prev[k] = state[k];
    for (k in patch) state[k] = patch[k];
    render();
    if (prev.alertOpen !== state.alertOpen) focusId(state.alertOpen ? 'join-alert-ok' : 'join-btn');
    if (!!prev.zoom !== !!state.zoom) focusId(state.zoom ? 'zoom-close' : state.zoomFrom);
    if (prev.osOpen !== state.osOpen) focusId(state.osOpen ? 'os-close' : (state.osFrom || 'os-btn'));
    if (prev.bugOpen !== state.bugOpen) focusId(state.bugOpen ? 'bug-close' : 'bug-btn');
  }

  function pick(os) {
    setState({ os: os });
    setTimeout(function () {
      var el = $('steps');
      if (el && el.scrollIntoView) el.scrollIntoView({ block: 'start' });
    }, 60);
  }

  function findShot(id) {
    for (var g in SHOTS) {
      for (var i = 0; i < SHOTS[g].length; i++) {
        if (SHOTS[g][i].id === id) return { group: g, idx: i };
      }
    }
    return null;
  }

  function zoomGo(d) {
    if (!state.zoom) return;
    var n = state.zoom.idx + d;
    if (n >= 0 && n < SHOTS[state.zoom.group].length) setState({ zoom: { group: state.zoom.group, idx: n } });
  }

  function copyCode() {
    var done = function (ok) {
      $('copy-label').textContent = ok ? '복사됨' : '직접 복사';
      $('copy-msg').textContent = ok ? '참여 코드를 복사했어요.' : '복사할 수 없어요. 코드를 길게 눌러 복사해 주세요.';
      clearTimeout(copyTimer);
      copyTimer = setTimeout(function () {
        $('copy-label').textContent = '복사';
        $('copy-msg').textContent = '';
      }, 2500);
    };
    var fallback = function () {
      try {
        var el = $('oc-code');
        var sel = window.getSelection();
        if (el && sel) sel.selectAllChildren(el);
        done(!!(document.execCommand && document.execCommand('copy')));
      } catch (e) { done(false); }
    };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(CONFIG.openChatCode).then(function () { done(true); }, fallback);
      } else { fallback(); }
    } catch (e) { fallback(); }
  }

  /* 버튼 클릭 */
  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('[data-action]') : null;
    if (!t) return;
    var a = t.getAttribute('data-action');
    if (a === 'pick') pick(t.getAttribute('data-os'));
    else if (a === 'join-alert') setState({ alertOpen: true });
    else if (a === 'close-alert') setState({ alertOpen: false });
    else if (a === 'zoom') {
      var z = findShot(t.getAttribute('data-shot'));
      if (z) setState({ zoom: z, zoomFrom: t.id });
    }
    else if (a === 'zoom-close') setState({ zoom: null });
    else if (a === 'zoom-prev') zoomGo(-1);
    else if (a === 'zoom-next') zoomGo(1);
    else if (a === 'open-os') setState({ osOpen: true, osFrom: t.id });
    else if (a === 'close-os') setState({ osOpen: false });
    else if (a === 'open-bug') setState({ bugOpen: true });
    else if (a === 'close-bug') setState({ bugOpen: false });
    else if (a === 'copy-code') copyCode();
  });

  /* 모달 안 키보드: Esc로 닫기, Tab은 모달 안에서만 돌기, 크게 보기는 ←/→로 넘기기 */
  var CLOSE = {
    alert: function () { setState({ alertOpen: false }); },
    zoom: function () { setState({ zoom: null }); },
    os: function () { setState({ osOpen: false }); },
    bug: function () { setState({ bugOpen: false }); }
  };
  each(document.querySelectorAll('[data-dialog]'), function (dlg) {
    var kind = dlg.getAttribute('data-dialog');
    dlg.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' || e.key === 'Esc') { e.preventDefault(); CLOSE[kind](); return; }
      if (kind === 'zoom' && e.key === 'ArrowLeft') { e.preventDefault(); zoomGo(-1); return; }
      if (kind === 'zoom' && e.key === 'ArrowRight') { e.preventDefault(); zoomGo(1); return; }
      if (e.key === 'Tab') {
        var f = Array.prototype.slice.call(dlg.querySelectorAll('button, a[href]'));
        if (!f.length) return;
        e.preventDefault();
        var i = f.indexOf(document.activeElement);
        var n = e.shiftKey ? (i <= 0 ? f.length - 1 : i - 1) : (i === f.length - 1 ? 0 : i + 1);
        f[n].focus();
      }
    });
  });

  /* 접속한 폰 알아보기 ('내 폰' 표시만, 선택은 직접) */
  try {
    var ua = navigator.userAgent || '';
    if (/Android/i.test(ua)) state.detected = 'android';
    else if (/iPhone|iPod/i.test(ua)) state.detected = 'ios';
  } catch (e) {}

  render();
  if (CONFIG.androidLinkOpenAt && !CONFIG.androidLinkOpen) setInterval(render, 30000);
})();
