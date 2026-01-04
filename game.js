// Scene
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x000000, 10, 60);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 5, 10);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lights
scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1));
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 10, 5);
scene.add(light);

// Ground (Track)
const groundGeo = new THREE.BoxGeometry(10, 1, 200);
const groundMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.position.z = -80;
scene.add(ground);

// Player
const playerGeo = new THREE.BoxGeometry(1, 2, 1);
const playerMat = new THREE.MeshStandardMaterial({ color: 0x00ffff });
const player = new THREE.Mesh(playerGeo, playerMat);
player.position.y = 1;
scene.add(player);

// Lanes
const lanes = [-3, 0, 3];
let currentLane = 1;

// Obstacles
let obstacles = [];
const obsGeo = new THREE.BoxGeometry(1, 2, 1);
const obsMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });

// Spawn obstacle
function spawnObstacle() {
  const obs = new THREE.Mesh(obsGeo, obsMat);
  obs.position.x = lanes[Math.floor(Math.random() * 3)];
  obs.position.y = 1;
  obs.position.z = -100;
  scene.add(obs);
  obstacles.push(obs);
}
setInterval(spawnObstacle, 1200);

// Controls
document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft" && currentLane > 0) currentLane--;
  if (e.key === "ArrowRight" && currentLane < 2) currentLane++;
});

let speed = 0.6;

// Game loop
function animate() {
  requestAnimationFrame(animate);

  player.position.x += (lanes[currentLane] - player.position.x) * 0.2;

  obstacles.forEach((obs, i) => {
    obs.position.z += speed;

    // Collision
    if (
      Math.abs(obs.position.z - player.position.z) < 1 &&
      Math.abs(obs.position.x - player.position.x) < 1
    ) {
      alert("GAME OVER");
      location.reload();
    }

    if (obs.position.z > 10) {
      scene.remove(obs);
      obstacles.splice(i, 1);
    }
  });

  renderer.render(scene, camera);
}

animate();
