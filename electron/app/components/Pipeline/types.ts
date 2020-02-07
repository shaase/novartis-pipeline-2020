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
