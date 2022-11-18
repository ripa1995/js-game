import Phaser from "phaser";
import initAnimations from "../anims/player"
import collidable from "../mixins/collidable";
import HealthBar from "../hud/healthBar";
import Projectiles from "../attacks/projectiles";
import anims from "../mixins/anims";
import MeleeWeapon from "../attacks/meleeWeapon";
import { getTimestamp } from "../utils/functions";

class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x,y) {
        super(scene, x,y, 'player')
        scene.physics.add.existing(this);
        scene.add.existing(this);
        //Copy the values of all of the enumerable own properties from one or more source objects to a target object. Returns the target object
        Object.assign(this, collidable);
        Object.assign(this, anims);

        this.init();
        this.initEvents();
    }

    init() {
        this.gravity = 500;
        this.playerSpeed = 200;
        this.jumpCount = 0;
        this.consecutiveJumps = 1;
        this.hasBeenHit = false;
        this.bounceVelocity = 175;

        //https://photonstorm.github.io/phaser3-docs/Phaser.Input.Keyboard.KeyboardPlugin.html#createCursorKeys__anchor
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        
        this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;
        this.projectiles = new Projectiles(this.scene);
        this.meleeWeapon = new MeleeWeapon(this.scene, 0,0, 'sword-default');

        this.health = 100;
        this.hp = new HealthBar(
            this.scene, 
            this.scene.config.leftTopCorner.x + 5,
            this.scene.config.leftTopCorner.y + 5,
            2, 
            this.health    
        );

        this.body.setSize(25, 35)
        this.body.setGravityY(this.gravity);
        this.setCollideWorldBounds(true);
        this.setOrigin(0.5, 1);

        initAnimations(this.scene.anims); 

        this.scene.input.keyboard.on('keydown-Q', () => {
            this.play('throw',true)
            this.projectiles.fireProjectile(this);
        })

        this.scene.input.keyboard.on('keydown-E', () => {
            if (this.meleeWeapon.timeFromLastSwing 
                && this.meleeWeapon.timeFromLastSwing + this.meleeWeapon.attackSpeed > getTimestamp()) {
                return;
            }
            this.play('throw',true)
            this.meleeWeapon.swing(this);
        })
    }

    initEvents() {
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    update() {
        if (this.hasBeenHit) {
            return;
        }
        const {left , right, space} = this.cursors;
        //The justDown value allows you to test if this Key has just been pressed down or not.
        //When you check this value it will return true if the Key is down, otherwise false.
        //https://photonstorm.github.io/phaser3-docs/Phaser.Input.Keyboard.html#.JustDown__anchor
        const isSpaceJustDown = Phaser.Input.Keyboard.JustDown(space);
        //https://photonstorm.github.io/phaser3-docs/Phaser.Physics.Arcade.Body.html#onFloor__anchor
        const onFloor = this.body.onFloor();

        if (left.isDown) {
            this.setVelocityX(-this.playerSpeed);
            this.setFlipX(true);
            this.lastDirection = Phaser.Physics.Arcade.FACING_LEFT;
        } else if (right.isDown) {
            this.setVelocityX(this.playerSpeed);
            this.setFlipX(false);
            this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;
        } else {
            this.setVelocityX(0);
        }

        if (isSpaceJustDown&& (onFloor || this.jumpCount < this.consecutiveJumps)) {
            this.jumpCount++;
            this.setVelocityY(-this.playerSpeed * 1.5);
        }

        if (onFloor) {
            this.jumpCount = 0;
        }

        if (this.isPlayingAnims('throw')) {
            return;
        }

        onFloor ? 
            //https://photonstorm.github.io/phaser3-docs/Phaser.Physics.Arcade.Sprite.html#play__anchor
            this.body.velocity.x !== 0 ? 
                this.play('run',true) 
                : 
                this.play('idle',true)
            :
            this.play('jump', true);

    }

    playDamageTween() {
        return this.scene.tweens.add({
            targets: this,
            duration: 100,
            repeat: -1, 
            tint: 0xffffff
        })
    }

    bounceOff() {
        this.body.touching.right ? this.setVelocity(-this.bounceVelocity) : this.setVelocity(this.bounceVelocity,-this.bounceVelocity)
    }

    takesHit(initiator) {
        if (this.hasBeenHit) {
            return ;
        }
        this.hasBeenHit = true;
        this.bounceOff();
        const dmgAnim = this.playDamageTween();

        this.health -= initiator.damage;
        this.hp.setValue(this.health);

        this.scene.time.delayedCall(750, () => {
            this.hasBeenHit = false
            dmgAnim.stop();
            this.clearTint();
        });
    }
}

export default Player;