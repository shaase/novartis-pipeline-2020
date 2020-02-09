import React from "react";
// import { IdlePath } from "../../state";
// import { Idler } from "../Idler";
import Header from "../AppHeader";
import PipelineTable from "../PipelineTable";
import Definitions from "../Definitions";
import Lightbox from "../Lightbox";
import styles from "./index.module.scss";

const AppContainer: React.FC = () => (
  <div className={styles.container}>
    {/* {idlePaths.length > 0 && <Idler paths={idlePaths} />} */}

    <div className={styles.pipeline}>
      <Header />
      <div className={styles.panels}>
        <PipelineTable />
        {/* RADIAL */}
        {/* BUBBLES */}
        <Definitions />
        <Lightbox />
      </div>
    </div>
  </div>
);

export default AppContainer;
