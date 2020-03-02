export const frag = `
  precision highp float;

  float mask (vec2 size_0, vec2 pos, vec2 radius_0) {
    float dz = 10.0/min(size_0.x,size_0.y);
    float r = length(pos);
    float d = smoothstep(radius_0.y-dz,radius_0.y,r)
      + smoothstep(radius_0.x+dz,radius_0.x,r);
    return (1.0-d) * step(radius_0.x,r) * step(r,radius_0.y);
  }

  varying vec2 vpos;
  uniform vec2 size, radius;
  uniform vec3 color;
  void main () {
    float m = mask(size, vpos, radius);
      if (m < 0.01) discard;
      gl_FragColor = vec4(color,m);

  }
`;

export const vert = `
  precision highp float;

  vec2 plot (vec2 position_0, vec2 theta_0) {
    float th = min(theta_0.y,max(theta_0.x,position_0.x));
    vec2 pos = vec2(cos(th),sin(th)) * 2.0 * position_0.y;
    float x = max(abs(pos.x),abs(pos.y))-0.001;
    return pos/x;
  }

  attribute vec2 position;
  uniform vec2 size, theta;
  varying vec2 vpos;
  void main () {
    vpos = plot(position, theta);
    vec2 aspect = vec2(1,size.x/size.y);
    gl_Position = vec4(vpos*aspect*0.5,0,1);
  }
`;
