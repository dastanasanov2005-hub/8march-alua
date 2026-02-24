/* =====================================================
   Утилиты
===================================================== */
function showPage(id) {
  document.querySelectorAll(".page").forEach(p => {
    p.classList.remove("active");
  });

  const target = document.getElementById(id);
  if (target) target.classList.add("active");
}

function onClick(id, handler) {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener("click", handler);
}

/* =====================================================
   Музыка
===================================================== */
const bgMusic     = document.getElementById("bgMusic");
const musicBtnBig = document.getElementById("musicBtnBig");
const toPage2Btn  = document.getElementById("toPage2");

let musicOn = false;

async function startMusic() {
  if (musicOn) return;

  try {
    bgMusic.volume = 0.25;
    await bgMusic.play();
    musicOn = true;

    musicBtnBig.textContent = "🎵 Выключить музыку";
    toPage2Btn.classList.remove("hidden");
  } catch {
    alert("Музыка не включилась. Проверь файл: assets/music.mp3");
  }
}

function stopMusic() {
  bgMusic.pause();
  musicOn = false;
  musicBtnBig.textContent = "🎵 Включить музыку";
}

if (musicBtnBig) {
  musicBtnBig.addEventListener("click", () => {
    musicOn ? stopMusic() : startMusic();
  });
}

/* =====================================================
   Typewriter (page2)
===================================================== */
const typeEl = document.getElementById("typeText");

const aboutText = `Меня зовут ________.
Я хотел сказать тебе кое-что важное…

(сюда вставишь свой текст — он будет печататься как в кино)`;

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

/* =====================================================
   Переходы между страницами
===================================================== */

// Page1 → Page2
onClick("toPage2", () => {
  showPage("page2");
  startTypewriter();
});

// Page2 → Page4
onClick("toPage4", () => {
  showPage("page4");
});

// Page4 → Page5 + нежный эффект
onClick("toPage5", () => {
  showPage("page5");

  const p5 = document.getElementById("page5");
  if (p5) {
    p5.classList.remove("p5-enter"); // сброс
    void p5.offsetWidth;             // reflow
    p5.classList.add("p5-enter");    // запуск анимации
  }
});

/* =====================================================
   Page5 → Подстраницы
===================================================== */
onClick("cardWords",    () => showPage("page6"));
onClick("cardMemories", () => showPage("page7"));
onClick("cardThanks",   () => showPage("page8"));
onClick("cardVideo",    () => showPage("page9"));

/* =====================================================
   Назад на Page5
===================================================== */
onClick("backTo5a", () => showPage("page5"));
onClick("backTo5b", () => showPage("page5"));
onClick("backTo5c", () => showPage("page5"));
onClick("backTo5d", () => showPage("page5"));