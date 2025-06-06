const TIME_MAX = 60;
let timerCount = TIME_MAX;
let timerRef;

const resultEl = document.querySelector(".result");
const timerEl = document.querySelector(".timer");

const determineWinner = ({ player1, player2 }) => {
  if (timerRef) {
    clearTimeout(timerRef);
  }

  let message;
  if (player1.health === player2.health) {
    // Tie
    message = "Draw";
    console.log("TIE");
  } else if (player1.health > player2.health) {
    // player 1 win
    message = "player 1 win";
    player2.dead();
    console.log("player 1 win");
  } else {
    //player 2 win
    message = "player 2 win";
    player1.dead();
    console.log("player 2 win");
  }
  resultEl.innerText = message;
  resultEl.style.display = "flex";
};

const decreaseTimer = ({ player1, player2 }) => {
  timerEl.innerHTML = timerCount;
  const players = { player1, player2 };

  if (timerCount > 0) {
    timerRef = setTimeout(() => {
      timerCount--;
      decreaseTimer(players);
    }, 1000);
  }
  if (timerCount === 0) {
    determineWinner(players);
  }
};

const isAttackColliding = (attacker, reciever) => {
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
};

const imageSrc = {
  backgroundImageSrc: "./assets/background-with-coluds.png",
  skeletonSrc: "./assets/skeleton_01_white_die.png",
  golemBlueSrc: "./assets/golem_1_die.png",
  golemOrangeSrc: "./assets/golem_1_attack.png",
  mushRoomSrc: "./assets/mushroom-attack-with-stun.png",
  warriorOneSrc: {
    left: {
      path: "./assets/warriorOne/left.png",
      frames: 6,
    },
    right: {
      path: "./assets/warriorOne/right.png",
      frames: 6,
    },
    idle: {
      path: "./assets/warriorOne/idle.png",
      frames: 10,
    },
    jump: {
      path: "./assets/warriorOne/jump.png",
      frames: 2,
    },
    fall: {
      path: "./assets/warriorOne/fall.png",
      frames: 2,
    },
    attack: {
      path: "./assets/warriorOne/attack.png",
      frames: 4,
    },
    death: {
      path: "./assets/warriorOne/death.png",
      frames: 9,
    },
  },
  warriorTwoSrc: {
    right: {
      path: "./assets/warriorTwo/right.png",
      frames: 8,
    },
    left: {
      path: "./assets/warriorTwo/left.png",
      frames: 8,
    },
    idle: {
      path: "./assets/warriorTwo/idle.png",
      frames: 11,
    },
    jump: {
      path: "./assets/warriorTwo/jump.png",
      frames: 3,
    },
    fall: {
      path: "./assets/warriorTwo/fall.png",
      frames: 3,
    },
    attack: {
      path: "./assets/warriorTwo/attack.png",
      frames: 7,
    },
    death: {
      path: "./assets/warriorTwo/death.png",
      frames: 11,
    },
  },
};

export { isAttackColliding, decreaseTimer, determineWinner, imageSrc };
