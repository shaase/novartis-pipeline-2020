import { scaleLinear, scaleSqrt } from "d3-scale";
import { interpolate as d3interpolate } from "d3-interpolate";

let raf = 0;
let startTime = Date.now();
let iterator = 0;
let prevPath = "";
export const xScale = scaleLinear();
export const yScale = scaleSqrt();
const empty: number[] = [];
let xd = d3interpolate(xScale.domain(), empty);
let yd = d3interpolate(xScale.domain(), empty);
let yr = d3interpolate(xScale.domain(), empty);
const subscibers: { (): void }[] = [];

export const subscribe = (callback: () => void): void => {
  subscibers.push(callback);
};

export const unsubscribe = (callback: () => void): void => {
  cancelAnimationFrame(raf);
  subscibers.splice(subscibers.indexOf(callback));
};

const tick = (): void => {
  if (iterator < 1) {
    const now = Date.now();
    const diff = (now - startTime) / 500;
    iterator = Math.min(1, diff);
    xScale.domain(xd(iterator));
    yScale.domain(yd(iterator)).range(yr(iterator));
    subscibers.forEach((cb: { (): void }) => cb());
    raf = window.requestAnimationFrame(tick);
  }
};

export const update = (
  path: string,
  xDomain: number[],
  xRange: number[],
  yDomain: number[],
  yRange: number[],
): void => {
  if (xScale.domain().length === 0) {
    xScale.domain(xDomain).range(xRange);
    yScale.domain(yDomain).range(yRange);
  } else if (prevPath !== path) {
    xd = d3interpolate(xScale.domain(), xDomain);
    yd = d3interpolate(yScale.domain(), yDomain);
    yr = d3interpolate(yScale.range(), yRange);
    startTime = Date.now();
    iterator = 0;
    xScale.domain(xd(iterator)).range(xRange);
    yScale.domain(yd(iterator)).range(yr(iterator));
    prevPath = path;
  }

  tick();
};
