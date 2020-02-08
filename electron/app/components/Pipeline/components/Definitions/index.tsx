import React, { useContext } from "react";
import { DefinitionsContext } from "../../state";
import bg from "../../../../images/pipeline/definitions.png";
import close from "../../../../images/pipeline/collapse.svg";
import styles from "./index.module.scss";

const Definitions: React.FC = () => {
  const { isVisible, onToggleDefs } = useContext(DefinitionsContext);
  // TODO: handle idler reset
  return (
    <div className={styles[`modal-${isVisible}`]}>
      <button className={styles[`shader-${isVisible}`]} onClick={onToggleDefs}>
        <img className={styles.btnClose} src={close} />
      </button>
      <img className={styles[`defs-${isVisible}`]} src={bg} />
    </div>
  );
};

export default Definitions;
