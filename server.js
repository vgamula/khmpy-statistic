var path = require('path');
var express = require('express');
var _ = require('lodash');

var app = express();
app.use('/', express.static(path.join(__dirname, 'public')));

var server = app.listen(3000);
console.log('Server listening on port 3000');

var io = require('socket.io')(server);

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

io.on('connection', function(socket) {
    io.sockets.emit('data', getData());

    socket.on('vote', function(dataId) {
        var elem = _.findWhere(globalData, {id: dataId});
        if (_.includes(elem.minus, socket)) {
            _.remove(elem.minus, socket);
            elem.plus.push(socket);
        } else if (_.includes(elem.plus, socket)) {
            _.remove(elem.plus, socket);
            elem.minus.push(socket);
        } else {
            elem.plus.push(socket);
        }
        io.sockets.emit('data', getData());
    });

    socket.on('disconnect', function() {
        globalData.map(function(obj) {
            _.remove(obj.minus, socket);
            _.remove(obj.plus, socket);
        });
        io.sockets.emit('data', getData());
    });
});