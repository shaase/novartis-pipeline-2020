export const hexColor = (hexString: string): number => {
  const str = `${hexString}`.replace(/[^\da-f]/gi, "");
  return parseInt(str, 16);
};
