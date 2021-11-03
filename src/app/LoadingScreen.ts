import {
    Loader,
} from 'pixi.js';
export class LoadingScreen {

    constructor(private callback: Function) {
        Loader.shared
            // .add('hero', '/assets/img/hero.png')
            .add("/assets/img/hero.json")
            .add('apple', '/assets/img/Apple.png')
            .add('dragonfruit', '/assets/img/DragonFruit.png')
            .add('turnip', '/assets/img/Turnip.png')

        Loader.shared.load()
        Loader.shared.onComplete.add(this.handleLoadComplete.bind(this))
    }

    private handleLoadComplete() {
        this.callback();
    }
}