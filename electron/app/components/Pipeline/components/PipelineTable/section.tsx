// @flow
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
  const [titleClass, setTitleClass] = useState("buttonSectionTitle");
  const buttonSection = useRef<HTMLButtonElement>(null);
  const pathRef = useRef("");
  const flexRef = useRef(false);

  const checkSectionHeight = (): void => {
    if (buttonSection.current !== null) {
      const { top, height } = buttonSection.current.getBoundingClientRect();
      let newTitleClass = "buttonSectionTitle";

      if (height > 800) {
        newTitleClass = top > 250 ? "buttonSectionTitleTop" : "buttonSectionTitleFixed";
      }

      if (newTitleClass !== titleClass) {
        setTitleClass(newTitleClass);
      }

      if (height > 800) {
        requestAnimationFrame(checkSectionHeight);
      }
    }
  };

  if (pathRef.current !== path || flexRef.current !== flexRows) {
    checkSectionHeight();
    pathRef.current = path;
    flexRef.current = flexRows;
  }

  const view = path.split("/")[1];
  const flex = totalRows > 0 ? (section.children || []).length / totalRows : 0;

  const sectionTitle = section.type === "Rare Disease" ? "Rare" : section.type;
  const showTitle = path !== "Content/Tumors" || section.type !== "Rare Disease";
  const sectionPath = section.path || "Content/Tumors";

  return (
    <div className={styles.section} style={{ backgroundColor: section.color, flex }}>
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
