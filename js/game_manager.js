var moved = false; //check if there has been a move between ajax request and responde when comparing the state
var singleton;

const server_ip = "http://localhost";
//const server_ip = "http://2048.fe.up.pt";

function GameManager(size, InputManager, Actuator, StorageManager) {
  this.size           = size; // Size of the grid
  this.inputManager   = new InputManager;
  this.storageManager = new StorageManager;
  this.actuator       = new Actuator;
    
  this.startTiles     = 2;

  this.inputManager.on("move", this.move.bind(this));
  this.inputManager.on("restart", this.restart.bind(this));
  this.inputManager.on("keepPlaying", this.keepPlaying.bind(this));

  this.socket = io.connect(server_ip + ":8080");
  this.current_state = "anarchy";

  this.moved = false; 
  this.synch_check;
  
  singleton = this;
  this.socket.on("move", function (data) {
    singleton.move_online(data.direction, data.value1, data.cell1);
    singleton.update();
  });
  
  this.socket.on("resetGame",function() {
	   console.log("someone reset the game");
	   singleton.actuator.continueGame(); // Clear the game won/lost message
	   singleton.setup();
  });

  this.socket.on("game-mode", function (data) {
    this.current_state = data;
    var element = $("#current-button");
    if(this.current_state == "democracy") {
      element.html("Current mode: Democracy");
      element.css('background-color', '#0068af').show(1500);
    } else {
      element.html("Current mode: Anarchy");
      element.css('background-color', '#F2555C').show(1500);
    }    
  });
  this.setup();  
}

GameManager.prototype.update = function() {
  //console.log(this.serialize);
  $.ajax({
    url: server_ip + ":3000/gameState",
    type: "PUT",
    data : this.serialize(),
  })
  .done(function() {
    return true;
  })
  .fail(function( jqXHR, textStatus ) {
    console.log("Error putting game state - " + jqXHR + " - " + textStatus);
  });
  return false;
};

GameManager.prototype.get_state = function(async1) {
  //if async1 is true this is the program initializing
  $.ajax({
    type: "GET",
    async: async1,
    url: server_ip + ":3000/gameState"
  })
  .done(function (data) {
    //console.log("Retrieved existing game state from server");
    console.log(data);
    if(!async1) {
      if(!moved) {
        for(var i=0;i<data.grid.cells.length;i++) {
          for(var j=0; j<data.grid.cells[i].length;j++) {
            if((data.grid.cells[i][j] == null && singleton.grid.cells[i][j] != null) ||
              (data.grid.cells[i][j] != null && singleton.grid.cells[i][j] == null) ||
              (data.grid.cells[i][j] != null && singleton.grid.cells[i][j] != null &&
              data.grid.cells[i][j].value != singleton.grid.cells[i][j].value && 
              data.grid.cells[i][j].position.x != singleton.grid.cells[i][j].position.x && 
              data.grid.cells[i][j].position.y != singleton.grid.cells[i][j].position.y)) {
                console.log("Desynch");
                singleton.grid.cells[i][j] = data.grid.cells[i][j];
                singleton.grid.cells[i][j].value      = parseInt(data.grid.cells[i][j].value);
                singleton.grid.cells[i][j].position.x = parseInt(data.grid.cells[i][j].position.x);
                singleton.grid.cells[i][j].position.y = parseInt(data.grid.cells[i][j].position.y);
            }
          } 
        }		
      }
    } else {
      if(data != null) {		
	    singleton.grid        = new Grid(data.grid.size,data.grid.cells);
        singleton.score       = parseInt(data.score);
        singleton.over        = data.over == 'true';
        singleton.won         = data.won == 'true';
        singleton.keepPlaying = data.keepPlaying == 'true';
        singleton.actuate();
        singleton.synch_checker = setInterval(singleton.get_state, 5000);
      }
    }
    return true;
  })
  .fail(function( jqXHR, textStatus ) {
    console.log("Error putting game state - " + jqXHR.status + " - " + textStatus);
    if(jqXHR.status == 404) {
		  //console.log("Server has no previous game state... building");
      singleton.grid        = new Grid(singleton.size);
      singleton.score       = 0;
      singleton.over        = false;
      singleton.won         = false;
      singleton.keepPlaying = true;
      // Add the initial tiles, does not work, function is undefined
      
      singleton.addStartTiles();
	  
      singleton.actuate();
      singleton.update();
      singleton.synch_checker = setInterval(singleton.get_state, 5000);

    }
  });
  return false;
};

