var MrHop = MrHop || {};

//loading the game assets
MrHop.PreloadState = {
  preload: function() {
    console.log('preload start');
    //show loading screen
    
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);
    this.preloadBar.scale.setTo(3);

    this.load.setPreloadSprite(this.preloadBar);
    

    //load game assets    
    this.load.image('playerDead', 'assets/images/player_dead.png');
    this.load.image('floor', 'assets/images/floor.png');
    this.load.image('water', 'assets/images/water.png');
    this.load.image('coin', 'assets/images/coin.png');
    
    this.load.spritesheet('player', 'assets/images/player_spritesheet.png', 51, 67, 5, 2, 3);
    this.load.audio('coin', ['assets/audio/coin.mp3', 'assets/audio/coin.ogg']);

  },
  create: function(){
    this.state.start('Home');
    console.log('preload exit');
  }
};