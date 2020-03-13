// web worker
import { sectionsForTable, cohorts } from "../../data";
import { itemsForPath } from "../../utils";

self.addEventListener(
  "message",
  e => {
    const { path, compound, phases } = e.data;
    const sections = sectionsForTable(path, phases);
    const allChildren = sections.reduce((a, b) => a.concat(b.children || []), []);

    const { studyCode = "" } = itemsForPath(path);
    const compoundCards = compound !== undefined ? cohorts[compound] : undefined;

    let cards = [];
    if (compound) {
      if (compoundCards) {
        ({ cards } = compoundCards);
      } else {
        cards = [{ file: "", label: "", compound: "" }];
      }
    }

    self.postMessage({ path, sections, allChildren, studyCode, cards });
  },
  false,
);
