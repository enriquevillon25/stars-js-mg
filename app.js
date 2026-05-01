const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const msg = document.getElementById("msg");
const resetButton = document.getElementById("resetButton");

let stars = [];
let selected = [];

const pattern = [1, 2, 3, 4, 5, 6, 7, 8, 1];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  createStars();
  draw();
}

function createStars() {
  document.querySelectorAll(".star").forEach((star) => star.remove());

  const width = window.innerWidth;
  const height = window.innerHeight;

  const centerX = width / 2;
  const centerY = height / 2 + 30;
  const size = Math.min(width, height) * 0.28;

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
    element.style.left = `${star.x}px`;
    element.style.top = `${star.y}px`;
    element.type = "button";
    element.addEventListener("click", () => selectStar(star.id, element));
    document.body.appendChild(element);
  });
}

function selectStar(id, element) {
  selected.push(id);
  element.classList.add("active");

  draw();

  const current = selected[selected.length - 1];
  const expected = pattern[selected.length - 1];

  if (current !== expected) {
    msg.innerText = "El universo aun no esta alineado... intenta otra vez ✨";
    setTimeout(resetGame, 900);
    return;
  }

  if (selected.length === pattern.length) {
    msg.innerText = "Lo lograste... esta constelacion somos tu y yo ❤️";
    heartRain();
  } else {
    msg.innerText = "Vas bien... sigue uniendo las estrellas ✨";
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
  for (let i = 0; i < 130; i += 1) {
    const x = (i * 97) % canvas.width;
    const y = (i * 53) % canvas.height;
    ctx.fillRect(x, y, 1.3, 1.3);
  }

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

    ctx.strokeStyle = "#ff7ad9";
    ctx.lineWidth = 4;
    ctx.shadowBlur = 18;
    ctx.shadowColor = "#ff7ad9";
    ctx.stroke();
    ctx.shadowBlur = 0;
  }
}

function resetGame() {
  selected = [];
  msg.innerText = "Pista: empieza por la estrella 1 ✨";
  document.querySelectorAll(".star").forEach((star) => star.classList.remove("active"));
  draw();
}

function heartRain() {
  for (let i = 0; i < 35; i += 1) {
    setTimeout(() => {
      const heart = document.createElement("div");
      heart.textContent = "❤️";
      heart.style.position = "fixed";
      heart.style.left = `${Math.random() * 100}vw`;
      heart.style.top = "-30px";
      heart.style.fontSize = "24px";
      heart.style.zIndex = "20";
      heart.style.transition = "3s linear";
      document.body.appendChild(heart);

      setTimeout(() => {
        heart.style.top = "110vh";
        heart.style.transform = "rotate(360deg)";
        heart.style.opacity = "0";
      }, 50);

      setTimeout(() => heart.remove(), 3100);
    }, i * 70);
  }
}

resetButton.addEventListener("click", resetGame);
window.addEventListener("resize", resize);
resize();
