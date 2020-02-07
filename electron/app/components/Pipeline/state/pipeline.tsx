import React, { createContext, useRef, useState } from "react";
import { record } from "../metrics";
import { studiesForPath } from "../data";
import { itemsForPath } from "../utils";

// TODO: move?
export interface IdlePath {
  path: string;
  compound: string;
  cardIndex: number;
}

interface RouteItem {
  path: string;
  compound?: string;
}

type Props = { home: string; idlePaths: IdlePath[]; isActive: boolean; children?: React.ReactNode };

export interface PipelineContextInterface {
  path: string;
  compound?: string;
  idlePaths: IdlePath[];
  isIdling: boolean;
  onReset: () => void;
}

const defaultValue: PipelineContextInterface = {
  path: "",
  compound: undefined,
  idlePaths: [],
  isIdling: false,
  onReset: () => {},
};

export const PipelineContext = createContext<PipelineContextInterface>(defaultValue);

export const PipelineProvider: React.ComponentType<Props> = ({ home, idlePaths, isActive, children }: Props) => {
  const defaultRoute = { path: home, compound: undefined };
  const [route, setRoute] = useState<RouteItem>({ ...defaultRoute });
  const [isIdling, setIdling] = useState(false);

  const activeRef = useRef(false);
  const history = useRef([{ ...defaultRoute }]);
  const nextHistory = useRef([]);

  const onReset = (): void => {
    setRoute({ ...defaultRoute });
  };

  // active state based on pipeline container (e.g., TTE)
  if (activeRef.current !== isActive) {
    activeRef.current = isActive;

    setTimeout(() => {
      onReset();
    }, 550);
  }

  // private
  // const onRouteUpdate = (
  //   route: RouteItem[],
  //   nextRoute: RouteItem[],
  //   isIdling: boolean
  // ) => {
  //   const { path, compound } = route[route.length - 1];

  //   this.setState({
  //     path,
  //     compound,
  //     route,
  //     nextRoute,
  //     isIdling
  //   });
  // };

  // private

  const onNavigate = (definedPath: string, definedCompound?: string, idling? = false): void => {
    if (definedPath.includes("Content")) {
      // TODO: only for kiosk
      if (!isIdling) record(`SELECT, ${definedPath}`);

      let path = definedPath;
      let compound = definedCompound;

      if (definedCompound === undefined) {
        const studies = studiesForPath(definedPath, "target");
        if (studies.length === 1) {
          compound = studies[0].target;
        }

        if (prevCompound !== undefined) {
          const { studyCode } = itemsForPath(definedPath);
          const filtered = studies.filter(study => study.target === prevCompound);

          if (filtered.length > 0 && studyCode !== undefined) {
            compound = prevCompound;
          }
        }
      } else if (!isIdling) {
        const { studyCode } = itemsForPath(prevPath);
        path = studyCode === undefined ? path : prevPath;
      }

      // this.handleRouteUpdate([...route, { path, compound }], [], isIdling);
    }
  };

  return (
    <PipelineContext.Provider
      value={{
        path: route.path,
        compound: route.compound,
        idlePaths,
        isIdling,
        onReset,
      }}
    >
      {children}
    </PipelineContext.Provider>
  );
};
