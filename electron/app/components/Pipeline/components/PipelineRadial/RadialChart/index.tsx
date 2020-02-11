// @flow

import React from 'react';
import { arc } from 'd3-shape';
import { scaleLinear, scaleSqrt } from 'd3-scale';
import { interpolate as d3interpolate } from 'd3-interpolate';
import { studiesForPath, defaultPhases, studiesForPathAndPhases } from '../../../data';
import { RadialNode } from '../../../types';
import { itemsForPath } from '../../../utils';
import lineRotation from './line-rotation';
import lineOffset from './line-offset';
import textDisplay from './text-display';
import Sunburst from './Sunburst';

/* D3.js JavaScript library copyright 2017 Mike Bostock. */

type Props = {
  isVisible: boolean,
  nct: string,
  compound?: string,
  width: number,
  height: number,
  path: string,
  phases: number[],
  yDomain: number[],
  yRange: number[],
  onSelect: (string, string | typeof undefined) => void
};

type State = {
  xDomain: number[],
  xRange: number[]
};

type Position = {
  start: number,
  end: number,
  center: number,
  size: number,
  isUnder: boolean
};

class RadialChart extends React.Component<Props, State> {
  static defaultProps = {
    compound: undefined
  };

  constructor(props: Props) {
    super(props);

    const { path, yDomain, yRange } = props;
    const { root, flatRoot } = setHierarchy(dataForRadial(defaultPhases));
    this.root = root;
    this.flatRoot = flatRoot;

    const { x0, x1 } = this.flatRoot[path];
    this.state = {
      xDomain: [x0, x1],
      xRange: [0, 2 * Math.PI]
    };

    const { xDomain, xRange } = this.state;
    this.xScale.domain(xDomain).range(xRange);
    this.yScale.domain(yDomain).range(yRange);
  }

  componentWillReceiveProps(nextProps: Props) {
    const { path, phases } = nextProps;
    const { phases: prevPhases } = this.props;

    const arr = path.split('/');
    let trunc = path;

    if (arr[1] === 'Tumors') {
      trunc = arr.slice(0, 7).join('/');
    }

    if (phases !== prevPhases) {
      this.refreshData(phases);
    }

    if (this.flatRoot[trunc] !== undefined) {
      const { x0, x1 } = this.flatRoot[trunc];
      this.setState({ xDomain: [x0, x1] });
    } else {
      const keys = Object.keys(this.flatRoot);
      const { x0, x1 } = this.flatRoot[keys[0]];
      this.setState({ xDomain: [x0, x1] });
    }
  }

  refreshData = (phases: number[]) => {
    const { root, flatRoot } = setHierarchy(dataForRadial(phases));
    this.root = root;
    this.flatRoot = flatRoot;
  };

  yDomain = [0, 0.111, 0.222, 0.333, 0.444, 0.556, 0.667, 0.778, 0.889, 1];

  xScale = scaleLinear();

  yScale = scaleSqrt();

  flatRoot = {};

  root = {};

  getArc = arc()
    .startAngle(d => Math.max(0, Math.min(2 * Math.PI, this.xScale(d.x0))))
    .endAngle(d => Math.max(0, Math.min(2 * Math.PI, this.xScale(d.x1))))
    .innerRadius(d => Math.max(0, this.yScale(d.y0)))
    .outerRadius(d => Math.max(0, this.yScale(d.y1)));

  getCurve = arc()
    .startAngle(d => Math.max(0, Math.min(2 * Math.PI, this.xScale(d.x0))))
    .endAngle(d => Math.max(0, Math.min(2 * Math.PI, this.xScale(d.x1))))
    .outerRadius(d => Math.max(0, d.m));

  getUnderCurve = arc()
    .startAngle(d => Math.max(0, Math.min(2 * Math.PI, this.xScale(d.x1))))
    .endAngle(d => Math.max(0, Math.min(2 * Math.PI, this.xScale(d.x0))))
    .outerRadius(d => Math.max(0, d.m));

  getLabelCurve = (
    node: RadialNode,
    index: number,
    length: number,
    fontSize: number
  ): string => {
    const { y0, y1 } = node;
    const inner = this.yScale(y0);
    const outer = this.yScale(y1);

    const { isUnder } = this.getPosition(node);
    const yOffset = lineOffset(index, length, fontSize, isUnder);

    const mid = inner + (outer - inner) / 2;
    const m = mid + yOffset;
    const nMid = { ...node, m };
    const curve = isUnder ? this.getUnderCurve(nMid) : this.getCurve(nMid);
    return curve.replace('LNaN,NaNZ', '');
  };

  getCentroid = (node: RadialNode, alignment: string, isRight: boolean) => {
    const { y0 } = node;
    let { y1 } = node;
    const mod = isRight ? 0.01 : 0.005;

    if (alignment === 'inside') {
      y1 = y0 + mod;
    }

    const xNode = { ...node, y1 };
    const centroid = this.getArc.centroid(xNode);

    const x = Number.isNaN(centroid[0]) ? 0 : centroid[0];
    const y = Number.isNaN(centroid[1]) ? 0 : centroid[1];
    return { x, y };
  };

