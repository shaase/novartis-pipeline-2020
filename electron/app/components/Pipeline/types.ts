import { DefaultArcObject } from "d3-shape";

export interface PipelineItem {
  type?: string;
  name?: string;
  color?: string;
  path?: string;
  isStudyContainer?: boolean;
  children?: PipelineItem[];
  studies?: PipelineStudy[];
  size?: number;
  phases?: StudyPhase[];
}

export interface PipelineStudy {
  nct: string;
  path: string;
  title: string;
  phase: number;
  phaseList: string;
  subtype?: string;
  target?: string;
  cards?: string[];
}

export interface RowItem {
  title: string;
  color: string;
  path: string;
  className: string;
  header?: string;
  lighten?: boolean;
  indent?: number;
  isStudyContainer?: boolean;
  children?: RowItem[];
}

export interface CardType {
  file: string;
  label: string;
  compound?: string;
  studyCode?: string;
  url?: string;
}

export interface LightboxContent {
  type: string;
  cards: CardType[];
  color: string;
}

export interface StudyPhase {
  title: string;
  number: number;
  studies: PipelineStudy[];
}

export interface IdlePath {
  path: string;
  compound: string;
  cardIndex: number;
}

export interface Bubble {
  id: string;
  path: string;
  fill: string;
  color: string;
  value: number;
  r: number;
  x: number;
  y: number;
}

export interface TableData {
  path: string;
  sections: PipelineItem[];
  allChildren: PipelineItem[];
  studyCode: string;
  cards: CardType[];
}

export interface RadialData {
  segments: RadialNode[];
  labels: NodeLabel[];
  xDomain: number[];
  xRange: number[];
  yDomain: number[];
  yRange: number[];
  width: number;
  studyCode: string;
  cards: CardType[];
}

export interface BubbleData {
  data: PipelineItem[];
  studyCode: string;
  url: string;
  bubbles: Bubble[];
  marginLeft: number;
}

export interface WorkerData {
  tableData: TableData;
  radialData: RadialData;
  bubbleData: BubbleData;
}

export interface RadialNode {
  parent: RadialNode;
  route: string;
  name: string;
  color: string;
  fill?: string;
  rgbArray: number[];
  x0?: number;
  x1?: number;
  y0?: number;
  y1?: number;
  opacity: number;
  textOpacity: number;
  phase?: number;
  label?: string;
  depth: number | undefined;
  isEmpty: boolean;
  children?: RadialNode[];
  isStudyContainer: boolean;
}

export interface RadialText {
  lines: (JSX.Element | JSX.Element[])[];
  fontSize: number;
  offsets: number[];
}

export interface Origin {
  x: number;
  y: number;
}

export interface RadialArc extends DefaultArcObject {
  startAngle: number;
  endAngle: number;
  centerAngle: number;
  innerRadius: number;
  outerRadius: number;
  centerRadius: number;
  length: number;
  width: number;
  display: string;
}

export interface NodeArc {
  theta: number[];
  radius: number[];
  color: number[];
  alpha: number;
}

export interface NodeLabelLine {
  id: string;
  // text: string;
  elements: JSX.Element | JSX.Element[];
  curve: string;
  anchor: string;
  transform: string;
}

export interface NodeLabel {
  node: RadialNode;
  display: string;
  color: string;
  opacity: number;
  startArc: RadialArc;
  endArc: RadialArc;
  lines: NodeLabelLine[];
  fontSize: number;
  offsets: number[];
}

export interface CurvePosition {
  start: number;
  end: number;
  center: number;
  size: number;
  isUnder: boolean;
}
