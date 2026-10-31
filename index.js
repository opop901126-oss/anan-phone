// 安安的小手機 v0.6.1：鎖定畫面＋主畫面三頁＋每 N 則自動更新＋備忘錄（照安安自己說的規則排版）
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
    phone: '<path d="M6.5 3.5h3l1.5 4.5-2 1.5a11 11 0 0 0 5.5 5.5l1.5-2 4.5 1.5v3a2 2 0 0 1-2 2C11 19.5 4.5 13 4.5 5.5a2 2 0 0 1 2-2z"/>',
    cart: '<path d="M3.5 4.5h2.2l2 10.5h9.8l2-7.5H6.8"/><circle cx="9.5" cy="19" r="1.3"/><circle cx="16.5" cy="19" r="1.3"/>',
    photo: '<rect x="3.5" y="5" width="17" height="14" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="M4 17l5-4.5 4 3.5 3-2.5 4 3.5"/>',
    music: '<path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/>',
    threads: '<circle cx="12" cy="12" r="3.5"/><path d="M15.5 12v1.5a2.5 2.5 0 0 0 5 0V12a8.5 8.5 0 1 0-3.5 6.9"/>',
    lock: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/><path d="M12 14.5v2.5"/>',
    book: '<path d="M6 4h11a1 1 0 0 1 1 1v15H7a2 2 0 0 1-2-2V5a1 1 0 0 1 1-1z"/><path d="M5 18a2 2 0 0 1 2-2h11"/>',
    wheat: '<path d="M12 21V7"/><path d="M12 7c-1.6-.8-2.4-2.2-2.4-3.6 1.6.8 2.4 2.2 2.4 3.6zm0 0c1.6-.8 2.4-2.2 2.4-3.6-1.6.8-2.4 2.2-2.4 3.6zM12 12c-1.8-.8-2.8-2.4-2.8-4 1.8.8 2.8 2.4 2.8 4zm0 0c1.8-.8 2.8-2.4 2.8-4-1.8.8-2.8 2.4-2.8 4zM12 17c-1.8-.8-2.8-2.4-2.8-4 1.8.8 2.8 2.4 2.8 4zm0 0c1.8-.8 2.8-2.4 2.8-4-1.8.8-2.8 2.4-2.8 4z"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    cloud: '<path d="M7 18.5a4.5 4.5 0 0 1-.5-9 6 6 0 0 1 11.5 1.5 3.75 3.75 0 0 1-.5 7.5z"/>',
    pen: '<path d="M4 20l1-4L16 5l3 3L8 19z"/><path d="M14 7l3 3"/>',
  };
  const ic = (k, s = 18) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[k] || P.memo}</svg>`;
  const APP = { line: ['LINE', '#8FC4AE'], cal: ['行事曆', '#9DB4D3'], memo: ['備忘錄', '#D9D6CF'], web: ['瀏覽器', '#C9B9D6'] };

  // 綠色小圖釘：整根都是綠色（安安說的）
  const PIN = '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#4F8A5E" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 14v6.5"/><path d="M9 3.5h6l-1 5 3 3.5H7l3-3.5z" stroke="#4F8A5E" fill="rgba(79,138,94,.15)"/></svg>';

  // 主畫面（照安安說的排；名字是中性的，真正的名字在設定裡填，存在酒館）
  const HOME = {
    dock: [{ k: 'phone', n: '電話' }, { k: 'line', n: 'LINE' }, { k: 'cal', n: '行事曆' }, { k: 'cam', n: '相機' }],
    folders: [{ n: '字裡行間', mini: ['check', 'cloud', 'book', 'pen'] }, { n: '日常庶務', mini: ['cal', 'memo', 'web', 'mob'] }],
    p1: [{ id: 'trivia', k: 'wheat', n: '拾穗小集' }],
    boxes: [
      { tone: 'oat', apps: [{ id: 'shop', k: 'cart', n: '日常物事' }, { id: 'food', k: 'pin', n: '餵食指南' }, { id: 'album', k: 'photo', n: '相簿' }] },
      { tone: 'sage', apps: [{ id: 'web', k: 'web', n: '瀏覽器' }, { id: 'memo', k: 'memo', n: '備忘錄' }, { id: 'music', k: 'music', n: '音樂' }] },
      { tone: 'honey', apps: [{ id: 'threads', k: 'threads', n: 'Threads' }, { id: 'secret', k: 'lock', n: '2026機密企劃' }] },
    ],
  };
  const RENAME = [['trivia', '拾穗小集'], ['food', '餵食指南']]; // 設定裡可以改名字的 App
  // 兩張桌布各自的存放位置（鎖定畫面沿用舊的名字，原本調好的不會跑掉）
  const WK = { lock: { img: 'lockWall', z: 'wallZ', x: 'wallX', y: 'wallY' }, home: { img: 'homeWall', z: 'homeZ', x: 'homeX', y: 'homeY' } };

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
    if (!s.auto) s.auto = { on: true, owner: '', n: 30, last: 0 };
    if (s.auto.memo == null) s.auto.memo = '';
    if (!s.names) s.names = {};
    if (s.homeTint == null) s.homeTint = 35; // 主畫面桌布上的深灰藍濾鏡（%）
    if (!s.memo) s.memo = { day: '', seq: 0, notes: [] }; // 他的備忘錄：內容由他在更新時自己寫
    return s;
  }
  const save = () => ctx().saveSettingsDebounced();
  const esc = (t) => String(t ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const CN = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
  const cn = (n) => (n <= 10 ? CN[n] : n < 20 ? '十' + CN[n - 10] : CN[Math.floor(n / 10)] + '十' + CN[n % 10]);

  let root, fab, timer, page = 0, swiped = 0;

  function build() {
    root = document.createElement('div');
    root.id = 'ap-root';
    root.hidden = true;
    root.innerHTML = `
      <div class="ap-dim"></div>
      <div class="ap-phone">
        <div class="ap-screen">
          <div class="ap-blur" data-w="lock"></div><div class="ap-wall" data-w="lock"></div>
          <div class="ap-shade"></div>
          <div class="ap-top"><span class="ap-left"><span class="ap-carrier"></span><span class="ap-net">5G</span><svg class="ap-sig" viewBox="0 0 17 11" width="17" height="11" aria-hidden="true"><rect x="0" y="7" width="2.8" height="4" rx=".7"/><rect x="4.6" y="5" width="2.8" height="6" rx=".7"/><rect x="9.2" y="2.6" width="2.8" height="8.4" rx=".7"/><rect x="13.8" y="0" width="2.8" height="11" rx=".7"/></svg></span><span class="ap-notch"></span>
            <span class="ap-right"><span class="ap-pct"></span><span class="ap-bat" aria-hidden="true"><i></i></span><button class="ap-x" type="button" aria-label="關掉小手機">${ic('x', 16)}</button></span></div>
          <div class="ap-lock">
            <div class="ap-date"></div>
            <div class="ap-time"></div>
            <div class="ap-wg">
              <div class="ap-sq ap-glass ap-weather"></div>
              <div class="ap-sq ap-glass ap-next"></div>
              <div class="ap-sq ap-glass ap-rings"></div>
            </div>
            <div class="ap-notes">
              <div class="ap-list"></div>
              <button class="ap-pill ap-glass" type="button"></button>
            </div>
            <div class="ap-btm">
              <div class="ap-cb ap-glass">${ic('light', 20)}</div>
              <div class="ap-quote"><small>今 日 摘 句</small><span></span></div>
              <div class="ap-cb ap-glass">${ic('cam', 20)}</div>
            </div>
            <div class="ap-hint">向 上 翻 開</div>
          </div>
          <div class="ap-home" hidden>
            <div class="ap-blur" data-w="home"></div><div class="ap-wall" data-w="home"></div><div class="ap-htint"></div><div class="ap-hshade"></div>
            <div class="ap-pages"><div class="ap-track">
              <section class="ap-page ap-p1"></section>
              <section class="ap-page ap-p2"></section>
              <section class="ap-page ap-p3"></section>
            </div></div>
            <div class="ap-dots"><button type="button" data-i="0" aria-label="第一頁"></button><button type="button" data-i="1" aria-label="第二頁"></button><button type="button" data-i="2" aria-label="第三頁"></button></div>
            <div class="ap-dock ap-glass"></div>
          </div>
          <div class="ap-view" data-app="memo" hidden><div class="ap-vs"></div></div>
          <div class="ap-bar"></div><div class="ap-barhit" aria-label="回主畫面"></div>
        </div>
      </div>`;
    document.documentElement.appendChild(root); // 掛在最外層，不受酒館主題的版面影響

    root.querySelector('.ap-dim').addEventListener('click', close);
    root.querySelector('.ap-x').addEventListener('click', close);
    root.querySelector('.ap-pill').addEventListener('click', () => root.querySelector('.ap-notes').classList.toggle('ap-open'));
    root.querySelector('.ap-list').addEventListener('click', (e) => { if (e.target.closest('.ap-note')) unlock(); });

    // 鎖定畫面：往上滑翻開。主畫面：左右滑換頁、往下滑回鎖定（在通知清單裡滑不算）
    const scr = root.querySelector('.ap-screen');
    const track = root.querySelector('.ap-track');
    let g = null;
    scr.addEventListener('pointerdown', (e) => { g = e.target.closest('.ap-list, .ap-view, .ap-barhit') || inApp() ? null : { x: e.clientX, y: e.clientY, dir: null }; });
    root.querySelector('.ap-barhit').addEventListener('pointerup', () => { if (inApp()) closeApp(); });
    scr.addEventListener('pointermove', (e) => {
      if (!g || isLocked()) return;
      const dx = e.clientX - g.x, dy = e.clientY - g.y;
      if (!g.dir && Math.hypot(dx, dy) > 8) g.dir = Math.abs(dx) > Math.abs(dy) ? 'h' : 'v';
      if (g.dir !== 'h') return;
      const d = (page === 0 && dx > 0) || (page === 2 && dx < 0) ? dx / 3 : dx; // 最前面和最後面滑不過去，只會輕輕拉一下
      track.style.transition = 'none';
      track.style.transform = `translateX(calc(${-page * 100}% + ${d}px))`;
    });
    scr.addEventListener('pointerup', (e) => {
      if (!g) return;
      const dx = e.clientX - g.x, dy = e.clientY - g.y;
      if (isLocked()) { if (-dy > 60) unlock(); }
      else if (g.dir === 'h') { swiped = Date.now(); goPage(dx < -50 ? page + 1 : dx > 50 ? page - 1 : page); }
      else if (dy > 60) lock();
      g = null;
    });
    scr.addEventListener('pointercancel', () => { if (g && !isLocked()) goPage(page); g = null; });

    // 主畫面：App 還沒做好，點了輕輕彈一下；小圓點可以直接跳頁
    const home = root.querySelector('.ap-home');
    home.addEventListener('click', (e) => {
      const dot = e.target.closest('.ap-dots button');
      if (dot) { goPage(+dot.dataset.i); return; }
      const b = e.target.closest('.ap-app');
      if (!b || Date.now() - swiped < 350) return;
      if (READY.includes(b.dataset.id)) { openApp(b.dataset.id); return; }
      b.classList.remove('ap-boing'); void b.offsetWidth; b.classList.add('ap-boing');
    });
    home.addEventListener('animationend', (e) => e.target.classList.remove('ap-boing'));
    root.querySelector('.ap-view[data-app="memo"]').addEventListener('click', (e) => {
      const it = e.target.closest('.ap-mi');
      if (it) { tapItem(it); return; }
      const t = e.target.closest('.ap-mtext');
      if (t) t.classList.toggle('ap-open');
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
    fab.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, y: e.clientY, moved: false }; fab.setPointerCapture(e.pointerId); });
    fab.addEventListener('pointermove', (e) => {
      if (!drag) return;
      if (Math.hypot(e.clientX - drag.x, e.clientY - drag.y) > 6) drag.moved = true;
      if (!drag.moved) return;
      fab.classList.add('ap-dragging');
      fab.style.left = Math.min(innerWidth - 46, Math.max(4, e.clientX - 21)) + 'px';
      fab.style.right = 'auto';
      fab.style.top = Math.min(92, Math.max(6, (e.clientY / innerHeight) * 100)) + 'vh';
    });
    fab.addEventListener('pointerup', (e) => {
      if (!drag) return;
      fab.classList.remove('ap-dragging');
      if (drag.moved) { // 放開時吸到最近的左邊或右邊
        const s = S();
        s.fabY = Math.min(92, Math.max(6, (e.clientY / innerHeight) * 100));
        s.fabSide = e.clientX < innerWidth / 2 ? 'left' : 'right';
        save(); badge();
      } else open();
      drag = null;
    });
  }

  const isLocked = () => !root.querySelector('.ap-lock').hidden;
  function lock() { closeApp(); root.querySelector('.ap-lock').hidden = false; root.querySelector('.ap-home').hidden = true; }
  function unlock() { root.querySelector('.ap-lock').hidden = true; root.querySelector('.ap-home').hidden = false; goPage(0, true); }
  function goPage(i, now) {
    page = Math.max(0, Math.min(2, i));
    const t = root.querySelector('.ap-track');
    t.style.transition = now ? 'none' : '';
    t.style.transform = `translateX(${-page * 100}%)`;
    root.querySelectorAll('.ap-dots button').forEach((d, j) => d.classList.toggle('ap-on', j === page));
  }

  // ===== 主畫面 =====
  const nm = (a, s) => (s.names[a.id] || '').trim() || a.n;
  const tile = (a) => (a.k === 'pin' ? PIN : ic(a.k, 26));
  const appBtn = (a, s) => `<button class="ap-app" type="button" data-id="${a.id}"><span class="ap-tile">${tile(a)}</span><span class="ap-name">${esc(nm(a, s))}</span></button>`;
  function paintHome() {
    const s = S();
    root.querySelector('.ap-p1').innerHTML = '<div class="ap-grid">'
      + HOME.folders.map((f) => `<button class="ap-app" type="button"><span class="ap-tile ap-fold">${f.mini.map((k) => `<i>${ic(k, 11)}</i>`).join('')}</span><span class="ap-name">${esc(f.n)}</span></button>`).join('')
      + HOME.p1.map((a) => appBtn(a, s)).join('') + '</div>';
    root.querySelector('.ap-p2').innerHTML = HOME.boxes.map((b) => `<div class="ap-box ap-glass ap-${b.tone}">${b.apps.map((a) => appBtn(a, s)).join('')}</div>`).join('');
    root.querySelector('.ap-p3').innerHTML = `<button class="ap-app ap-diary" type="button"><span class="ap-book">${ic('book', 24)}</span><span class="ap-name">拾光手記</span></button>`;
    root.querySelector('.ap-dock').innerHTML = HOME.dock.map((a) => `<button class="ap-app" type="button" aria-label="${a.n}"><span class="ap-tile">${ic(a.k, 26)}</span></button>`).join('');
    root.querySelector('.ap-home').classList.toggle('ap-nowall', !s.homeWall);
    root.querySelector('.ap-home .ap-htint').style.opacity = s.homeTint / 100;
    wallTo(root, s, 'home');
  }

  // ===== App =====
  const READY = ['memo']; // 已經做好、點得開的 App
  const inApp = () => !!root.querySelector('.ap-view:not([hidden])');
  function openApp(id) {
    const v = root.querySelector(`.ap-view[data-app="${id}"]`);
    if (!v) return;
    if (id === 'memo') paintMemo();
    v.hidden = false;
    if (id === 'memo') replayChecks();
    root.querySelector('.ap-screen').classList.add('ap-lite'); // 紙色 App：上面的字和橫線變深色
  }
  function closeApp() {
    if (!root) return;
    root.querySelectorAll('.ap-view').forEach((v) => { v.hidden = true; });
    root.querySelector('.ap-screen').classList.remove('ap-lite');
  }

  // ===== 備忘錄（灰白紙感，第 43 窗果果確認的草圖）=====
  // 臻綠圓圈勾勾＋編輯紅筆抖抖劃線
  const CIRC = '<svg class="ap-cc" viewBox="0 0 22 22" width="17" height="17" aria-hidden="true"><circle cx="11" cy="11" r="9.5" fill="none" stroke="#4F7A6B" stroke-width="1.5"/><path class="ap-ck" d="M6.5 11.3l3 3 6-6.3" fill="none" stroke="#4F7A6B" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const STRIKE = '<svg preserveAspectRatio="none" viewBox="0 0 100 10" aria-hidden="true"><path class="ap-ln" d="M0 6C15 3 30 7 50 4S85 7 100 4" fill="none" stroke="#B5533C" stroke-width="1.7" stroke-linecap="round" vector-effect="non-scaling-stroke"/></svg>';
  const slash = (day) => { const m = String(day || '').match(/\d{4}\D+(\d{1,2})\D+(\d{1,2})/); return m ? `${+m[1]}/${+m[2]}` : ''; };
  function headDate() {
    const m = numDate(S().lock.date).match(/^(\d{1,2})月(\d{1,2})日/);
    if (m) return `${m[1]}/${m[2]}`;
    const d = new Date(); return `${d.getMonth() + 1}/${d.getDate()}`;
  }
  const replay = (it) => it.done && it.by === 'him' && it.seen === false;
  // 打開備忘錄時：他在果果沒看的時候劃掉的，在她眼前重播一次（之後就是安靜劃掉的樣子）
  function replayChecks() {
    const els = [...root.querySelectorAll('.ap-mi[data-replay]')];
    if (!els.length) return;
    S().memo.notes.forEach((n) => (n.items || []).forEach((it) => { if (replay(it)) it.seen = true; }));
    save();
    els.forEach((el, k) => setTimeout(() => { el.removeAttribute('data-replay'); el.classList.add('ap-on'); }, 550 + k * 650));
  }
  function memoNote(n) {
    const when = n.pin ? slash(n.day) : (n.time || '');
    const hd = `<div class="ap-mh"><span class="ap-mt">${esc(n.title)}</span><span class="ap-mw">${esc(when)}</span></div>`;
    if (n.kind === 'list') {
      return `<div class="ap-mn" data-id="${n.id}">${hd}${(n.items || []).map((it, i) =>
        `<div class="ap-mi${it.done && !replay(it) ? ' ap-on' : ''}"${replay(it) ? ' data-replay' : ''} data-i="${i}" role="checkbox" aria-checked="${!!it.done}">${CIRC}<span class="ap-mx">${esc(it.t)}${STRIKE}</span></div>`).join('')}</div>`;
    }
    return `<div class="ap-mn ap-mtext" data-id="${n.id}">${hd}<div class="ap-mb">${esc(n.body)}</div></div>`;
  }
  function paintMemo() {
    const M = S().memo;
    const pins = M.notes.filter((n) => n.pin), today = M.notes.filter((n) => !n.pin);
    const sec = (t, list) => (list.length ? `<div class="ap-msec">${t}</div>${list.map(memoNote).join('')}` : '');
    root.querySelector('.ap-view[data-app="memo"] .ap-vs').innerHTML = `
      <div class="ap-meta">MEMO · ${headDate()}</div>
      <div class="ap-mtitle"><span class="ap-mdot"></span>備忘錄</div>
      ${sec('置頂', pins)}${sec('今天', today)}
      ${M.notes.length ? '' : '<div class="ap-mempty">還沒有記下什麼。</div>'}`;
  }
  // 果果點一下打勾／取消（果果勾的，他更新時不能取消）
  function tapItem(el) {
    const n = S().memo.notes.find((x) => x.id === el.closest('.ap-mn').dataset.id);
    const it = n?.items?.[+el.dataset.i];
    if (!it) return;
    it.done = !it.done;
    it.by = it.done ? 'me' : '';
    it.seen = true;
    el.classList.toggle('ap-on', it.done);
    el.setAttribute('aria-checked', it.done);
    save();
  }

  function tick() {
    const L = S().lock;
    const d = new Date();
    root.querySelector('.ap-time').textContent = L.time || String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
    root.querySelector('.ap-date').textContent = numDate(L.date) || `${d.getMonth() + 1}月${d.getDate()}日・週${'日一二三四五六'[d.getDay()]}`;
  }

  function ring(pct, k) {
    const p = Math.max(0, Math.min(100, Number(pct) || 0));
    return `<div class="ap-ring" style="background:conic-gradient(#F6F3EC 0 ${p}%,rgba(255,255,255,.2) ${p}% 100%)"><span>${ic(k, 14)}</span></div>`;
  }

  function paint() {
    const s = S(), L = s.lock;
    const scr = root.querySelector('.ap-screen');
    scr.classList.toggle('ap-nowall', !s.lockWall);
    wallTo(root, s, 'lock');
    paintHome();
    root.querySelector('.ap-carrier').textContent = s.carrier;
    const bp = Math.max(1, Math.min(100, Number(L.battery?.phone ?? 76) || 76));
    root.querySelector('.ap-pct').textContent = bp + '%';
    root.querySelector('.ap-bat i').style.width = bp + '%'; // 電池小圖示跟著數字長
    const W = (L.weather || []).slice(0, 2);
    root.querySelector('.ap-weather').innerHTML = '<div class="ap-lb">天 氣</div>'
      + W.map((w, i) => `<div class="${i ? 'ap-sm' : ''}">${esc(w.place)} <b>${esc(w.temp)}</b>${w.extra ? ' ' + esc(w.extra) : ''}</div>`).join('');
    const n = L.next || {};
    root.querySelector('.ap-next').innerHTML = `<div class="ap-lb">下 一 件 事</div><div><b>${esc(n.when)}</b></div><div class="ap-sm">${esc(n.what)}${n.mine ? ' <span class="ap-dot">●</span>' : ''}</div>`;
    root.querySelector('.ap-rings').innerHTML = ring(L.battery?.phone, 'mob') + ring(L.battery?.buds, 'buds');
    root.querySelector('.ap-quote span').textContent = L.quote || '';

    const notes = s.notes.slice(0, 8);
    const box = root.querySelector('.ap-notes');
    box.hidden = !notes.length;
    box.classList.remove('ap-open');
    const apps = [...new Set(notes.map((x) => x.app))];
    const mine = notes.some((x) => x.mine);
    root.querySelector('.ap-pill').innerHTML = (mine ? '<span class="ap-me"></span>' : '')
      + apps.map((a) => `<span class="ap-ad" data-a="${a}" style="background:${(APP[a] || APP.memo)[1]}"></span>`).join('')
      + `<span>${notes.length} 則新通知</span>${ic('down', 14)}`;
    root.querySelector('.ap-list').innerHTML = notes.map((x) => {
      const [name, col] = APP[x.app] || APP.memo;
      return `<div class="ap-note ap-glass">
        <div class="ap-hd"><span class="ap-ic">${ic(x.app, 14)}</span>${esc(name)}<span class="${x.mine ? 'ap-me' : 'ap-ad'}" data-a="${x.app}" style="${x.mine ? '' : 'background:' + col}"></span><span class="ap-when">${esc(x.when)}</span></div>
        <div class="ap-tt">${esc(x.from)}</div><div class="ap-tx">${esc(x.text)}</div></div>`;
    }).join('');
    tick();
  }

  // 桌布：上層照片可以放大、上下左右移（用螢幕的 %，不受照片大小影響）；移開露出的地方用模糊的同一張照片墊底
  function wallTo(box, s, kind) {
    const k = WK[kind];
    const url = s[k.img] ? `url("${s[k.img]}")` : '';
    const b = box.querySelector(`.ap-blur[data-w="${kind}"]`), w = box.querySelector(`.ap-wall[data-w="${kind}"]`);
    if (!b || !w) return;
    b.style.backgroundImage = url;
    w.style.backgroundImage = url;
    w.style.transform = `translate(${s[k.x] || 0}%, ${s[k.y] || 0}%) scale(${(s[k.z] || 100) / 100})`;
  }

  function badge() {
    const s = S();
    fab.hidden = !s.fab;
    fab.style.top = s.fabY + 'vh';
    fab.style.left = s.fabSide === 'left' ? '8px' : 'auto';
    fab.style.right = s.fabSide === 'left' ? 'auto' : '8px';
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


  // ===== 每 N 則自動更新（清爽版：只帶角色卡＋最近劇情＋手機現在的內容，另外問 AI，不會出現在聊天裡）=====
  const MKEY = 'anan_phone_last'; // 這個聊天上次更新時的訊息數，存在聊天自己的資料裡
  let busy = false, stEl = null, stSum = null;
  const curChar = () => { const c = ctx(); return c.groupId ? null : c.characters?.[c.characterId] || null; };
  const isOwner = () => { const a = S().auto, ch = curChar(); return !!(a.owner && ch && ch.name === a.owner); };
  const msgCount = () => (ctx().chat || []).filter((m) => m && !m.is_system).length;
  const saveMeta = () => { const c = ctx(); (c.saveMetadata || c.saveMetadataDebounced)?.call(c); };
  function lastAt() {
    const md = ctx().chatMetadata;
    if (!md) return null;
    if (typeof md[MKEY] !== 'number' || md[MKEY] > msgCount()) { md[MKEY] = msgCount(); saveMeta(); } // 第一次進這個聊天：從現在開始數
    return md[MKEY];
  }
  const left = () => { const l = lastAt(); return l == null ? null : Math.max(0, S().auto.n - (msgCount() - l)); };
  const hhmm = (t) => { const d = new Date(t); return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; };

  function status(msg) {
    if (!stEl) return;
    const put = (t) => { stEl.textContent = t; if (stSum) stSum.textContent = t.split('　·　')[0]; };
    if (msg) { put(msg); return; }
    if (busy) { put('他拿起手機中……'); return; }
    const a = S().auto;
    const tail = a.last ? `上次 ${hhmm(a.last)}` : '還沒更新過';
    if (!a.owner) put('先按「設成現在的角色」');
    else if (!isOwner()) put(`現在不是 ${a.owner} 的聊天　·　${tail}`);
    else if (!a.on) put(`自動更新關著　·　${tail}`);
    else { const n = left(); put((n == null ? '' : `還差 ${n} 則　·　`) + tail); }
  }

  const CNUM = { 零: 0, 一: 1, 二: 2, 兩: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9 };
  const cnToNum = (t) => { const i = t.indexOf('十'); if (i < 0) return CNUM[t] ?? t; return (i === 0 ? 1 : CNUM[t[0]]) * 10 + (t[i + 1] ? CNUM[t[i + 1]] : 0); };
  const numWhen = (t) => t.replace(/([零一二兩三四五六七八九十]{1,3})\s*(?=(分鐘|小時|天|週|個月))/g, (m) => String(cnToNum(m.trim())));
  // 劇情日期 2026-02-15 → 2月15日・週日（日期用數字、星期用國字，果果第 43 窗選的）
  function storyDate(t) {
    const m = String(t || '').match(/(\d{4})\D+(\d{1,2})\D+(\d{1,2})/);
    if (!m) return '';
    const d = new Date(+m[1], +m[2] - 1, +m[3]);
    if (isNaN(d)) return '';
    return `${d.getMonth() + 1}月${d.getDate()}日・週${'日一二三四五六'[d.getDay()]}`;
  }
  // 以前存的國字日期（二月十四日・週六）顯示時換成數字（2月14日・週六），不用等下一次更新
  const numDate = (t) => String(t || '').replace(/^([一二三四五六七八九十]{1,3})月([一二三四五六七八九十]{1,3})日/, (m, a, b) => `${cnToNum(a)}月${cnToNum(b)}日`);
  const clean = (t, max) => String(t ?? '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, max);

  function buildPrompt() {
    const c = ctx(), ch = curChar(), s = S(), L = s.lock;
    const me = c.name1 || '使用者', him = ch.name;
    const card = [ch.description, ch.personality, ch.scenario].filter(Boolean).join('\n').slice(0, 6000);
    const recent = (c.chat || []).filter((m) => m && !m.is_system).slice(-Math.max(10, Math.min(60, s.auto.n)))
      .map((m) => `${m.is_user ? me : (m.name || him)}：${clean(m.mes, 2500)}`).join('\n\n');
    const memoNow = s.memo.notes.map((n) => (n.kind === 'list'
      ? { id: n.id, kind: 'list', pin: !!n.pin, title: n.title, items: (n.items || []).map((it) => ({ t: it.t, done: !!it.done })) }
      : { id: n.id, kind: 'text', pin: !!n.pin, title: n.title, body: n.body }));
    const now = { weather: L.weather, next: L.next, battery: L.battery, quote: L.quote, notes: s.notes, memoDay: s.memo.day, memo: memoNow };
    const memo = String(s.auto.memo || '').trim().slice(0, 4000);
    const sys = `你負責替角色「${him}」更新他手機上的內容（鎖定畫面和備忘錄）。${me} 是他最重要的人。只輸出一個 JSON 物件，不要任何說明、不要狀態欄、不要 markdown。`;
    const prompt = `【${him} 的角色設定】
