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
// METEOR
// ===================================================
function spawnMeteor() {
  let c = document.getElementById("meteor-container");
  if (!c) {
    c = document.createElement("div");
    c.id = "meteor-container";
    document.body.appendChild(c);
  }
  const m = document.createElement("div");
  m.className = "meteor";
  const w = 80 + Math.random() * 200;
  m.style.width = w + "px";
  m.style.top  = (Math.random() * 60) + "%";
  m.style.left = (30 + Math.random() * 70) + "%";
  const dur = 1.5 + Math.random() * 3;
  m.style.animationDuration = dur + "s";
  m.style.animationDelay   = Math.random() * 2 + "s";
  m.style.opacity = 0;
  c.appendChild(m);
  setTimeout(() => m.remove(), (dur + 2.5) * 1000);
}
for (let i = 0; i < 3; i++) setTimeout(spawnMeteor, i * 1500);
setInterval(spawnMeteor, 3000);

// ===================================================
// HERO NEBULA ORBLARI
// ===================================================
function spawnOrbs() {
  const c = document.getElementById("bubbles-container");
  if (!c) return;
  const configs = [
    { w:300, h:300, l:"5%",  t:"20%", bg:"rgba(100,50,220,0.18)", dur:8  },
    { w:250, h:250, l:"60%", t:"10%", bg:"rgba(200,80,160,0.14)", dur:10 },
    { w:350, h:300, l:"30%", t:"55%", bg:"rgba(60,80,200,0.12)",  dur:7  },
    { w:200, h:200, l:"80%", t:"60%", bg:"rgba(120,40,180,0.15)", dur:9  },
  ];
  configs.forEach((cfg, i) => {
    const b = document.createElement("div");
    b.className = "space-orb";
    b.style.width  = cfg.w + "px";
    b.style.height = cfg.h + "px";
    b.style.left   = cfg.l;
    b.style.top    = cfg.t;
    b.style.background = `radial-gradient(circle, ${cfg.bg} 0%, transparent 70%)`;
    b.style.filter = "blur(60px)";
    b.style.animationDuration = cfg.dur + "s";
    b.style.animationDelay = (i * 1.5) + "s";
    c.appendChild(b);
  });
}
spawnOrbs();

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
// GALERİ — STORY CARDS
// ===================================================

// Her fotoğrafa romantik yazı eşle
const quotes = [
  "Seninle her an çok güzel. ♥",
  "Güldüğünde dünya duruyor. 🌸",
  "Bu kare hiç silinmesin. ✨",
  "En sevdiğim anım. 💛",
  "Seninle zaman uçuyor. 🌙",
  "Kültür her geçtiğimde gülümsüzyorum. 🌸",
  "Benim dünyalar güzeli. ♥",
  "Bu anı ömrüm boyunca taşıyacağım. 📸",
  "Seninle olmak her şeyi kolaylaytırıyor. 💫",
  "28 Ağustos'tan beri hep böyle. ♥",
  "Yanımda olduğunda her şey yerli yerine oturuyor. 🌟",
  "En güzel fotoğraflarım seninle. 📸",
  "Bak bana hiç böyle baktın mı? 😊",
  "Bu anı üniversiteye anlatırım. 🎉",
  "Seninle her yer güzel. 🌸",
  "Fotoğraf makinesi seni sevdiğim gibi sever. ♥",
  "Bu gülüş... her şey bu gülüşte zaten. ✨",
  "Kalpte kalan anlardan. 💛",
  "Hiç bitmeseydi. 🌙",
  "Seninle yazılan en güzel sayfa. ♥",
  "Her baktığımda yeniden gülümsüyorum. 🌟",
  "Bu kadar mutlu olunur muymuş? 🎉",
  "Anlar bu kadar güzel olabilir. ✨",
  "Seninle, her zaman. ♥",
];

const slider = document.getElementById("story-slider");
if (slider) {
  photos.forEach((ph, idx) => {
    const card = document.createElement("div");
    card.className = "story-card";
    card.innerHTML = `
      <div class="story-bg">
        <div class="story-stars"></div>
      </div>
      <div class="story-inner">
        <div class="story-photo-frame">
          <img src="${ph.src}" alt="Anı ${idx+1}" loading="lazy"
            onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"/>
          <div class="img-ph" style="display:none"><span>📷</span>Fotoğraf ${idx+1}</div>
        </div>
        <div class="story-text">
          <p>${quotes[idx % quotes.length]}</p>
        </div>
      </div>
    `;
    card.addEventListener("click", () => openLb(idx));
    slider.appendChild(card);
  });
}

