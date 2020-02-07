import React, { useRef, useState } from "react";
import { itemsForPath } from "../../utils";
import styles from "./breadcrumbs.module.scss";

type Props = {
  name: string;
  path: string;
  root: string;
  onSelect: (s: string) => void;
};

const Crumb: React.FC<Props> = ({ name, path, root, onSelect }: Props) => {
  const [isVisible, setVisible] = useState(false);
  const className = isVisible ? styles.btnNav : styles.btnNavHidden;
  const pathRef = useRef(path);

  if (pathRef.current !== path) {
    pathRef.current = path;
    const arr = path.split("/");
    setVisible(name !== "" && root === arr[1]);
  }

  return (
    <button
      className={className}
      onClick={() => {
        const { studyCode } = itemsForPath(name);
        if (studyCode === undefined) {
          onSelect(path);
        }
      }}
    >
      {name.replace(/#/g, "/")}
    </button>
  );
};

export default Crumb;
