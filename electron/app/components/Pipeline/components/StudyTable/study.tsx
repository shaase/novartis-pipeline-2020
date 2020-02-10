import React, { useContext } from "react";
import { PipelineContext } from "../../state";
import { PipelineItem, PipelineStudy } from "../../types";
import { compoundsForStudy } from "../../data";
import { colorForBackground } from "../../utils";
import styles from "./index.module.scss";

type Props = {
  sub: PipelineItem;
  study: PipelineStudy;
  compound?: string;
  flexRows: boolean;
  totalCount: number;
  onClick: (definedPath: string, definedCompound?: string) => void;
};

const Study: React.FC<Props> = ({ sub, study, compound, flexRows, totalCount, onClick }: Props) => {
  const { path } = useContext(PipelineContext);
  const color = colorForBackground(sub.color || "#222222", sub.color);
  let fontSize = 16;
  let flex: number | string = "unset";
  let paddingTop: number | string = 20;
  let paddingBottom: number | string = 20;

  if (flexRows) {
    flex = 1;
    paddingTop = "unset";
    paddingBottom = "unset";

    if (totalCount < 3) {
      fontSize = 20;
    } else if (totalCount < 5) {
      fontSize = 19;
    } else if (totalCount < 7) {
      fontSize = 18;
    } else if (totalCount > 20) {
      fontSize = 15;

      if (study.title.length > 200) {
        fontSize = 13;
      } else if (study.title.length > 150) {
        fontSize = 14;
      }
    } else if (totalCount > 10) {
      fontSize = 16;

      if (study.title.length > 200) {
        fontSize = 14;
      } else if (study.title.length > 150) {
        fontSize = 15;
      }
    }

    if (path.includes("Tumors/Solid Tumors/*/*/Solid Tumors")) {
      fontSize = 15;
    }
  }
  return (
    <button
      type="button"
      className={styles.study}
      style={{
        color,
        flex,
        paddingTop,
        paddingBottom,
        fontSize,
      }}
      onClick={() => {
        let target;
        const matching = compoundsForStudy(study.path, study.nct);

        if (compound === undefined && matching.length === 1) {
          target = matching[0].type;
        }

        onClick(study.path, target);
      }}
    >
      <span>{`>`}</span>
      {/* TODO: fix danger */}
      {/* eslint-disable-next-line */}
      <span dangerouslySetInnerHTML={{ __html: study.title }} />
    </button>
  );
};

export default Study;
