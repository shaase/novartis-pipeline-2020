const lineRotation = (
  index: number,
  length: number,
  fontSize: number,
  start: number,
  end: number,
  isRight: boolean,
): number => {
  let rDiff = start / 2 + end / 2;
  const mod = isRight ? 1 : -1;

  if (length === 2) {
    if (index === 0) {
      rDiff -= 0.02 * mod;
    } else {
      rDiff += 0.02 * mod;
    }
  } else if (length === 3) {
    if (index === 0) {
      rDiff -= 0.035 * mod;
    } else if (index === 1) {
      // centered
    } else {
      rDiff += 0.035 * mod;
    }
  } else if (length === 4) {
    if (index === 0) {
      rDiff -= 0.04 * mod;
    } else if (index === 1) {
      rDiff -= 0.02 * mod;
    } else if (index === 2) {
      rDiff += 0.02 * mod;
    } else {
      rDiff += 0.04 * mod;
    }
  } else if (length === 5) {
    if (index === 0) {
      rDiff -= 0.07 * mod;
    } else if (index === 1) {
      rDiff -= 0.035 * mod;
    } else if (index === 2) {
      // centered
    } else if (index === 3) {
      rDiff += 0.035 * mod;
    } else {
      rDiff += 0.07 * mod;
    }
  }

  return rDiff;
};

export default lineRotation;
