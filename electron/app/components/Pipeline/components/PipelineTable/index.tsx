import React, { MouseEvent, TouchEvent, useRef, useEffect } from "react";
import { cohorts, colorForData } from "../../data";
import { PipelineItem, TableData } from "../../types";
import { itemsForPath, eventPosition } from "../../utils";
import PanelHeader from "../PanelHeader";
import Section from "./section";
import CardViewer from "../CardViewer";
import styles from "./index.module.scss";

let raf: number;

type Props = {
  scale: number;
  path: string;
  compound?: string;
  data: TableData;
  onNavigate: (definedPath: string, definedCompound?: string, idling?: boolean) => void;
};

const PipelineTable: React.FC<Props> = ({ scale, path, compound, data, onNavigate }: Props) => {
  const content = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const completing = useRef(false);
  const canSelect = useRef(true);
  const originY = useRef(0);
  const currentY = useRef(0);
  const diffY = useRef(0);

  // checking styling (flex, scrolling) based on content size
  useEffect(() => {
    if (scroller.current !== null && content.current !== null) {
      content.current.className = styles.content;
      const scrollerHeight = scroller.current.clientHeight + 3;
      const contentHeight = content.current.clientHeight;
      const shouldFlex = scrollerHeight > contentHeight;
      scroller.current.className = shouldFlex ? styles.tableStatic : styles.tableScroll;
      content.current.className = shouldFlex ? styles.contentFlex : styles.content;
    }
  }, [data]);

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

  const { sections, allChildren } = data;
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
                  onNavigate={handleSelect}
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
