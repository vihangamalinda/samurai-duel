import Character from "./src/character.js";
import {
  determineWinner,
  decreaseTimer,
  isAttackColliding,
} from "./src/utility.js";
import Sprite from "./src/sprite.js";
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
const backgroundImageSrc = "./assets/background-with-coluds.png";
const skeletonSrc = "./assets/skeleton_01_white_die.png";
const golemBlueSrc = "./assets/golem_1_die.png";
const golemOrangeSrc = "./assets/golem_1_attack.png";
const mushRoomSrc = "./assets/mushroom-attack-with-stun.png";

const playerHealthBar = document.querySelector(".player-health");
const enemyHealthBar = document.querySelector(".enemy-health");

const MOVEMENTS = {
  jump: -20,
  left: -5,
  right: 5,
};

//window resolution=>16:9 (w: 1024 :H:576)
// 1280x720
canvas.width = 1280;
canvas.height = 720;

c.fillRect(0, 0, canvas.width, canvas.height);

const background = new Sprite({
  position: { x: 0, y: 0 },
  context: c,
  imageSrc: backgroundImageSrc,
  frames: 1,
});

const skelton = new Sprite({
  position: { x: 200, y: 230 },
  imageSrc: skeletonSrc,
  context: c,
  frames: 13,
  scale: { x: 2, y: 4 },
});

const golem01 = new Sprite({
  position: { x: 1000, y: 230 },
  imageSrc: golemBlueSrc,
  context: c,
  frames: 13,
  scale: { x: 3, y: 4 },
});

const golem02 = new Sprite({
  position: { x: 900, y: 230 },
  imageSrc: golemOrangeSrc,
  context: c,
  frames: 11,
  scale: { x: 3, y: 4 },
});
const mushRoom = new Sprite({
  position: { x: 600, y: 230 },
  imageSrc: mushRoomSrc,
  context: c,
  frames: 24,
  scale: { x: 2, y: 4 },
});

const player = new Character({
  position: { x: 0, y: 0 },
  velocity: { x: 0, y: 2 },
  color: { body: "red", attackBox: "yellow" },
  offset: { x: 0, y: 0 },
});

const enemy = new Character({
  position: { x: 500, y: 0 },
  velocity: { x: 0, y: 2 },
  color: { body: "white", attackBox: "purple" },
  offset: { x: -50, y: 0 },
});

// Horizontal -level movement tracking
const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  arrowRight: {
    pressed: false,
  },
  arrowLeft: {
    pressed: false,
  },
};

decreaseTimer({ player1: player, player2: enemy });

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  const updateInfo = { canvasContext: c, canvas: canvas };
  //background related animation updates
  background.update();
  skelton.update();
  golem01.update();
  golem02.update();
  mushRoom.update();

  // User interation related updates
  player.update(updateInfo);
  enemy.update(updateInfo);

  //reset player's And enemey's x-axis velocity
  player.velocity.x = 0;
  enemy.velocity.x = 0;

  // Player's velocity update to perform movements
  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = MOVEMENTS.left;
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = MOVEMENTS.right;
  }

  // Enemy's velocity update to perform movements
  if (keys.arrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = MOVEMENTS.right;
  } else if (keys.arrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = MOVEMENTS.left;
  }

  // Detect collision
  if (isAttackColliding(player, enemy)) {
    enemy.health -= 1;
    enemyHealthBar.style.width = enemy.health + "%";
  }

  if (isAttackColliding(enemy, player)) {
    player.health -= 1;
    playerHealthBar.style.width = player.health + "%";
  }

  if (player.health < 1 || enemy.health < 1) {
    determineWinner({ player1: player, player2: enemy });
  }
}
animate();

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = true;
      player.lastKey = "d";
      break;
    case "a":
      keys.a.pressed = true;
      player.lastKey = "a";
      break;
    case "w":
      if (player.velocity.y === 0) {
        player.velocity.y = MOVEMENTS.jump;
      }
      break;
    case " ":
      player.attack();
      break;
    case "ArrowRight":
      keys.arrowRight.pressed = true;
      enemy.lastKey = "ArrowRight";
      break;
    case "ArrowLeft":
      keys.arrowLeft.pressed = true;
      enemy.lastKey = "ArrowLeft";
      break;
    case "ArrowUp":
      if (enemy.velocity.y === 0) {
        enemy.velocity.y = MOVEMENTS.jump;
      }
      break;
    case "ArrowDown":
      enemy.attack();
      break;
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "ArrowRight":
      keys.arrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.arrowLeft.pressed = false;
      break;
  }
});
