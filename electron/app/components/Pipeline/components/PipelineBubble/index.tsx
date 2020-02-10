import React, { useContext, useEffect, useRef } from "react";
import { FilterContext, PipelineContext } from "../../state";
import PanelHeader from "../PanelHeader";
import BubbleChart from "./bubble-chart";
// import StudyTable from '../StudyTable';
// import CardPresenter from "../CardViewer";
import { postBubbleUpdate, subscribeToBubbleUpdates } from "../../workers";
import { colorForData } from "../../data";
import { itemsForPath } from "../../utils";
import styles from "./index.module.scss";

const PipelineBubble: React.FC = () => {
  const { path, compound, onNavigate } = useContext(PipelineContext);
  const { phases } = useContext(FilterContext);
  const pathRef = useRef("");

  if (pathRef.current !== path) {
    console.log("render", path);
    postBubbleUpdate(path, phases, compound, 500, 800);
    pathRef.current = path;
  }

  const onWorkerUpdate = ({ data, studyCode, url, bubbles }) => {
    console.log(data, studyCode, url, bubbles);
  };

  useEffect(() => {
    subscribeToBubbleUpdates(onWorkerUpdate);
  }, []);

  // const { data, studyCode, url, bubbles } = getBubbleData(path, phases, compound, 500, 800);
  // const { root, level } = itemsForPath(path);

  // const showBubbles =
  //   (root === "Tumors" && level < 5 && data.length > 1) || (root === "Compounds" && level < 4 && data.length > 1);

  // const isEmpty = data.length === 0 && studyCode === undefined;
  const isEmpty = true;
  return (
    <div className={isEmpty ? styles.empty : styles.container}>
      <PanelHeader category="Study" />

      {/* BUBBLES */}
      {/* <BubbleChart
        isVisible={showBubbles && studyCode === undefined}
        items={data}
        path={path}
        width={500}
        height={800}
        onNavigate={onNavigate}
      /> */}

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
