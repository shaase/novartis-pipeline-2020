import React from "react";
import { RadialData } from "../../types";
import Header from "./header";
import RadialChart from "./RadialChart";
import CardViewer from "../CardViewer";
import Bottom from "./bottom";
import styles from "./index.module.scss";

type Props = {
  path: string;
  compound?: string;
  phases: number[];
  data: RadialData;
  onNavigate: (definedPath: string, definedCompound?: string, idling?: boolean) => void;
};

const PipelineRadial: React.FC<Props> = ({ path, compound, phases, data, onNavigate }: Props) => {
  const { cards } = data;

  return (
    <div className={styles.container}>
      {cards !== undefined && <Header cards={cards} />}

      <RadialChart
        isVisible={cards === undefined}
        path={path}
        compound={compound}
        phases={phases}
        data={data}
        onNavigate={onNavigate}
      />

      {cards !== undefined && <CardViewer type="MOA" color="#333333" items={cards} />}

      <Bottom cards={cards} />
    </div>
  );
};

export default PipelineRadial;
