var io = require("socket.io").listen(8080);

io.sockets.on("connection", function (socket) {
  //socket.emit("game-state", { hello: 'world' });
  socket.on("move", function (data) {
  	console.log("SERVER");
    console.log(data);
    socket.broadcast.emit("move", data); 
  });
});