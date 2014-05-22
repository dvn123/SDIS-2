var moved = false; //check if there has been a move between ajax request and responde when comparing the state

function GameManager(size, InputManager, Actuator, StorageManager) {
  this.size           = size; // Size of the grid
  this.inputManager   = new InputManager;
  this.storageManager = new StorageManager;
  this.actuator       = new Actuator;

  this.startTiles     = 2;

  this.inputManager.on("move", this.move.bind(this));
  this.inputManager.on("restart", this.restart.bind(this));
  this.inputManager.on("keepPlaying", this.keepPlaying.bind(this));

  this.socket = io.connect('http://localhost:8080');
  this.current_state = "anarchy";

  //this.moved = false; 

  var self = this;
  this.socket.on("move", function (data) {
    //console.log("RECEIVED MOVE");
    //console.log(data.direction);
    self.move_online(data.direction, data.value1, data.cell1);
    self.update();
    //self.socket.emit("put-game-state", self.serialize());
  });

  this.socket.on("game-mode", function (data) {
    //console.log("RECEIVED STATE");
    //console.log(data);
    self.current_state = data;
  });


  this.setup();  
}

/*function update() {
  $.ajax({
    url : "http://localhost:3000/gameState",
    type: "PUT",
    data : data,
  })
  .fail(function( jqXHR, textStatus ) {
    console.log("Error putting game state - " + jqXHR + " - " + textStatus);
  });
}

function get_state(async1) {
  $.ajax({
    type: "GET",
    async: async1,
    url : "http://localhost:3000/gameState"
  })
  .done(function (data) {
      if(!moved) {
        //compare states
      }
      return true;
  })
  .fail(function( jqXHR, textStatus ) {
    console.log("Error putting game state - " + jqXHR + " - " + textStatus);
  });
  return false;
}*/

GameManager.prototype.update = function() {
  var self = this;
  $.ajax({
    url : "http://localhost:3000/gameState",
    type: "PUT",
    data : self.serialize(),
  })
  .done(function() {
    return true;
  })
  .fail(function( jqXHR, textStatus ) {
    console.log("Error putting game state - " + jqXHR + " - " + textStatus);
  });
  return false;
}

GameManager.prototype.get_state = function(async1) {
  //if async1 is true this is the program initializing
  $.ajax({
    type: "GET",
    async: async1,
    url : "http://localhost:3000/gameState"
  })
  .done(function (data) {
    console.log(data);
    if(!async1) {
      if(!moved) {
        //compare states
      }
    } else {
      if(data != null) {
        self.grid        = new Grid(data.grid.size, data.grid.cells); // Reload grid
        self.score       = data.score;
        self.over        = data.over;
        self.won         = data.won;
        self.keepPlaying = data.keepPlaying;
      }
    }
    return true;
  })
  .fail(function( jqXHR, textStatus ) {
    console.log("Error putting game state - " + jqXHR.status + " - " + textStatus);
    if(jqXHR.status == 404) {
      self.grid        = new Grid(self.size);
      self.score       = 0;
      self.over        = false;
      self.won         = false;
      self.keepPlaying = false;
      // Add the initial tiles
      self.addStartTiles();
      self.update();
    }
  });
  return false;
}

GameManager.prototype.vote_democracy = function () {
  //console.log("DEMOCRACY VOTE");
  this.socket.emit("vote-democracy");
};

GameManager.prototype.vote_anarchy = function () {
  //console.log("ANARCHY VOTE");
  this.socket.emit("vote-anarchy");
};

// Restart the game
GameManager.prototype.restart = function () {
  this.storageManager.clearGameState();
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
  return this.over || (this.won && !this.keepPlaying);
};

