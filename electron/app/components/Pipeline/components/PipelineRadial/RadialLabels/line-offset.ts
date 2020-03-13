const lineOffset = (index: number, length: number, fontSize: number, isUnder: boolean): number => {
  const mod = isUnder ? 1 : -1;
  let yOffset = 0;

  if (length === 2) {
    if (index === 0) {
      yOffset -= fontSize * 0.6 * mod;
    } else {
      yOffset += fontSize * 0.6 * mod;
    }
  } else if (length === 3) {
    if (index === 0) {
      yOffset -= fontSize * mod;
    } else if (index === 1) {
      // at center
    } else {
      yOffset += fontSize * mod;
    }
  } else if (length === 4) {
    if (index === 0) {
      yOffset -= fontSize * 1.8 * mod;
    } else if (index === 1) {
      yOffset -= fontSize * 0.6 * mod;
    } else if (index === 2) {
      yOffset += fontSize * 0.6 * mod;
    } else {
      yOffset += fontSize * 1.8 * mod;
    }
  } else if (length === 5) {
    if (index === 0) {
      yOffset -= fontSize * 2.4 * mod;
    } else if (index === 1) {
      yOffset -= fontSize * 1.2 * mod;
    } else if (index === 2) {
      // at center
    } else if (index === 3) {
      yOffset += fontSize * 1.2 * mod;
    } else {
      yOffset += fontSize * 2.4 * mod;
    }
  } else if (length === 6) {
    if (index === 0) {
      yOffset -= fontSize * 3.6 * mod;
    } else if (index === 1) {
      yOffset -= fontSize * 1.8 * mod;
    } else if (index === 2) {
      yOffset -= fontSize * 0.6 * mod;
    } else if (index === 3) {
      yOffset += fontSize * 0.6 * mod;
    } else if (index === 4) {
      yOffset += fontSize * 1.8 * mod;
    } else {
      yOffset += fontSize * 3.6 * mod;
    }
  }

  return yOffset;
};

export default lineOffset;
