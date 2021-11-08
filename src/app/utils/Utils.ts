
import {
    Sprite
} from 'pixi.js';


class CollisionBox extends Sprite {
    public centerX: number;
    public centerY: number;
    public halfWidth: number;
    public halfHeight: number;
    public xAnchorOffset: number
    public yAnchorOffset: number
    constructor(sprite: Sprite) {
        super();
        this.x = sprite.x;
        this.y = sprite.y;
        this.halfWidth = sprite.texture.frame.width / 2;
        this.halfHeight = sprite.texture.frame.height / 2;
        this.xAnchorOffset = sprite.texture.frame.width * sprite.anchor.x
        this.yAnchorOffset = sprite.texture.frame.height * sprite.anchor.y
    }
}
export default class Utils {
    static hitTestRectangle(a: Sprite, b: Sprite): boolean {
        //Define the variables we'll need to calculate
        let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;
        let r1 = new CollisionBox(a)
        let r2 = new CollisionBox(b)
        //hit will determine whether there's a collision
        hit = false;
        vx = (r1.x + Math.abs(r1.halfWidth) - r1.xAnchorOffset) - (r2.x + Math.abs(r2.halfWidth) - r2.xAnchorOffset);
        vy = (r1.y + Math.abs(r1.halfHeight) - r1.yAnchorOffset) - (b.y + Math.abs(r2.halfHeight) - r2.yAnchorOffset);
        //Figure out the combined half-widths and half-heights
        combinedHalfWidths = Math.abs(r1.halfWidth) + Math.abs(r2.halfWidth);
        combinedHalfHeights = Math.abs(r1.halfHeight) + Math.abs(r2.halfHeight);

        //Check for a collision on the x axis
        if (Math.abs(vx) < combinedHalfWidths) {

            //A collision might be occurring. Check for a collision on the y axis
            if (Math.abs(vy) < combinedHalfHeights) {

                //There's definitely a collision happening
                hit = true;
            } else {

                //There's no collision on the y axis
                hit = false;
            }
        } else {

            //There's no collision on the x axis
            hit = false;
        }

        //`hit` will be either `true` or `false`
        return hit;
    }

    static getRandomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

}