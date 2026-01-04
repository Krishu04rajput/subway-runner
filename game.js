const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let lanes = [
  canvas.width / 2 - 120,
  canvas.width / 2,
  canvas.width / 2 + 120
];

let player = {
  lane: 1,
  x: lanes[1],
  y: canvas.height - 150,
  width: 50,
  height: 80,
  jump: false,
  yVel: 0
};

let obstacles = [];
let speed = 6;
let gravity = 0.6;
let score = 0;

function spawnObstacle() {
  obstacles.push({
    lane: Math.floor(Math.random() * 3),
    y: -100,
    width: 50,
    height: 80
  });
}

setInterval(spawnObstacle, 1500);

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Player physics
  if (player.jump) {
    player.yVel -= gravity;
    player.y -= player.yVel;
    if (player.y >= canvas.height - 150) {
      player.y = canvas.height - 150;
      player.jump = false;
      player.yVel = 0;
    }
  }

  player.x = lanes[player.lane];

  // Draw player
  ctx.fillStyle = "cyan";
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Obstacles
  ctx.fillStyle = "red";
  for (let i = obstacles.length - 1; i >= 0; i--) {
    let o = obstacles[i];
    o.y += speed;
    let ox = lanes[o.lane];

    ctx.fillRect(ox, o.y, o.width, o.height);

    // Collision
    if (
      ox < player.x + player.width &&
      ox + o.width > player.x &&
      o.y < player.y + player.height &&
      o.y + o.height > player.y
    ) {
      alert("Game Over! Score: " + score);
      location.reload();
    }

    if (o.y > canvas.height) {
      obstacles.splice(i, 1);
      score++;
    }
  }

  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.fillText("Score: " + score, 20, 40);

  requestAnimationFrame(update);
}

document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft" && player.lane > 0) player.lane--;
  if (e.key === "ArrowRight" && player.lane < 2) player.lane++;
  if (e.key === "ArrowUp" && !player.jump) {
    player.jump = true;
    player.yVel = 15;
  }
});

update();
