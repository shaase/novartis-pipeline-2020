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
  sections: PipelineItem[];
  allChildren: PipelineItem[];
}

export interface NodeMap {
  [route: string]: Node;
}

export interface RadialHierarchy {
  flatRoot: NodeMap;
  root: NodeMap;
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
  radialHierarchy: RadialHierarchy;
  bubbleData: BubbleData;
}

export const defaultWorkerData: WorkerData = {
  tableData: { sections: [], allChildren: [] },
  radialHierarchy: { flatRoot: {}, root: {} },
  bubbleData: { data: [], studyCode: "", url: "", bubbles: [], marginLeft: 0 },
};

export interface RadialNode {
  parent: RadialNode;
  route: string;
  name: string;
  color: string;
  x0?: number;
  x1?: number;
  y0?: number;
  y1?: number;
  depth?: number;
  isEmpty: boolean;
  isStudyContainer: boolean;
}

export interface RadialText {
  lines: (JSX.Element | JSX.Element[])[];
  fontSize: number;
  offsets: number[];
}
