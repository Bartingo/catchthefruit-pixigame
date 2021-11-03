export type FruitConfig = {
    texturename: string
    velocity: number
    fallingType: 'linear' | 'nonlinear';
}

export type FruitConfigArray = FruitConfig[]