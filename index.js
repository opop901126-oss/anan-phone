// 安安的小手機 v0.16.0：鎖定畫面＋主畫面三頁＋每 N 則自動更新＋備忘錄＋拾穗小集＋瀏覽器＋行事曆＋日常物事＋餵食指南＋拾光手記＋相機＋電話＋音樂＋相簿＋Threads＋2026機密企劃＋主畫面小點＋LINE（照安安自己說的規則排版）
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
    // 電話 App 裡的小圖示（第 48 窗）：撥出、來電、未接（電話＋右上角的小箭頭／叉）、留著的書籤
    tout: '<path d="M6.5 3.5h3l1.5 4.5-2 1.5a11 11 0 0 0 5.5 5.5l1.5-2 4.5 1.5v3a2 2 0 0 1-2 2C11 19.5 4.5 13 4.5 5.5a2 2 0 0 1 2-2z"/><path d="M15.5 3.5h5v5M20.5 3.5l-5.5 5.5"/>',
    tin: '<path d="M6.5 3.5h3l1.5 4.5-2 1.5a11 11 0 0 0 5.5 5.5l1.5-2 4.5 1.5v3a2 2 0 0 1-2 2C11 19.5 4.5 13 4.5 5.5a2 2 0 0 1 2-2z"/><path d="M20.5 3.5L15 9M15 4.5V9h4.5"/>',
    tmiss: '<path d="M6.5 3.5h3l1.5 4.5-2 1.5a11 11 0 0 0 5.5 5.5l1.5-2 4.5 1.5v3a2 2 0 0 1-2 2C11 19.5 4.5 13 4.5 5.5a2 2 0 0 1 2-2z"/><path d="M15.5 3.5l5 5M20.5 3.5l-5 5"/>',
    mark: '<path d="M7 4h10v16l-5-4-5 4z"/>',
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
    back: '<path d="M14.5 6l-6 6 6 6"/>',
    folder: '<path d="M3.5 7.5a2 2 0 0 1 2-2h4l2 2.2h7a2 2 0 0 1 2 2v7.8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"/>',
    smile: '<circle cx="12" cy="12" r="8.5"/><path d="M8.6 14.2a4.2 4.2 0 0 0 6.8 0"/><circle cx="9.3" cy="10" r=".7"/><circle cx="14.7" cy="10" r=".7"/>',
    send: '<path d="M4.5 12.2L19.5 5l-4.6 14.5-3.4-5.8z"/><path d="M11.5 13.7l8-8.7"/>',
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
    // 第三批（第 48 窗）：相機＝石墨灰
    cam: ['相機', '#B9BDC2', '#5E646B', 'cam'], phone: ['電話', '#E6D3B8', '#A08463', 'phone'], // 電話＝米杏
    music: ['音樂', '#A9636E', '#6E3540', 'music'], // 音樂＝酒紅（第 48 窗）
    album: ['相簿', '#BDBF8F', '#767A47', 'photo'], // 相簿＝橄欖（第 49 窗）
    threads: ['Threads', '#D9A35E', '#9A6A2C', 'threads'], // Threads＝焦糖（第 50 窗；鵝黃心意專區）
    secret: ['2026機密企劃', '#B5574B', '#7E3329', 'lock'], // 機密企劃＝封蠟紅（第 51 窗；跟「完」印章同色）
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
    if (!s.mus) s.mus = { seq: 0, fixed: '', lists: [], now: { t: '', a: '' }, last: '' }; // 音樂：固定歌單（果果在設定填）＋他開的歌單、正在播放（第 48 窗）
    if (!s.tel) s.tel = { day: '', seq: 0, calls: [], vm: [], favs: '', last: '' }; // 電話：通話紀錄（換新的一天清掉）、語音信箱（留著的不清）、最愛（果果在設定填）（第 48 窗）
    if (!s.cam) s.cam = { day: '', seq: 0, items: [] }; // 相機：沒拍到的瞬間，劇情換新的一天整本換新（第 48 窗）
    if (!s.alb) s.alb = { seq: 0, folders: [], photos: [], wall: '', wallDay: '', last: '' }; // 相簿：照片檔放在酒館伺服器（Railway 硬碟），這裡只記路徑、資料夾、說明、位置（第 49 窗）
    if (!s.th) s.th = { seq: 0, cseq: 0, rseq: 0, him: '', me: '', posts: [] }; // Threads：他的脆（新的在前面，留 100 篇；圖存 Railway，第 50 窗）
    if (!s.sec) s.sec = { pw: '', book: '', seq: 0, nseq: 0, peek: false, slip: '', items: [], bingo: {}, bk: null }; // 機密企劃：密碼、他寫的計畫、賓果準備筆記；賓果格子從世界書讀（bk＝上次讀到的，第 51 窗）
    if (!s.hdot) s.hdot = {}; // 主畫面 App 小點：有新東西的 App（點進去再出來就消失，第 50 窗）
    if (!s.line) s.line = { seq: 0, me: { name: '', av: '' }, him: { av: '' }, dad: { bday: '', gone: '' }, roster: [], stk: [], ours: { msgs: [], unread: 0 }, chats: {}, dadMsgs: [], peek: [] }; // LINE：名單＋貼圖（果果在設定填，名字只存在酒館）、你們的聊天室、別人的聊天室、爸（第 53 窗）
    if (!s.line.peek) s.line.peek = [];
    if (s.line.wiSkip == null) s.line.wiSkip = '狀態欄、好感'; // LINE 不讀的世界書條目（標題有這些字就跳過）
    if (s.start == null) s.start = ''; // 開始的日子（拾光手記算第 N 天用；果果在設定裡自己填）
    return s;
  }
  const save = () => ctx().saveSettingsDebounced();
  // 心聲小點：果果點開看過一次＝記住，小點變空心（第 52 窗；瀏覽器、音樂）
  const murSeen = (r, x, dot) => { if (!x || x.seen || !r.classList.contains('ap-open')) return; x.seen = true; save(); r.querySelector(dot)?.classList.add('ap-seen'); };
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
              <div class="ap-nrow"><button class="ap-pill ap-glass" type="button"></button><button class="ap-nclr ap-glass" type="button">清除</button></div>
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
          <div class="ap-view" data-app="cam" hidden><div class="ap-vs"></div></div>
          <div class="ap-view" data-app="phone" hidden><div class="ap-vs"></div></div>
          <div class="ap-view ap-lnv" data-app="line" hidden><div class="ap-ln-hd" hidden></div><div class="ap-vs"></div><div class="ap-ln-foot" hidden></div></div>
          <div class="ap-view" data-app="music" hidden><div class="ap-vs"></div></div>
          <div class="ap-view" data-app="album" hidden><div class="ap-vs"></div></div>
          <div class="ap-view ap-th" data-app="threads" hidden><div class="ap-vs"></div><input type="file" accept="image/*" class="ap-th-file" hidden></div>
          <div class="ap-view ap-sc" data-app="secret" hidden><div class="ap-vs"></div><div class="ap-sc-door" hidden></div></div>
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
    // 通知（第 50 窗）：點了就不見、左右滑掉一則、展開時「清除」全部
    const dropNote = (k, keepOpen) => { const s = S(); if (s.notes[k]) { s.notes.splice(k, 1); save(); } paint(); if (keepOpen && S().notes.some((x) => !muted(x))) root.querySelector('.ap-notes').classList.add('ap-open'); };
    root.querySelector('.ap-nclr').addEventListener('click', (e) => { e.stopPropagation(); S().notes = []; save(); paint(); });
    let sw = null, swAt = 0;
    const list = root.querySelector('.ap-list');
    list.addEventListener('pointerdown', (e) => { const el = e.target.closest('.ap-note'); sw = el ? { el, x: e.clientX, y: e.clientY, dir: null } : null; });
    window.addEventListener('pointermove', (e) => {
      if (!sw) return;
      const dx = e.clientX - sw.x, dy = e.clientY - sw.y;
      if (!sw.dir && Math.hypot(dx, dy) > 8) sw.dir = Math.abs(dx) > Math.abs(dy) ? 'h' : 'v';
      if (sw.dir !== 'h') return;
      sw.el.style.transition = 'none';
      sw.el.style.transform = `translateX(${dx}px)`;
      sw.el.style.opacity = String(Math.max(.2, 1 - Math.abs(dx) / sw.el.offsetWidth));
    });
    const swEnd = (e) => {
      if (!sw) return;
      const { el, dir } = sw, dx = (e.clientX ?? sw.x) - sw.x; sw = null;
      if (dir !== 'h') return;
      swAt = Date.now();
      el.style.transition = 'transform .2s ease, opacity .2s ease';
      if (Math.abs(dx) > el.offsetWidth / 3) { el.style.transform = `translateX(${dx > 0 ? 120 : -120}%)`; el.style.opacity = '0'; setTimeout(() => dropNote(+el.dataset.k, true), 200); }
      else { el.style.transform = ''; el.style.opacity = ''; }
    };
    window.addEventListener('pointerup', swEnd, true); // 手指滑出清單外放開也算（用捕捉，別人擋住冒泡也收得到）
    window.addEventListener('pointercancel', swEnd, true);
    root.querySelector('.ap-list').addEventListener('click', (e) => {
      const nt = e.target.closest('.ap-note');
      if (!nt || Date.now() - swAt < 350) return;
      const k = +nt.dataset.k; if (S().notes[k]) { S().notes.splice(k, 1); save(); paint(); } // 點了就不見（nt 已經拿下來了，下面還讀得到它的 app、id）
      unlock();
      if (['memo', 'trivia', 'music'].includes(nt.dataset.app) || (['cal', 'shop', 'food', 'diary', 'phone', 'album', 'threads', 'line'].includes(nt.dataset.app) && nt.dataset.id)) openApp(nt.dataset.app, nt.dataset.id); // 點通知：直接打開那個 App，那則亮一下
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
    bindThreads();
    root.querySelector('.ap-view[data-app="web"]').addEventListener('click', (e) => {
      if (lpEat(e)) return;
      const r = e.target.closest('.ap-wr');
      if (!r) return;
      if (r.classList.contains('ap-hid')) { peekWeb(r); return; } // 藏起來的：先解鎖，再點才看得到心聲
      if (r.querySelector('.ap-wmur')) { r.classList.toggle('ap-open'); murSeen(r, S().web.items.find((x) => x.id === r.dataset.id), '.ap-wm'); }
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
    root.querySelector('.ap-view[data-app="music"]').addEventListener('click', (e) => {
      if (lpEat(e)) return;
      const h = e.target.closest('.ap-mu-ph');
      if (h) { const id = h.dataset.id; musOpen.has(id) ? musOpen.delete(id) : musOpen.add(id); h.parentElement.classList.toggle('ap-open'); return; }
      const r = e.target.closest('.ap-mu-song');
      if (r && r.querySelector('.ap-mu-mur')) { r.classList.toggle('ap-open'); murSeen(r, S().mus.lists.flatMap((l) => l.songs).find((x) => x.id === r.dataset.id), '.ap-mu-dot'); }
    });
    root.querySelector('.ap-view[data-app="phone"]').addEventListener('click', (e) => {
      if (lpEat(e)) return;
      const t = e.target.closest('[data-pt]');
      if (t) { telTab = t.dataset.pt; paintPhone(); root.querySelector('.ap-view[data-app="phone"] .ap-vs').scrollTop = 0; return; }
      const r = e.target.closest('.ap-tel-vm');
      if (r) r.classList.toggle('ap-open');
    });
    // LINE：列表點進聊天室、分頁、返回、灰卡語音展開、小鎖、貼圖面板（第 53 窗）
    const lnV = root.querySelector('.ap-view[data-app="line"]');
    lnV.addEventListener('click', lnClick); lnV.addEventListener('keydown', lnKeys); lnV.addEventListener('input', lnKeys);
    // 相簿：點照片打開；打開後左右滑換同一夾的上一張／下一張，到頭輕輕晃一下
    const alV = root.querySelector('.ap-view[data-app="album"]');
    let alSw = null, alSwAt = 0;
    alV.addEventListener('pointerdown', (e) => { alSw = albOpen ? { x: e.clientX, y: e.clientY } : null; });
    alV.addEventListener('pointerup', (e) => {
      if (!alSw) return;
      const dx = e.clientX - alSw.x, dy = e.clientY - alSw.y;
      alSw = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.2) { alSwAt = Date.now(); albStep(dx < 0 ? 1 : -1); }
    });
    alV.addEventListener('pointercancel', () => { alSw = null; });
    alV.addEventListener('click', (e) => {
      if (Date.now() - alSwAt < 350) return; // 剛滑完的那一下不算點
      if (e.target.closest('.ap-al-back')) { albOpen = null; paintAlbum(); alV.querySelector('.ap-vs').scrollTop = albTop; return; }
      const ph = e.target.closest('.ap-al-ph');
      if (ph) { albTop = alV.querySelector('.ap-vs').scrollTop; albOpen = { id: ph.dataset.id }; paintAlbum(); alV.querySelector('.ap-vs').scrollTop = 0; }
    });
    alV.addEventListener('animationend', (e) => e.target.classList.remove('ap-nope'));
    root.querySelector('.ap-view[data-app="cam"]').addEventListener('click', (e) => {
      if (lpEat(e)) return;
      const r = e.target.closest('.ap-cm-row');
      if (r) r.classList.toggle('ap-open');
    });
    root.querySelector('.ap-view[data-app="diary"]').addEventListener('click', (e) => {
      if (lpEat(e)) return;
      if (e.target.closest('.ap-dy-lock')) { faceUnlock(); return; }
      const r = e.target.closest('.ap-dy-ent:not(.ap-dy-draft)');
      if (r) r.classList.toggle('ap-open');
    });
    root.querySelector('.ap-view[data-app="secret"]').addEventListener('click', (e) => {
      const k = e.target.closest('.ap-sc-key');
      if (k) { secKey(k.dataset.k); return; }
      if (e.target.closest('.ap-sc-door')) return;
      if (lpEat(e)) return;
      const t = e.target.closest('.ap-tab');
      if (t) { secTab = t.dataset.t; keepScroll('secret', paintSecret); root.querySelector('.ap-view[data-app="secret"] .ap-vs').scrollTop = 0; return; }
      const hid = e.target.closest('.ap-sc-hid');
      if (hid) { hid.classList.remove('ap-nope'); void hid.offsetWidth; hid.classList.add('ap-nope'); return; } // 還沒揭曉：輕輕晃一下
      const c = e.target.closest('.ap-sc-card');
      if (c) c.classList.toggle('ap-open');
    });
    root.querySelector('.ap-view[data-app="secret"]').addEventListener('animationend', (e) => e.target.classList.remove('ap-nope'));
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
    fab.innerHTML = ic('mob', 20) + '<span class="ap-badge"></span><span class="ap-badge ap-badge-ln"></span>';
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
  // 主畫面 App 小點（第 50 窗 A 版）：右上角、App 內層色、沒有框
  const hdot = (id, s) => (s.hdot[id] && APP[id] ? `<i class="ap-hdot" style="background:${APP[id][1]}"></i>` : '');
  const appBtn = (a, s) => `<button class="ap-app" type="button" data-id="${a.id}"><span class="ap-tile">${tile(a)}${hdot(a.id, s)}</span><span class="ap-name">${esc(nm(a, s))}</span></button>`;
  function paintHome() {
    const s = S();
    root.querySelector('.ap-p1').innerHTML = '<div class="ap-grid">'
      + HOME.folders.map((f) => `<button class="ap-app" type="button"><span class="ap-tile ap-fold">${f.mini.map((k) => `<i>${ic(k, 11)}</i>`).join('')}</span><span class="ap-name">${esc(f.n)}</span></button>`).join('')
      + HOME.p1.map((a) => appBtn(a, s)).join('') + '</div>';
    root.querySelector('.ap-p2').innerHTML = HOME.boxes.map((b) => `<div class="ap-box ap-glass ap-${b.tone}">${b.apps.map((a) => appBtn(a, s)).join('')}</div>`).join('');
    root.querySelector('.ap-p3').innerHTML = `<button class="ap-app ap-diary" type="button" data-id="diary"><span class="ap-book">${ic('book', 24)}${hdot('diary', s)}</span><span class="ap-name">拾光手記</span></button>`;
    root.querySelector('.ap-dock').innerHTML = HOME.dock.map((a) => `<button class="ap-app" type="button" data-id="${a.k}" aria-label="${a.n}"><span class="ap-tile">${ic(a.k, 26)}${hdot(a.k, s)}</span></button>`).join('');
    root.querySelector('.ap-home').classList.toggle('ap-nowall', !s.homeWall);
    root.querySelector('.ap-home .ap-htint').style.opacity = s.homeTint / 100;
    wallTo(root, s, 'home');
  }

  // ===== App =====
  const READY = ['memo', 'trivia', 'web', 'cal', 'shop', 'food', 'diary', 'cam', 'phone', 'music', 'album', 'threads', 'secret', 'line']; // 已經做好、點得開的 App
  const VIEW = { trivia: 'memo' }; // 拾穗小集住在備忘錄裡（第一頁是捷徑）
  let tab = 'memo';
  const inApp = () => !!root.querySelector('.ap-view:not([hidden])');
  function openApp(id, focus) {
    const v = root.querySelector(`.ap-view[data-app="${VIEW[id] || id}"]`);
    if (!v) return;
    const hs = S(); if (hs.hdot[id]) { delete hs.hdot[id]; save(); root.querySelectorAll(`.ap-app[data-id="${id}"] .ap-hdot`).forEach((d) => d.remove()); } // 點進去，小點就消失
    if (v.dataset.app === 'memo') { tab = id === 'trivia' ? 'trivia' : 'memo'; paintMemo(); }
    if (id === 'web') paintWeb();
    if (id === 'cal') prepCal(focus); // 一打開選今天；從通知點進來就選那件事的那天
    if (id === 'shop') prepShop(focus); // 從通知點進來：先切到那筆所在的分頁
    if (id === 'food') paintFood();
    if (id === 'cam') paintCam();
    if (id === 'music') paintMusic();
    if (id === 'album') { albOpen = focus && S().alb.photos.some((p) => p.id === focus) ? { id: focus } : null; paintAlbum(); focus = null; } // 從通知點進來：直接打開那張
    if (id === 'threads') { thIn = null; paintThreads(); }
    if (id === 'secret') { secPin = ''; paintSecret(); secDoor(); secLoad().then(() => { if (!root.hidden && !root.querySelector('.ap-view[data-app="secret"]').hidden) keepScroll('secret', paintSecret); }); } // 機密企劃：重新整理酒館前輸入一次密碼就好
    if (id === 'line') { // 每次打開都先在列表、家人分頁；從通知點進來＝直接進那個聊天室、那則亮一下
      const L = S().line, rid = focus && Object.keys(L.chats).find((k) => L.chats[k].msgs.some((m) => m.id === focus));
      lnIn = rid || null; lnTab = (rid && L.roster.find((r) => r.id === rid)?.cat) || 'fam'; lnStkOpen = false; lnFocus = !!rid;
      v.querySelector('.ap-ln-foot').innerHTML = '';
      if (rid) { lnChat(rid).unread = 0; save(); }
      paintLine();
    }
    if (id === 'phone') { telTab = 'call'; paintPhone(); } // 每次打開都先在「通話」分頁（從通知點進來也是）
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
      return `<div class="ap-wr${hid ? ' ap-hid' : ''}${open ? ' ap-peeked' : ''}" data-id="${x.id}"><span class="ap-wi">${ic(hid ? 'lockon' : open ? 'lockoff' : 'clock', 15)}</span><span class="ap-wq">${esc(x.q)}</span>${x.mur ? `<span class="ap-wm${x.seen ? ' ap-seen' : ''}"></span>` : ''}<span class="ap-mw">${esc(x.time)}</span>${x.mur ? `<div class="ap-wmur">${esc(x.mur)}</div>` : ''}</div>`;
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
  // ===== 相機（第 48 窗果果確認的草圖：霧藍紙、空的取景框、沒拍到的瞬間）=====
  // 取景框先空著（等相簿那一輪再決定放什麼）；新的在上面，點了原地展開
  function paintCam() {
    const C = S().cam;
    const list = C.items.slice().sort((a, b) => b.seq - a.seq);
    root.querySelector('.ap-view[data-app="cam"] .ap-vs').innerHTML = `
      <div class="ap-meta">CAMERA · ${headDate()}</div>
      <div class="ap-mtitle"><span class="ap-mdot ap-cm-dot"></span>相機</div>
      ${camVf()}
      <div class="ap-cm-sec">沒拍到的瞬間</div>
      ${list.map((x) => `<div class="ap-cm-row" data-id="${x.id}"><div class="ap-cm-h"><span class="ap-cm-t">${esc(x.title)}</span><span class="ap-mw">${esc(x.time)}</span></div>`
        + `<div class="ap-cm-b">${esc(x.body)}</div></div>`).join('')}
      ${list.length ? '' : '<div class="ap-cm-empty">今天還沒有記下的瞬間。</div>'}`;
  }

  // 取景框：放他最近在相簿挑的那張（用那張自己的取景框位置）；有照片時四個角改米白（第 49 窗）
  function camVf() {
    const p = albPhoto(S().alb.last);
    return p ? `<div class="ap-cm-vf ap-cm-has" style="${vfStyle(p)}"><i></i><i></i><i></i><i></i></div>` : '<div class="ap-cm-vf"><i></i><i></i><i></i><i></i></div>';
  }

  // ===== 相簿（第 49 窗果果確認的草圖：柴米油鹽燕麥紙；一夾一張卡；橄欖是它的記號）=====
  // 照片檔放在酒館伺服器（Railway 硬碟），設定裡只記路徑；果果在酒館設定「📷 相簿」放照片
  const ALB_MAX = 30;
  let albOpen = null, albTop = 0, alShow = null; // alShow：設定頁相簿抽屜的重畫（他換了桌布、果果改了照片時用）
  const albSrc = (p) => { const u = String(p?.path || ''); return u.startsWith('data:') || u.startsWith('/') || /^https?:/.test(u) ? u : '/' + u; };
  const albPhoto = (id) => (id ? S().alb.photos.find((p) => p.id === id) || null : null);
  const vfStyle = (p) => `background-image:url(&quot;${esc(albSrc(p))}&quot;);background-size:${p.vz || 100}% auto;background-position:50% ${p.vy ?? 50}%`;
  // 資料夾照第一次出現的順序；沒有照片的夾自動收掉
  function albSync() {
    const A = S().alb;
    A.photos.forEach((p) => { if (p.folder && !A.folders.includes(p.folder)) A.folders.push(p.folder); });
    A.folders = A.folders.filter((f) => A.photos.some((p) => p.folder === f));
    if (A.wall && !albPhoto(A.wall)) A.wall = '';
    if (A.last && !albPhoto(A.last)) A.last = '';
    return A;
  }
  const FOLD = `<span class="ap-al-fic">${ic('folder', 14)}</span>`;
  const ALOCK = `<span class="ap-al-lk">${ic('lockon', 12)}</span>`;
  function paintAlbum() {
    const s = S(), A = albSync(), vs = root.querySelector('.ap-view[data-app="album"] .ap-vs');
    const title = esc(nm({ id: 'album', n: '相簿' }, s));
    const cur = albOpen && albPhoto(albOpen.id);
    if (cur) {
      const list = A.photos.filter((p) => p.folder === cur.folder), i = list.indexOf(cur);
      vs.innerHTML = `
        <div class="ap-al-top"><button type="button" class="ap-al-back">${ic('back', 13)}${esc(cur.folder)}</button><span class="ap-al-pos">${i + 1} / ${list.length}</span></div>
        <div class="ap-al-pcard"><img class="ap-al-big" src="${esc(albSrc(cur))}" alt="" draggable="false">
          ${A.wall === cur.id ? `<div class="ap-al-wall">${ic('lockon', 12)}目前的桌布${A.wallDay ? ' · ' + slash(A.wallDay) : ''}</div>` : ''}</div>
        ${cur.note ? `<div class="ap-al-note"><div class="ap-al-nt">${esc(cur.note)}</div>${cur.noteDay ? `<div class="ap-al-nd">${slash(cur.noteDay)}</div>` : ''}</div>` : ''}`;
      return;
    }
    albOpen = null;
    vs.innerHTML = `
      <div class="ap-meta">ALBUM · 相簿</div>
      <div class="ap-mtitle"><span class="ap-mdot ap-al-dot"></span>${title}</div>
      ${A.folders.map((f) => { const ps = A.photos.filter((p) => p.folder === f);
        return `<div class="ap-al-card"><div class="ap-al-hd">${FOLD}<span class="ap-al-fn">${esc(f)}</span><span class="ap-al-cnt">${ps.length} 張</span></div><div class="ap-al-grid">`
          + ps.map((p) => `<button type="button" class="ap-al-ph" data-id="${p.id}" style="background-image:url(&quot;${esc(albSrc(p))}&quot;)" aria-label="照片">${A.wall === p.id ? ALOCK : ''}${p.note ? '<span class="ap-al-md"></span>' : ''}</button>`).join('')
          + '</div></div>'; }).join('') || '<div class="ap-mempty">到酒館設定「📷 相簿」放照片。</div>'}`;
  }
  // 同一夾裡換上一張／下一張；到頭了照片卡輕輕晃一下
  function albStep(d) {
    const cur = albOpen && albPhoto(albOpen.id);
    if (!cur) return;
    const list = S().alb.photos.filter((p) => p.folder === cur.folder), nx = list[list.indexOf(cur) + d];
    if (nx) { albOpen = { id: nx.id }; paintAlbum(); return; }
    const c = root.querySelector('.ap-al-pcard');
    if (c) { c.classList.remove('ap-nope'); void c.offsetWidth; c.classList.add('ap-nope'); }
  }

  // ===== 音樂（第 48 窗果果確認的草圖：灰白紙＝行動小書房；酒紅是它的記號；歌單摺起來、點了展開）=====
  const musOpen = new Set();
  // 固定歌單照設定順序排在最上面；設定拿掉的固定歌單不刪歌，變成一般歌單（不會丟資料）
  function musSync() {
    const M = S().mus, names = telList(M.fixed).slice(0, 6);
    M.lists.forEach((l) => { l.fixed = names.includes(l.name); });
    names.forEach((n) => { if (!M.lists.some((l) => l.name === n)) M.lists.push({ id: 'L' + (++M.seq), name: n, fixed: true, songs: [] }); });
    M.lists.sort((a, b) => (a.fixed === b.fixed ? (a.fixed ? names.indexOf(a.name) - names.indexOf(b.name) : 0) : a.fixed ? -1 : 1));
    return M;
  }
  const musFrom = (M, t) => (t ? (M.lists.find((l) => l.songs.some((x) => x.t === t)) || {}).name || '' : '');
  function paintMusic() {
    const M = musSync(), N = M.now || {}, from = musFrom(M, N.t);
    const now = N.t
      ? `<div class="ap-mu-now"><span class="ap-mu-eq"><i></i><i></i><i></i></span><div class="ap-mu-nw"><div class="ap-mu-nt">${esc(N.t)}</div>`
        + `<div class="ap-mu-na">${esc([N.a, from && '來自：' + from].filter(Boolean).join('・'))}</div></div></div>`
      : '<div class="ap-mu-empty">沒有在播放</div>';
    const lists = M.lists.map((l) => `<div class="ap-mu-pl${musOpen.has(l.id) ? ' ap-open' : ''}"><div class="ap-mu-ph" data-id="${l.id}"${l.fixed ? '' : ' data-own="1"'}>`
      + `<span class="ap-mu-ic">${ic('music', 14)}</span><span class="ap-mu-pn">${esc(l.name)}</span><span class="ap-mw">${l.songs.length} 首</span><span class="ap-mu-ch"></span></div>`
      + `<div class="ap-mu-songs">${l.songs.length ? l.songs.map((x, i) => `<div class="ap-mu-song" data-id="${x.id}"><div class="ap-mu-sh"><span class="ap-mu-no">${String(i + 1).padStart(2, '0')}</span>`
        + `<span class="ap-mu-st">${esc(x.t)}</span><span class="ap-mu-sa">${esc(x.a)}</span>${x.mur ? `<span class="ap-mu-dot${x.seen ? ' ap-seen' : ''}"></span>` : ''}</div>`
        + `${x.mur ? `<div class="ap-mu-mur">${esc(x.mur)}</div>` : ''}</div>`).join('') : '<div class="ap-mu-none">還沒有歌。</div>'}</div></div>`).join('');
    root.querySelector('.ap-view[data-app="music"] .ap-vs').innerHTML = `
      <div class="ap-meta">MUSIC · ${headDate()}</div>
      <div class="ap-mtitle"><span class="ap-mdot ap-mu-mdot"></span>音樂</div>
      <div class="ap-msec">正在播放</div>${now}
      <div class="ap-msec">歌單</div>${lists || '<div class="ap-mu-empty">到酒館設定「🎵 音樂」填他的歌單。</div>'}`;
  }

  // ===== 電話（第 48 窗果果確認的草圖：霧藍紙、「通話｜最愛」兩個分頁；米杏是它的記號）=====
  let telTab = 'call';
  const telList = (t) => String(t || '').split(/[,，、\n]/).map((x) => x.trim()).filter(Boolean);
  const TEL_T = { out: ['tout', '撥出'], in: ['tin', '來電'], miss: ['tmiss', '未接'] };
  function paintPhone() {
    const T = S().tel, fav = telList(T.favs), last = String(T.last || '').trim();
    const tabs = `<div class="ap-tabs ap-tel-tabs"><button type="button" class="ap-tab${telTab === 'call' ? ' ap-on' : ''}" data-pt="call">通話</button><button type="button" class="ap-tab${telTab === 'fav' ? ' ap-on' : ''}" data-pt="fav">最愛</button></div>`;
    let body;
    if (telTab === 'fav') {
      body = `<div class="ap-tel-sec">我的最愛</div>`
        + (fav.length ? fav.map((n) => `<div class="ap-tel-fav"><span class="ap-tel-n">${esc(n)}</span><span class="ap-tel-pi">${ic('phone', 15)}</span></div>`).join('')
          : '<div class="ap-tel-empty">到酒館設定「📞 電話」填我的最愛。</div>')
        + (last ? `<div class="ap-tel-last">${esc(last)}</div>` : '');
    } else {
      const byNew = (a, b) => (`${a.day || ''} ${a.time || ''} ${String(a.seq).padStart(6, '0')}` < `${b.day || ''} ${b.time || ''} ${String(b.seq).padStart(6, '0')}` ? 1 : -1);
      const calls = T.calls.slice().sort(byNew), vm = T.vm.slice().sort(byNew);
      body = `<div class="ap-tel-sec">今天</div>`
        + (calls.length ? calls.map((x) => { const [k, w] = TEL_T[x.type] || TEL_T.in;
          return `<div class="ap-tel-call${x.type === 'miss' ? ' ap-tel-miss' : ''}" data-id="${x.id}"><span class="ap-tel-ti">${ic(k, 15)}</span>`
            + `<div class="ap-tel-mid"><div class="ap-tel-n">${esc(x.name)}</div><div class="ap-tel-sub">${w}${x.type !== 'miss' && x.dur ? '・' + esc(x.dur) : ''}</div></div><span class="ap-mw">${esc(x.time)}</span></div>`; }).join('')
          : '<div class="ap-tel-empty">今天還沒有通話。</div>')
        + `<div class="ap-tel-sec">語音信箱</div>`
        + (vm.length ? vm.map((x) => `<div class="ap-tel-vm" data-id="${x.id}"><div class="ap-tel-vh"><span class="ap-tel-mk">${x.keep ? ic('mark', 13) : ''}</span>`
          + `<span class="ap-tel-n">${esc(x.from)}</span><span class="ap-mw">${esc(x.day && x.day !== T.day ? slash(x.day) : x.time)}</span></div><div class="ap-tel-b">${esc(x.text)}</div></div>`).join('')
          : '<div class="ap-tel-empty">沒有語音留言。</div>');
    }
    root.querySelector('.ap-view[data-app="phone"] .ap-vs').innerHTML = `
      <div class="ap-meta">PHONE · ${headDate()}</div>
      <div class="ap-mtitle"><span class="ap-mdot ap-tel-dot"></span>電話</div>
      ${tabs}${body}`;
  }

  // ===== LINE 畫面（第 53 窗草圖；霧藍紙那一家）=====
  let lnIn = null, lnTab = 'fam', lnStkOpen = false, lnFocus = false; // lnIn：null＝列表、'ours'＝你們的、'dad'＝爸、其他＝名單 id
  const p2 = (n) => String(n).padStart(2, '0');
  const lnHM = (t) => { const d = new Date(t); return `${p2(d.getHours())}:${p2(d.getMinutes())}`; };
  const lnDayKey = (t) => { const d = new Date(t); return `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`; };
  const lnRealDay = (t) => { // 現實日期：今天／昨天／11/2
    const k = lnDayKey(t), now = new Date(), y = new Date(now); y.setDate(now.getDate() - 1);
    if (k === lnDayKey(now)) return '今天';
    if (k === lnDayKey(y)) return '昨天';
    const d = new Date(t); return `${d.getMonth() + 1}/${d.getDate()}`;
  };
  const lnListTime = (t) => { const r = lnRealDay(t); return r === '今天' ? lnHM(t) : r; };
  const lnAv = (av, name, cls = '') => `<span class="ap-ln-av${cls}"${av ? ` style="background-image:url(&quot;${esc(lnSrc(av))}&quot;)"` : ''}>${av ? '' : esc(lnInit(name))}</span>`;
  const lnStk = (name) => S().line.stk.find((x) => x.name === name);
  const lnStkHtml = (name) => { const k = lnStk(name); return k ? `<span class="ap-ln-stk" style="background-image:url(&quot;${esc(lnSrc(k.img))}&quot;)" role="img" aria-label="${esc(name)}"></span>` : `<span class="ap-ln-b ap-ln-bt">〔貼圖〕${esc(name)}</span>`; };
  const lnPrev = (m) => !m ? '' : m.lock && !m.seen ? '（上鎖的訊息）' : m.t === 'stk' ? `〔貼圖〕${m.v}` : m.t === 'photo' ? `〔照片〕${m.v}` : m.t === 'voice' ? `〔語音${m.dur ? ' ' + m.dur : ''}〕${m.v}` : m.v;
  const lnDadName = () => String(S().tel.last || '').trim();
  const lnSortKey = (m) => `${m.day || ''} ${m.time || ''} ${String(m.seq || 0).padStart(6, '0')}`;
  const lnChat = (id) => { const L = S().line; if (!L.chats[id]) L.chats[id] = { msgs: [], unread: 0 }; return L.chats[id]; };
  function paintLine() {
    const v = root.querySelector('.ap-view[data-app="line"]');
    if (!v) return;
    if (lnIn) return paintLineRoom(v);
    v.classList.remove('ap-ln-room', 'ap-ln-ours');
    v.querySelector('.ap-ln-hd').hidden = true; v.querySelector('.ap-ln-foot').hidden = true;
    const L = S().line, O = L.ours.msgs, last = O[O.length - 1], me = L.me.name || '小果';
    const pin = `<div class="ap-ln-pin" data-room="ours">${lnAv(L.me.av, me, ' ap-ln-avme')}<div class="ap-ln-rb"><div class="ap-ln-nm">${esc(me)}</div><div class="ap-ln-pv">${esc(lnPrev(last))}</div></div>`
      + `<div class="ap-ln-rt">${last ? `<span class="ap-mw">${esc(lnListTime(last.time))}</span>` : ''}${L.ours.unread ? `<span class="ap-ln-ur">${L.ours.unread}</span>` : ''}</div></div>`;
    const tabs = `<div class="ap-tabs ap-ln-tabs">${LN_CAT.map(([k, n]) => `<button type="button" class="ap-tab${lnTab === k ? ' ap-on' : ''}" data-lt="${k}">${n}</button>`).join('')}</div>`;
    const rows = L.roster.filter((r) => r.cat === lnTab && r.name).map((r) => { const M = (L.chats[r.id]?.msgs || []).slice().sort((a, b) => (lnSortKey(a) < lnSortKey(b) ? -1 : 1)); return { r, m: M[M.length - 1] }; })
      .sort((a, b) => (!a.m ? 1 : !b.m ? -1 : lnSortKey(a.m) < lnSortKey(b.m) ? 1 : -1));
    let body = rows.map(({ r, m }) => { const u = L.chats[r.id]?.unread || 0;
      return `<div class="ap-ln-row" data-room="${r.id}">${lnAv(r.av, r.name)}<div class="ap-ln-rb"><div class="ap-ln-nm">${esc(r.name)}</div><div class="ap-ln-pv">${esc(lnPrev(m))}</div></div>`
        + `<div class="ap-ln-rt">${m ? `<span class="ap-mw">${esc(slash(m.day))}</span>` : ''}${u ? `<span class="ap-ln-ur">${u}</span>` : ''}</div></div>`; }).join('');
    const dad = lnDadName();
    if (lnTab === 'fam' && dad) { const D = L.dadMsgs, dm = D[D.length - 1];
      body += `<div class="ap-ln-row ap-ln-dad" data-room="dad">${lnAv('', dad)}<div class="ap-ln-rb"><div class="ap-ln-nm">${esc(dad)}</div><div class="ap-ln-pv">${esc(dm ? dm.v : '')}</div></div></div>`; }
    if (!body) body = `<div class="ap-tel-empty">${L.roster.length ? '這一頁還沒有人。' : '到酒館設定「💬 LINE」填聊天名單。'}</div>`;
    v.querySelector('.ap-vs').innerHTML = `<div class="ap-meta">LINE</div><div class="ap-mtitle"><span class="ap-mdot ap-ln-dot"></span>LINE</div>${pin}${tabs}<div class="ap-ln-list">${body}</div>`;
  }
  function paintLineRoom(v) {
    const L = S().line, ours = lnIn === 'ours', dad = lnIn === 'dad', r = !ours && !dad ? L.roster.find((x) => x.id === lnIn) : null;
    if (!ours && !dad && !r) { lnIn = null; return paintLine(); }
    v.classList.add('ap-ln-room'); v.classList.toggle('ap-ln-ours', ours);
    const title = ours ? (L.me.name || '小果') : dad ? lnDadName() : r.name;
    const hd = v.querySelector('.ap-ln-hd'); hd.hidden = false;
    hd.innerHTML = `<button type="button" class="ap-ln-back" aria-label="回列表">${ic('back', 18)}</button><span class="ap-ln-hn${dad ? ' ap-ln-hdad' : ''}">${esc(title)}</span>`;
    let html = '';
    if (ours) {
      let lastDay = '', prev = null;
      L.ours.msgs.forEach((m) => {
        const dk = lnDayKey(m.time); if (dk !== lastDay) { html += `<div class="ap-ln-day">${esc(lnRealDay(m.time))}</div>`; lastDay = dk; prev = null; }
        const mine = m.from === 'me', first = !mine && (!prev || prev.from !== 'him');
        const body = m.t === 'stk' ? lnStkHtml(m.v) : `<span class="ap-ln-b ${mine ? 'ap-ln-bme' : 'ap-ln-bhis'}">${esc(m.v)}</span>`;
        const side = mine ? `<span class="ap-ln-sm">${m.read ? '已讀<br>' : ''}${lnHM(m.time)}</span>` : `<span class="ap-ln-sm ap-ln-sml">${lnHM(m.time)}</span>`;
        html += mine ? `<div class="ap-ln-m ap-ln-me" data-id="${m.id}">${side}${body}</div>`
          : `<div class="ap-ln-m" data-id="${m.id}">${first ? lnAv(L.him.av, '安') : '<span class="ap-ln-avsp"></span>'}${body}${side}</div>`;
        prev = m;
      });
      if (!L.ours.msgs.length) html = '<div class="ap-ln-day">傳第一則訊息給他吧</div>';
      html += lnTail();
    } else {
      const M = (dad ? L.dadMsgs : lnChat(r.id).msgs).slice().sort((a, b) => (lnSortKey(a) < lnSortKey(b) ? -1 : 1));
      const group = !dad && M.some((m) => m.from !== 'him' && m.from !== r.name); // 說話的人不是聊天室名字＝群組
      let lastDay = '', prev = null;
      M.forEach((m) => {
        if ((m.day || '') !== lastDay) { html += `<div class="ap-ln-day">${esc(slash(m.day) || m.day || '')}</div>`; lastDay = m.day || ''; prev = null; }
        const his = dad || m.from === 'him';
        let body;
        if (m.lock && !m.seen) body = `<span class="ap-ln-b ap-ln-lk${his ? ' ap-ln-lkme' : ''}" data-lk="${m.id}">${ic('lockon', 15)}</span>`;
        else if (m.t === 'photo' || m.t === 'voice') body = `<span class="ap-ln-card${m.t === 'voice' ? ' ap-ln-vc' : ''}"><span class="ap-ln-ck">〔${m.t === 'photo' ? '照片' : '語音' + (m.dur ? ' ' + esc(m.dur) : '')}〕</span><span class="ap-ln-cv">${esc(m.v)}</span></span>`;
        else if (m.t === 'stk') body = `<span class="ap-ln-card"><span class="ap-ln-ck">〔貼圖〕</span><span class="ap-ln-cv">${esc(m.v)}</span></span>`;
        else body = `<span class="ap-ln-b ${his ? 'ap-ln-bhm' : 'ap-ln-bhis'}">${esc(m.v)}</span>`;
        const side = `<span class="ap-ln-sm${his ? '' : ' ap-ln-sml'}">${esc(m.time || '')}</span>`;
        if (his) html += `<div class="ap-ln-m ap-ln-me" data-id="${m.id}">${side}${body}</div>`;
        else { const first = !prev || prev.from !== m.from;
          html += `<div class="ap-ln-m" data-id="${m.id}">${first ? lnAv(group ? (L.roster.find((x) => x.name === m.from)?.av || '') : r.av, m.from) : '<span class="ap-ln-avsp"></span>'}<span class="ap-ln-col">${group && first ? `<span class="ap-ln-who">${esc(m.from)}</span>` : ''}${body}</span>${side}</div>`; }
        prev = m;
      });
      if (!M.length) html = `<div class="ap-ln-day">${dad ? '' : '還沒有訊息'}</div>`;
    }
    const vs = v.querySelector('.ap-vs'); vs.innerHTML = `<div class="ap-ln-msgs">${html}</div>`;
    const foot = v.querySelector('.ap-ln-foot'); foot.hidden = !ours;
    if (ours && !foot.querySelector('.ap-ln-in')) foot.innerHTML = lnFoot(); // 已經有輸入框就不重畫（打到一半的字、鍵盤不會不見）
    if (lnFocus) lnFocus = false; else requestAnimationFrame(() => { vs.scrollTop = vs.scrollHeight; }); // 聊天室打開停在最下面（從通知進來的交給 focusIn）
  }
  function lnFoot() {
    const K = S().line.stk;
    const panel = lnStkOpen ? `<div class="ap-ln-pan">${K.length ? K.map((k) => `<button type="button" class="ap-ln-pk" data-stk="${esc(k.name)}"><span class="ap-ln-pki" style="background-image:url(&quot;${esc(lnSrc(k.img))}&quot;)"></span><span class="ap-ln-pkn">${esc(k.name)}</span></button>`).join('') : '<div class="ap-ln-pan0">到酒館設定「💬 LINE」放貼圖。</div>'}</div>` : '';
    return `<div class="ap-ln-bar"><button type="button" class="ap-ln-smile${lnStkOpen ? ' ap-on' : ''}" aria-label="貼圖">${ic('smile', 19)}</button><input type="text" class="ap-ln-in" maxlength="300" placeholder="輸入訊息…" enterkeyhint="send"><button type="button" class="ap-ln-send" aria-label="傳送">${ic('send', 18)}</button></div>${panel}`;
  }
  function lnClick(e) {
    const t = e.target;
    const room = t.closest('[data-room]'); if (room) { lnIn = room.dataset.room; lnStkOpen = false; lnOpenRoom(); return; }
    const lt = t.closest('[data-lt]'); if (lt) { lnTab = lt.dataset.lt; paintLine(); root.querySelector('.ap-view[data-app="line"] .ap-vs').scrollTop = 0; return; }
    if (t.closest('.ap-ln-back')) { root.querySelector('.ap-ln-foot').innerHTML = ''; lnIn = null; lnStkOpen = false; paintLine(); root.querySelector('.ap-view[data-app="line"] .ap-vs').scrollTop = 0; return; }
    const vc = t.closest('.ap-ln-vc'); if (vc) { vc.classList.toggle('ap-open'); return; }
    const lk = t.closest('[data-lk]'); if (lk) { lnPeek(lk.dataset.lk); return; }
    if (t.closest('.ap-ln-smile')) { lnStkOpen = !lnStkOpen; const f = root.querySelector('.ap-ln-foot'), tx = f.querySelector('.ap-ln-in')?.value || ''; f.innerHTML = lnFoot(); f.querySelector('.ap-ln-in').value = tx; return; }
    lnClickMore(e);
  }
  let lnClickMore = () => {};
  // ===== LINE 你們的對話（第 3 段）=====
  const LN_WAIT = 10000; // 妳停下來 10 秒，他開始讀
  let lnTimer = null, lnArmAt = 0, lnBusy = false, lnErr = '';
  const lnPend = () => S().line.ours.msgs.some((m) => m.from === 'me' && !m.read); // 有他還沒讀的
  const lnInOurs = () => root && !root.hidden && lnIn === 'ours' && !root.querySelector('.ap-view[data-app="line"]').hidden;
  function lnTail() { // 最後一則下面：對方輸入中／換你膠囊／出錯
    const L = S().line;
    if (lnBusy) return `<div class="ap-ln-m">${lnAv(L.him.av, '安')}<span class="ap-ln-b ap-ln-bhis ap-ln-typ">對方輸入中…</span></div>`;
    let h = '';
    if (lnErr) h += `<div class="ap-ln-err">${esc(lnErr)}<button type="button" class="ap-ln-retry">重新回一次</button></div>`;
    else if (lnPend()) {
      const el = lnArmAt ? Math.min(LN_WAIT, Date.now() - lnArmAt) : 0;
      h += `<button type="button" class="ap-ln-cap"><svg class="ap-ln-ring" viewBox="0 0 104 26" aria-hidden="true"><rect x=".5" y=".5" width="103" height="25" rx="12.5" class="ap-ln-trk"/>`
        + (lnArmAt ? `<rect x=".5" y=".5" width="103" height="25" rx="12.5" pathLength="100" class="ap-ln-run" style="animation-delay:-${(el / 1000).toFixed(2)}s"/>` : '')
        + `</svg><span class="ap-ln-cdot"></span>好了，換你</button>`;
    }
    return h;
  }
  function lnRoomRefresh() { // 只重畫訊息那塊（輸入列不動）
    if (!lnInOurs()) return;
    paintLineRoom(root.querySelector('.ap-view[data-app="line"]'));
  }
  function lnArm() { // 開始（或重新）數 10 秒
    clearTimeout(lnTimer); lnArmAt = Date.now(); lnErr = '';
    lnTimer = setTimeout(() => { lnTimer = null; lnArmAt = 0; lnAsk(); }, LN_WAIT);
    lnRoomRefresh();
  }
  function lnSend(t, v) {
    v = String(v || '').trim(); if (!v) return;
    const L = S().line;
    L.ours.msgs.push({ id: 'm' + (++L.seq), from: 'me', t, v: v.slice(0, 300), time: Date.now(), read: false });
    while (L.ours.msgs.length > 300) L.ours.msgs.shift(); // 留最近 300 則（舊的可以先匯出）
    save();
    if (lnBusy) lnRoomRefresh(); else lnArm(); // 他輸入中：照傳，下一輪再讀
    lnSettingsShow();
  }
  lnClickMore = (e) => {
    const t = e.target;
    if (t.closest('.ap-ln-send')) { const i = root.querySelector('.ap-ln-in'); lnSend('text', i.value); i.value = ''; i.focus(); return; }
    const k = t.closest('[data-stk]'); if (k) { lnSend('stk', k.dataset.stk); return; }
    if (t.closest('.ap-ln-cap')) { clearTimeout(lnTimer); lnTimer = null; lnArmAt = 0; lnAsk(); return; }
    if (t.closest('.ap-ln-retry')) { lnErr = ''; lnAsk(true); }
  };
  function lnKeys(e) { // Enter 送出；還在打字＝膠囊重新數
    if (!e.target.classList?.contains('ap-ln-in')) return;
    if (e.type === 'keydown' && e.key === 'Enter' && !e.isComposing) { e.preventDefault(); lnSend('text', e.target.value); e.target.value = ''; return; }
    if (e.type === 'input' && lnTimer) lnArm();
  }
  const lnNow = () => { const d = new Date(), h = d.getHours(), W = '日一二三四五六';
    const part = h < 5 ? '凌晨' : h < 11 ? '早上' : h < 13 ? '中午' : h < 18 ? '下午' : '晚上';
    return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}（星期${W[d.getDay()]}）${part} ${h % 12 || 12}:${p2(d.getMinutes())}`; };
  async function lnWorld(text) { // 世界書：藍燈常駐全給＋其他照關鍵字翻（最多 6 條），標題有「不讀」字的跳過
    const c = ctx(), L = S().line, books = new Set();
    const ch = curChar(); if (ch?.data?.extensions?.world) books.add(ch.data.extensions.world);
    if (c.chatMetadata?.world_info) books.add(c.chatMetadata.world_info);
    const pl = c.powerUserSettings?.persona_description_lorebook; if (pl) books.add(pl);
    let load = c.loadWorldInfo;
    if (typeof load !== 'function') { try { load = (await import('/scripts/world-info.js')).loadWorldInfo; } catch (e) { load = null; } }
    if (typeof load !== 'function' || !books.size) return '';
    const skip = String(L.wiSkip || '').split(/[,，、\n]/).map((x) => x.trim()).filter(Boolean);
    const con = [], hit = [];
    for (const b of books) {
      let data = null; try { data = await load(b); } catch (e) { data = null; }
      Object.values(data?.entries || {}).forEach((e) => {
        if (!e || e.disable || !String(e.content || '').trim()) return;
        const title = String(e.comment || '');
        if (skip.some((k) => title.includes(k))) return;
        if (e.constant) { con.push(e); return; }
        const keys = [].concat(e.key || []).map((k) => String(k).trim()).filter((k) => k && !/^\/.*\/[a-z]*$/.test(k));
        if (keys.some((k) => text.includes(k))) hit.push(e);
      });
    }
    const ord = (a, b) => (a.order || 0) - (b.order || 0);
    const pick = con.sort(ord).concat(hit.sort(ord).slice(0, 6));
    let out = '', n = 0;
    for (const e of pick) { const t = `【${e.comment || '設定'}】\n${String(e.content).trim()}\n`; if (n + t.length > 9000) break; out += t; n += t.length; }
    return out.trim();
  }
  async function lnPrompt(newIds) {
    const c = ctx(), L = S().line, ch = curChar() || {}, him = ch.name || c.name2 || '他', her = c.name1 || '小果';
    const card = [ch.description, ch.personality].filter(Boolean).join('\n').slice(0, 6000);
    const persona = String(c.powerUserSettings?.persona_description || '').slice(0, 2000);
    const M = L.ours.msgs.slice(-50), N = new Set(newIds);
    const fmt = (m) => { const d = new Date(m.time); return `${N.has(m.id) ? '★' : ''}[${d.getMonth() + 1}/${d.getDate()} ${lnHM(m.time)}] ${m.from === 'me' ? her : him}：${m.t === 'stk' ? `〔貼圖：${m.v}〕` : m.v}`; };
    const recent = M.filter((m) => N.has(m.id)).concat(M.slice(-4)).map((m) => m.v).join('\n'); // 翻世界書用：這輪要回的＋最後幾則
    const world = await lnWorld(recent);
    const names = L.stk.map((k) => k.name);
    const sys = `你是${him}。現在你正在用手機 LINE 跟${her}聊天。這是你們兩個人的 LINE 聊天室，跟你們平常的故事分開：照現在的真實時間生活，不知道、也不要提故事裡正在發生的特定場景。只輸出 JSON。`;
    const prompt = `【現在的真實時間】${lnNow()}

【你是誰（角色卡）】
${card || '（沒有角色卡）'}
${persona ? `\n【${her}是誰】\n${persona}\n` : ''}${world ? `\n【你們的回憶與設定（世界書）】\n${world}\n` : ''}
【可以傳的貼圖（只能用這些名字）】
${names.length ? names.join('、') : '（目前沒有貼圖，不要傳貼圖）'}

【你們最近的 LINE】
${M.map(fmt).join('\n') || '（還沒有訊息）'}

【怎麼回】
1. 這是 LINE 文字聊天，不是小說：只寫你打出去的訊息。不寫動作、旁白、心聲、*星號*、括號裡的動作，不寫狀態欄、好感或任何格式區塊。
2. 回 ${her} 標了 ★ 的那幾則（這次要回的）。接得上話，不要整句重複她說的。
3. 回 1～4 則，像真人打 LINE，想到一句送一句；則數和長短照你的個性決定（有時一則「嗯」就夠），每則 60 字以內。
4. 照現在的真實時間：深夜可以叫她早點睡、早上可以說早安；不要編出你們故事裡的大事件。
5. 貼圖：每次最多 1 張，可以不傳，也可以整輪只回一張貼圖；只能從上面的名字裡挑，名字要一字不差。${her}的貼圖你也可以拿來逗她。
6. 繁體中文。
7. 只輸出 JSON，不要其他文字：
{"msgs":[{"t":"text","v":"訊息"},{"t":"stk","v":"貼圖名字"}]}`;
    return { sys, prompt };
  }
  function lnParse(txt) {
    const o = parse(txt), K = new Set(S().line.stk.map((k) => k.name));
    let stk = 0;
    const out = (Array.isArray(o.msgs) ? o.msgs : []).map((m) => ({ t: m?.t === 'stk' ? 'stk' : 'text', v: String(m?.v || '').replace(/\*[^*\n]*\*/g, '').replace(/\*/g, '').replace(/\s{2,}/g, ' ').trim() })) // 動作 *…* 拿掉
      .filter((m) => m.v && (m.t === 'text' || (K.has(m.v) && stk++ < 1))).slice(0, 4);
    if (!out.length) throw new Error('AI 回的東西拆不開');
    return out;
  }
  async function lnAsk(retry) {
    if (lnBusy) return;
    const L = S().line, M = L.ours.msgs;
    let ids = M.filter((m) => m.from === 'me' && !m.read).map((m) => m.id); // 這輪要他回的＝他還沒讀的
    if (!ids.length && retry) { const li = M.map((m) => m.from).lastIndexOf('him'); ids = M.slice(li + 1).filter((m) => m.from === 'me').map((m) => m.id); } // 重新回一次
    if (!ids.length) { lnRoomRefresh(); return; }
    clearTimeout(lnTimer); lnTimer = null; lnArmAt = 0;
    lnBusy = true; lnErr = '';
    M.forEach((m) => { if (ids.includes(m.id)) m.read = true; }); save(); // 他開始讀＝已讀
    lnRoomRefresh();
    try {
      const { sys, prompt } = await lnPrompt(ids);
      const out = lnParse(await askAIQ(sys, prompt));
      for (let i = 0; i < out.length; i++) { // 一則一則跳出來
        await new Promise((r) => setTimeout(r, i ? 900 + Math.min(1200, out[i].v.length * 40) : 300));
        L.ours.msgs.push({ id: 'm' + (++L.seq), from: 'him', t: out[i].t, v: out[i].v, time: Date.now() });
        if (!lnInOurs()) { L.ours.unread++; S().hdot.line = true; }
        save(); if (i < out.length - 1) lnRoomRefresh();
      }
      while (L.ours.msgs.length > 300) L.ours.msgs.shift();
      lnBusy = false; save(); lnBadge();
      if (lnPend()) lnArm(); else lnRoomRefresh(); // 他輸入中妳又傳了：膠囊再冒出來
      if (root && !root.hidden && !lnInOurs()) { const v = root.querySelector('.ap-view[data-app="line"]'); if (!v.hidden && !lnIn) keepScroll('line', paintLine); }
      lnSettingsShow();
    } catch (e) {
      console.warn('[anan_phone] LINE 回覆失敗', e);
      lnBusy = false;
      const off = ctx().onlineStatus === 'no_connection';
      lnErr = off ? '酒館還沒連上：重選 argon 預設，再按一次' : /JSON|拆不開/.test(String(e.message)) ? '他回得亂七八糟，再試一次' : '這次沒成功：' + String(e.message || e).slice(0, 40);
      lnRoomRefresh();
    }
  }
  function lnOpenRoom() { // 點進聊天室＝看過了：未讀清掉
    const L = S().line;
    if (lnIn === 'ours') L.ours.unread = 0; else if (lnIn !== 'dad') lnChat(lnIn).unread = 0;
    save(); paintLine(); lnBadge();
  }
  const lnBadge = () => { if (fab) badge(); };
  function lnPeek(id) { // 果果解鎖他鎖起來的：記下來，下次更新告訴他
    const L = S().line, m = Object.values(L.chats).flatMap((c) => c.msgs).find((x) => x.id === id); if (!m) return;
    m.seen = true; if (!L.peek.includes(id)) L.peek.push(id); save();
    keepScroll('line', () => paintLineRoom(root.querySelector('.ap-view[data-app="line"]')));
  }

  let lp = null, lpAt = 0;
  const LPT = '.ap-mn, .ap-gr, .ap-wr, .ap-kr, .ap-sh-row, .ap-sh-crow, .ap-fd-row, .ap-dy-ent:not(.ap-dy-draft), .ap-cm-row, .ap-tel-call, .ap-tel-vm, .ap-mu-song, .ap-mu-ph[data-own], .ap-th-ph, .ap-sc-card[data-id], .ap-sc-hid';
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
  function clearDel(keep) {
    root.querySelectorAll('.ap-rm').forEach((d) => { if (d.parentElement !== keep) d.remove(); });
    root.querySelectorAll('.ap-th-lp').forEach((d) => { if (d.parentElement !== keep) d.remove(); });
  }
  function showDel(t) {
    if (t.classList.contains('ap-th-ph')) { if (!t.querySelector('.ap-th-lp')) t.insertAdjacentHTML('beforeend', '<div class="ap-th-lp"><button type="button" class="ap-th-swap">換一張</button><button type="button" class="ap-th-del">拿掉</button></div>'); return; } // Threads 照片：換一張／拿掉
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
    else if (t.classList.contains('ap-cm-row')) s.cam.items = s.cam.items.filter((x) => x.id !== id);
    else if (t.classList.contains('ap-tel-call')) s.tel.calls = s.tel.calls.filter((x) => x.id !== id);
    else if (t.classList.contains('ap-tel-vm')) s.tel.vm = s.tel.vm.filter((x) => x.id !== id);
    else if (t.classList.contains('ap-mu-song')) s.mus.lists.forEach((l) => { l.songs = l.songs.filter((x) => x.id !== id); });
    else if (t.classList.contains('ap-mu-ph')) { s.mus.lists = s.mus.lists.filter((l) => l.fixed || l.id !== id); musOpen.delete(id); }
    else if (t.classList.contains('ap-sc-card') || t.classList.contains('ap-sc-hid')) s.sec.items = s.sec.items.filter((x) => x.id !== id);
    s.notes = s.notes.filter((x) => x.id !== id); // 鎖定畫面上指到它的通知也拿掉
    save();
    const app = t.closest('.ap-view')?.dataset.app;
    keepScroll(app, () => (app === 'web' ? paintWeb() : app === 'cal' ? paintCal() : app === 'shop' ? paintShop() : app === 'food' ? paintFood() : app === 'diary' ? paintDiary() : app === 'cam' ? paintCam() : app === 'phone' ? paintPhone() : app === 'music' ? paintMusic() : app === 'secret' ? paintSecret() : paintMemo()));
  }


  // ===== Threads（第 50 窗：鵝黃心意專區；照果果的脆模板排）=====
  let thIn = null; // 正在打的留言：{ post, re }（re 空＝新留言）
  const thName = (t) => String(t || '').trim().replace(/^@+/, ''); // 帳號：一般字、不加 @（像真的脆）
  const TH_HEART = (on) => `<svg viewBox="0 0 24 24" width="19" height="19" fill="${on ? '#F7DFA8' : 'none'}" stroke="${on ? '#B8893A' : '#8E8B84'}" stroke-width="1.5" stroke-linejoin="round" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>`;
  const TH_BUB = '<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="#8E8B84" stroke-width="1.5" stroke-linejoin="round" aria-hidden="true"><path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.1A8 8 0 1 1 20 12z"/></svg>';
  const TH_FOLD = (fold) => `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#B39A68" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${fold ? 'M6 9l6 6 6-6' : 'M6 15l6-6 6 6'}"/></svg>`;
  const thMin = (t) => { const m = String(t || '').match(/(\d{1,2}):(\d{2})/); return m ? +m[1] * 60 + +m[2] : null; };
  const thDay = (d) => { const m = String(d || '').match(/(\d{4})\D+(\d{1,2})\D+(\d{1,2})/); return m ? Date.UTC(+m[1], +m[2] - 1, +m[3]) / 86400000 : null; };
  // 時間（照真的脆）：剛剛 → N 分鐘 → N 小時 → N 天（7 天內）→ 超過 7 天寫日期；用故事裡的時間算
  function thWhen(p) {
    const n = storyNow(), d0 = thDay(p.day), d1 = thDay(n.day);
    if (d0 == null || d1 == null) return slash(p.day);
    const a = thMin(p.time), b = thMin(n.time);
    const mins = (d1 - d0) * 1440 + (a != null && b != null ? b - a : 0);
    if (d1 - d0 > 7) return slash(p.day);
    if (a == null || b == null) return d1 === d0 ? '今天' : `${d1 - d0} 天`;
    return mins <= 0 ? '剛剛' : mins < 60 ? `${mins} 分鐘` : mins < 1440 ? `${Math.floor(mins / 60)} 小時` : `${Math.floor(mins / 1440)} 天`;
  }
  const thWho = (c, T) => (c.mine ? `<i class="ap-th-me">${esc(thName(T.me) || '我')}</i>` : c.self ? `<i>${esc(thName(T.him) || '他')}</i>` : `<i>${esc(thName(c.who))}</i>`);
  const thAv = (T) => (T.av ? `<span class="ap-th-av" style="background-image:url(&quot;${esc(albSrc({ path: T.av }))}&quot;)"></span>` : '<span class="ap-th-av ap-th-av0"></span>');
  function thInput(p, re) {
    const to = re ? p.cm.find((c) => c.id === re) : null;
    const T = S().th, ph = to ? `回覆 ${to.mine ? thName(T.me) || '我' : to.self ? thName(T.him) || '他' : thName(to.who)}…` : '留言…';
    return `<div class="ap-th-in${re ? ' ap-th-re' : ''}"><input type="text" maxlength="60" placeholder="${esc(ph)}" enterkeyhint="send"><button type="button" class="ap-th-send">送出</button></div>`;
  }
  function thPost(p, T) {
    const tops = p.cm.filter((c) => !c.re), kids = (id) => p.cm.filter((c) => c.re === id);
    const cmRow = (c, re) => `<div class="ap-th-c${re ? ' ap-th-re' : ''}" data-c="${c.id}">${thWho(c, T)}${esc(c.t)}${c.mine ? '' : `<u data-re="${re || c.id}">回覆</u>`}</div>`;
    const open = (re) => thIn && thIn.post === p.id && thIn.re === re;
    const cms = tops.map((c) => cmRow(c, '') + (open(c.id) ? thInput(p, c.id) : '') + kids(c.id).map((k) => cmRow(k, c.id)).join('')).join('');
    const ph = p.img
      ? `<div class="ap-th-ph" style="background-image:url(&quot;${esc(albSrc({ path: p.img }))}&quot;)"></div>`
      : `<div class="ap-th-ph0"><span><b>照片說明</b>${esc(p.cap || '（他沒寫）')}</span></div>`;
    return `<div class="ap-th-post" data-id="${p.id}">
      <div class="ap-th-hd">${thAv(T)}<span class="ap-th-acc">${esc(thName(T.him) || '他')}</span>${(p.tag || T.tag) ? `<span class="ap-th-gt">›</span><span class="ap-th-tag">${esc(p.tag || T.tag)}</span>` : ''}<span class="ap-th-time">${esc(thWhen(p))}</span></div>
      <div class="ap-th-tx">${esc(p.text)}</div>${p.note ? `<div class="ap-th-note">[註解 ${esc(p.note)}]</div>` : ''}
      ${ph}
      <div class="ap-th-act"><button type="button" class="ap-th-like${p.liked ? ' ap-on' : ''}" aria-label="愛心">${TH_HEART(p.liked)}<span>${p.like}</span></button><span>${TH_BUB}<span>${p.cm.length}</span></span><button type="button" class="ap-th-fold" aria-label="${p.fold ? '打開留言' : '收合留言'}">${TH_FOLD(p.fold)}</button></div>
      <div class="ap-th-cm"${p.fold ? ' hidden' : ''}>${cms}${open('') ? thInput(p, '') : '<div class="ap-th-add">＋ 留言</div>'}</div>
    </div>`;
  }
  function paintThreads() {
    const T = S().th, v = root.querySelector('.ap-view[data-app="threads"] .ap-vs');
    v.innerHTML = `<div class="ap-meta">THREADS · ${esc(slash(nowDay()))}</div><div class="ap-mtitle">${adot('threads')}Threads</div>`
      + (T.posts.length ? T.posts.map((p) => thPost(p, T)).join('') : '<div class="ap-th-empty">他還沒有發文</div>');
    const inp = v.querySelector('.ap-th-in input'); if (inp) inp.focus({ preventScroll: true });
  }
  // 愛心：放大回彈＋一圈小粒子（只有愛心有動畫）
  function thBurst(btn) {
    const svg = btn.querySelector('svg');
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    svg.classList.remove('ap-th-pop'); void svg.offsetWidth; svg.classList.add('ap-th-pop');
    const box = document.createElement('i'); box.className = 'ap-th-burst';
    for (let k = 0; k < 8; k++) { const d = document.createElement('i'); const a = k * Math.PI / 4; d.style.setProperty('--x', Math.cos(a) * 18 + 'px'); d.style.setProperty('--y', Math.sin(a) * 18 + 'px'); d.style.background = k % 2 ? '#E8C26E' : '#D9A35E'; box.appendChild(d); }
    btn.appendChild(box); setTimeout(() => box.remove(), 600);
  }
  function thSend(postEl) {
    const T = S().th, p = T.posts.find((x) => x.id === postEl.dataset.id), inp = postEl.querySelector('.ap-th-in input');
    const t = clean(inp?.value, 60);
    if (!p || !thIn || !t) { inp?.focus(); return; }
    p.cm.push({ id: 'c' + (++T.cseq), who: '', t, re: thIn.re || '', mine: true, seen: false });
    thIn = null; save(); keepScroll('threads', paintThreads);
  }
  function bindThreads() {
    const v = root.querySelector('.ap-view[data-app="threads"]'), file = v.querySelector('.ap-th-file');
    let imgFor = '';
    v.addEventListener('click', (e) => {
      const T = S().th, postEl = e.target.closest('.ap-th-post'), p = postEl && T.posts.find((x) => x.id === postEl.dataset.id);
      if (e.target.closest('.ap-th-swap')) { e.stopPropagation(); clearDel(); imgFor = p?.id || ''; file.click(); return; }
      if (e.target.closest('.ap-th-del')) { e.stopPropagation(); clearDel(); if (p && p.img) { albUnlink(p.img); p.img = ''; save(); keepScroll('threads', paintThreads); } return; }
      if (lpEat(e) || !p) return;
      if (e.target.closest('.ap-th-like')) {
        p.liked = !p.liked; p.like = Math.max(0, p.like + (p.liked ? 1 : -1)); p.likeSeen = false; save();
        const b = e.target.closest('.ap-th-like'); b.classList.toggle('ap-on', p.liked); b.innerHTML = `${TH_HEART(p.liked)}<span>${p.like}</span>`;
        if (p.liked) thBurst(b);
        return;
      }
      if (e.target.closest('.ap-th-fold')) { p.fold = !p.fold; if (p.fold && thIn && thIn.post === p.id) thIn = null; save(); keepScroll('threads', paintThreads); return; }
      const re = e.target.closest('u[data-re]');
      if (re) { thIn = { post: p.id, re: re.dataset.re }; keepScroll('threads', paintThreads); return; }
      if (e.target.closest('.ap-th-add')) { thIn = { post: p.id, re: '' }; keepScroll('threads', paintThreads); return; }
      if (e.target.closest('.ap-th-send')) { thSend(postEl); return; }
      if (e.target.closest('.ap-th-ph0')) { imgFor = p.id; file.click(); }
    });
    v.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.closest('.ap-th-in')) { e.preventDefault(); thSend(e.target.closest('.ap-th-post')); } });
    file.addEventListener('change', async () => {
      const f = file.files && file.files[0]; file.value = '';
      const T = S().th, p = T.posts.find((x) => x.id === imgFor);
      if (!f || !p) return;
      try {
        const path = await albUpload(await shrink(f));
        if (p.img && p.img !== path) albUnlink(p.img);
        p.img = path; save(); keepScroll('threads', paintThreads);
      } catch (err) { alert('照片放不上去：' + (err.message || err)); }
    });
  }
  // 更新：發新的一篇（故事裡一天最多 3 篇）→ 回留言 → 留 100 篇；回傳要跳的通知
  function applyThreads(o) {
    const T = S().th, n = storyNow(), notes = [];
    T.posts.forEach((p) => { p.likeSeen = true; p.cm.forEach((c) => { if (c.mine) c.seen = true; }); }); // 果果按的愛心、留言：他這次已經看到了
    if (!o || typeof o !== 'object') return notes;
    const P = o.post, today = T.posts.filter((p) => p.day && p.day === n.day).length;
    if (P && typeof P === 'object' && clean(P.text, 10) && today < 3) {
      const id = 'h' + (++T.seq), raw = Array.isArray(P.cm) ? P.cm.filter((c) => c && c.t).slice(0, 4) : [], ids = raw.map(() => 'c' + (++T.cseq));
      const cm = raw.map((c, i) => { const self = /^(我|他)$/.test(String(c.who || '').trim()); const r = Number.isInteger(c.re) && raw[c.re] && c.re !== i ? ids[c.re] : ''; return { id: ids[i], who: self ? '' : clean(c.who, 16), self, t: clean(c.t, 60), re: r, mine: false, seen: true }; })
        .filter((c) => c.self || c.who);
      cm.forEach((c) => { const top = c.re && cm.find((x) => x.id === c.re); if (top && top.re) c.re = top.re; }); // 只有一層
      const lk = Math.round(Number(P.like));
      T.posts.unshift({ id, day: n.day, time: n.time || hm(P.time), text: clean(P.text, 200), note: clean(P.note, 40).replace(/^\[?註解\s*/, '').replace(/\]$/, ''), tag: clean(P.tag, 16).replace(/^[#＃›>\s]+/, ''), cap: clean(P.cap, 80), img: '', like: Number.isFinite(lk) ? Math.max(0, Math.min(99999, lk)) : 0, liked: false, likeSeen: true, cm });
      notes.push({ app: 'threads', id, from: 'Threads', text: clean(P.text, 50), when: '現在', mine: false });
    }
    let mineNote = null;
    (Array.isArray(o.reply) ? o.reply : []).slice(0, 4).forEach((r) => {
      const p = r && T.posts.find((x) => x.id === r.post); if (!p) return;
      const to = r.re ? p.cm.find((c) => c.id === r.re) : null; if (!to) return;
      const self = /^(我|他)$/.test(String(r.who || '').trim()), who = self ? '' : clean(r.who, 16), t = clean(r.t, 60);
      if ((!self && !who) || !t || p.cm.some((c) => c.t === t) || p.cm.length >= 30) return;
      if (self && to.self) return; // 不回自己
      p.cm.push({ id: 'c' + (++T.cseq), who, self, t, re: to.re || to.id, mine: false, seen: true }); T.rseq++;
      if (to.mine && !mineNote) mineNote = { app: 'threads', id: p.id, from: 'Threads · ' + (self ? '他回妳了' : who), text: t, when: '現在', mine: true };
    });
    if (mineNote) notes.unshift(mineNote);
    while (T.posts.length > 100) { const old = T.posts.pop(); albUnlink(old.img); } // 第 101 篇：最舊的連圖一起刪（果果會自己截圖存 DC）
    return notes;
  }

  // ===== 2026機密企劃（第 51 窗：鵝黃心意專區第二張，紙跟 Threads 同一套；A 版分頁）=====
  // 密碼在設定裡填（倉庫是公開的，不寫進程式）；重新整理酒館前輸入一次就好
  // 賓果作戰筆記：格子從聊天室綁的世界書讀（標題「賓果卡」「賓果心意」），✨＝完成；他只寫準備筆記，不能自己打 ✨
  const SEC_TABS = [['bingo', '賓果'], ['place', '地方'], ['sweet', '甜點'], ['wed', '婚禮'], ['sur', '驚喜'], ['prop', '求婚']];
  const SEC_MAX = 20;
  let secTab = 'bingo', secOpen = false, secPin = '', secBusy = false;
  let secBG = { ok: false, why: '還沒讀過' }; // 這次打開酒館讀到的結果
  let secShow = null; // 設定頁的狀態小字（設定頁打開時才有）
  async function secLoad() {
    const C = S().sec, c = ctx();
    try {
      const book = String(C.book || '').trim() || c.chatMetadata?.world_info || '';
      if (!book) { secBG = { ok: false, why: '這個聊天室沒有綁世界書' }; return secBG; }
      let load = c.loadWorldInfo;
      if (typeof load !== 'function') { try { load = (await import('/scripts/world-info.js')).loadWorldInfo; } catch (e) { load = null; } }
      if (typeof load !== 'function') { secBG = { ok: false, why: '這個酒館版本讀不到世界書' }; return secBG; }
      const data = await load(book), E = Object.values(data?.entries || {});
      if (!E.length) { secBG = { ok: false, why: `找不到世界書「${book}」` }; return secBG; }
      const pick = (t) => E.find((e) => String(e.comment || '').trim() === t);
      const card = pick('賓果卡'), heart = pick('賓果心意');
      if (!card) { secBG = { ok: false, why: `「${book}」裡找不到標題「賓果卡」的條目` }; return secBG; }
      const cells = [];
      String(card.content || '').split('\n').forEach((ln) => { const m = ln.trim().match(/^(✨)?\s*([A-Y])\s*[｜|]\s*(.+)$/); if (m && !cells.some((x) => x.L === m[2])) cells.push({ L: m[2], t: m[3].trim().slice(0, 40), done: !!m[1] }); });
      if (cells.length < 5) { secBG = { ok: false, why: '「賓果卡」裡讀不到格子（要像「A｜…」一行一格）' }; return secBG; }
      cells.sort((a, b) => a.L.localeCompare(b.L));
      const H = {}, lines = String(heart?.content || '').split('\n').map((x) => x.trim());
      lines.forEach((ln, i) => { const m = ln.match(/^[^｜|]{1,6}[｜|]\s*([A-Y])\s/); if (m && lines[i + 1] && !/^[^｜|]{1,6}[｜|]\s*[A-Y]\s/.test(lines[i + 1])) H[m[1]] = lines[i + 1].slice(0, 80); });
      secBG = { ok: true, book, why: '' };
      C.bk = { cells, heart: H, at: Date.now() }; save(); // 存一份：換到別的聊天室打開也看得到
    } catch (e) { console.warn('[anan_phone] 讀賓果卡失敗', e); secBG = { ok: false, why: '讀世界書的時候出錯了' }; }
    if (secShow) secShow();
    return secBG;
  }
  // 大門：沒解鎖過就蓋一層密碼鍵盤
  function secDoor() {
    const L = root.querySelector('.ap-sc-door'), C = S().sec, n = String(C.pw || '').length;
    if (secOpen) { L.hidden = true; return; }
    const dots = n ? Array.from({ length: n }, (_, i) => `<i class="${i < secPin.length ? 'ap-on' : ''}"></i>`).join('') : '';
    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'].map((k) => (k === '' ? '<span></span>'
      : `<button type="button" class="ap-sc-key${k === 'del' ? ' ap-sc-kdel' : ''}" data-k="${k}">${k === 'del' ? '刪除' : k}</button>`)).join('');
    L.innerHTML = `<div class="ap-sc-dtop"><span class="ap-sc-dlk">${ic('lockon', 30)}</span><div class="ap-sc-dname">二〇二六機密企劃</div><div class="ap-meta">CONFIDENTIAL</div>`
      + (n ? `<div class="ap-sc-pins">${dots}</div></div><div class="ap-sc-keys">${keys}</div>` : '<div class="ap-sc-dhint">先到酒館設定「📱 App 設定」填密碼</div></div>');
    L.hidden = false;
  }
  function secKey(k) {
    const pw = String(S().sec.pw || '');
    if (secBusy || !pw) return;
    if (k === 'del') { secPin = secPin.slice(0, -1); secDoor(); return; }
    if (secPin.length >= pw.length) return;
    secPin += k; secDoor();
    if (secPin.length < pw.length) return;
    secBusy = true;
    if (secPin === pw) {
      setTimeout(() => {
        secOpen = true; secBusy = false; secPin = '';
        const C = S().sec; C.peek = true; save(); // 他下次更新會知道「她打開過」（不知道看了哪一頁）
        const L = root.querySelector('.ap-sc-door'); L.classList.add('ap-gone');
        setTimeout(() => { L.hidden = true; L.classList.remove('ap-gone'); }, 300);
      }, 180);
    } else {
      setTimeout(() => { const P = root.querySelector('.ap-sc-pins'); if (P) { P.classList.add('ap-nope'); } setTimeout(() => { secPin = ''; secBusy = false; secDoor(); }, 380); }, 160);
    }
  }
  const secCells = () => S().sec.bk?.cells || [];
  // 驚喜的日子（像 3/28）跟劇情今天比：過了＝true；寫「春天」這種比不了的＝false（第 52 窗）
  const secMD = (w) => { const m = String(w || '').match(/^\s*(\d{1,2})\s*\/\s*(\d{1,2})/); return m ? +m[1] * 100 + +m[2] : 0; };
  const secLate = (x) => { const md = secMD(x.when), d = nowDay().match(/-(\d{2})-(\d{2})$/); return !!(x.tab === 'sur' && x.hid && md && d && md < +d[1] * 100 + +d[2]); };
  function secCard(x) {
    const done = x.done ? ' ap-done' : '', when = x.when ? `<span class="ap-sc-when">${esc(x.when)}</span>` : '';
    if (x.tab === 'sur' && x.hid) return `<div class="ap-sc-hid" data-id="${x.id}">${when || '<span class="ap-sc-when">？</span>'}<span class="ap-sc-bar"></span></div>`;
    const unu = x.unused ? ' ap-unused' : ''; // 過期才打開的驚喜：上面留一截撕開的塗黑＋紅色虛線章（第 52 窗）
    return `<div class="ap-sc-card${done}${unu}" data-id="${x.id}">${unu ? '<span class="ap-sc-tear"></span>' : ''}<div class="ap-sc-it">${when}<span>${esc(x.title)}</span>${x.done ? '<span class="ap-sc-stamp">完</span>' : ''}${unu ? '<i class="ap-sc-unu">沒用<br>上</i>' : ''}</div>`
      + (x.body ? `<div class="ap-sc-nl">準備筆記</div><div class="ap-sc-tx">${esc(x.body)}</div>` : '') + '</div>';
  }
  function paintSecret() {
    const C = S().sec, v = root.querySelector('.ap-view[data-app="secret"] .ap-vs');
    const tabs = `<div class="ap-tabs ap-sc-tabs">${SEC_TABS.map(([k, n]) => `<button type="button" class="ap-tab${k === secTab ? ' ap-on' : ''}" data-t="${k}">${n}</button>`).join('')}</div>`;
    let body = '';
    if (secTab === 'bingo') {
      const cells = secCells(), H = C.bk?.heart || {};
      if (!cells.length) body = `<div class="ap-sc-empty">${esc(secBG.ok ? '賓果卡是空的' : '讀不到賓果卡（酒館設定裡有說明）')}</div>`;
      else {
        const grid = 'ABCDEFGHIJKLMNOPQRSTUVWXY'.split('').map((L) => `<i class="${cells.find((x) => x.L === L)?.done ? 'ap-on' : ''}"></i>`).join('');
        const left = cells.filter((x) => !x.done), noted = left.filter((x) => C.bingo[x.L]), rest = left.filter((x) => !C.bingo[x.L]);
        body = `<div class="ap-sc-grid">${grid}</div>` + [...noted, ...rest].map((x) => `<div class="ap-sc-card"><div class="ap-sc-it"><span>${x.L}｜${esc(x.t)}</span></div>`
          + (H[x.L] ? `<div class="ap-sc-hx">${esc(H[x.L])}</div>` : '') + (C.bingo[x.L] ? `<div class="ap-sc-nl">準備筆記</div><div class="ap-sc-tx">${esc(C.bingo[x.L])}</div>` : '') + '</div>').join('')
          + (left.length ? '' : '<div class="ap-sc-empty">全部完成了</div>');
      }
    } else {
      const list = C.items.filter((x) => x.tab === secTab).sort((a, b) => (a.done - b.done) || (+b.id.slice(1) - +a.id.slice(1)));
      body = list.length ? list.map(secCard).join('') : '<div class="ap-sc-empty">這一頁還是空白的</div>';
    }
    v.innerHTML = `<div class="ap-meta">CONFIDENTIAL · ${esc(String(nowDay()).slice(0, 4) || '2026')}</div><div class="ap-mtitle"><span class="ap-mdot ap-sc-dot"></span>二〇二六機密企劃</div>`
      + (C.slip ? `<div class="ap-sc-slip"><span class="ap-sc-tape"></span>${esc(C.slip)}</div>` : '') + tabs + body;
  }
  // 他寫的準備筆記：一句一行，太長就丟掉最舊的
  const secAppend = (old, t) => { let lines = String(old || '').split('\n').filter(Boolean); lines.push(t); while (lines.join('\n').length > 400 && lines.length > 1) lines.shift(); return lines.join('\n'); };
  function applySecret(o) {
    const C = S().sec, peek = C.peek;
    C.peek = false; // 這次已經告訴他了
    if (!o || typeof o !== 'object') return;
    if (peek && clean(o.slip, 40)) C.slip = clean(o.slip, 40); // 紙條：只有她打開過才寫；新的換掉舊的
    const day = nowDay();
    const add = (op) => {
      const tab = String(op.tab || ''), title = clean(op.title, 30);
      if (!['place', 'sweet', 'wed', 'sur', 'prop'].includes(tab) || !title) return;
      if (tab === 'prop' && C.items.some((x) => x.tab === 'prop')) return; // 求婚腳本只有一份
      if (C.items.some((x) => x.tab === tab && x.title === title)) return;
      let mine = C.items.filter((x) => x.tab === tab);
      if (mine.length >= SEC_MAX) { const old = mine.filter((x) => x.done).sort((a, b) => +a.id.slice(1) - +b.id.slice(1))[0]; if (!old) return; C.items = C.items.filter((x) => x !== old); }
      C.items.push({ id: 's' + (++C.seq), tab, title, body: clean(op.note, 120), day, when: tab === 'sur' || tab === 'prop' ? clean(op.when, 10) : '', done: tab !== 'sur' && op.done === true, hid: tab === 'sur' });
    };
    // 空的頁：這次可以各補 1 條（像音樂空歌單一次放好幾首；第 51 窗果果要的），之後回到每次最多 1 處
    const empty = ['place', 'sweet', 'wed', 'sur', 'prop'].filter((k) => !C.items.some((x) => x.tab === k));
    const seeded = new Set();
    (Array.isArray(o.seed) ? o.seed : []).forEach((x) => { if (x && typeof x === 'object' && empty.includes(String(x.tab)) && !seeded.has(String(x.tab))) { seeded.add(String(x.tab)); add(x); } });
    // 過期的驚喜：他這次處理 1 個（改期或打開變成沒用上），不算在 op 的 1 處裡
    const lt = o.late;
    if (lt && typeof lt === 'object') {
      const x = C.items.find((it) => it.id === lt.id && secLate(it));
      if (x && lt.act === 'move') { const w = clean(lt.when, 10), md = secMD(w), d = nowDay().match(/-(\d{2})-(\d{2})$/); if (md && d && md > +d[1] * 100 + +d[2]) { x.when = w; C.nseq++; } }
      else if (x && lt.act === 'unused') { x.hid = false; x.unused = true; C.nseq++; }
    }
    const op = o.op; if (!op || typeof op !== 'object') return;
    const act = String(op.act || '');
    if (act === 'add') add(op);
    else if (act === 'note') {
      const t = clean(op.t || op.note, 80); if (!t) return;
      const L = String(op.bingo || '').toUpperCase(), cell = L && secCells().find((x) => x.L === L);
      if (cell) { if (cell.done) return; C.bingo[L] = secAppend(C.bingo[L], t); C.nseq++; return; } // 賓果：只寫準備筆記，不能打 ✨
      const x = C.items.find((it) => it.id === op.id); if (!x || x.hid) return;
      x.body = secAppend(x.body, t); C.nseq++;
    } else if (act === 'done') {
      const x = C.items.find((it) => it.id === op.id); if (x && !x.hid && !x.done) { x.done = true; C.nseq++; }
    } else if (act === 'reveal') {
      const x = C.items.find((it) => it.id === op.id && it.hid); if (x) { x.hid = false; C.nseq++; }
    }
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
    scr.classList.toggle('ap-nowall', !s.lockWall && !lockAlb(s));
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
      return `<div class="ap-note ap-glass${x.mine ? ' ap-mine' : ''}" data-app="${x.app}" data-k="${s.notes.indexOf(x)}"${x.id ? ` data-id="${esc(x.id)}"` : ''}>
        <div class="ap-hd"><span class="ap-ic" style="color:${ICOL[x.app] || line}">${ic(k, 14)}</span>${esc(name)}${adot(x.app)}<span class="ap-when">${esc(x.when)}</span></div>
        <div class="ap-tt">${esc(x.from)}</div><div class="ap-tx">${esc(x.text)}</div></div>`;
    }).join('');
    tick();
  }

  // 桌布：上層照片可以放大、上下左右移（用螢幕的 %，不受照片大小影響）；移開露出的地方用模糊的同一張照片墊底
  // 鎖定畫面：他在相簿挑了照片就用那張（和那張自己的位置）；設定頁的預覽維持果果自己選的（第 49 窗）
  function lockAlb(s) { const p = s.alb?.wall && (s.alb.photos || []).find((x) => x.id === s.alb.wall); return p ? { img: albSrc(p), z: p.z, x: p.x, y: p.y } : null; }
  function wallTo(box, s, kind, own) {
    const k = WK[kind], al = kind === 'lock' && !own && lockAlb(s);
    if (al) { wallPut(box, kind, al.img, al.z, al.x, al.y); return; }
    wallPut(box, kind, s[k.img], s[k.z], s[k.x], s[k.y]);
  }
  function wallPut(box, kind, img, z, x, y) {
    const url = img ? `url("${img}")` : '';
    const b = box.querySelector(`.ap-blur[data-w="${kind}"]`), w = box.querySelector(`.ap-wall[data-w="${kind}"]`);
    if (!b || !w) return;
    b.style.backgroundImage = url;
    w.style.backgroundImage = url;
    w.style.transform = `translate(${x || 0}%, ${y || 0}%) scale(${(z || 100) / 100})`;
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
    const g = fab.querySelector('.ap-badge-ln'); // 他回妳 LINE：淺綠點（跟鵝黃／紅點並排）
    g.hidden = !s.line.ours.unread; g.classList.toggle('ap-two', !b.hidden);
  }

  function open() {
    const s = S();
    paint(); lock(); root.hidden = false;
    root.querySelector('.ap-screen').scrollTop = 0; // 保險：手機畫面本身永遠不捲動
    if (s.unseen) { s.unseen = false; s.unseenMine = false; save(); badge(); }
    clearInterval(timer); timer = setInterval(tick, 15000);
  }
  function close() { root.hidden = true; clearInterval(timer); }

  function shrink(file, max = 900, png = false) {
    return new Promise((res, rej) => {
      const img = new Image();
      img.onload = () => {
        const w = Math.min(max, img.width), h = Math.round(img.height * (w / img.width));
        const c = document.createElement('canvas'); c.width = w; c.height = h;
        c.getContext('2d').drawImage(img, 0, 0, w, h);
        URL.revokeObjectURL(img.src);
        res(png ? c.toDataURL('image/png') : c.toDataURL('image/jpeg', 0.82)); // 貼圖用 png：去背的透明不會變白底
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
    const musM = musSync();
    const musNow = { now: musM.now.t ? `${musM.now.t} — ${musM.now.a}` : '', lists: musM.lists.map((l) => ({ name: l.name, full: l.songs.length >= 30, songs: l.songs.map((x) => x.t) })) };
    const telNow = { day: s.tel.day, calls: s.tel.calls.map((x) => ({ name: x.name, type: x.type, time: x.time })), vm: s.tel.vm.map((x) => ({ id: x.id, from: x.from, keep: !!x.keep })) };
    const camNow = { day: s.cam.day, items: s.cam.items.map((x) => ({ id: x.id, title: x.title })) }; // 只給標題，用來避免重複
    const diaryNow = { recent: s.diary.items.slice(-3).map((x) => ({ day: x.day, body: x.body })), draft: s.diary.draft }; // 只給最近幾篇，越寫越多也不會變慢
    const A = albSync(), albDay = nowDay();
    const albNow = A.photos.length ? { folders: A.folders, wall: A.wall, wallChangedToday: A.wallDay === albDay, photos: A.photos.map((p) => ({ id: p.id, folder: p.folder, desc: p.desc, note: p.note || undefined })) } : null;
    const TH = s.th, thToday = TH.posts.filter((p) => p.day && p.day === nowDay()).length;
    const thWhoP = (c) => (c.mine ? me : c.self ? '我' : c.who);
    const thNow = { today: thToday, recent: TH.posts.slice(0, 5).map((p) => ({ id: p.id, day: p.day, time: p.time, text: p.text, cap: p.cap, hasPhoto: !!p.img, like: p.like, cm: p.cm.map((c) => ({ id: c.id, who: thWhoP(c), t: c.t, re: c.re || undefined })) })) };
    const thLikes = TH.posts.filter((p) => p.liked && !p.likeSeen).map((p) => p.text.slice(0, 20));
    const thMine = TH.posts.flatMap((p) => p.cm.filter((c) => c.mine && !c.seen).map((c) => `${p.id} 的 ${c.id}「${c.t}」`));
    const SC = s.sec, scCells = SC.bk?.cells || [], scLast = (t) => String(t || '').split('\n').filter(Boolean).pop() || '';
    const scEmpty = ['place', 'sweet', 'wed', 'sur', 'prop'].filter((k) => !SC.items.some((x) => x.tab === k));
    const scNow = { pages: Object.fromEntries(['place', 'sweet', 'wed', 'sur', 'prop'].map((k) => [k, SC.items.filter((x) => x.tab === k).map((x) => ({ id: x.id, title: x.title, done: x.done || undefined, hidden: x.hid || undefined, when: x.when || undefined, late: secLate(x) || undefined, unused: x.unused || undefined, lastNote: scLast(x.body) || undefined }))])),
      bingoLeft: scCells.filter((x) => !x.done).map((x) => ({ letter: x.L, title: x.t, lastNote: scLast(SC.bingo[x.L]) || undefined })) };
    const now = { weather: L.weather, cal: calNow, battery: L.battery, quote: L.quote, notes: s.notes, memoDay: s.memo.day, memo: memoNow, grains: grainsNow,
      web: { draft: s.web.draft, tabs: s.web.tabs, history: webNow }, shop: shopNow, food: foodNow, diary: diaryNow, cam: camNow, phone: telNow, music: musNow, album: albNow, threads: thNow, secret: scNow, line: lineNow() };
    const peekShop = [...s.shop.items, ...s.shop.card].filter((x) => s.shop.peek.includes(x.id)).map((x) => x.name || `${x.k}：${x.v}`);
    const peekFood = s.food.items.filter((x) => s.food.peek.includes(x.id)).map((x) => x.name);
    const memo = String(s.auto.memo || '').trim().slice(0, 4000);
    const mute = muteList();
    const sys = `你負責替角色「${him}」更新他手機上的內容（鎖定畫面、行事曆、備忘錄、拾穗小集、瀏覽器、日常物事、餵食指南、拾光手記、相機、電話、音樂、相簿、Threads、機密企劃）。${me} 是他最重要的人。只輸出一個 JSON 物件，不要任何說明、不要狀態欄、不要 markdown。`;
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
5. notes：0～2 則通知。app 只能是 web（LINE、行事曆、備忘錄和拾穗小集的通知程式會從真的內容自己拿，你不用寫；LINE 的訊息寫在第 18 條 line 裡）；from 10 字以內（App 標題）；text 40 字以內；when 用阿拉伯數字，像「現在」「5分鐘前」「2小時前」「昨天」；mine 只給真的跟 ${me} 有關的。沒有適合的就給 []。這次的通知要是新的，不要重複「他手機現在的內容」裡的通知。內容要跟劇情和他的生活對得上，不要編出劇情裡沒有的大事件。
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
12. cam：「相機」，他記下「想拍、但沒拍到的瞬間」（他的手機相機是認識 ${me} 之後才換上主畫面的，怕錯過想拍的瞬間）。只寫最近劇情裡真的出現過的畫面，不要自己編；用他的口吻。
   - add：這次記下的一則，最多 1 則，不一定每次都有，沒有就給 null。title 15 字內；body 30 字內，一句話：那時候想拍什麼、為什麼沒拍；time 是那個畫面發生的時間，像「15:20」。
   - 劇情到了新的一天（日期跟 cam.day 不一樣），以前的會自動清掉；這次 add 的就是新的一天記的。
   - 不要重複 cam 裡已經有的。
13. phone：他的電話。他的習慣、聯絡人照小抄（小抄寫的是參考，不是台詞）。
   - calls：這段劇情裡真的打過、接過、漏接的電話 0～3 通，沒有就給 []。name 照小抄裡存的名字；type 只能是 out（他撥出）、in（打來、他接了）、miss（他漏接）；time 像「15:20」；dur 是通話長度，像「3 分鐘」，miss 給空字串；mine：跟 ${me} 有關（她打來的、打給她的、在說她的事）才是 true。不要重複 phone.calls 裡已經有的。
   - vm：語音信箱。add 是這次新的語音留言，只寫劇情裡真的有人留的，最多 1 則，沒有就給 []；from 是留言的人（照小抄的名字）；time 像「15:20」；text 是留言內容，40 字內，像手機的語音轉文字；keep：他捨不得刪、想一直留著的才是 true；mine 同上。phone.vm 是空的時候，小抄裡寫到他一直留著的舊留言可以一次放進來（最多 3 則），day 寫那天的日期（像「2026-01-12」），keep 給 true。
   - vm 的 keep：phone.vm 裡已經有、他決定要留著的，寫它的 id，像 ["v2"]；沒有就給 []。
   - 劇情到了新的一天（日期跟 phone.day 不一樣），通話紀錄和沒有留著的語音會自動清掉。${mute.length ? `這些人不會打來、也不會留言：${mute.join('、')}。` : ''}
14. music：他的音樂。
   - now：他現在在聽的歌，title 歌名、artist 歌手；優先照最近劇情狀態欄的 🎧，看不出來就照他的習慣選；沒在聽就都給空字串。
   - add：這次放進歌單的歌 0～2 首，沒有就給 []。list 寫 music.lists 裡的歌單名字（照抄）；只放劇情裡聽到、提到的，或很像他會放進去的歌，一定要是真的存在的歌；mur 是一句心聲（為什麼放進來，20 字內），不是每首都要有，沒有就給空字串；mur 不要寫歌詞，只寫他自己的話。歌單裡已經有的不要再放；full 是 true 的歌單已經滿了，不能再放。歌單是空的時候，小抄裡寫到的歌可以一次放進來（最多 6 首）。
   - newList：他很少開新歌單，只有劇情裡有理由（或想放的歌單滿了）才開，寫新歌單的名字（12 字內），這次 add 可以放進去；沒有就給空字串。${musM.lists.length >= 6 ? '（歌單已經 6 個，不能再開。）' : ''}
${albNow ? `15. album：「相簿」，存著 ${me} 傳給他的照片。你看不到圖，photos 的 desc 是照片內容的說明，照說明判斷。下面都可以不做，不用每次都動：
   - wall：想把哪一張換成他的鎖定畫面，寫它的 id，照他今天的心情和最近的劇情挑；不換就給空字串。${albNow.wallChangedToday ? '今天已經換過了，這次 wall 給空字串。' : '一天最多換一次。'}
   - note：他偷偷寫在某一張照片下面的一句話（為什麼選它、看著它想到什麼），30 字內，用他的口吻，寫成 {"id":"p3","t":"…"}。每次最多 1 句，不是每次都要有，沒有就給 null；換桌布的話可以寫在那一張；已經有 note 的照片，除非他想改寫，不然寫別張。
   - newFolder：他想開的新資料夾名字（12 字內），想把照片分類時才開，很少開；沒有就給空字串。
   - move：要搬去別的資料夾的照片，寫成 [{"id":"p2","folder":"資料夾名字"}]，folder 只能是 album.folders 裡的、或這次 newFolder 的名字；沒有就給 []。
` : ''}16. threads：他的 Threads（脆）。想發的時候就發，每篇都像只有 ${me} 看得懂的暗號；生活紀錄，文字簡短、留白，不直接宣告感情。吵架、或 ${me} 真的需要他專心陪著的時候，他會先放下手機。
   - post：這次發的一篇，最多 1 篇，不一定每次都有，沒有就給 null。${thToday >= 3 ? '今天已經發了 3 篇，這次 post 給 null。' : `今天已經發了 ${thToday} 篇（故事裡一天最多 3 篇）。`}text 80 字內；note 是文末註解（只寫註解裡的字，不用寫「註解」和括號），25 字內；cap 是這篇配的照片，用文字寫畫面（40 字內）；tag 平常留空（會用固定的標籤${TH.tag ? `「${TH.tag}」` : ''}），想寫特別的標籤才寫，10 字內；like 是愛心數（整數，像真的貼文）；cm 是留言 1～3 則：who 是留言的人（照小抄裡會留言的人，寫名字或帳號），t 30 字內，可以加顏文字；他自己回某則留言就多寫一則，who 寫「我」，re 寫那則在 cm 裡的位置（從 0 開始的數字）。
   - reply：回 threads.recent 裡已經有的留言，0～3 則，沒有就給 []。寫成 {"post":"h3","re":"c5","who":"我","t":"…"}：who 寫「我」＝他自己回，也可以是配角回；t 30 字內；不要回自己的留言，不要重複已經有的留言。${thMine.length ? `\n   - ${me} 剛剛在他的脆留言了：${thMine.join('、')}。他會看到，要不要回、怎麼回由他決定（有時他回、有時配角回、有時不回）。` : ''}${thLikes.length ? `\n   - ${me} 剛剛按了這幾篇的愛心：「${thLikes.join('」「')}」。他會知道，要不要有反應（手記、下一篇、回留言時提）由他決定，大多時候是默默知道。` : ''}
   - 不要重複 threads.recent 裡已經發過的內容。
17. secret：「二〇二六機密企劃」，他手機裡唯一上鎖的資料夾，放他偷偷為 ${me} 準備的計畫，慢慢地、一點一點寫。頁面：place 想帶她去的地方、sweet 甜點練習簿、wed 婚紗與婚禮筆記、sur 還沒揭曉的驚喜、prop 求婚腳本（只有一份）；另外有「賓果作戰筆記」，格子是固定的（secret.bingoLeft 是還沒完成的格子）。
   - op：這次最多動 1 處；不用每次都動，沒有就給 null。四種寫法：
     {"act":"add","tab":"place","title":"","note":""}：在某一頁新增一條。title 20 字內；note 是準備筆記，60 字內，可以空。sur 要多寫 "when"（打算揭曉的日子，像 "3/28"），驚喜的內容 ${me} 打開也看不到。已經做完才補寫的（像已經發生過的事）加 "done":true。prop 已經有了就不能再加。
     {"act":"note","id":"s3","t":""}，或 {"act":"note","bingo":"H","t":""}：在某一條、或某個還沒完成的賓果格子補一句準備筆記（40 字內），寫他真的在準備的進度；不要跟 lastNote 重複。
     {"act":"done","id":"s3"}：某一條在劇情裡真的完成了才標。
     {"act":"reveal","id":"s5"}：某個驚喜在劇情裡已經揭曉了，才打開。
${SC.items.some(secLate) ? `   - late：有驚喜標了 late（打算揭曉的日子過了，劇情裡卻沒發生）。這次挑 1 個，照他會怎麼想決定：{"id":"s5","act":"move","when":"4/12"} 改到之後的新日子（可以順便用 op 的 note 寫為什麼延）；或 {"id":"s5","act":"unused"} 打開它，變成「原本偷偷準備、結果沒用上」的（${me} 會看到標題和準備筆記）。late 不算在 op 的 1 處裡。unused 標著的是已經沒用上的，不要再動。
` : '   - late 給 null。\n'}   - 賓果格子只能寫準備筆記，不能標完成（完成要看劇情）。${scCells.length ? '' : '這次讀不到賓果格子，不要寫 bingo。'}
   - 某一頁已經 20 條、又沒有做完的可以清掉時，那一頁不能再加。
${scEmpty.length ? `   - seed：這幾頁還是空的：${scEmpty.join('、')}。這次可以替每個空的頁各補 1 條，寫成跟 add 一樣的格式（不用寫 act），放進 seed 陣列；照他的角色設定和最近的劇情寫他真的會準備的事，不要編造重大劇情；已經發生過的事（像已經發生的求婚）加 "done":true。seed 不算在 op 的 1 處裡。不想補的頁可以不補。
` : '   - seed 給 []。\n'}${SC.peek ? `   - ${me} 剛剛輸入密碼、打開過這個資料夾（不知道她看了哪一頁、看了多少）。他會知道。要不要有反應、在哪裡反應（下面的紙條、Threads、手記…）由他決定，大多時候是默默知道。slip：想的話寫一句夾在企劃最上面的小紙條（20 字內，用他的口吻），不寫就給空字串。` : '   - slip 給空字串。'}
${lineRule(me)}
19. 全部用繁體中文、台灣用語。

只輸出這個格式：
{"date":"","time":"","weather":[{"place":"","temp":"","extra":""},{"place":"","temp":"","extra":""}],"cal":{"add":[{"day":"","time":"","title":"","body":"","cat":"work"}]},"battery":{"phone":0,"buds":0,"charging":false},"quote":"","notes":[{"app":"web","from":"","text":"","when":"","mine":false}],"memo":{"add":[{"kind":"text","title":"","body":"","items":[],"pin":false,"time":"","mine":false}],"check":[]},"grains":{"add":null,"told":[]},"web":{"add":[{"q":"","time":"","secret":false,"mur":""}],"draft":"","tabs":2,"unhide":[],"mur":null},"shop":{"add":[{"tab":"buy","name":"","price":"","time":"","secret":false,"kind":""}],"stamp":[],"card":[],"unhide":[]},"food":{"add":[{"area":"","name":"","mark":"star","note":"","lock":"","open":""}],"heart":[]},"diary":{"add":null,"draft":""},"cam":{"add":null},"music":{"now":{"title":"","artist":""},"add":[{"list":"","title":"","artist":"","mur":""}],"newList":""},"album":{"wall":"","note":null,"newFolder":"","move":[]},"phone":{"calls":[{"name":"","type":"in","time":"","dur":"","mine":false}],"vm":{"add":[{"from":"","time":"","text":"","keep":false,"mine":false,"day":""}],"keep":[]}},"threads":{"post":{"text":"","note":"","tag":"","cap":"","like":0,"cm":[{"who":"","t":"","re":null}]},"reply":[]},"secret":{"op":null,"late":null,"seed":[],"slip":""},"line":{"chats":[{"to":"","msgs":[{"from":"him","t":"text","v":"","time":""}]}],"add":null,"dad":[]}}`;
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

  // 排隊：小手機更新和 LINE 不同時叫 AI（argon 擠爆會 429，第 53 窗）
  let aiQ = Promise.resolve();
  function askAIQ(sys, prompt) { const p = aiQ.then(() => askAI(sys, prompt)); aiQ = p.catch(() => {}); return p; }
  function parse(txt) {
    const m = txt.replace(/```(json)?/gi, '').match(/\{[\s\S]*\}/);
    if (!m) throw new Error('AI 沒有回 JSON');
    return JSON.parse(m[0]);
  }

  // 只收合格的欄位，不合格的保留原本內容（不會把手機弄壞）
  // 主畫面小點：更新前後比一比，誰長了新東西（用各 App 的編號計數，不用每個 apply 各自記）
  const HSIG = { line: (s) => Object.values(s.line.chats).reduce((n, c) => n + c.msgs.length, 0) + ':' + s.line.dadMsgs.length + ':' + s.line.roster.length,
    memo: (s) => s.memo.seq, trivia: (s) => s.grains.seq, web: (s) => s.web.seq, cal: (s) => s.cal.seq,
    shop: (s) => `${s.shop.seq}/${s.shop.cseq}`, food: (s) => s.food.seq, diary: (s) => s.diary.seq, cam: (s) => s.cam.seq,
    phone: (s) => s.tel.seq, music: (s) => s.mus.seq,
    album: (s) => JSON.stringify([s.alb.wall, s.alb.folders, s.alb.photos.map((p) => [p.folder, p.note || ''])]),
    threads: (s) => (s.th ? `${s.th.seq}/${s.th.rseq}` : ''),
    secret: (s) => (s.sec ? `${s.sec.seq}/${s.sec.nseq}/${s.sec.slip}/${s.sec.items.filter((x) => x.hid).length}` : ''),
  };
  const hsig = (s) => Object.fromEntries(Object.entries(HSIG).map(([k, f]) => { try { return [k, String(f(s))]; } catch (e) { return [k, '']; } }));
  function apply(o) {
    const s = S(), L = s.lock, sig0 = hsig(s);
    const W = Array.isArray(o.weather) ? o.weather.filter((w) => w && w.place).slice(0, 2) : [];
    if (W.length === 2) L.weather = W.map((w) => ({ place: clean(w.place, 8), temp: clean(w.temp, 6), extra: clean(w.extra, 8) }));
    const pct = (v, old) => { const n = Math.round(Number(v)); return Number.isFinite(n) ? Math.max(1, Math.min(100, n)) : old; };
    if (o.battery) L.battery = { phone: pct(o.battery.phone, L.battery?.phone ?? 76), buds: pct(o.battery.buds, L.battery?.buds ?? 88), charging: o.battery.charging === true };
    if (typeof o.quote === 'string' && o.quote.trim()) L.quote = clean(o.quote, 40);
    const N = Array.isArray(o.notes) ? o.notes.filter((x) => x && x.app === 'web' && x.text && !muted(x)).slice(0, 2) : []; // LINE 的通知改成從聊天室真的拿（第 53 窗）
    if (N.length) s.notes = N.map((x) => ({ app: x.app, from: clean(x.from, 12), text: clean(x.text, 50), when: numWhen(clean(x.when, 8)), mine: !!x.mine }));
    else s.notes = s.notes.filter((x) => !['memo', 'trivia', 'cal', 'shop', 'food', 'diary', 'phone', 'music', 'album', 'threads', 'line'].includes(x.app)); // 舊的行事曆／備忘錄／拾穗通知拿掉，下面重新拿
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
    applyCam(o.cam, isoDate(o.date)); // 相機不發鎖屏通知（之後用主畫面小點）
    putNote(applyMusic(o.music), 2); // 音樂：正在播放換歌才跳一則
    putNote(applyAlbum(o.album, isoDate(o.date)), 1); // 相簿：他留了一句話才跳一則；換桌布不跳（一打開就看到）
    putNote(telNotice(applyPhone(o.phone, isoDate(o.date))), 2); // 電話：每次最多 1 則（新語音優先，其次未接）
    applyLine(o.line, isoDate(o.date), hm(o.time)).reverse().forEach((x) => putNote(x, x.mine ? 0 : 1)); // LINE：從他跟別人的新訊息拿，最多 2 則（爸的、上鎖的不跳）
    applySecret(o.secret); // 機密企劃：不跳鎖定畫面通知（加密資料夾不會把內容秀在外面），只有主畫面小點
    applyThreads(o.threads).reverse().forEach((x) => putNote(x, x.mine ? 0 : 1)); // Threads：新貼文跳一則；回了果果的留言再跳一則（鵝黃線）
    s.unseen = true;
    s.unseenMine = s.notes.some((x) => x.mine) || nextEv()?.cat === 'her';
    const sig1 = hsig(s); Object.keys(sig1).forEach((k) => { if (sig1[k] !== sig0[k]) s.hdot[k] = true; });
  }

  // ===== LINE：小手機更新那邊（他跟別人的聊天、爸、小鎖被偷看、通知；第 53 窗）=====
  function lnSpecial(dayIso) { // 爸的特別日子（照劇情的年份）：父親節、清明、過年（農曆初一）、設定裡的生日／離開的日子
    const y = +String(dayIso || nowDay()).slice(0, 4) || new Date().getFullYear(), D = S().line.dad, out = [['8/8', '父親節'], ['4/4', '清明'], ['4/5', '清明']];
    try { const f = new Intl.DateTimeFormat('zh-TW-u-ca-chinese', { month: 'numeric', day: 'numeric' });
      for (let d = new Date(y, 0, 15); d <= new Date(y, 1, 25); d.setDate(d.getDate() + 1)) { const P = Object.fromEntries(f.formatToParts(d).map((x) => [x.type, x.value])); if (P.month === '1' && P.day === '1') { out.push([`${d.getMonth() + 1}/${d.getDate()}`, '過年（農曆初一）']); break; } } } catch (e) { /* 沒有農曆就算了 */ }
    if (D.bday) out.push([D.bday, '爸爸的生日']);
    if (D.gone) out.push([D.gone, '爸爸離開的日子']);
    return out;
  }
  function lineNow() {
    const L = S().line, short = (m) => ({ from: m.from, t: m.t, v: m.v, day: m.day, time: m.time, lock: m.lock || undefined });
    return { contacts: L.roster.filter((r) => r.name).map((r) => ({ name: r.name, cat: r.cat, recent: (L.chats[r.id]?.msgs || []).slice(-4).map(short) })),
      dad: lnDadName() ? L.dadMsgs.slice(-3).map((m) => ({ v: m.v, day: m.day })) : undefined };
  }
  function lineRule(me) {
    const L = S().line, dad = lnDadName(), full = L.roster.length >= LN_MAX_ROS;
    const peeked = L.peek.map((id) => { for (const r of L.roster) { const m = (L.chats[r.id]?.msgs || []).find((x) => x.id === id); if (m) return `「${r.name}」裡的「${m.v}」`; } return ''; }).filter(Boolean);
    const sp = lnSpecial().map(([d, n]) => `${d} ${n}`).join('、');
    return `18. line：他的 LINE。聊天名單在 line.contacts（recent 是最近幾則）。他跟 ${me} 兩個人的聊天室是另外一個地方，這裡不要寫。
   - chats：這次 1～3 個聊天室有新訊息，挑最近劇情裡最可能在聊的人（不用每次都是同樣的人）。to 要一字不差照 contacts 的 name。每個聊天室這次 1～6 則：{"from":"him 或對方的名字","t":"text","v":"","time":"15:40"}。from 是 him＝他傳的；群組要寫說話的人的名字。time 照劇情，不能晚於最新那一刻。
   - 他的習慣：跟朋友、工作傳訊息像公文，只有文字跟句號，幾乎不用貼圖；照角色設定和小抄。對方的語氣照小抄裡他們的個性。
   - t 可以是 text、photo（v 寫照片裡有什麼）、voice（v 寫語音內容，像語音轉文字；多寫 "dur":"0:12"）、stk（v 寫貼圖是什麼）。每則 v 60 字以內。
   - lock：他不想讓 ${me} 看到的那一則（像跟朋友商量給她的驚喜）加 "lock":true，這次最多 1 則，少用。
   - 不要重複 recent 裡已經有的內容，接得上之前聊的。
   - add：劇情裡有新認識、真的會互加 LINE 的人（婚禮廠商、新作者……）才寫 {"name":"","cat":"fam 或 fri 或 work"}，這次最多 1 個${full ? '；名單已經滿了，給 null' : '；沒有就給 null'}。新加的人這次也可以在 chats 裡聊。
${dad ? `   - dad：他傳給「${dad}」的話（爸爸已經不在了，聊天室留著，想他的時候會傳，永遠不會已讀）。字串陣列，1～2 則，每則 40 字以內，短短的，像對著不會回的人說話。最新劇情的日期如果是這幾天之一，一定要寫：${sp}；其他時候只有劇情裡真的有讓他想起爸爸的事（求婚、婚禮、想念、難過、讀到爸爸教過的東西）才寫，沒有就給 []。不要重複 line.dad 裡寫過的。` : '   - dad 給 []。'}
${peeked.length ? `   - ${me} 剛剛解鎖、偷看了他鎖起來的訊息：${peeked.join('；')}。他會知道。要不要反應、在哪裡反應（例如在跟朋友的聊天室裡慌張一下）由他決定。` : ''}`;
  }
  function applyLine(o, day, time) {
    const s = S(), L = s.line, me = ctx().name1 || '', notes = [];
    if (!o || typeof o !== 'object') return notes;
    day = day || nowDay(); time = time || hm(s.lock.time);
    const a = o.add; // 他加的新朋友
    if (a && a.name && L.roster.length < LN_MAX_ROS) { const nm = clean(a.name, 16); if (nm && !L.roster.some((r) => r.name === nm) && nm !== lnDadName()) L.roster.push({ id: 'r' + (++L.seq), name: nm, cat: ['fam', 'fri', 'work'].includes(a.cat) ? a.cat : 'fri', av: '', byHim: true }); }
    let locks = 0;
    (Array.isArray(o.chats) ? o.chats : []).slice(0, 3).forEach((c) => {
      const r = L.roster.find((x) => x.name && x.name === String(c?.to || '').trim()); if (!r) return;
      const C = lnChat(r.id), old = new Set(C.msgs.slice(-10).map((m) => m.v)), add = [];
      (Array.isArray(c.msgs) ? c.msgs : []).slice(0, 6).forEach((m) => {
        const v = clean(String(m?.v || '').replace(/\*[^*\n]*\*/g, ''), 80); if (!v || old.has(v)) return;
        const from = m.from === 'him' ? 'him' : clean(m.from || r.name, 12) || r.name;
        const t = ['text', 'photo', 'voice', 'stk'].includes(m.t) ? m.t : 'text';
        const x = { id: 'l' + (++L.seq), from, t, v, day, time: hm(m.time) || time, seq: L.seq };
        if (t === 'voice' && m.dur) x.dur = clean(m.dur, 6);
        if (m.lock === true && locks < 1) { x.lock = true; locks++; }
        add.push(x); old.add(v);
      });
      if (!add.length) return;
      C.msgs.push(...add);
      C.msgs.sort((p, q) => (lnSortKey(p) < lnSortKey(q) ? -1 : 1)); while (C.msgs.length > 30) C.msgs.shift();
      const inc = add.filter((x) => x.from !== 'him'); C.unread += inc.length;
      const n = inc.find((x) => !x.lock); // 通知：對方傳來的第一則（上鎖的不跳）
      if (n) notes.push({ app: 'line', id: n.id, from: clean(r.name, 12), text: clean(lnPrev(n), 50), when: lnWhen(n.time, time), mine: !!(me && n.v.includes(me)) });
    });
    if (lnDadName() && Array.isArray(o.dad)) o.dad.slice(0, 2).forEach((v) => { v = clean(v, 60); if (v && !L.dadMsgs.slice(-5).some((m) => m.v === v)) L.dadMsgs.push({ id: 'd' + (++L.seq), v, day, time, seq: L.seq }); });
    L.peek = []; // 偷看過的已經告訴他了
    if (root && !root.hidden && !root.querySelector('.ap-view[data-app="line"]').hidden && lnIn !== 'ours') keepScroll('line', paintLine);
    return notes.slice(0, 2);
  }
  const lnWhen = (a, b) => { a = hm(a); b = hm(b); if (!a || !b) return '現在'; const d = (+b.slice(0, 2) * 60 + +b.slice(3)) - (+a.slice(0, 2) * 60 + +a.slice(3)); return d >= 1 ? (d < 60 ? `${d}分鐘前` : `${Math.floor(d / 60)}小時前`) : '現在'; };
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
      if (it && m && !it.mur) { it.mur = m; delete it.seen; }
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
  // 音樂：開新歌單 → 加歌（滿 30 首不能加；同歌單同名擋）→ 正在播放（換歌才回傳通知）
  function applyMusic(o) {
    const M = musSync();
    if (!o || typeof o !== 'object') return null;
    const nl = clean(o.newList, 12);
    if (nl && M.lists.length < 6 && !M.lists.some((l) => l.name === nl)) M.lists.push({ id: 'L' + (++M.seq), name: nl, fixed: false, songs: [] });
    const empty = M.lists.every((l) => !l.songs.length);
    (Array.isArray(o.add) ? o.add : o.add ? [o.add] : []).slice(0, empty ? 6 : 2).forEach((a) => {
      const l = M.lists.find((x) => x.name === clean(a?.list, 12)), t = clean(a?.title, 24), ar = clean(a?.artist, 16);
      if (!l || !t || l.songs.length >= 30 || l.songs.some((x) => x.t === t)) return;
      l.songs.push({ id: 'm' + (++M.seq), t, a: ar, mur: clean(a.mur, 24) });
    });
    const t = clean(o.now?.title, 24), a = clean(o.now?.artist, 16);
    M.now = { t, a: t ? a : '' };
    if (!t || t === M.last) { if (!t) M.last = ''; return null; }
    M.last = t;
    return { app: 'music', from: clean('正在播放・' + t, 20), text: a, when: '現在', mine: false };
  }
  // 電話：換新的一天 → 通話清空、沒留著的語音清掉 → 他說要留著的標起來 → 加新的通話、語音（不會打來的人擋掉）
  function applyPhone(o, day) {
    const T = S().tel;
    if (day && day !== T.day) { if (T.day) { T.calls = []; T.vm = T.vm.filter((x) => x.keep); } T.day = day; }
    if (!o || typeof o !== 'object') return null;
    const mute = muteList(), d = T.day || isoDate(new Date().toISOString());
    let vmNew = null, miss = null;
    const V = o.vm && typeof o.vm === 'object' ? o.vm : {};
    (Array.isArray(V.keep) ? V.keep : []).forEach((id) => { const x = T.vm.find((v) => v.id === id); if (x) x.keep = true; });
    (Array.isArray(o.calls) ? o.calls : []).slice(0, 3).forEach((c) => {
      const name = clean(c?.name, 12), type = ['out', 'in', 'miss'].includes(c?.type) ? c.type : '', time = hm(c?.time) || S().lock.time || '';
      if (!name || !type || mute.includes(name) || T.calls.some((x) => x.name === name && x.type === type && x.time === time)) return;
      const it = { id: 'p' + (++T.seq), seq: T.seq, day: d, name, type, time, dur: type === 'miss' ? '' : clean(c.dur, 8), mine: c.mine === true };
      T.calls.push(it);
      if (type === 'miss') miss = it;
    });
    const adds = Array.isArray(V.add) ? V.add : V.add ? [V.add] : [];
    adds.slice(0, T.vm.length ? 1 : 3).forEach((a) => {
      const from = clean(a?.from, 12), text = cleanBody(a?.text, 44);
      if (!from || !text || mute.includes(from) || T.vm.some((x) => x.from === from && x.text === text)) return;
      const old = isoDate(a.day);
      const it = { id: 'v' + (++T.seq), seq: T.seq, day: old && old < d ? old : d, from, time: hm(a.time) || (old && old < d ? '' : S().lock.time || ''), text, keep: a.keep === true, mine: a.mine === true };
      T.vm.push(it);
      if (it.day === d) vmNew = it; // 舊的留言（小抄裡的）不跳通知
    });
    T.calls = T.calls.slice(-20);
    const keep = T.vm.filter((x) => x.keep).slice(-10), rest = T.vm.filter((x) => !x.keep).slice(-10);
    T.vm = T.vm.filter((x) => keep.includes(x) || rest.includes(x));
    return vmNew || miss;
  }
  // 電話的通知：程式從電話裡真的內容拿（語音＝留言內容、未接＝那通的時間）
  function telNotice(x) {
    if (!x) return null;
    let when = '現在';
    const a = hm(x.time), b = hm(S().lock.time);
    if (a && b) { const d = (+b.slice(0, 2) * 60 + +b.slice(3)) - (+a.slice(0, 2) * 60 + +a.slice(3)); if (d >= 1) when = d < 60 ? `${d}分鐘前` : `${Math.floor(d / 60)}小時前`; }
    return x.text != null
      ? { app: 'phone', id: x.id, from: clean('語音留言・' + x.from, 20), text: clean(x.text, 50), when, mine: !!x.mine }
      : { app: 'phone', id: x.id, from: clean('未接來電・' + x.name, 20), text: x.time, when, mine: !!x.mine };
  }
  // 相機：劇情換新的一天整本換新（沒有置頂）→ 加新的一則（亂寫的擋掉；同標題不重複）
  function applyCam(o, day) {
    const C = S().cam;
    if (day && day !== C.day) { if (C.day) C.items = []; C.day = day; }
    if (!o || typeof o !== 'object') return null;
    const a = Array.isArray(o.add) ? o.add[0] : o.add;
    if (!a || typeof a !== 'object') return null;
    const title = clean(a.title, 16), body = cleanBody(a.body, 34);
    if (!title || !body || C.items.some((x) => x.title === title)) return null;
    const it = { id: 'c' + (++C.seq), seq: C.seq, title, body, time: hm(a.time) || S().lock.time || '' };
    C.items.push(it);
    C.items = C.items.slice(-12);
    return it;
  }
  // 相簿：換鎖定畫面（一天最多一次）、留一句話（每次最多一句）、開新資料夾、搬照片（第 49 窗）
  function applyAlbum(o, day) {
    const A = albSync();
    if (!o || typeof o !== 'object' || !A.photos.length) return null;
    const d = day || nowDay(), find = (id) => A.photos.find((p) => p.id === clean(id, 12));
    const nf = clean(o.newFolder, 12);
    const okF = (f) => !!f && (A.folders.includes(f) || f === nf);
    arr(o.move).forEach((m) => { const p = m && find(m.id), f = m && clean(m.folder, 12); if (p && okF(f)) p.folder = f; });
    let walled = false;
    const w = typeof o.wall === 'string' && find(o.wall);
    if (w && A.wallDay !== d) { A.wall = w.id; A.wallDay = d; A.last = w.id; walled = true; }
    let note = null;
    const nt = o.note && typeof o.note === 'object' ? o.note : null, np = nt && find(nt.id), tx = nt && clean(nt.t, 32);
    if (np && tx && tx !== np.note) {
      np.note = tx; np.noteDay = d;
      if (!walled) A.last = np.id;
      note = { app: 'album', id: np.id, from: '相簿・' + np.folder, text: tx, when: '現在', mine: true };
    }
    albSync();
    if (alShow) alShow();
    return note;
  }
  // 日記的通知不露內容（要臉部解鎖才看得到）
  const diaryNotice = (x) => x && { app: 'diary', id: x.id, from: dayTitle(x.day), text: '輕觸以臉部解鎖查看', when: '現在', mine: false };

  async function runUpdate(manual) {
    if (busy) return;
    if (!isOwner()) { if (manual) status(!S().auto.owner ? '先按「設成現在的角色」' : !bound() ? '現在不是綁定的聊天室，不能更新' : `現在不是 ${S().auto.owner} 的聊天，不能更新`); return; }
    busy = true; status();
    try {
      try { await secLoad(); } catch (e) { /* 讀不到就用上次存的 */ }
      const { sys, prompt } = buildPrompt();
      apply(parse(await askAIQ(sys, prompt)));
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
    if (E.CHAT_CHANGED) es.on(E.CHAT_CHANGED, () => setTimeout(() => { if (ctx().chatMetadata?.world_info || S().sec.book) secLoad(); }, 600)); // 機密企劃：換到有綁世界書的聊天室（含剛打開酒館），自動重讀賓果卡
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
      wallTo(dr, s, kind, true);
      sumEl.textContent = s[k.img] ? '已選照片' : emptyText;
      if (root && !root.hidden) paint();
    };
    show();
    const onSlide = () => { const s = S(); s[k.z] = +zr.value; s[k.y] = +yr.value; s[k.x] = +xr.value; wallTo(dr, s, kind, true); if (root && !root.hidden) wallTo(root, s, kind); save(); };
    [zr, yr, xr].forEach((el) => el.addEventListener('input', onSlide));
    dr.querySelector('.ap-reset').addEventListener('click', () => { const s = S(); s[k.z] = 100; s[k.y] = 0; s[k.x] = 0; save(); show(); });
    dr.querySelector('.ap-pick input').addEventListener('change', async (e) => {
      const f = e.target.files[0]; if (!f) return;
      try { const s = S(); s[k.img] = await shrink(f); if (kind === 'lock' && s.alb) s.alb.wall = ''; save(); show(); if (alShow) alShow(); } catch (err) { alert('照片讀不進來，換一張試試'); }
      e.target.value = '';
    });
    dr.querySelector('.ap-del').addEventListener('click', () => { const s = S(); delete s[k.img]; s[k.z] = 100; s[k.y] = 0; s[k.x] = 0; save(); show(); });
  }

  // 照片存進酒館自己的伺服器（聊天傳圖用的那個資料夾，Railway 硬碟上）；回傳路徑
  async function albUpload(dataUrl, fmt = 'jpg') {
    const c = ctx(), headers = (typeof c.getRequestHeaders === 'function' ? c.getRequestHeaders() : null) || { 'Content-Type': 'application/json' };
    const r = await fetch('/api/images/upload', { method: 'POST', headers, body: JSON.stringify({ image: String(dataUrl).split(',')[1], format: fmt, ch_name: 'anan_phone', filename: 'p' + Date.now() }) });
    if (!r.ok) { const tx = (await r.text().catch(() => '')).slice(0, 80); throw new Error(`伺服器回 ${r.status}${tx ? '：' + tx : ''}`); }
    const j = await r.json().catch(() => ({}));
    if (!j.path) throw new Error('伺服器沒有回照片路徑');
    return j.path;
  }
  // 刪照片時順便把伺服器上的檔案拿掉（失敗也沒關係，只是留一個小檔案）
  function albUnlink(path) {
    if (!path || String(path).startsWith('data:')) return;
    const c = ctx(), headers = (typeof c.getRequestHeaders === 'function' ? c.getRequestHeaders() : null) || { 'Content-Type': 'application/json' };
    fetch('/api/images/delete', { method: 'POST', headers, body: JSON.stringify({ path }) }).catch(() => {});
  }
  // 設定頁「📷 相簿」：上面是照片清單，下面是新增／編輯（鎖定畫面位置＋取景框位置＋說明＋資料夾）
  function bindAlbum(dr, sumEl, box) {
    const q = (c) => dr.querySelector(c);
    const NEWF = '__new__';
    let ed = null; // 正在編的那張：{ id, img（新選的照片 dataURL）, path, z, x, y, vz, vy }
    const blank = () => ({ id: '', img: '', path: '', z: 100, x: 0, y: 0, vz: 100, vy: 50 });
    const msg = (t) => { q('.ap-al-msg').textContent = t || ''; };
    const showEd = () => {
      const src = ed.img || (ed.path ? albSrc(ed) : '');
      wallPut(dr, 'alb', src, ed.z, ed.x, ed.y);
      q('.ap-al-vf').style.cssText = src ? `background-image:url("${src}");background-size:${ed.vz}% auto;background-position:50% ${ed.vy}%` : '';
      q('.ap-al-z').value = ed.z; q('.ap-al-y').value = ed.y; q('.ap-al-x').value = ed.x; q('.ap-al-vz').value = ed.vz; q('.ap-al-vy').value = ed.vy;
      q('.ap-al-edt').textContent = ed.id ? '編輯照片' : '新增照片';
      q('.ap-al-rmv').hidden = !ed.id;
    };
    const fillFolders = (pick) => {
      const A = albSync(), sel = q('.ap-al-fold');
      sel.innerHTML = A.folders.map((f) => `<option>${esc(f)}</option>`).join('') + `<option value="${NEWF}">＋ 新資料夾</option>`;
      sel.value = pick && A.folders.includes(pick) ? pick : A.folders[0] || NEWF;
      q('.ap-al-newf').hidden = sel.value !== NEWF;
    };
    const reset = () => { ed = blank(); q('.ap-al-desc').value = ''; q('.ap-al-newf').value = ''; fillFolders(); showEd(); };
    alShow = () => {
      const A = albSync();
      sumEl.textContent = `${A.photos.length} / ${ALB_MAX} 張`;
      q('.ap-al-list').innerHTML = A.photos.map((p) => `<div class="ap-al-row"><span class="ap-al-th" style="background-image:url(&quot;${esc(albSrc(p))}&quot;)"></span>`
        + `<span class="ap-al-tx"><small>${esc(p.folder)}</small><span>${esc(p.desc)}</span></span><div class="menu_button ap-al-edit" data-id="${p.id}">編輯</div></div>`).join('');
      const own = box.querySelector('.ap-alwall'); if (own) { own.hidden = !A.wall; own.querySelector('.ap-alwall-d').textContent = A.wall && A.wallDay ? `（${slash(A.wallDay)} 換的）` : ''; }
      if (root && !root.hidden) { paint(); if (inApp() && !root.querySelector('.ap-view[data-app="album"]').hidden) paintAlbum(); }
    };
    q('.ap-al-list').addEventListener('click', (e) => {
      const b = e.target.closest('.ap-al-edit'); if (!b) return;
      const p = albPhoto(b.dataset.id); if (!p) return;
      ed = { id: p.id, img: '', path: p.path, z: p.z ?? 100, x: p.x ?? 0, y: p.y ?? 0, vz: p.vz ?? 100, vy: p.vy ?? 50 };
      q('.ap-al-desc').value = p.desc || ''; q('.ap-al-newf').value = ''; fillFolders(p.folder); showEd(); msg('');
    });
    [['.ap-al-z', 'z'], ['.ap-al-y', 'y'], ['.ap-al-x', 'x'], ['.ap-al-vz', 'vz'], ['.ap-al-vy', 'vy']].forEach(([c, k]) => q(c).addEventListener('input', (e) => { ed[k] = +e.target.value; showEd(); }));
    q('.ap-al-fold').addEventListener('change', (e) => { q('.ap-al-newf').hidden = e.target.value !== NEWF; });
    q('.ap-al-pick input').addEventListener('change', async (e) => {
      const f = e.target.files[0]; if (!f) return;
      try { ed.img = await shrink(f); msg(''); showEd(); } catch (err) { msg('照片讀不進來，換一張試試'); }
      e.target.value = '';
    });
    q('.ap-al-cancel').addEventListener('click', () => { reset(); msg(''); });
    q('.ap-al-rmv').addEventListener('click', () => {
      const A = S().alb, p = albPhoto(ed.id); if (!p) return;
      if (!confirm('確定要刪掉這張照片嗎？他寫在上面的話也會一起不見。')) return;
      A.photos = A.photos.filter((x) => x.id !== p.id);
      S().notes = S().notes.filter((x) => !(x.app === 'album' && x.id === p.id));
      albUnlink(p.path); save(); reset(); alShow(); msg('刪掉了');
    });
    q('.ap-al-save').addEventListener('click', async () => {
      const A = S().alb, sel = q('.ap-al-fold');
      const folder = clean(sel.value === NEWF ? q('.ap-al-newf').value : sel.value, 12), desc = clean(q('.ap-al-desc').value, 40);
      if (!ed.img && !ed.path) { msg('先按「選擇照片」'); return; }
      if (!desc) { msg('寫一句說明，他才知道這張是什麼'); return; }
      if (!folder) { msg('幫新資料夾取個名字'); return; }
      if (!ed.id && A.photos.length >= ALB_MAX) { msg(`已經 ${ALB_MAX} 張了，先刪掉一張再放`); return; }
      let path = ed.path;
      if (ed.img) {
        msg('存進酒館中…');
        try { path = await albUpload(ed.img); }
        catch (err) { console.warn('[anan_phone] 相簿上傳失敗', err); msg(''); alert(`照片存不進酒館（${err.message}）\n請把這個畫面截圖給小克`); return; }
      }
      const vals = { path, folder, desc, z: ed.z, x: ed.x, y: ed.y, vz: ed.vz, vy: ed.vy };
      const old = ed.id && albPhoto(ed.id);
      if (old) { if (ed.img && old.path !== path) albUnlink(old.path); Object.assign(old, vals); }
      else A.photos.push({ id: 'p' + (++A.seq), ...vals });
      save(); reset(); alShow(); msg('存好了');
    });
    // 換回我的桌布（第 50 窗）：取消他挑的相簿桌布，露出果果原本那張；wallDay 不動 → 他今天不能再換，明天之後才可以
    const back = box.querySelector('.ap-alwall-back');
    if (back) back.addEventListener('click', () => { const A = albSync(); if (!A.wall) return; A.wall = ''; save(); alShow(); });
    reset(); alShow();
  }

  // ===== LINE（第 53 窗）=====
  const LN_CAT = [['fam', '家人'], ['fri', '朋友'], ['work', '工作']];
  const LN_MAX_ROS = 14; // 名單最多 14 位（加上你們的、爸的＝16 個聊天室；第 53 窗他的小抄就有 11 位）
  const LN_MAX_STK = 40;
  const lnSrc = (u) => (u ? albSrc({ path: u }) : '');
  const lnInit = (n) => String(n || '').replace(/^[^\p{L}\p{N}]+/u, '').slice(0, 1) || '？'; // 頭像沒放照片：名字第一個字
  const lnRepaint = () => { if (root && !root.hidden && !root.querySelector('.ap-view[data-app="line"]')?.hidden) keepScroll('line', paintLine); }; // 設定改了，小手機開著就重畫
  function bindLineSettings(box, sumEl) {
    const q = (c) => box.querySelector(c), L = () => S().line;
    const file = q('.ap-ln-file');
    let pick = null; // 現在要放照片的是誰：{ kind:'av', who } 或 { kind:'ros', id } 或 { kind:'stk' }
    const stkMsg = (t) => { q('.ap-ln-stkmsg').textContent = t || ''; };
    const show = () => {
      const l = L();
      q('.ap-ln-mename').value = l.me.name || '';
      box.querySelectorAll('.ap-ln-avr').forEach((r) => {
        const o = l[r.dataset.who], th = r.querySelector('.ap-ln-th');
        th.style.backgroundImage = o.av ? `url("${lnSrc(o.av)}")` : '';
        th.textContent = o.av ? '' : (r.dataset.who === 'me' ? lnInit(l.me.name || '果') : '安');
        r.querySelector('.ap-ln-avdel').hidden = !o.av;
      });
      q('.ap-ln-ros').innerHTML = l.roster.map((x) => `
        <div class="ap-ln-rr" data-id="${x.id}">
          <span class="ap-ln-th ap-ln-thb" style="${x.av ? `background-image:url(&quot;${esc(lnSrc(x.av))}&quot;)` : ''}">${x.av ? '' : esc(lnInit(x.name))}</span>
          <input type="text" class="text_pole ap-ln-rn" maxlength="16" value="${esc(x.name)}" placeholder="名字">
          <select class="text_pole ap-ln-rc">${LN_CAT.map(([k, n]) => `<option value="${k}"${x.cat === k ? ' selected' : ''}>${n}</option>`).join('')}</select>
          <span class="ap-ln-rx">${x.av ? '<i class="fa-solid fa-image-portrait ap-ln-ravdel" title="移除頭像"></i>' : ''}${x.byHim ? '<small>他加的</small>' : ''}<i class="fa-solid fa-xmark ap-ln-rdel" title="刪掉"></i></span>
        </div>`).join('') || '<div class="ap-row"><small>還沒有人，按「＋ 新增一位」</small></div>';
      q('.ap-ln-rosn').textContent = `${l.roster.length} / ${LN_MAX_ROS} 位`;
      q('.ap-ln-add').hidden = l.roster.length >= LN_MAX_ROS;
      q('.ap-ln-skip').value = l.wiSkip || '';
      q('.ap-ln-dadb').value = l.dad.bday || ''; q('.ap-ln-dadg').value = l.dad.gone || '';
      q('.ap-ln-stk').innerHTML = l.stk.map((x) => `
        <div class="ap-ln-st" data-id="${x.id}"><span class="ap-ln-sti" style="background-image:url(&quot;${esc(lnSrc(x.img))}&quot;)"></span>
          <input type="text" class="text_pole ap-ln-stn" maxlength="16" value="${esc(x.name)}"><i class="fa-solid fa-xmark ap-ln-sdel" title="刪掉"></i></div>`).join('');
      q('.ap-ln-expn').textContent = `你們的聊天室 ${l.ours.msgs.length} 則`;
      sumEl.textContent = `${l.roster.length} 位 · 貼圖 ${l.stk.length} / ${LN_MAX_STK}`;
    };
    const done = () => { save(); show(); lnRepaint(); };
    show();
    q('.ap-ln-mename').addEventListener('input', (e) => { L().me.name = e.target.value.trim(); save(); lnRepaint(); });
    // 頭像：妳的、他的
    box.querySelectorAll('.ap-ln-avr').forEach((r) => {
      r.querySelector('.ap-ln-avpick').addEventListener('click', () => { pick = { kind: 'av', who: r.dataset.who }; file.click(); });
      r.querySelector('.ap-ln-avdel').addEventListener('click', () => { const o = L()[r.dataset.who]; if (!o.av) return; albUnlink(o.av); o.av = ''; done(); });
    });
    // 名單
    q('.ap-ln-add').addEventListener('click', () => { const l = L(); if (l.roster.length >= LN_MAX_ROS) return; l.roster.push({ id: 'r' + (++l.seq), name: '', cat: 'fam', av: '' }); done(); const ins = box.querySelectorAll('.ap-ln-rn'); ins[ins.length - 1]?.focus(); });
    const ros = q('.ap-ln-ros');
    const rOf = (el) => L().roster.find((x) => x.id === el.closest('.ap-ln-rr')?.dataset.id);
    ros.addEventListener('input', (e) => { if (!e.target.classList.contains('ap-ln-rn')) return; const r = rOf(e.target); if (!r) return; r.name = e.target.value.trim(); save(); const th = e.target.parentElement.querySelector('.ap-ln-thb'); if (!r.av) th.textContent = lnInit(r.name); lnRepaint(); });
    ros.addEventListener('change', (e) => { if (!e.target.classList.contains('ap-ln-rc')) return; const r = rOf(e.target); if (r) { r.cat = e.target.value; save(); lnRepaint(); } });
    ros.addEventListener('click', (e) => {
      const r = rOf(e.target); if (!r) return;
      if (e.target.closest('.ap-ln-thb')) { pick = { kind: 'ros', id: r.id }; file.click(); return; }
      if (e.target.closest('.ap-ln-ravdel')) { albUnlink(r.av); r.av = ''; done(); return; }
      if (e.target.closest('.ap-ln-rdel')) {
        if (!confirm(`把「${r.name || '這位'}」從名單拿掉？跟他的聊天紀錄也會一起刪掉。`)) return;
        const l = L(); albUnlink(r.av); l.roster = l.roster.filter((x) => x !== r); delete l.chats[r.id]; done();
      }
    });
    q('.ap-ln-skip').addEventListener('input', (e) => { L().wiSkip = e.target.value; save(); });
    // 爸的日子：月/日
    const md = (v) => { const m = String(v || '').trim().replace(/[－—.月]/g, '/').replace(/日$/, '').match(/^(\d{1,2})\/(\d{1,2})$/); return m && +m[1] >= 1 && +m[1] <= 12 && +m[2] >= 1 && +m[2] <= 31 ? `${+m[1]}/${+m[2]}` : ''; };
    ['dadb', 'dadg'].forEach((k) => q('.ap-ln-' + k).addEventListener('change', (e) => { const v = md(e.target.value); L().dad[k === 'dadb' ? 'bday' : 'gone'] = v; e.target.value = v; save(); }));
    // 貼圖
    q('.ap-ln-stkpick').addEventListener('click', () => {
      const l = L(), nm = q('.ap-ln-stkname').value.trim();
      if (l.stk.length >= LN_MAX_STK) return stkMsg(`已經 ${LN_MAX_STK} 張了，先刪掉一張再放`);
      if (!nm) return stkMsg('先在左邊取名字，再選圖片');
      if (l.stk.some((x) => x.name === nm)) return stkMsg(`已經有一張叫「${nm}」了，換個名字`);
      stkMsg(''); pick = { kind: 'stk', name: nm }; file.click();
    });
    const stk = q('.ap-ln-stk');
    stk.addEventListener('change', (e) => {
      if (!e.target.classList.contains('ap-ln-stn')) return;
      const l = L(), x = l.stk.find((t) => t.id === e.target.closest('.ap-ln-st').dataset.id), nm = e.target.value.trim(); if (!x) return;
      if (!nm || l.stk.some((t) => t !== x && t.name === nm)) { e.target.value = x.name; return stkMsg(nm ? `已經有一張叫「${nm}」了` : '名字不能空白'); }
      x.name = nm; stkMsg(''); done();
    });
    stk.addEventListener('click', (e) => {
      if (!e.target.closest('.ap-ln-sdel')) return;
      const l = L(), x = l.stk.find((t) => t.id === e.target.closest('.ap-ln-st').dataset.id); if (!x) return;
      if (!confirm(`刪掉貼圖「${x.name}」？`)) return;
      albUnlink(x.img); l.stk = l.stk.filter((t) => t !== x); done();
    });
    // 選好照片／圖片
    file.addEventListener('change', async () => {
      const f = file.files && file.files[0]; file.value = ''; const p = pick; pick = null; if (!f || !p) return;
      const l = L();
      try {
        if (p.kind === 'stk') {
          stkMsg('放上去中…');
          const path = await albUpload(await shrink(f, 360, true), 'png');
          l.stk.push({ id: 's' + (++l.seq), name: p.name, img: path }); q('.ap-ln-stkname').value = ''; stkMsg(`放好了：「${p.name}」`);
        } else {
          const path = await albUpload(await shrink(f, 300));
          const o = p.kind === 'av' ? l[p.who] : l.roster.find((x) => x.id === p.id); if (!o) return;
          if (o.av && o.av !== path) albUnlink(o.av); o.av = path;
        }
        done();
      } catch (err) { if (p.kind === 'stk') stkMsg('圖片放不上去：' + (err.message || err) + '（請截圖給小克）'); else alert('頭像放不上去：' + (err.message || err)); }
    });
    // 匯出你們的聊天室（下載成文字檔，收進酒館備份資料夾）
    q('.ap-ln-exp').addEventListener('click', () => {
      const l = L(), M = l.ours.msgs;
      if (!M.length) return alert('你們的聊天室還沒有訊息');
      const p2 = (n) => String(n).padStart(2, '0');
      const fmt = (t) => { const d = new Date(t); return `${d.getFullYear()}/${p2(d.getMonth() + 1)}/${p2(d.getDate())} ${p2(d.getHours())}:${p2(d.getMinutes())}`; };
      const me = l.me.name || '我', txt = [`LINE｜${me} ↔ 安安（${M.length} 則）`, ''].concat(M.map((m) => `${fmt(m.time)}　${m.from === 'me' ? me : '安安'}：${m.t === 'stk' ? `〔貼圖〕${m.v}` : m.v}`)).join('\n');
      const a = document.createElement('a'), d = new Date();
      a.href = URL.createObjectURL(new Blob([txt], { type: 'text/plain;charset=utf-8' }));
      a.download = `LINE紀錄_${d.getFullYear()}${p2(d.getMonth() + 1)}${p2(d.getDate())}.txt`;
      document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    });
    lnSettingsShow = show;
  }
  let lnSettingsShow = () => {};

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
          ${drawer('look', '🎨 外觀', `
          <div class="ap-blk" data-b="lock">
          <div class="ap-row ap-sub">🔒 鎖定畫面桌布<small class="ap-subsum" data-s="lock"></small></div>
          <div class="ap-row ap-alwall" hidden><span class="ap-alwall-t">現在鎖定畫面是他在相簿挑的照片<span class="ap-alwall-d"></span></span><div class="menu_button ap-alwall-back">換回我的桌布</div></div>
          ${wallBlock('lock', '<span>時間＋小工具</span><span>摘句</span>')}</div>
          <div class="ap-blk" data-b="home">
          <div class="ap-row ap-sub">🏠 主畫面桌布（沒選照片時是深灰藍）<small class="ap-subsum" data-s="home"></small></div>
          ${wallBlock('home', '<span class="ap-ghost"></span><span>常駐四格</span>', '<div class="ap-htint"></div>')}
          <div class="ap-sl"><span>濾鏡</span><input type="range" class="ap-tint" min="0" max="85" step="1"><b class="ap-tintv"></b></div></div>
          <div class="ap-row ap-sub">App 名字（只存在妳的酒館，空白就用原本的名字）</div>
          ${RENAME.map(([id, def]) => `<div class="ap-nm"><span>${def}</span><input type="text" class="text_pole ap-name-in" data-id="${id}" maxlength="12" placeholder="${def}"></div>`).join('')}`)}
          ${drawer('apps', '📱 App 設定', `
          <div class="ap-row ap-sub">📖 拾光手記<small class="ap-subsum" data-s="diary"></small></div>
          <div class="ap-row">開始的日子（這天是第一天，日記標題的「第 N 天」從這裡算）</div>
          <div class="ap-row"><input type="date" class="text_pole ap-start"><div class="menu_button ap-start-clr">清掉</div></div>
          <div class="ap-row ap-sub">🎵 音樂<small class="ap-subsum" data-s="mus"></small></div>
          <div class="ap-row">他固定的歌單（照順序，用、分開；最多 6 個，他自己開的會排在下面）</div>
          <input type="text" class="text_pole ap-mus-fixed" maxlength="120" placeholder="例：示範歌單、示範歌單">
          <div class="ap-row ap-sub">📞 電話<small class="ap-subsum" data-s="tel"></small></div>
          <div class="ap-row">我的最愛（照順序，用、分開；名字後面可以加符號）</div>
          <input type="text" class="text_pole ap-tel-favs" maxlength="200" placeholder="例：示範聯絡人、示範聯絡人">
          <div class="ap-row">最下面那一位（安靜地放在最愛下面，不能撥）</div>
          <input type="text" class="text_pole ap-tel-last" maxlength="12" placeholder="例：示範聯絡人">
          <div class="ap-row ap-sub">💬 LINE<small class="ap-subsum" data-s="line"></small></div>
          <div class="ap-row">他 LINE 裡存妳的名字（聊天室最上面、置頂那張卡）</div>
          <input type="text" class="text_pole ap-ln-mename" maxlength="30" placeholder="例：示範名字">
          <div class="ap-row ap-ln-avr" data-who="me"><span class="ap-ln-th"></span>妳的頭像<div class="menu_button ap-ln-avpick">選擇照片</div><div class="menu_button ap-ln-avdel">移除</div></div>
          <div class="ap-row ap-ln-avr" data-who="him"><span class="ap-ln-th"></span>他的頭像<div class="menu_button ap-ln-avpick">選擇照片</div><div class="menu_button ap-ln-avdel">移除</div></div>
          <div class="ap-row">聊天名單（名字＋分類；他在劇情裡加的朋友也會出現在這裡）</div>
          <div class="ap-ln-ros"></div>
          <div class="ap-row"><div class="menu_button ap-ln-add">＋ 新增一位</div><small class="ap-ln-rosn"></small></div>
          <div class="ap-row">爸的日子（月/日，可以空著；爸的名字用上面電話「最下面那一位」）</div>
          <div class="ap-row"><span>生日</span><input type="text" class="text_pole ap-ln-dadb ap-ln-md" maxlength="5" placeholder="例：3/21"><span>離開的日子</span><input type="text" class="text_pole ap-ln-dadg ap-ln-md" maxlength="5" placeholder="例：12/30"></div>
          <div class="ap-row">🧸 貼圖（最多 40 張；名字＝誰＋在幹嘛，他靠名字看懂、靠名字挑）</div>
          <div class="ap-ln-stk"></div>
          <div class="ap-row"><input type="text" class="text_pole ap-ln-stkname" maxlength="16" placeholder="先取名字，例：庭安抱抱"><div class="menu_button ap-ln-stkpick">選擇圖片</div></div>
          <div class="ap-row ap-ln-stkmsg"></div>
          <div class="ap-row">他回妳時不讀的世界書條目（標題裡有這些字就跳過，用、分開）</div>
          <input type="text" class="text_pole ap-ln-skip" maxlength="200" placeholder="例：狀態欄、好感">
          <div class="ap-row"><div class="menu_button ap-ln-exp">匯出 LINE 紀錄</div><small class="ap-ln-expn"></small></div>
          <input type="file" accept="image/*" class="ap-ln-file" hidden>
          <div class="ap-row ap-sub">🧵 Threads<small class="ap-subsum" data-s="th"></small></div>
          <div class="ap-row">他的帳號（不用打 @）</div>
          <input type="text" class="text_pole ap-th-him" maxlength="30" placeholder="例：demo.account">
          <div class="ap-row">妳的帳號（妳留言時顯示的名字）</div>
          <input type="text" class="text_pole ap-th-mein" maxlength="30" placeholder="例：demo.me">
          <div class="ap-row">標籤（每篇帳號後面那個，平常固定用這個）</div>
          <input type="text" class="text_pole ap-th-tagin" maxlength="16" placeholder="例：示範標籤">
          <div class="ap-row">他的頭貼<span class="ap-th-avs"></span></div>
          <div class="ap-row"><div class="menu_button ap-th-avpick">選擇照片</div><div class="menu_button ap-th-avdel">移除</div><input type="file" accept="image/*" class="ap-th-avfile" hidden></div>
          <div class="ap-row ap-sub">🔒 2026機密企劃<small class="ap-subsum" data-s="sec"></small></div>
          <div class="ap-row">密碼（只能用數字；重新整理酒館前輸入一次就好）</div>
          <input type="password" class="text_pole ap-sc-pw" maxlength="8" inputmode="numeric" autocomplete="off" placeholder="例：0000">
          <div class="ap-row">世界書名字（空白＝用聊天室綁的那本；裡面要有標題「賓果卡」「賓果心意」的條目）</div>
          <input type="text" class="text_pole ap-sc-book" maxlength="60" placeholder="空白就好">
          <div class="ap-row"><span class="ap-sc-bst"></span><div class="menu_button ap-sc-reload">重新讀一次</div></div>`)}
          ${drawer('alb', '📷 相簿', `
          <div class="ap-al-list"></div>
          <div class="ap-al-ed">
            <div class="ap-al-edt">新增照片</div>
            <div class="ap-al-two">
              <div class="ap-al-lkw"><div class="ap-al-lb">鎖定畫面位置</div>
                <div class="ap-mini ap-al-mini"><div class="ap-blur" data-w="alb"></div><div class="ap-wall" data-w="alb"></div><div class="ap-mini-guide"><span>時間</span><span>摘句</span></div></div></div>
              <div class="ap-al-vfw"><div class="ap-al-lb">取景框位置</div>
                <div class="ap-al-vf"><i></i><i></i></div>
                <div class="ap-sl"><span>大小</span><input type="range" class="ap-al-vz" min="100" max="250" step="1"></div>
                <div class="ap-sl"><span>上下</span><input type="range" class="ap-al-vy" min="0" max="100" step="0.5"></div></div>
            </div>
            <div class="ap-sl"><span>大小</span><input type="range" class="ap-al-z" min="100" max="220" step="1"></div>
            <div class="ap-sl"><span>上下</span><input type="range" class="ap-al-y" min="-35" max="35" step="0.5"></div>
            <div class="ap-sl"><span>左右</span><input type="range" class="ap-al-x" min="-35" max="35" step="0.5"></div>
            <div class="ap-al-lb">一句說明（只給他看）</div>
            <input type="text" class="text_pole ap-al-desc" maxlength="40" placeholder="例：示範照片的說明">
            <div class="ap-al-lb">放進哪一夾</div>
            <select class="text_pole ap-al-fold"></select>
            <input type="text" class="text_pole ap-al-newf" maxlength="12" placeholder="新資料夾的名字" hidden>
            <div class="ap-row">
              <label class="menu_button ap-al-pick">選擇照片<input type="file" accept="image/*" hidden></label>
              <div class="menu_button ap-al-save">存好</div>
              <div class="menu_button ap-al-cancel">取消</div>
              <div class="menu_button ap-al-rmv" hidden>刪掉</div>
            </div>
            <div class="ap-row ap-al-msg"></div>
          </div>`)}
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
    const blk = (b) => box.querySelector(`.ap-blk[data-b="${b}"]`);
    const sub = (k) => box.querySelector(`.ap-subsum[data-s="${k}"]`);
    bindWall(blk('lock'), 'lock', sub('lock'), '沒有照片');
    bindWall(blk('home'), 'home', sub('home'), '深灰藍');

    // 主畫面的深灰藍濾鏡：越往右越深，字越清楚
    const tr = box.querySelector('.ap-tint'), tv = box.querySelector('.ap-tintv');
    const showTint = () => {
      const v = S().homeTint;
      tr.value = v; tv.textContent = v + '%';
      blk('home').querySelector('.ap-mini .ap-htint').style.opacity = v / 100;
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
    const showStart = () => { const v = S().start; stIn.value = dOf(v) ? v : ''; sub('diary').textContent = dOf(v) ? v.replace(/-/g, '/') + ' 開始' : '還沒填開始的日子'; };
    showStart();
    stIn.addEventListener('change', () => { S().start = dOf(stIn.value) ? stIn.value : ''; save(); showStart(); if (root && !root.hidden && inApp()) paintDiary(); });
    box.querySelector('.ap-start-clr').addEventListener('click', () => { S().start = ''; save(); showStart(); });

    // 音樂：固定歌單（名字只存在酒館）
    const musIn = box.querySelector('.ap-mus-fixed');
    const showMus = () => { const n = telList(S().mus.fixed).length; musIn.value = S().mus.fixed || ''; sub('mus').textContent = n ? `固定歌單 ${n} 個` : '還沒填歌單'; };
    showMus();
    musIn.addEventListener('input', () => { S().mus.fixed = musIn.value; musSync(); save(); showMus(); if (root && !root.hidden && inApp()) paintMusic(); });

    // 電話：我的最愛＋最下面那一位（名字只存在酒館，不寫進程式）
    const favIn = box.querySelector('.ap-tel-favs'), lastIn = box.querySelector('.ap-tel-last');
    const showTel = () => { const T = S().tel, n = telList(T.favs).length; favIn.value = T.favs || ''; lastIn.value = T.last || ''; sub('tel').textContent = n ? `我的最愛 ${n} 位` : '還沒填我的最愛'; };
    showTel();
    const telIn = () => { S().tel.favs = favIn.value; S().tel.last = lastIn.value.trim(); save(); showTel(); if (root && !root.hidden && inApp()) paintPhone(); };
    favIn.addEventListener('input', telIn); lastIn.addEventListener('input', telIn);

    // LINE：名字、頭像、名單、爸的日子、貼圖、匯出（名字和圖只存在酒館，第 53 窗）
    bindLineSettings(box, sub('line'));

    // Threads：兩個帳號（名字只存在酒館）
    const thHim = box.querySelector('.ap-th-him'), thMe = box.querySelector('.ap-th-mein'), thTag = box.querySelector('.ap-th-tagin');
    const thAvS = box.querySelector('.ap-th-avs'), thAvF = box.querySelector('.ap-th-avfile'), thAvDel = box.querySelector('.ap-th-avdel');
    const showTh = () => { const T = S().th; thHim.value = T.him || ''; thMe.value = T.me || ''; thTag.value = T.tag || ''; thAvS.textContent = T.av ? '（已放）' : '（還沒放）'; thAvDel.hidden = !T.av; sub('th').textContent = `${T.posts.length} / 100 篇`; };
    showTh();
    const thSet = () => { S().th.him = thHim.value.trim().replace(/^@+/, ''); S().th.me = thMe.value.trim().replace(/^@+/, ''); S().th.tag = thTag.value.trim().replace(/^[#＃›>\s]+/, ''); save(); sub('th').textContent = `${S().th.posts.length} / 100 篇`; if (root && !root.hidden && inApp()) keepScroll('threads', paintThreads); };
    thHim.addEventListener('input', thSet); thMe.addEventListener('input', thSet); thTag.addEventListener('input', thSet);
    // 他的頭貼：縮小後存 Railway（跟相簿同一個門）
    box.querySelector('.ap-th-avpick').addEventListener('click', () => thAvF.click());
    thAvF.addEventListener('change', async () => {
      const f = thAvF.files && thAvF.files[0]; thAvF.value = ''; if (!f) return;
      try { const path = await albUpload(await shrink(f)); const T = S().th; if (T.av && T.av !== path) albUnlink(T.av); T.av = path; save(); showTh(); if (root && !root.hidden && inApp()) keepScroll('threads', paintThreads); }
      catch (err) { alert('頭貼放不上去：' + (err.message || err)); }
    });
    thAvDel.addEventListener('click', () => { const T = S().th; if (!T.av) return; albUnlink(T.av); T.av = ''; save(); showTh(); if (root && !root.hidden && inApp()) keepScroll('threads', paintThreads); });

    // 機密企劃：密碼、世界書（名字和密碼只存在酒館）
    const scPw = box.querySelector('.ap-sc-pw'), scBook = box.querySelector('.ap-sc-book'), scSt = box.querySelector('.ap-sc-bst');
    secShow = () => {
      const C = S().sec, n = C.items.length, cells = C.bk?.cells || [];
      scSt.textContent = secBG.ok ? `讀到賓果卡 ✓（${cells.length} 格）` : secBG.why === '還沒讀過' ? (cells.length ? `上次讀到 ${cells.length} 格` : '還沒讀過賓果卡') : `讀不到賓果卡：${secBG.why}`;
      sub('sec').textContent = `${C.pw ? '已設密碼' : '還沒設密碼'} · ${n} 條`;
    };
    scPw.value = S().sec.pw || ''; scBook.value = S().sec.book || ''; secShow();
    scPw.addEventListener('input', () => { scPw.value = scPw.value.replace(/\D/g, ''); S().sec.pw = scPw.value; secOpen = false; secPin = ''; save(); secShow(); }); // 改密碼＝重新鎖上
    scBook.addEventListener('change', () => { S().sec.book = scBook.value.trim(); save(); secLoad(); });
    box.querySelector('.ap-sc-reload').addEventListener('click', () => { scSt.textContent = '讀取中…'; secLoad(); });
    secLoad();

    bindAlbum(D('alb'), sum('alb'), box);

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
