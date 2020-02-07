import React, { useContext } from "react";
import { PipelineContext, IdlePath } from "../../state";
// import { Idler, IdlerTouch } from "../Idler";
import styles from "./index.module.scss";

type Props = { home: string; idlePaths: IdlePath[]; isActive: boolean };

const App: React.FC<Props> = ({ home, idlePaths, isActive }: Props) => {
  const { scale } = useContext(PipelineContext);

  return (
    <div className={styles.container}>
      {/* <Idler delay={120} /> */}
      <div>{home}</div>
      <div>{idlePaths}</div>
      <div>{isActive}</div>
    </div>
  );
};

export default App;
