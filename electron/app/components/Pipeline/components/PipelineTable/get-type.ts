const getType = (level: number, path: string): string => {
  if (path.includes("Heme") && level < 3) {
    return "Root";
  }

  if (!path.includes("Heme") && level < 4) {
    return "Root";
  }

  if (level < 4) {
    return "LongList";
  }

  return "ShortList";
};

export default getType;
