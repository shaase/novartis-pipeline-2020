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
