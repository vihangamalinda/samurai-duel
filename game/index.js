const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

//window resolution=>16:9
canvas.width = 1024;
canvas.height = 576;

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
  }

  draw() {
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.width, this.height);

    //Attack box
    const { position, width, height, offset } = this.attackBox;
    c.fillStyle = "green";
    c.fillRect(position.x + offset.x, position.y, width, height);
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
}

const player = new Sprite({
  position: { x: 0, y: 0 },
  velocity: { x: 0, y: 2 },
  offset: { x: 0, y: 0 },
});
// player.draw();

const enemy = new Sprite({
  position: { x: 500, y: 0 },
  velocity: { x: 0, y: 2 },
  color: "white",
  offset: { x: -50, y: 0 },
});
// enemy.draw();
console.log(player);

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

let lastKey;

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
    player.velocity.x = -5;
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
  }

  // Enemy's velocity update to perform movements
  if (keys.arrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
  } else if (keys.arrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
  }
}
animate();

window.addEventListener("keydown", (event) => {
  console.log(event.key);
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
        player.velocity.y = -20;
      }
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
        enemy.velocity.y = -20;
      }
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
