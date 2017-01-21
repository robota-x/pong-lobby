'use strict';

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var PORT = 3000;


// lobby logic
var playerLobby = []
var playerQueue = []
var gameList = {}

function gameInit(playerOneID, playerTwoID) {
  var gameID = gameGenerateID();
  var playerList = [playerOneID, playerTwoID];
  gameList[gameID] = {}
  gameList[gameID][playerOneID] = 'waiting';
  gameList[gameID][playerTwoID] = 'waiting';

  playersRemoveFromQueue(playerList);
  playersHookToRoom(playerList, gameID);
  roomNotifyGameReady(gameID);
}

function playersRemoveFromLobby(players) {
  players.forEach(function(playerID) {
    var playerPosition = playerLobby.indexOf(playerID);
    playerPosition > -1 ? playerLobby.splice(playerPosition, 1) : null;
  });
}

function playersRemoveFromQueue(players) {
  players.forEach(function(playerID) {
    var playerPosition = playerQueue.indexOf(playerID);
    playerPosition > -1 ? playerQueue.splice(playerPosition, 1) : null;
  });
}

function playersHookToRoom(players, gameID){
  players.forEach(function(playerID) {
    var playerSocket = io.sockets.connected[playerID];
    playerSocket.join(gameID);
    playerSocket.on('playerReady', function() {
      gameList[gameID][playerID] = 'ready';
      if(Object.values(gameList[gameID]).indexOf('waiting') < 0) {
        io.to(gameID).emit('gameStart');
      }
    })
  });
}

function roomNotifyGameReady(room) {
  io.to(room).emit('gameReady');
}

function gameGenerateID() {
  return 'Ananas';
}

function sendLobbyCount() {
  io.emit('lobbyUpdate', {
    playerCount: playerLobby.length
  });
}

function sendQueueCount() {
  io.emit('queueUpdate', {
    playerCount: playerQueue.length
  });
}

io.on('connection', function(socket) {
  playerLobby.push(socket.id);
  socket.emit('connectionSuccess');
  sendLobbyCount();

  socket.on('queueJoin', function(){
    playerQueue.push(socket.id);
    socket.emit('queueJoinSuccess');
    sendQueueCount();
  });

  socket.on('disconnect', function() {
    playersRemoveFromQueue([socket.id]);
    playersRemoveFromLobby([socket.id]);
    sendLobbyCount();
    sendQueueCount();
  })

  // test hook
  socket.on('testEvent', function() {
    gameInit(playerQueue[0], playerQueue[1]);
  });
});


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
