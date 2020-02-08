// @flow

import React, { useEffect, useState } from "react";
import { colorForBackground } from "../../utils";
import { PipelineItem, PipelineStudy } from "../../types";
import phased from "./phased-studies";
import styles from "./index.module.scss";
import icon from "../../../../images/pipeline/print.svg";

type Props = { category: string; compound?: string };

const phasedStudies = (item: PipelineItem): string => {
  let html = "";
  const { color = "#222222" } = item;
  const phases = phased(item);
  phases.forEach((phase, index) => {
    const { title, studies } = phase;
    html += `<div class="phase"`;
    html += `style="border:1px solid ${color};`;
    html += index < phases.length - 1 ? `border-bottom:none;` : "";
    html += `">`;

    html += `<h5 style="`;
    html += `">${title}</h5>`;

    html += `<div class="studies"`;
    html += `style="border-left:1px solid ${color};`;
    html += `">`;
    studies.forEach((study: PipelineStudy) => {
      html += `<div class="study">`;
      const { title: name } = study;
      html += `<h6 style="color:${colorForBackground(color, color)};`;
      html += `">>${name}</h6>`;
      html += `</div>`;
    });

    html += `</div></div>`;
  });

  return html;
};

const PanelHeader: React.FC<Props> = ({ category, compound }: Props) => {
  // const { path } = useContext(PipelineContext);
  const [printableData, setPrintableData] = useState<PipelineItem[]>([]);

  const onPrintStudies = (): void => {
    const { type, children, studies } = printableData[0];

    let html = `<h3 style="color: #333333;`;

    if (children !== undefined) {
      html += `">${type}</h3>`;
      children.forEach((sub: PipelineItem) => {
        const { type: subtype } = sub;

        if (subtype !== undefined) {
          html += `<h4 style="color: #333333;`;
          html += `">${subtype}</h4>`;
        }

        html += phasedStudies(sub);
      });
    } else if (studies !== undefined) {
      if (compound === undefined) {
        html += `">${type}</h3>`;
      } else {
        const edited = compound.replace(/<sup.*>.*?<\/sup>/gi, "");
        html += `">${edited} in ${type}</h3>`;
      }

      html += phasedStudies(printableData[0]);
    }

    // TODO: handle printing
    // ipcRenderer.send("print", html);
    console.log(html);
  };

  useEffect(() => {
    if (category === "Study") {
      // eslint-disable-next-line
      document.addEventListener("PRINTABLE_STUDIES", (e: any) => {
        setPrintableData(e.detail.data);
      });
    }
  }, []);
  return (
    <div className={styles.header}>
      <div className={styles.title}>{`Explore by ${category}`}</div>

      {category === "Study" && printableData.length > 0 && (
        <button className={styles.print} onClick={onPrintStudies}>
          <img src={icon} />
        </button>
      )}
    </div>
  );
};

export default PanelHeader;
