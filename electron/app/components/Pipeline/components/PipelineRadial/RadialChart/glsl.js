import reglConstructor from "regl";
import { attributes, elements } from "./vertices";
import { vert, frag } from "./shaders";

let regl;
let update;
let reglInteractor;
let updateInteractor;

export const startGL = (canvas, interactor) => {
  const gl = canvas.getContext("webgl");
  const glInteractor = interactor.getContext("webgl", { preserveDrawingBuffer: true });

  regl = reglConstructor({ gl });
  reglInteractor = reglConstructor({ gl: glInteractor });

  const props = {
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
  };

  update = regl(props);
  updateInteractor = reglInteractor(props);
};

export const updateGL = arcs => {
  regl.clear({ color: [0, 0, 0, 0], depth: 1 });
  update(arcs);
};

export const updateGLInteractor = arcs => {
  reglInteractor.clear({ color: [0, 0, 0, 0], depth: 1 });
  updateInteractor(arcs);
};

export const readGL = (x, y) => {
  const pixel = reglInteractor.read({
    x,
    y,
    width: 1,
    height: 1,
    data: new Uint8Array(4),
  });

  return pixel;
};
