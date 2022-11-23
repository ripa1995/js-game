import Phaser from "phaser";

export default {
    addCollider(otherGameObject, callback, context) {
        this.scene.physics.add.collider(this, otherGameObject, callback, null, context || this);
        return this
    },
    addOverlap(otherGameObject, callback, context) {
        this.scene.physics.add.overlap(this, otherGameObject, callback, null, context || this);
        return this
    },

    bodyPositionDifferenceX: 0,
    previousRay: null,
    previousHasHit: null,

    raycast(body, layer, {raylength = 30, precision = 0, steepnes = 1}) {
        const { x, y, width, halfHeight} = body;

        this.bodyPositionDifferenceX += body.x - body.prev.x;

        if ((Math.abs(this.bodyPositionDifferenceX) <= precision) && this.previousHasHit !== null) {
            return {
                ray: this.previousRay,
                hasHit: this.previousHasHit
            }
        }

        const line = new Phaser.Geom.Line();
        let hasHit = false;

        switch(body.facing) {
            case Phaser.Physics.Arcade.FACING_NONE:
            case Phaser.Physics.Arcade.FACING_RIGHT: {

                line.x1 = x + width;
                line.y1 = y + halfHeight;
                line.x2 = line.x1 + raylength * steepnes;
                line.y2 = line.y1 + raylength;

                break;
            }
            case Phaser.Physics.Arcade.FACING_LEFT: {

                line.x1 = x;
                line.y1 = y + halfHeight;
                line.x2 = line.x1 - raylength * steepnes;
                line.y2 = line.y1 + raylength;

                break;
            }
        }
        
        const tileHits = layer.getTilesWithinShape(line);

        if (tileHits.length > 0) {
            hasHit = this.previousHasHit = tileHits.some(hit => hit.index !== -1);
        }

        this.previousRay = line;
        this.bodyPositionDifferenceX = 0;
        
        return { ray: line , hasHit};
    }
}