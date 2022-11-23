import Phaser from 'phaser';

class BaseScene extends Phaser.Scene {

    constructor(key, config) {
        super(key)
        this.config = config;
        this.screenCenter = [config.width / 2, config.height / 2]
        this.fontSize = 65;
        this.lineHeight = 72;
        this.fontOptions = { fontSize: `${this.fontSize}px`, fill: "#713E01" };
    }

    //https://photonstorm.github.io/phaser3-docs/Phaser.Types.Scenes.html#.SceneCreateCallback
    create() {
        this.createBackground();

        if (this.config.canGoBack) {
            this.createBackButton();
        }
    }

    createBackground() {
        //x,y,key of the image
        //x,y will be canvas coordinates, hence giving 0,0 will print only right bottom quarter of the image, since origin coordinates of the image default to its center.
        //with .setOrigin we change the origin of the image. where 0,0 is top left corner of the image, 1,1 is bottom right
        //https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.GameObjectFactory.html#image__anchor
        //https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Image.html#setOrigin__anchor
        this.add.image(0, 0, 'menu-bg')
            .setOrigin(0, 0)
            .setScale(2.8);
    }

    createMenu(menu, setupMenuEvents) {
        let lastMenuPositionY = -this.lineHeight;
        menu.forEach(menuItem => {
            const MENU_POS = [this.screenCenter[0], this.screenCenter[1] + lastMenuPositionY];
            menuItem.textGameObject = this.add.text(...MENU_POS, menuItem.text, this.fontOptions).setOrigin(0.5);
            lastMenuPositionY += this.lineHeight;
            setupMenuEvents(menuItem);
        })
    }

    createBackButton() {
        const BACK_BUTTON = this.add.image(this.config.width - 10, this.config.height - 10, 'back')
            .setScale(1.5)
            .setInteractive()
            .setOrigin(1);
        BACK_BUTTON.on('pointerup', () => {
            this.scene.start('menu-scene')
        })
    }
}

export default BaseScene;