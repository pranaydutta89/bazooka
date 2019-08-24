
var path = require('path');
var app = require('express')();
var http = require('http').createServer(app);
const helmet = require('helmet')
var io = require('socket.io')(http);
var compression = require('compression');
var useragent = require('useragent');
useragent(true);


app.use(helmet());
app.use(compression());
//app.use(express.static('public'));
const roomAdmin = {};


app.get('*', (req, res) => {
    if (useragent.is(req.headers['user-agent']).android || useragent.is(req.headers['user-agent']).mobile_safari ||
        useragent.is(req.headers['user-agent']).ie) {
        if (req.path == '/') {
            res.sendFile(path.resolve(__dirname, 'es5-bundled', 'index.html'))
        }
        else {
            res.sendFile(path.resolve(__dirname + '/es5-bundled' + req.path))
        }
    }
    else {
        if (req.path == '/') {
            res.sendFile(path.resolve(__dirname, 'uncompiled-unbundled', 'index.html'))
        }
        else {
            res.sendFile(__dirname + '/uncompiled-unbundled' + req.path)
        }
    }
});

io.on('connection', (socket) => {

    socket.on('joinRoom', (msg, cb) => {
        if (msg.isAdmin) {
            socket.join(msg.roomId);
            if (roomAdmin[msg.roomId]) {
                roomAdmin[msg.roomId].push(socket.id);
            }
            else {
                roomAdmin[msg.roomId] = [socket.id];
            }
            cb();
        }
        else {
            if (socket.adapter.rooms[msg.roomId]) {
                socket.join(msg.roomId);
                cb();
            }
            else {
                //room doesnt exist
                cb('room Does not exist');
            }
        }
    });

    socket.on('msgToAdmin', (msg, cb) => {
        roomAdmin[msg.roomId].forEach(id => {
            io.to(id).emit('msgFromClient', msg.data);
        });
        if (cb && typeof cb === 'function') {
            cb();
        }
    });
    socket.on('msgToClient', (msg, cb) => {
        socket.to(msg.roomId).emit('msgFromAdmin', msg.data);
        if (cb && typeof cb === 'function') {
            cb();
        }
    });
});

http.listen(process.env.PORT || 3000, function () {
    console.log('listening...');
});