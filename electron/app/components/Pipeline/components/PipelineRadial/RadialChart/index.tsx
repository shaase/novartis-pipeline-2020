import React from "react";
import { arc, DefaultArcObject } from "d3-shape";
import { scaleLinear, scaleSqrt } from "d3-scale";
import { interpolate as d3interpolate } from "d3-interpolate";
import { studiesForPath, studiesForPathAndPhases } from "../../../data";
import { RadialNode, RadialData } from "../../../types";
import { itemsForPath } from "../../../utils";
import lineRotation from "./line-rotation";
import lineOffset from "./line-offset";
import textDisplay from "./text-display";
import Sunburst from "./sunburst";

/* D3.js JavaScript library copyright 2017 Mike Bostock. */

interface Arc extends DefaultArcObject {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}

type Props = {
  isVisible: boolean;
  path: string;
  compound?: string;
  phases: number[];
  data: RadialData;
  onNavigate: (definedPath: string, definedCompound?: string, idling?: boolean) => void;
};

type Position = {
  start: number;
  end: number;
  center: number;
  size: number;
  isUnder: boolean;
};

type Origin = { x: number; y: number };

const RadialChart: React.FC<Props> = ({ isVisible, path, compound, phases, data, onNavigate }: Props) => {
  const { root, xDomain, xRange, yDomain, yRange, studyCode, width } = data;
  const { root: pathRoot, level } = itemsForPath(path);
  const studies = studiesForPathAndPhases(path, phases, compound);
  const noData = studies.length === 0;

  const height = width;
  const xScale = scaleLinear();
  const yScale = scaleSqrt();

  xScale.domain(xDomain).range(xRange);
  yScale.domain(yDomain).range(yRange);

  const getArc = arc()
    .startAngle(d => Math.max(0, Math.min(2 * Math.PI, xScale(d.x0))))
    .endAngle(d => Math.max(0, Math.min(2 * Math.PI, xScale(d.x1))))
    .innerRadius(d => Math.max(0, yScale(d.y0)))
    .outerRadius(d => Math.max(0, yScale(d.y1)));

  const getCurve = arc()
    .startAngle(d => Math.max(0, Math.min(2 * Math.PI, xScale(d.x0))))
    .endAngle(d => Math.max(0, Math.min(2 * Math.PI, xScale(d.x1))))
    .outerRadius(d => Math.max(0, d.m));

  const getUnderCurve = arc()
    .startAngle(d => Math.max(0, Math.min(2 * Math.PI, xScale(d.x1))))
    .endAngle(d => Math.max(0, Math.min(2 * Math.PI, xScale(d.x0))))
    .outerRadius(d => Math.max(0, d.m));

  const getPosition = (node: RadialNode): Position => {
    const start = Math.max(0, Math.min(2 * Math.PI, xScale(node.x0)));
    const end = Math.max(0, Math.min(2 * Math.PI, xScale(node.x1)));
    const size = end - start;
    const center = start + size / 2;
    const isUnder = center > 1.57 && center < 4.71;
    return { start, end, center, size, isUnder };
  };

  const getNextPosition = (node: RadialNode): Position => {
    const { x0, x1 } = node;

    const nextXScale = scaleLinear()
      .domain(xDomain)
      .range(xRange);

    const start = Math.max(0, Math.min(2 * Math.PI, nextXScale(x0)));
    const end = Math.max(0, Math.min(2 * Math.PI, nextXScale(x1)));
    const size = end - start;
    const center = start + size / 2;
    const isUnder = center > 1.57 && center < 4.71;
    return { start, end, center, size, isUnder };
  };

  const getLabelCurve = (node: RadialNode, index: number, length: number, fontSize: number): string => {
    const { y0, y1 } = node;
    const inner = yScale(y0);
    const outer = yScale(y1);

    const { isUnder } = getPosition(node);
    const yOffset = lineOffset(index, length, fontSize, isUnder);

    const mid = inner + (outer - inner) / 2;
    const m = mid + yOffset;
    const nMid = { ...node, m };
    const curve = isUnder ? getUnderCurve(nMid) : getCurve(nMid);
    return curve.replace("LNaN,NaNZ", "");
  };

  const getCentroid = (node: RadialNode, alignment: string, isRight: boolean): Origin => {
    const { y0 } = node;
    let { y1 } = node;
    const mod = isRight ? 0.01 : 0.005;

    if (alignment === "inside") {
      y1 = y0 + mod;
    }

    const xNode = { ...node, y1 };
    const centroid = getArc.centroid(xNode);

    const x = Number.isNaN(centroid[0]) ? 0 : centroid[0];
    const y = Number.isNaN(centroid[1]) ? 0 : centroid[1];
    return { x, y };
  };

  const getLabelAnchor = (node: RadialNode, lines: number): string => {
    if (lines === 1 && !node.isStudyContainer) {
      return "middle";
    }

    if (pathRoot === "Compounds" && node.depth === 4) {
      return "middle";
    }

    const { center } = getNextPosition(node);
    const isRight = center < Math.PI;
    return isRight ? "start" : "end";
  };

  const getLabelTransform = (node: RadialNode, index: number, length: number, fontSize: number): string => {
    const { start, end } = getPosition(node);
    const { center } = getNextPosition(node);
    const isRight = center < Math.PI;

    const rDiff = lineRotation(index, length, fontSize, start, end, isRight);

    let alignment = length === 1 && !node.isStudyContainer ? "center" : "inside";
    if (pathRoot === "Compounds" && node.depth === 4) {
      alignment = "center";
    }

    const { x, y } = getCentroid(node, alignment, isRight);
    const rot = center < Math.PI ? rDiff : rDiff + Math.PI;
    const style = `translate(${x}, ${y}) rotate(-90) rotate(${(rot * 180) / Math.PI})`;
    return style;
  };

  const getArcLength = (node: RadialNode): number => {
    const { x0, x1, y0, y1 } = node;

    const nextXScale = scaleLinear()
      .domain(xDomain)
      .range(xRange);

    const nextYScale = scaleSqrt()
      .domain(yDomain)
      .range(yRange);

    const start = Math.max(0, Math.min(2 * Math.PI, nextXScale(x0)));
    const end = Math.max(0, Math.min(2 * Math.PI, nextXScale(x1)));
    const inner = nextYScale(y0);
    const outer = nextYScale(y1);
    const radius = inner + (outer - inner) / 2;
    const radians = end - start;
    const arcLength = radians * radius;

    return arcLength;
  };

  const getArcWidth = (node: RadialNode): number => {
    const { y0, y1 } = node;

    const nextYScale = scaleSqrt()
      .domain(yDomain)
      .range(yRange);

    const arcWidth = nextYScale(y1) - nextYScale(y0);

    return arcWidth;
  };

  const getDisplay = (node: RadialNode): string => {
    const { start, end } = getPosition(node);
    return end - start > 0 ? "inline" : "none";
  };

  const getTextDisplay = (node: RadialNode): string => textDisplay(node, path, getArcLength, getArcWidth);

  const handleClick = (node: RadialNode): void => {
    const { name, parent, isStudyContainer } = node;
    let { route } = node;
    route =
      isStudyContainer && route.includes("Content/Tumors")
        ? route
            .split("/")
            .slice(0, -1)
            .join("/")
        : route;

    let inferredCompound;
    if (pathRoot === "Compounds") {
      if (level === 3) {
        inferredCompound = name;
      } else if (level === 4) {
        inferredCompound = parent.name;
      } else if (level === 5) {
        inferredCompound = parent.parent.name;
      }
    } else if (isStudyContainer) {
      inferredCompound = name;
    } else if (level === 7) {
      inferredCompound = parent.name;
    }

    if (studyCode !== undefined) {
      onNavigate(route, inferredCompound);
    } else {
      const compoundStudies = studiesForPath(route, undefined, inferredCompound);

      if (compoundStudies.length > 1) {
        onNavigate(route, inferredCompound);
      } else if (compoundStudies.length === 1) {
        const study = compoundStudies[0];
        onNavigate(study.path, inferredCompound);
      }
    }
  };

  const handleUpdate = (t: number, xd: (n: number) => void, yd: (n: number) => void, yr: (n: number) => void): void => {
    xScale.domain(xd(t));
    yScale.domain(yd(t)).range(yr(t));
  };

  const xd = d3interpolate(xScale.domain(), xDomain);
  const yd = d3interpolate(yScale.domain(), yDomain);
  const yr = d3interpolate(yScale.range(), yRange);

  return (
    <Sunburst
      isVisible={isVisible}
      noData={noData}
      path={path}
      nct={studyCode || ""}
      studies={studies.length}
      width={width}
      height={height}
      root={root}
      xd={xd}
      yd={yd}
      yr={yr}
      getArc={getArc}
      labelTransform={getLabelTransform}
      labelCurve={getLabelCurve}
      labelAnchor={getLabelAnchor}
      getDisplay={getDisplay}
      getTextDisplay={getTextDisplay}
      getArcLength={getArcLength}
      getArcWidth={getArcWidth}
      onUpdate={handleUpdate}
      onSelect={handleClick}
    />
  );
};

export default RadialChart;
