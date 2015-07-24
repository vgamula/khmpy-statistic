var http = require('http');
var path = require('path');
var express = require('express');
var app = express();
var _ = require('lodash');


var server = http.Server(app);
var io = require('socket.io')(server);

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


server.listen(3000);
console.log('Listening on port 3000')


var globalData = [
    {
        id: 1,
        title: 'first',
        plus: [],
        minus: []
    },
    {
        id: 2,
        title: 'second',
        plus: [],
        minus: []
    },
    {
        id: 3,
        title: 'third',
        plus: [],
        minus: []
    },
    {
        id: 4,
        title: 'fifth',
        plus: [],
        minus: []
    }
];

function getData() {
    return globalData.map(function(obj) {
        return {
            id: obj.id,
            title: obj.title,
            plus: obj.plus.length,
            minus: obj.minus.length,
            amount: obj.plus.length + obj.minus.length,
        }
    });
}

function removeByValue(arr, val) {
    _.remove(arr, function(obj) {
        return obj === val;
    });
}

var getDataForSocket = function(socket) {
    var socketId = socket.handshake.session.id;
    return globalData.map(function(obj) {
        return {
            id: obj.id,
            title: obj.title,
            plus: obj.plus.length,
            minus: obj.minus.length,
            amount: obj.plus.length + obj.minus.length,
            vote: _.includes(obj.plus, socketId) ? 'plus' : null
        }
    });
}

var clients = [];

function updateData() {
    clients.map(function(socket) {
        socket.emit('data', getDataForSocket(socket))
    });
}


io.on('connection', function(socket) {
    if (!socket.handshake.session.id) {
        socket.handshake.session.id = socket.id;
    }
    clients.push(socket);
    // console.log(socket.handshake.session.id);

    updateData();

    socket.on('vote', function(dataId) {
        var socketId = socket.handshake.session.id;
        var elem = _.findWhere(globalData, {id: dataId});
        if (_.includes(elem.minus, socketId)) {
            removeByValue(elem.minus, socketId);
            elem.plus.push(socketId);
        } else if (_.includes(elem.plus, socketId)) {
            removeByValue(elem.plus, socketId);
            elem.minus.push(socketId);
        } else {
            elem.plus.push(socketId);
        }
        updateData();
    });

    socket.on('disconnect', function() {
        _.remove(clients, socket);
        var socketId = socket.handshake.session.id;
        globalData.map(function(obj) {
            removeByValue(obj.minus, socketId);
            removeByValue(obj.plus, socketId);
        });
        updateData();
    });
});