${card}
${memo ? `\n【他手機的小抄（聯絡人名字、App 的真實設定要照這個；個性和習慣是參考，不是台詞）】\n${memo}\n` : ''}
【最近的劇情】
${recent}

【他手機現在的內容】
${JSON.stringify(now)}

【請依照最近的劇情，更新他的手機】
規則：
0. date、time：劇情裡「最新」那一刻的日期和時間（看最近劇情的狀態欄或敘述）。date 寫成「2026-02-15」，time 寫成「15:45」；看不出來就空字串。下面通知的「幾分鐘前」都以這個時間來算。
1. weather：兩個地點。沿用現在的兩個地點，除非劇情裡有人到了別的城市或區域，才換成新地點。temp 寫像「18°」，符合季節；extra 寫降雨機率，像「雨10%」，沒有就空字串。
2. next：他行事曆上最近的下一件事。when 很短，像「明天 15:00」「週二 15:00」；what 10 字以內；跟 ${me} 有關 mine 就是 true。
3. battery：phone 和 buds 是 0～100 的整數，合理就好；他不喜歡電量低於 50，除非劇情裡他忙了一整天。
4. quote：今日摘句，由他自己決定換不換。不換就回傳原本那句，一字不改；要換的話，是他親手打的一句話，30 字以內，用他的語氣。
5. notes：3～5 則通知。app 只能是 line、cal、web 其中一個（備忘錄的通知程式會自己從 memo 拿，你不用寫）；from 10 字以內（聯絡人、行程名或 App 標題）；text 40 字以內；when 用阿拉伯數字，像「現在」「5分鐘前」「2小時前」「昨天」；mine 只給真的跟 ${me} 有關的：傳給她的、在聊她的、跟她的約會或計畫；只是順便提到的不算。每次至少 1～2 則跟 ${me} 無關（工作、朋友、家人的日常）。聯絡人名字要照小抄裡存的名字寫。小抄裡的個性和習慣是參考，不要照抄裡面的句子，每次用新的說法。這次的通知要是新的：不要重複「他手機現在的內容」裡的通知，也不用每次都出現同樣的人，挑這段劇情裡最可能傳訊息來的人。通知都是「別人傳給他」或「他的 App 提醒他」的，不要寫他自己傳出去的訊息。內容要跟劇情和他的生活對得上，不要編出劇情裡沒有的大事件。
6. memo：他自己記給自己看的備忘錄。用他的口吻，記他自己會想記下的事；記什麼由他決定。
   - add：這次新增的 0～2 則，沒有想記的就給空陣列 []。每則的 kind 是 text 或 list：
     text＝一段話：title 15 字內、body 80 字內。
     list＝勾勾清單：title 15 字內、items 是 1～6 個項目（每項 18 字內的字串）。
     pin：只有長期要記住的事才是 true（會一直留著）；time：他記下的時間，像「15:20」；mine：跟 ${me} 有關才是 true。
   - check：劇情裡他已經做到的項目，寫成 {"id":"m3","i":0}（id 是那則備忘錄的 id，i 是第幾項，從 0 開始）。只能勾 memo 裡還沒勾的項目，沒有就給 []。
   - 如果劇情的日期跟 memoDay 不一樣（到了新的一天），沒有置頂的備忘錄會自動清掉，只留置頂；這次 add 的就是新的一天寫的。
   - 不要重複寫 memo 裡已經有的事；舊的置頂不用重寫。
