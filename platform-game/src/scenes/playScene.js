import Phaser from "phaser";

class PlayScene extends Phaser.Scene {

    constructor() {
        super('play-scene')
    }

    preload() {
        this.load.image('sky', './assets/sky.png');
    }

    create() {
        this.add.image(0,0, 'sky')
            .setOrigin(0);
    }
}

export default PlayScene;