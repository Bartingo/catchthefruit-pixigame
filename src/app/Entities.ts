import {
  Sprite, Texture
} from 'pixi.js';

import { FruitConfig } from './types';
export default class Entity {
  public sprite: Sprite;
  public fallingType: 'linear' | 'nonlinear';
  public velocity: number
  public constructor(fruitconfig: FruitConfig, x: number, y: number) {
    this.sprite = new Sprite(Texture.from(fruitconfig.texturename));
    this.sprite.anchor.set(0.5);
    this.sprite.y = y;
    this.sprite.x = x;
    this.fallingType = fruitconfig.fallingType;
    this.velocity = fruitconfig.velocity
  }

  public getNextEntityPosition = (entity: Entity): { x: number, y: number } => {
    let entitiyPositionX = entity.sprite.x
    let entitiyPositionY = entity.sprite.y
    if (entity.sprite.visible) {
      switch (entity.fallingType) {
        case 'linear':
          entitiyPositionY = entitiyPositionY + entity.velocity;
          break;
        case 'nonlinear':
          entitiyPositionY = entitiyPositionY + entity.velocity;
          entitiyPositionX = entitiyPositionX + 2 * Math.sin((entitiyPositionY + entitiyPositionY) / 20);
          break;
      }
    }
    return { 'x': entitiyPositionX, 'y': entitiyPositionY }
  }

  public fruitCollected = (entity: Entity): void => {
    entity.sprite.visible = false;
    entity.sprite.y = 0;
  }

  public fruitOutOfBounds = (entity: Entity): void => {
    entity.sprite.visible = false;
    entity.sprite.y = 0;
  }

  public respawnEntity = (newConfig: FruitConfig, spawnPos: number): void => {
    this.sprite.texture = Texture.from(newConfig.texturename)
    this.sprite.x = spawnPos;
    this.sprite.visible = true;
    this.fallingType = newConfig.fallingType;
    this.velocity = newConfig.velocity;
  }
};

