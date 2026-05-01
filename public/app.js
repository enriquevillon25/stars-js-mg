const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const msg = document.getElementById("msg");
const resetButton = document.getElementById("resetButton");

let stars = [];
let selected = [];
let backgroundStars = [];
let completedConstellation = null;

const shootingStarMessage = "Desde ese día solo he podido pensar en tus ojos.";

const constellations = [
  {
    id: "heart",
    pattern: [1, 2, 3, 4, 5, 6, 7, 8, 1],
    lineColor: "#ffc1dd",
    glowColor: "#ff8fc5",
    messages: [
      "Nos conocimos el 19 de abril del 2019.",
      "Desde ese día solo he podido pensar en tus ojos.",
      "Estamos juntos más de 6 años, y tal vez solo es el principio.",
      "Quiero seguir toda mi vida contigo.",
      "Esforzarme por ti, cada día más; eres mi única motivación.",
      "Ahora nos toca vivir juntos al otro lado del mundo, ¿quieres?",
      "Extraño tu voz diciendo mi nombre cada 20 segundos.",
      "Recorremos todo ese lado del Pacífico y Atlántico juntos.",
      "TE AMO ❤️ NOS VEMOS EN AUSTRALIA (18 <= 29)"
    ],
    animate: heartRain
  },
  {
    id: "shooting-star",
    pattern: [9, 1, 2, 3, 4, 5, 6, 7, 10, 12, 11, 8, 9],
    lineColor: "#ffe6a8",
    glowColor: "#ffd166",
    message: shootingStarMessage,
    revealMessageAt: 2,
    animate: shootingStarWish
  }
];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  createBackgroundStars();
  createStars();
}

function createBackgroundStars() {
  backgroundStars = Array.from({ length: 150 }, (_value, index) => ({
    x: (index * 97) % window.innerWidth,
    y: (index * 53) % window.innerHeight,
    radius: index % 9 === 0 ? 1.35 : 0.75,
    phase: index * 0.47,
    speed: 0.0012 + (index % 5) * 0.00022
  }));
}

function createStars() {
  document.querySelectorAll(".star").forEach((star) => star.remove());

  const width = window.innerWidth;
  const height = window.innerHeight;

  const centerX = width / 2;
  const centerY = height / 2 + Math.min(48, height * 0.06);
  const size = Math.min(width, height) * 0.27;

  stars = [
    { id: 1, x: centerX - size * 0.9, y: centerY - size * 0.1 },
    { id: 2, x: centerX - size * 0.9, y: centerY - size * 0.75 },
    { id: 3, x: centerX - size * 0.35, y: centerY - size * 1.05 },
    { id: 4, x: centerX, y: centerY - size * 0.65 },
    { id: 5, x: centerX + size * 0.35, y: centerY - size * 1.05 },
    { id: 6, x: centerX + size * 0.9, y: centerY - size * 0.75 },
    { id: 7, x: centerX + size * 0.9, y: centerY - size * 0.1 },
    { id: 8, x: centerX, y: centerY + size * 0.85 },
    { id: 9, x: centerX - size * 1.25, y: centerY + size * 0.65 },
    { id: 10, x: centerX + size * 1.25, y: centerY + size * 0.55 },
    { id: 11, x: centerX - size * 0.2, y: centerY + size * 1.25 },
    { id: 12, x: centerX + size * 0.55, y: centerY + size * 1.2 }
  ];

  stars.forEach((star) => {
    const element = document.createElement("button");
    element.className = "star";
    element.textContent = star.id;
    element.setAttribute("aria-label", `Estrella ${star.id}`);
    element.style.left = `${star.x}px`;
    element.style.top = `${star.y}px`;
    element.style.setProperty("--pulse-delay", `${star.id * -0.27}s`);
    element.type = "button";
    element.addEventListener("click", () => selectStar(star.id, element));
    document.body.appendChild(element);
  });
}

function selectStar(id, element) {
  selected.push(id);
  element.classList.add("active");

  const possibleConstellations = getPossibleConstellations();

  if (possibleConstellations.length === 0) {
    msg.innerText = "Hay noches que saben guardar secretos, sigue intentando.";
    setTimeout(resetGame, 900);
    return;
  }

  const solvedConstellation = possibleConstellations.find(
    (constellation) => selected.length === constellation.pattern.length
  );

  if (solvedConstellation) {
    completedConstellation = solvedConstellation;
    document.body.classList.add("complete", `${solvedConstellation.id}-complete`);
    msg.innerText = getConstellationMessage(solvedConstellation);
    solvedConstellation.animate();
  } else {
    msg.innerText = getConstellationMessage(possibleConstellations[0]);
  }
}

function getConstellationMessage(constellation) {
  if (constellation.messages) {
    return constellation.messages[selected.length - 1];
  }

  if (selected.includes(constellation.revealMessageAt)) {
    return constellation.message;
  }

  return "Encuentra la constelación.";
}

function getPossibleConstellations() {
  return constellations.filter((constellation) =>
    selected.every((starId, index) => constellation.pattern[index] === starId)
  );
}

function draw(time = 0) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  backgroundStars.forEach((star) => {
    const glow = 0.24 + Math.sin(time * star.speed + star.phase) * 0.18;
    ctx.fillStyle = `rgba(255, 244, 224, ${glow})`;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fill();
  });

  if (selected.length > 1) {
    ctx.beginPath();

    selected.forEach((id, index) => {
      const star = stars.find((starItem) => starItem.id === id);
      if (index === 0) {
        ctx.moveTo(star.x, star.y);
      } else {
        ctx.lineTo(star.x, star.y);
      }
    });

    const activeConstellation = completedConstellation || getPossibleConstellations()[0] || constellations[0];

    ctx.strokeStyle = activeConstellation.lineColor;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.shadowBlur = 20;
    ctx.shadowColor = activeConstellation.glowColor;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  requestAnimationFrame(draw);
}

function resetGame() {
  selected = [];
  completedConstellation = null;
  document.body.classList.remove("complete", "heart-complete", "shooting-star-complete");
  msg.innerText = "Encuentra la constelación.";
  document.querySelectorAll(".star").forEach((star) => star.classList.remove("active"));
}

function heartRain() {
  for (let i = 0; i < 28; i += 1) {
    setTimeout(() => {
      const heart = document.createElement("div");
      heart.className = "falling-heart";
      heart.textContent = i % 3 === 0 ? "♡" : "❤️";
      heart.style.left = `${Math.random() * 100}vw`;
      heart.style.fontSize = `${18 + Math.random() * 14}px`;
      document.body.appendChild(heart);

      setTimeout(() => {
        heart.style.opacity = "0.9";
        heart.style.top = "110vh";
        heart.style.transform = `translateX(${Math.random() * 80 - 40}px) rotate(360deg)`;
      }, 50);

      setTimeout(() => heart.remove(), 4200);
    }, i * 95);
  }
}

function shootingStarWish() {
  for (let i = 0; i < 18; i += 1) {
    setTimeout(() => {
      const streak = document.createElement("div");
      streak.className = "shooting-wish";
      streak.style.left = `${-20 - Math.random() * 20}vw`;
      streak.style.top = `${18 + Math.random() * 52}vh`;
      streak.style.animationDuration = `${1.7 + Math.random() * 0.9}s`;
      document.body.appendChild(streak);

      setTimeout(() => streak.remove(), 2900);
    }, i * 130);
  }
}

resetButton.addEventListener("click", resetGame);
window.addEventListener("resize", resize);
resize();
requestAnimationFrame(draw);
