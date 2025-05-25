export default class Sprite {
  constructor({ position, imageSrc, context }) {
    this.position = position;
    this.context = context;
    this.image = new Image();
    this.image.src = imageSrc;
  }

  draw() {
    this.context.drawImage(this.image, this.position.x, this.position.y);
  }

  update() {
    this.draw();
  }
}