  getLabelAnchor = (node: RadialNode, lines: number) => {
    if (lines === 1 && !node.isStudyContainer) {
      return 'middle';
    }

    const { path } = this.props;
    const { root } = itemsForPath(path);

    if (root === 'Compounds' && node.depth === 4) {
      return 'middle';
    }

    const { center } = this.getNextPosition(node);
    const isRight = center < Math.PI;
    return isRight ? 'start' : 'end';
  };

  getLabelTransform = (
    node: RadialNode,
    index: number,
    length: number,
    fontSize: number
  ): string => {
    const { path } = this.props;
    const { root } = itemsForPath(path);
    const { start, end } = this.getPosition(node);
    const { center } = this.getNextPosition(node);
    const isRight = center < Math.PI;

    const rDiff = lineRotation(index, length, fontSize, start, end, isRight);

    let alignment =
      length === 1 && !node.isStudyContainer ? 'center' : 'inside';
    if (root === 'Compounds' && node.depth === 4) {
      alignment = 'center';
    }

    const { x, y } = this.getCentroid(node, alignment, isRight);
    const rot = center < Math.PI ? rDiff : rDiff + Math.PI;
    const style = `translate(${x}, ${y}) rotate(-90) rotate(${(rot * 180) /
      Math.PI})`;
    return style;
  };

  getPosition = (node: RadialNode): Position => {
    const start = Math.max(0, Math.min(2 * Math.PI, this.xScale(node.x0)));
    const end = Math.max(0, Math.min(2 * Math.PI, this.xScale(node.x1)));
    const size = end - start;
    const center = start + size / 2;
    const isUnder = center > 1.57 && center < 4.71;
    return { start, end, center, size, isUnder };
  };

  getNextPosition = (node: RadialNode): Position => {
    const { xDomain, xRange } = this.state;
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

  getArcLength = (node: RadialNode): number => {
    const { yDomain, yRange } = this.props;
    const { xDomain, xRange } = this.state;
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

  getArcWidth = (node: RadialNode): number => {
    const { yDomain, yRange } = this.props;
    const { y0, y1 } = node;

    const nextYScale = scaleSqrt()
      .domain(yDomain)
      .range(yRange);

    const arcWidth = nextYScale(y1) - nextYScale(y0);

    return arcWidth;
  };

  getDisplay = (node: RadialNode): string => {
    const { start, end } = this.getPosition(node);
    return end - start > 0 ? 'inline' : 'none';
  };

  getTextDisplay = (node: RadialNode): string => {
    const { path } = this.props;
    return textDisplay(node, path, this.getArcLength, this.getArcWidth);
  };

  handleClick = (node: RadialNode) => {
    const { onSelect } = this.props;
    const { name, parent, isStudyContainer } = node;
    let { route } = node;
    route =
      isStudyContainer && route.includes('Content/Tumors')
        ? route
            .split('/')
            .slice(0, -1)
            .join('/')
        : route;

    const { level, root, studyCode } = itemsForPath(route);

    let compound;
    if (root === 'Compounds') {
      if (level === 3) {
        compound = name;
      } else if (level === 4) {
        compound = parent.name;
      } else if (level === 5) {
        compound = parent.parent.name;
      }
    } else if (isStudyContainer) {
      compound = name;
    } else if (level === 7) {
      compound = parent.name;
    }

    if (studyCode !== undefined) {
      onSelect(route, compound);
    } else {
      const studies = studiesForPath(route, undefined, compound);

      if (studies.length > 1) {
        onSelect(route, compound);
      } else if (studies.length === 1) {
        const study = studies[0];
        onSelect(study.path, compound);
      }
    }
  };

  handleUpdate = (
    t: number,
    xd: number => void,
    yd: number => void,
    yr: number => void
  ) => {
    this.xScale.domain(xd(t));
    this.yScale.domain(yd(t)).range(yr(t));
  };

  render = () => {
    const {
      isVisible,
      nct,
      path,
      compound,
      phases,
      width,
      height,
      yDomain,
      yRange
    } = this.props;
    const { xDomain } = this.state;
    const studies = studiesForPathAndPhases(path, compound, phases);
    const noData = studies.length === 0;

    const xd = d3interpolate(this.xScale.domain(), xDomain);
    const yd = d3interpolate(this.yScale.domain(), yDomain);
    const yr = d3interpolate(this.yScale.range(), yRange);

    return (
      <Sunburst
        isVisible={isVisible}
        noData={noData}
        path={path}
        nct={nct}
        studies={studies.length}
        width={width}
        height={height}
        root={this.root}
        xd={xd}
        yd={yd}
        yr={yr}
        getArc={this.getArc}
        labelTransform={this.getLabelTransform}
        labelCurve={this.getLabelCurve}
        labelAnchor={this.getLabelAnchor}
        getDisplay={this.getDisplay}
        getTextDisplay={this.getTextDisplay}
        getArcLength={this.getArcLength}
        getArcWidth={this.getArcWidth}
        onUpdate={this.handleUpdate}
        onSelect={this.handleClick}
      />
    );
  };
}

export default RadialChart;
