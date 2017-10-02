var CloneRunner = CloneRunner || {};

CloneRunner.game = new Phaser.Game(600, 480, Phaser.AUTO);



CloneRunner.game.state.add('Boot', CloneRunner.BootState);
CloneRunner.game.state.add('Preload', CloneRunner.PreloadState);
CloneRunner.game.state.add('Home', CloneRunner.HomeState);
CloneRunner.game.state.add('Game', CloneRunner.GameState);
CloneRunner.game.state.start('Boot');
