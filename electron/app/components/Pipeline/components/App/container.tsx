import React, { useContext } from "react";
import { PipelineContext, IdlePath } from "../../state";
import { styleForScale } from "./utils";
// import { Idler, IdlerTouch } from "../Idler";
import styles from "./index.module.scss";

type Props = { home: string; idlePaths: IdlePath[]; isActive: boolean };

const App: React.FC<Props> = ({ home, idlePaths, isActive }: Props) => {
  const { scale } = useContext(PipelineContext);
  const { screenWidth: width, screenHeight: height, transform } = styleForScale(scale);

  return (
    <div className={styles.container} style={{ width, height, transform }}>
      {/* <Idler delay={120} /> */}
      <div>{home}</div>
      <div>{idlePaths}</div>
      <div>{isActive}</div>
    </div>
  );
};

export default App;
