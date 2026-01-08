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
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(5, 10, 5);
scene.add(dirLight);

// ----- GROUND -----
const groundGeo = new THREE.BoxGeometry(10, 1, 200);
const groundMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.position.z = -80;
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

// ----- OBSTACLES -----
let obstacles = [];
const loader = new THREE.GLTFLoader();

function loadGLTFRandom(files) {
  const file = files[Math.floor(Math.random() * files.length)];
  return new Promise(resolve => {
    loader.load("assets/" + file, gltf => {
      const obj = gltf.scene;
      obj.name = file.split(".")[0]; // save name for rotation
      resolve(obj);
    });
  });
}

// Spawn obstacle
async function spawnObstacle() {
  const files = ["tyre.glb", "destroyed_car.glb", "drum.glb"];
  const obj = await loadGLTFRandom(files);
  obj.position.x = lanes[Math.floor(Math.random() * 3)];
  obj.position.y = 0; // adjust if needed
  obj.position.z = player.position.z - 100;
  obj.scale.set(1, 1, 1); // adjust size
  scene.add(obj);
  obstacles.push(obj);
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

  // Auto-run forward
  player.position.z -= speed;
  camera.position.z = player.position.z + 10;

  // Smooth lane movement
  player.position.x += (lanes[currentLane] - player.position.x) * 0.2;

  // Move obstacles + check collision
  obstacles.forEach((obs, i) => {
    obs.position.z += speed;

    // Spin tyre if it's a tyre
    if (obs.name.includes("tyre")) obs.rotation.x += 0.1;

    // Collision detection
    if (
      Math.abs(obs.position.z - player.position.z) < 1 &&
      Math.abs(obs.position.x - player.position.x) < 1
    ) {
      alert("Game Over! Monster got you! Score: " + score.toFixed(0));
      location.reload();
    }

    // Remove obstacle if passed camera
    if (obs.position.z > camera.position.z + 10) {
      scene.remove(obs);
      obstacles.splice(i, 1);
      score++;
    }
  });

  renderer.render(scene, camera);
}

animate();
