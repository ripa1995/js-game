import Phaser from "phaser";

class HealthBar {

    constructor(scene, x,y, scale = 1, totalHealth) {
        this.bar = new Phaser.GameObjects.Graphics(scene).setDepth(100);

        this.x = x / scale;
        this.y = y / scale;
        this.scale = scale;
        this.value = totalHealth;

        this.size = {
            width: 40,
            height: 8
        };

        this.pixelPerHealth = this.size.width / this.value;

        scene.add.existing(this.bar);
        this.draw(this.x,this.y, this.scale);
    }

    setValue(amount) {
        this.value = amount < 0 ? 0 : amount;
        this.draw(this.x,this.y, this.scale)
    }

    draw(x,y, scale) {
        this.bar.clear();

        const { width, height } = this.size;
        const margin = 2;

        this.bar.fillStyle(0x000000);
        this.bar.fillRect(x,y, width+margin,height+margin);

        this.bar.fillStyle(0xFFFFFF);
        this.bar.fillRect(x+margin,y+margin, width-margin,height-margin);

        const healthWidth = Math.floor(this.value * this.pixelPerHealth);

        if (healthWidth <= this.size.width / 3) {
            this.bar.fillStyle(0xFF0000);
        } else {
            this.bar.fillStyle(0x00FF00);
        }

        if (healthWidth > margin) {
            this.bar.fillRect(x+margin,y+margin, healthWidth-margin,height-margin);
        }
        
        return this.bar
            .setScrollFactor(0,0)
            .setScale(scale);
    }
}

export default HealthBar;