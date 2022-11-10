import Phaser from "phaser";

class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x,y) {
        super(scene, x,y, 'player')
        scene.physics.add.existing(this);
        scene.add.existing(this);
        this.init()
    }

    init() {
        this.gravity = 500;
        this.playerSpeed = 200;
        //https://photonstorm.github.io/phaser3-docs/Phaser.Input.Keyboard.KeyboardPlugin.html#createCursorKeys__anchor
        this.cursors = this.scene.input.keyboard.createCursorKeys();

        this.body.setGravityY(this.gravity);
        this.setCollideWorldBounds(true);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta)
        const {left , right} = this.cursors;
        if (left.isDown) {
            this.setVelocityX(-this.playerSpeed);
        } else if (right.isDown) {
            this.setVelocityX(this.playerSpeed);
        } else {
            this.setVelocityX(0);
        }
    }

}

export default Player;