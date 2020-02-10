import React, { MouseEvent, TouchEvent, useContext, useEffect, useRef, useState } from "react";
import { FilterContext, PipelineContext } from "../../state";
import { postTableUpdate, subscribeToTableUpdates } from "../../workers";
import { cohorts, colorForData } from "../../data";
import { PipelineItem } from "../../types";
import { itemsForPath, eventPosition } from "../../utils";
import PanelHeader from "../PanelHeader";
import Section from "./section";
import CardViewer from "../CardViewer";
import styles from "./index.module.scss";

let raf: number;

interface WorkerData {
  sections: PipelineItem[];
  allChildren: PipelineItem[];
}

const defaultData: WorkerData = {
  sections: [],
  allChildren: [],
};

const PipelineTable: React.FC = () => {
  const { phases } = useContext(FilterContext);
  const { scale, path, compound, onNavigate } = useContext(PipelineContext);
  const [flexRows, setFlexRows] = useState(true);
  const [workerData, setWorkerData] = useState<WorkerData>(defaultData);

  const content = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const refreshFrames = useRef(0);
  const dragging = useRef(false);
  const completing = useRef(false);
  const originY = useRef(0);
  const currentY = useRef(0);
  const diffY = useRef(0);
  const pathRef = useRef("");
  const phaseRef = useRef<number[]>([]);

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
    }
  };

  if (pathRef.current !== path || phaseRef.current !== phases) {
    postTableUpdate(path, phases);
    pathRef.current = path;
    phaseRef.current = phases;
  }

  const onWorkerUpdate = (wd: WorkerData): void => {
    if (scroller.current !== null) {
      scroller.current.scrollTop = 0;
    }
    originY.current = 0;
    currentY.current = 0;
    diffY.current = 0;

    setWorkerData(wd);
  };

  useEffect(() => {
    refreshFrames.current = 0;
    requestAnimationFrame(checkFlex);
  }, [workerData]);

  useEffect(() => {
    subscribeToTableUpdates(onWorkerUpdate);
  }, []);

  const tick = (): void => {
    if (scroller && scroller.current) {
      if (dragging.current) {
        diffY.current = originY.current - currentY.current;
        scroller.current.scrollTop += diffY.current * scale;
        originY.current = currentY.current;
        raf = requestAnimationFrame(tick);
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
  };

  const overflowY = flexRows ? "hidden" : "scroll";
  const { sections, allChildren } = workerData;
  const isEmpty = allChildren.length === 0 && compound === undefined;

  const { studyCode } = itemsForPath(path);
  const compoundCards = compound !== undefined ? cohorts[compound] : undefined;

  let cards;
  if (compound) {
    if (compoundCards) {
      ({ cards } = compoundCards);
    } else {
      cards = [{ file: "", label: "", compound: "" }];
    }
  }

  return (
    <div className={isEmpty ? styles.empty : styles.container}>
      <PanelHeader category="Compounds" />

      {cards === undefined ? (
        <div
          className={styles.table}
          style={{ overflowY }}
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
            {React.Children.toArray(
              sections.map((section: PipelineItem) => (
                <Section
                  totalRows={allChildren.length}
                  section={section}
                  path={path}
                  nct={studyCode || ""}
                  flexRows={flexRows}
                  onNavigate={onNavigate}
                />
              )),
            )}
          </div>
        </div>
      ) : (
        <CardViewer type="Compounds" color={colorForData(path)} items={cards} />
      )}
    </div>
  );
};

export default PipelineTable;
