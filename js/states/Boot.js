var MrHop = MrHop || {};

//setting game configuration and loading the assets for the loading screen
MrHop.BootState = {
  preload: function() {
    //loading screen will have a white background
    this.load.image('preloadbar', 'assets/images/preloader-bar.png');
    this.load.image('background', 'assets/images/background.png');

    console.log('boot start');
    this.game.stage.backgroundColor = '#fff';  
    
    //scaling options
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    
    //have the game centered horizontally
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    //physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE);   
    
    //assets we'll use in the loading screen
    
  },
  create: function(){
    this.state.start('Preload');
    console.log('boot exit');
  }
};