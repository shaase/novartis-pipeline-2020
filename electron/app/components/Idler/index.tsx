import React, { useContext, useEffect, useRef } from "react";
import { AppContext } from "../../state";
import { record } from "../../metrics";

type Props = { delay: number };

export const IdlerTouch = (): void => {
  record(`touch`);
  document.dispatchEvent(new CustomEvent("IDLER_TOUCH"));
};

export const Idler: React.FC<Props> = ({ delay }: Props) => {
  const { index, reset } = useContext(AppContext);
  const idxRef = useRef<number>(0);
  const timer = useRef<NodeJS.Timer>(global.setTimeout(() => {}, 0));

  const resetTimer = (): void => {
    clearTimeout(timer.current);

    if (idxRef.current > 0) {
      timer.current = setTimeout(() => {
        if (idxRef.current > 0) {
          reset();
        }
      }, delay * 1000);
    }
  };

  if (idxRef.current !== index) {
    idxRef.current = index;
    if (index > 0) {
      resetTimer();
    }
  }

  useEffect(() => {
    document.addEventListener("IDLER_TOUCH", resetTimer);
  }, []);

  return <div id="idler" />;
};
