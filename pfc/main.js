import http from 'http';
import { Server as IOServer } from 'socket.io';
import RequestController from './controllers/requestController.js';

const server = http.createServer(
  (request, response) => new RequestController(request, response).handleRequest()
);


let player1;
let player2;
const playValues = new Map();

const connectionListener = socket => {

  socket.on("join", () => {

    if (!player1) {

      player1 = socket.id;
      socket.emit("message", "You are Player 1");

      if (player2) {

        io.to(player1).emit("game-ready");
        io.to(player1).emit("waiting", 'Ready to play, make your move...');
        io.to(player2).emit("waiting", 'Ready to play, make your move...');
        io.to(player2).emit("game-ready");

      } else {

        io.to(player1).emit("waiting", "Waiting for other player to join...");

      }
    } else if (!player2) {

      player2 = socket.id;
      socket.emit("message", "You are Player 2");
      io.to(player1).emit("game-ready");
      io.to(player1).emit("waiting", 'Ready to play, make your move...');
      io.to(player2).emit("waiting", 'Ready to play, make your move...');
      io.to(player2).emit("game-ready");

    } else {

      socket.emit("message", "Game is full, try again later");
    }
    
  });

  socket.on("play", (play) => {

    if (socket.id === player1) {

        playValues.set(player1, play);
        io.to(player1).emit("game-waiting");
        io.to(player1).emit("playchoice", "You played " + play.charAt(0).toUpperCase() + play.slice(1));

    } else if (socket.id === player2) {

        playValues.set(player2, play);
        io.to(player2).emit("game-waiting");
        io.to(player2).emit("playchoice", "You played " + play.charAt(0).toUpperCase() + play.slice(1));

    }

    if (player1 && player2) {

      const p1 = playValues.get(player1);
      const p2 = playValues.get(player2);

      if (p2 === undefined) {
        io.to(player1).emit("waiting", 'Waiting for Player 2 to make his move...');
      } else if (p1 === undefined) {
        io.to(player2).emit("waiting", 'Waiting for Player 1 to make his move...');
      }

      if (p1 && p2) {

        if (p1 === "rock" && p2 === "scissors") {

          io.to(player1).emit("opponentchoice", "Player 2 played " + p2.charAt(0).toUpperCase() + p2.slice(1));
          io.to(player2).emit("opponentchoice", "Player 1 played " + p1.charAt(0).toUpperCase() + p1.slice(1));
          io.to(player1).emit("result", "Player 1 wins!");
          io.to(player2).emit("result", "Player 1 wins!");

        } else if (p1 === "scissors" && p2 === "rock") {

          io.to(player1).emit("opponentchoice", "Player 2 played " + p2.charAt(0).toUpperCase() + p2.slice(1));
          io.to(player2).emit("opponentchoice", "Player 1 played " + p1.charAt(0).toUpperCase() + p1.slice(1));
          io.to(player1).emit("result", "Player 2 wins!");
          io.to(player2).emit("result", "Player 2 wins!");

        } else if (p1 === "paper" && p2 === "rock") {

          io.to(player1).emit("opponentchoice", "Player 2 played " + p2.charAt(0).toUpperCase() + p2.slice(1));
          io.to(player2).emit("opponentchoice", "Player 1 played " + p1.charAt(0).toUpperCase() + p1.slice(1));
          io.to(player1).emit("result", "Player 1 wins!");
          io.to(player2).emit("result", "Player 1 wins!");

        } else if (p1 === "rock" && p2 === "paper") {

          io.to(player1).emit("opponentchoice", "Player 2 played " + p2.charAt(0).toUpperCase() + p2.slice(1));
          io.to(player2).emit("opponentchoice", "Player 1 played " + p1.charAt(0).toUpperCase() + p1.slice(1));
          io.to(player1).emit("result", "Player 2 wins!");
          io.to(player2).emit("result", "Player 2 wins!");

        } else if (p1 === "scissors" && p2 === "paper") {

          io.to(player1).emit("opponentchoice", "Player 2 played " + p2.charAt(0).toUpperCase() + p2.slice(1));
          io.to(player2).emit("opponentchoice", "Player 1 played " + p1.charAt(0).toUpperCase() + p1.slice(1));
          io.to(player1).emit("result", "Player 1 wins!");
          io.to(player2).emit("result", "Player 1 wins!");

        } else if (p1 === "paper" && p2 === "scissors") {

          io.to(player1).emit("opponentchoice", "Player 2 played " + p2.charAt(0).toUpperCase() + p2.slice(1));
          io.to(player2).emit("opponentchoice", "Player 1 played " + p1.charAt(0).toUpperCase() + p1.slice(1));
          io.to(player1).emit("result", "Player 2 wins!");
          io.to(player2).emit("result", "Player 2 wins!");

        } else {

          io.to(player1).emit("opponentchoice", "Player 2 played " + p2.charAt(0).toUpperCase() + p2.slice(1));
          io.to(player2).emit("opponentchoice", "Player 1 played " + p1.charAt(0).toUpperCase() + p1.slice(1));
          io.to(player1).emit("result", "It's a tie!");
          io.to(player2).emit("result", "It's a tie!");
          
        }

        io.to(player1).emit('restartbtndisplay', 'block');
        io.to(player2).emit('restartbtndisplay', 'block');

      }

    }

  });

  socket.on('restart', () => {

    io.sockets.emit('restartbtndisplay', 'none');
    io.to(player1).emit("game-ready");
    io.to(player2).emit("game-ready");
    io.to(player1).emit("waiting", 'Ready to play, make your move...');
    io.to(player2).emit("waiting", 'Ready to play, make your move...');
    io.to(player1).emit("result", "");
    io.to(player2).emit("result", "");
    io.to(player1).emit("opponentchoice", "");
    io.to(player2).emit("opponentchoice", "");
    io.to(player1).emit("playchoice", "");
    io.to(player2).emit("playchoice", "");
    playValues.delete(player1);
    playValues.delete(player2);

  });

  socket.on("disconnect", () => {
 
    if (socket.id === player1) {

      playValues.delete(player1);
      playValues.delete(player2);
      player1 = null;

      io.to(player2).emit("waiting", "Other play has diconnected, waiting to join again...");
      io.to(player2).emit("playchoice", '');
      io.sockets.emit('restartbtndisplay', 'none');

    } else if (socket.id === player2) {

      playValues.delete(player1);
      playValues.delete(player2);
      player2 = null;
      
      io.to(player1).emit("waiting", "Other play has diconnected, waiting to join again...");
      io.to(player1).emit("playchoice", '');
      io.sockets.emit('restartbtndisplay', 'none');

    }

    if (!player1 || !player2) { 

      io.emit("game-waiting");
      io.sockets.emit("result", "");
      io.sockets.emit("opponentchoice", "");
      io.sockets.emit("playchoice", "");

    }

  });

}

const io = new IOServer(server);

io.on('connection', connectionListener );

const port = 8080

server.listen(port, () => console.log("Server started on port " + port));