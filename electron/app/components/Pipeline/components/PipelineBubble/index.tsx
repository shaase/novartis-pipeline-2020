import React, { useContext, useEffect, useRef, useState } from "react";
import { FilterContext, PipelineContext } from "../../state";
import { postBubbleUpdate, subscribeToBubbleUpdates } from "../../workers";
import PanelHeader from "../PanelHeader";
import BubbleChart from "./bubble-chart";
import StudyTable from "../StudyTable";
import CardViewer from "../CardViewer";
import { colorForData } from "../../data";
import { itemsForPath } from "../../utils";
import { PipelineItem, Bubble } from "../../types";
import styles from "./index.module.scss";

interface WorkerData {
  data: PipelineItem[];
  studyCode: string;
  url: string;
  bubbles: Bubble[];
  marginLeft: number;
}

const defaultData: WorkerData = {
  data: [],
  studyCode: "",
  url: "",
  bubbles: [],
  marginLeft: 0,
};

const PipelineBubble: React.FC = () => {
  const { scale, path, compound, onNavigate } = useContext(PipelineContext);
  const { phases } = useContext(FilterContext);
  const [workerData, setWorkerData] = useState<WorkerData>(defaultData);
  const pathRef = useRef("");
  const { data, studyCode, url, bubbles, marginLeft } = workerData;

  if (pathRef.current !== path) {
    postBubbleUpdate(path, phases, compound, 500, 800);
    pathRef.current = path;
  }

  const onWorkerUpdate = (wd: WorkerData): void => {
    setWorkerData(wd);
  };

  useEffect(() => {
    subscribeToBubbleUpdates(onWorkerUpdate);
  }, []);

  const { root, level } = itemsForPath(path);
  const showBubbles =
    (root === "Tumors" && level < 5 && data.length > 1) || (root === "Compounds" && level < 4 && data.length > 1);
  const isEmpty = data.length === 0 && studyCode === undefined;
  console.log(showBubbles);
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
        marginLeft={marginLeft}
        onNavigate={onNavigate}
      />

      {/* TABLE */}
      {!showBubbles && studyCode === undefined && (
        <StudyTable scale={scale} data={data} compound={compound} onNavigate={onNavigate} />
      )}

      {/* STUDY */}
      {studyCode !== undefined && (
        <CardViewer
          type="Studies"
          color={colorForData(path)}
          items={[{ file: `${studyCode}.png`, label: "", studyCode, url }]}
        />
      )}
    </div>
  );
};

export default PipelineBubble;
