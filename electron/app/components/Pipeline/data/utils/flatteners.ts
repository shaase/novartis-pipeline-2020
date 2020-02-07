// @flow

import { uniqBy } from "lodash";
import { PipelineItem, PipelineStudy } from "../../types";
import { itemsForPath } from "../../utils";
import { content } from "../loaded-json";

// FLATTENED BY LIST

export const flattenChildren = (list: PipelineItem[]): PipelineItem[] =>
  list.reduce(
    (a: PipelineItem[], b: PipelineItem) => a.concat(Array.isArray(b.children) ? flattenChildren(b.children) : b),
    [],
  );

export const flattenStudies = (list: PipelineItem[]): PipelineStudy[] =>
  flattenChildren(list).reduce(
    (a: PipelineStudy[], b: PipelineItem) => a.concat(b.studies === undefined ? [] : b.studies),
    [],
  );

export const flattenUniqueStudies = (list: PipelineItem[], compound?: string): PipelineStudy[] =>
  uniqBy(
    flattenStudies(list).filter((study: PipelineStudy) => compound === undefined || study.target === compound),
    "nct",
  );

export const flattenToContainers = (list: PipelineItem[]): PipelineItem[] =>
  list.reduce((a: PipelineItem[], b: PipelineItem) => {
    if (b.children === undefined) {
      return a;
    }

    return a.concat(b.children[0].isStudyContainer ? b.children : flattenToContainers(b.children));
  }, []);

export const flattenCombos = (list: PipelineItem[], filterPath: string, phases: number[]): PipelineItem[] => {
  if (list.length === 0) return [];

  const combos: PipelineItem[] = [];

  list.forEach((item1: PipelineItem) => {
    const childStudies = [];
    const gc = item1.children || [];
    const ch1 = gc.map(
      (item2: PipelineItem): PipelineItem => {
        const flattened =
          item2.children !== undefined
            ? flattenStudies(item2.children)
            : item2.studies !== undefined
            ? item2.studies
            : [];

        let studies = uniqBy(
          flattened.filter(
            (study: PipelineStudy) => filterPath.includes(study.path) || study.path.includes(filterPath),
          ),
          "nct",
        );

        studies = studies.filter((study: PipelineStudy) => phases.includes(study.phase));
        childStudies.push(...studies);

        const { type, color, path } = item2;
        return { type, color, path, studies };
      },
    );

    const { color, path } = item1;
    if (childStudies.length > 0) {
      combos.push({ color, path, children: ch1 });
    }
  });

  return combos;
};

// FLATTENED BY PATH

export const studiesForPath = (path: string, key?: string, compound?: string): PipelineStudy[] => {
  let studies: PipelineStudy[] = [];
  const { root } = itemsForPath(path);
  const parent = content[root];

  if (parent === undefined || parent.children === undefined) {
    return studies;
  }

  const items: PipelineItem[] = parent.children.filter((item: PipelineItem) => {
    const itemPath = item.path || "@@@@";
    return itemPath.includes(path) || path.includes(itemPath);
  });

  items.forEach((item: PipelineItem) => {
    const children = item.children || [];
    const flattened = flattenStudies(children).filter(
      (study: PipelineStudy) => study.path.includes(path) && (compound === undefined || study.target === compound),
    );

    studies = key === undefined ? [...studies, ...flattened] : [...studies, ...uniqBy(flattened, key)];
  });

  return studies;
};

// TODO: update calls bsed on phases now coming before compound, and phases being numbers
export const studiesForPathAndPhases = (path: string, phases: number[], compound?: string): PipelineStudy[] => {
  let studies: PipelineStudy[] = [];
  const { root } = itemsForPath(path);
  const parent = content[root];

  if (parent === undefined || parent.children === undefined) {
    return studies;
  }

  const items: PipelineItem[] = parent.children.filter((item: PipelineItem) => {
    const itemPath = item.path || "@@@@";
    return itemPath.includes(path) || path.includes(itemPath);
  });

  items.forEach((item: PipelineItem) => {
    const children = item.children || [];
    const flattened = flattenStudies(children).filter(
      (study: PipelineStudy) =>
        study.path.includes(path) &&
        (compound === undefined || study.target === compound) &&
        phases.includes(study.phase),
    );

    studies = [...studies, ...flattened];
  });

  return studies;
};
