import { LabelArc, Context } from "../../../../types";

let canvasWidth = 789;

const drawLabel = (context: Context, text: string, color: string): void => {
  context.font = "32px sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillStyle = color;
  context.fillText(text, 0, 0);
};

const rotate = (context: Context, textDisplay: string, angle: number, radius: number): void => {
  context.rotate(angle);
  context.translate(radius, 0);

  if (textDisplay === "inline") {
    if (angle > Math.PI * 0.5) {
      context.rotate(Math.PI);
    }
  } else if (angle > 0 || angle > Math.PI * 0.75) {
    context.rotate(Math.PI / -2);
  } else {
    context.rotate(Math.PI / 2);
  }
};

const layout = (
  context: Context,
  text: string,
  color: string,
  radius: number,
  maxWidth: number,
  maxHeight: number,
  textDisplay: string,
  angle: number,
): void => {
  const words = text.split(" ");
  let textY = 0;
  let line = "";
  const lineHeight = 24 * 1.286;
  context.save();

  rotate(context, textDisplay, angle, radius);

  for (let n = 0; n < words.length; n += 1) {
    const testLine = `${line + words[n]} `;
    const metrics = context.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth) {
      drawLabel(context, text, color);
      if (n < words.length - 1) {
        line = `${words[n]} `;
        textY += lineHeight;
      }
    } else {
      line = testLine;
    }
  }

  drawLabel(context, text, color);
  context.restore();
};

const updateLabels = (context: Context, arcs: LabelArc[]): void => {
  if (context !== null) {
    canvasWidth = context.canvas.width / window.devicePixelRatio;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.translate(canvasWidth, canvasWidth);

    arcs.forEach((arc: LabelArc) => {
      const { text, centerAngle, centerRadius, display, width, length, color } = arc;

      if (display !== "none") {
        const maxWidth = display === "inline" ? width - 7 : length - 6;
        const maxHeight = display === "inline" ? length : width;
        // const x = 789 + centerRadius * Math.cos(centerAngle);
        // const y = 789 + centerRadius * Math.sin(centerAngle);

        let labelText = text;
        if (display === "inline" && text === "Non-Hodgkin's Lymphoma") labelText = "NHL";
        if (display === "curved-capped") labelText = labelText.toUpperCase();
        // console.log(text, centerAngle);
        layout(context, labelText, color, centerRadius, maxWidth, maxHeight, display, centerAngle);
      }
    });

    context.setTransform(1, 0, 0, 1, 0, 0);
  }
};

export default updateLabels;
