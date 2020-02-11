import React from "react";
import PanelHeader from "../PanelHeader";
import BubbleChart from "./bubble-chart";
import StudyTable from "../StudyTable";
import CardViewer from "../CardViewer";
import { colorForData } from "../../data";
import { itemsForPath } from "../../utils";
import { BubbleData } from "../../types";
import styles from "./index.module.scss";

type Props = {
  scale: number;
  path: string;
  compound?: string;
  phases: number[];
  data: BubbleData;
  onNavigate: (definedPath: string, definedCompound?: string, idling?: boolean) => void;
};

const PipelineBubble: React.FC<Props> = ({ scale, path, compound, data: bubbleData, onNavigate }: Props) => {
  const { data, studyCode, url, bubbles, marginLeft } = bubbleData;
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
        marginLeft={marginLeft}
        onNavigate={onNavigate}
      />

      {/* TABLE */}
      {!showBubbles && studyCode === undefined && (
        <StudyTable scale={scale} data={data} compound={compound} onNavigate={onNavigate} />
      )}

      {/* STUDY */}
      {studyCode !== undefined && studyCode !== "" && (
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
