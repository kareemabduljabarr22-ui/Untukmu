const SECRET_PIN = "2511"; // Ganti PIN 4 digit sesuai keinginan Anda
const PIN_LENGTH = 4;

const pinScreen = document.getElementById("pin-screen");
const pinDots = Array.from(document.querySelectorAll(".pin-dot"));
const pinError = document.getElementById("pin-error");
const keyButtons = Array.from(document.querySelectorAll(".key-btn[data-digit]"));
const clearPinBtn = document.getElementById("clear-pin-btn");
const backspacePinBtn = document.getElementById("backspace-pin-btn");

const giftScreen = document.getElementById("gift-screen");
const bigGift = document.getElementById("big-gift");

const greetingScreen = document.getElementById("greeting-screen");
const replayBtn = document.getElementById("replay-btn");
const bubuDuduStage = document.getElementById("bubu-dudu-stage");

const cakeToggle = document.getElementById("cake-toggle");
const flame = document.getElementById("flame");
const cakeHint = document.getElementById("cake-hint");

const birthdaySong = document.getElementById("birthday-song");

const recipientName = document.getElementById("recipient-name");
const wishText = document.getElementById("wish-text");
const nextWishBtn = document.getElementById("next-wish-btn");
const celebrateBtn = document.getElementById("celebrate-btn");

const canvas = document.getElementById("confetti-canvas");
const ctx = canvas ? canvas.getContext("2d") : null;

const recipientDisplayName = "Sayangku Aja Fitra Ayunda";

const wishes = [
  "Selamat ulang tahun ke-23, Sayangku Aja Fitra Ayunda! Semoga di umur yang semakin bertambah, bertambah juga kedewasaannya, rejekinya dan juga kebahagiaannya.",
  "Di usia yang baru ini, semoga makin dekat sama semua target dan mimpi yang lagi kamu kejar dan kamu impi impikan.",
  "Dan semoga makin di sayang mamanis, disayang aku, disayang keluarga, disayang ponakan dan semua teman kamu yang masih kamu anggap teman.",
  "Semoga kita bisa melalui semua ini bersama dan semoga dikedepannya ada kabar baik untuk kita bersama aamiin."
];

const floralAndLoveEmojis = ["🌸", "🌷", "🌹", "🌺", "💐", "💖", "💗", "💕", "❤️", "✨"];

let floatingLayer = document.querySelector(".floating-layer");
if (!floatingLayer) {
  floatingLayer = document.createElement("div");
  floatingLayer.className = "floating-layer";
  document.body.appendChild(floatingLayer);
}

let currentPin = "";
let isCheckingPin = false;
let wishIndex = 0;
let isCandleLit = true;
let isOpeningGift = false;
let confettiParticles = [];
let animationFrameId = null;

function resizeCanvas() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function launchConfetti(count = 130) {
  if (!canvas || !ctx) return;
  const colors = ["#f43f5e", "#f59e0b", "#fde047", "#c084fc", "#38bdf8", "#34d399"];

  for (let i = 0; i < count; i++) {
    confettiParticles.push({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * 140,
      w: 6 + Math.random() * 7,
      h: 4 + Math.random() * 5,
      vx: (Math.random() - 0.5) * 4.5,
      vy: 2.2 + Math.random() * 4.2,
      rotation: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.18,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: 1
    });
  }

  if (!animationFrameId) {
    renderConfetti();
  }
}

function renderConfetti() {
  if (!canvas || !ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  confettiParticles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.04;
    p.vx *= 0.992;
    p.rotation += p.vRot;

    if (p.y > canvas.height - 80) {
      p.opacity -= 0.025;
    }

    ctx.save();
    ctx.globalAlpha = Math.max(p.opacity, 0);
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    ctx.restore();
  });

  confettiParticles = confettiParticles.filter(
    (p) => p.opacity > 0 && p.y < canvas.height + 40
  );

  if (confettiParticles.length > 0) {
    animationFrameId = requestAnimationFrame(renderConfetti);
  } else {
    animationFrameId = null;
  }
}

