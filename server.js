
var express = require('express');
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var compression = require('compression')

app.use(compression())

app.use(express.static('dist'))

io.on('connection', function (socket) {
    socket.on('userJoined', function (msg) {
        io.emit('userJoined', msg);
    });
    socket.on('userTapped', function (msg) {
        io.emit('userTapped', msg);
    });

    socket.on('reset', function (msg) {
        io.emit('reset', msg);
    });
});

http.listen(process.env.PORT || 3000, function () {
    console.log('listening...');
});