'use strict';

$(document).ready(clientScript);

function clientScript() {
  var statusField = $('#current-status');
  var socket;

  $('#server-connect').click(function() {
    statusField.val('client connecting...');
    socket = io()
    socketSetup();
  });

  function socketSetup() {
    socket.on('connectionSuccess', function(e) {
      statusField.val('Connected!');
    });

    socket.on('lobbyUpdate', function(message) {
      statusField.val('Connected, ' + message.playerCount + 'in Lobby.');
    });
  }
}
