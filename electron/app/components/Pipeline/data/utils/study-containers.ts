import { PipelineItem, PipelineStudy } from "../../types";

type Containers = { [target: string]: PipelineItem };

export const getStudyContainers = (item: PipelineItem, child: PipelineItem, phases: number[]): PipelineItem[] => {
  const { color } = item;
  const containers: Containers = {};

  if (child.children !== undefined) {
    child.children.forEach((gc: PipelineItem) => {
      const childStudies = gc.studies || [];
      const filteredStudies: PipelineStudy[] = childStudies.filter((study: PipelineStudy) =>
        phases.includes(study.phase),
      );

      filteredStudies.forEach((study: PipelineStudy) => {
        const { target, path } = study;
        if (target !== undefined) {
          if (containers[target] === undefined) {
            containers[target] = {
              type: target,
              color,
              path,
              isStudyContainer: true,
              studies: [study],
            };
          } else {
            const existing = containers[target];
            const { studies = [] } = existing;
            containers[target] = { ...existing, studies: [...studies, study] };
          }
        }
      });
    });
  } else {
    const childStudies = child.studies || [];
    const filteredStudies = childStudies.filter((study: PipelineStudy) => phases.includes(study.phase));

    filteredStudies.forEach((study: PipelineStudy) => {
      const { target, path } = study;
      if (target !== undefined) {
        if (containers[target] === undefined) {
          containers[target] = {
            type: target,
            color,
            path,
            isStudyContainer: true,
            studies: [study],
          };
        } else {
          const existing = containers[target];
          const { studies = [] } = existing;
          containers[target] = { ...existing, studies: [...studies, study] };
        }
      }
    });
  }

  return containers === {} ? [] : Object.keys(containers).map((key: string) => containers[key]);
};
