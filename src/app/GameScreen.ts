import { Application, Container, Sprite, Rectangle, Text, Loader, AnimatedSprite, Spritesheet } from 'pixi.js';
import { PlayerMovementControl } from './utils/PlayerMovementControl';
import Entity from './Entities';
import Utils from './utils/Utils';
import { Timer, TimerManager } from './utils/timeManager';
import { FruitConfig } from './types';
import { Keyboard } from './utils/Keyboard';
import { EntitiesConfig } from './gameConfig';

export class GameScreen {

    private playerContainer: Container;
    private keyManager: Keyboard = new Keyboard();
    private playerMoveController: PlayerMovementControl;
    private scoreText: Text;
    private score: number = 0;
    private player: AnimatedSprite;
    private playerAnimSheet: Spritesheet;
    private entities: Array<Entity> = [];
    private entitiesLimit: number = 8;
    private timerManager: TimerManager
    private timer: Timer;
    private windowHeight: number
    private windowWidth: number;
    private welcomeScene: Container = new Container();
    private gameOverScene: Container = new Container();
    private gameOverHighScoreText: Text;
    private gameScene: Container = new Container();
    private gameState: Function;
    private entitiesSpawnRate: number = 700;
    private playerLives: number = 10;
    private playerLivesText: Text;
    constructor(private app: Application,) {
        //init appCanvas
        this.windowHeight = app.screen.height;
        this.windowWidth = app.screen.width;
        //bind key to gamestart
        this.playerAnimSheet = Loader.shared.resources["/assets/img/hero.json"].spritesheet!;
        this.keyManager.addKey("Enter", this._startGame.bind(this));

        //setup welcomescene
        this._setWelcomeScene();
        //setup gameoverscene
        this._setGameOverScene();
        //setup gamescene
        this._setGameScene();

        //enable intervalEventDispatcher
        this._setIntervalEventDispatcher(app);

        app.stage.addChild(this.welcomeScene);
        app.stage.addChild(this.gameScene);
        app.stage.addChild(this.gameOverScene);

        this.gameState = this.welcomeScreen;
    }

    private _startGame(): void {
        if (!this.gameScene.visible) {
            this.score = 0;
            this.playerLives = 10;
            this.scoreText.text = `Punkty: ${this.score}`;
            this.playerLivesText.text = `Żyćko: ${this.playerLives}`;
            this.entities.forEach(entity => {
                entity.sprite.visible = false;
                entity.sprite.y = 0;
            });

            this.gameScene.visible = true;
            this.gameOverScene.visible = false;
            this.welcomeScene.visible = false;
            this.gameState = this.play;
        }
    }

    private welcomeScreen(): void {
    }

    private EntityController(): void {
        const entitiyToUpdate = this.entities.find(entity => !entity.sprite.visible);
        const randomEntity = EntitiesConfig[Utils.getRandomInt(0, EntitiesConfig.length - 1)]
        const randomPosition = Utils.getRandomInt(50, this.windowWidth - 50)
        if (this.entitiesLimit > this.entities.length) {
            this.createEntity(randomEntity);
        } else if (entitiyToUpdate) {
            entitiyToUpdate.respawnEntity(randomEntity, randomPosition)
        }
    }

    private collisionCheck(player: Sprite, entities: Array<Entity>): void {
        entities.forEach(entity => {

            if (Utils.hitTestRectangle(player, entity.sprite)) {
                this.score += 10;
                this.scoreText.text = `Punkty: ${this.score}`;
                entity.fruitCollected(entity);
            }

            else if (entity.sprite.y >= this.windowHeight) {
                this.playerLives -= 1;
                this.playerLivesText.text = `Żyćko: ${this.playerLives}`;
                entity.fruitOutOfBounds(entity);
            }
        });
    }

    private createPlayer(): Container {
        let playerContainer: Container = new Container();
        this.player = new AnimatedSprite(this.playerAnimSheet.animations["knight iso char_idle"]);
        this.player.animationSpeed = 0.167;
        this.player.anchor.set(.5, .5);
        this.player.x = this.app.screen.width / 2;
        this.player.y = this.app.screen.height * 0.9;
        playerContainer.addChild(this.player);

        return playerContainer;
    }

