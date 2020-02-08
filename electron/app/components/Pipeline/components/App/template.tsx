import React, { useContext } from "react";
import { PipelineContext } from "../../state";
import styles from "./index.module.scss";

const TEMPLATE: React.FC = () => {
  const { path } = useContext(PipelineContext);
  return (
    <div className={styles.container}>
      <h1>{path}</h1>
    </div>
  );
};

export default TEMPLATE;
