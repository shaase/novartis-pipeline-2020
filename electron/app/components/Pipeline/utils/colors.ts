// TODO: re-order background and defaultColor for all callers

export const colorForBackground = (defaultColor: string, background?: string): string => {
  if (background === undefined) {
    return defaultColor;
  }
  return background === "#F7C114" || background === "#F89B1C" || background === "#FBDE3C" || background === "#DBD36E"
    ? "#5B3400"
    : defaultColor;
};

export const hexToRgb = (hex: string): string => {
  const result = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : "255, 255, 255";
};

interface RGB {
  r: number;
  g: number;
  b: number;
}

export const hexToRgbArray = (hex: string): number[] => {
  const result = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(hex);

  return result
    ? [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255]
    : [0, 0, 0];
};

export const lighten = (color: string, amount: number): string => {
  const c = color.replace("#", "");
  const rgb = [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)];
  let str = "#";
  rgb.forEach((n: number) => {
    str += Math.round((255 - n) * (1 - Math.E ** -amount) + n).toString(16);
  });
  return str;
};
