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

  float angleEdge(vec2 pos, vec2 radius_0, vec2 theta_0) {
    float r = sqrt(pow(pos.x, 2.0) + pow(pos.y, 2.0));
    float angle = atan(pos.y, pos.x);
    float diff0 = angle - theta_0.x;
    float diff1 = theta_0.y - angle;
    float diff = min(diff0, diff1);
    return diff0 * r * 3.14;
  }

  varying vec2 vpos;
  uniform float alpha, size;
  uniform vec2 radius, theta;
  uniform vec3 color;
  void main () {
    float dist = 0.02;
    float re = radialEdge(size, vpos, radius);
    float ae = angleEdge(vpos, radius, theta);
    vec3 white = vec3(1.0, 1.0, 1.0);
    if (re < 0.01) discard;
    else if (re < dist * 1.0) gl_FragColor = vec4(mix(color, white, 1.0), alpha);
    else if (re < dist * 2.0) gl_FragColor = vec4(mix(color, white, 0.8), alpha);
    else if (re < dist * 3.0) gl_FragColor = vec4(mix(color, white, 0.6), alpha);
    else if (re < dist * 4.0) gl_FragColor = vec4(mix(color, white, 0.4), alpha);
    else if (re < dist * 5.0) gl_FragColor = vec4(mix(color, white, 0.2), alpha);
    else if (ae < 0.003) gl_FragColor = vec4(mix(color, white, 0.8), alpha);
    else if (ae < 0.004) gl_FragColor = vec4(mix(color, white, 0.4), alpha);
    else if (ae < 0.005) gl_FragColor = vec4(mix(color, white, 0.2), alpha);
    else gl_FragColor = vec4(color, alpha);
  }
`;
