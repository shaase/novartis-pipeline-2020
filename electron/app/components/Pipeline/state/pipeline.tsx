import React, { createContext, useContext, useRef, useState } from "react";
import { FilterContext } from "./filter";
import { record } from "../metrics";
import { studiesForPath } from "../data";
import { itemsForPath } from "../utils";
import { PipelineStudy } from "../types";

// TODO: move?
export interface IdlePath {
  path: string;
  compound: string;
  cardIndex: number;
}

interface PipelineRoute {
  path: string;
  compound?: string;
}

type Props = { home: string; idlePaths: IdlePath[]; scale: number; isActive: boolean; children?: React.ReactNode };

export interface PipelineContextInterface {
  scale: number;
  path: string;
  compound?: string;
  history: PipelineRoute[];
  nextHistory: PipelineRoute[];
  idlePaths: IdlePath[];
  isIdling: boolean;
  onNavigate: (definedPath: string, definedCompound?: string, idling?: boolean) => void;
  onNext: () => void;
  onBack: () => void;
  onReset: () => void;
}

const defaultValue: PipelineContextInterface = {
  scale: window.innerWidth / 1920,
  path: "",
  compound: undefined,
  history: [],
  nextHistory: [],
  idlePaths: [],
  isIdling: false,
  onNavigate: () => {},
  onNext: () => {},
  onBack: () => {},
  onReset: () => {},
};

export const PipelineContext = createContext<PipelineContextInterface>(defaultValue);

export const PipelineProvider: React.ComponentType<Props> = ({ home, idlePaths, isActive, scale, children }: Props) => {
  const { onClearFilters } = useContext(FilterContext);
  const defaultRoute = { path: home, compound: undefined };
  const [route, setRoute] = useState<PipelineRoute>({ ...defaultRoute });
  const [isIdling, setIdling] = useState(false);

  const activeRef = useRef(false);
  const prevPath = useRef(home);
  const prevCompound = useRef(undefined);
  const history = useRef<PipelineRoute[]>([{ ...defaultRoute }]);
  const nextHistory = useRef<PipelineRoute[]>([]);

  const onNavigate = (definedPath: string, definedCompound?: string, idling = false): void => {
    if (definedPath.includes("Content")) {
      // TODO: only for kiosk
      if (!isIdling) record(`SELECT, ${definedPath}`);

      let newPath = definedPath;
      let newCompound = definedCompound;

      if (definedCompound === undefined) {
        const studies = studiesForPath(definedPath, "target");
        if (studies.length === 1) {
          newCompound = studies[0].target;
        }

        if (prevCompound !== undefined) {
          const { studyCode } = itemsForPath(definedPath);
          const filtered = studies.filter((study: PipelineStudy) => study.target === prevCompound.current);

          if (filtered.length > 0 && studyCode !== undefined) {
            newCompound = prevCompound.current;
          }
        }
      } else if (!isIdling) {
        const { studyCode } = itemsForPath(prevPath.current);
        newPath = studyCode === undefined ? newPath : prevPath.current;
      }

      const newRoute = { path: newPath, compound: newCompound };
      history.current = [...history.current, newRoute];
      nextHistory.current = [];

      setRoute(newRoute);
      setIdling(idling);
    }
  };

  const onBack = (): void => {
    if (history.current.length > 1) {
      const lastItem = history.current.pop();
      if (lastItem !== undefined) {
        nextHistory.current.push(lastItem);
        setRoute(history.current[history.current.length - 1]);
      }
    }

    setIdling(false);
  };

  const onNext = (): void => {
    if (nextHistory.current.length > 0) {
      const lastItem = nextHistory.current.pop();
      if (lastItem !== undefined) history.current.push(lastItem);
      setRoute(history.current[history.current.length - 1]);
    }

    setIdling(false);
  };

  const onReset = (idling = false): void => {
    history.current = [{ ...defaultRoute }];
    nextHistory.current = [];
    onClearFilters();
    setRoute({ ...defaultRoute });
    setIdling(idling);
  };

  // active state based on pipeline container (e.g., TTE)
  if (activeRef.current !== isActive) {
    activeRef.current = isActive;

    setTimeout(() => {
      onReset();
    }, 550);
  }

  return (
    <PipelineContext.Provider
      value={{
        scale,
        path: route.path,
        compound: route.compound,
        history: history.current,
        nextHistory: nextHistory.current,
        idlePaths,
        isIdling,
        onNavigate,
        onNext,
        onBack,
        onReset,
      }}
    >
      {children}
    </PipelineContext.Provider>
  );
};
