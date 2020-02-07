import React, { useEffect, useState } from "react";
import { styleForScale } from "./utils";
import Pipeline from "../Pipeline/components/App";
import styles from "./index.module.scss";

const App: React.FC = () => {
  const [scale, setScale] = useState(window.innerWidth / 1920);
  const { screenWidth: width, screenHeight: height, transform } = styleForScale(scale);

  useEffect(() => {
    document.addEventListener("RESIZE", () => {
      setScale(window.innerWidth / 1920);
    });
  }, []);

  return (
    <div className={styles.container} style={{ width, height, transform }}>
      <Pipeline home="Content/Tumors" idlePaths={[]} isActive />
    </div>
  );
};

export default App;
