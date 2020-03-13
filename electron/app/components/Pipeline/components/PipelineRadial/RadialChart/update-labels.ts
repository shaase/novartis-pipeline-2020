import { LabelArc } from "../../../types";

const drawLabel = (context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number): void => {
  const words = text.split(" ");
  let line = "";
  const lineHeight = 24 * 1.286; // a good approx for 10-18px sizes

  context.font = "24px sans-serif";
  context.textBaseline = "top";

  for (let n = 0; n < words.length; n += 1) {
    const testLine = `${line + words[n]} `;
    const metrics = context.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth) {
      context.fillText(line, x, y);
      if (n < words.length - 1) {
        line = `${words[n]} `;
        y += lineHeight;
      }
    } else {
      line = testLine;
    }
  }

  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillStyle = "#FFFFFF";
  context.fillText(line, x, y);
};

const updateLabels = (context: CanvasRenderingContext2D, arcs: LabelArc[]): void => {
  if (context !== null) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.beginPath();

    arcs.forEach((arc: LabelArc) => {
      const { text, centerAngle, centerRadius, display, width, length } = arc;
      const x = 789 + centerRadius * Math.cos(centerAngle);
      const y = 789 + centerRadius * Math.sin(centerAngle);

      if (display !== "none" && width > 10 && length > 10) {
        drawLabel(context, text.charAt(0), x, y, length);
      }
    });
  }
};

export default updateLabels;
