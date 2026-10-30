// 安安的小手機 v0.4：鎖定畫面＋每 N 則自動更新（照安安自己說的規則排版）
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
    if (!s.auto) s.auto = { on: true, owner: '', n: 30, last: 0 };
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
          <div class="ap-blur"></div><div class="ap-wall"></div>
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
    scr.classList.toggle('ap-nowall', !s.lockWall);
    wallTo(root, s);
    root.querySelector('.ap-carrier').textContent = s.carrier;
    root.querySelector('.ap-pct').textContent = (L.battery?.phone ?? 76) + '%';
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

  // 桌布：上層照片可以放大、上下左右移（用螢幕的 %，不受照片大小影響）；移開露出的地方用模糊的同一張照片墊底
  function wallTo(box, s) {
    const url = s.lockWall ? `url("${s.lockWall}")` : '';
    box.querySelector('.ap-blur').style.backgroundImage = url;
    const w = box.querySelector('.ap-wall');
    w.style.backgroundImage = url;
    w.style.transform = `translate(${s.wallX || 0}%, ${s.wallY || 0}%) scale(${(s.wallZ || 100) / 100})`;
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
  let busy = false, stEl = null;
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
    if (msg) { stEl.textContent = msg; return; }
    if (busy) { stEl.textContent = '他拿起手機中……'; return; }
    const a = S().auto;
    const tail = a.last ? `上次 ${hhmm(a.last)}` : '還沒更新過';
    if (!a.owner) stEl.textContent = '先按「設成現在的角色」';
    else if (!isOwner()) stEl.textContent = `現在不是 ${a.owner} 的聊天　·　${tail}`;
    else if (!a.on) stEl.textContent = `自動更新關著　·　${tail}`;
    else { const n = left(); stEl.textContent = (n == null ? '' : `還差 ${n} 則　·　`) + tail; }
  }

  const clean = (t, max) => String(t ?? '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, max);

  function buildPrompt() {
    const c = ctx(), ch = curChar(), s = S(), L = s.lock;
    const me = c.name1 || '使用者', him = ch.name;
    const card = [ch.description, ch.personality, ch.scenario].filter(Boolean).join('\n').slice(0, 6000);
    const recent = (c.chat || []).filter((m) => m && !m.is_system).slice(-Math.max(10, Math.min(60, s.auto.n)))
      .map((m) => `${m.is_user ? me : (m.name || him)}：${clean(m.mes, 2500)}`).join('\n\n');
    const now = { weather: L.weather, next: L.next, battery: L.battery, quote: L.quote, notes: s.notes };
    const sys = `你負責替角色「${him}」更新他手機鎖定畫面上的內容。${me} 是他最重要的人。只輸出一個 JSON 物件，不要任何說明、不要狀態欄、不要 markdown。`;
    const prompt = `【${him} 的角色設定】
${card}

【最近的劇情】
${recent}

【他手機現在的內容】
${JSON.stringify(now)}

【請依照最近的劇情，更新他的手機】
規則：
1. weather：兩個地點。沿用現在的兩個地點，除非劇情裡有人到了別的城市或區域，才換成新地點。temp 寫像「18°」，符合季節；extra 寫降雨機率，像「雨10%」，沒有就空字串。
2. next：他行事曆上最近的下一件事。when 很短，像「明天 15:00」「週二 15:00」；what 10 字以內；跟 ${me} 有關 mine 就是 true。
3. battery：phone 和 buds 是 0～100 的整數，合理就好；他不喜歡電量低於 50，除非劇情裡他忙了一整天。
4. quote：今日摘句，由他自己決定換不換。不換就回傳原本那句，一字不改；要換的話，是他親手打的一句話，30 字以內，用他的語氣。
5. notes：3～6 則通知。app 只能是 line、cal、memo、web 其中一個；from 10 字以內（聯絡人、行程名或 App 標題）；text 40 字以內；when 像「現在」「五分鐘前」「一小時前」；跟 ${me} 有關的 mine 是 true。內容要跟劇情和他的生活對得上，不要編出劇情裡沒有的大事件。
6. 全部用繁體中文、台灣用語。

只輸出這個格式：
{"weather":[{"place":"","temp":"","extra":""},{"place":"","temp":"","extra":""}],"next":{"when":"","what":"","mine":false},"battery":{"phone":0,"buds":0},"quote":"","notes":[{"app":"line","from":"","text":"","when":"","mine":false}]}`;
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
    const N = Array.isArray(o.notes) ? o.notes.filter((x) => x && APP[x.app] && x.text).slice(0, 6) : [];
    if (N.length) s.notes = N.map((x) => ({ app: x.app, from: clean(x.from, 12), text: clean(x.text, 50), when: clean(x.when, 8), mine: !!x.mine }));
    s.unseen = true;
    s.unseenMine = s.notes.some((x) => x.mine) || !!L.next?.mine;
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

  function settingsPanel() {
    const box = document.createElement('div');
    box.className = 'ap-settings';
    box.innerHTML = `
      <div class="inline-drawer">
        <div class="inline-drawer-toggle inline-drawer-header"><b>📱 安安的小手機</b><div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div></div>
        <div class="inline-drawer-content">
          <label class="checkbox_label"><input type="checkbox" class="ap-fabchk"> 顯示小手機懸浮球</label>
          <div class="ap-row">鎖定畫面桌布</div>
          <div class="ap-mini"><div class="ap-blur"></div><div class="ap-wall"></div><div class="ap-mini-guide"><span>時間＋小工具</span><span>摘句</span></div></div>
          <div class="ap-sl"><span>大小</span><input type="range" class="ap-z" min="100" max="220" step="1"></div>
          <div class="ap-sl"><span>上下</span><input type="range" class="ap-y" min="-35" max="35" step="0.5"></div>
          <div class="ap-sl"><span>左右</span><input type="range" class="ap-xx" min="-35" max="35" step="0.5"></div>
          <div class="ap-row"><div class="menu_button ap-reset">位置歸零</div></div>
          <div class="ap-row">
            <label class="menu_button ap-pick">選擇照片<input type="file" accept="image/*" hidden></label>
            <div class="menu_button ap-del">移除</div>
            <div class="menu_button ap-open">打開小手機</div>
            <div class="menu_button ap-test">試試紅點</div>
          </div>
          <div class="ap-sep">自動更新</div>
          <label class="checkbox_label"><input type="checkbox" class="ap-autochk"> 開啟自動更新</label>
          <div class="ap-row">這是誰的手機：<b class="ap-owner"></b><div class="menu_button ap-own">設成現在的角色</div></div>
          <div class="ap-row">每 <input type="number" class="text_pole ap-n" min="5" max="200" step="1"> 則更新一次</div>
          <div class="ap-row ap-st"></div>
          <div class="ap-row"><div class="menu_button ap-now">現在更新</div></div>
        </div>
      </div>`;
    const target = document.getElementById('extensions_settings2') || document.getElementById('extensions_settings');
    if (target) target.appendChild(box);
    const mini = box.querySelector('.ap-mini');
    const zr = box.querySelector('.ap-z'), yr = box.querySelector('.ap-y'), xr = box.querySelector('.ap-xx');
    const show = () => {
      const s = S();
      mini.hidden = !s.lockWall;
      zr.value = s.wallZ || 100; yr.value = s.wallY || 0; xr.value = s.wallX || 0;
      wallTo(mini, s);
    };
    show();
    const onSlide = () => { const s = S(); s.wallZ = +zr.value; s.wallY = +yr.value; s.wallX = +xr.value; wallTo(mini, s); save(); };
    [zr, yr, xr].forEach((el) => el.addEventListener('input', onSlide));
    box.querySelector('.ap-reset').addEventListener('click', () => { const s = S(); s.wallZ = 100; s.wallY = 0; s.wallX = 0; save(); show(); });
    const chk = box.querySelector('.ap-fabchk');
    chk.checked = S().fab;
    chk.addEventListener('change', () => { S().fab = chk.checked; save(); badge(); });
    box.querySelector('.ap-pick input').addEventListener('change', async (e) => {
      const f = e.target.files[0]; if (!f) return;
      try { S().lockWall = await shrink(f); save(); show(); } catch (err) { alert('照片讀不進來，換一張試試'); }
      e.target.value = '';
    });
    box.querySelector('.ap-del').addEventListener('click', () => { const s = S(); delete s.lockWall; s.wallZ = 100; s.wallY = 0; s.wallX = 0; save(); show(); });
    box.querySelector('.ap-open').addEventListener('click', open);
    box.querySelector('.ap-test').addEventListener('click', () => { const s = S(); s.unseen = true; s.unseenMine = true; save(); badge(); });

    // 自動更新的設定
    stEl = box.querySelector('.ap-st');
    const ownEl = box.querySelector('.ap-owner'), nEl = box.querySelector('.ap-n'), autoChk = box.querySelector('.ap-autochk');
    const showAuto = () => { const a = S().auto; ownEl.textContent = a.owner || '（還沒設定）'; nEl.value = a.n; autoChk.checked = a.on; status(); };
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
