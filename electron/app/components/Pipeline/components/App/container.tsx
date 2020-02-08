import React from "react";
// import { IdlePath } from "../../state";
// import { Idler } from "../Idler";
import Header from "../AppHeader";
import Definitions from "../Definitions";
import styles from "./index.module.scss";

const AppContainer: React.FC = () => (
  <div className={styles.container}>
    {/* {idlePaths.length > 0 && <Idler paths={idlePaths} />} */}
    <Header />
    <Definitions />
  </div>
);

export default AppContainer;
