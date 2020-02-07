import React, { useContext } from "react";
import { PipelineContext } from "../../state";
import BreadCrumbs from "./breadcrumbs";
import home from "../../../../images/pipeline/home.svg";
import imgBack from "../../../../images/pipeline/back.svg";
import imgNext from "../../../../images/pipeline/next.svg";
import novartis from "../../../../images/pipeline/novartis.svg";
import styles from "./index.module.scss";

const AppHeader: React.FC = () => {
  const { path, compound, history, nextHistory, onNavigate, onBack, onNext, onReset } = useContext(PipelineContext);

  return (
    <div className={styles.header}>
      <button className={styles.home} onClick={onReset}>
        <img src={home} />
      </button>

      <button className={styles.back} style={{ opacity: history.length > 1 ? 1 : 0.6 }} onClick={onBack}>
        <img src={imgBack} />
      </button>

      <button className={styles.next} style={{ opacity: nextHistory.length > 0 ? 1 : 0.6 }} onClick={onNext}>
        <img src={imgNext} />
      </button>

      <div className={styles.novartis}>
        <img src={novartis} />
      </div>

      <h1 className={styles.title}>PRODUCTS IN DEVELOPMENT</h1>

      <div className={styles.crumbs}>
        <BreadCrumbs path={path} compound={compound} onNavigate={onNavigate} />
      </div>
    </div>
  );
};

export default AppHeader;
