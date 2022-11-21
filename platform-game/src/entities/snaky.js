import Enemy from "./enemy";
import initAnims from "../anims/snaky";
import Projectiles from "../attacks/projectiles";

class Snaky extends Enemy {

    constructor(scene, x,y) {
        super(scene, x,y, 'snaky')
        initAnims(scene.anims);
    }

    init() {
        super.init();
        this.speed = 50;

        this.projectiles = new Projectiles(this.scene, 'fireball-1');
        this.timeFromLastAttack = 0;
        this.attackDelay = this.getAttackDelay(); //ms
        this.lastDirection = null;

        this.setSize(this.width - 20, 45);
        this.setOffset(10, 15)
    }

    update(time, delta) {
        super.update(time, delta);

        if (!this.active) {
            this.destroy();
            return;
        }
        
        if (this.isPlayingAnims('snaky-hurt')) {
            return;
        }

        if (this.body.velocity.x > 0) {
            this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;
        } else {
            this.lastDirection = Phaser.Physics.Arcade.FACING_LEFT;
        }

        
        if (this.timeFromLastAttack + this.attackDelay <= time) {
            this.projectiles.fireProjectile(this, 'fireball');

            this.timeFromLastAttack = time;

            this.attackDelay = this.getAttackDelay();
        }

        this.play('snaky-idle', true);
    }

    getAttackDelay() {
        return Phaser.Math.Between(1000, 4000);
    }

    takesHit(source) {
        super.takesHit(source);

        this.play('snaky-hurt', true);
    }

}

export default Snaky;