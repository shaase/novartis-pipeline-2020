import React, { createContext, useRef, useState } from "react";

type Props = { path: string; children?: React.ReactNode };

export interface DefinitionsContextInterface {
  isVisible: boolean;
  onToggleDefs: () => void;
}

const defaultValue: DefinitionsContextInterface = {
  isVisible: false,
  onToggleDefs: () => {},
};

export const DefinitionsContext = createContext<DefinitionsContextInterface>(defaultValue);

export const DefinitionsProvider: React.ComponentType<Props> = ({ path, children }: Props) => {
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
