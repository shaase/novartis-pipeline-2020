import { getOrientation } from "../../panels";

interface SizeStyle {
  screenWidth: number;
  screenHeight: number;
  transform: string;
}

export const styleForScale = (scale: number): SizeStyle => {
  const orientation = getOrientation();
  const w = orientation === "landscape" ? 1920 : 1080;
  const h = orientation === "landscape" ? 1080 : 1920;
  const x = (w * scale - w) / 2;
  const y = (h * scale - h) / 2;
  const transform = `translate(${x}px, ${y}px) scale(${scale})`;
  return { screenWidth: w, screenHeight: h, transform };
};
