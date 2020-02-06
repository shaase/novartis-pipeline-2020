import React, { useContext } from "react";
import { AppContext } from "../../state";
import { styleForScale } from "./utils";
import { Idler, IdlerTouch } from "../Idler";
import styles from "./index.module.scss";

const App: React.FC = () => {
  const { scale, index, back, next } = useContext(AppContext);
  const { screenWidth: width, screenHeight: height, transform } = styleForScale(scale);

  return (
    <div className={styles.container} style={{ width, height, transform }}>
      <Idler delay={120} />
      <div className={styles.heading}>W2O Electron App</div>
      <div className={styles.appIndex}>{index}</div>

      <button onClick={back} className={styles.button}>
        Back
      </button>
      <button onClick={next} className={styles.button}>
        Next
      </button>
      <button onClick={IdlerTouch} className={styles.button}>
        Touch
      </button>
    </div>
  );
};

export default App;
