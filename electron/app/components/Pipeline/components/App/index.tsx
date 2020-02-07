import React from "react";
import { CardProvider, DefinitionsProvider, FilterProvider, PipelineProvider, IdlePath } from "../../state";
import Container from "./container";

type Props = { home: string; idlePaths: IdlePath[]; scale: number; isActive: boolean };

const AppProvider: React.FC<Props> = ({ home, idlePaths, scale, isActive }: Props) => (
  <FilterProvider>
    <PipelineProvider home={home} idlePaths={idlePaths} scale={scale} isActive={isActive}>
      <CardProvider>
        <DefinitionsProvider>
          <Container home={home} idlePaths={idlePaths} isActive={isActive} />
        </DefinitionsProvider>
      </CardProvider>
    </PipelineProvider>
  </FilterProvider>
);

export default AppProvider;
