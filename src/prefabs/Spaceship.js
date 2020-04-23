class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue, fastShip = false){
        super(scene, x, y, texture, frame);
        scene.add.existing(this);

        //store pointValue
        this.points = pointValue;
		this.movingLeft = Math.random() < 0.5 ? true : false;
        if (!this.movingLeft) this.scale = -1;
        this.fastShip = fastShip;
        this.speed = fastShip ? game.settings.spaceshipSpeed * 1.5 : game.settings.spaceshipSpeed;
    }

    update(){
        //move spaceship left
        if (this.movingLeft){
			this.x -= this.speed;
			//wraparound from left to right edge
			if(this.x <= 0 - this.width){
				this.reset();
			}
		}
		else {
			this.x += this.speed;
			//wraparound from right to left edge
			if(this.x >= game.config.width + this.width){
				this.reset();
			}
		}
    }

    reset() {
        if (this.movingLeft) this.x = game.config.width + this.width;
		else this.x = -this.width;
    }
}
