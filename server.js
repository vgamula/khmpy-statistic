var path = require('path');
var express = require('express');

var app = express();
app.use('/', express.static(path.join(__dirname, 'public')));

var server = app.listen(3000);
console.log('Server listening on port 3000');

var io = require('socket.io')(server);
