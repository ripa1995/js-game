import Phaser from "phaser";
import initAnimations from "./playerAnims"

class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x,y) {
        super(scene, x,y, 'player')
        scene.physics.add.existing(this);
        scene.add.existing(this);
        this.init();
        this.initEvents();
    }

    init() {
        this.gravity = 500;
        this.playerSpeed = 200;
        //https://photonstorm.github.io/phaser3-docs/Phaser.Input.Keyboard.KeyboardPlugin.html#createCursorKeys__anchor
        this.cursors = this.scene.input.keyboard.createCursorKeys();

        this.body.setGravityY(this.gravity);
        this.setCollideWorldBounds(true);

        initAnimations(this.scene.anims); 
    }

    initEvents() {
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    update() {
        const {left , right} = this.cursors;
        if (left.isDown) {
            this.setVelocityX(-this.playerSpeed);
            this.setFlipX(true);
        } else if (right.isDown) {
            this.setVelocityX(this.playerSpeed);
            this.setFlipX(false);
        } else {
            this.setVelocityX(0);
        }

        this.body.velocity.x !== 0 ? this.play('run',true) : this.play('idle',true);

    }

}

export default Player;