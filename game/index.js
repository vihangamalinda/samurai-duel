import Character from "./src/character.js";

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

const playerHealthBar = document.querySelector(".player-health");
const enemyHealthBar = document.querySelector(".enemy-health");
const timer = document.querySelector(".timer");
const result = document.querySelector(".result");

const TIME_MAX = 60;
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

function determineWinner({ player1, player2, timerRef }) {
  clearTimeout(timerRef);
  let message;
  if (player1.health === player2.health) {
    // Tie
    message = "Draw";
    console.log("TIE");
  } else if (player1.health > player2.health) {
    // player 1 win
    message = "player 1 win";
    console.log("player 1 win");
  } else {
    //player 2 win
    message = "player 2 win";
    console.log("player 2 win");
  }
  result.innerText = message;
  result.style.display = "flex";
}

let timerCount = TIME_MAX;
let timerRef;
function decreaseTimer() {
  timer.innerHTML = timerCount;

  if (timerCount > 0) {
    timerRef = setTimeout(() => {
      timerCount--;
      decreaseTimer();
    }, 1000);
  }
  if (timerCount === 0) {
    determineWinner({ player1: player, player2: enemy, timerRef });
  }
}
decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  const updateInfo = { canvasContext: c, canvas: canvas };

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
    determineWinner({ player1: player, player2: enemy, timerRef });
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
function isAttackColliding(attacker, reciever) {
  const isAttackWithinXRange =
    attacker.attackBox.position.x +
      attacker.attackBox.width +
      attacker.attackBox.offset.x >=
      reciever.position.x &&
    attacker.attackBox.position.x + attacker.attackBox.offset.x <=
      reciever.position.x + reciever.width;
  const isAttackWithinYRange =
    attacker.attackBox.position.y <= reciever.position.y + reciever.height &&
    attacker.attackBox.position.y + attacker.attackBox.height >=
      reciever.position.y;
  return isAttackWithinXRange && isAttackWithinYRange && attacker.isAttacking;
}
