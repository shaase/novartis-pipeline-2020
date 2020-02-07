import React from "react";
import { CardProvider, DefinitionsProvider, FilterProvider, PipelineProvider, IdlePath } from "../../state";
import Container from "./container";
import "../../global.css";

type Props = { home: string; idlePaths: IdlePath[]; scale: number; isActive: boolean };

const AppProvider: React.FC<Props> = ({ home, idlePaths, scale, isActive }: Props) => (
  <FilterProvider>
    <PipelineProvider home={home} idlePaths={idlePaths} scale={scale} isActive={isActive}>
      <CardProvider>
        <DefinitionsProvider>
          <Container />
        </DefinitionsProvider>
      </CardProvider>
    </PipelineProvider>
  </FilterProvider>
);

export default AppProvider;
