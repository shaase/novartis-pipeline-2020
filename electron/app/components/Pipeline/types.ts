import { SimulationNodeDatum } from "d3-force";

export interface PipelineItem {
  type?: string;
  name?: string;
  color?: string;
  path?: string;
  isStudyContainer?: boolean;
  children?: PipelineItem[];
  studies?: PipelineStudy[];
  size?: number;
}

export interface PipelineStudy {
  nct: string;
  path: string;
  title: string;
  phase: number;
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
  studies: PipelineItem[];
}

export interface IdlePath {
  path: string;
  compound: string;
  cardIndex: number;
}

// BUBBLE CHART INTERFACES
export interface Bubble extends SimulationNodeDatum {
  id: string;
  path: string;
  fill: string;
  color: string;
  value: number;
  r: number;
  x: number;
  y: number;
}

interface SimNode extends SimulationNodeDatum {
  r: number;
}

export const isBubble = (object: any): object is Bubble => "path" in object && "fill" in object; // eslint-disable-line
export const isSimNode = (object: any): object is SimNode => "r" in object; // eslint-disable-line
