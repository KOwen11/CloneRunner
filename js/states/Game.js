var MrHop = MrHop || {};

MrHop.GameState = {

  init: function() {
          
    //gravity
    this.game.physics.arcade.gravity.y = 1000;    
  },
  create: function() {

    //hard-code first platform
    var platform = new MrHop.Platform(this.game, 1, 100, 200);
    this.add.existing(platform);
  },   
  update: function() {    

  } 
};
