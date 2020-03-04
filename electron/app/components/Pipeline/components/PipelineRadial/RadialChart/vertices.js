// https://github.com/glslify/glsl-circular-arc/blob/master/index.js

let position = [
  [0, 0],
  [0, 1],
];
let arrElements = [];

for (let i = 0; i <= 4; i++) {
  position.push([(i / 4) * 2 * Math.PI + Math.PI / 4, 1]);
}

for (let i = 2; i < position.length; i++) {
  arrElements.push([0, i - 1, i]);
}

export const attributes = { position };
export const elements = arrElements;
