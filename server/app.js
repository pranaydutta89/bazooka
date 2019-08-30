
var path = require('path');
var app = require('express')();
var http = require('http').createServer(app);
const helmet = require('helmet')
var io = require('socket.io')(http);
var compression = require('compression');
var useragent = require('useragent');
var Events = require('./constants/events');
var api = require('./api');
useragent(true);


function requireHTTPS(req, res, next) {
    if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV !== "development") {
        return res.redirect('https://' + req.get('host') + req.url);
    }
    next();
}

app.use(requireHTTPS);

app.use(helmet());
app.use(compression());
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

    socket.on(Events.socketEvents.api, (msg, cb) => {
        let data;
        switch (msg.event) {
            case Events.socketDataEvents.encryptClientUrl:
                data = api.encryptClientUrl(msg.data);
                cb({
                    type: 'success',
                    data
                });
                break;
            case Events.socketDataEvents.decryptClientUrl:
                data = api.decryptClientUrl(msg.data);
                if (data) {
                    cb({
                        type: 'success',
                        data
                    })
                } else {
                    cb({
                        type: 'error',
                        data: 'No Room found'
                    })
                }
        }
    })

    socket.on(Events.socketEvents.joinRoom, (msg, cb) => {
        if (msg.isAdmin) {
            socket.join(msg.roomId);
            if (roomAdmin[msg.roomId]) {
                roomAdmin[msg.roomId].push(socket.id);
            }
            else {
                roomAdmin[msg.roomId] = [socket.id];
            }
            cb({
                type: 'success'
            });
        }
        else {
            if (socket.adapter.rooms[msg.roomId]) {
                socket.join(msg.roomId);
                cb({
                    type: 'success'
                });
            }
            else {
                //room doesnt exist
                cb({
                    type: 'error',
                    data: "room doesn't exists"
                });
            }
        }
    });

    socket.on(Events.socketEvents.msgToAdmin, (msg, cb) => {
        if (roomAdmin[msg.roomId]) {
            roomAdmin[msg.roomId].forEach(id => {
                io.to(id).emit(Events.socketEvents.msgFromClient, msg.data);
            });
            if (cb && typeof cb === 'function') {
                cb({
                    type: 'success'
                });
            }
        }
        else {
            cb({
                type: 'error',
                data: 'No Admin for room'
            })
        }
    });
    socket.on(Events.socketEvents.msgToClient, (msg, cb) => {
        socket.to(msg.roomId).emit(Events.socketEvents.msgFromAdmin, msg.data);
        if (cb && typeof cb === 'function') {
            cb({
                type: 'success'
            });
        }
    });
});

http.listen(process.env.PORT || 3000, function () {
    console.log('listening...');
});

