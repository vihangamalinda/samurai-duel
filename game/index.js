import CustomObj from "./src/customObj.js";
import {
  determineWinner,
  decreaseTimer,
  isAttackColliding,
} from "./src/utility.js";

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

const WINDOW_WIDTH = 1280;
const WINDOW_HEIGHT = 720;

const playerHealthBar = document.querySelector(".player-health");
const enemyHealthBar = document.querySelector(".enemy-health");

const MOVEMENTS = {
  jump: -20,
  left: -5,
  right: 5,
};

//window resolution=>16:9 (w: 1024 :H:576)
// 1280x720
canvas.width = WINDOW_WIDTH;
canvas.height = WINDOW_HEIGHT;

c.fillRect(0, 0, canvas.width, canvas.height);

const customObj = new CustomObj(c);
const { background, skelton, golem01, golem02, mushRoom } =
  customObj.objects.sprites;
const { player, enemy } = customObj.objects.interactiveCharacters;

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

  // User interaction related updates
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
