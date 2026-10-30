// 安安的小手機 v0.2：鎖定畫面（照安安自己說的規則排版）
// 照片和內容都存在酒館的設定裡（妳自己的伺服器），不會出現在這個公開倉庫
(function () {
  const MOD = 'anan_phone';
  const ctx = () => SillyTavern.getContext();

  // 細線圖示（統一 1.6 粗、圓角）
  const P = {
    wifi: '<path d="M5 12.5a10 10 0 0 1 14 0"/><path d="M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19.5" r=".8"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    light: '<path d="M8 3h8l-1.5 6v11a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1V9z"/><path d="M12 13v2"/>',
    cam: '<path d="M4 8h3l2-2.5h6L17 8h3v11H4z"/><circle cx="12" cy="13.5" r="3.5"/>',
    mob: '<rect x="7" y="3" width="10" height="18" rx="2.5"/><path d="M11 18h2"/>',
    buds: '<path d="M7 14a3 3 0 0 1-3-3V9a3 3 0 0 1 6 0v9"/><path d="M17 14a3 3 0 0 0 3-3V9a3 3 0 0 0-6 0v9"/>',
    down: '<path d="M6 9l6 6 6-6"/>',
    line: '<path d="M4 11c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5-3.6 6.5-8 6.5c-.8 0-1.6-.1-2.3-.3L6 19.5l.6-3.2C5 15 4 13.2 4 11z"/>',
    cal: '<rect x="4" y="5.5" width="16" height="14.5" rx="2"/><path d="M4 10h16M9 3.5v4M15 3.5v4"/>',
    memo: '<path d="M6 3.5h9l3 3V20.5H6z"/><path d="M9 10h6M9 13.5h6M9 17h4"/>',
    web: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.5 2.5 14.5 0 17M12 3.5c-2.5 2.5-2.5 14.5 0 17"/>',
  };
  const ic = (k, s = 18) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[k] || P.memo}</svg>`;
  const APP = { line: ['LINE', '#8FC4AE'], cal: ['行事曆', '#9DB4D3'], memo: ['備忘錄', '#D9D6CF'], web: ['瀏覽器', '#C9B9D6'] };

  // 示範內容（中性字，真正的內容之後由角色自己寫，存在酒館設定裡）
  const DEMO = {
    lock: {
      date: '', time: '',
      weather: [{ place: '地點', temp: '20°', extra: '' }, { place: '地點', temp: '19°', extra: '雨10%' }],
      next: { when: '時間', what: '下一件事', mine: true },
      battery: { phone: 76, buds: 88 },
      quote: '這裡會放他的今日摘句。',
    },
    notes: [
      { app: 'line', from: '示範聯絡人', text: '這是一則示範通知', when: '現在', mine: true },
      { app: 'cal', from: '示範行程', text: '這是一則示範提醒', when: '三十分鐘後', mine: true },
      { app: 'line', from: '示範聯絡人', text: '這是另一則示範通知', when: '一小時前' },
    ],
  };

  function S() {
    const es = ctx().extensionSettings;
    if (!es[MOD]) es[MOD] = {};
    const s = es[MOD];
    if (!s.lock) s.lock = structuredClone(DEMO.lock);
    if (!Array.isArray(s.notes)) s.notes = structuredClone(DEMO.notes);
    if (!s.carrier) s.carrier = '中華電信';
    if (s.fab == null) s.fab = true;
    if (s.fabY == null) s.fabY = 42;
    return s;
  }
  const save = () => ctx().saveSettingsDebounced();
  const esc = (t) => String(t ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const CN = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
  const cn = (n) => (n <= 10 ? CN[n] : n < 20 ? '十' + CN[n - 10] : CN[Math.floor(n / 10)] + '十' + CN[n % 10]);

  let root, fab, timer;

  function build() {
    root = document.createElement('div');
    root.id = 'ap-root';
    root.hidden = true;
    root.innerHTML = `
      <div class="ap-dim"></div>
      <div class="ap-phone">
        <div class="ap-screen">
          <div class="ap-shade"></div>
          <div class="ap-top"><span class="ap-carrier"></span><span class="ap-notch"></span>
            <span class="ap-right">${ic('wifi', 15)}<span class="ap-pct"></span><button class="ap-x" type="button" aria-label="關掉小手機">${ic('x', 16)}</button></span></div>
          <div class="ap-lock">
            <div class="ap-date"></div>
            <div class="ap-time"></div>
            <div class="ap-wg">
              <div class="ap-sq ap-glass ap-weather"></div>
              <div class="ap-sq ap-glass ap-next"></div>
              <div class="ap-sq ap-glass ap-rings"></div>
            </div>
            <div class="ap-notes">
              <button class="ap-pill ap-glass" type="button"></button>
              <div class="ap-list"></div>
            </div>
            <div class="ap-btm">
              <div class="ap-cb ap-glass">${ic('light', 20)}</div>
              <div class="ap-quote"><small>今 日 摘 句</small><span></span></div>
              <div class="ap-cb ap-glass">${ic('cam', 20)}</div>
            </div>
            <div class="ap-hint">向 上 翻 開</div>
          </div>
          <div class="ap-home" hidden><div class="ap-wip">主畫面施工中 🚧<small>往下滑回到鎖定畫面</small></div></div>
          <div class="ap-bar"></div>
        </div>
      </div>`;
    document.documentElement.appendChild(root); // 掛在最外層，不受酒館主題的版面影響

    root.querySelector('.ap-dim').addEventListener('click', close);
    root.querySelector('.ap-x').addEventListener('click', close);
    root.querySelector('.ap-pill').addEventListener('click', () => root.querySelector('.ap-notes').classList.toggle('ap-open'));
    root.querySelector('.ap-list').addEventListener('click', (e) => { if (e.target.closest('.ap-note')) unlock(); });

    // 往上滑翻開、往下滑回鎖定（在通知清單裡滑不算）
    const scr = root.querySelector('.ap-screen');
    let y0 = null;
    scr.addEventListener('pointerdown', (e) => { y0 = e.target.closest('.ap-list') ? null : e.clientY; });
    scr.addEventListener('pointerup', (e) => {
      if (y0 == null) return;
      const d = y0 - e.clientY;
      if (d > 60 && isLocked()) unlock(); else if (d < -60 && !isLocked()) lock();
      y0 = null;
    });
    ['touchstart', 'touchmove', 'touchend', 'pointerdown', 'pointerup', 'click'].forEach((t) => root.addEventListener(t, (e) => e.stopPropagation(), { passive: true }));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !root.hidden) close(); });

    // 懸浮球：可以上下拖，放開記住位置；有新內容會冒點點
    fab = document.createElement('button');
    fab.id = 'ap-fab';
    fab.type = 'button';
    fab.setAttribute('aria-label', '安安的小手機');
    fab.innerHTML = ic('mob', 20) + '<span class="ap-badge"></span>';
    document.documentElement.appendChild(fab);
    let drag = null;
    fab.addEventListener('pointerdown', (e) => { drag = { y: e.clientY, moved: false }; fab.setPointerCapture(e.pointerId); });
    fab.addEventListener('pointermove', (e) => {
      if (!drag) return;
      if (Math.abs(e.clientY - drag.y) > 6) drag.moved = true;
      if (drag.moved) fab.style.top = Math.min(92, Math.max(6, (e.clientY / innerHeight) * 100)) + 'vh';
    });
    fab.addEventListener('pointerup', (e) => {
      if (!drag) return;
      if (drag.moved) { S().fabY = Math.min(92, Math.max(6, (e.clientY / innerHeight) * 100)); save(); } else open();
      drag = null;
    });
  }

  const isLocked = () => !root.querySelector('.ap-lock').hidden;
  function lock() { root.querySelector('.ap-lock').hidden = false; root.querySelector('.ap-home').hidden = true; }
  function unlock() { root.querySelector('.ap-lock').hidden = true; root.querySelector('.ap-home').hidden = false; }

  function tick() {
    const L = S().lock;
    const d = new Date();
    root.querySelector('.ap-time').textContent = L.time || String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
    root.querySelector('.ap-date').textContent = L.date || `${cn(d.getMonth() + 1)}月${cn(d.getDate())}日・週${'日一二三四五六'[d.getDay()]}`;
  }

  function ring(pct, k) {
    const p = Math.max(0, Math.min(100, Number(pct) || 0));
    return `<div class="ap-ring" style="background:conic-gradient(#F6F3EC 0 ${p}%,rgba(255,255,255,.2) ${p}% 100%)"><span>${ic(k, 14)}</span></div>`;
  }

  function paint() {
    const s = S(), L = s.lock;
    const scr = root.querySelector('.ap-screen');
    scr.style.backgroundImage = s.lockWall ? `url("${s.lockWall}")` : '';
    scr.classList.toggle('ap-nowall', !s.lockWall);
    root.querySelector('.ap-carrier').textContent = s.carrier;
    root.querySelector('.ap-pct').textContent = (L.battery?.phone ?? 76) + '%';
    root.querySelector('.ap-weather').innerHTML = '<div class="ap-lb">天 氣</div>' + (L.weather || []).slice(0, 2)
      .map((w) => `<div>${esc(w.place)} <b>${esc(w.temp)}</b>${w.extra ? '・' + esc(w.extra) : ''}</div>`).join('');
    const n = L.next || {};
    root.querySelector('.ap-next').innerHTML = `<div class="ap-lb">下 一 件 事</div><div><b>${esc(n.when)}</b></div><div>${esc(n.what)}${n.mine ? ' <span class="ap-dot">●</span>' : ''}</div>`;
    root.querySelector('.ap-rings').innerHTML = ring(L.battery?.phone, 'mob') + ring(L.battery?.buds, 'buds');
    root.querySelector('.ap-quote span').textContent = L.quote || '';

    const notes = s.notes.slice(0, 8);
    const box = root.querySelector('.ap-notes');
    box.hidden = !notes.length;
    box.classList.remove('ap-open');
    const apps = [...new Set(notes.map((x) => x.app))];
    const mine = notes.some((x) => x.mine);
    root.querySelector('.ap-pill').innerHTML = (mine ? '<span class="ap-me"></span>' : '')
      + apps.map((a) => `<span class="ap-ad" style="background:${(APP[a] || APP.memo)[1]}"></span>`).join('')
      + `<span>${notes.length} 則新通知</span>${ic('down', 14)}`;
    root.querySelector('.ap-list').innerHTML = notes.map((x) => {
      const [name, col] = APP[x.app] || APP.memo;
      return `<div class="ap-note ap-glass">
        <div class="ap-hd"><span class="ap-ic">${ic(x.app, 14)}</span>${esc(name)}<span class="${x.mine ? 'ap-me' : 'ap-ad'}" style="${x.mine ? '' : 'background:' + col}"></span><span class="ap-when">${esc(x.when)}</span></div>
        <div class="ap-tt">${esc(x.from)}</div><div class="ap-tx">${esc(x.text)}</div></div>`;
    }).join('');
    tick();
  }

  function badge() {
    const s = S();
    fab.hidden = !s.fab;
    fab.style.top = s.fabY + 'vh';
    const b = fab.querySelector('.ap-badge');
    b.hidden = !s.unseen;
    b.classList.toggle('ap-mine', !!s.unseenMine);
  }

  function open() {
    const s = S();
    paint(); lock(); root.hidden = false;
    if (s.unseen) { s.unseen = false; s.unseenMine = false; save(); badge(); }
    clearInterval(timer); timer = setInterval(tick, 15000);
  }
  function close() { root.hidden = true; clearInterval(timer); }

  function shrink(file) {
    return new Promise((res, rej) => {
      const img = new Image();
      img.onload = () => {
        const w = Math.min(900, img.width), h = Math.round(img.height * (w / img.width));
        const c = document.createElement('canvas'); c.width = w; c.height = h;
        c.getContext('2d').drawImage(img, 0, 0, w, h);
        URL.revokeObjectURL(img.src);
        res(c.toDataURL('image/jpeg', 0.82));
      };
      img.onerror = rej;
      img.src = URL.createObjectURL(file);
    });
  }

  function settingsPanel() {
    const box = document.createElement('div');
    box.className = 'ap-settings';
    box.innerHTML = `
      <div class="inline-drawer">
        <div class="inline-drawer-toggle inline-drawer-header"><b>📱 安安的小手機</b><div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div></div>
        <div class="inline-drawer-content">
          <label class="checkbox_label"><input type="checkbox" class="ap-fabchk"> 顯示小手機懸浮球</label>
          <div class="ap-row">鎖定畫面桌布</div>
          <img class="ap-prev" alt="桌布預覽">
          <div class="ap-row">
            <label class="menu_button ap-pick">選擇照片<input type="file" accept="image/*" hidden></label>
            <div class="menu_button ap-del">移除</div>
            <div class="menu_button ap-open">打開小手機</div>
            <div class="menu_button ap-test">試試紅點</div>
          </div>
        </div>
      </div>`;
    const target = document.getElementById('extensions_settings2') || document.getElementById('extensions_settings');
    if (target) target.appendChild(box);
    const prev = box.querySelector('.ap-prev');
    const show = () => { prev.src = S().lockWall || ''; prev.hidden = !S().lockWall; };
    show();
    const chk = box.querySelector('.ap-fabchk');
    chk.checked = S().fab;
    chk.addEventListener('change', () => { S().fab = chk.checked; save(); badge(); });
    box.querySelector('.ap-pick input').addEventListener('change', async (e) => {
      const f = e.target.files[0]; if (!f) return;
      try { S().lockWall = await shrink(f); save(); show(); } catch (err) { alert('照片讀不進來，換一張試試'); }
      e.target.value = '';
    });
    box.querySelector('.ap-del').addEventListener('click', () => { delete S().lockWall; save(); show(); });
    box.querySelector('.ap-open').addEventListener('click', open);
    box.querySelector('.ap-test').addEventListener('click', () => { const s = S(); s.unseen = true; s.unseenMine = true; save(); badge(); });
  }

  jQuery(() => { build(); settingsPanel(); badge(); });
})();
