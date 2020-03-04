import reglConstructor from "regl";

let regl;
let update;

export const startGL = canvas => {
  regl = reglConstructor(canvas);

  update = regl({
    frag: `
  precision highp float;
  uniform vec4 color;
  void main() {
    gl_FragColor = color;
  }`,

    vert: `
  precision highp float;
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0, 1);
  }`,

    attributes: {
      position: regl.buffer([
        [-2, -2],
        [4, -2],
        [4, 4],
      ]),
    },

    uniforms: {
      color: regl.prop("color"),
    },
    count: 3,
  });

  regl.frame(() => {
    regl.clear({ color: [0, 0, 0, 0], depth: 1 });
    update({ color: [0.999, 0, 0.999, 1] });
  });
};

export const updateGL = () => {
  // regl.clear({ color: [0, 0, 0, 0], depth: 1 });
  // update({ color: [0.999, 0, 0.999, 1] });
};
