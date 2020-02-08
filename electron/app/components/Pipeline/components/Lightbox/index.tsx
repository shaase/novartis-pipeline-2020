import React, { useContext, useRef, useState } from "react";
import { CardContext } from "../../state";
import { LightboxContent, CardType } from "../../types";
import Card from "./card";
import close from "../../../../images/pipeline/collapse.svg";
import back from "../../../../images/pipeline/light-back.svg";
import next from "../../../../images/pipeline/light-next.svg";
import styles from "./index.module.scss";

const emptyContent = { type: "Compounds", color: "#FF0000", cards: [] };

const Lightbox: React.FC = () => {
  // TODO: IdleTouch
  const { cardIndex, lightboxContent, onCardIndex, onLightboxContent } = useContext(CardContext);
  const [isVisible, setVisible] = useState(false);
  const [content, setContent] = useState<LightboxContent | undefined>(undefined);
  const immediate = useRef(false);

  const { type, cards } = content || emptyContent;
  const empty = cards.filter((card: CardType) => card.file === "");
  const noEmpty = empty.length === 0;
  const x = cardIndex < cards.length ? -cardIndex * 100 : 0;

  if (content !== lightboxContent) {
    if (lightboxContent !== undefined) {
      if (content === undefined) {
        immediate.current = true;

        setTimeout(() => {
          immediate.current = false;
        }, 500);
      }

      setVisible(true);
      setContent(content);
    } else {
      setVisible(false);

      setTimeout(() => {
        const defaultType = content !== undefined ? content.type : "Compounds";
        setContent({ ...emptyContent, type: defaultType });
      }, 500);
    }
  }

  return (
    <div className={styles[`container-${cards.length > 0}`]}>
      <button className={styles[`shader-${isVisible}`]} onClick={() => onLightboxContent(undefined)}>
        <img className={styles.btnClose} src={close} />
      </button>

      {cards.length > 1 && cardIndex > 0 && noEmpty && (
        <button className={styles.btnBack} onClick={() => onCardIndex(cardIndex - 1)}>
          <img src={back} />
        </button>
      )}

      {cards.length > 1 && cardIndex < cards.length - 1 && noEmpty && (
        <button className={styles.btnNext} onClick={() => onCardIndex(cardIndex + 1)}>
          <img src={next} />
        </button>
      )}

      <div
        className={immediate.current ? styles.cardsStatic : styles.cards}
        style={{ transform: `translate3d(${x}%, 0px, 0px)` }}
      >
        {React.Children.toArray(
          cards.map((item, index) => (
            <Card isVisible={isVisible} index={index} type={type} file={item.file} compound={item.compound || ""} />
          )),
        )}
      </div>
    </div>
  );
};

export default Lightbox;
