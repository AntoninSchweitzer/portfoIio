/* ============================================================
   NAVAL PORTFOLIO — shared runtime (all pages)
   1. Full-page background VIDEO (assets/bg-video.mp4) + legibility veil
   2. Realistic procedural WATER page-transition (animated rippling surface)
   3. Octagon + gold-frame bevel applied to every .nb card
   ============================================================ */
(function () {

  var DUR = 900;
  var EASE = 'cubic-bezier(.65,0,.2,1)';

  /* ---------- helper: build a seamless wave <path> ---------- */
  function wavePath(amp, wl, count, baseY, floor) {
    // sine-ish wave via cubic beziers, `count` full wavelengths of width `wl`
    var d = 'M0,' + baseY;
    var x = 0;
    for (var i = 0; i < count; i++) {
      var q = wl / 4;
      d += ' C' + (x + q) + ',' + (baseY - amp) + ' ' + (x + wl - q) + ',' + (baseY - amp) + ' ' + (x + wl / 2) + ',' + baseY;
      d += ' C' + (x + wl / 2 + q) + ',' + (baseY + amp) + ' ' + (x + wl - q) + ',' + (baseY + amp) + ' ' + (x + wl) + ',' + baseY;
      x += wl;
    }
    d += ' L' + x + ',' + floor + ' L0,' + floor + ' Z';
    return d;
  }
  var WL = 460, N = 8, TOTAL = WL * N;            // 8 wavelengths wide
  var shift = WL * 4;                              // translate by 4 wavelengths (seamless)

  /* ---------- styles ---------- */
  var css =
    /* ----- background image ----- */
    'html{background:#F4EFE5;}' +
    'body{background-image:none !important;background-color:transparent !important;}' +
    '#bg-video-layer{position:fixed;inset:0;z-index:-3;pointer-events:none;' +
      "background:url('assets/bg-naval.png') center center / cover no-repeat fixed;}" +
    '#bg-video-veil{position:fixed;inset:0;z-index:-2;pointer-events:none;' +
      'background:linear-gradient(180deg,rgba(244,239,229,.34) 0%,rgba(242,237,227,.30) 45%,rgba(236,230,219,.40) 100%);}' +
    /* ----- water transition ----- */
    '#sea-tx{position:fixed;inset:0;z-index:99999;overflow:hidden;pointer-events:none;display:none;}' +
    '#sea-tx.on{display:block;}' +
    '#sea-tx .water{position:absolute;left:0;bottom:0;width:100%;height:135vh;' +
      'transform:translateY(101%);will-change:transform;' +
      'transition:transform ' + DUR + 'ms ' + EASE + ';}' +
    '#sea-tx .body{position:absolute;left:0;right:0;bottom:0;top:78px;' +
      'background:linear-gradient(180deg,#2f9fc4 0%,#1c7fa6 20%,#13607f 50%,#0C1B2B 100%);}' +
    '#sea-tx .surf{position:absolute;left:0;top:0;width:' + TOTAL + 'px;height:90px;}' +
    '#sea-tx .surf svg{display:block;width:' + TOTAL + 'px;height:90px;}' +
    '#sea-tx .s1{animation:seaA 7s linear infinite;}' +
    '#sea-tx .s2{animation:seaB 5s linear infinite;opacity:.55;top:14px;}' +
    '#sea-tx .s3{animation:seaA 11s linear infinite;opacity:.32;top:30px;}' +
    '#sea-tx .glint{position:absolute;left:0;top:60px;width:100%;height:50vh;' +
      'background:repeating-linear-gradient(90deg,rgba(255,255,255,.05) 0 2px,transparent 2px 90px);opacity:.5;}' +
    '@keyframes seaA{from{transform:translateX(0)}to{transform:translateX(-' + shift + 'px)}}' +
    '@keyframes seaB{from{transform:translateX(0)}to{transform:translateX(' + shift + 'px)}}' +
    '#sea-tx.cover .water{transform:translateY(0);}' +
    '#sea-tx.drain .water{transform:translateY(101%);}' +
    '#sea-tx.instant .water{transition:none;}' +
    /* ----- octagon gold bevel ----- */
    '.nbw{position:relative;display:block;background:#C9963A;height:100%;' +
      'clip-path:polygon(17px 0,calc(100% - 17px) 0,100% 17px,100% calc(100% - 17px),calc(100% - 17px) 100%,17px 100%,0 calc(100% - 17px),0 17px);' +
      'transition:transform .25s ease,box-shadow .25s ease;}' +
    '.nbw.sm{clip-path:polygon(12px 0,calc(100% - 12px) 0,100% 12px,100% calc(100% - 12px),calc(100% - 12px) 100%,12px 100%,0 calc(100% - 12px),0 12px);}' +
    '.nbw>.nb{display:block;width:100%;height:100%;box-shadow:none !important;transform:none !important;' +
      'clip-path:polygon(15px 0,calc(100% - 15px) 0,100% 15px,100% calc(100% - 15px),calc(100% - 15px) 100%,15px 100%,0 calc(100% - 15px),0 15px);}' +
    '.nbw.sm>.nb{clip-path:polygon(10px 0,calc(100% - 10px) 0,100% 10px,100% calc(100% - 10px),calc(100% - 10px) 100%,10px 100%,0 calc(100% - 10px),0 10px);}' +
    '.nbw.hov:hover{transform:translateY(-3px);box-shadow:0 14px 38px rgba(12,27,43,.16) !important;}' +
    /* ----- mobile nav (burger + drawer) ----- */
    '.mob-burger{display:none;position:fixed;top:10px;right:16px;z-index:210;width:44px;height:44px;' +
      'border:1.5px solid #C9963A;background:rgba(12,27,43,.55);cursor:pointer;' +
      'flex-direction:column;align-items:center;justify-content:center;gap:5px;' +
      'clip-path:polygon(9px 0,calc(100% - 9px) 0,100% 9px,100% calc(100% - 9px),calc(100% - 9px) 100%,9px 100%,0 calc(100% - 9px),0 9px);}' +
    '.mob-burger span{display:block;width:20px;height:2px;background:#C9963A;border-radius:2px;' +
      'transition:transform .3s ease,opacity .2s ease;}' +
    '.mob-burger.open span:nth-child(1){transform:translateY(7px) rotate(45deg);}' +
    '.mob-burger.open span:nth-child(2){opacity:0;}' +
    '.mob-burger.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg);}' +
    '.mob-drawer{position:fixed;inset:64px 0 0 0;z-index:190;' +
      'background:linear-gradient(180deg,rgba(12,27,43,.985),rgba(10,22,36,.99));' +
      '-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px);' +
      'display:flex;flex-direction:column;padding:24px 26px 32px;overflow-y:auto;' +
      'opacity:0;visibility:hidden;transform:translateY(-10px);' +
      'transition:opacity .3s ease,transform .3s ease,visibility .3s;}' +
    '.mob-drawer.open{opacity:1;visibility:visible;transform:translateY(0);}' +
    '.mob-drawer .mdlabel{font-size:9.5px;letter-spacing:.22em;text-transform:uppercase;' +
      'color:#C9963A;font-weight:700;margin:4px 0 12px;display:flex;align-items:center;gap:9px;}' +
    '.mob-drawer .mdlabel::after{content:"";flex:1;height:1px;background:rgba(201,150,58,.3);}' +
    '.mob-link{display:flex;align-items:center;justify-content:space-between;gap:12px;' +
      'color:#E8EDF2;font-family:inherit;font-size:15px;letter-spacing:.1em;text-transform:uppercase;' +
      'font-weight:600;padding:17px 6px;border-bottom:1px solid rgba(157,175,190,.13);' +
      'text-decoration:none;transition:color .2s,padding .2s;}' +
    '.mob-link::after{content:"→";color:#C9963A;opacity:.45;font-size:16px;}' +
    '.mob-link.active{color:#C9963A;}.mob-link.active::after{opacity:1;}' +
    '.mob-link:active{color:#fff;padding-left:12px;}' +
    '.mob-cv{display:flex;align-items:center;justify-content:center;gap:9px;margin-top:22px;' +
      'background:#C9963A;color:#0C1B2B;font-weight:700;font-size:13px;letter-spacing:.16em;' +
      'padding:15px;text-decoration:none;' +
      'clip-path:polygon(11px 0,calc(100% - 11px) 0,100% 11px,100% calc(100% - 11px),calc(100% - 11px) 100%,11px 100%,0 calc(100% - 11px),0 11px);}' +
    '@media(max-width:960px){nav{padding:0 18px !important;}' +
      '.mob-burger{display:flex !important;}' +
      'nav > a[href="cv.dc.html"]{display:none !important;}}' +
    '@media print{#sea-tx,#bg-video-layer,.mob-burger,.mob-drawer{display:none !important;}#bg-video-veil{background:#fff !important;}' +
      '.nbw{clip-path:none !important;background:transparent !important;}.nbw>.nb{clip-path:none !important;}}';

  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  /* ---------- background image ---------- */
  function buildVideo() {
    if (document.getElementById('bg-video-layer')) return;
    var veil = document.createElement('div'); veil.id = 'bg-video-veil';
    var layer = document.createElement('div'); layer.id = 'bg-video-layer';
    var b = document.body || document.documentElement;
    b.insertBefore(layer, b.firstChild);
    b.insertBefore(veil, b.firstChild);
  }

  /* ---------- water transition overlay ---------- */
  function buildOverlay() {
    if (document.getElementById('sea-tx')) return document.getElementById('sea-tx');
    var svg = function (cls, amp, base) {
      return '<div class="surf ' + cls + '"><svg viewBox="0 0 ' + TOTAL + ' 90" preserveAspectRatio="none">' +
        '<path fill="#cfeef7" d="' + wavePath(amp, WL, N, base, 90) + '"/></svg></div>';
    };
    var o = document.createElement('div');
    o.id = 'sea-tx'; o.setAttribute('aria-hidden', 'true');
    o.innerHTML =
      '<div class="water">' +
        '<div class="body"></div>' +
        '<div class="glint"></div>' +
        svg('s3', 12, 40) + svg('s2', 16, 34) + svg('s1', 20, 30) +
      '</div>';
    (document.body || document.documentElement).appendChild(o);
    return o;
  }
  var overlay = buildOverlay();

  /* page arrives covered -> water recedes downward, then hide overlay */
  function reveal() {
    overlay.classList.add('on', 'instant', 'cover');
    overlay.offsetHeight;
    overlay.classList.remove('instant');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        overlay.classList.remove('cover');
        overlay.classList.add('drain');
      });
    });
    setTimeout(function () { overlay.classList.remove('on', 'cover'); }, DUR + 260);
  }

  /* ---------- mobile nav: burger + slide-down drawer ---------- */
  function buildMobileNav() {
    if (document.querySelector('.mob-burger')) return;
    var nav = document.querySelector('nav');
    if (!nav) return;
    var nc = nav.querySelector('.nc');
    if (!nc || !nc.querySelector('a')) return; // wait for nav to hydrate

    var burger = document.createElement('button');
    burger.type = 'button';
    burger.className = 'mob-burger';
    burger.setAttribute('aria-label', 'Ouvrir le menu');
    burger.setAttribute('aria-expanded', 'false');
    burger.innerHTML = '<span></span><span></span><span></span>';
    (document.body || document.documentElement).appendChild(burger);

    var drawer = document.createElement('nav');
    drawer.className = 'mob-drawer';
    drawer.setAttribute('aria-label', 'Navigation mobile');
    var html = '<div class="mdlabel">Navigation</div>';
    if (nc) {
      nc.querySelectorAll('a').forEach(function (a) {
        var active = a.classList.contains('active') ? ' active' : '';
        html += '<a class="mob-link' + active + '" href="' + a.getAttribute('href') + '">' +
          (a.textContent || '').trim() + '</a>';
      });
    }
    html += '<a class="mob-cv" href="cv.dc.html">VOIR LE CV ' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">' +
      '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/>' +
      '<line x1="12" y1="15" x2="12" y2="3"/></svg></a>';
    drawer.innerHTML = html;
    (document.body || document.documentElement).appendChild(drawer);

    function close() {
      burger.classList.remove('open');
      drawer.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Ouvrir le menu');
    }
    function toggle() {
      var open = !drawer.classList.contains('open');
      burger.classList.toggle('open', open);
      drawer.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    }
    burger.addEventListener('click', toggle);
    drawer.addEventListener('click', function (e) {
      if (e.target.closest('a')) close();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 960) close();
    });
  }

  function init() { buildVideo(); buildMobileNav(); reveal(); }  if (document.readyState === 'complete' || document.readyState === 'interactive') init();
  else window.addEventListener('DOMContentLoaded', init);
  window.addEventListener('pageshow', function (e) { if (e.persisted) { buildVideo(); reveal(); } });

  /* leaving -> water rises to cover, then navigate */
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (!href || a.target === '_blank') return;
    if (/^(https?:|mailto:|tel:|#)/.test(href)) return;
    if (!/\.html(\?.*)?$/.test(href)) return;
    if (a.href === location.href) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    overlay.classList.add('on');
    overlay.classList.remove('drain', 'instant');
    overlay.offsetHeight;
    overlay.classList.add('cover');
    setTimeout(function () { window.location.href = href; }, DUR - 60);
  });

  /* ---------- octagon gold bevel: wrap every .nb ---------- */
  function bevel() {
    document.querySelectorAll('.nb:not([data-nbdone])').forEach(function (el) {
      el.setAttribute('data-nbdone', '1');
      var w = document.createElement('div');
      w.className = 'nbw';
      if (el.classList.contains('nb-sm')) w.classList.add('sm');
      if (/\b(pc|ec|sc|cc)\b/.test(el.className)) w.classList.add('hov');
      var inline = el.getAttribute('style') || '';
      var m = inline.match(/box-shadow\s*:\s*[^;]+;?/i);
      if (m) w.style.boxShadow = m[0].replace(/box-shadow\s*:\s*/i, '').replace(/;$/, '');
      el.parentNode.insertBefore(w, el);
      w.appendChild(el);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bevel);
  else bevel();
  setTimeout(bevel, 250);
  setTimeout(bevel, 1000);
  setTimeout(buildMobileNav, 250);
  setTimeout(buildMobileNav, 1000);
  setTimeout(buildMobileNav, 2200);
})();