    private createEntity(entityConfig: FruitConfig): void {
        this.entities.push(new Entity(entityConfig, Utils.getRandomInt(50, this.windowWidth - 50), 0));
        this.gameScene.addChild(this.entities[this.entities.length - 1].sprite);
    }

    private gameover() {
        this.gameScene.visible = false;
        this.gameOverScene.visible = true;
        this.gameOverHighScoreText.text = `High Score:${this.score}`;
    }

    private play() {
        this.timerManager.update();
        // this.timer.on('start', () => console.log('start'));

        this.playerMoveController.gameLoop();

        this.entities.forEach(entity => {
            let newPosition = entity.getNextEntityPosition(entity)
            entity.sprite.y = newPosition.y;
            entity.sprite.x = newPosition.x;
        });
        if (this.playerLives <= 0) {
            this.gameState = this.gameover;
        }
        this.collisionCheck(this.player, this.entities);

    }

    private gameLoop() {
        this.gameState();
    }

    private _setGameOverScene(): void {
        const gameOverText = new Text(`Game over :(`, { fill: 0xffffff });
        this.gameOverHighScoreText = new Text(`High Score: ${this.score}`, { fill: 'gold' });
        const gameOverText2 = new Text(`Press Enter to restart`, { fill: 0xffffff });

        gameOverText.anchor.set(.5, .5);
        this.gameOverHighScoreText.anchor.set(.5, .5);
        gameOverText2.anchor.set(.5, .5);

        gameOverText.position.set(this.windowWidth / 2, this.windowHeight / 2 - 80);
        this.gameOverHighScoreText.position.set(this.windowWidth / 2, this.windowHeight / 2);
        gameOverText2.position.set(this.windowWidth / 2, this.windowHeight / 2 + 100);

        this.gameOverScene.addChild(gameOverText);
        this.gameOverScene.addChild(this.gameOverHighScoreText);
        this.gameOverScene.addChild(gameOverText2);
        this.gameOverScene.visible = false; //do default value
    }

    private _setGameScene(): void {
        this.playerContainer = this.createPlayer();
        this.playerMoveController = new PlayerMovementControl(this.player, this.playerAnimSheet, ["ArrowLeft", "ArrowRight", " ",], new Rectangle(0, 0, this.windowWidth, this.windowHeight));
        this.timerManager = new TimerManager();
        this.playerLivesText = new Text(`Żyćko: ${this.playerLives}`, { fill: 0xffffff });
        this.playerLivesText.anchor.set(1, 0);
        this.playerLivesText.position.set(this.windowWidth, 0);
        this.gameScene.addChild(this.playerLivesText);
        this.scoreText = new Text('Punkty: 0', { fill: 0xffffff });
        this.gameScene.addChild(this.scoreText);
        this.gameScene.addChild(this.playerContainer);
        this.gameScene.visible = false;

    }

    private _setWelcomeScene(): void {
        const instructions = new Text('← → - Move', { fill: 0xffffff });
        const instructions2 = new Text('SPACEBAR - Sprint', { fill: 0xffffff });
        const instructions3 = new Text('Press ENTER to start', { fill: 0xffffff });
        instructions3.anchor.set(.5, .5);
        instructions.anchor.set(.5, .5);
        instructions2.anchor.set(.5, .5);
        instructions.position.set(this.windowWidth / 2, this.windowHeight / 2 - 40);
        instructions2.position.set(this.windowWidth / 2, this.windowHeight / 2);
        instructions3.position.set(this.windowWidth / 2, this.windowHeight / 2 + 100);
        this.welcomeScene.addChild(instructions);
        this.welcomeScene.addChild(instructions2);
        this.welcomeScene.addChild(instructions3);
        this.welcomeScene.visible = true;
    }
    private _setIntervalEventDispatcher(app: Application): void {
        this.timer = this.timerManager.createTimer(this.entitiesSpawnRate);
        this.timer.loop = true;
        this.timer.start();
        app.ticker.add(() => this.gameLoop());
        this.timer.on('repeat', () => {
            this.EntityController();
        });
    }

}