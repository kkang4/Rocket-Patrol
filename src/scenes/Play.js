/* Play.js */

class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload(){
        //load images/title sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('fastspaceship', './assets/fastspaceship.png');
        this.load.image('starfield', './assets/starfield.png');
        this.load.image('planet', './assets/planet.png');
        this.load.image('frame_top', './assets/frame_top.png');
        this.load.image('frame_bottom', './assets/frame_bottom.png');
        this.load.image('frame_left', './assets/frame_left.png');
        this.load.image('frame_right', './assets/frame_right.png');
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64,
        frameHeight: 32, startFrame: 0, endFrame: 9});
        this.load.audio('sfx_select', './assets/blip_select12.wav');
        this.load.audio('sfx_explosion', './assets/explosion38.wav');
        this.load.audio('sfx_rocket', './assets/rocket_shot.wav');
    }

    create() {
        //place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        this.planet = this.add.image(-50, 100, 'planet');

        //black rectangle borders
        this.add.rectangle(0, 0, 640, 32, 0x000000).setOrigin(0, 0);
        this.add.rectangle(0, 480, 640, -32, 0x000000).setOrigin(0, 0);
        this.add.rectangle(0, 0, 32, 480, 0x000000).setOrigin(0, 0);
        this.add.rectangle(640, 0, -32, 480, 0x000000).setOrigin(0, 0);

        //green UI background
        this.add.rectangle(37, 42, 566, 64, 0x00FF00).setOrigin(0,0);


        //add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, 431, 'rocket').setScale(0.5, 0.5).setOrigin(0, 0);

        //add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + 192, 132, 'spaceship', 0, 30, false).setOrigin(0.5);
        this.ship02 = new Spaceship(this, game.config.width + 96, 196, 'fastspaceship', 0, 50, true).setOrigin(0.5);
        this.ship03 = new Spaceship(this, game.config.width, 260, 'spaceship', 0, 10).setOrigin(0.5);

        //custom frame
        this.frameTop = this.add.image(5, 5, 'frame_top').setOrigin(0, 0);
        this.frameBottom = this.add.image(5, 443, 'frame_bottom').setOrigin(0, 0);
        this.frameLeft = this.add.image(5, 5, 'frame_left').setOrigin(0, 0);
        this.frameRight = this.add.image(603, 5, 'frame_right').setOrigin(0, 0);

        //define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', {start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        //score
        this.p1Score = 0;

        //score display
        this.scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bototm: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(69, 54, this.p1Score, this.scoreConfig);
		this.highScore = this.add.text(175, 54, highScore, this.scoreConfig);
		this.timer = this.add.text(475, 54, game.settings.gameTimer, this.scoreConfig);

        //gamer over flag
        this.gameOver = false;

        //60-second pay clock
        this.totalTime = game.settings.gameTimer;
        this.scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(this.totalTime, this.gameIsOver, null, this);
    }

    gameIsOver(){
        this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER',
        this.scoreConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + 64, '(F)ire to Restart or <- for Menu',
        this.scoreConfig).setOrigin(0.5);
        this.gameOver = true;
    }


    update(){
        this.starfield.tilePositionX -= 2;
        this.planet.x += 0.25;
        this.timer.text = ((this.totalTime - this.clock.elapsed)/1000).toFixed(0);

        //check key input for restart
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyF)){
            this.scene.restart(this.p1Score);
        }
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)){
            this.scene.start("menuScene");
        }
        if(!this.gameOver){
            this.p1Rocket.update();
            this.ship01.update();           //update spaceships (x3)
            this.ship02.update();
            this.ship03.update();
        }

        //check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if(this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if(this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
    }

    checkCollision(rocket, ship){
        //simple AABB checking
        if (rocket.x < ship.x + ship.width &&
            rocket.x  + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y){
            return true;
        } else {
            return false;
        }
    }

    shipExplode(ship){
        ship.alpha = 0;             //temporarily hide ship

        //create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             //play explode animation
        boom.on('animationcomplete', () => {   //callback after animations completes
            ship.reset();                       //reset ship position
            ship.alpha = 1;                     //make ship visible again
            boom.destroy();                     //remove explosion sprite
        });

        //score increment and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
		if (this.p1Score > highScore){
			highScore = this.p1Score;
			this.highScore.text = highScore;
		}
        this.sound.play('sfx_explosion');

        //add time to the timer
        /*
        let timeRemaining = Number(this.timer.text);
        timeRemaining += game.settings.hitTimerSecondsAdded;
        timeRemaining *= 1000; //convert to milliseconds;
        this.clock.destroy();
        this.clock = this.time.delayedCall(timeRemaining, this.gameIsOver, null, this);
        */
    }
}
