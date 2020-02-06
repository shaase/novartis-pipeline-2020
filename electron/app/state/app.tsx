import React, { createContext, useEffect, useState } from "react";
import { getOrientation } from "../panels";
import { startClient, subscribe, post, SocketEvent } from "../socket-client";
import { record } from "../metrics";

export interface AppContextInterface {
  scale: number;
  index: number;
  back: () => void;
  next: () => void;
  reset: () => void;
}

const defaultValue: AppContextInterface = {
  scale: 1,
  index: 0,
  back: () => {},
  next: () => {},
  reset: () => {},
};

type Props = { children?: React.ReactNode };

export const AppContext = createContext<AppContextInterface>(defaultValue);

export const AppProvider: React.ComponentType<Props> = ({ children }: Props) => {
  const orientation = getOrientation();
  const width = orientation === "landscape" ? 1920 : 1080;

  const [scale, setScale] = useState(window.innerWidth / width);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    document.addEventListener("RESIZE", () => {
      setScale(window.innerWidth / width);
    });

    console.log(window.wsServerIP);
    startClient(window.wsServerIP);

    subscribe((event: SocketEvent) => {
      const { type, message } = event;
      console.log(type, message);
    });
  }, []);

  useEffect(() => {
    record(`screen navigation: ${index}`);
  }, [index]);

  const back = (): void => {
    setIndex(Math.max(0, index - 1));
    post("back", JSON.stringify(Math.min(5, index - 1)));
  };

  const next = (): void => {
    setIndex(Math.min(5, index + 1));
    post("next", JSON.stringify(Math.min(5, index + 1)));
  };

  const reset = (): void => {
    setIndex(0);
  };

  return (
    <AppContext.Provider
      value={{
        scale,
        index,
        back,
        next,
        reset,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