7. 全部用繁體中文、台灣用語。

只輸出這個格式：
{"date":"","time":"","weather":[{"place":"","temp":"","extra":""},{"place":"","temp":"","extra":""}],"next":{"when":"","what":"","mine":false},"battery":{"phone":0,"buds":0},"quote":"","notes":[{"app":"line","from":"","text":"","when":"","mine":false}],"memo":{"add":[{"kind":"text","title":"","body":"","items":[],"pin":false,"time":"","mine":false}],"check":[]}}`;
    return { sys, prompt };
  }

  async function askAI(sys, prompt) {
    const fn = ctx().generateRaw;
    if (typeof fn !== 'function') throw new Error('這個酒館版本找不到 generateRaw');
    let out = null;
    try { out = await fn({ prompt, systemPrompt: sys }); } catch (e) { console.warn('[anan_phone] 新寫法失敗，改用舊寫法', e); }
    if (!out || typeof out !== 'string') out = await fn(prompt, null, false, false, sys); // 舊版酒館的寫法
    return String(out || '');
  }

  function parse(txt) {
    const m = txt.replace(/```(json)?/gi, '').match(/\{[\s\S]*\}/);
    if (!m) throw new Error('AI 沒有回 JSON');
    return JSON.parse(m[0]);
  }

  // 只收合格的欄位，不合格的保留原本內容（不會把手機弄壞）
  function apply(o) {
    const s = S(), L = s.lock;
    const W = Array.isArray(o.weather) ? o.weather.filter((w) => w && w.place).slice(0, 2) : [];
    if (W.length === 2) L.weather = W.map((w) => ({ place: clean(w.place, 8), temp: clean(w.temp, 6), extra: clean(w.extra, 8) }));
    if (o.next && o.next.what) L.next = { when: clean(o.next.when, 10), what: clean(o.next.what, 14), mine: !!o.next.mine };
    const pct = (v, old) => { const n = Math.round(Number(v)); return Number.isFinite(n) ? Math.max(1, Math.min(100, n)) : old; };
    if (o.battery) L.battery = { phone: pct(o.battery.phone, L.battery?.phone ?? 76), buds: pct(o.battery.buds, L.battery?.buds ?? 88) };
    if (typeof o.quote === 'string' && o.quote.trim()) L.quote = clean(o.quote, 40);
    const N = Array.isArray(o.notes) ? o.notes.filter((x) => x && APP[x.app] && x.app !== 'memo' && x.text).slice(0, 5) : [];
    if (N.length) s.notes = N.map((x) => ({ app: x.app, from: clean(x.from, 12), text: clean(x.text, 50), when: numWhen(clean(x.when, 8)), mine: !!x.mine }));
    else s.notes = s.notes.filter((x) => x.app !== 'memo'); // 舊的備忘錄通知拿掉，下面重新從備忘錄拿
    // 日期時間跟著劇情，停在更新那一刻；AI 看不出來就維持原本的
    const sd = storyDate(o.date), st = String(o.time || '').match(/(\d{1,2})[:：](\d{2})/);
    if (sd && st) { L.date = sd; L.time = st[1].padStart(2, '0') + ':' + st[2]; }
    applyMemo(o.memo, isoDate(o.date));
    memoNotice();
    s.unseen = true;
    s.unseenMine = s.notes.some((x) => x.mine) || !!L.next?.mine;
  }

  const isoDate = (t) => { const m = String(t || '').match(/(\d{4})\D+(\d{1,2})\D+(\d{1,2})/); return m ? `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}` : ''; };
  const hm = (t) => { const m = String(t || '').match(/(\d{1,2})[:：](\d{2})/); return m ? m[1].padStart(2, '0') + ':' + m[2] : ''; };
  const cleanBody = (t, max) => String(t ?? '').replace(/<[^>]*>/g, '').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim().slice(0, max);

  // 備忘錄：劇情換新的一天只留置頂 → 他勾的打勾 → 加新的（亂寫的擋掉，保留原本）
  function applyMemo(m, day) {
    const M = S().memo;
    if (day && day !== M.day) { if (M.day) M.notes = M.notes.filter((n) => n.pin); M.day = day; }
    if (!m || typeof m !== 'object') return;
    (Array.isArray(m.check) ? m.check : []).forEach((c) => {
      const it = M.notes.find((n) => n.id === c?.id)?.items?.[Number(c?.i)];
      if (it && !it.done) { it.done = true; it.by = 'him'; it.seen = false; } // seen=false：果果打開時重播一次
    });
    (Array.isArray(m.add) ? m.add : []).slice(0, 2).forEach((x) => {
      if (!x || !clean(x.title, 16)) return;
      const n = { id: 'm' + (++M.seq), kind: x.kind === 'list' ? 'list' : 'text', title: clean(x.title, 16), pin: !!x.pin, mine: !!x.mine,
        day: M.day || isoDate(new Date().toISOString()), time: hm(x.time) || S().lock.time || '', fresh: true };
      if (n.kind === 'list') {
        n.items = (Array.isArray(x.items) ? x.items : []).map((t) => clean(typeof t === 'string' ? t : t?.t, 20)).filter(Boolean).slice(0, 6).map((t) => ({ t, done: false }));
        if (!n.items.length) return;
      } else {
        n.body = cleanBody(x.body, 90);
        if (!n.body) return;
      }
      M.notes.push(n);
    });
    // 太多就把最舊的拿掉（置頂最多 20 則、今天最多 12 則）
    const pins = M.notes.filter((n) => n.pin), today = M.notes.filter((n) => !n.pin);
    M.notes = [...pins.slice(-20), ...today.slice(-12)];
  }

  // 鎖定畫面的備忘錄通知：只從他備忘錄裡「真的有、還沒勾」的那幾則來（不讓 AI 另外寫，才不會對不起來）
  function memoNotice() {
    const s = S(), M = s.memo, L = s.lock;
    const open = M.notes.filter((n) => n.kind === 'text' || (n.items || []).some((it) => !it.done));
    const n = open.filter((x) => x.fresh).pop() || open.filter((x) => x.kind === 'list').pop();
    M.notes.forEach((x) => { delete x.fresh; });
    if (!n) return;
    const left = (n.items || []).filter((it) => !it.done);
    const text = n.kind === 'list' ? left.slice(0, 2).map((it) => it.t).join('、') + (left.length > 2 ? `…還有 ${left.length - 2} 項` : '') : n.body;
    let when = '提醒';
    const a = hm(n.time), b = hm(L.time);
    if (a && b && n.day === M.day) {
      const d = (+b.slice(0, 2) * 60 + +b.slice(3)) - (+a.slice(0, 2) * 60 + +a.slice(3));
      if (d >= 0) when = d < 1 ? '現在' : d < 60 ? `${d}分鐘前` : `${Math.floor(d / 60)}小時前`;
    }
    s.notes.splice(Math.min(1, s.notes.length), 0, { app: 'memo', from: clean(n.title, 12), text: clean(text, 50), when, mine: !!n.mine });
    s.notes = s.notes.slice(0, 6);
  }

  async function runUpdate(manual) {
    if (busy) return;
    if (!isOwner()) { if (manual) status(S().auto.owner ? `現在不是 ${S().auto.owner} 的聊天，不能更新` : '先按「設成現在的角色」'); return; }
    busy = true; status();
    try {
      const { sys, prompt } = buildPrompt();
      apply(parse(await askAI(sys, prompt)));
      const s = S(); s.auto.last = Date.now(); save();
      const md = ctx().chatMetadata; if (md) { md[MKEY] = msgCount(); saveMeta(); }
      badge();
      if (!root.hidden) paint();
      if (manual) window.toastr?.success('小手機更新好了');
      busy = false; status();
    } catch (e) {
      console.warn('[anan_phone] 更新失敗', e);
      busy = false; status('這次沒成功，下一輪再試');
      if (manual) window.toastr?.warning('這次沒成功，等一下再按一次看看');
      // 自動更新失敗：計數退回「還差 5 則」，過幾則再試，不用等滿一整輪
      const md = ctx().chatMetadata;
      if (!manual && md) { md[MKEY] = Math.max(0, msgCount() - Math.max(0, S().auto.n - 5)); saveMeta(); }
    }
  }

  function onMessage() {
    setTimeout(() => {
      status();
      const a = S().auto;
      if (a.on && isOwner() && left() === 0) runUpdate(false);
    }, 1200);
  }

  function hookEvents() {
    const c = ctx(), E = c.event_types, es = c.eventSource;
    if (!es || !E) return;
    es.on(E.MESSAGE_RECEIVED, onMessage);
    [E.MESSAGE_SENT, E.MESSAGE_DELETED, E.CHAT_CHANGED].forEach((t) => t && es.on(t, () => setTimeout(() => status(), 300)));
  }

  // ===== 設定頁：分成幾個小抽屜，一次只打開一個 =====
  // 桌布那一組（鎖定畫面、主畫面共用同一套做法）
  function wallBlock(kind, guide, extra = '') {
    return `
          <div class="ap-mini" data-k="${kind}"><div class="ap-blur" data-w="${kind}"></div><div class="ap-wall" data-w="${kind}"></div>${extra}<div class="ap-mini-guide">${guide}</div></div>
          <div class="ap-sl"><span>大小</span><input type="range" class="ap-z" min="100" max="220" step="1"></div>
          <div class="ap-sl"><span>上下</span><input type="range" class="ap-y" min="-35" max="35" step="0.5"></div>
          <div class="ap-sl"><span>左右</span><input type="range" class="ap-xx" min="-35" max="35" step="0.5"></div>
          <div class="ap-row">
            <label class="menu_button ap-pick">選擇照片<input type="file" accept="image/*" hidden></label>
            <div class="menu_button ap-del">移除</div>
            <div class="menu_button ap-reset">位置歸零</div>
          </div>`;
  }
  function bindWall(dr, kind, sumEl, emptyText) {
    const k = WK[kind];
    const mini = dr.querySelector('.ap-mini');
    const zr = dr.querySelector('.ap-z'), yr = dr.querySelector('.ap-y'), xr = dr.querySelector('.ap-xx');
    const show = () => {
      const s = S();
      mini.hidden = !s[k.img];
      zr.value = s[k.z] || 100; yr.value = s[k.y] || 0; xr.value = s[k.x] || 0;
      wallTo(dr, s, kind);
      sumEl.textContent = s[k.img] ? '已選照片' : emptyText;
      if (root && !root.hidden) paint();
    };
    show();
    const onSlide = () => { const s = S(); s[k.z] = +zr.value; s[k.y] = +yr.value; s[k.x] = +xr.value; wallTo(dr, s, kind); if (root && !root.hidden) wallTo(root, s, kind); save(); };
    [zr, yr, xr].forEach((el) => el.addEventListener('input', onSlide));
    dr.querySelector('.ap-reset').addEventListener('click', () => { const s = S(); s[k.z] = 100; s[k.y] = 0; s[k.x] = 0; save(); show(); });
    dr.querySelector('.ap-pick input').addEventListener('change', async (e) => {
      const f = e.target.files[0]; if (!f) return;
      try { S()[k.img] = await shrink(f); save(); show(); } catch (err) { alert('照片讀不進來，換一張試試'); }
      e.target.value = '';
    });
    dr.querySelector('.ap-del').addEventListener('click', () => { const s = S(); delete s[k.img]; s[k.z] = 100; s[k.y] = 0; s[k.x] = 0; save(); show(); });
  }

  function settingsPanel() {
    const box = document.createElement('div');
    box.className = 'ap-settings';
    const drawer = (key, title, body) => `
          <details class="ap-dr" data-dr="${key}"><summary><span class="ap-dt">${title}</span><small class="ap-sum"></small><i class="fa-solid fa-chevron-down ap-arrow"></i></summary>
            <div class="ap-dc">${body}</div></details>`;
    box.innerHTML = `
      <div class="inline-drawer">
        <div class="inline-drawer-toggle inline-drawer-header"><b>📱 安安的小手機</b><div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div></div>
        <div class="inline-drawer-content">
          <div class="ap-row">
            <label class="checkbox_label"><input type="checkbox" class="ap-fabchk"> 顯示小手機懸浮球</label>
            <div class="menu_button ap-open">打開小手機</div>
          </div>
          ${drawer('lock', '🔒 鎖定畫面桌布', wallBlock('lock', '<span>時間＋小工具</span><span>摘句</span>'))}
          ${drawer('home', '🏠 主畫面', `
          <div class="ap-row ap-sub">主畫面桌布（沒選照片時是深灰藍）</div>
          ${wallBlock('home', '<span class="ap-ghost"></span><span>常駐四格</span>', '<div class="ap-htint"></div>')}
          <div class="ap-sl"><span>濾鏡</span><input type="range" class="ap-tint" min="0" max="85" step="1"><b class="ap-tintv"></b></div>
          <div class="ap-row ap-sub">App 名字（只存在妳的酒館，空白就用原本的名字）</div>
          ${RENAME.map(([id, def]) => `<div class="ap-nm"><span>${def}</span><input type="text" class="text_pole ap-name-in" data-id="${id}" maxlength="12" placeholder="${def}"></div>`).join('')}`)}
          ${drawer('auto', '🔄 自動更新', `
          <label class="checkbox_label"><input type="checkbox" class="ap-autochk"> 開啟自動更新</label>
          <div class="ap-row">這是誰的手機：<b class="ap-owner"></b><div class="menu_button ap-own">設成現在的角色</div></div>
          <div class="ap-row">每 <input type="number" class="text_pole ap-n" min="5" max="200" step="1"> 則更新一次</div>
          <div class="ap-row">他手機的小抄（給 AI 看：聯絡人、App 的設定）</div>
          <textarea class="text_pole ap-memo" rows="6" maxlength="4000" placeholder="例：LINE 置頂只有……"></textarea>
          <div class="ap-row ap-st"></div>
          <div class="ap-row"><div class="menu_button ap-now">現在更新</div></div>`)}
          ${drawer('tools', '🧰 小工具', `
          <div class="ap-row"><div class="menu_button ap-test">試試紅點</div></div>`)}
        </div>
      </div>`;
    const target = document.getElementById('extensions_settings2') || document.getElementById('extensions_settings');
    if (target) target.appendChild(box);
    const D = (key) => box.querySelector(`[data-dr="${key}"]`);
    const sum = (key) => D(key).querySelector('.ap-sum');

    // 打開一個抽屜時，其他的自動收起來
    box.querySelectorAll('.ap-dr').forEach((d) => d.addEventListener('toggle', () => {
      if (d.open) box.querySelectorAll('.ap-dr').forEach((o) => { if (o !== d) o.open = false; });
    }));

    // 最上面常駐
    const chk = box.querySelector('.ap-fabchk');
    chk.checked = S().fab;
    chk.addEventListener('change', () => { S().fab = chk.checked; save(); badge(); });
    box.querySelector('.ap-open').addEventListener('click', open);

    // 桌布
    bindWall(D('lock'), 'lock', sum('lock'), '沒有照片');
    bindWall(D('home'), 'home', sum('home'), '深灰藍');

    // 主畫面的深灰藍濾鏡：越往右越深，字越清楚
    const tr = box.querySelector('.ap-tint'), tv = box.querySelector('.ap-tintv');
    const showTint = () => {
      const v = S().homeTint;
      tr.value = v; tv.textContent = v + '%';
      D('home').querySelector('.ap-mini .ap-htint').style.opacity = v / 100;
      if (root && !root.hidden) root.querySelector('.ap-home .ap-htint').style.opacity = v / 100;
    };
    showTint();
    tr.addEventListener('input', () => { S().homeTint = +tr.value; save(); showTint(); });

    // App 名字
    box.querySelectorAll('.ap-name-in').forEach((el) => {
      el.value = S().names[el.dataset.id] || '';
      el.addEventListener('input', () => { S().names[el.dataset.id] = el.value.trim(); save(); if (root && !root.hidden) paintHome(); });
    });

    // 小工具
    sum('tools').textContent = '試試紅點';
    box.querySelector('.ap-test').addEventListener('click', () => { const s = S(); s.unseen = true; s.unseenMine = true; save(); badge(); });

    // 自動更新的設定
    stEl = box.querySelector('.ap-st');
    stSum = sum('auto');
    const ownEl = box.querySelector('.ap-owner'), nEl = box.querySelector('.ap-n'), autoChk = box.querySelector('.ap-autochk');
    const memoEl = box.querySelector('.ap-memo');
    const showAuto = () => { const a = S().auto; ownEl.textContent = a.owner || '（還沒設定）'; nEl.value = a.n; autoChk.checked = a.on; memoEl.value = a.memo || ''; status(); };
    memoEl.addEventListener('input', () => { S().auto.memo = memoEl.value; save(); });
    showAuto();
    autoChk.addEventListener('change', () => { S().auto.on = autoChk.checked; save(); status(); });
    box.querySelector('.ap-own').addEventListener('click', () => {
      const ch = curChar();
      if (!ch) { status('先打開一個角色的聊天，再按一次'); return; }
      S().auto.owner = ch.name; save();
      const md = ctx().chatMetadata; if (md) { md[MKEY] = msgCount(); saveMeta(); } // 從現在開始數
      showAuto();
    });
    nEl.addEventListener('change', () => { const v = Math.round(Number(nEl.value)); S().auto.n = Math.max(5, Math.min(200, Number.isFinite(v) ? v : 30)); save(); showAuto(); });
    box.querySelector('.ap-now').addEventListener('click', () => runUpdate(true));
  }

  jQuery(() => { build(); settingsPanel(); badge(); hookEvents(); });
})();
