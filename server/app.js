//var io = require("socket.io").listen(8080);
var io = require("socket.io").listen(8080, { log: false });

var socket_global;

var latest = 0;
var game_state;

var current_state = "anarchy";
var democracy_votes = 0;
var anarchy_votes = 1;

var move_votes = [0, 0, 0, 0];  // 0: up, 1: right, 2: down, 3: left
var last_moves = [0, 0, 0, 0, 0, 0, 0, 0];

function vote_counter()  {
	if(anarchy_votes > democracy_votes) {
		current_state = "anarchy";
		clearInterval(vote_checker_democracy);
	} else {
		current_state = "democracy";
		vote_checker_democracy = setInterval(vote_counter_democracy, 5000);
	}
	socket_global.emit("game-mode", current_state);
    socket_global.broadcast.emit("game-mode", current_state);
    console.log("Counting votes: New mode is " + current_state);
}

function vote_counter_democracy()  {
	var max = -1;
	var maxScore = -1;
	for(var i = 0; i < move_votes.length; i++) {
		if(move_votes[i] > maxScore) {
			maxScore = move_votes[i];
			max = i;
		}
	}
    if(last_moves[max*2] != null && last_moves[max*2 + 1] != null && maxScore != 0) {
    	socket_global.emit("move", {'direction':max, 'value1':last_moves[max*2], 'cell1':last_moves[max*2 + 1]});
    	socket_global.broadcast.emit("move", {'direction':max, 'value1':last_moves[max*2], 'cell1':last_moves[max*2 + 1]});
	}
    move_votes = [0, 0, 0, 0];
    //console.log("Counting democracy votes: Move is " + max);
}

var vote_checker;
var vote_checker_democracy;

io.sockets.on("connection", function (socket) {
	socket_global = socket;
	vote_checker = setInterval(vote_counter, 10000);

  socket.on("democracy-vote", function() {
  	console.log("Democracy vote");
  	democracy_votes++;
  });

  socket.on("anarchy-vote", function() {
  	console.log("Anarchy vote");
  	anarchy_votes++;
  });

  socket.on("game-over", function(data) {
    game_state = null;
  });

  socket.on("move", function (data) {
    if(data.timestamp > latest) {
	    if(current_state == "anarchy") {
	    	socket.emit("move", {'direction':data.direction, 'value1':data.value1, 'cell1':data.cell1}); 
	    	socket.broadcast.emit("move", {'direction':data.direction, 'value1':data.value1, 'cell1':data.cell1}); 
	    	latest = data.timestamp;
	    } else {
	    	move_votes[data.direction] = move_votes[data.direction] + 1;
	    	last_moves[data.direction*2] = data.value1;
	    	last_moves[data.direction*2 + 1] = data.cell1;
	    }
	}
  });
});


//REST Server
var restify = require('restify');
var server = restify.createServer({ name: '2048-Rest' });

var gameState;

server
  .use(restify.fullResponse())
  .use(restify.bodyParser())

//Aparece na consola
server.listen(3000, function () {
  //console.log('%s listening at %s', server.name, server.url)
});

//Retrieve gameState
server.get('/gameState', function (req, res, next) {
	//console.log("Request received from rest get verb on /gameState");
	if(gameState != null) {
		res.send(200, gameState);
	} else {
		res.send(404);
	}

});

//Create gameState
server.put('/gameState', function (req, res, next) {
	//console.log("Request received from rest put verb on /gameState");
	//TODO Validate params
	if(valid(req.params)) {
		gameState = req.params;
		res.send(202); //Accepted new game state
	} else
		res.send(406); //game state not acceptable
});

function valid(data) {
	//console.log("Game state from client: " + JSON.stringify(data));
	return true;
}