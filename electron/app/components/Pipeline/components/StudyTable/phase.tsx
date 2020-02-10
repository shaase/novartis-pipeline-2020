import React from "react";
import { PipelineItem, PipelineStudy, StudyPhase } from "../../types";
import { colorForBackground, hexToRgb } from "../../utils";
import Study from "./study";
import styles from "./index.module.scss";

type Props = {
  section: PipelineItem;
  sub: PipelineItem;
  phase: StudyPhase;
  compound?: string;
  flexRows: boolean;
  studyCount: number;
  totalCount: number;
  onClick: (definedPath: string, definedCompound?: string) => void;
};

const Phase: React.FC<Props> = ({
  section,
  sub,
  phase,
  compound,
  flexRows,
  studyCount,
  totalCount,
  onClick,
}: Props) => {
  const count = phase.studies.length;
  const flex = studyCount > 0 ? count / studyCount : "unset";

  return (
    <div key={`${section.type}-${sub.type}-${phase.title}`} className={styles.phase} style={{ flex }}>
      <div
        className={styles.phaseHeader}
        style={{
          backgroundColor: `rgba(${hexToRgb(sub.color || "#222222")}, ${0.3 + phase.number * 0.2})`,
          color: colorForBackground("#FFFFFF", sub.color),
        }}
      >
        {phase.title}
      </div>

      <div
        className={styles.studies}
        style={{
          backgroundColor: `rgba(${hexToRgb(sub.color || "#222222")}, 0.1)`,
        }}
      >
        {phase.studies.map((study: PipelineStudy) => (
          <Study
            key={`${section.type}-${sub.type}-${phase.title}-${study.nct}`}
            sub={sub}
            study={study}
            compound={compound}
            flexRows={flexRows}
            totalCount={totalCount}
            onClick={onClick}
          />
        ))}
      </div>
    </div>
  );
};

export default Phase;
