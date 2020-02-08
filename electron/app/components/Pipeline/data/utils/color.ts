import { flattenChildren } from "./flatteners";
import { content } from "../loaded-json";
import { itemsForPath } from "../../utils";
import { PipelineItem } from "../../types";

const tumors = flattenChildren(content.Tumors.children);
const compounds = content.Compounds.children;

let prevRoutePath: string;
let prevColor = "#222222";

export const colorForData = (routePath: string): string => {
  if (routePath !== prevRoutePath) {
    prevRoutePath = routePath;
    const { level, root } = itemsForPath(routePath);

    if ((root === "Compounds" && level > 2) || root === "Tumors") {
      const arr = root === "Compounds" ? compounds : tumors;
      const filtered: PipelineItem[] = arr.filter(
        (child: PipelineItem) =>
          child.path !== undefined && (child.path.includes(routePath) || routePath.includes(child.path)),
      );

      if (filtered.length > 0) {
        prevColor = filtered[0].color || "#222222";
      } else {
        prevColor = "#222222";
      }
    } else {
      prevColor = "#222222";
    }
  }

  return prevColor;
};
