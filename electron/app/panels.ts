import { getPersistent } from "radius-electron";
import { panel as panelStore } from "../store.json";

const { key: PANEL_KEY, values, orientations } = panelStore || { key: "", values: [], orientations: [] };
const panels: string[] = values;

export const getPanel = (): string => getPersistent(PANEL_KEY) || panels[0];
export const getOrientation = (): string => {
  const panel = getPanel();
  const pi: number = panels.indexOf(panel);
  const orientation = orientations[pi] || "landscape";
  return orientation;
};
