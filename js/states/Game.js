var MrHop = MrHop || {};

MrHop.GameState = {

  init: function() {
    
    //pool of floors
    this.floorPool = this.add.group();
    
    //pool of platforms
    this.platformPool = this.add.group();
    
    //pool of coins
    this.coinsPool = this.add.group();
    this.coinsPool.enableBody = true;
    
    
    //gravity
    this.game.physics.arcade.gravity.y = 4000;    
    
    //max jump distance
    this.maxJumpDistance = 100;
    this.jumpSpeed = 800;
    //move player with up key
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.spaceBar = this.game.input.keyboard.addKey([Phaser.Keyboard.SPACEBAR]);
    
    this.game.world.setBounds(0,0,600,480);
    //coins 
    this.myCoins = 0;
    
    //speed level
    this.levelSpeed = 300;
  },
  create: function() {
    //create the player
    this.player = this.add.sprite(50, 140, 'player');
    this.player.anchor.setTo(0.5);
    this.player.animations.add('running', [0, 1, 2, 3, 2, 1], 15, true);
    this.game.physics.arcade.enable(this.player);
    
    
    var style5 = {font: '50px Arial', fill: '#fff'};
		this.speedUpText = this.game.add.text(this.game.world.width*0.5, this.game.world.height*0.1, '', style5);
		this.speedUpText.anchor.setTo(0.5);
    this.gameTimer = this.game.time.events.loop(Phaser.Timer.SECOND * 10, this.increaseSpeed, this);
    this.removeSpeedUpText = this.game.time.events.loop(Phaser.Timer.SECOND*2, this.clearSpeedUpText, this);
    
    //change player bounding box
    this.player.body.setSize(38, 60, 0, 0);
    this.player.play('running');
    
    //hard-code first platform
    this.currentPlatform = new MrHop.Platform(this.game, this.floorPool, 22, 0, this.game.world.height * 0.85, -this.levelSpeed, this.coinsPool);
    this.platformPool.add(this.currentPlatform);
    
    //audio
    this.coinSound = this.add.audio('coin', 0.10, false);
    this.music = this.add.audio('music', 0.1, true);
    this.music.play();
    
    //background
    this.background = this.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'background');
    this.background.tileScale.y = 3;
    this.background.tileScale.x = 3;
    this.background.autoScroll(-this.levelSpeed * 0.1, 0);
    this.game.world.sendToBack(this.background);
    
    //score text
    var style2 = {font: '25px Arial', fill: '#fff'};
		this.scoreText = this.game.add.text(this.game.world.width*0.85, this.game.world.height*0.07, 'Score: ' + this.myCoins, style2);


		this.scoreText.anchor.setTo(1);
    
    this.loadLevel();
  },   
  update: function() {    
    
    this.platformPool.forEachAlive(function(platform, index){
      this.game.physics.arcade.collide(this.player, platform);
      
      //check if a platform needs to be killed
      if(platform.length && platform.children[platform.length-1].right < 0) {
        platform.kill();
      }    
    }, this);  
    
    //background scroll speed update
    this.background.autoScroll(-this.levelSpeed * 0.1, 0);
    
    //update the score.
    this.refreshScore();
    
    if(this.player.body.touching.down) {
      this.player.body.velocity.x = this.levelSpeed * 0.75;
    }
    else {
      this.player.body.velocity.x = this.levelSpeed * -0.25;
    }
    
    //inputs
    if(this.spaceBar.isDown && this.player.top > this.game.world.height){
      this.restart();
    }
    
    if(this.spaceBar.isDown || this.game.input.activePointer.isDown) {
      this.playerJump();
    }
    else if(this.spaceBar.isUp || this.game.input.activePointer.isUp) {
      this.isJumping = false;
    }
    if(this.cursors.left.isDown && this.player.body.touching.down){
      this.player.body.velocity.x = this.levelSpeed * -0.25;
    }else if(this.cursors.left.isDown && !this.player.body.touching.down){
      this.player.body.velocity.x = -this.levelSpeed;
    }else if(this.cursors.right.isDown && this.player.body.touching.down){
      this.player.body.velocity.x = this.levelSpeed *2;
    }else if(this.cursors.right.isDown && !this.player.body.touching.down){
      this.player.body.velocity.x = this.levelSpeed;
    } 
    
    if(this.player.body.y < this.game.world.height){
      if(this.currentPlatform.length && this.currentPlatform.children[this.currentPlatform.length-1].right < this.game.world.width) {
        this.createPlatform();
      } 
    }
    if(this.player.body.y >= this.game.world.height - 60){
      this.updateHighscore();
      this.gameOver();
      this.increaseSpeed();
    }
    
    
    
    //kill coins that leave the screen
      this.coinsPool.forEachAlive(function(coin){
        if(this.game.physics.arcade.overlap(this.player, coin, this.playCoinSound)){
          coin.kill();
          this.myCoins++;
         
        }
        
        if(coin.right <= 0) {
          coin.kill();

        }
      }, this);
  },
  
  increaseSpeed: function(){
    if(this.player.body.y < this.game.world.height){
      this.levelSpeed = this.levelSpeed + 25;
      this.speedUpText.setText('Speeding Up!');
    }else{
      this.levelSpeed = 0;
      
    }
  },
  
  clearSpeedUpText: function(){
    this.speedUpText.setText('');
  },
  playCoinSound: function(coin){
    MrHop.GameState.coinSound.play();
  },
  
  refreshScore: function(){
    this.scoreText.text = 'Score: ' + this.myCoins;
  },
  
  
  playerJump: function(){
    if(this.player.body.touching.down) {
      //starting point of the jump
      this.startJumpY = this.player.y;
      
      //keep track of the fact that it is jumping
      this.isJumping = true;
      this.jumpPeaked = false;
      
      this.player.body.velocity.y = -this.jumpSpeed;
    }
    else if(this.isJumping && !this.jumpPeaked) {
      var distanceJumped = this.startJumpY - this.player.y;
      
      if(distanceJumped <= this.maxJumpDistance) {
        this.player.body.velocity.y = -this.jumpSpeed;
      }
      else {
        this.jumpPeaked = true;
      }
    } 
  },
  loadLevel: function(){
          
    this.createPlatform();
  },
  createPlatform: function(){
    var nextPlatformData = this.generateRandomPlatform();
    
    if(nextPlatformData) {
      
      this.currentPlatform = this.platformPool.getFirstDead();
      
      if(!this.currentPlatform) {
        this.currentPlatform = new MrHop.Platform(this.game, this.floorPool, nextPlatformData.numTiles, this.game.world.width + nextPlatformData.separation, nextPlatformData.y, -this.levelSpeed, this.coinsPool);   
      }
      else {
        this.currentPlatform.prepare(nextPlatformData.numTiles, this.game.world.width + nextPlatformData.separation, nextPlatformData.y, -this.levelSpeed);   
      }

      this.platformPool.add(this.currentPlatform);

    }
  },
  generateRandomPlatform: function() {
    
    var data = {};
    
    //distance from the previous platform
    var minSeparation = 60;
    var maxSeparation = 200;
    data.separation = minSeparation + Math.random() * (maxSeparation - minSeparation);
    
    //y in regards to the previous platform
    var minDifY = -120;
    var maxDifY = 120;    
    
    data.y = this.currentPlatform.children[0].y + minDifY + Math.random() * (maxDifY - minDifY);
    data.y = Math.max(150, data.y);
    data.y = Math.min(this.game.world.height - 60, data.y);
        
    //number of tiles
    var minTiles = 1;
    var maxTiles = 5;
    data.numTiles = minTiles + Math.random() * (maxTiles - minTiles);
      
    return data;
  }, 
  gameOver: function(){
    
    var style1 = {font: '80px Arial', fill: '#fff'};
		this.gameOverText = this.game.add.text(this.game.world.width*0.5, this.game.world.height*0.35, 'GAME OVER', style1);
		this.gameOverText.anchor.setTo(0.5);
		var style2 = {font: '40px Arial', fill: '#fff'};
		this.finalScoreText = this.game.add.text(this.game.world.width*0.5, this.game.world.height*0.5, 'Score: ' + this.myCoins, style2);
		this.finalScoreText.anchor.setTo(0.5);
		this.highScoreText = this.game.add.text(this.game.world.width*0.5, this.game.world.height*0.6, 'Highscore: ' + this.highScore, style2);
		this.highScoreText.anchor.setTo(0.5);
		var style3 = {font: '16px Arial', fill: '#fff'};
		this.tryAgain = this.game.add.text(this.game.world.width*0.5, this.game.world.height*0.8, 'Press Space to try again', style3);
		this.tryAgain.anchor.setTo(0.5);
  },
  restart: function(){
    this.music.pause();
    this.game.world.remove(this.background);
    this.game.world.remove(this.water);
    this.game.state.start('Game');
  },
  updateHighscore: function(){
    this.highScore = +localStorage.getItem('highScore');
    
    
    if(this.highScore < this.myCoins){
      this.highScore = this.myCoins;
      localStorage.setItem('highScore', this.highScore);
      
    }
    
  }
  
  /*render: function() {
    this.game.debug.body(this.player);
    this.game.debug.bodyInfo(this.player, 0, 30);
  }*/
};
