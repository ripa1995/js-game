import Phaser from "phaser";
import Player from "../entities/player";

class PlayScene extends Phaser.Scene {

    constructor(config) {
        super('play-scene')
        this.config = config;
    }

    create() {
        const MAP = this.createMap();
        const LAYERS = this.createLayers(MAP);

        const PLAYER = this.createPlayer();

        this.createPlayerColliders(PLAYER, {colliders: {platformColliders: LAYERS.LAYERS_COLLIDERS}});

        this.setupFollowupCameraOn(PLAYER);

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
        const LAYER_COLLIDERS = map.createStaticLayer('layer_colliders', TILESET_1);
        const ENVIRONMENT = map.createStaticLayer('environment', TILESET_1); 
        const PLATFORMS = map.createStaticLayer('platforms', TILESET_1);
        
        //https://photonstorm.github.io/phaser3-docs/Phaser.Tilemaps.StaticTilemapLayer.html#setCollisionByExclusion__anchor
        //set collision on all tiles except those defined in the indexes (so -1 means all except -1 and 0) 
        //PLATFORMS.setCollisionByExclusion(-1, true)

        //https://photonstorm.github.io/phaser3-docs/Phaser.Tilemaps.StaticTilemapLayer.html#setCollisionByProperty__anchor
        //set collision on all tiles that has the specified property defined
        LAYER_COLLIDERS.setCollisionByProperty({collides:true});

        return {ENVIRONMENT, PLATFORMS, LAYERS_COLLIDERS: LAYER_COLLIDERS}
    }

    createPlayer() {
        return new Player(this, 100,250);
    }

    createPlayerColliders(player, {colliders}) {
        player.addCollider(colliders.platformColliders);
    }

    setupFollowupCameraOn(player) {
        const {width, height, mapOffset, zoomFactor } = this.config;
        this.physics.world.setBounds(0,0, width + mapOffset,height + 100);
        this.cameras.main.setBounds(0,0, width + mapOffset,height + 100).setZoom(zoomFactor);
        this.cameras.main.startFollow(player);
    }
}

export default PlayScene;