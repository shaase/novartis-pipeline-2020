import React, { MouseEvent, TouchEvent, useRef, useState } from "react";
import { PipelineItem, StudyPhase } from "../../types";
import { eventPosition } from "../../utils";
import { sectionedData, onStudyElements } from "./utils";
import Section from "./section";
import styles from "./index.module.scss";

let raf: number;

type Props = {
  scale: number;
  data: PipelineItem[];
  compound?: string;
  onNavigate: (definedPath: string, definedCompound?: string, idling?: boolean) => void;
};

const StudyTable: React.FC<Props> = ({ scale, data, compound, onNavigate }: Props) => {
  const [flexRows, setFlexRows] = useState(false);

  const content = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const refreshFrames = useRef(0);
  const dragging = useRef(false);
  const completing = useRef(false);
  const canSelect = useRef(true);
  const originY = useRef(0);
  const currentY = useRef(0);
  const diffY = useRef(0);
  const dataRef = useRef<PipelineItem[]>([]);
  const compoundRef = useRef<string | undefined>(undefined);

  const sorted = sectionedData(data, compound);

  let studyCount = 0;

  if (flexRows) {
    sorted.forEach((section: PipelineItem) => {
      (section.children || []).forEach((sub: PipelineItem) => {
        (sub.phases || []).forEach((phase: StudyPhase) => {
          studyCount += phase.studies.length;
        });
      });
    });
  }

  const checkFlex = (): void => {
    if (scroller.current !== null && content.current !== null) {
      content.current.className = styles.content;
      const scrollerHeight = scroller.current.clientHeight + 3;
      const contentHeight = content.current.clientHeight;
      const shouldFlex = scrollerHeight > contentHeight;
      content.current.className = shouldFlex ? styles.contentFlex : styles.content;

      if (shouldFlex && !flexRows) {
        setFlexRows(true);
      } else if (!shouldFlex && flexRows) {
        setFlexRows(false);
      }

      refreshFrames.current += 1;
      if (refreshFrames.current < 2) {
        requestAnimationFrame(checkFlex);
      }
    }
  };

  if (dataRef.current !== data || compoundRef.current !== compound) {
    if (scroller.current !== null) {
      scroller.current.scrollTop = 0;
    }

    originY.current = 0;
    currentY.current = 0;
    diffY.current = 0;
    dataRef.current = data;
    compoundRef.current = compound;
    refreshFrames.current = 0;
    onStudyElements(data);
    requestAnimationFrame(checkFlex);
  }

  const tick = (): void => {
    if (scroller && scroller.current) {
      if (dragging.current) {
        diffY.current = originY.current - currentY.current;
        scroller.current.scrollTop += diffY.current * scale;
        originY.current = currentY.current;
        raf = requestAnimationFrame(tick);
        if (Math.abs(diffY.current) > 5) {
          canSelect.current = false;
        }
      } else if (completing.current) {
        if (Math.abs(diffY.current) > 1) {
          diffY.current *= 0.7;
          scroller.current.scrollTop += diffY.current;
          raf = requestAnimationFrame(tick);
        } else {
          completing.current = false;
          cancelAnimationFrame(raf);
        }
      } else {
        cancelAnimationFrame(raf);
      }
    }
  };

  const onEnter = (): void => {
    if (dragging.current) {
      dragging.current = false;
      completing.current = true;
    }
  };

  const onDown = (e: MouseEvent | TouchEvent): void => {
    if (scroller && scroller.current) {
      const { y } = eventPosition(e);
      originY.current = y;
      currentY.current = y;
      diffY.current = 0;
      dragging.current = true;

      // TODO: IdlerTouch();
      raf = requestAnimationFrame(tick);
    }
  };

  const onMove = (e: MouseEvent | TouchEvent): void => {
    if (dragging.current) {
      const { y } = eventPosition(e);
      currentY.current = y;
    }
  };

  const onUp = (): void => {
    if (dragging.current) {
      dragging.current = false;
      completing.current = true;
    }

    setTimeout(() => {
      canSelect.current = true;
    }, 500);
  };

  const handleSelect = (p: string, c?: string): void => {
    if (canSelect.current) {
      onNavigate(p, c);
    }
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.table}
        style={{ overflowY: flexRows ? "hidden" : "scroll" }}
        ref={scroller}
        onTouchStart={onDown}
        onTouchMove={onMove}
        onTouchEnd={onUp}
        onMouseEnter={onEnter}
        onMouseDown={onDown}
        onMouseMove={onMove}
        onMouseUp={onUp}
        onMouseOut={onUp}
      >
        <div ref={content}>
          {sorted.map((section: PipelineItem) => (
            <Section
              key={section.type}
              section={section}
              compound={compound}
              flexRows={flexRows}
              studyCount={studyCount}
              onClick={handleSelect}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudyTable;
