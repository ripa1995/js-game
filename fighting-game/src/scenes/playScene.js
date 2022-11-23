import Phaser from "phaser";
import Player from "../entities/player";
import initAnims from '../anims'
import EventEmitter from "../events/emitter";

class PlayScene extends Phaser.Scene {

    constructor(config) {
        super('play-scene')
        this.config = config;
    }

    create({gameStatus}) {
        this.score = 0; 

        this.playBgMusic();

        const map = this.createMap();
        initAnims(this.anims);

        const layers = this.createLayers(map);
        const playerZones = this.getPlayerZones(layers.player_zones);
        const playerOne = this.createPlayer('Player 1', playerZones.player_1);
        const playerTwo = this.createPlayer('Player 2', playerZones.player_2);
        
        this.createPlayerColliders(playerOne, {colliders: {
            platformColliders: layers.platforms_colliders,
            player: playerTwo,
            traps: layers.traps
        }});

        this.createPlayerColliders(playerTwo, {colliders: {
            platformColliders: layers.platforms_colliders,
            player: playerOne,
            traps: layers.traps
        }});

        if (gameStatus !== 'PLAYER_LOOSE') {
            this.createGameEvents();
        }

        this.createBackButton();
        this.createBG(map);
    }

    playBgMusic() {
        if (this.sound.get('theme')) {
            this.sound.get('theme').play();
            return ;
        }
        this.sound.add('theme', {
            loop: true,
            volume: 0.01
        }).play();
    }

    createMap() {
        //https://photonstorm.github.io/phaser3-docs/Phaser.Scene.html#make__anchor
        //https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.GameObjectCreator.html#tilemap__anchor
        //https://photonstorm.github.io/phaser3-docs/Phaser.Tilemaps.Tilemap.html
        const MAP = this.make.tilemap({
            key: `level-1`
        });
        //https://photonstorm.github.io/phaser3-docs/Phaser.Tilemaps.Tilemap.html#addTilesetImage__anchor
        MAP.addTilesetImage('main_lev_build_1', 'tileset-1');
        MAP.addTilesetImage('bg_spikes_tileset', 'bg-spikes-tileset');
        return MAP
    }

    createLayers(map) {
        //https://photonstorm.github.io/phaser3-docs/Phaser.Tilemaps.Tilemap.html#getTileset__anchor
        const tileset_1 = map.getTileset('main_lev_build_1')
        const tileset_bg = map.getTileset('bg_spikes_tileset')
        //https://photonstorm.github.io/phaser3-docs/Phaser.Tilemaps.StaticTilemapLayer.html
        //order matters here
        const platforms_colliders = map.createStaticLayer('platforms_colliders', tileset_1);
        const environment = map.createStaticLayer('environment', tileset_1).setDepth(-2); 
        const platforms = map.createStaticLayer('platforms', tileset_1);

        const bg = map.createStaticLayer('distance', tileset_bg).setDepth(-12);
        
        const player_zones = map.getObjectLayer('player_zones');

        const traps = map.createStaticLayer('traps', tileset_1);

        //https://photonstorm.github.io/phaser3-docs/Phaser.Tilemaps.StaticTilemapLayer.html#setCollisionByExclusion__anchor
        //set collision on all tiles except those defined in the indexes (so -1 means all except -1 and 0) 
        //PLATFORMS.setCollisionByExclusion(-1, true)

        //https://photonstorm.github.io/phaser3-docs/Phaser.Tilemaps.StaticTilemapLayer.html#setCollisionByProperty__anchor
        //set collision on all tiles that has the specified property defined
        platforms_colliders.setCollisionByProperty({collides:true});
        traps.setCollisionByExclusion(-1);

        return {environment, platforms, platforms_colliders, player_zones, traps}
    }

    createBG(map) {
        const bgObject = map.getObjectLayer('distance_bg').objects[0];
        this.spikesImg = this.add.tileSprite(bgObject.x, bgObject.y, this.config.width, bgObject.height, 'bg-spikes-dark')
            .setOrigin(0,1)
            .setDepth(-10)
            .setScrollFactor(0, 1);

        this.skyImg = this.add.tileSprite(0, 0, this.config.width, 180, 'sky-play')
            .setOrigin(0)
            .setDepth(-11)
            .setScale(1.1)
            .setScrollFactor(0, 1);
    }

    createBackButton() {
        const btnBack = this.add.image(this.config.rightBottomCorner.x, this.config.rightBottomCorner.y, 'back')
            .setOrigin(1)
            .setScrollFactor(0)
            .setScale(2)
            .setInteractive();

        btnBack.on('pointerup', () => {
            this.sound.get('theme').stop();
            this.scene.start('menu-scene');
        })
    }

    createGameEvents() {
        EventEmitter.on('PLAYER_LOOSE', () => {
            this.scene.restart({gameStatus: 'PLAYER_LOOSE'});
        })
    }

    createPlayer(name, start) {
        return new Player(this, start.x,start.y, name);
    }

    createPlayerColliders(player, {colliders}) {
        player
            .addCollider(colliders.platformColliders)
            .addCollider(colliders.traps, this.onHit)
            .addCollider(colliders.player)
            .addCollider(colliders.player.projectiles, this.onHit)
            .addOverlap(colliders.player.meleeWeapon, this.onHit);
    }

    onHit(entity, source) {
        //console.log(`${entity} taking dmg from ${source}`);
        entity.takesHit(source);
    }

    // setupFollowupCameraOn(player) {
    //     const {width, height, mapOffset, zoomFactor } = this.config;
    //     this.physics.world.setBounds(0,0, width + mapOffset,height + 100);
    //     this.cameras.main.setBounds(0,0, width + mapOffset,height).setZoom(zoomFactor);
    //     this.cameras.main.startFollow(player);
    // }

    // getCurrentLevel() {
    //     return this.registry.get('level') || 1
    // }

    getPlayerZones(layer) {
        const playerZones = layer.objects;
        return {
            player_1: playerZones.find(zone => zone.name === 'playerOneSpawn'),
            player_2: playerZones.find(zone => zone.name === 'playerTwoSpawn')
        }
    }
}

export default PlayScene;