function createMiniBearElement(type = "bubu") {
  const bear = document.createElement("div");
  bear.className = `floating-bear ${type}`;
  bear.style.setProperty("--mini-scale", (0.56 + Math.random() * 0.18).toFixed(2));
  bear.innerHTML = `
    <div class="ear ear-left"></div>
    <div class="ear ear-right"></div>
    <div class="face">
      <div class="eye eye-left"></div>
      <div class="eye eye-right"></div>
      <div class="blush blush-left"></div>
      <div class="blush blush-right"></div>
      <div class="nose"></div>
      <div class="mouth"></div>
    </div>
  `;
  return bear;
}

function spawnFloatingDecor(count = 16) {
  for (let i = 0; i < count; i++) {
    const item = document.createElement("div");
    item.className = "floating-item";

    const isMiniBear = Math.random() < 0.24;
    if (isMiniBear) {
      const bearType = Math.random() < 0.5 ? "bubu" : "dudu";
      item.appendChild(createMiniBearElement(bearType));
    } else {
      item.textContent =
        floralAndLoveEmojis[Math.floor(Math.random() * floralAndLoveEmojis.length)];
      item.style.fontSize = `${(1.15 + Math.random() * 0.95).toFixed(2)}rem`;
    }

    const leftPercent = (4 + Math.random() * 92).toFixed(1);
    const duration = (4.6 + Math.random() * 3.4).toFixed(2);
    const delay = (Math.random() * 0.85).toFixed(2);
    const drift = ((Math.random() - 0.5) * 90).toFixed(0);
    const spin = Math.random() < 0.5 ? "-1" : "1";

    item.style.left = `${leftPercent}%`;
    item.style.animationDuration = `${duration}s`;
    item.style.animationDelay = `${delay}s`;
    item.style.setProperty("--drift", `${drift}px`);
    item.style.setProperty("--spin", spin);

    floatingLayer.appendChild(item);

    const totalMs = (parseFloat(duration) + parseFloat(delay)) * 1000 + 250;
    window.setTimeout(() => {
      item.remove();
    }, totalMs);
  }
}

function switchScreen(fromScreen, toScreen) {
  if (!fromScreen || !toScreen) return;
  fromScreen.classList.remove("screen-active");
  fromScreen.classList.add("screen-hidden");

  toScreen.classList.remove("screen-hidden");
  toScreen.classList.add("screen-active");
}

function updatePinDots(isError = false) {
  pinDots.forEach((dot, idx) => {
    dot.classList.toggle("filled", idx < currentPin.length && !isError);
    dot.classList.toggle("error", isError);
  });
}

function showPinError(message) {
  if (pinError) pinError.textContent = message;
  updatePinDots(true);
  if (pinScreen) {
    pinScreen.classList.remove("shake");
    void pinScreen.offsetWidth;
    pinScreen.classList.add("shake");
  }

  window.setTimeout(() => {
    currentPin = "";
    updatePinDots(false);
    if (pinError) pinError.textContent = "";
    isCheckingPin = false;
  }, 480);
}

function checkPin() {
  isCheckingPin = true;

  if (currentPin === SECRET_PIN) {
    if (pinError) pinError.textContent = "";
    isOpeningGift = false;
    if (bigGift) bigGift.classList.remove("opening");
    window.setTimeout(() => {
      switchScreen(pinScreen, giftScreen);
      spawnFloatingDecor(12);
      isCheckingPin = false;
    }, 180);
  } else {
    showPinError("PIN salah! Coba lagi ya.");
  }
}

function pressDigit(digit) {
  if (isCheckingPin || currentPin.length >= PIN_LENGTH) return;
  if (pinError) pinError.textContent = "";
  currentPin += digit;
  updatePinDots(false);

  if (currentPin.length === PIN_LENGTH) {
    checkPin();
  }
}