// Slider ok tuşları
const SCROLL_AMT = 300;
document.getElementById("story-prev")?.addEventListener("click", () => {
  slider?.scrollBy({ left: -SCROLL_AMT, behavior: "smooth" });
});
document.getElementById("story-next")?.addEventListener("click", () => {
  slider?.scrollBy({ left: SCROLL_AMT, behavior: "smooth" });
});

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
// İNTERAKTİF YILDIZ ALANI (Canvas + Mouse)
// ===================================================
(function() {
  const canvas = document.createElement("canvas");
  canvas.id = "starfield";
  canvas.style.cssText = "position:fixed;inset:0;z-index:0;pointer-events:none;";
  document.body.prepend(canvas);

  const ctx = canvas.getContext("2d");
  let W, H;
  let mouseX = 0.5, mouseY = 0.5; // normalized 0-1
  let mouseSpeed = 0; // 0 = idle
  let prevMX = 0, prevMY = 0;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  // Mouse takip
  document.addEventListener("mousemove", (e) => {
    const nx = e.clientX / W;
    const ny = e.clientY / H;
    const dx = nx - prevMX;
    const dy = ny - prevMY;
    mouseSpeed = Math.min(Math.sqrt(dx*dx + dy*dy) * 30, 1);
    mouseX = nx;
    mouseY = ny;
    prevMX = nx;
    prevMY = ny;
  });

  // Touch destegi
  document.addEventListener("touchmove", (e) => {
    if (!e.touches[0]) return;
    const nx = e.touches[0].clientX / W;
    const ny = e.touches[0].clientY / H;
    const dx = nx - prevMX;
    const dy = ny - prevMY;
    mouseSpeed = Math.min(Math.sqrt(dx*dx + dy*dy) * 30, 1);
    mouseX = nx;
    mouseY = ny;
    prevMX = nx;
    prevMY = ny;
  });

  // Yıldızlar olustur
  const STAR_COUNT = 350;
  const stars = [];
  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: Math.random() * 2 - 0.5,   // -0.5 to 1.5 (parallax icin genis)
      y: Math.random() * 2 - 0.5,
      z: Math.random(),              // depth: 0=uzak, 1=yakin
      size: 0.4 + Math.random() * 1.8,
      baseAlpha: 0.3 + Math.random() * 0.7,
      twinkleSpeed: 1 + Math.random() * 3,
      twinkleOffset: Math.random() * Math.PI * 2,
      hue: Math.random() > 0.7 ? (200 + Math.random() * 60) : (40 + Math.random() * 20), // mavi veya sari
      sat: 10 + Math.random() * 40,
    });
  }

  let time = 0;
  let smoothSpeed = 0;

  function render() {
    time += 0.016;
    // Speed azalt
    smoothSpeed += (mouseSpeed - smoothSpeed) * 0.08;
    mouseSpeed *= 0.95;

    ctx.clearRect(0, 0, W, H);

    // Parallax offset (mouse pozisyonuna göre)
    const offsetX = (mouseX - 0.5) * 2; // -1 to 1
    const offsetY = (mouseY - 0.5) * 2;

    for (let i = 0; i < STAR_COUNT; i++) {
      const s = stars[i];

      // Parallax: yakn yldz daha cok hareket eder
      const parallaxFactor = 0.3 + s.z * 0.7;
      const px = (s.x - offsetX * parallaxFactor * 0.08) * W;
      const py = (s.y - offsetY * parallaxFactor * 0.08) * H;

      // Ekran dısındaysa atla
      if (px < -20 || px > W+20 || py < -20 || py > H+20) continue;

      // Twinkle + mouse speed etkisi
      const twinkle = Math.sin(time * s.twinkleSpeed + s.twinkleOffset);
      const speedBoost = 1 + smoothSpeed * 3 * s.z;
      const alpha = s.baseAlpha * (0.5 + twinkle * 0.5) * speedBoost;
      const size = s.size * (1 + smoothSpeed * 1.5 * s.z);

      // Renk
      ctx.beginPath();
      ctx.arc(px, py, Math.max(size * 0.5, 0.3), 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${s.hue}, ${s.sat}%, 90%, ${Math.min(alpha, 1)})`;
      ctx.fill();

      // Glow (yakn yldz icin)
      if (s.z > 0.6 && alpha > 0.5) {
        ctx.beginPath();
        ctx.arc(px, py, size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${s.hue}, ${s.sat}%, 85%, ${alpha * 0.08})`;
        ctx.fill();
      }
    }

    // Meteor çizimi (canvas üzerinde)
    if (Math.random() < 0.003 + smoothSpeed * 0.01) {
      drawMeteor();
    }

    requestAnimationFrame(render);
  }

  // Meteor efekti
  const meteors = [];
  function drawMeteor() {
    meteors.push({
      x: W * (0.3 + Math.random() * 0.7),
      y: Math.random() * H * 0.4,
      vx: -(4 + Math.random() * 6 + smoothSpeed * 8),
      vy: 3 + Math.random() * 4 + smoothSpeed * 6,
      life: 1,
      len: 40 + Math.random() * 80,
    });
  }

  // Override render to include meteors
  const _origRender = render;
  function renderWithMeteors() {
    time += 0.016;
    smoothSpeed += (mouseSpeed - smoothSpeed) * 0.08;
    mouseSpeed *= 0.95;

    ctx.clearRect(0, 0, W, H);

    const offsetX = (mouseX - 0.5) * 2;
    const offsetY = (mouseY - 0.5) * 2;

    // Yıldızlar
    for (let i = 0; i < STAR_COUNT; i++) {
      const s = stars[i];
      const parallaxFactor = 0.3 + s.z * 0.7;
      const px = (s.x - offsetX * parallaxFactor * 0.08) * W;
      const py = (s.y - offsetY * parallaxFactor * 0.08) * H;
      if (px < -20 || px > W+20 || py < -20 || py > H+20) continue;

      const twinkle = Math.sin(time * s.twinkleSpeed + s.twinkleOffset);
      const speedBoost = 1 + smoothSpeed * 3 * s.z;
      const alpha = s.baseAlpha * (0.5 + twinkle * 0.5) * speedBoost;
      const size = s.size * (1 + smoothSpeed * 1.5 * s.z);

      ctx.beginPath();
      ctx.arc(px, py, Math.max(size * 0.5, 0.3), 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${s.hue}, ${s.sat}%, 90%, ${Math.min(alpha, 1)})`;
      ctx.fill();

      if (s.z > 0.6 && alpha > 0.5) {
        ctx.beginPath();
        ctx.arc(px, py, size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${s.hue}, ${s.sat}%, 85%, ${alpha * 0.08})`;
        ctx.fill();
      }
    }

    // Meteorlar
    if (Math.random() < 0.004 + smoothSpeed * 0.02) {
      meteors.push({
        x: W * (0.3 + Math.random() * 0.7),
        y: Math.random() * H * 0.4,
        vx: -(5 + Math.random() * 6 + smoothSpeed * 10),
        vy: 3 + Math.random() * 4 + smoothSpeed * 7,
        life: 1,
        len: 40 + Math.random() * 100,
      });
    }

    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i];
      m.x += m.vx;
      m.y += m.vy;
      m.life -= 0.015;
      if (m.life <= 0) { meteors.splice(i, 1); continue; }

      const angle = Math.atan2(m.vy, m.vx);
      const tailX = m.x - Math.cos(angle) * m.len;
      const tailY = m.y - Math.sin(angle) * m.len;

      const grad = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
      grad.addColorStop(0, `rgba(255,255,255,0)`);
      grad.addColorStop(0.7, `rgba(200,220,255,${m.life * 0.6})`);
      grad.addColorStop(1, `rgba(255,255,255,${m.life * 0.9})`);

      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(m.x, m.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Parlak uç
      ctx.beginPath();
      ctx.arc(m.x, m.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${m.life * 0.8})`;
      ctx.fill();
    }

    requestAnimationFrame(renderWithMeteors);
  }

  requestAnimationFrame(renderWithMeteors);
})();
