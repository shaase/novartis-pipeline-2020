import { fileTimestamp } from "radius-utils";

export const record = (action: string): void => {
  const args = { detail: { time: fileTimestamp(), action } };
  document.dispatchEvent(new CustomEvent("METRICS", args));
};
