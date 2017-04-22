

var CloneRunner = CloneRunner || {};

CloneRunner.Platform = function(game, floorPool, numTiles, x, y){
  Phaser.Group.call(this, game);
  
  this.game.tileSize = 40;
  this.game = game;
  this.enableBody = true;
  this.floorPool = floorPool; 

  
  this.prepare(numTiles, x, y);

  
};

CloneRunner.Platform.prototype = Object.create(Phaser.Group.prototype);
CloneRunner.Platform.prototype.constructor = CloneRunner.Platform;

CloneRunner.Platform.prototype.prepare = function(numTiles, x, y){
  var i = 0;
  while(i < numTiles){
    
    var floorTile = this.floorPool.getFirstExists(false);
    
    if(!floorTile){
      floorTile = new Phaser.Sprite(this.game, x + i * this.tileSize, y, 'floor');
    }
    else{
      floorTile.reset(x + i * this.tileSize, y);
    }
    
    this.add(floorTile);
    
    i = i + 1;
    
  }
  //physics properties
  this.setAll('body.immovable', true);
  this.setAll('body.allowGravity', false);
  
  
};