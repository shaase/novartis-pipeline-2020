// https://github.com/glslify/glsl-circular-arc/blob/master/index.js

let mesh = {
  position: [
    [0, 0],
    [0, 1],
  ],
  elements: [],
};

for (let i = 0; i <= 4; i++) {
  mesh.position.push([(i / 4) * 2 * Math.PI + Math.PI / 4, 1]);
}
for (let i = 2; i < mesh.position.length; i++) {
  mesh.elements.push([0, i - 1, i]);
}

export const position = mesh.position;
export const elements = mesh.elements;
