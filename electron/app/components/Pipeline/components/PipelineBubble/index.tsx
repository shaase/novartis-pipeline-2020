import React, { useContext } from "react";
import { FilterContext, PipelineContext } from "../../state";
import PanelHeader from "../PanelHeader";
import BubbleChart from "./bubble-chart";
// import StudyTable from '../StudyTable';
import CardPresenter from "../CardViewer";
import { studies as allStudies, dataForBubbles, colorForData, flattenUniqueStudies } from "../../data";
import { itemsForPath } from "../../utils";
import styles from "./index.module.scss";

const PipelineBubble: React.FC = () => {
  const { path, compound, onNavigate } = useContext(PipelineContext);
  const { phases } = useContext(FilterContext);

  const data = dataForBubbles(path, phases, compound);

  const { root, level } = itemsForPath(path);
  let { studyCode } = itemsForPath(path);
  const studies = flattenUniqueStudies(data, compound);
  studyCode = studies.length === 1 ? studies[0].nct : studyCode;
  const url = studyCode !== undefined ? allStudies[studyCode] : "";

  const showBubbles =
    (root === "Tumors" && level < 5 && data.length > 1) || (root === "Compounds" && level < 4 && data.length > 1);

  const isEmpty = data.length === 0 && studyCode === undefined;

  return (
    <div className={isEmpty ? styles.empty : styles.container}>
      <PanelHeader category="Study" />

      {/* BUBBLES */}
      <BubbleChart
        isVisible={showBubbles && studyCode === undefined}
        items={data}
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
      {studyCode !== undefined && (
        <CardPresenter
          type="Studies"
          color={colorForData(path)}
          items={[{ file: `${studyCode}.png`, label: "", studyCode, url }]}
        />
      )}
    </div>
  );
};

export default PipelineBubble;
