
import {
    Sprite,
} from 'pixi.js';


class CollisionBox extends Sprite {
    public centerX: number;
    public centerY: number;
    public halfWidth: number;
    public halfHeight: number;
    constructor(sprite: Sprite) {
        super();
        this.centerX = sprite.x + sprite.width / 2
        this.centerY = sprite.y + sprite.height / 2
        this.halfWidth = sprite.width / 2;
        this.halfHeight = sprite.height / 2;
    }
}
export default class Utils {
    static hitTestRectangle(a: Sprite, b: Sprite): boolean { //cchcialbym tutaj bezposrednio collisionbox :()

        //Define the variables we'll need to calculate
        let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;
        let r1 = new CollisionBox(a)
        let r2 = new CollisionBox(b)
        //hit will determine whether there's a collision
        hit = false;

        vx = r1.centerX - r2.centerX;
        vy = r1.centerY - r2.centerY;

        //Figure out the combined half-widths and half-heights
        combinedHalfWidths = r1.halfWidth + r2.halfWidth;
        combinedHalfHeights = r1.halfHeight + r2.halfHeight;

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