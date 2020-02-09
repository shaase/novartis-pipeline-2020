import React, { MouseEvent, TouchEvent, useContext, useRef, useState } from "react";
import isDev from "electron-is-dev";
import { PipelineContext } from "../../state";
import { eventPosition } from "../../utils";
import novartis from "../../../../images/pipeline/novartis.svg";
import styles from "./index.module.scss";

let raf: number;

type Props = {
  isVisible: boolean;
  index: number;
  type: string;
  file: string;
  compound: string;
};

const Card: React.FC<Props> = ({ isVisible, index, type, file, compound }: Props) => {
  const { scale } = useContext(PipelineContext);
  const [contentClass, setContentClass] = useState(`content${type}Small`);
  const scroller = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const completing = useRef(false);
  const originY = useRef(0);
  const currentY = useRef(0);
  const diffY = useRef(0);
  const visRef = useRef(false);

  let source;
  const path = isDev ? "images/pipeline/cards/" : "dist/images/pipeline/cards";
  if (file !== "") {
    if (type.includes("Compounds")) {
      source = `${path}/compounds/${file}`;
    } else {
      source = `${path}/studies/${file}`;
    }
  }

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

  const present = (): void => {
    setTimeout(() => {
      setContentClass("content");
      setTimeout(() => {
        setContentClass("contentScrolling");
      }, 350);
    }, 50);
  };

  const dismiss = (): void => {
    setContentClass("content");
    setTimeout(() => {
      setContentClass(`content${type}Small`);
    }, 50);
  };

  if (visRef.current !== isVisible) {
    if (!isVisible) dismiss();
    visRef.current = isVisible;
  }

  return (
    <div className={styles.card} style={{ left: `${index * 100}%` }}>
      {file === "" ? (
        <div>
          <img className={styles.logo} src={novartis} alt="novartis" />
          {type === "Compounds" && (
            <div>
              <div className={styles.info}>
                See a Novartis medical representative <br />
                at this booth for more information about <br />
                <b>{compound}</b>.
              </div>
              <div className={styles.info}>
                For clinical trial information, explore the <br />
                information to the right.
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className={styles[contentClass]} ref={scroller}>
          {source !== undefined ? (
            <div className={isVisible ? styles.cropped : styles.croppedOff}>
              <img className={styles.image} src={source} alt={file} onLoad={present} />
            </div>
          ) : (
            <div className={styles.warning}>{`File not found: ${file}`}</div>
          )}

          <div
            className={styles.gestures}
            onTouchStart={onDown}
            onTouchMove={onMove}
            onTouchEnd={onUp}
            onMouseDown={onDown}
            onMouseMove={onMove}
            onMouseUp={onUp}
            onMouseOut={onUp}
          />
        </div>
      )}
    </div>
  );
};

export default Card;
