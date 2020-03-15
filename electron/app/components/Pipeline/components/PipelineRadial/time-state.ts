let raf = 0;
let startTime = Date.now();
let iterator = 0;

const subscibers: { (n: number): void }[] = [];

export const subscribe = (callback: (n: number) => void): void => {
  subscibers.push(callback);
};

export const unsubscribe = (callback: (n: number) => void): void => {
  cancelAnimationFrame(raf);
  subscibers.splice(subscibers.indexOf(callback));
};

const tick = (): void => {
  if (iterator < 1) {
    const now = Date.now();
    const diff = (now - startTime) / 500;
    iterator = Math.min(1, diff);
    subscibers.forEach((cb: { (n: number): void }) => cb(iterator));
    raf = window.requestAnimationFrame(tick);
  }
};

export const interpolate = (): void => {
  startTime = Date.now();
  iterator = 0;
  tick();
};
