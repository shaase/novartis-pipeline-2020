import React, { useRef, useState } from "react";
import { uniqBy } from "lodash";
import { PipelineItem, PipelineStudy, RowItem } from "../../types";
import { colorForBackground, itemsForPath, hexToRgb } from "../../utils";
import { flattenToContainers } from "../../data";
import getType from "./get-type";
import StudyTitle from "./study-title";
import styles from "./index.module.scss";

type Props = {
  path: string;
  nct: string;
  flexRows: boolean;
  section: PipelineItem;
  onNavigate: (definedPath: string, definedCompound?: string, idling?: boolean) => void;
};

const TumorList: React.FC<Props> = ({ path, nct, flexRows, section, onNavigate }: Props) => {
  const [items, setItems] = useState<RowItem[]>([]);
  const pathRef = useRef("");
  const flexRef = useRef(false);

  console.log(path, flexRows);

  if (pathRef.current !== path || flexRef.current !== flexRows) {
    const { level } = itemsForPath(path);
    const type = getType(level, path);

    const rowItems = (section.children || []).reduce((arr: RowItem[], child: PipelineItem) => {
      const cohorts = uniqBy(flattenToContainers(child.children || []), "type");
      const title = `<b>${child.type}</b> [${cohorts.length}]`;
      let className = type === "Root" || type === "ShortList" ? "buttonHeader" : "buttonHeaderLarge";

      if (child.type !== undefined && child.type.length > 40) {
        className = "buttonHeader";
      }

      let subClassName = type === "LongList" ? "buttonSub" : "buttonSubPadded";

      if (flexRows && level < 4) {
        if (!path.includes("Content/Tumors/Heme/")) {
          className = "buttonHeaderFlex";
        }

        subClassName = "buttonSubFlex";
      }

      let compoundClassName = type === "LongList" ? "buttonList" : "buttonListPadded";

      if (flexRows) {
        compoundClassName = "buttonListFlex";
      }

      console.log(className, subClassName);

      const item: RowItem = {
        color: child.color || "#222222",
        path: child.path || "Content/Tumors",
        indent: 16,
        title,
        isStudyContainer: false,
        lighten: nct !== "",
        className,
      };

      let children: RowItem[] = [];

      if (type !== "Root") {
        (child.children || []).forEach((sub: PipelineItem) => {
          let lighten = false;

          const compounds: RowItem[] = (sub.children || []).map((cpd: PipelineItem) => {
            const cpdClass = compoundClassName;
            const indent = sub.type === undefined ? 28 : 34;
            if (nct !== "") {
              const filtered = (cpd.studies || []).filter((std: PipelineStudy) => std.nct === nct);
              lighten = filtered.length === 0;
            }

            const cpdPath = cpd.path || "";
            const trunc = cpd.isStudyContainer
              ? cpdPath
                  .split("/")
                  .slice(0, -1)
                  .join("/")
              : cpdPath;

            const compoundItem: RowItem = {
              color: sub.color || child.color || "#222222",
              path: trunc,
              isStudyContainer: true,
              title: cpd.type || "",
              lighten,
              indent,
              className: cpdClass,
              children,
            };

            return compoundItem;
          });

          if (sub.type !== undefined) {
            const subItem: RowItem = {
              color: sub.color || child.color || "#222222",
              path: sub.path || "Content/Tumors",
              title: sub.type,
              isStudyContainer: false,
              indent: 30,
              lighten,
              className: subClassName,
            };
            children = [...children, subItem];
          }

          children = [...children, ...compounds];
        });
      }

      return [...arr, item, ...children];
    }, []);

    setItems(rowItems);
    pathRef.current = path;
    flexRef.current = flexRows;
  }

  return (
    <div className={flexRows ? styles.fullFlex : styles.full}>
      {React.Children.toArray(
        items.map((item: RowItem) => (
          <button
            type="button"
            className={styles[item.className]}
            style={{
              backgroundColor: `rgba(${hexToRgb(item.color)}, ${item.isStudyContainer ? 0.8 : 1})`,
              paddingLeft: item.indent,
              color: colorForBackground("#FFFFFF", item.color),
            }}
            onClick={() => {
              const compound = item.isStudyContainer ? item.title : undefined;
              onNavigate(item.path, compound);
            }}
          >
            {item.title !== undefined && <StudyTitle title={item.title} />}

            {item.lighten && <div className={styles.fader} />}
          </button>
        )),
      )}
    </div>
  );
};

export default TumorList;
