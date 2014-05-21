var io = require("socket.io").listen(8080);

var latest = 0;
var game_state;

io.sockets.on("connection", function (socket) {
  socket.on("game-state", function () {
    socket.emit("game-state", game_state); 
  });

  socket.on("put-game-state", function (data) {
    game_state = data;
  });

  socket.on("game-over"), function(data) {
    game_state = null;
  }

  socket.on("move", function (data) {
  	//console.log(data);
  	//console.log(latest);
    //console.log(data.timestamp);
    //console.log(data.timestamp);
    if(data.timestamp > latest) {
    	//console.log("ACCEPTED MOVE");
    	socket.emit("move", {'direction':data.direction, 'value1':data.value1, 'value2':data.value2, 'cell1':data.cell1, 'cell2':data.cell2}); 
    	socket.broadcast.emit("move", {'direction':data.direction, 'value1':data.value1, 'value2':data.value2, 'cell1':data.cell1, 'cell2':data.cell2}); 
    	latest = data.timestamp;
    }
  });
});