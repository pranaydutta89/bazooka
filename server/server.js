
var express = require('express');
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var compression = require('compression');
var games = require('./games');

app.use(compression())

app.use(express.static('dist'))

io.on('connection', (socket) => {
    socket.on('joinRoom', (msg,cb) => {
        if (msg.isAdmin) {
            socket.join(msg.roomId);
            games(io.to(msg.roomId), msg.roomId, socket.id);
            cb();
        }
        else {
            if (socket.adapter.rooms[msg.roomId]) {
                socket.join(msg.roomId);
                games(io.to(msg.roomId));
                cb();
            }
            else {
                //room doesnt exist
                cb('room Does not exist');
            }
        }
    });
});

http.listen(process.env.PORT || 3000, function () {
    console.log('listening...');
});