const socket = io();

const rockButton = document.getElementById("rock");
const paperButton = document.getElementById("paper");
const scissorsButton = document.getElementById("scissors");
const restartButton = document.getElementById("restart");

socket.on("message", function(message) {
  const messages = document.getElementById("messages");
  messages.innerHTML = message;

  rockButton.addEventListener("click", () => {
    socket.emit("play", "rock");
  });
  
  paperButton.addEventListener("click", () => {
    socket.emit("play", "paper");
  });
  
  scissorsButton.addEventListener("click", () => {
    socket.emit("play", "scissors");
  });

  restartButton.addEventListener('click', () => {
    restartButton.style.display = 'none';
    socket.emit('restart');
  });  

});

socket.on('restartbtndisplay', (display) => {
  restartButton.style.display = display;
});

socket.on("waiting", function(waiting) {
  const waitingmsg = document.getElementById("waitingmsg");
  waitingmsg.innerHTML = waiting;
});

socket.on("playchoice", function(playchoice) {
  const playmsg = document.getElementById("playmsg");
  playmsg.innerHTML = playchoice;
});

socket.on("opponentchoice", function(oppchoice) {
  const oppmsg = document.getElementById("oppmsg");
  oppmsg.innerHTML = oppchoice;
});

socket.on("result", function(result) {
  const resultmsg = document.getElementById("resultmsg");
  resultmsg.innerHTML = result;
});

socket.on('game-ready', () => {
  document.querySelector("#rock").disabled = false;
  document.querySelector("#paper").disabled = false;
  document.querySelector("#scissors").disabled = false;
});

socket.on('game-waiting', () => {
  document.querySelector("#rock").disabled = true;
  document.querySelector("#paper").disabled = true;
  document.querySelector("#scissors").disabled = true;
});

socket.emit('join');