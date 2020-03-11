export const vert = `
  precision highp float;

  vec2 plot (vec2 position_0, vec2 theta_0) {
    float th = min(theta_0.y, max(theta_0.x, position_0.x));
    vec2 pos = vec2(cos(th), sin(th)) * 2.0 * position_0.y;
    float x = max(abs(pos.x), abs(pos.y)) - 0.001;
    return pos/x;
  }

  attribute vec2 position;
  uniform vec2 size, theta;
  varying vec2 vpos;
  void main () {
    vpos = plot(position, theta);
    vec2 aspect = vec2(1, size.x / size.y);
    gl_Position = vec4(vpos * aspect * 1.0, 0, 0.5);
  }
`;

export const frag = `
  precision highp float;

  float mask (vec2 size_0, vec2 pos, vec2 radius_0) {
    float dz = 10.0 / min(size_0.x, size_0.y);
    float r = length(pos);
    float d = smoothstep(radius_0.y - dz, radius_0.y, r) + smoothstep(radius_0.x + dz,radius_0.x, r);
    return (1.0 - d) * step(radius_0.x, r) * step(r, radius_0.y);
  }

  varying vec2 vpos;
  uniform float alpha;
  uniform vec2 size, radius;
  uniform vec3 color;
  void main () {
    float m = mask(size, vpos, radius);
    vec3 white = vec3(1.0, 1.0, 1.0);
    if (m < 0.01) discard;
    else if (m < 0.02) gl_FragColor = vec4(mix(color, white, 1.0), alpha);
    else if (m < 0.04) gl_FragColor = vec4(mix(color, white, 0.8), alpha);
    else if (m < 0.06) gl_FragColor = vec4(mix(color, white, 0.6), alpha);
    else if (m < 0.08) gl_FragColor = vec4(mix(color, white, 0.4), alpha);
    else if (m < 0.10) gl_FragColor = vec4(mix(color, white, 0.2), alpha);
    else gl_FragColor = vec4(color, alpha);
  }
`;
