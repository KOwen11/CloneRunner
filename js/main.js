

var CloneRunner = CloneRunner || {};

CloneRunner.game = new Phaser.Game(480, 320, Phaser.CANVAS);

CloneRunner.game.state.add('Boot', CloneRunner.BootState);
CloneRunner.game.state.add('Preload', CloneRunner.PreloadState);
CloneRunner.game.state.add('Game', CloneRunner.GameState);

CloneRunner.game.state.start('Boot');
