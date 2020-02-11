import React from "react";
import { domainForRadial, cohorts } from "../../data";
import { RadialHierarchy } from "../../types";
import { itemsForPath } from "../../utils";
import Header from "./header";
// import RadialChart from './RadialChart';
import CardViewer from "../CardViewer";
import Bottom from "./bottom";
import styles from "./index.module.scss";

const width = 785;

type Props = {
  path: string;
  compound?: string;
  phases: number[];
  hierarchy: RadialHierarchy;
  onNavigate: (definedPath: string, definedCompound?: string, idling?: boolean) => void;
};

const PipelineRadial: React.FC<Props> = ({ path, compound, phases, hierarchy, onNavigate }: Props) => {
  const { yd, yr } = domainForRadial(path, width);
  const { root, level, studyCode } = itemsForPath(path);

  const compoundCards = compound !== undefined ? cohorts[compound] : undefined;
  let cards;

  if (compound && (root === "Tumors" || (root === "Compounds" && level > 6))) {
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

  console.log(hierarchy);

  return (
    <div className={styles.container}>
      {cards !== undefined && <Header cards={cards} />}

      {/* <RadialChart
          isVisible={cards === undefined}
          nct={studyCode || ''}
          path={path}
          compound={compound}
          phases={phases}
          yDomain={yd}
          yRange={yr}
          width={width}
          height={width}
          onSelect={onSelect}
        /> */}

      {cards !== undefined && <CardViewer type="MOA" color="#333333" items={cards} />}

      <Bottom cards={cards} />
    </div>
  );
};

export default PipelineRadial;
