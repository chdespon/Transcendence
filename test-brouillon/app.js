const Express = require("express")();
const Http = require("http").Server(Express);
const Socketio = require("socket.io")(Http);

var position = {
    x: 200,
    y: 200
};

Socketio.on("connection", function(socket) {
    console.log("connection to socket");
    socket.emit("position", position);
    socket.on("move", data => {
        console.log("oskour");
        switch(data) {
            case "left":
                position.x -= 5;
                Socketio.emit("position", position);
                break;
            case "right":
                position.x += 5;
                Socketio.emit("position", position);
                break;
            case "up":
                position.y -= 5;
                Socketio.emit("position", position);
                break;
            case "down":
                position.y += 5;
                Socketio.emit("position", position);
                break;
        }
    });
});

Http.listen(3001, () => {
    console.log("Listening at :3001...");
});