import Phaser from "phaser";
import Collectable from "../collectables/collectable";

class Collectables extends Phaser.Physics.Arcade.StaticGroup {
    constructor(scene) {
        super(scene.physics.world, scene);

        this.createFromConfig({
            classType: Collectable
        })
    }

    mapProperties(propertiesList) {
        if (!propertiesList || propertiesList.length === 0) { return {}; }
        
        return propertiesList.reduce((map, object) => {
            map[object.name] = object.value;
            return map;
        }, {})
    }

    addFromLayer(collectablesLayer) {
        const {score: defaultScore, type} = this.mapProperties(collectablesLayer.properties);
        
        collectablesLayer.objects.forEach(item => {
            const collectable = this.get(item.x,item.y, type);
            const objectProps = this.mapProperties(item.properties);
            collectable.score = objectProps.score || defaultScore;
        });
    }
}

export default Collectables;