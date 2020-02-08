import { uniqBy } from "lodash";

const flatten = (list: PipelineItem[]) =>
  list.reduce(
    (a: PipelineItem[], b: PipelineItem) => a.concat(b.studies === undefined ? flatten(b.children) : b.studies),
    [],
  );

const phased = (section: PipelineItem, compound?: string) => {
  let phases: StudyPhase[] = [];
  let list = section.children !== undefined ? flatten(section.children) : section.studies;

  if (compound !== undefined) {
    list = list.filter(study => study.target === compound);
  }

  list.forEach(study => {
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

export default phased;
