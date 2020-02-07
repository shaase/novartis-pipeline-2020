export const removeParenthetical = (string: string): string => {
  const formatted = string.replace(/\(.*?\)\s?/g, "");

  if (/\s+$/.test(formatted)) {
    return formatted.slice(0, -1);
  }

  return formatted;
};

export const removeMarkup = (string: string): string => {
  const formatted = string
    .replace(/<sup>.*?<\/sup>\s?/g, "")
    .split("  ")
    .join(" ")
    .split("<b>")
    .join("")
    .split("</b>")
    .join("")
    .split("<i>")
    .join("")
    .split("</i>")
    .join("");

  if (/\s+$/.test(formatted)) {
    return formatted.slice(0, -1);
  }

  return formatted;
};
