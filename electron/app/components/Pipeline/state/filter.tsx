import React, { createContext, useState } from "react";
// import { defaultPhases } from '../data';

// TODO: integrate data/defaultPhases
const defaultPhases = [1, 1.5, 2, 3];

type Props = { children?: React.ReactNode };

export interface FilterContextInterface {
  phases: number[];
  onTogglePhase: (phase: number) => void;
  onClearFilters: () => void;
}

const defaultValue: FilterContextInterface = {
  phases: [],
  onTogglePhase: () => {},
  onClearFilters: () => {},
};

export const FilterContext = createContext<FilterContextInterface>(defaultValue);

export const FilterProvider: React.ComponentType<Props> = ({ children }: Props) => {
  const [phases, setPhases] = useState<number[]>(defaultPhases);

  const onTogglePhase = (phase: number): void => {
    const newPhases = [...phases];
    const index = newPhases.indexOf(phase);

    if (index < 0) {
      setPhases([...newPhases, phase]);
    } else if (phases.length > 1) {
      setPhases(newPhases.filter((p: number) => p !== phase));
    }
  };

  const onClearFilters = (): void => {
    setPhases([...defaultPhases]);
  };

  return (
    <FilterContext.Provider
      value={{
        phases,
        onTogglePhase,
        onClearFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};
