var http = require("http");
var websocket = require("ws");
var { v4 } = require("uuid");
var { Room } = require("./Room");
var server = http.createServer((req, resp) => {
    
});

var  wss = new websocket.Server({server});

var rooms = {};

wss.on("connection", (ws) => {
    ws.id = v4();
    console.log(`new client id: ${ws.id} connected!`);
    ws.on("message", (data) => {
        var event = JSON.parse(data.toString());
        if(event.type == 'create') {
            if(event['args']) {
                const roomCode = event.args['code'];
                ws.roomId = roomCode;
                rooms[roomCode] = new Room();
                rooms[roomCode].addPlayer(ws);
                console.log(`room ${roomCode} created!`);
            }
            else {
                const roomId = v4();
                ws.roomId = roomId;
                rooms[roomId] = new Room();
                rooms[roomId].addPlayer(ws);
                console.log(`room ${roomId} created!`);
            }
        }
        else if(event.type == 'join') {
            const roomCode = event.args['code'];
            ws.roomId = roomCode;
            rooms[roomCode].addPlayer(ws);
            rooms[roomCode].broadcast({
                event: "join-done",
                data: "new player joined the room!",
            });
            console.log(`player ${ws.id} joined room ${roomCode}!`);
        }
        else if(event.type == 'leave') {
            const roomCode = event.args['code'];
            rooms[ws.roomId].removePlayer(ws);
            rooms[ws.roomId].broadcast({
                type: "player-left",
                data: `player ${ws.id} has left the room!`,
            });
            console.log(`player ${ws.id} has left the room ${roomCode}!`);
        }
    });

    ws.on("close", (code) => {
        if(ws.roomId) {
            rooms[ws.roomId].removePlayer(ws);
            console.log(rooms[ws.roomId]);
            console.log(`player ${ws.id} left the room ${ws.roomId}`);
            if(Object.keys(rooms[ws.roomId].players).length == 0)
                delete rooms[ws.roomId];
            console.log(rooms);
        }
        else
            console.log("connection closed with code "+code);
    });
});

server.listen(3000 || process.env.PORT, () => {
    console.log("server starting");
});