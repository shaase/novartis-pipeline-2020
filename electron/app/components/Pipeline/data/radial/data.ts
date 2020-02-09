import { PipelineItem, PipelineStudy } from "../../types";
import { defaultPhases } from "../phases";
import { content } from "../loaded-json";
import { itemsForPath } from "../../utils";

// FLATTENED DATA

type FlattenedItems = { [target: string]: PipelineItem };

const flatten = (item: PipelineItem, phases: number[]): PipelineItem => {
  const { type, color, path, studies } = item;
  const { root, level } = itemsForPath(path || "");
  let itemChildren: PipelineItem[] | undefined =
    item.children !== undefined ? item.children.map((child: PipelineItem) => flatten(child, phases)) : undefined;

  let itemStudies: PipelineStudy[] =
    item.studies !== undefined ? (studies || []).map((study: PipelineStudy) => ({ ...study, size: 1 })) : [];

  if (root === "Tumors" && studies !== undefined) {
    const filtered = studies.filter((study: PipelineStudy) => phases.includes(study.phase));

    const collected = filtered.reduce((obj: FlattenedItems, study: PipelineStudy) => {
      const container = {
        name: study.target,
        type: study.target,
        color: item.color,
        path: `${item.path}/${study.nct}`,
        isStudyContainer: true,
        children: [{ ...study, color: item.color, size: 1 }],
      };

      const dicKey = study.target || study.path;

      if (obj[dicKey] === undefined) {
        return { ...obj, [dicKey]: container };
      }

      const existing = obj[dicKey];
      (existing.children || []).push({ ...study, color: item.color, size: 1 });
      return { ...obj, [dicKey]: existing };
    }, {});

    itemChildren = Object.keys(collected).map((key: string) => collected[key]);
  } else if (root === "Compounds" && studies !== undefined) {
    itemStudies = itemStudies
      .filter((study: PipelineStudy) => phases.includes(study.phase))
      .map((study: PipelineStudy) => ({ ...study, color: item.color }));
  }

  const isStudyContainer = (root === "Compounds" && level === 5) || (root === "Compounds" && studies !== undefined);

  return { name: type || "*", color, path, isStudyContainer, children: itemChildren || itemStudies };
};

const { Tumors, Compounds } = content;

const tumor = (phases: number[]): PipelineItem => ({
  name: "Tumors",
  color: "#FFFFFF",
  path: "Content/Tumors",
  children: (Tumors.children || []).map((item: PipelineItem) => flatten(item, phases)),
});

const compound = (phases: number[]): PipelineItem => ({
  name: "Compounds",
  color: "#FFFFFF",
  path: "Content/Compounds",
  children: (Compounds.children || []).map((item: PipelineItem) => flatten(item, phases)),
});

let prevPhases = defaultPhases;
const initialCompounds = compound(defaultPhases).children || [];
let flattenedTumors = tumor(defaultPhases);
let flattenedCompounds = compound(defaultPhases);

export const flattenedCompoundChildren = initialCompounds.reduce(
  (a: PipelineItem[], b: PipelineItem) => a.concat(b.children || []),
  [],
);

export const dataForRadial = (phases: number[]): PipelineItem => {
  if (prevPhases !== phases) {
    flattenedTumors = tumor(phases);
    flattenedCompounds = compound(phases);
    prevPhases = phases;
  }

  return { name: "root", children: [flattenedTumors, flattenedCompounds] };
};
