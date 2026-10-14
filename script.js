/* =========================================================
   KONFIGURASI — ubah di sini
   ========================================================= */
const CONFIG = {
  password: "240825",      // PIN masuk (6 digit)
  welcomeSeconds: 10       // durasi layar welcome
};

const $ = (id) => document.getElementById(id);
const gate = $("password-gate"), welcome = $("welcome-screen"), site = $("website");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- 1. Password ---------- */
$("password-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = $("site-password"), fb = $("gate-feedback");
  if (input.value.trim() === CONFIG.password) {
    fb.textContent = "";
    startWelcome();
  } else {
    fb.textContent = "Belum tepat. Coba ingat lagi ya ♡";
    gate.querySelector(".gate-card").classList.remove("shake");
    void gate.offsetWidth;
    gate.querySelector(".gate-card").classList.add("shake");
    input.value = ""; input.focus();
  }
});

/* ---------- 2. Welcome 10 detik ---------- */
function startWelcome() {
  gate.classList.add("leaving");
  setTimeout(() => { gate.hidden = true; }, 800);
  welcome.hidden = false;
  let n = CONFIG.welcomeSeconds;
  const el = $("welcome-countdown");
  el.textContent = n;
  const timer = setInterval(() => {
    n--; el.textContent = Math.max(n, 0);
    if (n <= 0) { clearInterval(timer); openSite(); }
  }, 1000);
}

function openSite() {
  welcome.classList.add("leaving");
  site.hidden = false;
  document.body.classList.remove("locked");
  window.scrollTo(0, 0);
  setTimeout(() => { welcome.hidden = true; }, 1000);
  initReveal();
  if (!reduceMotion) setInterval(spawnHeart, 1600);
}

/* ---------- Reveal saat scroll ---------- */
function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) { items.forEach(i => i.classList.add("in")); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: .15 });
  items.forEach(i => io.observe(i));
}

/* ---------- Hati melayang ---------- */
function spawnHeart() {
  const h = document.createElement("span");
  h.className = "float-heart";
  h.textContent = Math.random() > .5 ? "♡" : "♥";
  h.style.left = Math.random() * 100 + "vw";
  h.style.fontSize = 12 + Math.random() * 18 + "px";
  h.style.setProperty("--drift", (Math.random() * 80 - 40) + "px");
  h.style.animationDuration = 7 + Math.random() * 6 + "s";
  $("floating-hearts").appendChild(h);
  h.addEventListener("animationend", () => h.remove());
}

/* ---------- Musik ---------- */
const audio = $("background-music"), playBtn = $("anthem-play"),
      toggle = $("music-toggle"), label = $("music-label"),
      fill = $("track-progress-fill"), record = $("record-art"), err = $("audio-error");

function syncMusicUI() {
  const playing = !audio.paused;
  playBtn.textContent = playing ? "❚❚" : "▶";
  playBtn.setAttribute("aria-label", playing ? "Jeda Karolina" : "Putar Karolina");
  toggle.setAttribute("aria-pressed", String(playing));
  label.textContent = playing ? "Jeda musik" : "Putar musik";
  record.classList.toggle("spinning", playing);
}
function toggleMusic() {
  if (audio.paused) {
    audio.play().then(() => { err.textContent = ""; }).catch(() => {
      err.textContent = "Lagu belum bisa diputar. Pastikan file assets/lagu.mp3 ada.";
    });
  } else audio.pause();
}
playBtn.addEventListener("click", toggleMusic);
toggle.addEventListener("click", toggleMusic);
["play", "pause"].forEach(ev => audio.addEventListener(ev, syncMusicUI));
audio.addEventListener("timeupdate", () => {
  if (audio.duration) fill.style.width = (audio.currentTime / audio.duration * 100) + "%";
});
audio.addEventListener("error", () => { err.textContent = "File lagu tidak ditemukan di assets/lagu.mp3."; }, true);

$("begin-button").addEventListener("click", () => {
  $("anthem").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
});

/* ---------- Surat ---------- */
const envBtn = $("envelope-button");
envBtn.addEventListener("click", () => {
  if (envBtn.classList.contains("open")) return;
  envBtn.classList.add("open");
  envBtn.setAttribute("aria-expanded", "true");
  $("tap-hint").textContent = "semoga kamu suka ♡";
  setTimeout(() => {
    const letter = $("letter-content");
    letter.hidden = false;
    letter.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
  }, 900);
  burst(60);
});

/* ---------- Foto kenangan: sembunyikan jika file belum ada ---------- */
document.querySelectorAll(".memory-photo img").forEach(img => {
  const hide = () => { img.style.display = "none"; };
  img.addEventListener("error", hide);
  if (img.complete && img.naturalWidth === 0) hide();
});

/* ---------- Pertanyaan ---------- */
$("yes-button").addEventListener("click", () => {
  $("answer-response").textContent = "Terima kasih sudah bilang iya. Aku juga memilihmu, setiap hari ♡";
  burst(220);
});
$("also-button").addEventListener("click", () => {
  $("answer-response").textContent = "Apa pun itu, aku dengerin. Bilang langsung ke aku ya ♡";
});

/* ---------- Confetti ---------- */
const canvas = $("confetti-canvas"), ctx = canvas.getContext("2d");
let parts = [], running = false;
const colors = ["#b3182f", "#f08a9b", "#e9c27a", "#fdeee8", "#c9253d"];
function resize() { canvas.width = innerWidth; canvas.height = innerHeight; }
addEventListener("resize", resize); resize();

function burst(n) {
  if (reduceMotion) return;
  for (let i = 0; i < n; i++) {
    parts.push({
      x: innerWidth / 2 + (Math.random() - .5) * 200, y: innerHeight * .6,
      vx: (Math.random() - .5) * 14, vy: -Math.random() * 15 - 4,
      s: 5 + Math.random() * 7, r: Math.random() * 6, vr: (Math.random() - .5) * .4,
      c: colors[(Math.random() * colors.length) | 0], heart: Math.random() > .6, life: 1
    });
  }
  if (!running) { running = true; requestAnimationFrame(tick); }
}
function tick() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  parts.forEach(p => {
    p.vy += .28; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.vx *= .99; p.life -= .006;
    ctx.save(); ctx.globalAlpha = Math.max(p.life, 0); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c;
    if (p.heart) { ctx.font = p.s * 2 + "px serif"; ctx.fillText("♥", -p.s, p.s); }
    else ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * .6);
    ctx.restore();
  });
  parts = parts.filter(p => p.life > 0 && p.y < canvas.height + 40);
  if (parts.length) requestAnimationFrame(tick);
  else { running = false; ctx.clearRect(0, 0, canvas.width, canvas.height); }
}
