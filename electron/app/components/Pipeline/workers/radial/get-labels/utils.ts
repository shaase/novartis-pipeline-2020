export const replaceMarkup = (str: string): string =>
  str
    .split("<sup>")
    .join('<tspan baseline-shift="super" font-size="60%">')
    .split("</sup>")
    .join("</tspan>")
    .split("+")
    .join("")
    .split("<b>")
    .join("")
    .split("</b>")
    .join("")
    .split("<i>")
    .join("")
    .split("</i>")
    .join("");

export const simpleReplace = (str: string): string =>
  str
    .split("<sup>")
    .join('<tspan baseline-shift="super" font-size="60%">')
    .split("</sup>")
    .join("</tspan>")
    .split("<b>")
    .join('<tspan font-weight="bold">')
    .split("</b>")
    .join("</tspan>")
    .split("<i>")
    .join('<tspan font-style="italic">')
    .split("</i>")
    .join("</tspan>");

export const removeMarkup = (str: string): string =>
  str
    .split("<sup>")
    .join("")
    .split("</sup>")
    .join("")
    .split("<b>")
    .join("")
    .split("</b>")
    .join("")
    .split("<i>")
    .join("")
    .split("</i>")
    .join("");
