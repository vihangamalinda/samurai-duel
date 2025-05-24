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
    console.log("player 1 win");
  } else {
    //player 2 win
    message = "player 2 win";
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

export { isAttackColliding, decreaseTimer, determineWinner };
