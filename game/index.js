const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

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

const gravity = 0.7;
class Sprite {
  constructor({ position, velocity, color = "red", offset }) {
    this.position = position;
    this.velocity = velocity;
    this.height = 150;
    this.width = 50;
    this.lastKey;
    this.attackBox = {
      position: this.position,
      width: 100,
      height: 50,
      offset,
    };
    this.color = color;
    this.isAttacking;
  }

  draw() {
    c.fillStyle = this.color.body;
    c.fillRect(this.position.x, this.position.y, this.width, this.height);

    //Attack box
    if (this.isAttacking) {
      const { position, width, height, offset } = this.attackBox;
      c.fillStyle = this.color.attackBox;
      c.fillRect(position.x + offset.x, position.y, width, height);
    }
  }

  update() {
    this.draw();
    const isWithinCanvaseWalls =
      this.position.x + this.velocity.x >= 0 &&
      this.position.x + this.velocity.x + this.width <= canvas.width;

    //position movement update
    if (isWithinCanvaseWalls) {
      this.position.x += this.velocity.x;
    }
    this.position.y += this.velocity.y;

    const isWithinCanvasBottom =
      this.position.y + this.height + this.velocity.y >= canvas.height;

    if (isWithinCanvasBottom) {
      this.velocity.y = 0;
    } else {
      this.velocity.y += gravity;
    }
  }

  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }
}

const player = new Sprite({
  position: { x: 0, y: 0 },
  velocity: { x: 0, y: 2 },
  color: { body: "red", attackBox: "yellow" },
  offset: { x: 0, y: 0 },
});

const enemy = new Sprite({
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

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

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
  //   console.log(player)
  if (isAttackColliding(player, enemy)) {
    console.log("Player Hit enemy");
  }

  if (isAttackColliding(enemy, player)) {
    console.log("Enemy Hit Player");
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
    attacker.attackBox.position.x + attacker.attackBox.width >=
      reciever.position.x &&
    attacker.attackBox.position.x <= reciever.position.x + reciever.width;
  const isAttackWithinYRange =
    attacker.attackBox.position.y <= reciever.position.y + reciever.height &&
    attacker.attackBox.position.y + attacker.attackBox.height >=
      reciever.position.y;
  return isAttackWithinXRange && isAttackWithinYRange && attacker.isAttacking;
}
