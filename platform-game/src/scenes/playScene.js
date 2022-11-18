import Phaser from "phaser";
import Birdman from "../entities/birdman";
import Player from "../entities/player";
import { getEnemyTypes } from "../types";
import Enemies from "../groups/enemies";

import initAnims from '../anims'

class PlayScene extends Phaser.Scene {

    constructor(config) {
        super('play-scene')
        this.config = config;
    }

    create() {
        const MAP = this.createMap();
        const LAYERS = this.createLayers(MAP);
        const PLAYER_ZONES = this.getPlayerZones(LAYERS.PLAYER_ZONES);
        const PLAYER = this.createPlayer(PLAYER_ZONES.start);
        const ENEMIES = this.createEnemies(LAYERS.ENEMY_SPAWNS, LAYERS.LAYER_COLLIDERS);

        this.createPlayerColliders(PLAYER, {colliders: {platformColliders: LAYERS.LAYER_COLLIDERS}});
        this.createEnemiesColliders(ENEMIES, {colliders: {
            platformColliders: LAYERS.LAYER_COLLIDERS,
            player: PLAYER
        }});

        this.createEndOfLevel(PLAYER_ZONES.end, PLAYER);
        this.setupFollowupCameraOn(PLAYER);
        initAnims(this.anims);
 }

    finishDrawing(pointer, layer) {
        this.line.x2 = pointer.worldX;
        this.line.y2 = pointer.worldY;

        this.graphics.clear();
        this.graphics.strokeLineShape(this.line);

        this.tileHits = layer.getTilesWithinShape(this.line);
        if (this.tileHits.length > 0) {
            this.tileHits.forEach(tile => {
                tile.index !== -1 && tile.setCollision(true);
            })
        }
        this.drawDebug(layer)

        this.plotting = false;
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
        
        const PLAYER_ZONES = map.getObjectLayer('player_zones');

        const ENEMY_SPAWNS = map.getObjectLayer('enemy_spawns');

        //https://photonstorm.github.io/phaser3-docs/Phaser.Tilemaps.StaticTilemapLayer.html#setCollisionByExclusion__anchor
        //set collision on all tiles except those defined in the indexes (so -1 means all except -1 and 0) 
        //PLATFORMS.setCollisionByExclusion(-1, true)

        //https://photonstorm.github.io/phaser3-docs/Phaser.Tilemaps.StaticTilemapLayer.html#setCollisionByProperty__anchor
        //set collision on all tiles that has the specified property defined
        LAYER_COLLIDERS.setCollisionByProperty({collides:true});

        return {ENVIRONMENT, PLATFORMS, LAYER_COLLIDERS, PLAYER_ZONES, ENEMY_SPAWNS}
    }

    createPlayer(start) {
        return new Player(this, start.x,start.y);
    }

    createPlayerColliders(player, {colliders}) {
        player.addCollider(colliders.platformColliders);
    }

    createEnemies(spawnLayer, platformColliders) {
        const enemies = new Enemies(this);
        const enemyTypes = enemies.getTypes();
        spawnLayer.objects.forEach(spawnPoint => {
            const enemy = new enemyTypes[spawnPoint.type](this, spawnPoint.x,spawnPoint.y);
            enemy.setPlatformColliders(platformColliders)
            enemies.add(enemy)
        })
        return enemies
    }

    onPlayerCollision(enemy, player) {
        player.takesHit(enemy);
    }

    onWeaponHit(entity, source) {
        //console.log(`${entity} taking dmg from ${source}`);
        entity.takesHit(source);
    }

    createEnemiesColliders(enemies, {colliders}) {
        enemies
            .addCollider(colliders.platformColliders)
            .addCollider(colliders.player, this.onPlayerCollision)
            .addCollider(colliders.player.projectiles, this.onWeaponHit)
            .addOverlap(colliders.player.meleeWeapon, this.onWeaponHit);
    }

    setupFollowupCameraOn(player) {
        const {width, height, mapOffset, zoomFactor } = this.config;
        this.physics.world.setBounds(0,0, width + mapOffset,height + 100);
        this.cameras.main.setBounds(0,0, width + mapOffset,height).setZoom(zoomFactor);
        this.cameras.main.startFollow(player);
    }

    getPlayerZones(layer) {
        const playerZones = layer.objects;
        return {
            start: playerZones.find(zone => zone.name === 'startZone'),
            end: playerZones.find(zone => zone.name === 'endZone')
        }
    }

    createEndOfLevel(end, player) {
        const endOfLevel = this.physics.add.sprite(end.x,end.y, 'end')
            .setAlpha(0)
            .setSize(5, this.config.height)
            .setOrigin(0.5, 1);

        const endOfLevelOverlap = this.physics.add.overlap(player, endOfLevel, () => {
            endOfLevelOverlap.active = false;
            console.log("Player won!");
        });
    }
}

export default PlayScene;