// ----- SCENE -----
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x0a0a0a, 10, 200);

// ----- CAMERA -----
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 5, 10);

// ----- RENDERER -----
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ----- LIGHTS -----
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
dirLight.position.set(5, 10, 5);
scene.add(dirLight);

// ----- GROUND -----
const groundGeo = new THREE.BoxGeometry(10, 1, 50);
const groundMat = new THREE.MeshStandardMaterial({ color: 0x444444 });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.position.z = 0;
scene.add(ground);

// ----- LANES -----
const lanes = [-3, 0, 3];
let currentLane = 1;

// ----- PLAYER -----
const playerGeo = new THREE.BoxGeometry(1, 2, 1);
const playerMat = new THREE.MeshStandardMaterial({ color: 0x00ffff });
const player = new THREE.Mesh(playerGeo, playerMat);
player.position.y = 1;
scene.add(player);

// ----- OBSTACLES (boxes instead of GLTF) -----
let obstacles = [];

function spawnObstacle() {
  const obsGeo = new THREE.BoxGeometry(1,1,1);
  const obsMat = new THREE.MeshStandardMaterial({color:0xff0000});
  const obs = new THREE.Mesh(obsGeo, obsMat);
  obs.position.x = lanes[Math.floor(Math.random() * 3)];
  obs.position.y = 0.5;
  obs.position.z = player.position.z - 50;
  scene.add(obs);
  obstacles.push(obs);
}
setInterval(spawnObstacle, 1500);

// ----- CONTROLS -----
document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft" && currentLane > 0) currentLane--;
  if (e.key === "ArrowRight" && currentLane < 2) currentLane++;
});

// ----- GAME VARIABLES -----
let speed = 0.8;
let score = 0;

// ----- ANIMATE LOOP -----
function animate() {
  requestAnimationFrame(animate);

  // Auto-run
  player.position.z -= speed;
  camera.position.z = player.position.z + 10;
  camera.lookAt(player.position);

  // Smooth lane movement
  player.position.x += (lanes[currentLane] - player.position.x) * 0.2;

  // Move obstacles & collision
  obstacles.forEach((obs,i) => {
    obs.position.z += speed;

    // Collision
    if (
      Math.abs(obs.position.z - player.position.z) < 1 &&
      Math.abs(obs.position.x - player.position.x) < 1
    ) {
      alert("Game Over! Score: " + score.toFixed(0));
      location.reload();
    }

    // Remove passed obstacles
    if(obs.position.z > camera.position.z + 10){
      scene.remove(obs);
      obstacles.splice(i,1);
      score++;
    }
  });

  renderer.render(scene, camera);
}

animate();
