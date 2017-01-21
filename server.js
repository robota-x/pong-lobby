'use strict';

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var PORT = 3000;


// lobby logic
var playerLobby = []
var playerQueue = []

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
    console.log('ping')
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
