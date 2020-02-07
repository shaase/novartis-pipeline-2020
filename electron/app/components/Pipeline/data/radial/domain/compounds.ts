const domainForCompounds = (
  yd: number[],
  level: number,
  width: number,
  inner: number,
  ring: number,
  outer: number,
): number[] => {
  let range = 0;

  let yr: number[] = [];
  if (level === 0) {
    yr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  } else if (level === 1 || level === 2) {
    yr = yd.map((seg: number, i: number) => {
      if (i < 2) {
        range = 0;
      } else if (i === 2) {
        range = inner;
      } else if (i === 3) {
        range += ring;
      } else if (i === 4) {
        range += ring * 4;
      } else if (i === 5) {
        range = outer;
      } else if (i === 6) {
        // hidden
      } else if (i === 7) {
        // hidden
      } else if (i === 8) {
        range = width;
      } else if (i === 9) {
        // hidden
      }

      return range;
    });
  } else if (level === 3) {
    yr = yd.map((seg: number, i: number) => {
      if (i < 2) {
        range = 0;
      } else if (i === 2) {
        range = inner;
      } else if (i === 3) {
        range += ring;
      } else if (i === 4) {
        range += ring;
      } else if (i === 5) {
        range = outer;
      } else if (i === 6) {
        // hidden
      } else if (i === 7) {
        // hidden
      } else if (i === 8) {
        range = width;
      } else if (i === 9) {
        // hidden
      }

      return range;
    });
  } else {
    yr = yd.map((seg: number, i: number) => {
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
        range += ring * 3.1;
      } else if (i === 7) {
        range = outer;
      } else if (i === 8) {
        range = width;
      } else if (i === 9) {
        // hidden
      }

      return range;
    });
  }

  return yr;
};

export default domainForCompounds;
