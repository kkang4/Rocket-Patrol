let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Play ],
};

let game = new Phaser.Game(config);
// define game settings
game.settings = {
    spaceshipSpeed: 3,
    gameTimer: 60000,
    hitTimerSecondsAdded: 3
}

//reserve some keyboard variables
let keyF, keyLEFT, keyRIGHT, highScore = 0;

