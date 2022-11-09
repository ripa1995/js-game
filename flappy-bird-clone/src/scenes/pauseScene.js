import BaseScene from './baseScene';

class PauseScene extends BaseScene {

    constructor(config) {
        super("pause-scene", config);
        this.menu = [
            {
                scene: 'play-scene',
                text: 'Continue'
            },
            {
                scene: 'menu-scene',
                text: 'Exit'
            }
        ];
    }

    //https://photonstorm.github.io/phaser3-docs/Phaser.Types.Scenes.html#.SceneCreateCallback
    create() {
        super.create();

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
            textGameObject.setStyle({fill: 'white'});
        })
        textGameObject.on('pointerup', () => {
            if (menuItem.scene && menuItem.text === 'Continue') {
                this.scene.stop();
                this.scene.resume(menuItem.scene);
            } else {
                this.scene.stop('play-scene');
                this.scene.start(menuItem.scene);
            }
        })
    }
}

export default PauseScene;