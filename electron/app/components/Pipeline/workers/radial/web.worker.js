// web worker
import { dataForRadial, domainForRadial, cohorts } from "../../data";
import { itemsForPath } from "../../utils";

self.addEventListener(
  "message",
  e => {
    const width = 785;
    const { path, compound, phases } = e.data;
    const { yDomain, yRange } = domainForRadial(path, width);
    const radial = dataForRadial(phases);

    const { root: pathRoot, level, studyCode = "" } = itemsForPath(path);

    const compoundCards = compound !== undefined ? cohorts[compound] : undefined;
    let cards = [];

    if (compound && (pathRoot === "Tumors" || (pathRoot === "Compounds" && level > 6))) {
      if (compoundCards === undefined) {
        cards = [{ file: "", label: "" }];
      } else {
        const { moas, cards: cCards } = compoundCards;
        if (moas !== undefined) {
          cards = cCards.map((crd, index) => {
            if (index < moas.length) {
              return { file: moas[index], label: "" };
            }
            return { file: "", label: "" };
          });
        } else {
          cards = cCards.map(() => ({ file: "", label: "" }));
        }
      }
    }

    self.postMessage({ radial, yDomain, yRange, cards, studyCode, width });
  },
  false,
);
