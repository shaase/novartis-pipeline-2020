import React from "react";
import { PipelineItem, StudyPhase } from "../../types";
import { colorForBackground, hexToRgb } from "../../utils";
import Phase from "./phase";
import styles from "./index.module.scss";

type Props = {
  section: PipelineItem;
  compound?: string;
  flexRows: boolean;
  studyCount: number;
  onClick: (definedPath: string, definedCompound?: string) => void;
};

const StudySection: React.FC<Props> = ({ section, compound, flexRows, studyCount, onClick }: Props) => (
  <div className={styles.section}>
    <div
      className={styles.header}
      style={{
        backgroundColor: section.color,
        color: colorForBackground(section.color || "#222222", "#FFFFFF"),
      }}
    >
      {/* TODO: fix danger */}
      {/* eslint-disable-next-line */}
      <div dangerouslySetInnerHTML={{ __html: section.type || "" }} />
    </div>

    {(section.children || []).map((sub: PipelineItem) => {
      let count = 0;
      (sub.phases || []).forEach((phase: StudyPhase) => {
        count += phase.studies.length;
      });
      const flex = studyCount > 0 ? count / studyCount : "unset";

      return (
        <div key={`${section.type}-${sub.type}`} className={styles.subSection} style={{ flex }}>
          {sub.type !== undefined && (
            <button
              className={styles.subheader}
              style={{
                backgroundColor: `rgba(${hexToRgb(sub.color || "#222222")}, 0.2)`,
                color: colorForBackground(sub.color || "#222222", sub.color),
              }}
              onClick={() => onClick(sub.path || "Content/Tumors")}
            >
              {/* TODO: fix danger */}
              {/* eslint-disable-next-line */}
              <div dangerouslySetInnerHTML={{ __html: sub.type }} />
            </button>
          )}

          {(sub.phases || []).map((phase: StudyPhase) => (
            <Phase
              key={`${section.type}-${sub.type}-${phase.title}`}
              section={section}
              sub={sub}
              phase={phase}
              compound={compound}
              flexRows={flexRows}
              studyCount={count}
              totalCount={studyCount}
              onClick={onClick}
            />
          ))}
        </div>
      );
    })}
  </div>
);

export default StudySection;
