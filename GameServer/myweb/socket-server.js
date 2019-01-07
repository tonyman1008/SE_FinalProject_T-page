
var Socket = require("socket.io");
var controller = require("./controller");
var global = require("./global");


const SocketServer = function (server) {

    var io = Socket(server);  

    // 當玩家連進伺服器時
    io.on("connection", function (socket) {      

        global.connectedSockets[socket.id] = socket;
       
        global.LogconnectedUser();


        socket.on("action", function (data) {
            
            data["socketid"] = socket.id;

            if (!global.isGuest(socket.id))
                data["username"] = global.loginUsers[socket.id];

            controller.Clientaction(data);
            
        });


        socket.on("disconnect", function (socket) {

            global.checkIsOnline();

            global.LogconnectedUser();
        });

    });


};

module.exports = SocketServer;