GameManager.prototype.clearGameState = function () {
	singleton.grid        = new Grid(singleton.size);
    singleton.score       = 0;
    singleton.over        = false;
    singleton.won         = false;
    singleton.keepPlaying = true;
    // Add the initial tiles, does not work, function is undefined 
    singleton.addStartTiles();	
	this.socket.emit("resetGame",this.serialize());
};

GameManager.prototype.vote_democracy = function () {
  this.socket.emit("democracy-vote");
};

GameManager.prototype.vote_anarchy = function () {
  //console.log("Anarchy Vote");
  this.socket.emit("anarchy-vote");
};

// Restart the game
GameManager.prototype.restart = function () {
  this.clearGameState();
  this.actuator.continueGame(); // Clear the game won/lost message
  this.setup();
};

// Keep playing after winning (allows going over 2048)
GameManager.prototype.keepPlaying = function () {
  this.keepPlaying = true;
  this.actuator.continueGame(); // Clear the game won/lost message
};

// Return true if the game is lost, or has won and the user hasn't kept playing
GameManager.prototype.isGameTerminated = function () {
  return (this.over || (this.won && !this.keepPlaying));
};

// Set up the game
GameManager.prototype.setup = function () {
 // var this = this;
  this.get_state(true);
};


// Set up the initial tiles to start the game with
GameManager.prototype.addStartTiles = function () {
  for (var i = 0; i < this.startTiles; i++) {
    this.addRandomTile();
  }
};

// Adds a tile in a random position
GameManager.prototype.addRandomTile = function () {
  if (this.grid.cellsAvailable()) {
    var value = Math.random() < 0.9 ? 2 : 4;
    var tile = new Tile(this.grid.randomAvailableCell(), value);

    this.grid.insertTile(tile);
  }
};

GameManager.prototype.addRandomTileOnline = function (value, cell) {
  if (this.grid.cellsAvailable()) {
    var tile = new Tile(cell, value);

    this.grid.insertTile(tile);
  }
};

// Sends the updated grid to the actuator
GameManager.prototype.actuate = function () {
  if (this.storageManager.getBestScore() < this.score) {
    this.storageManager.setBestScore(this.score);
  }

  // Clear the state when the game is over (game over only, not win)
  if (this.over) {
    this.clearGameState();
  } else {
		this.storageManager.setGameState(this.serialize());
  }

  singleton.actuator.actuate(singleton.grid, {
    score:      singleton.score,
    over:       singleton.over,
    won:        singleton.won,
    bestScore:  singleton.storageManager.getBestScore(),
    terminated: singleton.isGameTerminated()
  });

};

// Represent the current game as an object
GameManager.prototype.serialize = function () {
  return {
    grid:        this.grid.serialize(),
    score:       this.score,
    over:        this.over,
    won:         this.won,
    keepPlaying: this.keepPlaying
  };
};

// Save all tile positions and remove merger info
GameManager.prototype.prepareTiles = function () {
  this.grid.eachCell(function (x, y, tile) {
    if (tile) {
      tile.mergedFrom = null;
      tile.savePosition();
    }
  });
};

// Move a tile and its representation
GameManager.prototype.moveTile = function (tile, cell) {
  this.grid.cells[tile.x][tile.y] = null;
  this.grid.cells[cell.x][cell.y] = tile;
  tile.updatePosition(cell);
};

// Move tiles on the grid in the specified direction
GameManager.prototype.move = function (direction) {
  var d = new Date();

  var saveState = this.serialize();
  this.move_without_adding_tiles(direction);

  var value1 = Math.random() < 0.9 ? 2 : 4;
  var cell1 = this.grid.randomAvailableCell();

  this.grid        = new Grid(saveState.grid.size, saveState.grid.cells);
  this.score       = saveState.score;
  this.over        = saveState.over;
  this.won         = saveState.won;
  this.keepPlaying = saveState.keepPlaying;

  this.socket.emit("move", {'direction':direction, 'timestamp':d.getTime(), 'value1':value1, 'cell1':cell1}); //send move to server
};

