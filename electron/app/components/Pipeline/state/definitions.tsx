import React, { createContext, useContext, useRef, useState } from "react";
import { PipelineContext } from "./pipeline";

export interface DefinitionsContextInterface {
  isVisible: boolean;
  onToggleDefs: () => void;
}

const defaultValue: DefinitionsContextInterface = {
  isVisible: false,
  onToggleDefs: () => {},
};

type Props = { children?: React.ReactNode };

export const DefinitionsContext = createContext<DefinitionsContextInterface>(defaultValue);

export const DefinitionsProvider: React.ComponentType<Props> = ({ children }: Props) => {
  const { path } = useContext(PipelineContext);
  const [isVisible, setVisible] = useState(false);
  const pathRef = useRef("");

  if (pathRef.current !== path) {
    setVisible(false);
    pathRef.current = path;
  }

  const onToggleDefs = (): void => {
    setVisible(!isVisible);
  };

  return (
    <DefinitionsContext.Provider
      value={{
        isVisible,
        onToggleDefs,
      }}
    >
      {children}
    </DefinitionsContext.Provider>
  );
};
