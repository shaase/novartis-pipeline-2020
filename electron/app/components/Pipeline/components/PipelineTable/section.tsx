import React, { useRef, useState } from "react";
import { PipelineItem } from "../../types";
import Tumors from "./tumor-list";
import Compounds from "./compound-list";
import styles from "./section.module.scss";

type Props = {
  path: string;
  nct: string;
  flexRows: boolean;
  section: PipelineItem;
  totalRows: number;
  onNavigate: (definedPath: string, definedCompound?: string, idling?: boolean) => void;
};

const Section: React.FC<Props> = ({ path, nct, flexRows, totalRows, section, onNavigate }: Props) => {
  const [titleClass, setTitleClass] = useState("sectionTitleCenter");
  const buttonSection = useRef<HTMLButtonElement>(null);
  const sectionRef = useRef<PipelineItem | null>(null);
  const flexRef = useRef(false);

  const view = path.split("/")[1];
  const flex = totalRows > 0 ? (section.children || []).length / totalRows : 0;
  const display = flex > 0 ? "flex" : "none";

  const sectionTitle = section.type === "Rare Disease" ? "Rare" : section.type;
  const showTitle = path !== "Content/Tumors" || section.type !== "Rare Disease";
  const sectionPath = section.path || "Content/Tumors";

  const checkSectionHeight = (): void => {
    if (buttonSection.current !== null) {
      const { top, height } = buttonSection.current.getBoundingClientRect();
      let newClass = "sectionTitleCenter";

      if (height > 800) {
        newClass = top > 250 ? "sectionTitleTop" : "sectionTitleFixed";
      }

      if (newClass !== titleClass) {
        setTitleClass(newClass);
      }
    }
  };

  if (sectionRef.current !== section || flexRef.current !== flexRows) {
    requestAnimationFrame(checkSectionHeight);
    sectionRef.current = section;
    flexRef.current = flexRows;
  }

  return (
    <div className={styles.section} style={{ backgroundColor: section.color, flex, display }}>
      {(sectionPath.includes(path) || path.includes(sectionPath)) && (
        <button
          className={styles.buttonSection}
          type="button"
          onClick={() => onNavigate(sectionPath)}
          ref={buttonSection}
        >
          {showTitle && <div className={styles[titleClass]}>{sectionTitle}</div>}
        </button>
      )}

      <div className={flexRows ? styles.fullFlex : styles.full}>
        {view === "Tumors" ? (
          <Tumors path={path} nct={nct} section={section} flexRows={flexRows} onNavigate={onNavigate} />
        ) : (
          <Compounds section={section} path={path} flexRows={flexRows} onNavigate={onNavigate} />
        )}
      </div>
    </div>
  );
};

export default Section;
