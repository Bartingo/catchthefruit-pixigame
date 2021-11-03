import { Keyboard, Key } from './Keyboard';
import { AnimatedSprite, Point, Rectangle, Spritesheet } from 'pixi.js';

export class PlayerMovementControl {
    private keyManager: Keyboard = new Keyboard();
    private keyRight: Key;
    private keyLeft: Key;
    private velocityX: number = 0;
    private speed: number = 5;
    private drag: number = .35;
    private bonusSpeed: number = 1;
    private sheet: Spritesheet

    constructor(private player: AnimatedSprite, sheet: Spritesheet, keys: string[] = ['ArrowLeft', 'ArrowRight', " "], private mapRect: Rectangle,) {
        this.keyLeft = this.keyManager.addKey(keys[0], this.keyLeftPressed.bind(this));
        this.keyRight = this.keyManager.addKey(keys[1], this.keyRightPressed.bind(this));
        this.keyManager.addKey(keys[2], this.keySpacePressed.bind(this), this.keySpaceUnpressed.bind(this));
        this.sheet = sheet
        player.play()
    }

    public keyRightPressed() {
        this.player.textures = this.sheet.animations["knight iso char_run right"]
        this.player.play();
        this.velocityX = this.speed;
    }

    private keyLeftPressed(): void {
        this.player.textures = this.sheet.animations["knight iso char_run left"]
        this.player.play();
        this.velocityX = -this.speed;
    }

    private keySpacePressed(): void {
        this.bonusSpeed = 2;
    }

    private keySpaceUnpressed(): void {
        this.bonusSpeed = 1;
    }

    public gameLoop() {
        if (this.velocityX != 0 && this.keyRight.isUp && this.keyLeft.isUp) {
            this.player.textures = this.sheet.animations["knight iso char_idle"]
            this.player.play();
            this.velocityX *= this.drag;

            if (Math.abs(this.velocityX) < .5) {
                this.velocityX = 0;
            }
        }

        let newPlayerX: number = this.player.x + this.velocityX * this.bonusSpeed;

        if (newPlayerX < 0) {
            newPlayerX = 0;
        }
        if (newPlayerX > this.mapRect.width) {
            newPlayerX = this.mapRect.width;
        }

        this.player.x = newPlayerX;
    }

    public getPlayerPosition(): Point {
        return new Point(this.player.x, this.player.y);
    }
}