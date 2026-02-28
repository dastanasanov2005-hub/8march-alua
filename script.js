document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  function showPage(id) {
    document.querySelectorAll(".page").forEach(p => {
      p.classList.remove("active", "p5-enter", "mem-enter");
    });

    const target = document.getElementById(id);
    if (!target) return;

    target.classList.add("active");

    if (id === "page5") requestAnimationFrame(() => target.classList.add("p5-enter"));
    if (id === "page7") requestAnimationFrame(() => target.classList.add("mem-enter"));
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
    if (!bgMusic || musicOn) return true;

    try {
      bgMusic.volume = 0.25;
      await bgMusic.play();
      musicOn = true;

      if (musicBtnBig) musicBtnBig.textContent = "🎵 Әнді өшіру";
      if (toPage2Btn) toPage2Btn.classList.remove("hidden");
      return true;
    } catch (e) {
      alert("Музыка қосылмады. assets/music.m4a файлын тексер.");
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
  const aboutText = "Саған айтқым келетіні — менің өмірімдегі ең дұрыс шешім — сені сүю болды.";
  let typingStarted = false;

  function startTypewriter() {
    if (!typeEl || typingStarted) return;
    typingStarted = true;

    typeEl.textContent = "";
    let i = 0;
    const speed = 120;

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

  /* ===== Lightbox ===== */
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
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });

  /* ===== Video pauses music ===== */
  const videoEl = document.querySelector(".p6-video");

  if (videoEl) {
    videoEl.addEventListener("play", () => {
      if (bgMusic && !bgMusic.paused) bgMusic.pause();
    });

    const resume = async () => {
      if (bgMusic && musicOn) {
        try { await bgMusic.play(); } catch (e) {}
      }
    };

    videoEl.addEventListener("pause", resume);
    videoEl.addEventListener("ended", resume);
  }

  /* ===== Page4 tilt gyro (popup жоқ нұсқа) ===== */
(() => {
  const card = document.querySelector("#page4 .photo-card");
  const zone = document.querySelector("#page4 .p4-polaroid-float");
  if (!card || !zone) return;

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  let tx = 0, ty = 0;
  let cx = 0, cy = 0;
  let anim = null;

  const render = () => {
    cx += (tx - cx) * 0.12;
    cy += (ty - cy) * 0.12;

    card.style.setProperty("--rx", `${cx.toFixed(2)}deg`);
    card.style.setProperty("--ry", `${cy.toFixed(2)}deg`);
    card.style.setProperty("--tz", `-6px`);

    anim = requestAnimationFrame(render);
  };

  const start = () => {
    if (anim) return;
    anim = requestAnimationFrame(render);
  };

  const stop = () => {
    if (!anim) return;
    cancelAnimationFrame(anim);
    anim = null;
    tx = ty = cx = cy = 0;
  };

  /* Desktop hover эффекті ғана қалады */
  if (window.matchMedia("(hover:hover)").matches) {
    card.addEventListener("mouseenter", start);
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      ty = clamp((x - 0.5) * 12, -10, 10);
      tx = clamp((0.5 - y) * 10, -8, 8);
    });
    card.addEventListener("mouseleave", stop);
  }

  /* 📵 iPhone гироскоп толық өшірілді */
})();
});
