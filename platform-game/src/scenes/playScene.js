import Phaser from "phaser";

class PlayScene extends Phaser.Scene {

    constructor() {
        super('play-scene')
    }

    create() {
        const MAP = this.make.tilemap({
            key: 'map'
        });
        const TILESET_1 = MAP.addTilesetImage('main_lev_build_1', 'tileset-1');
        //const TILESET_2 = MAP.addTilesetImage('main_lev_build_2', 'tileset-2');
        
        //order matters here
        MAP.createStaticLayer('environment', TILESET_1); 
        MAP.createStaticLayer('platforms', TILESET_1);
    }
}

export default PlayScene;