
// Enemies our player must avoid
var Enemy = function(x,y,speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = x;
    this.y = y;
    this.speed = speed;
    
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + this.speed * dt;
    // Reset the enemy with a new speed after it goes off screen
    this.offScreenX = 505;
    this.startingX = -100;
    if (this.x >= this.offScreenX) {
        this.x = this.startingX;
        this.randomSpeed();
    }
    this.checkCollision();
};

// Speed Multiplier, we increase this value to increase difficulty
// Tried making this a property of enemy, didn't work
// Credit https://github.com/ncaron/frontend-nanodegree-arcade-game/blob/master/js/app.js
var speedMultiplier = 40;

// Random speed generator
Enemy.prototype.randomSpeed = function (){
    // Speed is a random number from 1-10 times speedMultiplier
    this.speed = speedMultiplier * Math.floor(Math.random() * 10 + 1);
};

// Draw the enemy on the screen, required method for game
// Draw the scoreboard on the screen, credit
// https://discussions.udacity.com/t/having-trouble-displaying-the-score/26963
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    ctx.fillStyle = "black";
    ctx.font = "20px Comic Sans MS";
    ctx.fillText("Score: " + player.playerScore, 40, 70);
    ctx.fillText("Lives: " + player.playerLives, 141, 70);
    ctx.fillText("Difficulty: " + speedMultiplier, 260, 70);
};

// Check for collision. 
Enemy.prototype.checkCollision = function() {
    // Set hitboxes for collision detection
    var playerBox = {x: player.x, y: player.y, width: 50, height: 40};
    var enemyBox = {x: this.x, y: this.y, width: 60, height: 70};
    // Check for collisions, if playerBox intersects enemyBox, we have one
    if (playerBox.x < enemyBox.x + enemyBox.width &&
        playerBox.x + playerBox.width > enemyBox.x &&
        playerBox.y < enemyBox.y + enemyBox.height &&
        playerBox.height + playerBox.y > enemyBox.y) {
        // Collision detected, call collisionDetected function
        this.collisionDetected();
    }
};

// Collision detected, decrement playerLives and reset the player
Enemy.prototype.collisionDetected = function() {
    player.playerLives -= 1; 
    player.characterReset();
};


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
// Start the player at 200x by 400y
// credit https://discussions.udacity.com/t/need-help-refactoring/32466
var Player = function() {
    this.startingX = 200;
    this.startingY = 400;
    this.x = this.startingX;
    this.y = this.startingY;
    this.sprite = 'images/char-pink-girl.png';
    this.playerScore = 0;
    this.playerLives = 3;
};

// Required method for game
// Check if playerLives is 0, if so call reset
  Player.prototype.update = function() {
    if (this.playerLives === 0){
         this.characterReset();
   this.playerLives = 3; 
        this.characterReset();
        game.gameReset();
       
    }
  
  
};

// Resets the player position to the start position
Player.prototype.characterReset = function() {
    this.startingX = 200;
    this.startingY = 400;
    this.x = this.startingX;
    this.y = this.startingY;
};

// Increase score and increase difficulty when player reaches top of water
Player.prototype.success = function() {
    this.playerScore += 20;
    speedMultiplier += 5;
    this.characterReset();
};

// Draw the player on the screen, required method for game 
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Move the player according to keys pressed
Player.prototype.handleInput = function(allowedKeys) {
    switch (allowedKeys) {
        case "left":
            //check for wall, otherwise move left
            if (this.x > 0) {
                this.x -= 101;
            }
            break;
        case "right":
            //check for wall, otherwise move right
            if (this.x < 402) {
                this.x += 101;
            }
            break;
        case "up":
            //check if player reached top of water, if so call success function,
            // otherwise move up
            if (this.y < 0) {
                this.success();
            } else {
                this.y -= 83;
            }
            break;
        case "down":
            //check for bottom, otherwise move down
            if (this.y < 400) {
                this.y += 83;
            }
            break;
    }
};


// Instantiate player
var player = new Player();

// Empty allEnemies array
var allEnemies = [];

// Instantiate all enemies, set to 3, push to allEnemies array
for (var i = 0; i < 3; i++) {
    //startSpeed is a random number from 1-10 times speedMultiplier
    var startSpeed = speedMultiplier * Math.floor(Math.random() * 10 + 1);
    //enemys start off canvas (x = -100) at the following Y positions: 60, 145, 230
    allEnemies.push(new Enemy(-100, 60 + (85 * i), startSpeed));
}



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.

/* Re-written as a named function so we can use removeEventListener
 * during "startGame" and "gameOver." Before, the event listener was active
 * during those states, so pressing arrow keys changed the starting position
 * of the player when we switched to "inGame"
 */
var input = function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up', 
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
};
document.addEventListener('keyup', input);
