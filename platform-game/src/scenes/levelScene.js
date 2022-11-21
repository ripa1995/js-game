import BaseScene from './baseScene';

class LevelScene extends BaseScene {

    constructor(config) {
        super("level-scene", {...config, canGoBack: true});
    }

    //https://photonstorm.github.io/phaser3-docs/Phaser.Types.Scenes.html#.SceneCreateCallback
    create() {
        super.create();

        const levels = this.registry.get('unlocked-levels');
        this.menu = [];
        for (let i=1; i<=levels; i++) {
            this.menu.push({
                scene: 'play-scene',
                text: `Level ${i}`,
                level: i
            })
        }

        this.createMenu(this.menu, this.setupMenuEvents.bind(this));
    }

    //https://photonstorm.github.io/phaser3-docs/Phaser.Scene.html#update
    //default: 60fps i.e. update executed 60 times per second
    update(time /* ms time since first update */, delta /* ms delta time since last update*/) {
        //this.scene.start('play-scene')
    }

    setupMenuEvents(menuItem) {
        const textGameObject = menuItem.textGameObject;
        textGameObject.setInteractive();
        textGameObject.on('pointerover', () => {
            textGameObject.setStyle({fill: 'yellow'});
        })
        textGameObject.on('pointerout', () => {
            textGameObject.setStyle({fill: '#713E01'});
        })
        textGameObject.on('pointerup', () => {
            if (menuItem.scene) {
                this.registry.set('level', menuItem.level);
                this.scene.start(menuItem.scene);
            }
        })
    }
}

export default LevelScene;