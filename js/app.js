var Enemy = function(row, speed) {

    this.sprite = 'images/enemy-bug.png';
    this.x = -1;
    this.y = -.25 + row;
    this.speed = speed;

}

Enemy.prototype.update = function(dt) {
    this.x += this.speed*dt;
    if(this.x > 5){
        var index = gameEntities.allEnemies.indexOf(this);
        gameEntities.allEnemies.splice(index, 1);
        gameEntities.generateEnemies();
    }
}

Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x * 101, this.y * 83);
}

var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.x = 2;
    this.y = 3.75;
}

Player.prototype.update = function(dt) {
    for(var i = 0; i < gameEntities.allEnemies.length; i++){
        xDistanceBetween = Math.abs(gameEntities.allEnemies[i].x - this.x);
        yDistanceBetween = Math.abs(gameEntities.allEnemies[i].y - this.y);
        if(xDistanceBetween <= .55 && yDistanceBetween === 0){
            this.x = 2;
            this.y = 3.75;
        }
    }
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x * 101, this.y * 83);
}

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
}

var gameEntities = {
    player: {},
    allEnemies: [],
    candidateRows: [],
    initializeEntities: function(){
        this.getPossibleRows();
        this.player = new Player();
        this.generateEnemies();
    },
    getPossibleRows: function(){
        var numRows = gameSizeHolder.numRows;
        var grassRows = gameSizeHolder.grassRows;
        var waterRows = gameSizeHolder.waterRows;
        for(var i = waterRows; i < (numRows - grassRows); i++){
            this.candidateRows.push(i);
        }
    },
    generateEnemies: function(){
        while(this.allEnemies.length < 3){
            var randomRow = this.candidateRows[Math.floor(Math.random()*this.candidateRows.length)];
            var randomSpeed = Math.random() + .3
            this.allEnemies.push(new Enemy(randomRow, randomSpeed));    
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
