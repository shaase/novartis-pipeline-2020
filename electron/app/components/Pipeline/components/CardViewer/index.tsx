import React, { useContext } from "react";
import { CardContext } from "../../state";
import { colorForBackground } from "../../utils";
import { CardType } from "../../types";
import Card from "./card";
import { rounded, leftBorder, rightBorder } from "./utils";
import expand from "../../../../images/pipeline/expand.svg";
import weblink from "../../../../images/pipeline/web-link.svg";
import styles from "./index.module.scss";

type Props = { type: string; color: string; items: CardType[] };

const CardViewer: React.FC<Props> = ({ type, color, items }: Props) => {
  const { cardIndex, onCardIndex, onLightboxContent } = useContext(CardContext);
  const x = cardIndex < items.length ? -cardIndex * 100 : 0;
  return (
    <div className={styles.container}>
      {type === "Compounds" && (
        <div
          className={styles.buttons}
          style={{
            border: `1px solid ${color}`,
            borderTop: "none",
            backgroundColor: "#FFFFFF",
          }}
        >
          {React.Children.toArray(
            items.map((item, index) => (
              <button
                className={index === cardIndex ? styles.buttonSelected : styles.button}
                style={{
                  backgroundColor: index === cardIndex ? color : "#FFFFFF",
                  color: index === cardIndex ? colorForBackground("#FFFFFF", color) : colorForBackground(color, color),
                  borderRadius: rounded(index, items.length, cardIndex),
                  borderLeft: leftBorder(index, items.length, color, cardIndex),
                  borderRight: rightBorder(index, items.length, color, cardIndex),
                }}
                onClick={() => {
                  // TODO: IdleTouch
                  onCardIndex(index);
                }}
              >
                {item.label}
              </button>
            )),
          )}
        </div>
      )}

      <div className={styles.cards} style={{ transform: `translate3d(${x}%, 0px, 0px)` }}>
        {React.Children.toArray(
          items.map((item, index) => (
            <Card
              index={index}
              type={type}
              file={item.file}
              code={item.studyCode || ""}
              compound={item.compound || ""}
            />
          )),
        )}
      </div>

      {(type === "Compounds" || type === "Studies") && items[cardIndex].file !== "" && (
        <button
          className={type === "Compounds" ? styles.btnLightbox : styles.btnLightboxStudy}
          onClick={() => {
            // TODO: IdleTouch
            onLightboxContent({ type, color, cards: items });
          }}
        >
          <img className={styles.iconExpand} src={expand} />
        </button>
      )}

      {type === "Studies" && items[cardIndex].file !== "" && (
        <button
          className={styles.btnWeblink}
          onClick={() => {
            // TODO: IdleTouch
            // TODO" send openExternal to main process
            // shell.openExternal(items[cardIndex].url);
          }}
        >
          <img className={styles.iconExpand} src={weblink} />
        </button>
      )}
    </div>
  );
};

export default CardViewer;
