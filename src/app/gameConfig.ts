import { FruitConfigArray } from "./types";
export const EntitiesConfig: FruitConfigArray = [{
    "texturename": "apple",
    "velocity": 3,
    "fallingType": 'linear',
},
{
    "texturename": "turnip",
    "velocity": 1,
    "fallingType": 'linear',
},
{
    "texturename": "dragonfruit",
    "velocity": 1,
    "fallingType": 'nonlinear',
},
];

export const windowConfig ={
    width: 512, height: 512,
}