function backspacePin() {
  if (isCheckingPin || currentPin.length === 0) return;
  if (pinError) pinError.textContent = "";
  currentPin = currentPin.slice(0, -1);
  updatePinDots(false);
}

function clearPin() {
  if (isCheckingPin) return;
  currentPin = "";
  if (pinError) pinError.textContent = "";
  updatePinDots(false);
}

async function playMusic() {
  if (!birthdaySong) return;
  try {
    await birthdaySong.play();
  } catch {
    // Abaikan jika browser memblokir autoplay sebelum interaksi
  }
}

function pauseMusic() {
  if (!birthdaySong) return;
  birthdaySong.pause();
}

function openBigGift() {
  if (isOpeningGift) return;
  isOpeningGift = true;

  if (bigGift) bigGift.classList.add("opening");
  launchConfetti(165);
  spawnFloatingDecor(24);

  window.setTimeout(() => {
    switchScreen(giftScreen, greetingScreen);
    setCandleState(true);
    playMusic();
  }, 460);
}

function setCandleState(lit) {
  isCandleLit = lit;
  if (flame) flame.classList.toggle("lit", lit);
  if (cakeHint) {
    cakeHint.textContent = lit
      ? "Klik kue di atas untuk meniup lilinnya!"
      : "Lilin sudah padam! Klik lagi untuk menyalakan.";
  }
}

keyButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    pressDigit(btn.dataset.digit);
  });
});

if (clearPinBtn) clearPinBtn.addEventListener("click", clearPin);
if (backspacePinBtn) backspacePinBtn.addEventListener("click", backspacePin);

document.addEventListener("keydown", (e) => {
  if (!pinScreen || !pinScreen.classList.contains("screen-active")) return;

  if (e.key >= "0" && e.key <= "9") {
    const targetBtn = keyButtons.find((b) => b.dataset.digit === e.key);
    if (targetBtn) {
      targetBtn.classList.add("pressed");
      window.setTimeout(() => targetBtn.classList.remove("pressed"), 140);
    }
    pressDigit(e.key);
  } else if (e.key === "Backspace") {
    backspacePin();
  } else if (e.key === "Escape" || e.key.toLowerCase() === "c") {
    clearPin();
  }
});

if (bigGift) {
  bigGift.addEventListener("click", openBigGift);
  bigGift.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openBigGift();
    }
  });
}

if (bubuDuduStage) {
  bubuDuduStage.addEventListener("click", () => {
    spawnFloatingDecor(18);
    launchConfetti(55);
  });
}

if (cakeToggle) {
  cakeToggle.addEventListener("click", () => {
    setCandleState(!isCandleLit);
    if (!isCandleLit) {
      launchConfetti(90);
      spawnFloatingDecor(14);
    }
  });
}

if (nextWishBtn) {
  nextWishBtn.addEventListener("click", () => {
    if (!wishes.length || !wishText) return;
    wishIndex = (wishIndex + 1) % wishes.length;
    wishText.style.opacity = "0";
    window.setTimeout(() => {
      wishText.textContent = wishes[wishIndex];
      wishText.style.opacity = "1";
    }, 180);
  });
}

if (celebrateBtn) {
  celebrateBtn.addEventListener("click", () => {
    launchConfetti(140);
    spawnFloatingDecor(20);
  });
}

if (replayBtn) {
  replayBtn.addEventListener("click", () => {
    currentPin = "";
    isCheckingPin = false;
    isOpeningGift = false;
    if (bigGift) bigGift.classList.remove("opening");
    updatePinDots(false);
    if (pinError) pinError.textContent = "";
    pauseMusic();
    if (birthdaySong) {
      birthdaySong.currentTime = 0;
    }
    switchScreen(greetingScreen, pinScreen);
  });
}

if (recipientName) {
  recipientName.textContent = `Selamat Ulang Tahun Ke-23, ${recipientDisplayName}!`;
}
if (wishText && wishes.length > 0) {
  wishText.textContent = wishes[0];
}
