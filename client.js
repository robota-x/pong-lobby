'use strict';

$(document).ready(clientScript);

function clientScript() {
  console.log('client connecting...');
  var socket = io();

  socket.on('connectionSuccess', function(e) {
    console.log('connected!');
  })

  socket.on('lobbyUpdate', function(message) {
    console.log('lobby update', message);
  })
}
