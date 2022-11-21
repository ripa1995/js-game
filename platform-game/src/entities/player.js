import Phaser from "phaser";
import initAnimations from "../anims/player"
import collidable from "../mixins/collidable";
import HealthBar from "../hud/healthBar";
import Projectiles from "../attacks/projectiles";
import anims from "../mixins/anims";
import MeleeWeapon from "../attacks/meleeWeapon";
import { getTimestamp } from "../utils/functions";
import Projectile from "../attacks/projectile";
import EventEmitter from "../events/emitter";

class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y) {
        super(scene, x, y, 'player')
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

        this.isSliding = false;

        this.jumpSound = this.scene.sound.add('jump', {volume:0.2});
        this.projectileLaunchSound = this.scene.sound.add('projectile-launch', {volume:0.2});
        this.stepSound = this.scene.sound.add('step', {volume:0.2});
        this.swipeSound = this.scene.sound.add('swipe', {volume:0.2});


        //https://photonstorm.github.io/phaser3-docs/Phaser.Input.Keyboard.KeyboardPlugin.html#createCursorKeys__anchor
        this.cursors = this.scene.input.keyboard.createCursorKeys();

        this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;
        this.projectiles = new Projectiles(this.scene, 'iceball-1');
        this.meleeWeapon = new MeleeWeapon(this.scene, 0, 0, 'sword-default');

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

        this.handleAttacks();
        this.handleMovements();

        this.scene.time.addEvent({
            delay: 350,
            repeat: -1,
            callbackScope: this,
            callback: () => {
                if (this.isPlayingAnims('run')) {
                    this.stepSound.play();
                }
            }
        })
    }

    initEvents() {
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    update() {
        if (this.hasBeenHit || this.isSliding || !this.body) {
            return;
        }

        if (this.getBounds().top > this.scene.config.height) {
            EventEmitter.emit('PLAYER_LOOSE');
            return;
        }

        const { left, right, space, down } = this.cursors;
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

        if (isSpaceJustDown && (onFloor || this.jumpCount < this.consecutiveJumps)) {
            this.jumpSound.play();
            this.jumpCount++;
            this.setVelocityY(-this.playerSpeed * 1.5);
        }

        if (onFloor) {
            this.jumpCount = 0;
        }

        if (this.isPlayingAnims('throw') || this.isPlayingAnims('slide')) {
            return;
        }

        onFloor ?
            //https://photonstorm.github.io/phaser3-docs/Phaser.Physics.Arcade.Sprite.html#play__anchor
            this.body.velocity.x !== 0 ?
                this.play('run', true)
                :
                this.play('idle', true)
            :
            this.play('jump', true);

    }

    handleAttacks() {
        this.scene.input.keyboard.on('keydown-Q', () => {
            this.projectileLaunchSound.play();
            this.play('throw', true)
            this.projectiles.fireProjectile(this, 'iceball');
        })

        this.scene.input.keyboard.on('keydown-E', () => {
            if (this.meleeWeapon.timeFromLastSwing
                && this.meleeWeapon.timeFromLastSwing + this.meleeWeapon.attackSpeed > getTimestamp()) {
                return;
            }
            this.swipeSound.play();
            this.play('throw', true)
            this.meleeWeapon.swing(this);
        })
    }

    handleMovements() {
        this.scene.input.keyboard.on('keydown-DOWN', () => {
            if (!this.body.onFloor()) { return; }
            this.isSliding = true;
            this.body.setSize(this.width, this.height / 2);
            this.body.setOffset(0, this.height / 2);
            this.setVelocityX(0);
            this.play('slide', true)
        })

        this.scene.input.keyboard.on('keyup-DOWN', () => {
            this.body.setSize(this.width, this.height);
            this.setOffset(0, 0);
            this.isSliding = false;
        })
    }

    playDamageTween() {
        return this.scene.tweens.add({
            targets: this,
            duration: 100,
            repeat: -1,
            tint: 0xffffff
        })
    }

    bounceOff(source) {
        if (source.body) {
            this.body.touching.right ? this.setVelocity(-this.bounceVelocity) : this.setVelocity(this.bounceVelocity, -this.bounceVelocity)
        } else {
            this.body.blocked.right ? this.setVelocity(-this.bounceVelocity) : this.setVelocity(this.bounceVelocity, -this.bounceVelocity)
        }
    }

    takesHit(source) {
        if (this.hasBeenHit) {
            return;
        }

        this.health -= source.damage || source.properties.damage || 0;
        if (this.health <= 0) {
            EventEmitter.emit('PLAYER_LOOSE')
            this.hasBeenHit = false;
            return;
        }

        this.hasBeenHit = true;
        this.bounceOff(source);
        const dmgAnim = this.playDamageTween();

        this.hp.setValue(this.health);

        source.deliversHit && source.deliversHit(this);

        this.scene.time.delayedCall(750, () => {
            this.hasBeenHit = false
            dmgAnim.stop();
            this.clearTint();
        });
    }
}

export default Player;