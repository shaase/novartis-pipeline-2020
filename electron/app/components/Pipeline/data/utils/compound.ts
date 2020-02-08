import { uniqBy } from "lodash";
import { flattenChildren, flattenToContainers } from "./flatteners";
import { defaultPhases } from "../phases";
import { dataForRadial } from "../radial";
import { slicePath } from "../../utils";
import { PipelineItem, PipelineStudy } from "../../types";

const arr = dataForRadial(defaultPhases).children;
const tumorContainers = flattenToContainers(arr[0].children);
const compoundContainers = flattenChildren(arr[1].children);

// returns all compounds for path and study (for `By Tumor`)
export const compoundsForStudy = (routePath: string, nct: string): PipelineItem[] => {
  const path = slicePath(routePath, 6);
  const containers: PipelineItem[] = tumorContainers.filter((container: PipelineItem) => {
    if (container.path === undefined || container.children === undefined) {
      return false;
    }

    const matchesPath = container.path.includes(path);
    const studies = container.studies || [];
    const matchingStudies = studies.findIndex((study: PipelineStudy) => study.nct === nct) > -1;
    return matchesPath && matchingStudies;
  });

  return uniqBy(containers, "type");
};

// returns single compound for path (for `By Compound`)
export const compoundForPath = (routePath: string): PipelineItem => {
  const path = slicePath(routePath, 3);
  const containers: PipelineItem[] = compoundContainers.filter(
    (container: PipelineItem) => container.path !== undefined && container.path.includes(path),
  );

  return containers[0];
};
