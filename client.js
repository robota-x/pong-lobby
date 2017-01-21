'use strict';

$(document).ready(clientScript);

function clientScript() {
  var statusField = $('#current-status').val('Not connected.');
  var socket;

  $('#server-connect').click(function() {
    statusField.val('Client connecting...');
    socket = io()
    socketSetup();
  });

  $('#join-queue').click(function() {
    if(socket) {
      socket.emit('queueJoin');
    } else {
      statusField.val('You\'re not connected to any server!');
    }
  });

  function socketSetup() {
    socket.on('connectionSuccess', function(e) {
      statusField.val('Connected!');
    });

    socket.on('lobbyUpdate', function(message) {
      statusField.val('In lobby, ' + message.playerCount + ' other players present');
    });

    socket.on('queueJoinSuccess', function() {
      statusField.val('Successfully joined game queue');
    });
  }
}