// Set up the game
GameManager.prototype.setup = function () {
  var self = this;
  this.get_state(true);

  /*this.socket.on("game-state", function (data) {
      //console.log("RECEIVED GAME STATE");
      //console.log(data);
      if(data != null) {
        self.grid        = new Grid(data.grid.size,
                                  data.grid.cells); // Reload grid
        self.score       = data.score;
        self.over        = data.over;
        self.won         = data.won;
        self.keepPlaying = data.keepPlaying;
      } else {
        //console.log("nul2l");
        self.grid        = new Grid(self.size);
        self.score       = 0;
        self.over        = false;
        self.won         = false;
        self.keepPlaying = false;

        // Add the initial tiles
        self.addStartTiles();
        //self.socket.emit("put-game-state", self.serialize());
      }

      // Update the actuator
      self.actuate();
  });

  this.socket.emit("game-state");*/
  /*var previousState = this.storageManager.getGameState();

  // Reload the game from a previous game if present
  if (previousState) {
    this.grid        = new Grid(previousState.grid.size,
                                previousState.grid.cells); // Reload grid
    this.score       = previousState.score;
    this.over        = previousState.over;
    this.won         = previousState.won;
    this.keepPlaying = previousState.keepPlaying;
  } else {
    this.grid        = new Grid(this.size);
    this.score       = 0;
    this.over        = false;
    this.won         = false;
    this.keepPlaying = false;

    // Add the initial tiles
    this.addStartTiles();
  }

  // Update the actuator
  this.actuate();*/
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
    this.storageManager.clearGameState();
  } else {
    this.storageManager.setGameState(this.serialize());
  }

  this.actuator.actuate(this.grid, {
    score:      this.score,
    over:       this.over,
    won:        this.won,
    bestScore:  this.storageManager.getBestScore(),
    terminated: this.isGameTerminated()
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
  var value1 = Math.random() < 0.9 ? 2 : 4;
  var cell1 = this.grid.randomAvailableCell();

  this.socket.emit("move", {'direction':direction, 'timestamp':d.getTime(), 'value1':value1, 'cell1':cell1}); //send move to server
  //this.socket.emit("put2", self.serialize()); //send move to server
  // 0: up, 1: right, 2: down, 3: left
  /*var self = this;

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
      tile = self.grid.cellContent(cell);

      if (tile) {
        var positions = self.findFarthestPosition(cell, vector);
        var next      = self.grid.cellContent(positions.next);

        // Only one merger per row traversal?
        if (next && next.value === tile.value && !next.mergedFrom) {
          var merged = new Tile(positions.next, tile.value * 2);
          merged.mergedFrom = [tile, next];

          self.grid.insertTile(merged);
          self.grid.removeTile(tile);

          // Converge the two tiles' positions
          tile.updatePosition(positions.next);

          // Update the score
          self.score += merged.value;

          // The mighty 2048 tile
          if (merged.value === 2048) self.won = true;
        } else {
          self.moveTile(tile, positions.farthest);
        }

        if (!self.positionsEqual(cell, tile)) {
          moved = true; // The tile moved from its original cell!
        }
      }
    });
  });

  if (moved) {
    this.addRandomTile();

    if (!this.movesAvailable()) {
      this.over = true; // Game over!
    }

    this.actuate();
    
  }*/
};

GameManager.prototype.move_online = function (direction, value1, cell1) {
  // 0: up, 1: right, 2: down, 3: left
  var self = this;

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
      tile = self.grid.cellContent(cell);

      if (tile) {
        var positions = self.findFarthestPosition(cell, vector);
        var next      = self.grid.cellContent(positions.next);

        // Only one merger per row traversal?
        if (next && next.value === tile.value && !next.mergedFrom) {
          var merged = new Tile(positions.next, tile.value * 2);
          merged.mergedFrom = [tile, next];

          self.grid.insertTile(merged);
          self.grid.removeTile(tile);

          // Converge the two tiles' positions
          tile.updatePosition(positions.next);

          // Update the score
          self.score += merged.value;

          // The mighty 2048 tile
          if (merged.value === 2048) self.won = true;
        } else {
          self.moveTile(tile, positions.farthest);
        }

        if (!self.positionsEqual(cell, tile)) {
          moved = true; // The tile moved from its original cell!
        }
      }
    });
  });

  if (moved) {
    //console.log(cell1);
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
  var self = this;

  var tile;

  for (var x = 0; x < this.size; x++) {
    for (var y = 0; y < this.size; y++) {
      tile = this.grid.cellContent({ x: x, y: y });

      if (tile) {
        for (var direction = 0; direction < 4; direction++) {
          var vector = self.getVector(direction);
          var cell   = { x: x + vector.x, y: y + vector.y };

          var other  = self.grid.cellContent(cell);

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
