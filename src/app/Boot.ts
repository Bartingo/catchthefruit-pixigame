import * as PIXI from 'pixi.js';
import { LoadingScreen } from './LoadingScreen';
import { GameScreen } from './GameScreen';
import { install } from '@pixi/unsafe-eval';
import { windowConfig } from './gameConfig';


export class GameBoot {
    private app: PIXI.Application;
    constructor() {
        install(PIXI) //patching PIXI CSP support
        this.app = new PIXI.Application({
            width: windowConfig.width,
            height: windowConfig.height,
            sharedTicker: true,
            sharedLoader: true,
            backgroundColor: 0x9980ff //light-purple
        });
        document.body.appendChild(this.app.view);

        this.startLoadingScreen();
    }

    startLoadingScreen() {
        new LoadingScreen(this.startGameScreen.bind(this));
    }

    startGameScreen() {
        new GameScreen(this.app);
    }
}

window.onload = function () {
    new GameBoot();
}
