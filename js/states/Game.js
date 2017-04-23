

var CloneRunner = CloneRunner || {};

CloneRunner.GameState = {

  init: function() {
    

    
    //pool of platforms
    this.platformPool = this.add.group();
    
    //pool of floors
    this.floorPool = this.add.group();
    
      
    //gravity
    this.game.physics.arcade.gravity.y = 4000;    
    
    //max jump distance
    this.maxJumpDistance = 200;
    
    //jump speed
    this.jumpSpeed = 800;
    
    //Keyboard input
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.spaceBar = this.game.input.keyboard.addKey([Phaser.Keyboard.SPACEBAR]);
    
    this.myCoins = 0;

    this.levelSpeed = 250;
    
    this.floorHeight = this.game.world.height - 45;
    
    this.playerPosition = 200;
    this.playerTarget = 200;
    
  },
  create: function() {

    // create the player
    this.player = this.add.sprite(this.playerPosition,this.game.world.height - 85,'player');
    this.player.anchor.setTo(0.5);
    this.player.animations.add('running', [0,1,2,3,2,1], 15, true);
    this.player.play('running');
    this.game.physics.arcade.enable(this.player);
    this.player.body.setSize(35, 60, 0, 0);
    this.playerPosition = (100);
    this.player.collideWorldBounds = true;
    
    //background
    this.background = this.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'background');
    this.background.autoScroll(-40, 0);
    this.background.scale.set(4);
    this.game.world.sendToBack(this.background);
    
    //hard-code first platform
    this.currentPlatform = new CloneRunner.Platform(this.game, this.floorPool, this.getRandomInt(2, 8), 300, this.game.world.height*0.75, -this.levelSpeed);
    this.startingPlatformA = new CloneRunner.Platform(this.game, this.floorPool, this.getRandomInt(2, 8), 600, this.game.world.height*0.65, -this.levelSpeed);
    this.startingPlatformB = new CloneRunner.Platform(this.game, this.floorPool, this.getRandomInt(2, 8), 1000, this.game.world.height*0.50, -this.levelSpeed);
    this.startingPlatformC = new CloneRunner.Platform(this.game, this.floorPool, this.getRandomInt(2, 8), 1400, this.game.world.height*0.70, -this.levelSpeed);
    this.platformPool.add(this.startingPlatformA);
    this.platformPool.add(this.startingPlatformB);
    this.platformPool.add(this.startingPlatformC);
    this.platformPool.add(this.currentPlatform);
    this.currentFloor = new CloneRunner.Platform(this.game, this.floorPool, 40, 0, this.floorHeight, -this.levelSpeed);
    this.floorPool.add(this.currentFloor);
    this.loadLevel();
    
    //starting pool of platforms

  },  
  
  update: function() {    
    //player-platform collision and generation
    this.platformPool.forEachAlive(function(platform, index){
      this.game.physics.arcade.collide(this.player, platform);
      if(platform.length && platform.children[platform.length - 1].right < 0){
      platform.kill();
      }
    },this);
    
    //player-floor collision and generation
    this.floorPool.forEachAlive(function(platform, index){
      this.game.physics.arcade.collide(this.player, platform);
      if(platform.length && platform.children[platform.length - 1].right < 0){
      platform.kill();
      }
    },this);
    
    //keep player at desired x coordinate
    if(this.player.body.touching.down || this.player.body.touching.up){
      this.player.body.velocity.x = this.levelSpeed * 0.75;
    }
    else{
      this.player.body.velocity.x = -this.levelSpeed + this.levelSpeed*0.75;
    }
    
    //input 
    if(this.cursors.right.isDown && !this.player.body.touching.down){
      this.player.body.velocity.x = this.levelSpeed;
    }else if(this.cursors.right.isDown && this.player.body.touching.down){
      this.player.body.velocity.x = this.levelSpeed * 2;
    }
    
    if(this.cursors.left.isDown && !this.player.body.touching.down){
      this.player.body.velocity.x = -this.levelSpeed* 2;
    }else if(this.cursors.left.isDown && this.player.body.touching.down){
      this.player.body.velocity.x = -this.levelSpeed;
    }
    
    if(this.cursors.up.isDown || this.game.input.activePointer.isDown){
      this.playerJump();
    }else if(this.cursors.up.isUp || this.game.input.activePointer.isUp){
      this.isJumping = false;
    }
    
    
    //spawn new platforms & floors
    if(this.currentPlatform.length && this.currentPlatform.children[this.currentPlatform.length - 1].right < this.game.world.width){
      this.createPlatform();
    }
    if(this.currentFloor.length && this.currentFloor.children[this.currentFloor.length - 1].right < this.game.world.width){
      this.createFloor();
    }
    
    
    //check for fall
    if(this.player.top > this.game.world.height){
      this.restart();
    }
    
  },
  
  loadLevel: function(){
    this.createPlatform();
    this.createFloor();
  },
  
  createPlatform: function(){
    var nextPlatformData = this.generateRandomPlatform();
    
    
    if(nextPlatformData){
      
      this.currentPlatform = this.platformPool.getFirstDead();
      
      if(!this.currentPlatform){
        this.currentPlatform = new CloneRunner.Platform(this.game, this.floorPool, nextPlatformData.numTiles, this.game.world.width + nextPlatformData.separation, nextPlatformData.y, -this.levelSpeed);
        this.platformPool.add(this.currentPlatform);
        
      }else{
        this.currentPlatform.prepare(nextPlatformData.numTiles, this.game.world.width + nextPlatformData.separation, nextPlatformData.y, -this.levelSpeed);

      }
    }
  },
  
  createFloor: function(){
    var nextFloorData = this.generateRandomFloor();
    
    
    if(nextFloorData){
      
      this.currentFloor = this.floorPool.getFirstDead();
      
      if(!this.floorPool.length < 25){
        
        this.currentFloor = new CloneRunner.Platform(this.game, this.floorPool, nextFloorData.numTiles, this.game.world.width + nextFloorData.separation, nextFloorData.y, -this.levelSpeed);
        this.floorPool.add(this.currentFloor);
        
        
      }else{
        this.currentFloor.prepare(nextFloorData.numTiles, this.game.world.width + nextFloorData.separation, nextFloorData.y, -this.levelSpeed);
        
      }
    }
  },
  
  generateRandomPlatform: function(){
      var data = {};
      
      //separation
      data.separation = this.getRandomInt(60, 180);
      
      //y relative to previous platform
      data.y = this.currentPlatform.children[0].y + this.getRandomInt(-150, 150);
      console.log(data.y);
      
      //platform size
      var numKey = this.getRandomInt(1, 101);
      
      if(numKey<50){
        data.numTiles = this.getRandomInt(3, 7);
        console.log('med plat');
      }else if(numKey<75){
        data.numTiles = this.getRandomInt(1,3);
        console.log('small plat');
      }else {
        data.numTiles = this.getRandomInt(7, 10);
        console.log('large plat');
      }
      
      return data;
      
  },
  generateRandomFloor: function(){
      var data = {};
      
      //separation
      var separationKey = this.getRandomInt(1, 101);
      
      if(separationKey<50){
        data.separation = this.getRandomInt(40, 150);
        console.log('small gap');
      }else if(separationKey<80){
        data.separation = this.getRandomInt(151, 300);
        console.log('med gap');
      }else if(separationKey<95){
        data.separation = this.getRandomInt(300, 400);
        console.log('large gap');
      }else{
        data.separation = this.getRandomInt(400, 800);
        console.log('Huge gap');
      }
      
      //y relative to previous platform
      data.y = this.floorHeight;
      
      //platform size
      data.numTiles = this.getRandomInt(8, 20);
      
      return data;
      
  },
  
  playerJump: function(){
    if(this.player.body.touching.down){
      //starting point of jump
      this.startJumpY = this.player.y;
      
      //remember player is jumping
      this.isJumping = true;
      this.jumpPeaked = false;
      
      this.player.body.velocity.y = -this.jumpSpeed;
    }else if(this.isJumping && !this.jumpPeaked){
      var distanceJumped = this.startJumpY - this.player.y;
      
      if(distanceJumped <= this.maxJumpDistance){
        this.player.body.velocity.y = -this.jumpSpeed;
      }else if(this.player.body.touching.top){
        this.jumpPeaked = true;
      }else{
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
  restart: function(){
    this.state.start('Game');
  }
};
