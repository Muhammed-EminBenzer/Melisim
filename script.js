/* =========================================================
   script.js — Melis'e Özel Site
   28 Ağustos 2025'ten bu yana...
========================================================= */

// ===== ŞARKILAR =====
const songs = [
  { title: "Şarkı 1", sub: "Senin için 🎸", src: "songs/sarki1.mp3", dur: "--:--" },
  { title: "Şarkı 2", sub: "Senin için 🎸", src: "songs/sarki2.mp3", dur: "--:--" },
];

// ===== FOTOĞRAFLAR (24 adet, karışık) =====
const photos = [];
// foto1.jpeg ~ foto24.jpeg — karışık sıraya koy
const photoOrder = [7,13,3,19,1,22,10,5,16,2,14,8,20,4,17,11,23,6,15,9,21,12,18,24];
photoOrder.forEach((n, i) => {
  photos.push({ src: `photos/foto${n}.jpeg`, cap: "" });
});

// ===================================================
// KONFET İ
// ===================================================
const COLORS = ["#ff6b9d","#ffd166","#c77dff","#ff9a5c","#06d6a0","#ff8fb1"];
function spawnConf() {
  const c = document.getElementById("confetti-container");
  if (!c) return;
  const el = document.createElement("div");
  el.className = "conf";
  el.style.left = Math.random() * 100 + "vw";
  el.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
  el.style.width  = (6 + Math.random() * 8) + "px";
  el.style.height = (6 + Math.random() * 8) + "px";
  el.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
  const dur = 5 + Math.random() * 8;
  el.style.animationDuration = dur + "s";
  el.style.animationDelay = Math.random() * 3 + "s";
  c.appendChild(el);
  setTimeout(() => el.remove(), (dur + 3) * 1000);
}
for (let i = 0; i < 6; i++) setTimeout(spawnConf, i * 300);
setInterval(spawnConf, 800);

// ===================================================
// HERO BALONCUKLAR
// ===================================================
function spawnBubbles() {
  const c = document.getElementById("bubbles-container");
  if (!c) return;
  for (let i = 0; i < 5; i++) {
    const b = document.createElement("div");
    b.className = "bubble";
    const size = 80 + Math.random() * 200;
    b.style.width  = size + "px";
    b.style.height = size + "px";
    b.style.left   = Math.random() * 100 + "%";
    b.style.top    = Math.random() * 100 + "%";
    b.style.animationDuration = (4 + Math.random() * 6) + "s";
    b.style.animationDelay    = Math.random() * 4 + "s";
    b.style.opacity = 0.3 + Math.random() * 0.3;
    c.appendChild(b);
  }
}
spawnBubbles();

// ===================================================
// SAYAÇ — 28 Ağustos 2025
// ===================================================
const START = new Date("2025-08-28T00:00:00");
function tick() {
  const diff = Date.now() - START;
  if (diff < 0) return;
  const s = Math.floor(diff / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = String(v).padStart(2, "0"); };
  set("cnt-days",  d);
  set("cnt-hours", h);
  set("cnt-mins",  m);
  set("cnt-secs",  sec);
}
tick(); setInterval(tick, 1000);

// ===================================================
// NAVBAR
// ===================================================
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => navbar?.classList.toggle("scrolled", scrollY > 50));
document.getElementById("hamburger")?.addEventListener("click", () => {
  document.querySelector(".nav-links")?.classList.toggle("open");
});
document.querySelectorAll(".nav-links a").forEach(a => {
  a.addEventListener("click", () => document.querySelector(".nav-links")?.classList.remove("open"));
});

// ===================================================
// SCROLL REVEAL
// ===================================================
const ro = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); ro.unobserve(e.target); } });
}, { threshold: 0.1 });
document.querySelectorAll(".reveal").forEach(el => ro.observe(el));

// ===================================================
// MÜZİK OYNATICI
// ===================================================
let curTrack = 0, playing = false;
const audio    = document.getElementById("audio");
const disc     = document.getElementById("player-disc");
const tTitle   = document.getElementById("track-title");
const tSub     = document.getElementById("track-sub");
const pFill    = document.getElementById("progress-fill");
const pThumb   = document.getElementById("progress-thumb");
const pTrack   = document.getElementById("progress-track");
const curT     = document.getElementById("cur-time");
const durT     = document.getElementById("dur-time");
const volSlider= document.getElementById("vol");
const playBtn  = document.getElementById("btn-play");
const plUl     = document.getElementById("playlist-ul");

const fmt = s => isNaN(s) ? "0:00" : `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,"0")}`;

function buildPlaylist() {
  if (!plUl) return;
  plUl.innerHTML = "";
  songs.forEach((s, i) => {
    const li = document.createElement("li");
    li.className = "pl-item" + (i === curTrack ? " active" : "");
    li.innerHTML = `<span class="pl-n">${i+1}</span><span class="pl-name">${s.title}</span><span class="pl-dur">${s.dur}</span>`;
    li.addEventListener("click", () => load(i, true));
    plUl.appendChild(li);
  });
}

