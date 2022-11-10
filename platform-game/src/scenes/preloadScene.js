import Phaser from "phaser";

class PreloadScene extends Phaser.Scene {

    constructor() {
        super('preload-scene')
    }

    preload() {
        this.load.tilemapTiledJSON('map', './assets/crystal_world_map.json');
        this.load.image('tileset-1', './assets/main_lev_build_1.png');
        this.load.image('tileset-2', './assets/main_lev_build_2.png');
    }

    create() {
        this.scene.start('play-scene')
    }
}

export default PreloadScene;