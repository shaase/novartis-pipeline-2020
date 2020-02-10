import { uniqBy } from "lodash";
import { flattenStudies } from "../../data";
import { PipelineItem, PipelineStudy, StudyPhase } from "../../types";

const phasedStudies = (section: PipelineItem, compound?: string): StudyPhase[] => {
  let phases: StudyPhase[] = [];
  let list = flattenStudies([section]);

  if (compound !== undefined) {
    list = list.filter((study: PipelineStudy) => study.target === compound);
  }

  list.forEach((study: PipelineStudy) => {
    let number = 0;
    if (study.phaseList.includes("III")) {
      number = 3;
    } else if (study.phaseList.includes("II")) {
      number = 2;
    } else if (study.phaseList.includes("I")) {
      number = 1;
    }

    const title = `Phase ${study.phaseList}`;
    const index = phases.findIndex(p => p.title === title);
    if (index === -1) {
      const item = { title, number, studies: [study] };
      phases = [...phases, item];
    } else {
      const { studies } = phases[index];
      const unique = uniqBy([...studies, study], "nct");
      const updated = { title, number, studies: unique };
      phases[index] = updated;
    }
  });

  return phases.sort((a, b) => {
    if (a.title < b.title) return -1;
    if (a.title > b.title) return 1;
    return 0;
  });
};

export const sectionedData = (data: PipelineItem[], compound?: string): PipelineItem[] => {
  const sections = data.map((section: PipelineItem) => {
    let children: PipelineItem[] = [];

    if (section.children !== undefined) {
      children = section.children.map((child: PipelineItem) => {
        const { type, color, path } = child;
        const phases = phasedStudies(child, compound);
        return { type, color, path, phases };
      });
    } else {
      const { color, path } = section;
      const phases = phasedStudies(section, compound);
      children = [{ color, path, phases }];
    }

    const emptyIndex = children.findIndex((item: PipelineItem) => item.type === undefined);

    if (emptyIndex > -1) {
      const item = children[emptyIndex];
      children.splice(emptyIndex, 1);
      children.unshift(item);
    }

    const { type, color, path } = section;
    return { type, color, path, children };
  });

  return sections;
};

export const onStudyElements = (data: PipelineItem[]): void => {
  const event = new CustomEvent("PRINTABLE_STUDIES", { detail: { data } });
  document.dispatchEvent(event);
};
