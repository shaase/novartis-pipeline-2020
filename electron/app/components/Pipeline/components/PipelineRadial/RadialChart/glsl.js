import reglConstructor from "regl";
import { attributes, elements } from "./vertices";
import { vert, frag } from "./shaders";

let regl;
let update;

export const startGL = canvas => {
  regl = reglConstructor(canvas);

  update = regl({
    vert,
    frag,
    attributes,
    elements,
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
  });
};

export const updateGL = arcs => {
  regl.clear({ color: [0, 0, 0, 0], depth: true });
  update(arcs);
};
