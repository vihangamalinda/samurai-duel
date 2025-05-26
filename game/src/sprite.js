export default class Sprite {
  constructor({
    position,
    imageSrc,
    context,
    frames,
    scale = { x: 1, y: 1 },
    offset = { x: 0, y: 0 },
  }) {
    this.position = position;
    this.context = context;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.frames = frames;
    this.currentFrame = 0;
    this.framesElapsed = 0;
    this.frameHold = 10;
    this.offset = offset;
  }

  draw() {
    const scaledWidth = (this.image.width / this.frames) * this.scale.x;
    const scaledHeight = this.image.height * this.scale.y;

    const currentFrameStart =
      this.currentFrame * (this.image.width / this.frames);
    this.context.drawImage(
      this.image,
      currentFrameStart,
      0,
      this.image.width / this.frames,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      scaledWidth,
      scaledHeight
    );
  }

  getPositionUpdate(position) {
    this.position = position;
  }

  update() {
    this.framesElapsed++;

    if (this.framesElapsed % this.frameHold === 0) {
      this.currentFrame++;
      if (this.currentFrame > this.frames - 1) {
        this.currentFrame = 0;
      }
    }

    this.draw();
  }
}
