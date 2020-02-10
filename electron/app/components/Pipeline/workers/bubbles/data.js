// web worker
import { studies as allStudies, dataForBubbles, flattenUniqueStudies } from "../../data";
import { itemsForPath } from "../../utils";

const getData = (path, phases, compound) => {
  const data = dataForBubbles(path, phases, compound);
  const studies = flattenUniqueStudies(data, compound);
  let { studyCode } = itemsForPath(path);
  studyCode = studies.length === 1 ? studies[0].nct : studyCode;
  const url = studyCode !== undefined ? allStudies[studyCode] : "";

  return { data, studies, studyCode, url };
};

export default getData;
