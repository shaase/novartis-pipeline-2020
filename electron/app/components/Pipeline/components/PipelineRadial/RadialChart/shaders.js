export const vert = `
  precision highp float;

  vec2 plot(vec2 position_0, vec2 theta_0) {
    float th = min(theta_0.y, max(theta_0.x, position_0.x));
    vec2 pos = vec2(cos(th), sin(th)) * 2.0 * position_0.y;
    float x = max(abs(pos.x), abs(pos.y)) - 0.001;
    return pos/x;
  }

  attribute vec2 position;
  uniform vec2 theta;
  varying vec2 vpos;
  void main () {
    vpos = plot(position, theta);
    gl_Position = vec4(vpos, 0, 0.5);
  }
`;

// length(components): square root of the sum of squared components
// step(edge, x): x < edge ? 0.0 : 1.0
// smoothstep(edge0, edge1, x): x < edge0 ? 0.0 : x > edge1 ? 1.0 : [INTERPOLATED] 0.0 -> 1.0

export const frag = `
  precision highp float;

  float radialEdge(float size_0, vec2 pos, vec2 radius_0) {
    float dz = 10.0 / size_0;
    float r = length(pos);
    float d = smoothstep(radius_0.y - dz, radius_0.y, r) + smoothstep(radius_0.x + dz,radius_0.x, r);
    return (1.0 - d) * step(radius_0.x, r) * step(r, radius_0.y);
  }

  varying vec2 vpos;
  uniform float alpha, size;
  uniform vec2 radius, theta;
  uniform vec3 color;
  void main () {
    float re = radialEdge(size, vpos, radius);
    vec3 white = vec3(1.0, 1.0, 1.0);
    if (re < 0.01) discard;
    else if (re < 0.02) gl_FragColor = vec4(mix(color, white, 1.0), alpha);
    else if (re < 0.04) gl_FragColor = vec4(mix(color, white, 0.8), alpha);
    else if (re < 0.06) gl_FragColor = vec4(mix(color, white, 0.6), alpha);
    else if (re < 0.08) gl_FragColor = vec4(mix(color, white, 0.4), alpha);
    else if (re < 0.10) gl_FragColor = vec4(mix(color, white, 0.2), alpha);
    else gl_FragColor = vec4(color, alpha);
  }
`;
