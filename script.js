/* =========================================================
   script.js — Tüm interaktif özellikler
   28 Ağustos 2025 — Birlikte geçen zamanı sayıyoruz
========================================================= */

// ===================================================
// 1. ŞARKILAR LİSTESİ
// ===================================================
// Şarkılarını songs/ klasörüne koy ve buraya ekle:
const songs = [
  // { title: "Şarkı Adı", artist: "Senin için 🎸", src: "songs/sarki1.mp3", duration: "3:24" },
  // { title: "Şarkı 2", artist: "Senin için 🎸", src: "songs/sarki2.mp3", duration: "2:58" },

  // Şimdilik örnek veriler (mp3 yokken göstermek için):
  { title: "Şarkı 1", artist: "Senin için 🎸", src: "songs/sarki1.mp3", duration: "--:--" },
  { title: "Şarkı 2", artist: "Senin için 🎸", src: "songs/sarki2.mp3", duration: "--:--" },
  { title: "Şarkı 3", artist: "Senin için 🎸", src: "songs/sarki3.mp3", duration: "--:--" },
];

// ===================================================
// 2. GALERİ RESİMLERİ — Açıklamalar
// ===================================================
const photosCaptions = [
  "İlk anımız ✨",
  "Seninle 🌹",
  "Güzel günler 🌸",
  "Her yerde sen 💫",
  "En sevdiğim an 🎶",
  "Birlikte 🌙",
];

// ===================================================
// 3. SAYAÇ — 28 Ağustos 2025
// ===================================================
const START_DATE = new Date("2025-08-28T00:00:00");

function updateCounter() {
  const now = new Date();
  const diff = now - START_DATE;
  if (diff < 0) return;

  const totalSecs = Math.floor(diff / 1000);
  const days  = Math.floor(totalSecs / 86400);
  const hours = Math.floor((totalSecs % 86400) / 3600);
  const mins  = Math.floor((totalSecs % 3600) / 60);
  const secs  = totalSecs % 60;

  const el = (id) => document.getElementById(id);
  if (el("cnt-days"))  animateNum(el("cnt-days"),  days);
  if (el("cnt-hours")) animateNum(el("cnt-hours"), hours);
  if (el("cnt-mins"))  animateNum(el("cnt-mins"),  mins);
  if (el("cnt-secs"))  el("cnt-secs").textContent = String(secs).padStart(2, "0");
}

function animateNum(el, target) {
  const current = parseInt(el.textContent.replace(/,/g, "")) || 0;
  if (current === target) return;
  el.textContent = target.toLocaleString("tr-TR");
}

setInterval(updateCounter, 1000);
updateCounter();

// ===================================================
// 4. KALBİ PARTİKÜLLERİ
// ===================================================
const PARTICLE_EMOJIS = ["❤️", "🌹", "✨", "💕", "🎵", "🌸", "💫"];

function spawnParticle() {
  const container = document.getElementById("particles-container");
  if (!container) return;

  const p = document.createElement("div");
  p.className = "particle";
  p.textContent = PARTICLE_EMOJIS[Math.floor(Math.random() * PARTICLE_EMOJIS.length)];
  p.style.left = Math.random() * 100 + "vw";
  p.style.fontSize = (0.8 + Math.random() * 1.2) + "rem";
  const dur = 6 + Math.random() * 8;
  p.style.animationDuration = dur + "s";
  p.style.animationDelay = Math.random() * 2 + "s";
  container.appendChild(p);

  setTimeout(() => p.remove(), (dur + 2) * 1000);
}

setInterval(spawnParticle, 600);
// İlk birkaç tane hemen gelsin
for (let i = 0; i < 8; i++) setTimeout(spawnParticle, i * 200);

// ===================================================
// 5. NAVBAR
// ===================================================
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar?.classList.toggle("scrolled", window.scrollY > 50);
});

const hamburger = document.getElementById("hamburger");
const navLinks  = document.querySelector(".nav-links");
hamburger?.addEventListener("click", () => {
  navLinks?.classList.toggle("open");
});
// Menü linkine tıklayınca kapat
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => navLinks?.classList.remove("open"));
});

// ===================================================
// 6. SCROLL REVEAL
// ===================================================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

// ===================================================
// 7. MÜZİK OYNATICI
// ===================================================
let currentTrack = 0;
let isPlaying = false;

const audio       = document.getElementById("audio-player");
const playBtn     = document.getElementById("play-btn");
const prevBtn     = document.getElementById("prev-btn");
const nextBtn     = document.getElementById("next-btn");
const trackTitle  = document.getElementById("track-title");
const trackArtist = document.getElementById("track-artist");
const progressBar = document.getElementById("progress-bar");
const progressDot = document.getElementById("progress-dot");
const progressContainer = document.getElementById("progress-container");
const currentTimeEl = document.getElementById("current-time");
const durationEl    = document.getElementById("duration");
const volumeSlider  = document.getElementById("volume-slider");
const albumArt      = document.getElementById("album-art");
const playlistUl    = document.getElementById("playlist-ul");

