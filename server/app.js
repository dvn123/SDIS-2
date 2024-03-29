//var io = require("socket.io").listen(8080);
var io = require("socket.io").listen(8080, { log: false });
var dbSocket = require("./DBHandler.js");
var database = new dbSocket();

//REST Server
var restify = require('restify');
var server = restify.createServer({ name: '2048-Rest' });


var gameState;

server.use(restify.fullResponse()).use(restify.bodyParser());
server.use(restify.throttle({
  burst: 100,
  rate: 25,
  ip: true
}));

var socket_global;

var latest = 0;
var game_state;

var current_state = "anarchy";
var democracy_votes = 0;
var anarchy_votes = 1;

var move_votes = [0, 0, 0, 0];  // 0: up, 1: right, 2: down, 3: left
var last_moves = [0, 0, 0, 0, 0, 0, 0, 0];

var anarchy_log;

var vote_checker;
var vote_checker_democracy;

var last_connection = {};
var vote_throttle = {};
var throttle = 50;
var vote_throttle_n = 1000;

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
    //console.log("Counting votes: New mode is " + current_state);
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

io.sockets.on("connection", function (socket) {
	socket_global = socket;
	vote_checker = setInterval(vote_counter, 10000);
	anarchy_log=[];

    socket.on("democracy-vote", function(data) {
        //console.log("Democracy vote");
        if(data < vote_throttle[socket.id] + vote_throttle_n) {
            //refuse
            //console.log("Refused");
            vote_throttle[socket.id] = data + vote_throttle_n * 3;
            return;
        }
        //console.log("Accepted");
        vote_throttle[socket.id] = data;
        socket.emit("democracy-vote", democracy_votes);
        socket.broadcast.emit("democracy-vote", democracy_votes);
        democracy_votes++;
    });

    socket.on("anarchy-vote", function(data) {
        //console.log("Anarchy vote");
        if(data < vote_throttle[socket.id] + vote_throttle_n) {
            //refuse
            //console.log("Refused");
            vote_throttle[socket.id] = data + vote_throttle_n * 3;
            return;
        }
        //console.log("Accepted");
        vote_throttle[socket.id] = data;
        socket.emit("anarchy-vote", anarchy_votes);
        socket.broadcast.emit("anarchy-vote", anarchy_votes);
        anarchy_votes++;
    });
	
  socket.on("game-over", function(data) {
    game_state = null;
	anarchy-votes=1;
	democracy_votes=0;
	move_votes = [0, 0, 0, 0];
	last_moves = [0, 0, 0, 0, 0, 0, 0, 0];
	anarchy_log = null;
	
  });

  socket.on("move", function (data) {
    if(data.timestamp < last_connection[socket.id] + throttle) {
      //refuse
      last_connection[socket.id] = data.timestamp + throttle * 3;
      return;
    }
    last_connection[socket.id] = data.timestamp;
    if(data.timestamp > latest) {
	    if(current_state == "anarchy") {
	    	socket.emit("move", {'direction':data.direction, 'value1':data.value1, 'cell1':data.cell1}); 
	    	socket.broadcast.emit("move", {'direction':data.direction, 'value1':data.value1, 'cell1':data.cell1}); 
	    	latest = data.timestamp;
	    } else {
	    	move_votes[data.direction] = move_votes[data.direction] + 1;
	    	last_moves[data.direction*2] = data.value1;
	    	last_moves[data.direction*2 + 1] = data.cell1;
            socket.emit("democracy-move-vote", data.direction);
            socket.broadcast.emit("democracy-move-vote", data.direction);
        }
	}
  });
  
	socket.on("resetGame", function (data) 	{
		//console.log("\n\ndeleting game state\n\n");
		//console.log("new data:");
		//console.log(data);
		if(valid(data))
			gameState = data;
		//printGameState();
		socket.broadcast.emit("resetGame");
	});
});

//Aparece na consola
server.listen(3000, function () {
  //console.log('%s listening at %s', server.name, server.url)
});

