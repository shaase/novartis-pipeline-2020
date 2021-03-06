import React, { useRef, useState } from "react";
import { PipelineItem, RowItem } from "../../types";
import { colorForBackground } from "../../utils";
import RowTitle from "./row-title";
import styles from "./list.module.scss";

type Props = {
  path: string;
  section: PipelineItem;
  onNavigate: (definedPath: string, definedCompound?: string, idling?: boolean) => void;
};

const CompoundList: React.FC<Props> = ({ path, section, onNavigate }: Props) => {
  const [items, setItems] = useState<RowItem[]>([]);
  const pathRef = useRef("");

  if (pathRef.current !== path) {
    const rowItems = (section.children || []).reduce((arr: RowItem[], child: PipelineItem) => {
      const title = child.type || "";
      const item: RowItem = {
        color: child.color || "#222222",
        path: child.path || "Content/Tumors",
        title,
        className: "compound",
      };
      return [...arr, item];
    }, []);

    setItems(rowItems);
    pathRef.current = path;
  }

  return (
    <div className={styles.tableFlex}>
      {React.Children.toArray(
        items.map((item: RowItem) => (
          <button
            type="button"
            className={styles[item.className]}
            style={{
              backgroundColor: item.color,
              color: colorForBackground("#FFFFFF", item.color),
            }}
            onClick={() => {
              const compound = item.path.split("/").length - 1 === 3 ? item.title : undefined;
              onNavigate(item.path, compound);
            }}
          >
            <RowTitle title={item.title} />
          </button>
        )),
      )}
    </div>
  );
};

export default CompoundList;
