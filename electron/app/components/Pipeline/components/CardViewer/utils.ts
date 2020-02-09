export const rounded = (index: number, length: number, cardIndex: number): string => {
  const isSelected = index === cardIndex;
  if (length === 2) {
    if (index === 0 && isSelected) {
      return isSelected ? "0 100px 100px 0" : "unset";
    }

    if (index === length - 1 && isSelected) {
      return isSelected ? "100px 0 0 100px" : "unset";
    }
  }

  if (length > 2) {
    if (index === 0) {
      return isSelected ? "0 100px 100px 0" : "unset";
    }

    if (index === length - 1) {
      return isSelected ? "100px 0 0 100px" : "unset";
    }

    if (index < cardIndex) {
      return "100px 0 0 100px";
    }

    if (index === cardIndex) {
      return "100px";
    }

    return "0 100px 100px 0";
  }

  return "unset";
};

export const leftBorder = (index: number, length: number, color: string, cardIndex: number): string => {
  if (length > 2 && index === 1 && cardIndex === 2) {
    return `2px solid ${color}`;
  }

  return "unset";
};

export const rightBorder = (index: number, length: number, color: string, cardIndex: number): string => {
  if (length > 2 && index === 1 && cardIndex === 0) {
    return `2px solid ${color}`;
  }

  return "unset";
};

export const fileExists = async (path: string): Promise<string> =>
  new Promise((resolve: (value?: string | PromiseLike<string>) => void) => {
    const img = new Image();
    img.onload = () => {
      resolve(path);
    };

    img.onerror = () => {
      resolve("error");
    };

    img.src = path || "";
  });
