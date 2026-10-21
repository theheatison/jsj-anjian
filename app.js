(() => {
  const P = window.PHONE, S = window.STORY || {};
  const DIRECT = !(S.paragraphs || []).some(p => p);   // 如果正文为空，直接显示手机
  const \$ = s => document.querySelector(s);
  const h = html => { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; };
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const WD = "日一二三四五六";
  const parseD = s => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
  const TODAY = P.today ? parseD(P.today) : new Date();
  const key = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  /* ================= 时钟 ================= */
  const [H0, M0, S0] = (P.time || "12:00:00").split(":").map(Number);
  let t0 = null;
  const now = () => { const sec = Math.floor(((H0 * 3600 + M0 * 60 + (S0 || 0)) * 1000 + (t0 ? Date.now() - t0 : 0)) / 1000) % 86400; return { h: Math.floor(sec / 3600), m: Math.floor(sec / 60) % 60 }; };
  const ampm = o => (o.h < 12 ? "上午" : "下午");
  const hm = o => `${(o.h % 12) || 12}:${String(o.m).padStart(2, "0")}`;
  const nowLabel = () => { const o = now(); return `${ampm(o)} ${hm(o)}`; };
  const dateLabel = d => `${d.getMonth() + 1}月${d.getDate()}日 星期${WD[d.getDay()]}`;

  /* ================= 正文 ================= */
  const story = \$("#story");
  story.innerHTML = (S.title ? `<h1>${esc(S.title)}</h1>` : "") + (S.paragraphs || []).map(p => p === "" ? `<p class="gap"></p>` :
    `<p>${esc(p).replace(/\[\[(.+?)\]\]/g, (_, t) => `<a class="phone-link" data-open>\${t}</a>`)}</p>`).join("");

  /* ================= 图标 ================= */
  const W = "#fff";
  const G = {
    phone: `<path d="M10 5.5c1-.6 2.2-.4 2.8.6l2.1 3.3c.6 1 .4 2.1-.5 2.8l-1.6 1.2c1.1 2.7 3.2 5 5.9 6.4l1.2-1.5c.7-.9 2-1 2.9-.4l3.2 2.2c1 .6 1.1 2 .5 2.9l-1.1 1.5c-1.1 1.5-3.1 2-4.8 1.3-6.1-2.4-10.7-7.1-12.9-13.2-.6-1.7-.1-3.7 1.3-4.8z" fill="${W}"/>`,
    contacts: `<rect x="6" y="4" width="22" height="26" rx="2" fill="${W}" opacity=".95"/><circle cx="17" cy="13" r="4.2" fill="#d1561b"/><path d="M9.5 25c.8-4 3.8-6.2 7.5-6.2s6.7 2.2 7.5 6.2z" fill="#d1561b"/>`,
    message: `<rect x="4" y="8" width="26" height="18" rx="2" fill="${W}"/><path d="M4.8 9l12.2 9.5L29.2 9" fill="none" stroke="#c98a12" stroke-width="2"/>`,
    apps: [0, 1, 2].flatMap(r => [0, 1, 2].map(c => `<rect x="${6 + c * 8}" y="${6 + r * 8}" width="6" height="6" rx="1.2" fill="${W}"/>`)).join(""),
    internet: `<circle cx="17" cy="17" r="11" fill="none" stroke="${W}" stroke-width="2"/><ellipse cx="17" cy="17" rx="5" ry="11" fill="none" stroke="${W}" stroke-width="1.6"/><path d="M6 17h22M8 11h18M8 23h18" stroke="${W}" stroke-width="1.4"/>`,
    camera: `<circle cx="17" cy="17" r="10" fill="#111" stroke="#9aa3ad" stroke-width="2"/><circle cx="17" cy="17" r="6" fill="#1d3b6b"/><circle cx="15" cy="15" r="2" fill="#bfe0ff"/>`,
    gallery: `<rect x="5" y="7" width="24" height="20" rx="1.5" fill="${W}"/><rect x="7.5" y="9.5" width="19" height="13" fill="#5ab0f0"/><path d="M7.5 22.5l6-7 4 4.5 3-3 6 5.5z" fill="#3c8f1e"/><circle cx="22" cy="13" r="1.8" fill="#ffe36b"/>`,
    clock: `<circle cx="17" cy="17" r="12" fill="#fff" stroke="#555" stroke-width="1.5"/><path d="M17 9v8l5 3" fill="none" stroke="#222" stroke-width="2" stroke-linecap="round"/>`,
    memo: `<rect x="7" y="5" width="20" height="24" rx="1.5" fill="#fffbe0"/><path d="M10 11h14M10 15h14M10 19h14M10 23h9" stroke="#b08a10" stroke-width="1.5"/>`,
    music: `<path d="M13 23.5V9l12-3v14.5" fill="none" stroke="${W}" stroke-width="2.2"/><ellipse cx="10.5" cy="23.5" rx="3.6" ry="2.8" fill="${W}"/><ellipse cx="22.5" cy="20.5" rx="3.6" ry="2.8" fill="${W}"/>`,
    calc: `<rect x="7" y="4" width="20" height="26" rx="2" fill="#2b2f35"/><rect x="9.5" y="6.5" width="15" height="6" fill="#bfe3b0"/>${[0, 1, 2].flatMap(r => [0, 1, 2].map(c => `<rect x="${9.5 + c * 5.3}" y="${15 + r * 4.8}" width="4" height="3.4" rx=".6" fill="#ddd"/>`)).join("")}`,
    email: `<rect x="4" y="8" width="26" height="18" rx="2" fill="${W}"/><path d="M4.8 9l12.2 9.5L29.2 9" fill="none" stroke="#2e8f3a" stroke-width="2"/><circle cx="26" cy="24" r="5" fill="#ffd34d"/>`,
    settings: `<circle cx="17" cy="17" r="5" fill="none" stroke="${W}" stroke-width="3"/>${[0, 45, 90, 135, 180, 225, 270, 315].map(a => `<rect x="15.5" y="4" width="3" height="6" rx="1" fill="${W}" transform="rotate(${a} 17 17)"/>`).join("")}`,
    radio: `<rect x="5" y="11" width="24" height="16" rx="2" fill="${W}"/><circle cx="12" cy="19" r="4" fill="#7a4a20"/><rect x="19" y="15" width="7" height="2" fill="#7a4a20"/><rect x="19" y="19" width="7" height="2" fill="#7a4a20"/><path d="M8 11l14-6" stroke="${W}" stroke-width="1.6"/>`,
    diary: `<rect x="8" y="5" width="18" height="24" rx="1.5" fill="#f3e2c3"/><rect x="8" y="5" width="4" height="24" fill="#8a5a2b"/><path d="M15 11h8M15 15h8M15 19h6" stroke="#8a5a2b" stroke-width="1.4"/>`,
    market: `<path d="M8 12h18l-1.5 16h-15z" fill="${W}"/><path d="M12 12a5 5 0 0 1 10 0" fill="none" stroke="${W}" stroke-width="2"/><circle cx="14" cy="18" r="1.3" fill="#3c8f1e"/><circle cx="20" cy="18" r="1.3" fill="#3c8f1e"/>`,
    files: `<path d="M5 10h9l2 2.5h13V27H5z" fill="#fff3c9"/><path d="M5 14h24v13H5z" fill="#ffe08a"/>`,
    briefing: `<circle cx="13" cy="13" r="5.5" fill="#ffe36b"/><path d="M11 26h14a4.5 4.5 0 0 0-1-8.9 6 6 0 0 0-11.4 1.6A3.7 3.7 0 0 0 11 26z" fill="${W}"/>`
  };
  const APPS = {
    phone: { label: "电话", a: "#7ddc5a", b: "#2a8a18" },
    contacts: { label: "联系人", a: "#f9ad5c", b: "#d1561b" },
    message: { label: "信息", a: "#fde27a", b: "#e2a21b" },
    apps: { label: "应用程序", a: "#62b8f5", b: "#1d5fc0" },
    internet: { label: "互联网", a: "#5cbcff", b: "#0b4fae" },
    camera: { label: "相机", a: "#6f757e", b: "#22252a" },
    gallery: { label: "相册", a: "#ffd46a", b: "#de830c" },
    calendar: { label: "日历", a: "#fafafa", b: "#cfd6cc" },
    clock: { label: "时钟", a: "#e9ecef", b: "#9aa1a8" },
    memo: { label: "便签", a: "#fff27c", b: "#d9b425" },
    music: { label: "音乐", a: "#d991f2", b: "#7f27ad" },
    calc: { label: "计算器", a: "#a5aeb8", b: "#4a525c" },
    email: { label: "电子邮件", a: "#7fd87f", b: "#2a8a36" },
    settings: { label: "设定", a: "#a6acb4", b: "#4f5660" },
    radio: { label: "FM收音机", a: "#d39a62", b: "#74441b" },
    diary: { label: "迷你的日记", a: "#c49465", b: "#6b4523" },
    market: { label: "三星应用商店", a: "#98d958", b: "#3a8a1a" },
    files: { label: "我的文件", a: "#ffc95a", b: "#d9820a" },
    briefing: { label: "每日简报", a: "#86c8ff", b: "#2a6fc6" }
  };
  const badge = id => {
    if (id === "phone") { const n = P.calls.filter(c => c.dir === "missed" && !c.seen).length; return n || 0; }
    if (id === "message") return P.messages.reduce((a, t) => a + (t.unread || 0), 0);
    return 0;
  };
  const tile = id => {
    const A = APPS[id], n = badge(id);
    const inner = id === "calendar" ? `<i class="caltop"></i><span class="calnum">${TODAY.getDate()}</span>` : `<svg viewBox="0 0 34 34">${G[id] || ""}</svg>`;
    return `<span class="ti" style="--a:${A.a};--b:${A.b}">${inner}${n ? `<b data-badge="${id}">${n}</b>` : ""}</span>`;
  };
  const appBtn = (id, label) => `<button class="ap" data-app="${id}">${tile(id)}<span>${esc(label || APPS[id].label)}</span></button>`;
  const AV = `<svg viewBox="0 0 40 40"><circle cx="20" cy="15" r="8" fill="#c9ced6"/><path d="M4 41c1-9 8-14 16-14s15 5 16 14z" fill="#c9ced6"/></svg>`;
  const IC = {
    in: `<svg class="call-ic" viewBox="0 0 20 20"><path d="M15 5L6 14M6 8v6h6" fill="none" stroke="#5fd34a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    out: `<svg class="call-ic" viewBox="0 0 20 20"><path d="M5 15l9-9M8 6h6v6" fill="none" stroke="#f5a623" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    missed: `<svg class="call-ic" viewBox="0 0 20 20"><path d="M3 7l6 6 8-8" fill="none" stroke="#ff4b3e" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    handset: `<svg viewBox="0 0 34 34">${G.phone}</svg>`,
    back: `<svg viewBox="0 0 24 24"><path d="M20 7H9l-5 5 5 5h11z" fill="none" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"/><path d="M11 10l4 4M15 10l-4 4" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg>`,
    sms: `<svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="1.5" fill="#fff"/><path d="M3.5 7l8.5 6.5L20.5 7" fill="none" stroke="#c98a12" stroke-width="1.6"/></svg>`,
    keypad: `<svg viewBox="0 0 24 24" fill="currentColor">${[5, 12, 19].flatMap(y => [5, 12, 19].map(x => `<circle cx="${x}" cy="${y}" r="2.1"/>`)).join("")}</svg>`,
    log: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2" stroke-linecap="round"/></svg>`,
    person: `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="8.5" r="4"/><path d="M4 21c.6-4.5 3.8-7 8-7s7.4 2.5 8 7z"/></svg>`,
    star: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg>`,
    alarm: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="13" r="7.5"/><path d="M12 9v4h3M4 6l3-2.5M20 6l-3-2.5" stroke-linecap="round"/></svg>`,
    globe: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/></svg>`,
    watch: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="13" r="8"/><path d="M12 13V8M10 2h4" stroke-linecap="round"/></svg>`,
    timer: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 3h10M7 21h10M8 3c0 5 8 5 8 9s-8 4-8 9M16 3c0 5-8 5-8 9s8 4 8 9"/></svg>`
  };

  /* ================= 画面栈 ================= */
  const layer = \$("#phoneLayer"), body = $("#body"), screens = $("#screens");
  let stack = [], locked = true;
  function push(el) {
    const prev = stack[stack.length - 1];
    el.classList.add("enter"); screens.appendChild(el); stack.push(el);
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.remove("enter")));
    if (prev) setTimeout(() => { if (stack.includes(prev) && stack[stack.length - 1] !== prev) prev.style.visibility = "hidden"; }, 240);
    return el;
  }
  function pop() {
    if (stack.length <= 1) return;
    const el = stack.pop(), prev = stack[stack.length - 1];
    prev.style.visibility = ""; if (prev._refresh) prev._refresh();
    el.classList.add("leave"); setTimeout(() => el.remove(), 230);
    if (el._onClose) el._onClose();
  }
  function popToRoot() { while (stack.length > 1) pop(); }
  const toastEl = \$("#toast"); let toastT;
  function toast(msg) { toastEl.textContent = msg; toastEl.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => toastEl.hidden = true, 1800); }

  /* ================= 状态栏 ================= */
  const bat = \$("#bat");
  function setBat() { bat.querySelector("i").style.height = Math.max(P.battery > 0 ? 8 : 0, P.battery ?? 60) + "%"; bat.classList.toggle("low", (P.battery ?? 60) < 20); }
  setBat();
  function sbIcons() {
    const missed = badge("phone"), unread = badge("message");
    \$("#sbLeft").innerHTML = (missed ? `<svg viewBox="0 0 20 20"><path d="M3 7l6 6 8-8" fill="none" stroke="#ff4b3e" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>` : "") + (unread ? IC.sms : "");
    document.querySelectorAll("[data-badge]").forEach(b => { const n = badge(b.dataset.badge); b.textContent = n; b.hidden = !n; });
  }
  function tick() {
    \$("#sbTime").textContent = nowLabel();
    document.querySelectorAll("[data-now]").forEach(e => { const o = now(); e.innerHTML = `${hm(o)}<small class="lk-ampm">${ampm(o)}</small>`; });
  }
  setInterval(tick, 1000);

  /* ================= 横向滑动分页（主屏幕·抽屉） ================= */
  function pager(wrap, track, n, start, onChange) {
    let idx = start, sx = null, dx = 0, moved = false;
    const set = (i, anim = true) => { idx = Math.max(0, Math.min(n - 1, i)); track.style.transition = anim ? "" : "none"; track.style.transform = `translateX(${-idx * 100}%)`; onChange(idx); };
    set(start, false);
    wrap.addEventListener("pointerdown", e => { sx = e.clientX; dx = 0; moved = false; track.style.transition = "none"; });
    wrap.addEventListener("pointermove", e => { if (sx === null) return; dx = e.clientX - sx; if (Math.abs(dx) > 8) moved = true; track.style.transform = `translateX(calc(${-idx * 100}% + ${dx}px))`; });
    const up = () => { if (sx === null) return; sx = null; const w = wrap.clientWidth; set(dx < -w * .18 ? idx + 1 : dx > w * .18 ? idx - 1 : idx); };
    wrap.addEventListener("pointerup", up); wrap.addEventListener("pointercancel", up); wrap.addEventListener("pointerleave", up);
    wrap.addEventListener("click", e => { if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; } }, true);
  }
  const dots = (box, n, i) => { box.innerHTML = Array.from({ length: n }, (_, k) => `<i class="${k === i ? "on" : ""}">${k === i ? k + 1 : ""}</i>`).join(""); };
  const wallHTML = () => P.wallpaper ? `<div class="wall photo" style="background:url('${esc(P.wallpaper)}') center/cover"></div>` : `<div class="wall"></div>`;

  /* ================= 锁屏 ================= */
  function lockScreen() {
    const missed = badge("phone"), unread = badge("message");
    const el = h(`<section class="scr lock">${wallHTML()}
      <div class="lk-clock"><div class="lk-time" data-now></div><div class="lk-date">${dateLabel(TODAY)}</div></div>
      <div class="lk-noti">
        ${missed ? `<div>${IC.missed}未接来电 ${missed}个</div>` : ""}
        ${unread ? `<div>${IC.sms}新消息 ${unread}条</div>` : ""}
      </div>
      <div class="lk-pat"><p data-msg>请绘制解锁图案</p><div class="pat" data-pat><svg data-svg></svg>${[0,1,2,3,4,5,6,7,8].map(i => `<i data-d="\${i}"></i>`).join("")}</div></div>
    </section>`);
    /* 3×3 图案解锁：只要连接两个或以上点，无论什么形状都可以解锁 */
    const pat = el.querySelector("[data-pat]"), svg = el.querySelector("[data-svg]"), msg = el.querySelector("[data-msg]"), dots = [...pat.querySelectorAll("i")];
    let path = null, cur = null, done = false;
    const ctr = i => { const r = pat.getBoundingClientRect(), d = dots[i].getBoundingClientRect(); return [d.left + d.width / 2 - r.left, d.top + d.height / 2 - r.top]; };
    const draw = state => {
      const r = pat.getBoundingClientRect(); svg.setAttribute("viewBox", `0 0 ${r.width} ${r.height}`);
      const pts = (path || []).map(ctr); if (cur && pts.length && !state) pts.push(cur);
      svg.innerHTML = pts.length > 1 ? `<polyline points="${pts.map(p => p.join(",")).join(" ")}" class="${state || ""}"/>` : "";
      dots.forEach((d, i) => { d.className = path && path.includes(i) ? "on " + (state || "") : ""; });
    };
    const hit = (x, y) => { const r = pat.getBoundingClientRect(); for (let i = 0; i < 9; i++) { const [cx, cy] = ctr(i); if (Math.hypot(x - r.left - cx, y - r.top - cy) < r.width / 7.5) return i; } return -1; };
    const add = i => { if (i < 0 || path.includes(i)) return;
      const l = path[path.length - 1];   // 夹在中间的点会自动包含
      if (l !== undefined) { const m = (l + i) / 2; if ((l + i) % 2 === 0 && Math.abs((l % 3) - (i % 3)) !== 1 && Math.abs(Math.floor(l / 3) - Math.floor(i / 3)) !== 1 && !path.includes(m)) path.push(m); }
      path.push(i); if (navigator.vibrate) try { navigator.vibrate(12); } catch (e) {} };
    pat.addEventListener("pointerdown", e => { if (done) return; path = []; pat.setPointerCapture(e.pointerId); const r = pat.getBoundingClientRect(); cur = [e.clientX - r.left, e.clientY - r.top]; add(hit(e.clientX, e.clientY)); msg.textContent = "完成后请松开手指"; draw(); });
    pat.addEventListener("pointermove", e => { if (!path || done) return; const r = pat.getBoundingClientRect(); cur = [e.clientX - r.left, e.clientY - r.top]; add(hit(e.clientX, e.clientY)); draw(); });
    const up = () => { if (!path || done) return; cur = null;
      if (path.length >= 2) { done = true; msg.textContent = "图案正确"; draw("ok"); setTimeout(unlock, 350); }
      else { msg.textContent = path.length ? "请至少连接2个点。请重试。" : "请绘制解锁图案"; draw("bad"); setTimeout(() => { if (!done) { path = null; draw(); } }, 900); } };
    pat.addEventListener("pointerup", up); pat.addEventListener("pointercancel", up);
    return el;
  }
  function unlock() {
    locked = false;
    const lk = stack[0]; const home = homeScreen();
    screens.innerHTML = ""; stack = []; push(home); sbIcons(); tick();
    if (lk) lk.remove();
  }

  /* ================= 主屏幕 ================= */
  function homeScreen() {
    const page = `<div class="wg wg-clock"><div><div class="t" data-now></div><div class="d">${dateLabel(TODAY)}</div></div><div class="w">首尔<b>9°</b>晴</div></div>${["internet", "calendar", "memo", "clock", "gallery", "music"].map(id => appBtn(id)).join("")}`;
    const el = h(`<section class="scr home">${wallHTML()}
      <div class="hm-dots"></div>
      <div class="hm-pages"><div class="hm-track"><div class="hm-page">${page}</div></div></div>
      <nav class="dock">${appBtn("phone")}${appBtn("contacts")}${appBtn("message")}${appBtn("apps")}</nav>
    </section>`);
    el._refresh = sbIcons;
    return el;
  }
  function drawer() {
    const ids = ["phone", "contacts", "message", "internet", "gallery", "calendar", "clock", "memo", "music"];
    const pages = []; for (let i = 0; i < ids.length; i += 16) pages.push(ids.slice(i, i + 16));
    const el = h(`<section class="scr drawer"><div class="dr-head"></div>
      <div class="hm-pages"><div class="hm-track">${pages.map(p => `<div class="hm-page">\${p.map(id => appBtn(id)).join("")}</div>`).join("")}</div></div></section>`);
    pager(el.querySelector(".hm-pages"), el.querySelector(".hm-track"), pages.length, 0, i => dots(el.querySelector(".dr-head"), pages.length, i));
    return el;
  }

  /* ================= 打开应用 ================= */
  function openApp(id) {
    const f = {
      apps: drawer, phone: () => phoneApp("keypad"), contacts: contactsApp, message: messagesApp, memo: memoApp,
      calendar: calendarApp, clock: clockApp, music: musicApp, gallery: galleryApp, internet: internetApp
    }[id];
    if (f) { push(f()); return; }
    toast(id === "camera" ? "无法启动相机。" : "不支持的功能。");
  }
  screens.addEventListener("click", e => { const b = e.target.closest("[data-app]"); if (b && !locked) openApp(b.dataset.app); });

  /* ================= 联系人公共部分 ================= */
  const CHO = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ";
  const initial = n => { const c = n.charCodeAt(0); if (c >= 0xac00 && c <= 0xd7a3) { const i = CHO[Math.floor((c - 0xac00) / 588)]; return ({ ㄲ: "ㄱ", ㄸ: "ㄷ", ㅃ: "ㅂ", ㅆ: "ㅅ", ㅉ: "ㅈ" })[i] || i; } return /[a-z]/i.test(n[0]) ? n[0].toUpperCase() : "#"; };
  const contactBy = q => P.contacts.find(c => c.name === q || c.number === q);
  const nameOf = q => (contactBy(q) || {}).name || q;
  const numberOf = q => (contactBy(q) || {}).number || q;
  function contactRows() {
    const list = [...P.contacts].sort((a, b) => a.name.localeCompare(b.name, "zh"));
    let last = "", out = "";
    list.forEach(c => { const i = initial(c.name); if (i !== last) { out += `<div class="sec">${i}</div>`; last = i; }
      out += `<button class="row" data-contact="${esc(c.name)}" style="width:100%;text-align:left"><span class="ph">${AV}</span><span class="tx"><b>${esc(c.name)}</b><small>${esc(c.number)}</small></span></button>`; });
    return out || `<div class="empty">没有联系人。</div>`;
  }
  function contactDetail(name) {
    const c = contactBy(name) || { name, number: name };
    const el = h(`<section class="scr"><div class="tbar">${esc(c.name)}</div>
      <div class="detail"><span class="ph">${AV}</span><div><b>${esc(c.name)}</b></div></div>
      <div class="scroll list"><div class="row"><span class="tx"><small>手机</small><b>${esc(c.number)}</b></span></div></div>
      <div class="btnbar"><button class="green" data-call>通话</button><button data-sms>信息</button></div></section>`);
    el.querySelector("[data-call]").onclick = () => placeCall(c.name);
    el.querySelector("[data-sms]").onclick = () => push(convScreen(threadFor(c.name)));
    return el;
  }
  function contactsApp() {
    const el = h(`<section class="scr"><div class="tbar">联系人<small>${P.contacts.length}个</small></div><div class="scroll list">${contactRows()}</div></section>`);
    el.addEventListener("click", e => { const r = e.target.closest("[data-contact]"); if (r) push(contactDetail(r.dataset.contact)); });
    return el;
  }

  /* ================= 电话 ================= */
  const LET = { 2: "ABC", 3: "DEF", 4: "GHI", 5: "JKL", 6: "MNO", 7: "PQRS", 8: "TUV", 9: "WXYZ", 0: "+" };
  function callRows() {
    return P.calls.map((c, i) => `<button class="row" data-callrow="${i}" style="width:100%;text-align:left">${IC[c.dir] || IC.in}<span class="tx"><b style="${c.dir === "missed" ? "color:#ff6b5e" : ""}">${esc(nameOf(c.name))}${c.count > 1 ? ` (\${c.count})` : ""}</b><small>${esc(contactBy(c.name) ? numberOf(c.name) : "未保存的号码")}${c.length ? " · " + esc(c.length) : ""}</small></span><span class="rt">${esc(c.when)}</span></button>`).join("") || `<div class="empty">没有通话记录。</div>`;
  }
  function phoneApp(tab) {
    const el = h(`<section class="scr">
      <nav class="tabs"><button data-tab="keypad">${IC.keypad}拨号键盘</button><button data-tab="log">${IC.log}通话记录</button><button data-tab="contacts">${IC.person}联系人</button><button data-tab="fav">${IC.star}收藏夹</button></nav>
      <div class="dial" data-body></div></section>`);
    const bodyEl = el.querySelector("[data-body]");
    let num = "";
    const render = t => {
      el.querySelectorAll("[data-tab]").forEach(b => b.classList.toggle("on", b.dataset.tab === t));
      if (t === "keypad") {
        bodyEl.innerHTML = `<div class="dial-num" data-num></div><div class="dial-pad">${["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map(k => `<button data-k="\${k}">${k}<small>${LET[k] || (k === "1" ? "∞" : "&nbsp;")}</small></button>`).join("")}</div>
          <div class="dial-act"><button data-dsms>${IC.sms}</button><button class="call" data-dcall>${IC.handset}</button><button data-del>${IC.back}</button></div>`;
        const show = () => { const d = bodyEl.querySelector("[data-num]"); d.textContent = num || "请输入号码"; d.classList.toggle("empty", !num); };
        show();
        bodyEl.querySelectorAll("[data-k]").forEach(b => {
          let lp = null, fired = false;
          b.onpointerdown = () => { fired = false; if (b.dataset.k === "1" && !num) lp = setTimeout(() => { fired = true; placeCall("1"); }, 650); };   // 长按1：语音信箱
          b.onpointerup = b.onpointerleave = () => clearTimeout(lp);
          b.onclick = () => { if (fired) return; dtmf(b.dataset.k); if (num.length < 16) num += b.dataset.k; show(); };
        });
        bodyEl.querySelector("[data-del]").onclick = () => { num = num.slice(0, -1); show(); };
        bodyEl.querySelector("[data-dcall]").onclick = () => { if (!num) { const last = P.calls.find(c => c.dir === "out"); if (last) { num = numberOf(last.name); show(); } return; } placeCall(num); };
        bodyEl.querySelector("[data-dsms]").onclick = () => { if (num) push(convScreen(threadFor(nameOf(num)))); };
      } else if (t === "log") {
        P.calls.forEach(c => { if (c.dir === "missed") c.seen = true; }); sbIcons();
        bodyEl.innerHTML = `<div class="scroll list">${callRows()}</div>`;
        bodyEl.onclick = e => { const r = e.target.closest("[data-callrow]"); if (r) placeCall(P.calls[+r.dataset.callrow].name); };
      } else if (t === "contacts") {
        bodyEl.innerHTML = `<div class="scroll list">${contactRows()}</div>`;
        bodyEl.onclick = e => { const r = e.target.closest("[data-contact]"); if (r) push(contactDetail(r.dataset.contact)); };
      } else { bodyEl.innerHTML = `<div class="empty">没有收藏联系人。</div>`; bodyEl.onclick = null; }
      if (t === "keypad") bodyEl.onclick = null;
      el._tab = t;
    };
    el.querySelectorAll("[data-tab]").forEach(b => b.onclick = () => render(b.dataset.tab));
    el._refresh = () => { if (el._tab === "log") render("log"); };
    render(tab);
    return el;
  }
  /* 通话声音：回铃音（嘟——嘟——）和哔声 */
  let audioCtx = null;
  function ringback() {
    const ctx = audioCtx; if (!ctx) return () => {};
    try { if (ctx.state === "suspended") ctx.resume(); } catch (e) {}
    const g = ctx.createGain(); g.gain.value = 0; g.connect(ctx.destination);
    const os = [440, 480].map(f => { const o = ctx.createOscillator(); o.frequency.value = f; o.connect(g); o.start(); return o; });
    const cycle = () => { const t = ctx.currentTime; g.gain.setValueAtTime(.05, t); g.gain.setValueAtTime(0, t + 1); };
    cycle(); const iv = setInterval(cycle, 3000); let done = false;
    return () => { if (done) return; done = true; clearInterval(iv); try { os.forEach(o => o.stop()); g.disconnect(); } catch (e) {} };
  }
  function beep() {
    const ctx = audioCtx; if (!ctx) return;
    const g = ctx.createGain(), o = ctx.createOscillator(); o.frequency.value = 1000; g.gain.value = .06;
    o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + .6);
  }
  function sob(ms) {   // 抽泣声合成：吸气(哈) + 颤抖的哭泣声(呃、呜……) + 呼吸声，带有限制带宽的电话音效
    const ctx = audioCtx; if (!ctx) return;
    const out = ctx.createGain(); out.gain.value = 2.6;
    const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 320;
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 3200;
    out.connect(hp); hp.connect(lp); lp.connect(ctx.destination);
    const noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate), nd = noiseBuf.getChannelData(0);
    for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
    const R = (a, b) => a + Math.random() * (b - a);
    const breath = (t, dur, freq, vol, rise) => {   // 呼吸声 (吸气时 rise=true)
      const s = ctx.createBufferSource(); s.buffer = noiseBuf; s.loop = true;
      const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.frequency.setValueAtTime(freq, t); f.frequency.linearRampToValueAtTime(freq * (rise ? 1.5 : .8), t + dur); f.Q.value = 1.4;
      const g = ctx.createGain(); g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol, t + (rise ? dur * .8 : .04)); g.gain.linearRampToValueAtTime(0, t + dur);
      s.connect(f); f.connect(g); g.connect(out); s.start(t, Math.random()); s.stop(t + dur + .05);
    };
    const voice = (t, dur, f0a, f0b, vol) => {   // 颤抖的哭腔片段
      const o = ctx.createOscillator(); o.type = "sawtooth";
      o.frequency.setValueAtTime(f0a, t); o.frequency.exponentialRampToValueAtTime(f0b, t + dur);
      const vib = ctx.createOscillator(), vg = ctx.createGain(); vib.frequency.value = R(5, 8); vg.gain.value = R(6, 14); vib.connect(vg); vg.connect(o.frequency);
      const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .03); g.gain.setValueAtTime(vol * .8, t + dur * .6); g.gain.linearRampToValueAtTime(0, t + dur);
      [[R(600, 800), 5, 1], [R(1050, 1300), 7, .6], [2600, 9, .25]].forEach(([fr, q, amt]) => {   // 元音共振峰
        const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = fr; bp.Q.value = q;
        const fg = ctx.createGain(); fg.gain.value = amt; o.connect(bp); bp.connect(fg); fg.connect(g);
      });
      g.connect(out); breath(t, dur, 1400, vol * .5, false);
      o.start(t); vib.start(t); o.stop(t + dur + .05); vib.stop(t + dur + .05);
    };
    let t = ctx.currentTime + .15; const end = t + ms / 1000 - .3;
    while (t < end) {
      breath(t, R(.28, .45), 1800, R(.10, .16), true); t += R(.35, .5);            // 吸气
      const n = Math.floor(R(2, 5)), base = R(260, 330);
      for (let k = 0; k < n && t < end; k++) { const d = R(.14, .26); voice(t, d, base * R(1, 1.08), base * R(.82, .92), R(.10, .16) * (1 - k * .12)); t += d + R(.05, .11); }
      if (Math.random() < .45 && t < end - 1) { const d = R(.6, 1.1); voice(t, d, R(300, 360), R(190, 230), R(.08, .13)); t += d + .1; }   // 长长的呜咽
      breath(t, R(.4, .7), 900, R(.05, .08), false); t += R(.5, 1.3);              // 呼气
    }
  }
  /* 播放录音（audio文件夹中的mp3）。打开手机时预加载 */
  const sounds = {};
  function loadSound(url) {
    if (!audioCtx || sounds[url]) return;
    sounds[url] = fetch(url).then(r => r.arrayBuffer()).then(b => new Promise((res, rej) => audioCtx.decodeAudioData(b, res, rej))).catch(() => null);
  }
  function playSound(url) {
    let src = null, stopped = false;
    if (audioCtx) { loadSound(url); sounds[url].then(buf => { if (!buf || stopped) return; src = audioCtx.createBufferSource(); src.buffer = buf; src.connect(audioCtx.destination); src.start(); }); }
    return () => { stopped = true; try { src && src.stop(); } catch (e) {} };
  }
  function pickup(hard) {   // 接听电话时的“咔哒”声（分两段、较慢）。hard：急切抓起、沉重的“咚咔”声
    const ctx = audioCtx; if (!ctx) return;
    const tick = (t, vol, freq, tau, dur, thump) => {
      const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate), ch = buf.getChannelData(0);
      for (let i = 0; i < ch.length; i++) ch[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * tau));
      const s = ctx.createBufferSource(); s.buffer = buf;
      const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = freq; f.Q.value = .8;
      const g = ctx.createGain(); g.gain.value = vol; s.connect(f); f.connect(g); g.connect(ctx.destination); s.start(t);
      const o = ctx.createOscillator(), og = ctx.createGain(); o.frequency.setValueAtTime(thump, t); o.frequency.exponentialRampToValueAtTime(thump * .45, t + .2);
      og.gain.setValueAtTime(vol * .4, t); og.gain.exponentialRampToValueAtTime(.001, t + .22); o.connect(og); og.connect(ctx.destination); o.start(t); o.stop(t + .25);
    };
    const t = ctx.currentTime;
    if (hard) {   // 咚咔 — 拿起听筒时的剧烈碰撞声（声音较大，紧凑）
      tick(t, .9, 900, .03, .2, 90); tick(t + .06, 1, 1700, .022, .2, 130); tick(t + .2, .45, 2400, .012, .12, 160); return;
    }
    tick(t, .25, 1500, .012, .12, 110);          // 咔—
    tick(t + .17, .5, 2000, .016, .16, 150);     // 哒
  }
  function lineHum() {   // 通话时听筒里微弱的电流“嗡——”声（非常小）
    const ctx = audioCtx; if (!ctx) return () => {};
    const len = ctx.sampleRate * 3, buf = ctx.createBuffer(1, len, ctx.sampleRate), ch = buf.getChannelData(0);
    let last = 0; for (let i = 0; i < len; i++) { last = (last + .02 * (Math.random() * 2 - 1)) / 1.02; ch[i] = last * 3.5; }   // 低频底噪
    const s = ctx.createBufferSource(); s.buffer = buf; s.loop = true;
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 420;
    const hum = ctx.createOscillator(); hum.frequency.value = 110; const hg = ctx.createGain(); hg.gain.value = .012;
    const g = ctx.createGain(), t = ctx.currentTime; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.11, t + .6);
    s.connect(lp); lp.connect(g); hum.connect(hg); hg.connect(g); g.connect(ctx.destination); s.start(); hum.start();
    let done = false;
    return () => { if (done) return; done = true; const t2 = ctx.currentTime; g.gain.cancelScheduledValues(t2); g.gain.setValueAtTime(g.gain.value, t2); g.gain.linearRampToValueAtTime(0, t2 + .25); try { s.stop(t2 + .3); hum.stop(t2 + .3); } catch (e) {} };
  }
  /* 通话画面（Galaxy S 风格）：姓名·号码 / 保持通话·时间 / 录音·键盘·挂断·扬声器·静音·蓝牙 */
  const DTMF = { 1: [697, 1209], 2: [697, 1336], 3: [697, 1477], 4: [770, 1209], 5: [770, 1336], 6: [770, 1477], 7: [852, 1209], 8: [852, 1336], 9: [852, 1477], "*": [941, 1209], 0: [941, 1336], "#": [941, 1477] };
  function dtmf(k) {
    const ctx = audioCtx, f = DTMF[k]; if (!ctx || !f) return;
    try { if (ctx.state === "suspended") ctx.resume(); } catch (e) {}
    const t = ctx.currentTime, g = ctx.createGain(); g.gain.value = .08; g.connect(ctx.destination);
    f.forEach(hz => { const o = ctx.createOscillator(); o.frequency.value = hz; o.connect(g); o.start(t); o.stop(t + .18); });
  }
