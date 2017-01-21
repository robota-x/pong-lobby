'use strict';

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var PORT = 3000;


// lobby logic
var playerLobby = []
var playerQueue = []
var gameList = []

function gameInit(playerOneID, playerTwoID) {
  var gameID = gameGenerateID();
  removePlayerFromQueue(playerOneID, gameID);
  removePlayerFromQueue(playerTwoID, gameID);
  playerNotifyGameReady(playerOneID, gameID);
  playerNotifyGameReady(playerTwoID, gameID);
  gameList['gameID'] =  {
      status: 'waiting',
      readyPlayers: []
    };
}

function removePlayerFromQueue(playerID) {
  var playerPosition = playerQueue.indexOf(playerID);
  playerPosition > -1 ? playerQueue.splice(playerPosition, 1) : null;
}

function playerNotifyGameReady(playerID, gameID) {
  io.to(playerID).emit('gameReady', {
    gameID: gameID
  });
}

function gameGenerateID() {
  return 'Ananas';
}

// sockets logic
io.on('connection', function(socket) {
  playerLobby.push(socket.id);
  socket.emit('connectionSuccess');
  io.emit('lobbyUpdate', {
    playerCount: playerLobby.length
  });

  socket.on('queueJoin', function(){
    playerQueue.push(socket.id);
    socket.emit('queueJoinSuccess');
    io.emit('queueUpdate', {
      queueLength: playerQueue.length
    });
  });

  socket.on('playerReady', function(message) {
    var gameID = message.gameID
    gameList[gameID].readyPlayers.push(socket.id);
    if(gameList[gameID].readyPlayers.length == 2) {
      io.to(gameID).emit('gameStart');
    }
  });


  // test hook
  socket.on('testEvent', function() {
    gameInit(playerQueue[0],playerQueue[1]);
  })
})


// serve dummy client content from here for now
app.get('/', function(req, res){
  res.sendFile(__dirname + '/client.html');
});

app.get('/client.js', function(req, res){
  res.sendFile(__dirname + '/client.js');
});

// server start
http.listen(PORT, function(){
  console.log('listening on port: ' + PORT);
});