//Retrieve gameState
server.get('/gameState', function (req, res, next) {
	//console.log("Request received from rest get verb on /gameState");
	/*if(req.headers['referer'] != "http://localhost/sdis-2/") {
	//if(req.headers['referer'] != "http://2048.fe.up.pt/") {
    	return;
  	}*/
	if(gameState != null) {
        gameState["anarchy_votes"] = anarchy_votes;
        gameState["democracy_votes"] = democracy_votes;
        //console.log(JSON.stringify(gameState));
		res.send(200, gameState);
	} else {
		res.send(404);
	}
	res.end();
});

//Create gameState
server.put('/gameState', function (req, res, next) {
	if(valid(req.params))
	{
		res.send(202); //Accepted new game state
	}
	else
		res.send(406); //game state not acceptable
	res.end();
	return next();
});

/*
server.put('/user',function (req, res, next) {
    console.log(req.params);
	var aux = database.getUser(req.params.username,function(err,results){
		var r = $.Deferred();

		//console.log(results);
		//console.log(err);
		if(err)
		{
			console.log("Error launched");
			res.send(406);
		}
		else
		{
			console.log("Query successful");
			res.send(202,results); 
		}
		setTimeout(function () {
		// and call `resolve` on the deferred object, once you're done
		r.resolve();
		}, 2500);
	return r;
		
	}).done();
	console.log("ola");
	console.log(aux);
	res.send(202);
	res.end();
	return next();
});

server.put('/database',function (req, res, next) {
	
    database.registerUser(req.params,function(err,results){
		if(err)
		{
			console.log("Query has error");
			res.send(406);
		}
		else
		{
			console.log("Query successful");
			res.send(202,results); 
		}
		res.end();
		return next();
	});
});
*/
function valid(data) {
	gameState={};	
	gameState["grid"]=data.grid;
	
	gameState.grid["size"]=parseInt(data.grid.size);
	
	for(var i=0;i<data.grid.cells.length;i++) {
        for(var j=0; j<data.grid.cells[i].length;j++) 
		{
		if(data.grid.cells[i][j]!='' && data.grid.cells[i][j]!=null) {
				//console.log(data.grid.cells[i][j]);
				gameState["grid"].cells[i][j]            = data.grid.cells[i][j];
				gameState["grid"].cells[i][j].value      = parseInt(data.grid.cells[i][j].value);
				gameState["grid"].cells[i][j].position.x = parseInt(data.grid.cells[i][j].position.x);
				gameState["grid"].cells[i][j].position.y = parseInt(data.grid.cells[i][j].position.y);
		}
		else
			gameState["grid"].cells[i][j] = null;
		}
	}
	
	gameState["score"]       = parseInt(data.score);
	gameState["over"]        = data.over == 'true';
    gameState["won"]         = data.won == 'true';
    gameState["keepPlaying"] = data.keepPlaying == 'true';
		
	//printGameState();
	return true;
}

function printGameState() {
	var str="";
	console.log("\nCurrent Server Game State");
	console.log("Grid size: "+gameState["grid"].size);
	console.log("Grid State: ");
	for(var i=0;i<gameState.grid.cells.length;i++) {
		str+="[";
        for(var j=0; j<gameState.grid.cells[i].length;j++) {
			str+="[";
			if(gameState.grid.cells[i][j]!='' && gameState.grid.cells[i][j]!=null)
				{str+="Position: ("+i+","+j+"), value: "+gameState.grid.cells[i][j].value;}
			else
				str+="null";
			str+="]";
			if(j<gameState.grid.cells[i].length-1)
				str+=",";
		}
		if(i<gameState.grid.cells.length-1)
			str+="],\n";
		else
			str+="]\n";
	}
	console.log(str);
	console.log("Score: "+gameState["score"]);
	console.log("Is it over?: "+gameState["over"]);
	console.log("Is it won? o.O... "+gameState["won"]);
	console.log("keepPlaying: "+gameState["keepPlaying"]);
	console.log("");
		
	return;
};