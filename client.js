'use strict';

$(document).ready(clientScript);

function clientScript() {
  console.log('client connecting...');
  var socket = io();
  console.log('...connected');
}
