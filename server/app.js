
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

io.on('connection', function (socket) {
    socket.on('userJoined', function (msg) {
        console.log(`user joined  - ${JSON.stringify(msg)}`)
        io.emit('userJoined', msg);
    });
    socket.on('userTapped', function (msg) {
        console.log(`user Tapped  - ${JSON.stringify(msg)}`)
        io.emit('userTapped', msg);
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
  });