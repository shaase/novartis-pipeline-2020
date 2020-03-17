import { LabelArc, Context, FormattedText } from "../../../../types";
import { nodeArc } from "../radial-arcs";

let canvasWidth = 789;

const anglePosition = (angle: number): string => {
  if (angle < 0) return "top-right";
  if (angle < Math.PI / 2) return "bottom-right";
  if (angle < Math.PI) return "bottom-left";
  return "top-left";
};

const drawLabel = (context: Context, text: string, color: string): void => {
  context.font = "32px sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillStyle = color;
  context.fillText(text, 0, 0);
};

const drawInline = (context: Context, text: string, color: string, angle: number, radius: number): void => {
  const position = anglePosition(angle);
  context.rotate(angle);
  context.translate(radius, 0);

  if (position.includes("left")) {
    context.rotate(Math.PI);
  }

  drawLabel(context, text, color);
};

const drawCurve = (context: Context, text: string, color: string, angle: number, radius: number): void => {
  const position = anglePosition(angle);
  context.rotate(angle);
  context.translate(radius, 0);
  let rotation = angle;

  if (position.includes("top")) {
    rotation += Math.PI / 2;
    context.rotate(Math.PI / 2);
  } else {
    rotation += Math.PI / -2;
    context.rotate(Math.PI / -2);
  }

  if (text === "SOLID TUMORS") {
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    console.log(rotation, angle, x, y);
  }

  for (let i = 0; i < text.length; i += 1) {
    context.rotate(rotation / text.length);
    // context.save();

    context.translate(0, -radius);
    drawLabel(context, text.charAt(i), color);
    // context.restore();
  }

  // context.save();
  // context.rotate((-1 * angle) / 2);
  // context.rotate((-1 * (angle / text.length)) / 2);

  // context.restore();

  // drawLabel(context, text, color);
};

const layout = (
  context: Context,
  formattedName: FormattedText[],
  color: string,
  radius: number,
  maxWidth: number,
  maxHeight: number,
  display: string,
  angle: number,
): void => {
  formattedName.forEach((group: FormattedText) => {
    const { text } = group;
    let labelText: string = text;
    if (display === "inline" && labelText === "Non-Hodgkin's Lymphoma") labelText = "NHL";
    if (display === "curved-capped") labelText = labelText.toUpperCase();
    context.save();

    if (display === "inline") {
      const words = text.split(" ");
      const textY = 0;
      const line = "";
      const lineHeight = 24 * 1.286;

      // for (let n = 0; n < words.length; n += 1) {
      //   const testLine = `${line + words[n]} `;
      //   const metrics = context.measureText(testLine);
      //   const testWidth = metrics.width;
      //   if (testWidth > maxWidth) {
      //     drawLabel(context, text, color);
      //     if (n < words.length - 1) {
      //       line = `${words[n]} `;
      //       textY += lineHeight;
      //     }
      //   } else {
      //     line = testLine;
      //   }
      // }

      drawInline(context, labelText, color, angle, radius);
    } else {
      // rotate(context, display, angle, radius);
      // drawCurve(context, text, color, radius, angle);
      drawCurve(context, labelText, color, angle, radius);
    }

    context.restore();
  });
};

const updateLabels = (context: Context, arcs: LabelArc[]): void => {
  if (context !== null) {
    canvasWidth = context.canvas.width / window.devicePixelRatio;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.translate(canvasWidth, canvasWidth);

    arcs.forEach((arc: LabelArc) => {
      const { formattedName, centerAngle, centerRadius, display, width, length, color } = arc;

      if (display !== "none") {
        const maxWidth = display === "inline" ? width - 7 : length - 6;
        const maxHeight = display === "inline" ? length : width;
        // const x = 789 + centerRadius * Math.cos(centerAngle);
        // const y = 789 + centerRadius * Math.sin(centerAngle);
        layout(context, formattedName, color, centerRadius, maxWidth, maxHeight, display, centerAngle);
      }
    });

    context.setTransform(1, 0, 0, 1, 0, 0);
  }
};

export default updateLabels;
