import { content as iContent, paths as iPaths, cohorts as iCohorts, studies as iStudies } from "./data.json";
import { PipelineItem } from "../types";

type Content = { [root: string]: PipelineItem };
type Card = { file: string; label: string; compound: string };
type Cohorts = { [name: string]: { cards: Card[]; moas?: string[] } };
type Studies = { [nct: string]: string };

export const content: Content = iContent;
export const paths: string[] = iPaths;
export const cohorts: Cohorts = iCohorts;
export const studies: Studies = iStudies;
