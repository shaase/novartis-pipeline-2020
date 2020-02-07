const domainForNoTumorType = (
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
    } else if (i === 2) {
      range = inner;
    } else if (i === 3) {
      range += ring;
    } else if (i === 4) {
      range += ring;
    } else if (i === 5) {
      range += ring;
    } else if (i === 6) {
      // hidden
    } else if (i === 7) {
      // hidden
    } else if (i === 8) {
      range = outer;
    } else if (i === 9) {
      range = width;
    }
    return range;
  });

  return yr;
};

export default domainForNoTumorType;
