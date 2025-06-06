import Sprite from "./sprite.js";
import Character from "./character.js";
import { imageSrc } from "./utility.js";

export default class CustomObj {
  constructor(context) {
    this.context = context;
    this.objects = this._getObjects();
  }

  _getObjects() {
    const context = this.context;

    const background = new Sprite({
      position: { x: 0, y: 0 },
      context: context,
      imageSrc: imageSrc.backgroundImageSrc,
      frames: 1,
    });
    const skelton = new Sprite({
      position: { x: 200, y: 230 },
      imageSrc: imageSrc.skeletonSrc,
      context: context,
      frames: 13,
      scale: { x: 2, y: 4 },
    });
    const golem01 = new Sprite({
      position: { x: 1000, y: 230 },
      imageSrc: imageSrc.golemBlueSrc,
      context: context,
      frames: 13,
      scale: { x: 3, y: 4 },
    });

    const golem02 = new Sprite({
      position: { x: 900, y: 230 },
      imageSrc: imageSrc.golemOrangeSrc,
      context: context,
      frames: 11,
      scale: { x: 3, y: 4 },
    });

    const mushRoom = new Sprite({
      position: { x: 600, y: 230 },
      imageSrc: imageSrc.mushRoomSrc,
      context: context,
      frames: 24,
      scale: { x: 2, y: 4 },
    });

    const PlayerOneSprite = new Sprite({
      position: { x: 0, y: 0 },
      context: context,
      frames: imageSrc.warriorOneSrc.idle.frames,
      scale: { x: 3, y: 5 },
      imageSrc: imageSrc.warriorOneSrc.idle.path,
      offset: {
        x:180,
        y: 280,
      },
    });

    const PlayerTwoSprite = new Sprite({
      position: { x: 0, y: 0 },
      context: context,
      frames: imageSrc.warriorTwoSrc.idle.frames,
      scale: { x: 2, y: 4 },
      imageSrc: imageSrc.warriorTwoSrc.idle.path,
      offset: {
        x: 140,
        y: 305,
      },
    });

    const player = new Character({
      position: { x: 0, y: 0 },
      velocity: { x: 0, y: 2 },
      color: { body: "red", attackBox: "yellow" },
      offset: { x: 0, y: 0 },
      sprite: PlayerOneSprite,
      movements:imageSrc.warriorOneSrc,
    });

    const enemy = new Character({
      position: { x: 500, y: 0 },
      velocity: { x: 0, y: 2 },
      color: { body: "white", attackBox: "purple" },
      offset: { x: -50, y: 0 },
      sprite: PlayerTwoSprite,
      movements:imageSrc.warriorTwoSrc,
    });
    return {
      sprites: {
        mushRoom,
        golem02,
        golem01,
        skelton,
        background,
        PlayerOneSprite,
        PlayerTwoSprite,
      },
      interactiveCharacters: {
        player,
        enemy,
      },
    };
  }
}
