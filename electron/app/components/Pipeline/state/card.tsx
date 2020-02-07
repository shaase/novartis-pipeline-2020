import React, { createContext, useContext, useRef, useState } from "react";
import { PipelineContext } from "./pipeline";
import { record } from "../metrics";

export interface CardType {
  file: string;
  label: string;
  compound?: string;
  studyCode?: string;
}

export interface LightboxContent {
  type: string;
  cards: CardType[];
  color: string;
}

export interface CardContextInterface {
  cardIndex: number;
  lightboxContent?: LightboxContent;
  onCardIndex: (n: number) => void;
  onLightboxContent: (l: LightboxContent) => void;
}

const defaultValue: CardContextInterface = {
  cardIndex: 0,
  lightboxContent: undefined,
  onCardIndex: () => {},
  onLightboxContent: () => {},
};

type Props = { children?: React.ReactNode };

export const CardContext = createContext<CardContextInterface>(defaultValue);

export const CardProvider: React.ComponentType<Props> = ({ children }: Props) => {
  const { path, compound, isIdling } = useContext(PipelineContext);
  const [cardIndex, setCardIndex] = useState(0);
  const [lightboxContent, setLightboxContent] = useState<LightboxContent | undefined>(undefined);
  const pathRef = useRef("");
  const compoundRef = useRef<string | undefined>(undefined);

  if (pathRef.current !== path || compoundRef.current !== compound) {
    if (cardIndex > 0 || lightboxContent !== undefined) {
      setCardIndex(0);
    }

    pathRef.current = path;
    compoundRef.current = compound;
  }

  const onCardIndex = (n: number): void => {
    if (n > 0 && !isIdling) {
      record(`CARD_INDEX, ${n}`);
    }
    setCardIndex(n);
  };

  const onLightboxContent = (l?: LightboxContent): void => {
    setLightboxContent(l);
  };

  return (
    <CardContext.Provider
      value={{
        cardIndex,
        lightboxContent,
        onCardIndex,
        onLightboxContent,
      }}
    >
      {children}
    </CardContext.Provider>
  );
};
