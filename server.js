var http = require('http')
  , path = require('path')
  , express = require('express')
  , app = express()


var server = http.Server(app)
  , io = require('socket.io')(server);


var session = require("express-session")({
    secret: "my-secret",
    resave: true,
    saveUninitialized: true
});
var sharedsession = require("express-socket.io-session");

app.use(session); 

io.use(sharedsession(session, {
    autoSave: true
})); 


app.use('/', express.static(path.join(__dirname, 'public')));


io.on('connection', function (socket) {
    if (!socket.handshake.session.id) {
        socket.handshake.session.id = socket.id;
    }
    console.log(socket.handshake.session.id);
});

server.listen(3000);
console.log('Listening on port 3000')

// var path = require('path');
// var express = require('express');
// var Server = require('http').Server;
// var session = require("express-session");
// var RedisStore = require("connect-redis")(session);

// var _ = require('lodash');

// var app = express();
// app.use('/', express.static(path.join(__dirname, 'public')));



// var server = Server(app);
// var io = require("socket.io")(server);

// var sessionMiddleware = session({
//     store: new RedisStore({}), // XXX redis server config
//     secret: "keyboard cat",
// });

// io.use(function(socket, next) {
//     sessionMiddleware(socket.request, socket.request.res, next);
// });
// app.use(sessionMiddleware);

// server.listen(3000)
// console.log('Server listening on port 3000');


// var globalData = [
//     {
//         id: 1,
//         title: 'first',
//         plus: [],
//         minus: []
//     },
//     {
//         id: 2,
//         title: 'second',
//         plus: [],
//         minus: []
//     },
//     {
//         id: 3,
//         title: 'third',
//         plus: [],
//         minus: []
//     },
//     {
//         id: 4,
//         title: 'fifth',
//         plus: [],
//         minus: []
//     }
// ];

// function getData() {
//     return globalData.map(function(obj) {
//         return {
//             id: obj.id,
//             title: obj.title,
//             plus: obj.plus.length,
//             minus: obj.minus.length,
//             amount: obj.plus.length + obj.minus.length,
//         }
//     });
// }

// io.on('connection', function(socket) {
//     console.log(socket.request.session);


//     io.sockets.emit('data', getData());

//     socket.on('vote', function(dataId) {
//         var elem = _.findWhere(globalData, {id: dataId});
//         if (_.includes(elem.minus, socket)) {
//             _.remove(elem.minus, socket);
//             elem.plus.push(socket);
//         } else if (_.includes(elem.plus, socket)) {
//             _.remove(elem.plus, socket);
//             elem.minus.push(socket);
//         } else {
//             elem.plus.push(socket);
//         }
//         io.sockets.emit('data', getData());
//     });

//     socket.on('disconnect', function() {
//         globalData.map(function(obj) {
//             _.remove(obj.minus, socket);
//             _.remove(obj.plus, socket);
//         });
//         io.sockets.emit('data', getData());
//     });
// });