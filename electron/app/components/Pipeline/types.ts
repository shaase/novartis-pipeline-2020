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

export interface CardType {
  file: string;
  label: string;
  compound?: string;
  studyCode?: string;
}

export interface LightboxContent {
  type: string;
  cards: Card[];
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
