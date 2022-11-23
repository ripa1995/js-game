import Phaser from "phaser";

class PreloadScene extends Phaser.Scene {

    constructor() {
        super('preload-scene')
    }

    preload() {
        this.load.tilemapTiledJSON('level-1', './assets/map.json');
        
        this.load.image('tileset-1', './assets/main_lev_build_1.png');
        this.load.image('tileset-2', './assets/main_lev_build_2.png');
        this.load.image('bg-spikes-tileset', './assets/bg_spikes_tileset.png');
        this.load.image('bg-spikes-dark', './assets/bg_spikes_dark.png');
        this.load.image('sky-play', './assets/sky_play.png');
        this.load.image('menu-bg', './assets/background01.png');
        
        this.load.image('back', './assets/back.png')
        
        this.load.spritesheet('player','./assets/player/move_sprite_1.png', {
            frameWidth: 32,
            frameHeight: 38,
            spacing: 32
        });
        
        this.load.spritesheet('player-slide-sheet','./assets/player/slide_sheet_2.png', {
            frameWidth: 32,
            frameHeight: 38,
            spacing: 32
        });

        this.load.image('iceball-1', './assets/weapons/iceball_001.png');
        this.load.image('iceball-2', './assets/weapons/iceball_002.png');

        this.load.image('fireball-1', './assets/weapons/improved_fireball_001.png');
        this.load.image('fireball-2', './assets/weapons/improved_fireball_002.png');
        this.load.image('fireball-3', './assets/weapons/improved_fireball_003.png');

        this.load.spritesheet('player-throw','./assets/player/throw_attack_sheet_1.png', {
            frameWidth: 32,
            frameHeight: 38,
            spacing: 32
        });

        this.load.spritesheet('hit-sheet','./assets/weapons/hit_effect_sheet.png', {
            frameWidth: 32,
            frameHeight: 32
        });

        this.load.spritesheet('sword-default','./assets/weapons/sword_sheet_1.png', {
            frameWidth: 52,
            frameHeight: 32,
            spacing: 16
        });

        this.load.audio('theme', './assets/music/theme_music.wav');
        this.load.audio('projectile-launch', './assets/music/projectile_launch.wav');
        this.load.audio('step', './assets/music/step_mud.wav');
        this.load.audio('jump', './assets/music/jump.wav');
        this.load.audio('swipe', './assets/music/swipe.wav');

        this.load.once('complete', () => {
            this.startGame();
        });
    }

    startGame() {
        this.registry.set('level', 1);
        this.scene.start('menu-scene')
    }
}

export default PreloadScene;