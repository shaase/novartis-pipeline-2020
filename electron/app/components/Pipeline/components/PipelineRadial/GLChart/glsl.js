import reglConstructor from "regl";
import meshConstructor from "glsl-circular-arc";
import { frag, vert } from "./shaders";

export const startGL = canvas => {
  const regl = reglConstructor(canvas);
  const mesh = meshConstructor();

  const menu = regl({
    frag,
    vert,
    blend: {
      enable: true,
      func: { src: "src alpha", dst: "one minus src alpha" },
    },
    uniforms: {
      size: [785, 785],
      theta: regl.prop("theta"),
      radius: regl.prop("radius"),
      color: regl.prop("color"),
    },
    attributes: {
      position: mesh.positions,
    },
    elements: mesh.cells,
  });

  regl.frame(context => {
    regl.clear({ color: [0, 0, 0, 1], depth: true });
    const t = context.time;
    const st = Math.sin(t) * 0.5 + 0.5;

    menu([
      {
        theta: [0, st * 2 * Math.PI],
        radius: [0.25, 0.5],
        color: [1, 0, 0.5],
      },
      {
        theta: [1 * st * 4, st * 2 * Math.PI],
        radius: [0.5, 0.75],
        color: [0.5, 1, 0],
      },
      {
        theta: [0, (st / 2) * Math.PI + 1],
        radius: [0.75, 1],
        color: [0, 0.5, 1],
      },
      {
        theta: [2, (st / 2) * Math.PI + 3],
        radius: [0.75, 1],
        color: [1, 0.5, 0],
      },
      {
        theta: [4, (st / 2) * Math.PI + 5],
        radius: [0.75, 1],
        color: [1, 1, 0],
      },
    ]);
  });
};
