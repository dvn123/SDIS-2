var io = require("socket.io").listen(8080, { log: false });
//var io = require("socket.io").listen(8080);


var socket_global;

var latest = 0;
var gameState;

var current_state = "anarchy";
var democracy_votes = 0;
var anarchy_votes = 1;

var move_votes = [0, 0, 0, 0];  // 0: up, 1: right, 2: down, 3: left

var value1; //only used in democracy
var cell1; //only used in democracy

//TODO FIX RANDOMS MOVE

function vote_counter()  {
	//console.log("COUNTING VOTES");
	if(anarchy_votes > democracy_votes) {
		current_state = "anarchy";
		clearInterval(vote_checker_democracy);
	} else {
		current_state = "democracy";
		vote_checker_democracy = setInterval(vote_counter_democracy, 5000);
	}
	//democracy_votes = 0;
	//anarchy_votes = 0;
	socket_global.emit("game-mode", current_state);
    socket_global.broadcast.emit("game-mode", current_state);
    //console.log("COUNTING VOTES - NEW MODE = " + current_state);
}

function vote_counter_democracy()  {
	//console.log("COUNTING DEMOCRACY VOTES");
	var max = -1;
	var maxScore = -1;
	for(var i = 0; i < move_votes.length; i++) {
		if(move_votes[i] > maxScore) {
			maxScore = move_votes[i];
			max = i;
		}
	}
    //io.sockets.emit("democracy-vote", {'direction':max, 'value1':value1, 'cell1':cell1});
    if(value1 != null && cell1 != null) {
    	gameState.move_online()
    	socket_global.emit("move", {'direction':max, 'value1':value1, 'cell1':cell1});
    	socket_global.broadcast.emit("move", {'direction':max, 'value1':value1, 'cell1':cell1});
	}
    move_votes = [0, 0, 0, 0];
    console.log("COUNTING DEMOCRACY VOTES");
}

var vote_checker;
var vote_checker_democracy;

io.sockets.on("connection", function (socket) {
	socket_global = socket;
	vote_checker = setInterval(vote_counter, 10000);

  socket.on("democracy-vote", function() {
  	democracy_votes++;
  });

  socket.on("anarchy-vote", function() {
  	anarchy_votes++;
  });

  socket.on("game-over", function(data) {
    gameState = null;
  });

  socket.on("move", function (data) {
  	//console.log(data);
  	//console.log(latest);
    //console.log(data.timestamp);
    //TODO validate packet
    if(data.timestamp > latest) {
	    if(current_state == "anarchy") {
	    	socket.emit("move", {'direction':data.direction, 'value1':data.value1, 'cell1':data.cell1}); 
	    	socket.broadcast.emit("move", {'direction':data.direction, 'value1':data.value1, 'cell1':data.cell1}); 
	    	latest = data.timestamp;
	    } else {
	    	move_votes[data.direction] = move_votes[data.direction] + 1;
	    	value1 = data.value1;
	    	cell1 = data.cell1;
	    }
	}
  });
});

var restify = require('restify');
var server = restify.createServer({ name: '2048-Rest' });

server.use(restify.bodyParser()); // mapped in req.params
server.use(restify.fullResponse()); // mapped in req.params


//Aparece na consola
server.listen(3000, function () {
  console.log('%s listening at %s', server.name, server.url)
});

//Retrieve gameState
server.get('/gameState', function (req, res, next) {
	console.log("Request received from rest get verb on /gameState");
  //console.log("gameState = " + gameState.startTiles);
	if(gameState != null) {
    console.log("gameState != null");
		res.send(gameState);
	} else {
    console.log("gameState == null");
		res.send(404);
	}
});

//Create gameState
server.put('/gameState', function (req, res, next) {
	console.log("Request received from rest put verb on /gameState");
	//console.log("Params: " + JSON.stringify(req.params));
	//TODO Validate params
	gameState = req.params;
  //console.log(gameState.startTiles);
  res.send(200);
});