GameManager.prototype.move_without_adding_tiles = function (direction) {
  // 0: up, 1: right, 2: down, 3: left
  if (this.isGameTerminated()) return; // Don't do anything if the game's over

  var cell, tile;

  var vector     = this.getVector(direction);
  var traversals = this.buildTraversals(vector);
  var moved      = false;

  // Save the current tile positions and remove merger information
  this.prepareTiles();

  // Traverse the grid in the right direction and move tiles
  traversals.x.forEach(function (x) {
    traversals.y.forEach(function (y) {
      cell = { x: x, y: y };
      tile = singleton.grid.cellContent(cell);

      if (tile) {
        var positions = singleton.findFarthestPosition(cell, vector);
        var next      = singleton.grid.cellContent(positions.next);

        // Only one merger per row traversal?
        if (next && next.value === tile.value && !next.mergedFrom) {
          var merged = new Tile(positions.next, tile.value * 2);
          merged.mergedFrom = [tile, next];

          singleton.grid.insertTile(merged);
          singleton.grid.removeTile(tile);

          // Converge the two tiles' positions
          tile.updatePosition(positions.next);

          // Update the score
          singleton.score += merged.value;

          // The mighty 2048 tile
          if (merged.value === 2048) singleton.won = true;
        } else {
          singleton.moveTile(tile, positions.farthest);
        }

        if (!singleton.positionsEqual(cell, tile)) {
          moved = true; // The tile moved from its original cell!
        }
      }
    });
  });
};


GameManager.prototype.move_online = function (direction, value1, cell1) {
  // 0: up, 1: right, 2: down, 3: left
  if (this.isGameTerminated()) return; // Don't do anything if the game's over

  var cell, tile;

  var vector     = this.getVector(direction);
  var traversals = this.buildTraversals(vector);
  var moved      = false;

  // Save the current tile positions and remove merger information
  this.prepareTiles();

  // Traverse the grid in the right direction and move tiles
  traversals.x.forEach(function (x) {
    traversals.y.forEach(function (y) {
      cell = { x: x, y: y };
      tile = singleton.grid.cellContent(cell);

      if (tile) {
        var positions = singleton.findFarthestPosition(cell, vector);
        var next      = singleton.grid.cellContent(positions.next);

        // Only one merger per row traversal?
        if (next && next.value === tile.value && !next.mergedFrom) {
          var merged = new Tile(positions.next, tile.value * 2);
          merged.mergedFrom = [tile, next];

          singleton.grid.insertTile(merged);
          singleton.grid.removeTile(tile);

          // Converge the two tiles' positions
          tile.updatePosition(positions.next);

          // Update the score
          singleton.score += merged.value;

          // The mighty 2048 tile
          if (merged.value === 2048) singleton.won = true;
        } else {
          singleton.moveTile(tile, positions.farthest);
        }

        if (!singleton.positionsEqual(cell, tile)) {
          moved = true; // The tile moved from its original cell!
        }
      }
    });
  });

  if (moved) {
    this.addRandomTileOnline(value1, cell1);

    if (!this.movesAvailable()) {
      this.over = true; // Game over!
    }

    this.actuate();
  }
};

// Get the vector representing the chosen direction
GameManager.prototype.getVector = function (direction) {
  // Vectors representing tile movement
  var map = {
    0: { x: 0,  y: -1 }, // Up
    1: { x: 1,  y: 0 },  // Right
    2: { x: 0,  y: 1 },  // Down
    3: { x: -1, y: 0 }   // Left
  };

  return map[direction];
};

// Build a list of positions to traverse in the right order
GameManager.prototype.buildTraversals = function (vector) {
  var traversals = { x: [], y: [] };

  for (var pos = 0; pos < this.size; pos++) {
    traversals.x.push(pos);
    traversals.y.push(pos);
  }

  // Always traverse from the farthest cell in the chosen direction
  if (vector.x === 1) traversals.x = traversals.x.reverse();
  if (vector.y === 1) traversals.y = traversals.y.reverse();

  return traversals;
};

GameManager.prototype.findFarthestPosition = function (cell, vector) {
  var previous;

  // Progress towards the vector direction until an obstacle is found
  do {
    previous = cell;
    cell     = { x: previous.x + vector.x, y: previous.y + vector.y };
  } while (this.grid.withinBounds(cell) &&
           this.grid.cellAvailable(cell));

  return {
    farthest: previous,
    next: cell // Used to check if a merge is required
  };
};

GameManager.prototype.movesAvailable = function () {
  return this.grid.cellsAvailable() || this.tileMatchesAvailable();
};

// Check for available matches between tiles (more expensive check)
GameManager.prototype.tileMatchesAvailable = function () {
  var tile;

  for (var x = 0; x < this.size; x++) {
    for (var y = 0; y < this.size; y++) {
      tile = this.grid.cellContent({ x: x, y: y });

      if (tile) {
        for (var direction = 0; direction < 4; direction++) {
          var vector = singleton.getVector(direction);
          var cell   = { x: x + vector.x, y: y + vector.y };

          var other  = singleton.grid.cellContent(cell);

          if (other && other.value === tile.value) {
            return true; // These two tiles can be merged
          }
        }
      }
    }
  }

  return false;
};

GameManager.prototype.positionsEqual = function (first, second) {
  return first.x === second.x && first.y === second.y;
};
