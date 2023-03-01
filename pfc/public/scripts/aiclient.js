const rockButton = document.getElementById("rock");
const paperButton = document.getElementById("paper");
const scissorsButton = document.getElementById("scissors");
const restartButton = document.getElementById("restart");

let playerchoice, computerchoice;

rockButton.addEventListener("click", () => {
  playerchoice = "rock";
  game();
});

paperButton.addEventListener("click", () => {
  playerchoice = "paper";
  game();
});

scissorsButton.addEventListener("click", () => {
  playerchoice = "scissors";
  game();
});

restartButton.addEventListener('click', () => {
  restartButton.style.display = 'none';
  clearScreen();
  gameLocked(false);
});  

function computerPlay() {
  let choices = ['rock', 'paper', 'scissors'];
  return choices[Math.floor(Math.random() * choices.length)];
}

function gameLocked(state) {
  document.querySelector("#rock").disabled = state;
  document.querySelector("#paper").disabled = state;
  document.querySelector("#scissors").disabled = state;
}

function printResult(result) {
  const resultmsg = document.getElementById("resultmsg");
  resultmsg.innerHTML = result;
}

function printUserplay(userplay) {
  const userplaymsg = document.getElementById("playmsg");
  userplaymsg.innerHTML = userplay;
}

function printAichoice(oppchoice) {
  const oppmsg = document.getElementById("oppmsg");
  oppmsg.innerHTML = oppchoice;
}

function playRound(playerSelection, computerSelection) {

  if (playerSelection == computerSelection) {
    return "It's a tie!";
  } else if (playerSelection == 'rock') {
    if (computerSelection == 'paper') {
      return "You lose!";
    } else {
      return "You win!";
    }
  } else if (playerSelection == 'paper') {
    if (computerSelection == 'scissors') {
      return "You lose!";
    } else {
      return "You win!";
    }
  } else if (playerSelection == 'scissors') {
    if (computerSelection == 'rock') {
      return "You lose!";
    } else {
      return "You win!";
    }
  } 
}

function game(){
  computerchoice = computerPlay();
  printUserplay("You played " + playerchoice.charAt(0).toUpperCase() + playerchoice.slice(1));
  printAichoice("AI played " + computerchoice.charAt(0).toUpperCase() + computerchoice.slice(1));
  printResult(playRound(playerchoice, computerchoice));
  gameLocked(true);
  restartButton.style.display = 'block';
}

function clearScreen(){
  printUserplay("");
  printAichoice("");
  printResult("");
}