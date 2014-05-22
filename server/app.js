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

  socket.on("game-over", function(data) {
    game_state = null;
  });

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

var restify = require('restify')
  , userSave = require('save')('user')

var server = restify.createServer({ name: '2048-Rest' })

var gameState;

server
  .use(restify.fullResponse())
  .use(restify.bodyParser())

//Aparece na consola
server.listen(3000, function () {
  console.log('%s listening at %s', server.name, server.url)
});

//Retrieve gameState
server.get('/gameState', function (req, res, next) {
	console.log("Request received from rest get verb on /gameState");
	res.send(gameState);
});

//Create gameState
server.put('/gameState', function (req, res, next) {
	console.log("Request received from rest put verb on /gameState");
	console.log("Params: "+req.params);
	gameState = res.params;
});
