// 安安的小手機 v0.10.0：鎖定畫面＋主畫面三頁＋每 N 則自動更新＋備忘錄＋拾穗小集＋瀏覽器＋行事曆＋日常物事＋餵食指南＋拾光手記（照安安自己說的規則排版）
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
    bolt: '<path d="M13 3L6 13.5h5L10 21l7-10.5h-5z"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4 4"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    lockon: '<rect x="5.5" y="11" width="13" height="9" rx="2"/><path d="M8.5 11V8a3.5 3.5 0 0 1 7 0v3"/><circle cx="12" cy="15.5" r="1.1"/>',
    lockoff: '<rect x="5.5" y="11" width="13" height="9" rx="2"/><path d="M8.5 11V8a3.5 3.5 0 0 1 6.8-1.2"/><circle cx="12" cy="15.5" r="1.1"/>',
    pin: '<path d="M12 14v6.5"/><path d="M9 3.5h6l-1 5 3 3.5H7l3-3.5z"/>', // 跟主畫面那顆圖釘同一個樣子
    face: '<path d="M4 8.5V6a2 2 0 0 1 2-2h2.5M15.5 4H18a2 2 0 0 1 2 2v2.5M20 15.5V18a2 2 0 0 1-2 2h-2.5M8.5 20H6a2 2 0 0 1-2-2v-2.5"/><path d="M9 9.5v1.5M15 9.5v1.5M12 9.5v3.5h-1"/><path d="M9.5 15.5a3.6 3.6 0 0 0 5 0"/>',
  };
  const ic = (k, s = 18) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[k] || P.memo}</svg>`;
  // App：[名字, 小點顏色, 細框＋圖示線條（同色系深一點）, 圖示]（第 44 窗：每顆小點都有細框）
  const APP = {
    line: ['LINE', '#B5D68F', '#6A8F45', 'line'], cal: ['行事曆', '#9DB4D3', '#5B7393', 'cal'], memo: ['備忘錄', '#8FC4AE', '#4F7A6B', 'memo'],
    web: ['瀏覽器', '#C9B9D6', '#7E6A92', 'web'], trivia: ['拾穗小集', '#C8A97E', '#9A7B52', 'wheat'],
    // 第二批（第 46 窗定的顏色）：日常物事＝陶土粉、餵食指南＝莓果粉、拾光手記＝深夜藍；框都是小點自己的同色系深一點
    shop: ['日常物事', '#DDA894', '#8A6E50', 'cart'], food: ['餵食指南', '#E6B3BE', '#A9677A', 'pin'], diary: ['拾光手記', '#4F5F7E', '#24324A', 'book'],
  };
  const ICOL = {}; // 圖示線條：都跟細框同色（第 45 窗：備忘錄改臻綠、LINE 改草綠，不再特別寫）
  const adot = (a) => { const x = APP[a] || APP.memo; return `<span class="ap-ad" style="background:${x[1]};box-shadow:0 0 0 1.2px ${x[2]}"></span>`; };
  const ME = '<span class="ap-me"></span>'; // 果果的鵝黃小點：鵝黃底＋蜂蜜金細框＋淡淡光暈

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
    if (s.auto.mute == null) s.auto.mute = ''; // 不會傳訊息來的人（名字只存在酒館）
    if (!s.names) s.names = {};
    if (s.homeTint == null) s.homeTint = 35; // 主畫面桌布上的深灰藍濾鏡（%）
    if (!s.memo) s.memo = { day: '', seq: 0, notes: [] }; // 他的備忘錄：內容由他在更新時自己寫
    if (!s.grains) s.grains = { seq: 0, items: [] }; // 拾穗小集：他撿的冷知識，一直累積、不換新
    if (!s.web) s.web = { seq: 0, items: [], draft: '', tabs: 2, peek: [] }; // 瀏覽器：他的搜尋紀錄（藏起來的要果果點開才看得到）
    if (s.auto.bind == null) { s.auto.bind = false; s.auto.chat = ''; } // 只在綁定的聊天室更新（開關）
    if (!s.cal) s.cal = { seq: 0, items: [] }; // 行事曆：他有約定時間的事（第 45 窗）
    if (!s.shop) s.shop = { seq: 0, cseq: 0, items: [], card: [], peek: [] }; // 日常物事：購物、家計、給小果的小卡（第 47 窗）
    if (!s.food) s.food = { seq: 0, items: [], peek: [] }; // 果果的餵食指南：一區一張卡的美食地圖
    if (!s.diary) s.diary = { seq: 0, items: [], draft: '' }; // 拾光手記：他的日記
    if (s.start == null) s.start = ''; // 開始的日子（拾光手記算第 N 天用；果果在設定裡自己填）
    return s;
  }
  const save = () => ctx().saveSettingsDebounced();
  const esc = (t) => String(t ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const CN = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
  const cn = (n) => (n <= 10 ? CN[n] : n < 20 ? '十' + CN[n - 10] : CN[Math.floor(n / 10)] + '十' + CN[n % 10]);

  // 不會傳訊息來的人：寄件人是他們的通知，程式直接拿掉
  const muteList = () => String(S().auto.mute || '').split(/[,，、\n]/).map((t) => t.trim()).filter(Boolean);
  const muted = (x) => x && x.app !== 'memo' && muteList().includes(String(x.from || '').trim());

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
            <div class="ap-nextcard" hidden></div>
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
          <div class="ap-view" data-app="web" hidden><div class="ap-vs"></div></div>
          <div class="ap-view" data-app="cal" hidden><div class="ap-vs"></div></div>
          <div class="ap-view" data-app="shop" hidden><div class="ap-vs"></div></div>
          <div class="ap-view" data-app="food" hidden><div class="ap-vs"></div></div>
          <div class="ap-view" data-app="diary" hidden><div class="ap-dy-page"><div class="ap-vs"></div></div><div class="ap-dy-lock" hidden></div></div>
          <div class="ap-bar"></div><div class="ap-barhit" aria-label="回主畫面"></div>
        </div>
      </div>`;
    document.documentElement.appendChild(root); // 掛在最外層，不受酒館主題的版面影響

    root.querySelector('.ap-dim').addEventListener('click', close);
    root.querySelector('.ap-x').addEventListener('click', close);
    root.querySelector('.ap-pill').addEventListener('click', () => root.querySelector('.ap-notes').classList.toggle('ap-open'));
    // 下一件事：點了原地冒出玻璃小卡（浮在上面、蓋住下面的東西）；小卡開著時，點哪裡都先收起來
    root.querySelector('.ap-lock').addEventListener('click', (e) => { if (!nextCard().hidden) { hideNextCard(); e.stopPropagation(); } }, true);
    root.querySelector('.ap-next').addEventListener('click', showNextCard);
    root.querySelector('.ap-list').addEventListener('click', (e) => {
      const nt = e.target.closest('.ap-note');
      if (!nt) return;
      unlock();
      if (['memo', 'trivia'].includes(nt.dataset.app) || (['cal', 'shop', 'food', 'diary'].includes(nt.dataset.app) && nt.dataset.id)) openApp(nt.dataset.app, nt.dataset.id); // 點通知：直接打開那個 App，那則亮一下
    });

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
      b.classList.remove('ap-boing'); void b.offsetWidth; b.classList.add('ap-boing'); // 點了都彈一下，果果才知道有點到
      if (READY.includes(b.dataset.id)) { const id = b.dataset.id; setTimeout(() => openApp(id), 190); } // 彈到一半再打開
    });
    home.addEventListener('animationend', (e) => e.target.classList.remove('ap-boing'));
    root.querySelectorAll('.ap-view').forEach((v) => {
      v.addEventListener('contextmenu', (e) => e.preventDefault()); // 長按不要跳出複製選單
      v.addEventListener('pointerdown', lpStart);
      ['pointerup', 'pointercancel', 'pointerleave'].forEach((t) => v.addEventListener(t, lpStop));
      v.addEventListener('pointermove', lpMove);
    });
    root.querySelector('.ap-view[data-app="web"]').addEventListener('click', (e) => {
      if (lpEat(e)) return;
      const r = e.target.closest('.ap-wr');
      if (!r) return;
      if (r.classList.contains('ap-hid')) { peekWeb(r); return; } // 藏起來的：先解鎖，再點才看得到心聲
      if (r.querySelector('.ap-wmur')) r.classList.toggle('ap-open');
    });
    root.querySelector('.ap-view[data-app="cal"]').addEventListener('click', (e) => {
      if (lpEat(e)) return;
      const t = e.target.closest('[data-ct]');
      if (t) { calTab = t.dataset.ct; paintCal(); return; }
      const m = e.target.closest('[data-cm]');
      if (m) { calMon = +m.dataset.cm; calSel = monthPick(calMon); paintCal(); return; }
      const d = e.target.closest('[data-cd]');
      if (d) { calSel = d.dataset.cd; paintCal(); return; }
      const r = e.target.closest('.ap-kr.ap-khas');
      if (r) r.classList.toggle('ap-open');
    });
    root.querySelector('.ap-view[data-app="shop"]').addEventListener('click', (e) => {
      if (lpEat(e)) return;
      const t = e.target.closest('[data-st]');
      if (t) { shopTab = t.dataset.st; paintShop(); root.querySelector('.ap-view[data-app="shop"] .ap-vs').scrollTop = 0; return; }
      const r = e.target.closest('.ap-sh-row.ap-hid, .ap-sh-crow.ap-hid');
      if (r) peekIn('shop', r.dataset.id); // 偷偷買的、上鎖的那格：解鎖，下次更新告訴他
    });
    root.querySelector('.ap-view[data-app="food"]').addEventListener('click', (e) => {
      if (lpEat(e)) return;
      const r = e.target.closest('.ap-fd-row');
      if (!r) return;
      if (r.classList.contains('ap-tl')) { r.classList.remove('ap-nope'); void r.offsetWidth; r.classList.add('ap-nope'); return; } // 時間鎖：日子還沒到，怎麼點都不開（輕輕晃一下）
      if (r.classList.contains('ap-hid')) { peekIn('food', r.dataset.id); return; }
      if (r.classList.contains('ap-has')) r.classList.toggle('ap-open');
    });
    root.querySelector('.ap-view[data-app="food"]').addEventListener('animationend', (e) => e.target.classList.remove('ap-nope'));
    root.querySelector('.ap-view[data-app="diary"]').addEventListener('click', (e) => {
      if (lpEat(e)) return;
      if (e.target.closest('.ap-dy-lock')) { faceUnlock(); return; }
      const r = e.target.closest('.ap-dy-ent:not(.ap-dy-draft)');
      if (r) r.classList.toggle('ap-open');
    });
    root.querySelector('.ap-view[data-app="memo"]').addEventListener('click', (e) => {
      if (lpEat(e)) return;
      const tab = e.target.closest('.ap-tab');
      if (tab) { showTab(tab.dataset.t); return; }
      const it = e.target.closest('.ap-mi');
      if (it) { tapItem(it); return; }
      const t = e.target.closest('.ap-mtext, .ap-gr');
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
  function lock() { closeApp(); hideNextCard(); root.querySelector('.ap-lock').hidden = false; root.querySelector('.ap-home').hidden = true; }
  function unlock() { hideNextCard(); root.querySelector('.ap-lock').hidden = true; root.querySelector('.ap-home').hidden = false; goPage(0, true); }
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
    root.querySelector('.ap-p3').innerHTML = `<button class="ap-app ap-diary" type="button" data-id="diary"><span class="ap-book">${ic('book', 24)}</span><span class="ap-name">拾光手記</span></button>`;
    root.querySelector('.ap-dock').innerHTML = HOME.dock.map((a) => `<button class="ap-app" type="button" data-id="${a.k}" aria-label="${a.n}"><span class="ap-tile">${ic(a.k, 26)}</span></button>`).join('');
    root.querySelector('.ap-home').classList.toggle('ap-nowall', !s.homeWall);
    root.querySelector('.ap-home .ap-htint').style.opacity = s.homeTint / 100;
    wallTo(root, s, 'home');
  }

  // ===== App =====
  const READY = ['memo', 'trivia', 'web', 'cal', 'shop', 'food', 'diary']; // 已經做好、點得開的 App
  const VIEW = { trivia: 'memo' }; // 拾穗小集住在備忘錄裡（第一頁是捷徑）
  let tab = 'memo';
  const inApp = () => !!root.querySelector('.ap-view:not([hidden])');
  function openApp(id, focus) {
    const v = root.querySelector(`.ap-view[data-app="${VIEW[id] || id}"]`);
    if (!v) return;
    if (v.dataset.app === 'memo') { tab = id === 'trivia' ? 'trivia' : 'memo'; paintMemo(); }
    if (id === 'web') paintWeb();
    if (id === 'cal') prepCal(focus); // 一打開選今天；從通知點進來就選那件事的那天
    if (id === 'shop') prepShop(focus); // 從通知點進來：先切到那筆所在的分頁
    if (id === 'food') paintFood();
    v.querySelector('.ap-vs').scrollTop = 0;
    v.hidden = false;
    if (id === 'diary') { paintDiary(); diaryLock(focus); root.querySelector('.ap-screen').classList.add('ap-lite'); return; } // 拾光手記：每次都先臉部解鎖

    if (v.dataset.app === 'memo' && tab === 'memo') replayChecks();
    focusIn(v, focus);
    root.querySelector('.ap-screen').classList.add('ap-lite'); // 紙色 App：上面的字和橫線變深色
  }
  // 從通知點進來：那則展開、捲到中間、亮一下
  function focusIn(v, focus) {
    const f = focus && v.querySelector(`.ap-vs [data-id="${focus}"]`);
    if (!f) return;
    if (!f.classList.contains('ap-hid') && !f.classList.contains('ap-tl')) f.classList.add('ap-open');
    // 只捲 App 自己的紙，不用 scrollIntoView（它會連整支手機一起捲，桌布往下挪過時整個畫面會往上跑）
    const vs = v.querySelector('.ap-vs');
    let top = 0; for (let el = f; el && el !== vs; el = el.offsetParent) top += el.offsetTop; // 收據、卡片裡的那一行也算得準
    vs.scrollTop = Math.max(0, top - (vs.clientHeight - f.offsetHeight) / 2);
    setTimeout(() => f.classList.add('ap-flash'), 250);
    f.addEventListener('animationend', () => f.classList.remove('ap-flash'), { once: true });
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
    // 照時間排，新的在上面（同一時間的話，後寫的在上面）
    const key = (n) => `${n.day || ''} ${n.time || ''} ${String(+String(n.id).slice(1) || 0).padStart(6, '0')}`;
    const byNew = (a, b) => (key(a) < key(b) ? 1 : -1);
    const pins = M.notes.filter((n) => n.pin).sort(byNew), today = M.notes.filter((n) => !n.pin).sort(byNew);
    const sec = (t, list) => (list.length ? `<div class="ap-msec">${t}</div>${list.map(memoNote).join('')}` : '');
    const G = S().grains.items.slice().sort((a, b) => b.no - a.no);
    const tr = tab === 'trivia';
    const tabs = `<div class="ap-tabs"><button type="button" class="ap-tab${tr ? '' : ' ap-on'}" data-t="memo">備忘錄</button><button type="button" class="ap-tab${tr ? ' ap-on' : ''}" data-t="trivia">拾穗小集</button></div>`;
    const vs = root.querySelector('.ap-view[data-app="memo"] .ap-vs');
    vs.innerHTML = tr ? `
      <div class="ap-meta">MEMO · 拾穗小集</div>
      <div class="ap-mtitle"><span class="ap-mdot ap-gdot"></span>拾穗小集${G.length ? `<span class="ap-gcount">共 ${G.length} 穗</span>` : ''}</div>
      ${tabs}${G.map(grainRow).join('')}
      ${G.length ? '' : '<div class="ap-mempty">還沒有撿到麥穗。</div>'}` : `
      <div class="ap-meta">MEMO · ${headDate()}</div>
      <div class="ap-mtitle"><span class="ap-mdot"></span>備忘錄</div>
      ${tabs}${sec('置頂', pins)}${sec('今天', today)}
      ${M.notes.length ? '' : '<div class="ap-mempty">還沒有記下什麼。</div>'}`;
  }
  function showTab(t) {
    tab = t === 'trivia' ? 'trivia' : 'memo';
    paintMemo();
    root.querySelector('.ap-view[data-app="memo"] .ap-vs').scrollTop = 0;
    if (tab === 'memo') replayChecks();
  }
  // ===== 瀏覽器（第 44 窗果果確認的草圖：灰白紙、搜尋列、照日期分組、藏起來的模糊＋小鎖）=====
  const nowDay = () => S().memo.day || isoDate(new Date().toISOString());
  function paintWeb() {
    const W = S().web;
    const key = (x) => `${x.day || ''} ${x.time || ''} ${String(+String(x.id).slice(1) || 0).padStart(6, '0')}`;
    const list = W.items.slice().sort((a, b) => (key(a) < key(b) ? 1 : -1));
    const days = [];
    list.forEach((x) => { const d = days.find((g) => g.day === x.day); d ? d.items.push(x) : days.push({ day: x.day, items: [x] }); });
    const row = (x) => {
      const hid = x.secret && !x.seen, open = x.secret && x.seen;
      // mur：他寫在這筆上的一句心聲（字尾淡紫小點；點了在下面展開）
      return `<div class="ap-wr${hid ? ' ap-hid' : ''}${open ? ' ap-peeked' : ''}" data-id="${x.id}"><span class="ap-wi">${ic(hid ? 'lockon' : open ? 'lockoff' : 'clock', 15)}</span><span class="ap-wq">${esc(x.q)}</span>${x.mur ? '<span class="ap-wm"></span>' : ''}<span class="ap-mw">${esc(x.time)}</span>${x.mur ? `<div class="ap-wmur">${esc(x.mur)}</div>` : ''}</div>`;
    };
    root.querySelector('.ap-view[data-app="web"] .ap-vs').innerHTML = `
      <div class="ap-meta">WEB · 搜尋紀錄</div>
      <div class="ap-mtitle"><span class="ap-mdot ap-wdot"></span>瀏覽器</div>
      <div class="ap-wbar"><div class="ap-wsearch">${ic('search', 15)}<span${W.draft ? ' class="ap-wdraft"' : ''}>${esc(W.draft || '搜尋或輸入網址')}</span></div><span class="ap-wtabs" aria-label="分頁">${Math.max(1, Math.min(9, +W.tabs || 1))}</span></div>
      ${days.map((g) => `<div class="ap-msec">${g.day === nowDay() ? '今天' : slash(g.day) || '更早'}</div>${g.items.map(row).join('')}`).join('')}
      ${list.length ? '' : '<div class="ap-mempty">還沒有搜尋紀錄。</div>'}`;
  }
  // 果果點開藏起來的那筆：解鎖、記下來，下次更新時告訴他
  function peekWeb(el) {
    const W = S().web, x = W.items.find((it) => it.id === el.dataset.id);
    if (!x) return;
    x.seen = true;
    if (!W.peek.includes(x.id)) W.peek.push(x.id);
    save();
    el.classList.remove('ap-hid'); el.classList.add('ap-peeked');
    el.querySelector('.ap-wi').innerHTML = ic('lockoff', 15);
  }

  // ===== 行事曆（第 45 窗果果確認的草圖：霧藍紙、月曆｜列表、深霧藍是它自己的記號）=====
  // 三種行程：work 出版社＝臻綠、family 家人＝天藍、her 果果＝鵝黃（他在酒館說的）
  const WD = '日一二三四五六';
  const dOf = (iso) => { const m = String(iso || '').match(/^(\d{4})-(\d{2})-(\d{2})$/); return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null; };
  const isoOf = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const addDays = (iso, n) => { const d = dOf(iso) || new Date(); d.setDate(d.getDate() + n); return isoOf(d); };
  const diffDays = (a, b) => Math.round((dOf(a) - dOf(b)) / 864e5); // a 比 b 晚幾天
  const mdw = (iso) => { const d = dOf(iso); return d ? `${d.getMonth() + 1}/${d.getDate()} 週${WD[d.getDay()]}` : ''; };
  const storyNow = () => ({ day: nowDay(), time: hm(S().lock.time) }); // 劇情的「現在」：停在上次更新那一刻
  const kSort = (a, b) => (`${a.day} ${a.time || '00:00'} ${a.id}` < `${b.day} ${b.time || '00:00'} ${b.id}` ? -1 : 1);
  // 過去了沒：前幾天的、今天時間已經過了的（變淡）
  const kPast = (x, n = storyNow()) => x.day < n.day || (x.day === n.day && !!x.time && !!n.time && x.time < n.time);
  const kShow = (x, n) => x.day >= addDays(n.day, -7); // 過期一週以上的收起來
  // 鎖定畫面「下一件事」：行事曆裡劇情時間之後最近的一件（他不用另外寫，兩邊才不會對不上）
  function nextEv() {
    const n = storyNow();
    return S().cal.items.filter((x) => !kPast(x, n)).sort(kSort)[0] || null;
  }
  function nextWhen(x) {
    const dd = diffDays(x.day, storyNow().day);
    const day = dd === 0 ? '今天' : dd === 1 ? '明天' : dd > 1 && dd < 7 ? '週' + WD[dOf(x.day).getDay()] : slash(x.day);
    return x.time ? `${day} ${x.time}` : day;
  }
  const nextCard = () => root.querySelector('.ap-nextcard');
  function showNextCard() {
    const x = nextEv();
    if (!x) return;
    const c = nextCard();
    c.innerHTML = `<div class="ap-nch"><span class="ap-kc ap-k-${x.cat}"></span>${esc(mdw(x.day))} ${x.time ? esc(x.time) : '整天'}</div>`
      + `<div class="ap-nct">${esc(x.title)}</div>${x.body ? `<div class="ap-ncb">${esc(x.body)}</div>` : ''}`;
    c.hidden = false;
  }
  const hideNextCard = () => { if (root) nextCard().hidden = true; };

  let calTab = 'month', calMon = 0, calSel = ''; // 看月曆還是列表、看這個月(0)還是下個月(1)、點選的那天
  const monthStart = (k) => { const d = dOf(nowDay()) || new Date(); return new Date(d.getFullYear(), d.getMonth() + k, 1); };
  // 切到某個月時先選哪天：這個月選今天；下個月選第一件事那天，沒有就 1 號
  function monthPick(k) {
    const n = storyNow(), key = isoOf(monthStart(k)).slice(0, 7);
    if (n.day.slice(0, 7) === key) return n.day;
    const f = S().cal.items.filter((x) => x.day.slice(0, 7) === key && kShow(x, n)).sort(kSort)[0];
    return f ? f.day : key + '-01';
  }
  function prepCal(focus) {
    const n = storyNow(), x = focus && S().cal.items.find((it) => it.id === focus);
    if (x) { calSel = x.day; calMon = x.day.slice(0, 7) === n.day.slice(0, 7) ? 0 : 1; } else { calMon = 0; calSel = n.day; }
    paintCal();
  }
  function kRow(x, n, withDate) {
    return `<div class="ap-kr${kPast(x, n) ? ' ap-kpast' : ''}${x.body ? ' ap-khas' : ''}" data-id="${x.id}">`
      + `<div class="ap-kh"><span class="ap-kc ap-k-${x.cat}"></span><span class="ap-kt">${esc(x.title)}</span><span class="ap-mw">${esc(withDate ? slash(x.day) : (x.time || '整天'))}</span></div>`
      + `${x.body ? `<div class="ap-kb">${esc(x.body)}</div>` : ''}</div>`;
  }
  function paintCal() {
    const K = S().cal, n = storyNow();
    const m0 = monthStart(calTab === 'month' ? calMon : 0), key = isoOf(m0).slice(0, 7); // 列表永遠從這個月開始算（這個月＋下個月）
    const tabs = `<div class="ap-tabs ap-ktabs"><button type="button" class="ap-tab${calTab === 'month' ? ' ap-on' : ''}" data-ct="month">月曆</button>`
      + `<button type="button" class="ap-tab${calTab === 'list' ? ' ap-on' : ''}" data-ct="list">列表</button>`
      + (calTab === 'month' ? `<span class="ap-kmon">${[0, 1].map((k) => `<button type="button"${k === calMon ? ' class="ap-on"' : ''} data-cm="${k}">${monthStart(k).getMonth() + 1}月</button>`).join('')}</span>` : '') + '</div>';
    let body;
    if (calTab === 'month') {
      const byDay = {};
      K.items.filter((x) => x.day.slice(0, 7) === key && kShow(x, n)).sort(kSort).forEach((x) => { (byDay[x.day] = byDay[x.day] || []).push(x); });
      let cells = '<span></span>'.repeat(m0.getDay());
      const last = new Date(m0.getFullYear(), m0.getMonth() + 1, 0).getDate();
      for (let i = 1; i <= last; i++) {
        const iso = `${key}-${String(i).padStart(2, '0')}`;
        const cls = ['ap-kday', iso < n.day ? 'ap-kold' : '', iso === calSel ? 'ap-ksel' : '', iso === n.day ? 'ap-ktoday' : ''].filter(Boolean).join(' ');
        cells += `<button type="button" class="${cls}" data-cd="${iso}"><span class="ap-kn">${i}</span><span class="ap-kds">${(byDay[iso] || []).slice(0, 3).map((x) => `<i class="ap-kc ap-k-${x.cat}"></i>`).join('')}</span></button>`;
      }
      const sel = (byDay[calSel] || []);
      body = `<div class="ap-kwk">${[...WD].map((w) => `<span>${w}</span>`).join('')}</div><div class="ap-kgrid">${cells}</div>`
        + '<div class="ap-klg"><span><i class="ap-kc ap-k-work"></i>出版社</span><span><i class="ap-kc ap-k-family"></i>家人/朋友</span><span><i class="ap-kc ap-k-her"></i>果果</span></div>' // 圖例（第 45 窗草圖）
        + `<div class="ap-ksec">${calSel === n.day ? '今天・' : ''}${mdw(calSel)}</div>`
        + (sel.length ? sel.map((x) => kRow(x, n)).join('') : '<div class="ap-kempty">這天沒有排事。</div>');
    } else {
      // 列表：今天在最上面，往下由近到遠；過去一週的淡淡收在最下面
      const end = isoOf(new Date(m0.getFullYear(), m0.getMonth() + 2, 0));
      const up = K.items.filter((x) => x.day >= n.day && x.day <= end).sort(kSort);
      const gone = K.items.filter((x) => x.day < n.day && kShow(x, n)).sort(kSort).reverse();
      const groups = [];
      up.forEach((x) => { const g = groups.find((y) => y.day === x.day); if (g) g.items.push(x); else groups.push({ day: x.day, items: [x] }); });
      body = groups.map((g) => `<div class="ap-ksec">${g.day === n.day ? '今天・' : ''}${mdw(g.day)}</div>${g.items.map((x) => kRow(x, n)).join('')}`).join('')
        + (gone.length ? `<div class="ap-ksec">已經過去</div>${gone.map((x) => kRow(x, n, true)).join('')}` : '')
        + (up.length || gone.length ? '' : '<div class="ap-kempty">這兩個月還沒有排事。</div>');
    }
    root.querySelector('.ap-view[data-app="cal"] .ap-vs').innerHTML = `
      <div class="ap-meta">CALENDAR · ${m0.getMonth() + 1}月</div>
      <div class="ap-mtitle"><span class="ap-mdot ap-kdot"></span>行事曆</div>
      ${tabs}${body}`;
  }

  // ===== 第二批共用 =====
  // 重畫 App 時停在原本捲到的地方（解鎖、刪掉一筆後不會跳回最上面）
  function keepScroll(app, fn) {
    const vs = root.querySelector(`.ap-view[data-app="${app}"] .ap-vs`), y = vs ? vs.scrollTop : 0;
    fn();
    if (vs) vs.scrollTop = y;
  }
  // 果果點開他上鎖的：解鎖、記下來，下次更新時告訴他（跟瀏覽器一樣）
  function peekIn(app, id) {
    const B = S()[app], x = (B.items || []).find((it) => it.id === id) || (B.card || []).find((it) => it.id === id);
    if (!x) return;
    x.seen = true;
    if (!B.peek.includes(id)) B.peek.push(id);
    save();
    keepScroll(app, app === 'shop' ? paintShop : paintFood);
  }
  const STAR = '<svg class="ap-fd-ico" viewBox="0 0 24 24" width="12" height="12" aria-label="星星"><path d="M12 3.2l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L3.3 9.5l6.1-.7z" fill="#E2B23F"/></svg>';
  const HEART = '<svg class="ap-fd-ico" viewBox="0 0 24 24" width="12" height="12" aria-label="愛心"><path d="M12 20.5s-7.8-4.7-7.8-10.3A4.3 4.3 0 0 1 12 7.7a4.3 4.3 0 0 1 7.8 2.5c0 5.6-7.8 10.3-7.8 10.3z" fill="#C2564F"/></svg>';

  // ===== 日常物事（第 46 窗定案：柴米油鹽的燕麥底＋收據條；陶土粉是它的記號）=====
  let shopTab = 'buy'; // buy 購物、bill 家計、her 小果
  function prepShop(focus) {
    const H = S().shop, x = focus && H.items.find((it) => it.id === focus);
    if (x) shopTab = x.tab; else if (focus && H.card.some((it) => it.id === focus)) shopTab = 'her';
    paintShop();
  }
  // 畫面上看得到哪些：購物留最近一個月；家計蓋了章的過一週消失、沒蓋章的過一個月消失
  const shopShow = (x, n) => (x.tab === 'bill' && x.stamp ? (x.sday || x.day) >= addDays(n.day, -7) : x.day >= addDays(n.day, -30));
  function paintShop() {
    const H = S().shop, n = storyNow();
    const tabs = `<div class="ap-tabs ap-sh-tabs">${[['buy', '購物'], ['bill', '家計'], ['her', '小果']].map(([k, t]) =>
      `<button type="button" class="ap-tab${shopTab === k ? ' ap-on' : ''}" data-st="${k}">${t}</button>`).join('')}</div>`;
    let body;
    const lk = (hid) => `<span class="ap-sh-lk">${ic(hid ? 'lockon' : 'lockoff', 15)}</span>`;
    if (shopTab === 'her') {
      // 小果：一張小卡（照 46 草圖：上面「小果的尺寸」，左邊項目、右邊內容）；他更新時是改那一格或多一格
      body = H.card.length ? `<div class="ap-sh-card"><span class="ap-sh-cdot"></span><div class="ap-sh-ctitle">小果的尺寸</div>${H.card.map((c) => {
        const hid = c.lock && !c.seen;
        return `<div class="ap-sh-crow${hid ? ' ap-hid' : ''}" data-id="${c.id}"><span class="ap-sh-ck">${esc(c.k)}</span>`
          + `<span class="ap-sh-cv">${c.lock ? lk(hid) : ''}${hid ? '<span class="ap-sh-bl"></span>' : `<span class="ap-sh-ct">${esc(c.v)}</span>`}</span></div>`;
      }).join('')}</div>` : '<div class="ap-mempty">還沒有寫下什麼。</div>';
    } else if (shopTab === 'bill') {
      // 家計：跟購物一樣一天一張收據（上面「— 10/31 —」），右邊只放價錢；處理好的在名字後面蓋「買」或「繳」、字變淡＋淡淡的劃線
      const list = H.items.filter((x) => x.tab === 'bill' && shopShow(x, n));
      const days = [...new Set(list.map((x) => x.day))].sort().reverse();
      const row = (x) => `<div class="ap-sh-row${x.stamp ? ' ap-done' : ''}" data-id="${x.id}">`
        + `<span class="ap-sh-nm">${esc(x.name)}</span>${x.stamp ? `<span class="ap-sh-stamp">${esc(x.stamp)}</span>` : ''}<span class="ap-sh-pr">${esc(x.price || '')}</span></div>`;
      body = days.map((d) => `<div class="ap-sh-rc"><div class="ap-sh-rd">— ${slash(d)} —</div>${list.filter((x) => x.day === d).map(row).join('')}</div>`).join('')
        || '<div class="ap-mempty">家計清單是空的。</div>';
    } else {
      // 購物：一天一張收據（上面「— 10/31 —」），每筆右邊是時間；偷偷買給小果的上鎖
      const list = H.items.filter((x) => x.tab === 'buy' && shopShow(x, n));
      const days = [...new Set(list.map((x) => x.day))].sort().reverse();
      const row = (x) => {
        const hid = x.secret && !x.seen;
        return `<div class="ap-sh-row${hid ? ' ap-hid' : ''}" data-id="${x.id}">${x.secret ? lk(hid) : ''}`
          + `${hid ? '<span class="ap-sh-bl"></span>' : `<span class="ap-sh-nm">${esc(x.name)}</span>`}<span class="ap-sh-pr">${x.price ? `<b>${esc(x.price)}</b>` : ''}${esc(x.time || '')}</span></div>`;
      };
      body = days.map((d) => `<div class="ap-sh-rc"><div class="ap-sh-rd">— ${slash(d)} —</div>${list.filter((x) => x.day === d).map(row).join('')}</div>`).join('')
        || '<div class="ap-mempty">這個月還沒有購物紀錄。</div>';
    }
    root.querySelector('.ap-view[data-app="shop"] .ap-vs').innerHTML = `
      <div class="ap-meta">SHOP · 購物紀錄</div>
      <div class="ap-mtitle"><span class="ap-mdot ap-sh-dot"></span>日常物事</div>
      ${tabs}${body}`;
  }

  // ===== 果果的餵食指南（第 46 窗定案：一區一張摺頁地圖卡；莓果粉是它的記號）=====
  const fdLate = (x, n = storyNow()) => x.lock === 'date' && x.open && n.day < x.open; // 時間鎖：劇情日期還沒到
  function paintFood() {
    const s = S(), F = s.food, n = storyNow();
    const areas = [];
    F.items.forEach((x) => { const a = areas.find((g) => g.area === x.area); a ? a.items.unshift(x) : areas.push({ area: x.area, items: [x] }); }); // 區照第一次出現的順序；區裡新的在上面
    const row = (x) => {
      const tl = fdLate(x, n), hid = x.lock === 'tap' && !x.seen, shut = tl || hid; // 解開之後就跟一般的一樣
      const mark = shut ? `<span class="ap-fd-lk">${ic('lockon', 15)}</span>` : `<span class="ap-fd-mk">${x.mark === 'heart' ? HEART : STAR}</span>`;
      const name = shut ? '<span class="ap-fd-bl"></span>' : `<span class="ap-fd-nm">${esc(x.name)}</span>`;
      return `<div class="ap-fd-row${tl ? ' ap-tl' : ''}${hid ? ' ap-hid' : ''}${x.note && !shut ? ' ap-has' : ''}" data-id="${x.id}">`
        + `<div class="ap-fd-h">${mark}${name}${tl ? `<span class="ap-fd-when">${slash(x.open)} 打開</span>` : ''}</div>${x.note && !shut ? `<div class="ap-fd-note">${esc(x.note)}</div>` : ''}</div>`;
    };
    const pin = `<svg class="ap-fd-pin" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#A9677A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/></svg>`; // App 裡面：地圖標記（46 草圖那顆）；通知用主畫面那種圖釘
    root.querySelector('.ap-view[data-app="food"] .ap-vs').innerHTML = `
      <div class="ap-meta">MAP · 美食地圖</div>
      <div class="ap-mtitle"><span class="ap-mdot ap-fd-dot"></span>${esc(nm({ id: 'food', n: '餵食指南' }, s))}</div>
      ${areas.map((g) => `<div class="ap-fd-card"><div class="ap-fd-hd">${pin}<span class="ap-fd-area">${esc(g.area)}</span><span class="ap-fd-cnt">${g.items.length} 間</span></div><div class="ap-fd-list">${g.items.map(row).join('')}</div></div>`).join('')
        || '<div class="ap-mempty">還沒有標上任何一間。</div>'}`;
  }

  // ===== 拾光手記（第 46 窗定案：象牙白紙＋左邊深藍書脊；每次打開先臉部解鎖）=====
  const DG = '零一二三四五六七八九';
  // 101 → 一百零一、345 → 三百四十五、1000 → 一千、15 → 十五
  function cnBig(n) {
    if (!(n >= 1 && n <= 9999)) return String(n);
    const u = ['千', '百', '十', ''], d = String(n).padStart(4, '0');
    let out = '', zero = false;
    for (let i = 0; i < 4; i++) {
      const k = +d[i];
      if (!k) { if (out) zero = true; continue; }
      if (zero) { out += '零'; zero = false; }
      out += DG[k] + u[i];
    }
    return out.startsWith('一十') ? out.slice(1) : out;
  }
  // 「第 N 天」：劇情日期 − 開始的日子 ＋ 1（開始那天＝第一天）；還沒填開始的日子就寫日期
  function dayTitle(day) {
    const st = S().start;
    if (!dOf(st) || !dOf(day)) return slash(day) || '今天';
    const k = diffDays(day, st) + 1;
    return k >= 1 ? `第${cnBig(k)}天` : slash(day);
  }
  function paintDiary() {
    const D = S().diary, hasStart = !!dOf(S().start);
    const list = D.items.slice().sort((a, b) => (`${a.day} ${String(+a.id.slice(1)).padStart(6, '0')}` < `${b.day} ${String(+b.id.slice(1)).padStart(6, '0')}` ? 1 : -1));
    const draft = D.draft ? `<div class="ap-dy-ent ap-dy-draft"><div class="ap-dy-h"><span class="ap-dy-t">${esc(dayTitle(nowDay()))}</span><span class="ap-dy-d">${esc(slash(nowDay()) ? slash(nowDay()) + ' · ' : '')}草稿</span></div>`
      + `<div class="ap-dy-b">${esc(D.draft)}<i class="ap-dy-cur"></i></div></div>` : '';
    root.querySelector('.ap-view[data-app="diary"] .ap-vs').innerHTML = `
      <div class="ap-meta">DIARY · 拾光手記</div>
      <div class="ap-mtitle"><span class="ap-mdot ap-dy-dot"></span>拾光手記</div>
      ${draft}${list.map((x) => `<div class="ap-dy-ent" data-id="${x.id}"><div class="ap-dy-h"><span class="ap-dy-t">${esc(dayTitle(x.day))}</span>`
        + `<span class="ap-dy-d">${esc(hasStart ? slash(x.day) : x.time || '')}</span></div><div class="ap-dy-b">${esc(x.body)}</div></div>`).join('')}
      ${list.length || draft ? '' : '<div class="ap-mempty">還沒有寫下什麼。</div>'}`;
  }
  // 解鎖畫面：象牙紙中間一本小深藍書＋臉部辨識圖示；點一下 → 辨識框閃一下 → 小書翻開 → 日記出現
  let dyFocus = null, dyBusy = false;
  function diaryLock(focus) {
    const L = root.querySelector('.ap-dy-lock');
    dyFocus = focus || null; dyBusy = false;
    L.className = 'ap-dy-lock';
    L.innerHTML = `<div class="ap-dy-book"><div class="ap-dy-inner"></div><div class="ap-dy-cover"><span class="ap-dy-face">${ic('face', 28)}</span><span class="ap-dy-rule"></span></div></div>`
      + '<div class="ap-dy-name">拾光手記</div><div class="ap-dy-hint">輕觸以臉部解鎖</div>';
    L.hidden = false;
  }
  function faceUnlock() {
    if (dyBusy) return;
    dyBusy = true;
    const L = root.querySelector('.ap-dy-lock');
    L.classList.add('ap-scan');
    setTimeout(() => L.classList.add('ap-turn'), 620);
    setTimeout(() => L.classList.add('ap-gone'), 1250);
    setTimeout(() => { L.hidden = true; dyBusy = false; focusIn(root.querySelector('.ap-view[data-app="diary"]'), dyFocus); dyFocus = null; }, 1600);
  }

  // ===== 長按刪除（只有果果能刪；平常看不到，截圖也乾淨）=====
  let lp = null, lpAt = 0;
  const LPT = '.ap-mn, .ap-gr, .ap-wr, .ap-kr, .ap-sh-row, .ap-sh-crow, .ap-fd-row, .ap-dy-ent:not(.ap-dy-draft)';
  function lpStart(e) {
    const t = e.target.closest(LPT);
    if (e.target.closest('.ap-rm')) return;
    clearDel(t);
    if (!t) return;
    lp = { t, x: e.clientX, y: e.clientY, id: setTimeout(() => { lp = null; lpAt = Date.now(); showDel(t); }, 550) };
  }
  function lpMove(e) { if (lp && Math.hypot(e.clientX - lp.x, e.clientY - lp.y) > 8) lpStop(); }
  function lpStop() { if (lp) { clearTimeout(lp.id); lp = null; } }
  const lpEat = (e) => {
    const d = e.target.closest('.ap-rm');
    if (d) { delItem(d.parentElement); return true; }
    return Date.now() - lpAt < 450; // 長按放開的那一下不要算成點擊（不會順便打勾、展開）
  };
  function clearDel(keep) { root.querySelectorAll('.ap-rm').forEach((d) => { if (d.parentElement !== keep) d.remove(); }); }
  function showDel(t) {
    if (t.querySelector(':scope > .ap-rm')) return;
    t.insertAdjacentHTML('beforeend', '<button type="button" class="ap-rm">拿掉</button>');
  }
  function delItem(t) {
    const s = S(), id = t.dataset.id;
    if (t.classList.contains('ap-mn')) s.memo.notes = s.memo.notes.filter((n) => n.id !== id);
    else if (t.classList.contains('ap-gr')) {
      s.grains.items = s.grains.items.filter((g) => g.id !== id);
      s.grains.items.sort((a, b) => a.no - b.no).forEach((g, i) => { g.no = i + 1; }); // 編號重排，不跳號
    } else if (t.classList.contains('ap-wr')) {
      s.web.items = s.web.items.filter((x) => x.id !== id);
      s.web.peek = s.web.peek.filter((x) => x !== id);
    } else if (t.classList.contains('ap-kr')) s.cal.items = s.cal.items.filter((x) => x.id !== id);
    else if (t.classList.contains('ap-sh-row')) { s.shop.items = s.shop.items.filter((x) => x.id !== id); s.shop.peek = s.shop.peek.filter((x) => x !== id); }
    else if (t.classList.contains('ap-sh-crow')) { s.shop.card = s.shop.card.filter((x) => x.id !== id); s.shop.peek = s.shop.peek.filter((x) => x !== id); }
    else if (t.classList.contains('ap-fd-row')) { s.food.items = s.food.items.filter((x) => x.id !== id); s.food.peek = s.food.peek.filter((x) => x !== id); }
    else if (t.classList.contains('ap-dy-ent')) s.diary.items = s.diary.items.filter((x) => x.id !== id);
    s.notes = s.notes.filter((x) => x.id !== id); // 鎖定畫面上指到它的通知也拿掉
    save();
    const app = t.closest('.ap-view')?.dataset.app;
    keepScroll(app, () => (app === 'web' ? paintWeb() : app === 'cal' ? paintCal() : app === 'shop' ? paintShop() : app === 'food' ? paintFood() : app === 'diary' ? paintDiary() : paintMemo()));
  }

  // ===== 拾穗小集（第 44 窗果果確認的草圖）=====
  // 一穗：№編號、標題、說給果寶聽過的鵝黃小點、分類小印記；點了原地展開全文和出處
  function grainRow(g) {
    return `<div class="ap-gr" data-id="${g.id}">
      <div class="ap-gh"><span class="ap-gno">№${g.no}</span><span class="ap-gt">${esc(g.title)}</span>${g.told ? ME : ''}${g.cat ? `<span class="ap-gtag">${esc(g.cat)}</span>` : ''}</div>
      <div class="ap-gb">${esc(g.body)}</div>
      <div class="ap-gs">${g.src ? '— ' + esc(g.src) + ' · ' : '— '}${slash(g.day)}</div></div>`;
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

  function ring(pct, k, chg) {
    const p = Math.max(0, Math.min(100, Number(pct) || 0));
    const c = chg ? '#8FC4AE' : '#F6F3EC'; // 充電中：圓環變臻綠、中間換成小閃電
    return `<div class="ap-ring${chg ? ' ap-chg' : ''}" style="background:conic-gradient(${c} 0 ${p}%,rgba(255,255,255,.2) ${p}% 100%)"><span>${ic(chg ? 'bolt' : k, 14)}</span></div>`;
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
    root.querySelector('.ap-bat').classList.toggle('ap-chg', !!L.battery?.charging); // 充電中：臻綠＋裡面一顆白色小閃電
    const W = (L.weather || []).slice(0, 2);
    root.querySelector('.ap-weather').innerHTML = '<div class="ap-lb">天 氣</div>'
      + W.map((w, i) => `<div class="${i ? 'ap-sm' : ''}">${esc(w.place)} <b>${esc(w.temp)}</b>${w.extra ? ' ' + esc(w.extra) : ''}</div>`).join('');
    // 下一件事：從行事曆拿；還沒有行事曆時（升級後第一次更新前）先顯示原本那句
    const nx = nextEv(), old = !s.cal.on && !s.cal.seq && L.next?.what ? L.next : null;
    const nxWhat = nx ? nx.title : old ? old.what : '', nxWhen = nx ? nextWhen(nx) : old ? old.when : '', nxMine = nx ? nx.cat === 'her' : !!old?.mine;
    const nxEl = root.querySelector('.ap-next');
    nxEl.innerHTML = '<div class="ap-lb">下 一 件 事</div>' + (nxWhat ? `<div><b>${esc(nxWhen)}</b></div><div class="ap-sm">${esc(nxWhat)}${nxMine ? ' ' + ME : ''}</div>` : '<div class="ap-sm ap-none">近期沒有排事</div>');
    nxEl.classList.toggle('ap-tap', !!nx);
    root.querySelector('.ap-rings').innerHTML = ring(L.battery?.phone, 'mob', !!L.battery?.charging) + ring(L.battery?.buds, 'buds');
    root.querySelector('.ap-quote span').textContent = L.quote || '';

    const notes = s.notes.filter((x) => !muted(x)).slice(0, 8);
    const box = root.querySelector('.ap-notes');
    box.hidden = !notes.length;
    box.classList.remove('ap-open');
    const apps = [...new Set(notes.map((x) => x.app))];
    // 膠囊只放各 App 的色點（第 45 窗拿掉鵝黃點：卡片左邊已經有鵝黃線）
    root.querySelector('.ap-pill').innerHTML = apps.map(adot).join('')
      + `<span>${notes.length} 則新通知</span>${ic('down', 14)}`;
    root.querySelector('.ap-list').innerHTML = notes.map((x) => {
      const [name, , line, k] = APP[x.app] || APP.memo;
      // 小點永遠是 App 自己的顏色；跟果果有關的改成卡片左邊一條鵝黃線（第 44 窗）
      return `<div class="ap-note ap-glass${x.mine ? ' ap-mine' : ''}" data-app="${x.app}"${x.id ? ` data-id="${esc(x.id)}"` : ''}>
        <div class="ap-hd"><span class="ap-ic" style="color:${ICOL[x.app] || line}">${ic(k, 14)}</span>${esc(name)}${adot(x.app)}<span class="ap-when">${esc(x.when)}</span></div>
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
    root.querySelector('.ap-screen').scrollTop = 0; // 保險：手機畫面本身永遠不捲動
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
  const chatId = () => { const c = ctx(); return String((typeof c.getCurrentChatId === 'function' ? c.getCurrentChatId() : c.chatId) || ''); };
  const bound = () => { const a = S().auto; return !a.bind || !a.chat || a.chat === chatId(); }; // 開關關著、或就是綁定的聊天室
  const isOwner = () => { const a = S().auto, ch = curChar(); return !!(a.owner && ch && ch.name === a.owner && bound()); };
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
    else if (!bound()) put(`現在不是綁定的聊天室　·　${tail}`);
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
    const grainsNow = s.grains.items.map((g) => ({ id: g.id, title: g.title, told: !!g.told })); // 只給標題，收很多穗也不會太重
    const webNow = s.web.items.slice(-15).map((x) => ({ id: x.id, q: x.q, secret: !!x.secret, mur: x.mur || undefined }));
    const peeked = s.web.items.filter((x) => s.web.peek.includes(x.id)).map((x) => x.q);
    const calNow = s.cal.items.filter((x) => x.day >= addDays(nowDay(), -7)).sort(kSort).slice(0, 30).map((x) => ({ id: x.id, day: x.day, time: x.time, title: x.title, cat: x.cat }));
    const nd = storyNow();
    const shopNow = { items: s.shop.items.filter((x) => shopShow(x, nd)).slice(-25).map((x) => (x.tab === 'bill'
      ? { id: x.id, tab: 'bill', name: x.name, kind: x.kind, stamped: !!x.stamp } : { id: x.id, tab: 'buy', day: x.day, name: x.name, secret: !!x.secret })),
      card: s.shop.card.map((c) => ({ id: c.id, k: c.k, v: c.v, lock: !!c.lock })) };
    const foodNow = s.food.items.slice(-40).map((x) => ({ id: x.id, area: x.area, name: x.name, mark: x.mark, lock: x.lock || undefined, open: x.open || undefined }));
    const diaryNow = { recent: s.diary.items.slice(-3).map((x) => ({ day: x.day, body: x.body })), draft: s.diary.draft }; // 只給最近幾篇，越寫越多也不會變慢
    const now = { weather: L.weather, cal: calNow, battery: L.battery, quote: L.quote, notes: s.notes, memoDay: s.memo.day, memo: memoNow, grains: grainsNow,
      web: { draft: s.web.draft, tabs: s.web.tabs, history: webNow }, shop: shopNow, food: foodNow, diary: diaryNow };
    const peekShop = [...s.shop.items, ...s.shop.card].filter((x) => s.shop.peek.includes(x.id)).map((x) => x.name || `${x.k}：${x.v}`);
    const peekFood = s.food.items.filter((x) => s.food.peek.includes(x.id)).map((x) => x.name);
    const memo = String(s.auto.memo || '').trim().slice(0, 4000);
    const mute = muteList();
    const sys = `你負責替角色「${him}」更新他手機上的內容（鎖定畫面、行事曆、備忘錄、拾穗小集、瀏覽器、日常物事、餵食指南、拾光手記）。${me} 是他最重要的人。只輸出一個 JSON 物件，不要任何說明、不要狀態欄、不要 markdown。`;
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
2. cal：他的行事曆，只放「有約定時間」的事（約會、截稿、會議、回家吃飯、帶毛孩看醫生…）。鎖定畫面的「下一件事」和行事曆通知，程式會從這裡自己拿，你不用另外寫。
   - add：要放進行事曆、但 cal 裡還沒有的事，沒有就給 []。可以寫的有三種：①最近劇情裡說到、約好的事；②角色設定和小抄裡寫的固定行程（像每週固定的事），寫成這個月和下個月裡實際的那幾天；③他手機現在的內容（備忘錄、瀏覽器）裡已經提到、有確定日期的事。不能自己編新的事。cal 是空的時候可以一次補到 8 則，平常每次最多 3 則。
   - day 寫成「2026-02-17」；time 像「15:00」，整天的事給空字串；title 15 字內；body 是細節，40 字內，沒有就給空字串。
   - cat 只能是這三個其中一個：work（出版社的截稿、編輯會議、工作）、family（家人、毛孩、朋友，他的私人生活）、her（跟 ${me} 的約定、為她安排的事）。
   - 有時間的事寫在行事曆；沒有時間的待辦寫在備忘錄。同一件事不要兩邊都寫。
   - 不要重複 cal 裡已經有的事（同一天、意思一樣都不行）。
3. battery：phone 和 buds 是 0～100 的整數，跟著他的一天自然變化：用手機、出門在外會慢慢往下掉，可以掉到 50 以下；他回到家會插上充電，電量往上；睡一覺起來是 100。charging：他的手機現在是不是插著在充電（true／false），在家、在充電時才是 true。
4. quote：今日摘句，由他自己決定換不換。不換就回傳原本那句，一字不改；要換的話，是他親手打的一句話，30 字以內，用他的語氣。
5. notes：3～5 則通知。app 只能是 line、web 其中一個（行事曆、備忘錄和拾穗小集的通知程式會自己拿，你不用寫）；from 10 字以內（聯絡人、行程名或 App 標題）；text 40 字以內；when 用阿拉伯數字，像「現在」「5分鐘前」「2小時前」「昨天」；mine 只給真的跟 ${me} 有關的：傳給她的、在聊她的、跟她的約會或計畫；只是順便提到的不算。每次至少 1～2 則跟 ${me} 無關（工作、朋友、家人的日常）。聯絡人名字要照小抄裡存的名字寫。小抄裡的個性和習慣是參考，不要照抄裡面的句子，每次用新的說法。這次的通知要是新的：不要重複「他手機現在的內容」裡的通知，也不用每次都出現同樣的人，挑這段劇情裡最可能傳訊息來的人。通知都是「別人傳給他」或「他的 App 提醒他」的，不要寫他自己傳出去的訊息。${mute.length ? `這些人不會傳訊息來，from 絕對不能是他們：${mute.join('、')}。` : ''}內容要跟劇情和他的生活對得上，不要編出劇情裡沒有的大事件。
6. memo：他自己記給自己看的備忘錄。用他的口吻，記他自己會想記下的事；記什麼由他決定。有約定時間的事寫在行事曆（cal），這裡記沒有時間的待辦和想法。
   - add：這次新增的 0～2 則，沒有想記的就給空陣列 []。每則的 kind 是 text 或 list：
     text＝一段話：title 15 字內、body 80 字內。
     list＝勾勾清單：title 15 字內、items 是 1～6 個項目（每項 18 字內的字串）。
     pin：只有長期要記住的事才是 true（會一直留著）；time：他記下的時間，像「15:20」；mine：跟 ${me} 有關才是 true。
   - check：劇情裡他已經做到的項目，寫成 {"id":"m3","i":0}（id 是那則備忘錄的 id，i 是第幾項，從 0 開始）。只能勾 memo 裡還沒勾的項目，沒有就給 []。
   - 如果劇情的日期跟 memoDay 不一樣（到了新的一天），沒有置頂的備忘錄會自動清掉，只留置頂；這次 add 的就是新的一天寫的。
   - 不要重複寫 memo 裡已經有的事；舊的置頂不用重寫。
7. grains：「拾穗小集」，他收冷知識的小本子（住在備忘錄裡）。他平常讀書、校稿、查典故時撿到有趣的冷知識，就一顆一顆收進來；收什麼、怎麼寫由他決定，用他的口吻。
   - add：這次撿到的新的一穗，最多 1 穗，不一定每次都有，沒有就給 null。title 15 字內；body 80 字內；cat 只能是 典故、歷史、植物、天文、動物 其中一個；src 是出處，12 字內（像在哪本書看到、誰教的、校稿時看到）；told：劇情裡他已經把這個冷知識說給 ${me} 聽過，就是 true。
   - 劇情裡他跟 ${me} 分享過的冷知識，可以收進來；小抄裡提到過、grains 裡還沒有的舊冷知識，也可以撿進來。
   - told：grains 裡已經有、這段劇情裡他說給 ${me} 聽了的，寫它的 id，像 ["t2"]；沒有就給 []。
   - 不要撿 grains 裡已經有的（標題、內容意思一樣都不行）。
8. web：他的瀏覽器。他六成在出版社查證稿子（歷史年份、植物這類），四成在通勤或家裡查生活的事；分頁很少，超過五個就會全關。
   - add：這段劇情裡他新查的 0～3 筆，沒有就給 []。q 是他打進搜尋列的字，20 字內，要像真的人在搜尋（關鍵字、短句、有時是問句）；time 像「15:20」。有時連續幾筆會像一串思路（同一件事一路越查越細）；也可以接著 history 裡以前查過的事繼續查（換個說法、查得更細），讓一件事慢慢查上好幾天。
   - secret：還沒準備好讓 ${me} 看到的（驚喜、偷偷在學的、會害羞的）才是 true，大部分都是 false。
   - draft：他最近一次打到一半、沒有按下搜尋的字，15 字內；沒有就給空字串。
   - tabs：他現在開著的分頁數，1～5 的整數。
   - unhide：history 裡 secret 的、他覺得已經不用藏的，寫它的 id，像 ["w3"]；沒有就給 []。
   - mur：他偷偷寫在某一筆搜尋上的一句心聲（為什麼查、查的時候在想什麼），25 字內，用他的口吻。不是每次都要有，每次最多 1 句：寫在 add 的某一筆裡（那筆的 "mur"），或寫給 history 裡已經有、還沒有 mur 的某一筆（web 的 "mur" 寫成 {"id":"w3","t":"…"}）；沒有就都不用寫（add 的 mur 給空字串、web 的 mur 給 null）。
   - 不要重複 history 裡已經有的搜尋。${peeked.length ? `\n   - ${me} 剛剛偷看了他藏起來的這幾筆：「${peeked.join('」「')}」。他會知道被看到了，要不要有反應（備忘錄、通知、或乾脆不藏了）由他決定。` : ''}
9. shop：「日常物事」，他記生活開銷的地方。
   - add：這段劇情裡新出現的 0～3 筆，沒有就給 []。tab 只能是 buy 或 bill：
     buy＝購物紀錄，他已經買好的東西；secret：想偷偷準備給 ${me}、還不想讓她看到的才是 true，大部分都是 false。
     bill＝家計清單，還沒處理的家裡的事（要繳的帳單、要補貨的東西）；kind：pay（帳單、要繳的錢）或 buy（要去買的）。
     name 15 字內；price 像「$320」，不知道就給空字串；time 像「15:20」。
   - stamp：家計裡他已經處理好的，寫它的 id，像 ["s4"]。日常小事總會做完，他可以自己判斷，不用等劇情提到；沒有就給 []。
   - card：「小果的尺寸」小卡，只記 ${me} 的尺寸和她身上用的東西（衣服尺碼、鞋號、身體乳、戒圍這類）；吃的、喝的、他煮的菜不寫在這裡。k 是項目名（6 字內），v 是內容（20 字內）；寫已經有的項目名＝改那一格，寫新的項目名＝多一格；lock：要先藏起來的才是 true。只寫劇情、角色設定或小抄裡知道的，不要自己編；沒有要改就給 []。
   - unhide：buy 裡 secret 的、或小卡裡 lock 的，他覺得已經不用藏了，寫它的 id；沒有就給 []。
   - 不要重複 shop 裡已經有的。${peekShop.length ? `\n   - ${me} 剛剛偷看了他藏起來的這幾筆：「${peekShop.join('」「')}」。他會知道被看到了，要不要有反應（備忘錄、通知、不藏了、或乾脆不說）由他決定。` : ''}
10. food：「${s.names.food || '餵食指南'}」，他的美食地圖，一區一張卡。
   - add：這段劇情裡新的 0～2 間，沒有就給 []。area 是區名（6 字內，像行政區、商圈、城市；已經有的區照原本的寫法）；name 店名 12 字內；mark 是 star 或 heart：star＝${me} 提過想吃的、或他路過覺得舒服想帶她去的；heart＝一起吃過、她說喜歡的。note 是他的備註，30 字內，用他的口吻。
   - lock：一般給空字串；還不想讓 ${me} 看到的給 "tap"；想等到某一天才讓她打開的給 "date"，並把那天寫在 open（像「2026-03-28」）。
   - heart：food 裡已經有、這段劇情裡一起去吃了而且她說喜歡的，寫它的 id，像 ["f2"]；沒有就給 []。
   - 只寫劇情、角色設定或小抄裡出現過的店，或他生活裡自然會知道的店；不要重複 food 裡已經有的。${peekFood.length ? `\n   - ${me} 剛剛偷看了他上鎖的這幾間：「${peekFood.join('」「')}」。他會知道被看到了，要不要有反應由他決定。` : ''}
11. diary：「拾光手記」，他的日記，只有他自己看。記的多半是一天裡很碎的小事，用他的口吻。不一定每次都寫，想寫才寫。
   - add：這次寫好的一篇，沒有就給 null。body 150 字內；time 像「23:40」。
   - draft：他打到一半還沒寫完的一句，30 字內；下次可以寫完放進 add、重寫，或給空字串。
   - 不要重複 diary.recent 裡已經寫過的內容。
12. 全部用繁體中文、台灣用語。

只輸出這個格式：
{"date":"","time":"","weather":[{"place":"","temp":"","extra":""},{"place":"","temp":"","extra":""}],"cal":{"add":[{"day":"","time":"","title":"","body":"","cat":"work"}]},"battery":{"phone":0,"buds":0,"charging":false},"quote":"","notes":[{"app":"line","from":"","text":"","when":"","mine":false}],"memo":{"add":[{"kind":"text","title":"","body":"","items":[],"pin":false,"time":"","mine":false}],"check":[]},"grains":{"add":null,"told":[]},"web":{"add":[{"q":"","time":"","secret":false,"mur":""}],"draft":"","tabs":2,"unhide":[],"mur":null},"shop":{"add":[{"tab":"buy","name":"","price":"","time":"","secret":false,"kind":""}],"stamp":[],"card":[],"unhide":[]},"food":{"add":[{"area":"","name":"","mark":"star","note":"","lock":"","open":""}],"heart":[]},"diary":{"add":null,"draft":""}}`;
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
    const pct = (v, old) => { const n = Math.round(Number(v)); return Number.isFinite(n) ? Math.max(1, Math.min(100, n)) : old; };
    if (o.battery) L.battery = { phone: pct(o.battery.phone, L.battery?.phone ?? 76), buds: pct(o.battery.buds, L.battery?.buds ?? 88), charging: o.battery.charging === true };
    if (typeof o.quote === 'string' && o.quote.trim()) L.quote = clean(o.quote, 40);
    const N = Array.isArray(o.notes) ? o.notes.filter((x) => x && ['line', 'web'].includes(x.app) && x.text && !muted(x)).slice(0, 5) : [];
    if (N.length) s.notes = N.map((x) => ({ app: x.app, from: clean(x.from, 12), text: clean(x.text, 50), when: numWhen(clean(x.when, 8)), mine: !!x.mine }));
    else s.notes = s.notes.filter((x) => !['memo', 'trivia', 'cal', 'shop', 'food', 'diary'].includes(x.app)); // 舊的行事曆／備忘錄／拾穗通知拿掉，下面重新拿
    // 日期時間跟著劇情，停在更新那一刻；AI 看不出來就維持原本的
    const sd = storyDate(o.date), st = String(o.time || '').match(/(\d{1,2})[:：](\d{2})/);
    if (sd && st) { L.date = sd; L.time = st[1].padStart(2, '0') + ':' + st[2]; }
    applyMemo(o.memo, isoDate(o.date));
    memoNotice();
    applyCal(o.cal);
    calNotice();
    grainNotice(applyGrains(o.grains));
    applyWeb(o.web);
    putNote(shopNotice(applyShop(o.shop)));
    putNote(applyFood(o.food));
    applyDiary(o.diary); // 拾光手記不跳通知（果果說日記不用）
    s.unseen = true;
    s.unseenMine = s.notes.some((x) => x.mine) || nextEv()?.cat === 'her';
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
    s.notes.splice(Math.min(1, s.notes.length), 0, { app: 'memo', id: n.id, from: clean(n.title, 12), text: clean(text, 50), when, mine: !!n.mine });
    s.notes = s.notes.slice(0, 6);
  }

  // 瀏覽器：加新的搜尋（亂寫、重複的擋掉）、打到一半的字、分頁數、不藏了的；果果偷看過的清掉（他這次已經知道了）
  function applyWeb(w) {
    const W = S().web;
    W.peek = [];
    if (!w || typeof w !== 'object') return;
    (Array.isArray(w.unhide) ? w.unhide : []).forEach((id) => { const x = W.items.find((it) => it.id === id); if (x) x.secret = false; });
    if (typeof w.draft === 'string') W.draft = clean(w.draft, 18);
    const t = Math.round(Number(w.tabs)); if (Number.isFinite(t)) W.tabs = Math.max(1, Math.min(5, t));
    let murLeft = 1; // 心聲每次最多 1 句
    (Array.isArray(w.add) ? w.add : []).slice(0, 3).forEach((x) => {
      const q = clean(x?.q, 24);
      if (!q || W.items.some((it) => it.q === q)) return;
      const it = { id: 'w' + (++W.seq), q, day: nowDay(), time: hm(x.time) || S().lock.time || '', secret: x.secret === true, seen: false };
      const m = clean(x.mur, 30);
      if (m && murLeft) { it.mur = m; murLeft--; }
      W.items.push(it);
    });
    if (murLeft && w.mur && typeof w.mur === 'object') {
      const it = W.items.find((x) => x.id === w.mur.id), m = clean(w.mur.t, 30);
      if (it && m && !it.mur) it.mur = m;
    }
    W.items = W.items.slice(-40); // 留最近 40 筆，太舊的自己消失
  }

  // 行事曆：加新的（亂寫、重複的擋掉）；過期一個月以上的自己消失
  const KCAT = { work: 'work', family: 'family', her: 'her', mine: 'her', 出版社: 'work', 工作: 'work', 家人: 'family' };
  // 日期：2026-02-17、2月17日、2/17、3-28、今天／明天／後天 都認得（沒寫年份就用劇情那年；早了兩個月以上算明年）
  function kDay(t) {
    const base = dOf(nowDay()) || new Date(), v = String(t ?? '').trim();
    let m = v.match(/(\d{4})\D+(\d{1,2})\D+(\d{1,2})/);
    if (m) return isoOf(new Date(+m[1], +m[2] - 1, +m[3]));
    const rel = { 今天: 0, 今日: 0, 明天: 1, 後天: 2 }[v];
    if (rel != null) return addDays(isoOf(base), rel);
    m = v.match(/^(\d{1,2})\s*[/月.-]\s*(\d{1,2})/);
    if (!m) return '';
    const d = new Date(base.getFullYear(), +m[1] - 1, +m[2]);
    if (d < base - 60 * 864e5) d.setFullYear(d.getFullYear() + 1);
    return isoOf(d);
  }
  function applyCal(c) {
    const K = S().cal, n = storyNow();
    K.on = true; // 新版更新過了：舊版留下的「下一件事」那句退休
    if (c && typeof c === 'object') {
      const same = (t) => String(t).replace(/[\s「」『』，。、！？：:]/g, '');
      (Array.isArray(c.add) ? c.add : []).slice(0, K.items.length ? 3 : 8).forEach((x) => { // 行事曆空的時候第一次可以補到 8 則
        const day = kDay(x?.day), title = clean(x?.title, 16);
        if (!dOf(day) || !title) return;
        if (K.items.some((it) => it.day === day && same(it.title) === same(title))) return;
        K.items.push({ id: 'c' + (++K.seq), day, time: hm(x.time), title, body: clean(x.body, 44), cat: KCAT[String(x.cat || '').trim()] || 'family' });
      });
    }
    K.items = K.items.filter((x) => x.day >= addDays(n.day, -30)).sort(kSort).slice(-80);
  }
  // 鎖定畫面的行事曆通知：今天、明天的下一件事，從行事曆真的拿（AI 不另外寫，才不會對不上）
  function calNotice() {
    const s = S(), x = nextEv(), n = storyNow();
    if (!x) return;
    const dd = diffDays(x.day, n.day);
    if (dd > 1) return;
    let when = dd === 1 ? '明天' : '今天';
    if (dd === 0 && x.time && n.time) {
      const m = (+x.time.slice(0, 2) * 60 + +x.time.slice(3)) - (+n.time.slice(0, 2) * 60 + +n.time.slice(3));
      when = m < 1 ? '現在' : m < 60 ? `${m}分鐘後` : `${Math.floor(m / 60)}小時後`;
    }
    const text = [(dd ? '明天' : '今天') + (x.time ? ' ' + x.time : '整天'), x.body].filter(Boolean).join('・');
    s.notes.unshift({ app: 'cal', id: x.id, from: clean(x.title, 12), text: clean(text, 50), when, mine: x.cat === 'her' });
    s.notes = s.notes.slice(0, 6);
  }

  // 拾穗小集：他說給果寶聽了的補上鵝黃點（只能補上、不能拿掉）→ 撿新的一穗（亂寫的、重複的擋掉）
  const CATS = ['典故', '歷史', '植物', '天文', '動物'];
  function applyGrains(g) {
    const G = S().grains;
    if (!g || typeof g !== 'object') return null;
    (Array.isArray(g.told) ? g.told : []).forEach((id) => { const x = G.items.find((it) => it.id === id); if (x) x.told = true; });
    const a = Array.isArray(g.add) ? g.add[0] : g.add;
    const title = clean(a?.title, 16), body = cleanBody(a?.body, 90);
    if (!title || !body) return null;
    const same = (t) => t.replace(/[\s「」『』，。、！？]/g, '');
    if (G.items.some((x) => same(x.title) === same(title))) return null;
    const n = { id: 't' + (++G.seq), no: G.items.length + 1, title, body, cat: CATS.includes(String(a.cat).trim()) ? String(a.cat).trim() : '',
      src: clean(a.src, 14), day: S().memo.day || isoDate(new Date().toISOString()), told: a.told === true };
    G.items.push(n);
    return n;
  }
  // 鎖定畫面的拾穗通知：撿到新的一穗才有，內容從那一穗真的拿
  function grainNotice(n) {
    if (!n) return;
    const s = S();
    s.notes.splice(Math.min(2, s.notes.length), 0, { app: 'trivia', id: n.id, from: clean('拾得一穗：' + n.title, 20), text: clean(n.body, 50), when: '現在', mine: !!n.told });
    s.notes = s.notes.slice(0, 6);
  }

  // ===== 第二批：把他寫的收進來（亂寫的、重複的擋掉，保留原本）=====
  const arr = (v) => (Array.isArray(v) ? v : []);
  const sameT = (t) => String(t || '').replace(/[\s「」『』，。、！？：:・·]/g, '');
  const putNote = (x, pos = 3) => { if (!x) return; const s = S(); s.notes.splice(Math.min(pos, s.notes.length), 0, x); s.notes = s.notes.slice(0, 7); };
  // 日常物事：不藏了的 → 蓋章 → 加新的 → 小果小卡改一格或多一格；過期的自己消失
  function applyShop(o) {
    const H = S().shop, n = storyNow();
    H.peek = []; // 果果偷看過的，他這次已經知道了
    let fresh = null;
    if (o && typeof o === 'object') {
      arr(o.unhide).forEach((id) => { const x = H.items.find((it) => it.id === id) || H.card.find((it) => it.id === id); if (x) { x.secret = false; x.lock = false; } });
      arr(o.stamp).forEach((id) => { const x = H.items.find((it) => it.id === id && it.tab === 'bill'); if (x && !x.stamp) { x.stamp = x.kind === 'pay' ? '繳' : '買'; x.sday = n.day; } });
      arr(o.add).slice(0, 3).forEach((a) => {
        const name = clean(a?.name, 16), tab = a?.tab === 'bill' ? 'bill' : 'buy';
        if (!name || H.items.some((it) => it.tab === tab && shopShow(it, n) && sameT(it.name) === sameT(name))) return;
        const it = { id: 's' + (++H.seq), tab, name, price: clean(a.price, 10), day: n.day, time: hm(a.time) || S().lock.time || '' };
        if (tab === 'buy') { it.secret = a.secret === true; it.seen = false; } else { it.kind = a.kind === 'pay' ? 'pay' : 'buy'; it.stamp = ''; }
        H.items.push(it);
        if (!it.secret && !fresh) fresh = it; // 通知：這次第一筆新的（購物或家計都可以；偷偷買的不跳）
      });
      arr(o.card).slice(0, 4).forEach((c) => {
        const k = clean(c?.k, 8), v = clean(c?.v, 24);
        if (!k || !v) return;
        const old = H.card.find((x) => sameT(x.k) === sameT(k));
        if (old) { old.v = v; if (c.lock === true && !old.lock) { old.lock = true; old.seen = false; } }
        else if (H.card.length < 12) H.card.push({ id: 'q' + (++H.cseq), k, v, lock: c.lock === true, seen: false });
      });
    }
    H.items = H.items.filter((x) => shopShow(x, n)).slice(-80);
    return fresh;
  }
  const shopNotice = (x) => x && { app: 'shop', id: x.id, from: x.tab === 'bill' ? '家計・還沒處理' : '購物紀錄', text: clean(x.name + (x.price ? '　' + x.price : ''), 50), when: '現在', mine: false };
  // 餵食指南：改成愛心 → 加新店（區由他寫，寫了新的區就自動多一區）
  function applyFood(o) {
    const F = S().food;
    F.peek = [];
    if (!o || typeof o !== 'object') return null;
    let note = null;
    arr(o.heart).forEach((id) => {
      const x = F.items.find((it) => it.id === id);
      if (!x || x.mark === 'heart') return;
      x.mark = 'heart';
      if (!note && !fdLate(x) && !(x.lock === 'tap' && !x.seen)) note = { app: 'food', id: x.id, from: '改成愛心', text: `${x.area}・${x.name}`, when: '現在', mine: true };
    });
    arr(o.add).slice(0, 2).forEach((a) => {
      let area = clean(a?.area, 8);
      const name = clean(a?.name, 14);
      if (!area || !name || F.items.some((it) => sameT(it.name) === sameT(name))) return;
      area = F.items.find((it) => sameT(it.area) === sameT(area))?.area || area; // 同一區的不同寫法併在一起
      let lock = a.lock === 'tap' || a.lock === 'date' ? a.lock : '';
      const open = lock === 'date' ? kDay(a.open) : '';
      if (lock === 'date' && !open) lock = 'tap'; // 時間鎖沒寫日子：當成一般的鎖
      const it = { id: 'f' + (++F.seq), area, name, mark: a.mark === 'heart' ? 'heart' : 'star', note: clean(a.note, 34), lock, open, seen: false, day: nowDay() };
      F.items.push(it);
      if (!note && !lock) note = { app: 'food', id: it.id, from: it.mark === 'heart' ? '畫上愛心' : '標了一顆星星', text: `${area}・${name}`, when: '現在', mine: it.mark === 'heart' };
    });
    F.items = F.items.slice(-120);
    return note;
  }
  // 拾光手記：打到一半的草稿 → 這次寫好的那一篇（不一定每次都有）
  function applyDiary(o) {
    const D = S().diary;
    if (!o || typeof o !== 'object') return null;
    if (typeof o.draft === 'string') D.draft = clean(o.draft, 40);
    const a = Array.isArray(o.add) ? o.add[0] : o.add;
    const body = cleanBody(typeof a === 'string' ? a : a?.body, 300);
    if (!body) return null;
    const it = { id: 'd' + (++D.seq), day: nowDay(), time: hm(a?.time) || S().lock.time || '', body, mine: a?.mine === true };
    D.items.push(it);
    return it;
  }
  // 日記的通知不露內容（要臉部解鎖才看得到）
  const diaryNotice = (x) => x && { app: 'diary', id: x.id, from: dayTitle(x.day), text: '輕觸以臉部解鎖查看', when: '現在', mine: false };

  async function runUpdate(manual) {
    if (busy) return;
    if (!isOwner()) { if (manual) status(!S().auto.owner ? '先按「設成現在的角色」' : !bound() ? '現在不是綁定的聊天室，不能更新' : `現在不是 ${S().auto.owner} 的聊天，不能更新`); return; }
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
          ${drawer('diary', '📖 拾光手記', `
          <div class="ap-row">開始的日子（這天是第一天，日記標題的「第 N 天」從這裡算）</div>
          <div class="ap-row"><input type="date" class="text_pole ap-start"><div class="menu_button ap-start-clr">清掉</div></div>`)}
          ${drawer('auto', '🔄 自動更新', `
          <label class="checkbox_label"><input type="checkbox" class="ap-autochk"> 開啟自動更新</label>
          <div class="ap-row">這是誰的手機：<b class="ap-owner"></b><div class="menu_button ap-own">設成現在的角色</div></div>
          <label class="checkbox_label"><input type="checkbox" class="ap-bindchk"> 只在綁定的聊天室更新（關掉就是他的每個聊天室都會更新）</label>
          <div class="ap-row">綁定：<b class="ap-bindname"></b><div class="menu_button ap-bind">設成這個聊天室</div></div>
          <div class="ap-row">每 <input type="number" class="text_pole ap-n" min="5" max="200" step="1"> 則更新一次</div>
          <div class="ap-row">他手機的小抄（給 AI 看：聯絡人、App 的設定）</div>
          <textarea class="text_pole ap-memo" rows="6" maxlength="4000" placeholder="例：LINE 置頂只有……"></textarea>
          <div class="ap-row">不會傳訊息來的人（名字照小抄寫，用、分開；他們的通知會直接拿掉）</div>
          <input type="text" class="text_pole ap-mute" maxlength="200" placeholder="例：示範聯絡人">
          <div class="ap-row ap-st"></div>
          <div class="ap-row"><div class="menu_button ap-now">現在更新</div></div>`)}
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

    // 拾光手記：開始的日子（果果自己填，不寫死在程式）
    const stIn = box.querySelector('.ap-start');
    const showStart = () => { const v = S().start; stIn.value = dOf(v) ? v : ''; sum('diary').textContent = dOf(v) ? v.replace(/-/g, '/') + ' 開始' : '還沒填開始的日子'; };
    showStart();
    stIn.addEventListener('change', () => { S().start = dOf(stIn.value) ? stIn.value : ''; save(); showStart(); if (root && !root.hidden && inApp()) paintDiary(); });
    box.querySelector('.ap-start-clr').addEventListener('click', () => { S().start = ''; save(); showStart(); });

    // 自動更新的設定
    stEl = box.querySelector('.ap-st');
    stSum = sum('auto');
    const ownEl = box.querySelector('.ap-owner'), nEl = box.querySelector('.ap-n'), autoChk = box.querySelector('.ap-autochk');
    const memoEl = box.querySelector('.ap-memo');
    const bindChk = box.querySelector('.ap-bindchk'), bindName = box.querySelector('.ap-bindname');
    const showAuto = () => { const a = S().auto; ownEl.textContent = a.owner || '（還沒設定）'; nEl.value = a.n; autoChk.checked = a.on; memoEl.value = a.memo || '';
      bindChk.checked = !!a.bind; bindName.textContent = a.chat || '（還沒設定）'; status(); };
    bindChk.addEventListener('change', () => { S().auto.bind = bindChk.checked; save(); showAuto(); });
    box.querySelector('.ap-bind').addEventListener('click', () => {
      const id = chatId();
      if (!id) { status('先打開一個聊天室，再按一次'); return; }
      S().auto.chat = id; save(); showAuto();
    });
    memoEl.addEventListener('input', () => { S().auto.memo = memoEl.value; save(); });
    const muteEl = box.querySelector('.ap-mute');
    muteEl.value = S().auto.mute || '';
    muteEl.addEventListener('input', () => { S().auto.mute = muteEl.value; save(); if (root && !root.hidden) paint(); });
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