function load(idx, autoPlay = false) {
  curTrack = idx;
  const s = songs[idx];
  if (tTitle) tTitle.textContent = s.title;
  if (tSub) tSub.textContent = s.sub;
  if (audio) {
    audio.src = s.src;
    audio.volume = volSlider ? parseFloat(volSlider.value) : 0.8;
    if (autoPlay) audio.play().then(() => setPlay(true)).catch(() => {});
    else setPlay(false);
  }
  document.querySelectorAll(".pl-item").forEach((li, i) => li.classList.toggle("active", i === idx));
}

function setPlay(v) {
  playing = v;
  if (playBtn) playBtn.textContent = v ? "⏸" : "▶";
  disc?.classList.toggle("spinning", v);
}

playBtn?.addEventListener("click", () => {
  if (!audio) return;
  if (playing) { audio.pause(); setPlay(false); }
  else audio.play().then(() => setPlay(true)).catch(() => {});
});
document.getElementById("btn-prev")?.addEventListener("click", () => load((curTrack - 1 + songs.length) % songs.length, playing));
document.getElementById("btn-next")?.addEventListener("click", () => load((curTrack + 1) % songs.length, playing));

audio?.addEventListener("timeupdate", () => {
  if (!audio.duration) return;
  const p = (audio.currentTime / audio.duration) * 100;
  if (pFill) pFill.style.width = p + "%";
  if (pThumb) pThumb.style.left = p + "%";
  if (curT) curT.textContent = fmt(audio.currentTime);
});
audio?.addEventListener("loadedmetadata", () => { if (durT) durT.textContent = fmt(audio.duration); });
audio?.addEventListener("ended", () => load((curTrack + 1) % songs.length, true));
pTrack?.addEventListener("click", e => {
  if (!audio?.duration) return;
  const r = pTrack.getBoundingClientRect();
  audio.currentTime = ((e.clientX - r.left) / r.width) * audio.duration;
});
volSlider?.addEventListener("input", () => { if (audio) audio.volume = parseFloat(volSlider.value); });

buildPlaylist();
load(0, false);

// ===================================================
// GALERİ
// ===================================================
const grid = document.getElementById("gallery-grid");
if (grid) {
  photos.forEach((ph, idx) => {
    const card = document.createElement("div");
    card.className = "gallery-card";
    card.innerHTML = `
      <img src="${ph.src}" alt="Anı ${idx+1}" loading="lazy"
        onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'"/>
      <div class="img-placeholder" style="display:none"><span>📷</span>Fotoğraf ${idx+1}</div>
      <div class="gallery-hover-overlay">🔍</div>
    `;
    card.addEventListener("click", () => openLb(idx));
    grid.appendChild(card);
  });
}

// Lightbox
const lb       = document.getElementById("lightbox");
const lbImg    = document.getElementById("lb-img");
const lbCap    = document.getElementById("lb-cap");
let lbCur = 0;

function openLb(idx) {
  lbCur = idx;
  const ph = photos[idx];
  if (lbImg) { lbImg.src = ph.src; lbImg.alt = ph.cap || `Anı ${idx+1}`; }
  if (lbCap) lbCap.textContent = ph.cap || "";
  lb?.classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeLb() { lb?.classList.remove("open"); document.body.style.overflow = ""; }

document.getElementById("lb-backdrop")?.addEventListener("click", closeLb);
document.getElementById("lb-x")?.addEventListener("click", closeLb);
document.getElementById("lb-prev")?.addEventListener("click", e => { e.stopPropagation(); openLb((lbCur - 1 + photos.length) % photos.length); });
document.getElementById("lb-next")?.addEventListener("click", e => { e.stopPropagation(); openLb((lbCur + 1) % photos.length); });
document.addEventListener("keydown", e => {
  if (!lb?.classList.contains("open")) return;
  if (e.key === "Escape") closeLb();
  if (e.key === "ArrowLeft")  document.getElementById("lb-prev")?.click();
  if (e.key === "ArrowRight") document.getElementById("lb-next")?.click();
});

// ===================================================
// QR KOD — Otomatik Oluştur
// ===================================================
const QR_URL = "https://muhammed-eminbenzer.github.io/Melisim/";
const qrWrap = document.getElementById("qr-canvas-wrap");

if (qrWrap && typeof QRCode !== "undefined") {
  QRCode.toCanvas(
    document.createElement("canvas"),
    QR_URL,
    { width: 240, margin: 2, color: { dark: "#1a0a2e", light: "#ffffff" }, errorCorrectionLevel: "H" },
    (err, canvas) => {
      if (!err) qrWrap.appendChild(canvas);
    }
  );
}

// PNG İndir
document.getElementById("qr-dl-btn")?.addEventListener("click", () => {
  if (typeof QRCode === "undefined") return;
  const tmp = document.createElement("canvas");
  QRCode.toCanvas(
    tmp, QR_URL,
    { width: 800, margin: 3, color: { dark: "#1a0a2e", light: "#ffffff" }, errorCorrectionLevel: "H" },
    (err, canvas) => {
      if (err) return;
      const link = document.createElement("a");
      link.download = "melis-qr-kod.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  );
});
