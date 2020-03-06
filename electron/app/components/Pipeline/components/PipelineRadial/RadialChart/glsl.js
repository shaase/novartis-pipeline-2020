import reglConstructor from "regl";
import { attributes, elements } from "./vertices";
import { vert, frag } from "./shaders";

let regl;
let update;

export const startGL = canvas => {
  const gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });

  // regl = reglConstructor(canvas);
  regl = reglConstructor({ gl });

  console.log(canvas, gl);

  update = regl({
    vert,
    frag,
    attributes,
    elements,
    blend: {
      enable: true,
      func: { srcRGB: "src alpha", srcAlpha: 1, dstRGB: "one minus src alpha", dstAlpha: 1 },
    },
    uniforms: {
      size: [789, 789],
      theta: regl.prop("theta"),
      radius: regl.prop("radius"),
      color: regl.prop("color"),
      alpha: regl.prop("alpha"),
    },
  });
};

export const updateGL = arcs => {
  regl.clear({ color: [0, 0, 0, 0], depth: 1 });
  update(arcs);
};

export const readGL = (x, y) => {
  const pixels = regl.read({
    x,
    y,
    width: 1,
    height: 1,
    data: new Uint8Array(4),
  });

  console.log(pixels);
};
