export default class Character {
  constructor({
    position,
    velocity,
    color = "red",
    offset,
    sprite,
    movements,
  }) {
    this.position = position;
    this.velocity = velocity;
    this.height = 150;
    this.width = 50;
    this.lastKey;
    this.attackBox = {
      position: { x: position.x, y: position.y },
      width: 130,
      height: 80,
      offset,
    };
    this.color = color;
    this.isAttacking;
    this.health = 100;
    this.sprite = sprite;
    this.movements = this._getMovements(movements);
    this.isDead = false;
    console.log(this.movements);
  }

  _getMovements(movements) {
    for (const movement in movements) {
      movements[movement].image = new Image();
      movements[movement].image.src = movements[movement].path;
    }
    return movements;
  }

  getSprite(sprite) {
    sprite.position = this.position;
  }

  draw(canvasContext) {
    // canvasContext.fillStyle = this.color.body;
    // canvasContext.fillRect(
    //   this.position.x,
    //   this.position.y,
    //   this.width,
    //   this.height
    // );

    // this.sprite.update();
    const sprite = this.sprite;
    sprite.getPositionUpdate(this.position);
    sprite.update();

    //Attack box
    // if (this.isAttacking) {
    //   const { position, width, height, offset } = this.attackBox;
    //   canvasContext.fillStyle = this.color.attackBox;
    //   canvasContext.fillRect(position.x + offset.x, position.y, width, height);
    // }
  }

  update({ canvasContext: canvasContext, canvas: canvas }) {
    this.attackBox.position = { ...this.position };
    // this.draw(canvasContext);
    const isWithinCanvaseWalls =
      this.position.x + this.velocity.x >= 0 &&
      this.position.x + this.velocity.x + this.width <= canvas.width;

    //position movement update
    if (isWithinCanvaseWalls) {
      this.position.x += this.velocity.x;
    }
    this.position.y += this.velocity.y;

    const isWithinCanvasBottom =
      this.position.y + this.height + this.velocity.y >=
      canvas.height + GROUND_LEVEL;

    if (isWithinCanvasBottom) {
      this.velocity.y = 0;
    } else {
      this.velocity.y += GRAVITY;
    }

    this.draw(canvasContext);
  }

  dead() {
    this._updateMovementSprite("death");
    this.isDead = true;
    this.sprite.changeAnimationRate(50);
  }

  attack() {
    this._updateMovementSprite("attack");
    this.isAttacking = true;
    const previousFrameHold = this.sprite.frameHold;
    this.sprite.changeAnimationRate(5);
    setTimeout(() => {
      this.isAttacking = false;
      this.sprite.changeAnimationRate(previousFrameHold);
    }, 500);
  }

  jump() {
    this._updateMovementSprite("jump");
  }

  left() {
    this._updateMovementSprite("left");
  }

  right() {
    this._updateMovementSprite("right");
  }

  idle() {
    this._updateMovementSprite("idle");
  }

  fall() {
    this._updateMovementSprite("fall");
  }

  _updateMovementSprite(movementType) {
    const movement = this.movements[movementType];
    this.sprite.image = movement.image;
    this.sprite.frames = movement.frames;
  }
}

const GRAVITY = 0.7;
const GROUND_LEVEL = -195;
