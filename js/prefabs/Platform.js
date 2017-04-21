var MrHop = MrHop || {};

MrHop.Platform = function(game, numTiles, x, y) {
  Phaser.Group.call(this, game);
  
  this.tileSize = 40;
  
  var i = 0;
  while(i < numTiles){
    
    var floorTile = new Phaser.Sprite(game, x + i * this.tileSize, y, 'floor');
    
    this.add(floorTile);
    
    i++;
  }
};

MrHop.Platform.prototype = Object.create(Phaser.Group.prototype);
MrHop.Platform.prototype.constructor = MrHop.Platform;