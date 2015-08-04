/*
 * Enemies are given a random row, speed, and each has 50/50 chance of spawning on
 * left or right side
 */
var Enemy = function(row, speed, spawnsRightSide) {

    this.rightFacingSprite = 'images/enemy-bug-rightfacing.png';
    this.leftFacingSprite = 'images/enemy-bug-leftfacing.png';
    this.spawnsRightSide = spawnsRightSide;
    if(this.spawnsRightSide){
        this.x = gameSizeHolder.numCols; // places enemy at right side of map
        this.speed = -speed;             // reverses enemy movement
    } else {
        this.x = -1
        this.speed = speed;
    }

    this.y = -.25 + row;

};

/*
 * If the enemy object moves beyond the left or right boundaries of the game map, the
 * function removes this enemy from the list of enemies and creates a new enemy
 */
Enemy.prototype.update = function(dt) {
    this.x += this.speed*dt;
    if(this.x > gameSizeHolder.numCols || this.x < -1){
        var index = gameEntities.allEnemies.indexOf(this);
        gameEntities.allEnemies.splice(index, 1);
        gameEntities.generateEnemies();
    }
};

/*
 * Depending on the enemy's spawnsRightSide field, this will render the enemy using
 * the left facing sprite or the right facing sprite
 */
Enemy.prototype.render = function() {
    if (this.spawnsRightSide) {
        ctx.drawImage(Resources.get(this.leftFacingSprite), this.x * 101, this.y * 83);
    } else {
        ctx.drawImage(Resources.get(this.rightFacingSprite), this.x * 101, this.y * 83);
    }   
};

var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.x = 2;
    this.y = 3.75;
};

/*
 * Checks against all enemy objects the distance between the enemy and the player
 * in terms of the coordinate system - if the distance is small enough, then the 
 * player is reset to his/her original position
 */
Player.prototype.update = function(dt) {
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x * 101, this.y * 83);
};

/*
 * Arrow keys shift the player in the desired direction by 1, limited by the 
 * boundaries of the game map
 */
Player.prototype.handleInput = function(movementKey) {
    if(movementKey === 'left' && this.x >= 1){
        this.x -= 1;
    }else if(movementKey === 'right' && this.x <= gameSizeHolder.numCols - 2){
        this.x += 1;
    }else if(movementKey === 'up' && this.y >= gameSizeHolder.waterRows){
        this.y -= 1;
    }else if(movementKey ===  'down' && this.y <= gameSizeHolder.numRows - 2){
        this.y += 1;
    }
};

/*
 * Holds all the enemy and player objects - initialized in engine.js once that file 
 * loads to get the number of rows of each type (stone, grass, water) in order to
 * spawn the correct number of enemies in the correct rows
 */
var gameEntities = {
    player: {},
    allEnemies: [],
    candidateRows: [], /* holds integers that represent the row numbers of the possible rows for enemies to spawn in */
    initializeEntities: function(){
        this.getPossibleRows(); /* gets the candidate rows */
        this.player = new Player();
        this.generateEnemies();
    },
    getPossibleRows: function(){
        var numRows = gameSizeHolder.numRows; /* total number of rows */
        var grassRows = gameSizeHolder.grassRows;
        var waterRows = gameSizeHolder.waterRows;

        /* 
         * coordinates are measured from the top left corner, as per HTML Canvas,
         * so we start at the number of the water rows and push the numbers between
         * the last water row and the last stone row
         */
        for(var i = waterRows; i < (numRows - grassRows); i++){
            this.candidateRows.push(i);
        }
    },
    /* Generates an enemy on a random row, side, and at a random speed */
    generateEnemies: function(){
        while(this.allEnemies.length < gameSizeHolder.enemyRows){
            var randomRow = this.candidateRows[Math.floor(Math.random()*this.candidateRows.length)];
            var randomSpeed = Math.random() + .3
            var randomSeed = Math.random();
            var randomSpawnSide;
            if (randomSeed < .5)
                randomSpawnSide = true;
            else
                randomSpawnSide = false;
            this.allEnemies.push(new Enemy(randomRow, randomSpeed, randomSpawnSide));    
        }


    }
};

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    gameEntities.player.handleInput(allowedKeys[e.keyCode]);
});
