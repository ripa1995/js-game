import Phaser from "phaser";
import Birdman from "../entities/birdman";
import Player from "../entities/player";
import { getEnemyTypes } from "../types";
import Enemies from "../groups/enemies";
import Collectables from "../groups/collectables";
import initAnims from '../anims'
import Hud from "../hud";
import EventEmitter from "../events/emitter";

class PlayScene extends Phaser.Scene {

    constructor(config) {
        super('play-scene')
        this.config = config;
    }

    create({gameStatus}) {
        this.score = 0; 
        this.hud = new Hud(this, 0,0);

        const MAP = this.createMap();
        initAnims(this.anims);

        const LAYERS = this.createLayers(MAP);
        const PLAYER_ZONES = this.getPlayerZones(LAYERS.PLAYER_ZONES);
        const PLAYER = this.createPlayer(PLAYER_ZONES.start);
        const ENEMIES = this.createEnemies(LAYERS.ENEMY_SPAWNS, LAYERS.LAYER_COLLIDERS);
        const COLLECTABLES = this.createCollectables(LAYERS.COLLECTABLES);

        this.createBG(MAP);

        this.createPlayerColliders(PLAYER, {colliders: {
            platformColliders: LAYERS.LAYER_COLLIDERS,
            projectiles: ENEMIES.getProjectiles(),
            collectables: COLLECTABLES,
            traps: LAYERS.TRAPS
        }});
        this.createEnemiesColliders(ENEMIES, {colliders: {
            platformColliders: LAYERS.LAYER_COLLIDERS,
            player: PLAYER
        }});

        if (gameStatus !== 'PLAYER_LOOSE') {
            this.createGameEvents();
        }

        this.createBackButton();
        this.createEndOfLevel(PLAYER_ZONES.end, PLAYER);
        this.setupFollowupCameraOn(PLAYER);
 }

    createMap() {
        //https://photonstorm.github.io/phaser3-docs/Phaser.Scene.html#make__anchor
        //https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.GameObjectCreator.html#tilemap__anchor
        //https://photonstorm.github.io/phaser3-docs/Phaser.Tilemaps.Tilemap.html
        const MAP = this.make.tilemap({
            key: `level-${this.getCurrentLevel()}`
        });
        //https://photonstorm.github.io/phaser3-docs/Phaser.Tilemaps.Tilemap.html#addTilesetImage__anchor
        MAP.addTilesetImage('main_lev_build_1', 'tileset-1');
        MAP.addTilesetImage('bg_spikes_tileset', 'bg-spikes-tileset');
        return MAP
    }

    createLayers(map) {
        //https://photonstorm.github.io/phaser3-docs/Phaser.Tilemaps.Tilemap.html#getTileset__anchor
        const TILESET_1 = map.getTileset('main_lev_build_1')
        const TILESET_BG = map.getTileset('bg_spikes_tileset')
        //https://photonstorm.github.io/phaser3-docs/Phaser.Tilemaps.StaticTilemapLayer.html
        //order matters here
        const LAYER_COLLIDERS = map.createStaticLayer('platforms_colliders', TILESET_1);
        const ENVIRONMENT = map.createStaticLayer('environment', TILESET_1).setDepth(-2); 
        const PLATFORMS = map.createStaticLayer('platforms', TILESET_1);

        const BG = map.createStaticLayer('distance', TILESET_BG).setDepth(-12);
        
        const PLAYER_ZONES = map.getObjectLayer('player_zones');

        const ENEMY_SPAWNS = map.getObjectLayer('enemy_spawns');
        const COLLECTABLES = map.getObjectLayer('collectables');

        const TRAPS = map.createStaticLayer('traps', TILESET_1);

        //https://photonstorm.github.io/phaser3-docs/Phaser.Tilemaps.StaticTilemapLayer.html#setCollisionByExclusion__anchor
        //set collision on all tiles except those defined in the indexes (so -1 means all except -1 and 0) 
        //PLATFORMS.setCollisionByExclusion(-1, true)

        //https://photonstorm.github.io/phaser3-docs/Phaser.Tilemaps.StaticTilemapLayer.html#setCollisionByProperty__anchor
        //set collision on all tiles that has the specified property defined
        LAYER_COLLIDERS.setCollisionByProperty({collides:true});
        TRAPS.setCollisionByExclusion(-1);

        return {ENVIRONMENT, PLATFORMS, LAYER_COLLIDERS, PLAYER_ZONES, ENEMY_SPAWNS, COLLECTABLES, TRAPS}
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
            this.scene.start('menu-scene');
        })
    }

    createGameEvents() {
        EventEmitter.on('PLAYER_LOOSE', () => {
            this.scene.restart({gameStatus: 'PLAYER_LOOSE'});
        })
    }

    createCollectables(collectablesLayer) {
        const collectables = new Collectables(this).setDepth(-1);
        collectables.addFromLayer(collectablesLayer);

        collectables.playAnimation('diamond-shine');

        return collectables
    }

    createPlayer(start) {
        return new Player(this, start.x,start.y);
    }

    createPlayerColliders(player, {colliders}) {
        player
            .addCollider(colliders.platformColliders)
            .addCollider(colliders.projectiles, this.onHit)
            .addCollider(colliders.traps, this.onHit)
            .addOverlap(colliders.collectables, this.onCollect, this);
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

    onHit(entity, source) {
        //console.log(`${entity} taking dmg from ${source}`);
        entity.takesHit(source);
    }

    onCollect(entity, collectable) {
        //console.log(`${entity} collecting ${collectable}`);
        //disableGameObject -> deactivate object, default false
        //hideGameObject -> hide object, default false
        collectable.disableBody(true, true);
        this.score += collectable.score;
        this.hud.updateScoreboard(this.score);
        collectable.destroy();
    }

    createEnemiesColliders(enemies, {colliders}) {
        enemies
            .addCollider(colliders.platformColliders)
            .addCollider(colliders.player, this.onPlayerCollision)
            .addCollider(colliders.player.projectiles, this.onHit)
            .addOverlap(colliders.player.meleeWeapon, this.onHit);
    }

    setupFollowupCameraOn(player) {
        const {width, height, mapOffset, zoomFactor } = this.config;
        this.physics.world.setBounds(0,0, width + mapOffset,height + 100);
        this.cameras.main.setBounds(0,0, width + mapOffset,height).setZoom(zoomFactor);
        this.cameras.main.startFollow(player);
    }

    getCurrentLevel() {
        return this.registry.get('level') || 1
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

            if (this.registry.get('level') === this.config.lastLevel) {
                this.scene.start('credit-scene');
                return;
            }
            this.registry.inc('level', 1);
            this.registry.inc('unlocked-levels', 1);
            this.scene.restart({gameStatus: 'LEVEL_COMPLETED'});
        });
    }

    update() {
        this.spikesImg.tilePositionX = this.cameras.main.scrollX * 0.3;
        this.skyImg.tilePositionX = this.cameras.main.scrollX * 0.1;
    }
}

export default PlayScene;