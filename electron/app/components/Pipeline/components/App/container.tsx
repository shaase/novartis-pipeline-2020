import React, { useContext, useMemo, useRef, useState } from "react";
import { defaultPhases } from "../../data";
import { FilterContext, PipelineContext } from "../../state";
import { WorkerData, defaultWorkerData } from "../../types";
// import { IdlePath } from "../../state";
// import { Idler } from "../Idler";
import { getWorkerData } from "../../workers";
import Header from "../AppHeader";
import PipelineTable from "../PipelineTable";
// import PipelineRadial from "../PipelineRadial";
import PipelineBubble from "../PipelineBubble";
import Definitions from "../Definitions";
import Lightbox from "../Lightbox";
import styles from "./index.module.scss";

const AppContainer: React.FC = () => {
  const { scale, path, compound, onNavigate } = useContext(PipelineContext);
  const [workerData, setWorkerData] = useState<WorkerData>(defaultWorkerData);
  const { phases } = useContext(FilterContext);
  const pathRef = useRef("");
  const compoundRef = useRef<string | undefined>(undefined);
  const phasesRef = useRef<number[]>(defaultPhases);

  const getData = async (): Promise<void> => {
    const [tableData, radialHierarchy, bubbleData] = await getWorkerData(path, phases, compound, 500, 800);
    setWorkerData({ tableData, radialHierarchy, bubbleData });
  };

  if (pathRef.current !== path || compoundRef.current !== compound || phasesRef.current !== phases) {
    pathRef.current = path;
    compoundRef.current = compound;
    phasesRef.current = phases;
    getData();
  }

  const { tableData, bubbleData } = workerData;
  const pipelineTable = useMemo(
    () => <PipelineTable scale={scale} path={path} compound={compound} data={tableData} onNavigate={onNavigate} />,
    [tableData],
  );

  const pipelineBubble = useMemo(
    () => (
      <PipelineBubble
        scale={scale}
        path={path}
        compound={compound}
        phases={phases}
        data={bubbleData}
        onNavigate={onNavigate}
      />
    ),
    [bubbleData],
  );

  return (
    <div className={styles.container}>
      {/* {idlePaths.length > 0 && <Idler paths={idlePaths} />} */}

      <div className={styles.pipeline}>
        <Header />
        <div className={styles.panels}>
          {pipelineTable}
          {/* <PipelineRadial /> */}
          {pipelineBubble}
          <Definitions />
          <Lightbox />
        </div>
      </div>
    </div>
  );
};

export default AppContainer;
