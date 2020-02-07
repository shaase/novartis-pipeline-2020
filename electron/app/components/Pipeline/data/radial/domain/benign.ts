const domainForBenign = (
  yd: number[],
  level: number,
  width: number,
  inner: number,
  ring: number,
  outer: number,
): number[] => {
  let range = 0;

  const yr: number[] = yd.map((seg: number, i: number) => {
    if (i < 2) {
      range = 0;
    } else if (i < 3) {
      range = inner;
    } else if (i < 5) {
      range += ring;
    } else if (i < 6) {
      range += ring;
    } else if (i === 6) {
      range += ring;
    } else if (i === 7) {
      range += ring;
    } else if (i === 8) {
      range = outer;
    } else {
      range = width;
    }
    return range;
  });

  return yr;
};

export default domainForBenign;
