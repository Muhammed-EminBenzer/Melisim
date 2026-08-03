/* =========================================================
   script.js — Melis'e Özel Site
   28 Ağustos 2025'ten bu yana...
========================================================= */

// ===== ŞARKILAR =====
const songs = [
  { title: "Şarkı 1", sub: "Senin için", src: "songs/sarki1.mp3", dur: "--:--" },
  { title: "Şarkı 2", sub: "Senin için", src: "songs/sarki2.mp3", dur: "--:--" },
];

// ===== FOTOĞRAFLAR (24 adet) =====
const photos = [];
const photoOrder = [7,13,3,19,1,22,10,5,16,2,14,8,20,4,17,11,23,6,15,9,21,12,18,24];
photoOrder.forEach((n) => {
  photos.push({ src: `photos/foto${n}.jpeg`, cap: "" });
});

// ===================================================
// GERÇEK 3D UZAY & MOUSE HAREKETİ (CANVAS 3D STARFIELD)
// ===================================================
(function init3DSpace() {
  const canvas = document.getElementById("starfield");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const numStars = 800;
  const stars = [];
  const fov = 300; // 3D alan derinliği (Field of view)

  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;
  let baseSpeed = 2;
  let currentSpeed = baseSpeed;

  // 3D Yıldız Nesneleri
  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: (Math.random() - 0.5) * width * 2,
      y: (Math.random() - 0.5) * height * 2,
      z: Math.random() * fov,
      size: Math.random() * 1.5 + 0.5,
      color: Math.random() > 0.3 ? "#ffffff" : (Math.random() > 0.5 ? "#b8a9d9" : "#f0c060")
    });
  }

  // Mouse Hareketi & Hızlanma Hesabı
  let lastMouseTime = Date.now();
  document.addEventListener("mousemove", (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    targetMouseX = (e.clientX - cx) * 0.002;
    targetMouseY = (e.clientY - cy) * 0.002;

    // Fare hareket ettikçe uzayda hızlanma etkisi
    currentSpeed = baseSpeed + 4;
    lastMouseTime = Date.now();
  });

  function updateAndDraw() {
    // Fare durduğunda hızı normale düşür
    if (Date.now() - lastMouseTime > 100) {
      currentSpeed += (baseSpeed - currentSpeed) * 0.05;
    }

    // Yumuşak yön değişimi
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    ctx.fillStyle = "rgba(2, 0, 8, 0.4)"; // İz bırakarak uçuş efekti
    ctx.fillRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;

    for (let i = 0; i < numStars; i++) {
      const star = stars[i];

      // Z ekseninde ileri uçuş (bize doğru geliyor)
      star.z -= currentSpeed;

      // Mouse yönüne göre uzayda kayma (3D Dönme/Açı)
      star.x -= mouseX * star.z * 0.1;
      star.y -= mouseY * star.z * 0.1;

      // Ekrandan çıkınca arkaya (derinliğe) tekrar gönder
      if (star.z <= 0) {
        star.z = fov;
        star.x = (Math.random() - 0.5) * width * 2;
        star.y = (Math.random() - 0.5) * height * 2;
      }

      // 3D Perspektif İzdüşümü (Perspective Projection)
      const k = fov / star.z;
      const px = star.x * k + cx;
      const py = star.y * k + cy;

      if (px >= 0 && px <= width && py >= 0 && py <= height) {
        const size = Math.max(0.1, (1 - star.z / fov) * star.size * 2.5);
        const alpha = Math.min(1, (1 - star.z / fov) * 1.2);

        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = alpha;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }
    }

    requestAnimationFrame(updateAndDraw);
  }

  updateAndDraw();
})();

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
// NAVBAR & HAMBURGER
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
  if (playBtn) playBtn.textContent = v ? "pause" : "play";
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
// GALERİ — STORY SLIDER
// ===================================================
const quotes = [
  "Seninle her an çok güzel.",
  "Güldüğünde dünya duruyor.",
  "Bu kare hiç silinmesin.",
  "En sevdiğim anım.",
  "Seninle zaman uçuyor.",
  "Kültürden her geçtiğimde gülümsüyorum.",
  "Benim dünyalar güzeli sevgilim.",
  "Bu anı ömrüm boyunca taşıyacağım.",
  "Seninle olmak her şeyi kolaylaştırıyor.",
  "28 Ağustos'tan beri hep böyle.",
  "Yanımda olduğunda her şey yerli yerine oturuyor.",
  "En güzel fotoğraflarım seninle.",
  "Bak bana hiç böyle baktın mı?",
  "Bu anı üniversiteye anlatırım.",
  "Seninle her yer güzel.",
  "Fotoğraf makinesi seni sevdiğim gibi sever.",
  "Bu gülüş... her şey bu gülüşte zaten.",
  "Kalpte kalan anlardan.",
  "Hiç bitmeseydi.",
  "Seninle yazılan en güzel sayfa.",
  "Her baktığımda yeniden gülümsüyorum.",
  "Bu kadar mutlu olunur muymuş?",
  "Anlar bu kadar güzel olabilir.",
  "Seninle, her zaman."
];

const slider = document.getElementById("story-slider");
if (slider) {
  photos.forEach((ph, idx) => {
    const card = document.createElement("div");
    card.className = "story-card";
    card.innerHTML = `
      <div class="story-inner">
        <div class="story-photo-frame">
          <img src="${ph.src}" alt="Anı ${idx+1}" loading="lazy"
            onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"/>
          <div class="img-ph" style="display:none">Fotoğraf ${idx+1}</div>
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

// Slider okları
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
