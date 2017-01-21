'use strict';

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var PORT = 3000;


// lobby logic
var playerLobby = []
var playerQueue = []

function gameInit(playerOneID, playerTwoID) {
  removePlayerFromQueue(playerOneID);
  removePlayerFromQueue(playerTwoID);
  playerNotifyGameReady(playerOneID);
  playerNotifyGameReady(playerTwoID);
}

function removePlayerFromQueue(playerID) {
  var playerPosition = playerQueue.indexOf(playerID);
  playerPosition > -1 ? playerQueue.splice(playerPosition, 1) : null;
}

function playerNotifyGameReady(playerID) {
  io.to(playerID).emit('gameReady');
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
  })

  //test hook
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
