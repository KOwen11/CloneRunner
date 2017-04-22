

var CloneRunner = CloneRunner || {};

CloneRunner.GameState = {

  init: function() {
    
    //pool of floors
    this.floorPool = this.add.group();
      
    //gravity
    this.game.physics.arcade.gravity.y = 1000;    
    
    //max jump distance
    this.maxJumpDistance = 120;
    
    //jump w/ up arrow
    this.cursors = this.game.input.keyboard.createCursorKeys();
    
    this.myCoins = 0;
    
  },
  create: function() {

    // create the player
    this.player = this.add.sprite(50,50,'player');
    this.player.anchor.setTo(0.5);
    this.player.animations.add('running', [0,1,2,3,2,1], 15, true);
    this.game.physics.arcade.enable(this.player);

    //hard-code first platform
    this.platform = new CloneRunner.Platform(this.game, this.floorPool, 12, 0, 400);
    this.add.existing(this.platform);
  },  
  
  update: function() {    
    this.game.physics.arcade.collide(this.player, this.platform);
    
    //this.player.body.velocity.x = 300;

    if(this.cursors.up.isDown && this.player.body.touching.down){
      this.player.body.velocity.y = -400;
    }
  } 
  
};
