import React, { useContext, useEffect, useRef, useState } from "react";
import { FilterContext, PipelineContext } from "../../state";
import PanelHeader from "../PanelHeader";
import BubbleChart from "./bubble-chart";
// import StudyTable from '../StudyTable';
// import CardPresenter from "../CardViewer";
import { postBubbleUpdate, subscribeToBubbleUpdates } from "../../workers";
import { colorForData } from "../../data";
import { itemsForPath } from "../../utils";
import { PipelineItem, Bubble } from "../../types";
import styles from "./index.module.scss";

interface WorkerData {
  data: PipelineItem[];
  studyCode: string;
  url: string;
  bubbles: Bubble[];
}

const defaultData: WorkerData = {
  data: [],
  studyCode: "",
  url: "",
  bubbles: [],
};

const PipelineBubble: React.FC = () => {
  const { path, compound, onNavigate } = useContext(PipelineContext);
  const { phases } = useContext(FilterContext);
  const [workerData, setWorkerData] = useState<WorkerData>(defaultData);
  const pathRef = useRef("");
  const { data, studyCode, url, bubbles } = workerData;

  console.log("render", workerData);

  if (pathRef.current !== path) {
    postBubbleUpdate(path, phases, compound, 500, 800);
    pathRef.current = path;
  }

  const onWorkerUpdate = (wd: WorkerData): void => {
    // setData(d);
    // setStudyCode(sc);
    // setURL(u);
    // setBubbles(bb);
    setWorkerData(wd);
  };

  useEffect(() => {
    subscribeToBubbleUpdates(onWorkerUpdate);
  }, []);

  const { root, level } = itemsForPath(path);
  const showBubbles =
    (root === "Tumors" && level < 5 && data.length > 1) || (root === "Compounds" && level < 4 && data.length > 1);
  const isEmpty = data.length === 0 && studyCode === undefined;

  return (
    <div className={isEmpty ? styles.empty : styles.container}>
      <PanelHeader category="Study" />

      {/* BUBBLES */}
      <BubbleChart
        isVisible={showBubbles && studyCode === undefined}
        bubbles={bubbles}
        path={path}
        width={500}
        height={800}
        onNavigate={onNavigate}
      />

      {/* TABLE */}
      {/* {!showBubbles && studyCode === undefined && (
        <StudyTable scale={scale} panel={panel} data={data} compound={compound} onSelect={onSelect} />
      )} */}

      {/* STUDY */}
      {/* {studyCode !== undefined && (
        <CardPresenter
          type="Studies"
          color={colorForData(path)}
          items={[{ file: `${studyCode}.png`, label: "", studyCode, url }]}
        />
      )} */}
    </div>
  );
};

export default PipelineBubble;
