function showPage(id) {
  document.querySelectorAll(".page").forEach(p => {
    p.classList.remove("active");
    // кіру анимация кластарын “reset”
    p.classList.remove("p5-enter", "mem-enter");
  });

  const target = document.getElementById(id);
  if (!target) return;

  target.classList.add("active");

  // page5 эффект
  if (id === "page5") {
    requestAnimationFrame(() => target.classList.add("p5-enter"));
  }

  // page7 эффект
  if (id === "page7") {
    requestAnimationFrame(() => target.classList.add("mem-enter"));
  }
}

function onClick(id, handler) {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener("click", handler);
}

/* ===== Музыка ===== */
const bgMusic = document.getElementById("bgMusic");
const musicBtnBig = document.getElementById("musicBtnBig");
const toPage2Btn = document.getElementById("toPage2");

let musicOn = false;

async function startMusic() {
  if (!bgMusic) return false;
  if (musicOn) return true;

  try {
    bgMusic.volume = 0.25;
    await bgMusic.play();
    musicOn = true;
    if (musicBtnBig) musicBtnBig.textContent = "🎵 Әнді өшіру";
    if (toPage2Btn) toPage2Btn.classList.remove("hidden");
    return true;
  } catch (e) {
    alert("Музыка не включилась. Проверь файл: assets/music.mp3");
    return false;
  }
}

function stopMusic() {
  if (!bgMusic) return;
  bgMusic.pause();
  musicOn = false;
  if (musicBtnBig) musicBtnBig.textContent = "🎵 Әнді қосу";
}

if (musicBtnBig) {
  musicBtnBig.addEventListener("click", async () => {
    if (!musicOn) await startMusic();
    else stopMusic();
  });
}

/* ===== Печать текста (page2) ===== */
const typeEl = document.getElementById("typeText");
const aboutText =
`Саған айтқым келетіні — менің өмірімдегі ең дұрыс шешім — сені сүю болды.`;

let typingStarted = false;

function startTypewriter() {
  if (!typeEl || typingStarted) return;
  typingStarted = true;

  typeEl.textContent = "";
  let i = 0;
  const speed = 35;

  const timer = setInterval(() => {
    typeEl.textContent += aboutText[i] ?? "";
    i++;
    if (i >= aboutText.length) clearInterval(timer);
  }, speed);
}

/* ===== Переходы ===== */
onClick("toPage2", () => { showPage("page2"); startTypewriter(); });
onClick("toPage4", () => showPage("page4"));
onClick("toPage5", () => showPage("page5"));

/* ===== Page5 -> отдельные страницы ===== */
onClick("cardWords",    () => showPage("page6"));
onClick("cardMemories", () => showPage("page7"));
onClick("cardThanks",   () => showPage("page8"));
onClick("cardVideo",    () => showPage("page9"));

/* назад на page5 */
onClick("backTo5a", () => showPage("page5"));
onClick("backTo5b", () => showPage("page5"));
onClick("backTo5c", () => showPage("page5"));
onClick("backTo5d", () => showPage("page5"));

/* ===== Галерея (page7) lightbox ===== */
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxClose = document.getElementById("lightboxClose");

function openLightbox(src) {
  if (!lightbox || !lightboxImg) return;
  lightboxImg.src = src;
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
}

function closeLightbox() {
  if (!lightbox || !lightboxImg) return;
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImg.src = "";
}

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".mem-card");
  if (btn && btn.dataset.full) openLightbox(btn.dataset.full);
});

if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);

if (lightbox) {
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox(); // клик по фону
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});

const videoEl = document.querySelector(".p6-video");

if (videoEl) {
  videoEl.addEventListener("play", () => {
    if (bgMusic && !bgMusic.paused) {
      bgMusic.pause();
    }
  });

  videoEl.addEventListener("pause", () => {
    if (bgMusic && musicOn) {
      bgMusic.play();
    }
  });

  videoEl.addEventListener("ended", () => {
    if (bgMusic && musicOn) {
      bgMusic.play();
    }
  });
}