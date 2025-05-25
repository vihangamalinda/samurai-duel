export default class Character {
  constructor({ position, velocity, color = "red", offset ,sprite}) {
    this.position = position;
    this.velocity = velocity;
    this.height = 150;
    this.width = 50;
    this.lastKey;
    this.attackBox = {
      position: { x: position.x, y: position.y },
      width: 100,
      height: 50,
      offset,
    };
    this.color = color;
    this.isAttacking;
    this.health = 100;
    this.sprite = sprite;
  }

  getSprite(sprite){
    sprite.position =this.position;

  }

  draw(canvasContext) {
    canvasContext.fillStyle = this.color.body;
    canvasContext.fillRect(
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  
    // this.sprite.update();
        const sprite = this.sprite;
    sprite.getPositionUpdate(this.position);
    sprite.update();

    //Attack box
    if (this.isAttacking) {
      const { position, width, height, offset } = this.attackBox;
      canvasContext.fillStyle = this.color.attackBox;
      canvasContext.fillRect(position.x + offset.x, position.y, width, height);
    }
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
      this.position.y + this.height + this.velocity.y >= canvas.height +GROUND_LEVEL;

    if (isWithinCanvasBottom) {
      this.velocity.y = 0;
    } else {
      this.velocity.y += GRAVITY;
    }

    this.draw(canvasContext);
    
  }

  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }
}

const GRAVITY = 0.7;
const GROUND_LEVEL = -195;