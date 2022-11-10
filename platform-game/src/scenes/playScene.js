import Phaser from "phaser";

class PlayScene extends Phaser.Scene {

    constructor() {
        super('play-scene')
    }

    create() {
        const MAP = this.createMap();
        const LAYERS = this.createLayers(MAP);
        const PLAYER = this.createPlayer();

        this.physics.add.collider(PLAYER, LAYERS.PLATFORMS);
    }

    createMap() {
        //https://photonstorm.github.io/phaser3-docs/Phaser.Scene.html#make__anchor
        //https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.GameObjectCreator.html#tilemap__anchor
        //https://photonstorm.github.io/phaser3-docs/Phaser.Tilemaps.Tilemap.html
        const MAP = this.make.tilemap({
            key: 'map'
        });
        //https://photonstorm.github.io/phaser3-docs/Phaser.Tilemaps.Tilemap.html#addTilesetImage__anchor
        MAP.addTilesetImage('main_lev_build_1', 'tileset-1');
        return MAP
    }

    createLayers(map) {
        //https://photonstorm.github.io/phaser3-docs/Phaser.Tilemaps.Tilemap.html#getTileset__anchor
        const TILESET_1 = map.getTileset('main_lev_build_1')
        //https://photonstorm.github.io/phaser3-docs/Phaser.Tilemaps.StaticTilemapLayer.html
        //order matters here
        const ENVIRONMENT = map.createStaticLayer('environment', TILESET_1); 
        const PLATFORMS = map.createStaticLayer('platforms', TILESET_1);
        
        //https://photonstorm.github.io/phaser3-docs/Phaser.Tilemaps.StaticTilemapLayer.html#setCollisionByExclusion__anchor
        //set collision on all tiles except those defined in the indexes (so -1 means all except -1 and 0) 
        PLATFORMS.setCollisionByExclusion(-1, true)

        return {ENVIRONMENT, PLATFORMS}
    }

    createPlayer() {
        const PLAYER = this.physics.add.sprite(100, 250, 'player');
        PLAYER.body.setGravityY(500);
        PLAYER.setCollideWorldBounds(true);
        return PLAYER;
    }
}

export default PlayScene;