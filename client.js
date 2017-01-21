'use strict';

$(document).ready(clientScript);

function clientScript() {
  var statusText = $('#current-status').text('Disconnected');
  var messageText = $('#current-message').text('Waiting to connect..');
  var socket;

  $('#server-connect').click(function() {
    statusText.text('Client connecting...');
    socket = io()
    socketSetup();
  });

  $('#join-queue').click(function() {
    if(socket) {
      statusText.text('Joining queue...');
      socket.emit('queueJoin');
    } else {
      messageText.text('You\'re not connected to any server!');
    }
  });

  $('#test-button').click(function() {
    socket.emit('testEvent');
    console.log('test event sent to server');
  })

  function socketSetup() {
    socket.on('connectionSuccess', function(e) {
      statusText.text('In lobby');
    });

    socket.on('queueJoinSuccess', function() {
      statusText.text('In queue');
    });

    socket.on('gameReady', function() {
      statusText.text('A game is ready to start');
    })

    socket.on('lobbyUpdate', function(message) {
      if(statusText.text() == 'In lobby') {
        messageText.text(message.playerCount + 'other players present');
      }
    });

    socket.on('queueUpdate', function(message) {
      if(statusText.text() == 'In queue') {
        messageText.text(message.queueLength + 'other players in queue');
      }
    });
  }
}
