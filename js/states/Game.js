

var CloneRunner = CloneRunner || {};

CloneRunner.GameState = {

  init: function() {
    
    //platform size
    this.platformSize = 20;
    
    //pool of platforms
    this.platformPool = this.add.group();
    
    //pool of floors
    this.floorPool = this.add.group();
      
    //gravity
    this.game.physics.arcade.gravity.y = 1000;    
    
    //max jump distance
    this.maxJumpDistance = 120;
    
    //jump w/ up arrow
    this.cursors = this.game.input.keyboard.createCursorKeys();
    
    this.myCoins = 0;

    this.levelSpeed = 200;
    
  },
  create: function() {

    // create the player
    this.player = this.add.sprite(100,260,'player');
    this.player.anchor.setTo(0.5);
    this.player.animations.add('running', [0,1,2,3,2,1], 15, true);
    this.player.play('running');
    this.game.physics.arcade.enable(this.player);
    this.player.body.setSize(35, 60, 0, 0);
    this.playerPosition = (100);
    //this.player.collideWorldBounds = true;
    
    
    //hard-code first platform
    this.platform = new CloneRunner.Platform(this.game, this.floorPool, this.platformSize, 0, 300, -this.levelSpeed);
    this.platformPool.add(this.platform);

  },  
  
  update: function() {    
    //collision for group of groups
    this.platformPool.forEachAlive(function(platform, index){
        this.game.physics.arcade.collide(this.player, platform);
    },this);
    //keep player at desired x coordinate
    if(this.player.body.touching.down){
      this.player.body.velocity.x = this.levelSpeed;
    }else{
      this.player.body.velocity.x = 0;
    }
    /*
    //return player to desired x coord if displaced
    if(this.player.body.x > this.playerPosition){
      this.player.body.velocity.x = -this.levelSpeed;
    }else if(this.player.body.x < this.playerPosition){
      this.player.body.velocity.x = 2 * this.levelSpeed;
    }
    */
    
    if(this.cursors.up.isDown || this.game.input.activePointer.isDown){
      this.playerJump();
    }else if(this.cursors.up.isUp || this.game.input.activePointer.isUp){
      this.isJumping = false;
    }
    
    /*
    if(this.cursors.left.isDown){
      this.player.body.velocity.x = -300;
    }else if (this.cursors.right.isDown){
      this.player.body.velocity.x = 300;
    }else{
      this.player.body.velocity.x = 0;
    }
    */
    
  },
  
  playerJump: function(){
    if(this.player.body.touching.down){
      //starting point of jump
      this.startJumpY = this.player.y;
      
      //remember player is jumping
      this.isJumping = true;
      this.jumpPeaked = false;
      
      this.player.body.velocity.y = -300;
    }else if(this.isJumping && !this.jumpPeaked){
      var distanceJumped = this.startJumpY - this.player.y;
      
      if(distanceJumped <= this.maxJumpDistance){
        this.player.body.velocity.y = -300;
      }else {
        this.jumpPeaked = true;
      }
    }
  },
  
  getRandomInt: function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  },
  /*
  render: function() {
    this.game.debug.body(this.player);
    this.game.debug.bodyInfo(this.player, 0, 30);
  }
  */
};
