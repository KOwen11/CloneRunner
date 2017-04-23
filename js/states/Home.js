var MrHop = MrHop || {};

//loading the game assets
MrHop.HomeState = {
    init: function(){
        console.log('home');
        this.game.world.setBounds(0,0,600,480);
        this.levelSpeed = 100;
        this.floorPool = this.add.group();
        this.platformPool = this.add.group();
        this.coinsPool = this.add.group();
        this.coinsPool.enableBody = true;
        this.highScore = +localStorage.getItem('highScore');  
        this.spaceBar = this.game.input.keyboard.addKey([Phaser.Keyboard.SPACEBAR]);
        //gravity
        this.game.physics.arcade.gravity.y = 6000;
    },


    create: function(){
        
        
        
        
        //background
        
        this.background = this.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'background');
        this.background.tileScale.y = 3;
        this.background.tileScale.x = 3;
        this.background.autoScroll(-40, 0);
        this.game.world.sendToBack(this.background);
        
        
        //platforms, coins
        
        
        var i = 0;
        while(i < 3){
            console.log('platform');
        this.currentPlatform = new MrHop.Platform(this.game, this.floorPool, this.numTiles(), this.randomLocationX(i), this.randomLocationY(), 0, this.coinsPool);
        this.platformPool.add(this.currentPlatform);
        i = i + 1;
        
        }
        
        var style = {font: '50px Arial', fill: '#fff'};
        var style2 = {font: '30px Arial', fill: '#fff', shadow: true};
        this.begin = this.game.add.text(this.game.world.width*0.5, this.game.world.height*0.4, 'PRESS SPACE TO START', style);
        this.begin.anchor.setTo(0.5);
        this.highScoreText = this.game.add.text(this.game.world.width*0.5, this.game.world.height*0.6, 'Highscore: ' + this.highScore, style2);
    	this.highScoreText.anchor.setTo(0.5);
  
     
  },
  update: function(){
    if(this.spaceBar.isDown){
        this.start();
    }
    
  },
  numTiles: function(){
    console.log('break1----------');
    var num = this.getRandomInt(2,5);
    return num;
  },
  randomLocationX: function(index){
      console.log('break2---------');
      var indexA = 0;
      
      if(index == 0){
          indexA = this.game.world.width*0.2;
      }else if(index == 1){
          indexA = this.game.world.width*0.5;
      }else if(index == 2){
          indexA = this.game.world.width*0.75;
      }
      
      return indexA;
  },
  
  randomLocationY: function(){
    console.log('break3-------------');
    var y = 0;
    var min = this.game.world.height * 0.9;
    var max = this.game.world.height * 0.4;
    y = this.getRandomInt(min, max);
    return y;
    
  },
  getRandomInt: function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  },
  
  start: function() {
    console.log('home end');
    this.state.start('Game');
  },
};