function formatTime(sec) {
  if (isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function buildPlaylist() {
  if (!playlistUl) return;
  playlistUl.innerHTML = "";
  songs.forEach((song, idx) => {
    const li = document.createElement("li");
    li.className = "playlist-item" + (idx === currentTrack ? " active" : "");
    li.innerHTML = `
      <span class="pl-num">${idx + 1}</span>
      <span class="pl-name">${song.title}</span>
      <span class="pl-dur">${song.duration}</span>
    `;
    li.addEventListener("click", () => loadTrack(idx, true));
    playlistUl.appendChild(li);
  });
}

function loadTrack(idx, autoPlay = false) {
  if (!songs.length) return;
  currentTrack = idx;
  const song = songs[idx];

  if (trackTitle)  trackTitle.textContent  = song.title;
  if (trackArtist) trackArtist.textContent = song.artist;
  if (audio) {
    audio.src = song.src;
    audio.volume = volumeSlider ? parseFloat(volumeSlider.value) : 0.8;
    if (autoPlay) {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      setPlaying(false);
    }
  }

  // Playlist highlight
  document.querySelectorAll(".playlist-item").forEach((li, i) => {
    li.classList.toggle("active", i === idx);
  });
}

function setPlaying(state) {
  isPlaying = state;
  if (playBtn) playBtn.textContent = state ? "⏸" : "▶";
  if (albumArt) {
    if (state) albumArt.classList.add("spinning");
    else albumArt.classList.remove("spinning");
  }
}

playBtn?.addEventListener("click", () => {
  if (!audio) return;
  if (isPlaying) {
    audio.pause();
    setPlaying(false);
  } else {
    audio.play().then(() => setPlaying(true)).catch(() => {
      // Ses dosyası yoksa sessizce devam et
    });
  }
});

prevBtn?.addEventListener("click", () => {
  const idx = (currentTrack - 1 + songs.length) % songs.length;
  loadTrack(idx, isPlaying);
});

nextBtn?.addEventListener("click", () => {
  const idx = (currentTrack + 1) % songs.length;
  loadTrack(idx, isPlaying);
});

audio?.addEventListener("timeupdate", () => {
  if (!audio.duration) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  if (progressBar) progressBar.style.width = pct + "%";
  if (progressDot) progressDot.style.left  = pct + "%";
  if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
});

audio?.addEventListener("loadedmetadata", () => {
  if (durationEl) durationEl.textContent = formatTime(audio.duration);
});

audio?.addEventListener("ended", () => {
  const idx = (currentTrack + 1) % songs.length;
  loadTrack(idx, true);
});

progressContainer?.addEventListener("click", (e) => {
  if (!audio || !audio.duration) return;
  const rect = progressContainer.getBoundingClientRect();
  const pct = (e.clientX - rect.left) / rect.width;
  audio.currentTime = pct * audio.duration;
});

volumeSlider?.addEventListener("input", () => {
  if (audio) audio.volume = parseFloat(volumeSlider.value);
});

buildPlaylist();
loadTrack(0, false);

// ===================================================
// 8. GALERİ LİGHTBOX
// ===================================================
const lightbox  = document.getElementById("lightbox");
const lbImg     = document.getElementById("lb-img");
const lbCaption = document.getElementById("lb-caption");
const lbOverlay = document.getElementById("lb-overlay");
const lbClose   = document.getElementById("lb-close");
const lbPrev    = document.getElementById("lb-prev");
const lbNext    = document.getElementById("lb-next");

const galleryCards = document.querySelectorAll(".gallery-card");
let currentPhoto = 0;

function openLightbox(idx) {
  const card = galleryCards[idx];
  if (!card) return;
  const img  = card.querySelector("img");
  const cap  = card.querySelector(".gallery-caption");

  if (lbImg) {
    lbImg.src = img ? img.src : "";
    lbImg.alt = img ? img.alt : "";
  }
  if (lbCaption) lbCaption.textContent = cap ? cap.textContent : "";
  currentPhoto = idx;
  lightbox?.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox?.classList.remove("open");
  document.body.style.overflow = "";
}

galleryCards.forEach((card, idx) => {
  card.addEventListener("click", () => openLightbox(idx));
});

lbOverlay?.addEventListener("click", closeLightbox);
lbClose?.addEventListener("click", closeLightbox);

lbPrev?.addEventListener("click", (e) => {
  e.stopPropagation();
  openLightbox((currentPhoto - 1 + galleryCards.length) % galleryCards.length);
});
lbNext?.addEventListener("click", (e) => {
  e.stopPropagation();
  openLightbox((currentPhoto + 1) % galleryCards.length);
});

document.addEventListener("keydown", (e) => {
  if (!lightbox?.classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft")  lbPrev?.click();
  if (e.key === "ArrowRight") lbNext?.click();
});

// ===================================================
// 9. QR KOD OLUŞTURMA
// ===================================================
const qrUrlInput   = document.getElementById("qr-url-input");
const qrGenBtn     = document.getElementById("qr-generate-btn");
const qrCanvas     = document.getElementById("qr-code-canvas");
const qrActions    = document.getElementById("qr-actions");
const qrDownload   = document.getElementById("qr-download-png");

let lastQrUrl = "";

function generateQR(url) {
  if (!url || !qrCanvas) return;
  qrCanvas.innerHTML = "";

  QRCode.toCanvas(
    document.createElement("canvas"),
    url,
    {
      width: 260,
      margin: 2,
      color: { dark: "#0d0812", light: "#ffffff" },
      errorCorrectionLevel: "H",
    },
    (err, canvas) => {
      if (err) { console.error(err); return; }
      qrCanvas.appendChild(canvas);
      if (qrActions) qrActions.style.display = "flex";
      qrActions.style.flexDirection = "column";
      qrActions.style.alignItems = "center";
      qrActions.style.gap = "0.8rem";
      lastQrUrl = url;
    }
  );
}

qrGenBtn?.addEventListener("click", () => {
  const url = qrUrlInput?.value.trim();
  if (!url) { alert("Lütfen bir web sitesi adresi gir!"); return; }
  generateQR(url);
});

qrUrlInput?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") qrGenBtn?.click();
});

// PNG İndir
qrDownload?.addEventListener("click", () => {
  if (!lastQrUrl) return;

  // Yüksek çözünürlüklü canvas
  const tempCanvas = document.createElement("canvas");
  QRCode.toCanvas(
    tempCanvas,
    lastQrUrl,
    {
      width: 600,
      margin: 3,
      color: { dark: "#0d0812", light: "#ffffff" },
      errorCorrectionLevel: "H",
    },
    (err, canvas) => {
      if (err) { console.error(err); return; }

      // Kalp logosu ekle
      const ctx = canvas.getContext("2d");
      ctx.font = "bold 48px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.fillRect(canvas.width/2 - 32, canvas.height/2 - 32, 64, 64);
      ctx.fillStyle = "#e8547a";
      ctx.fillText("❤", canvas.width/2, canvas.height/2);

      const link = document.createElement("a");
      link.download = "qr-kod-sevgilim.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  );
});

// ===================================================
// 10. DOĞUM GÜNÜ KUTLAMA ANİMASYONU
// ===================================================
function launchFirework(container) {
  const fw = document.createElement("div");
  const emojis = ["🎆", "🎇", "✨", "🎉", "🌟", "💥", "🎊"];
  fw.textContent = emojis[Math.floor(Math.random() * emojis.length)];
  fw.style.cssText = `
    position: absolute;
    left: ${Math.random() * 100}%;
    top: ${Math.random() * 100}%;
    font-size: ${1.5 + Math.random() * 2}rem;
    animation: fw-pop 1.5s ease-out forwards;
    pointer-events: none;
  `;
  container.appendChild(fw);
  setTimeout(() => fw.remove(), 1500);
}

// Doğum günü bölümü görününce havai fişek
const bdaySection = document.getElementById("birthday");
const bdayFw      = document.getElementById("bday-fw");
if (bdaySection && bdayFw) {
  // CSS animasyonu ekle
  const style = document.createElement("style");
  style.textContent = `
    @keyframes fw-pop {
      0%   { transform: scale(0) translateY(0); opacity: 1; }
      60%  { transform: scale(1.4) translateY(-30px); opacity: 1; }
      100% { transform: scale(0.8) translateY(-60px); opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  const bdayObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        let count = 0;
        const interval = setInterval(() => {
          launchFirework(bdayFw);
          if (++count > 20) clearInterval(interval);
        }, 200);
      }
    });
  }, { threshold: 0.4 });

  bdayObserver.observe(bdaySection);
}

// ===================================================
// 11. SMOOTH NAV ACTIVE STATE
// ===================================================
const sections = document.querySelectorAll("section[id]");
const navAnchors = document.querySelectorAll(".nav-links a");

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => {
        a.style.color = a.getAttribute("href") === "#" + entry.target.id
          ? "var(--accent-cream)"
          : "";
      });
    }
  });
}, { threshold: 0.3 });

sections.forEach(s => sectionObserver.observe(s));

// ===================================================
// 12. YÜKLENİŞ ANİMASYONU
// ===================================================
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});
