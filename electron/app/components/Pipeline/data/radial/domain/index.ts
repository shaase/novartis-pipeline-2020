// @flow

import { flattenedCompoundChildren } from "../data";
import { itemsForPath } from "../../../utils";
import { PipelineItem } from "../../../types";
import compounds from "./compounds";
import noTumorType from "./no-tumor-type";
import malignant from "./malignant";
import benign from "./benign";
import heme from "./heme";
import rareDisease from "./rare";
import solidTumors from "./solid-tumors";

interface RadialDomain {
  yd: number[];
  yr: number[];
}

export const domainForRadial = (routePath: string, chartWidth: number): RadialDomain => {
  const { root } = itemsForPath(routePath);
  let { level } = itemsForPath(routePath);

  const yd = [0, 0.111, 0.222, 0.333, 0.444, 0.556, 0.667, 0.778, 0.889, 1];
  const width = chartWidth * 0.5;
  const inner = width * 0.25;
  const ring = width * 0.07;
  const outer = width - ring * 3.8;
  let yr;

  if (root === "Compounds") {
    if (level === 3) {
      const matching = flattenedCompoundChildren.filter(
        (child: PipelineItem) => child.path !== undefined && child.path.includes(routePath),
      );
      const children = matching[0].children || [];
      if (children.length === 1) {
        level += 1;
      }
    }

    yr = compounds(yd, level, width, inner, ring, outer);
  } else if (routePath.includes("Heme/Malignant/B-cell") || routePath.includes("Heme/Malignant/BPDCN")) {
    yr = noTumorType(yd, level, width, inner, ring, outer);
  } else if (routePath.includes("Heme/Malignant")) {
    yr = malignant(yd, level, width, inner, ring, outer);
  } else if (routePath.includes("Heme/Nonmalignant")) {
    yr = benign(yd, level, width, inner, ring, outer);
  } else if (routePath.includes("Heme")) {
    yr = heme(yd, level, width, inner, ring, outer);
  } else if (routePath.includes("Tumors/Rare Disease")) {
    yr = rareDisease(yd, level, width, inner, ring, outer);
  } else {
    yr = solidTumors(yd, level, width, inner, ring, outer);
  }
  // console.log(level);
  return { yd, yr };
};
