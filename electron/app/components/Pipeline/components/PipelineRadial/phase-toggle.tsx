import React, { useContext } from "react";
import { defaultPhases } from "../../data";
import { FilterContext } from "../../state";
import checkOn from "../../../../images/pipeline/phase-check-on.svg";
import checkOff from "../../../../images/pipeline/phase-check-off.svg";
import styles from "./phases.module.scss";

const labels = ["I", "I/II", "II", "III"];

type CheckProps = {
  value: number;
  label: string;
  phases: number[];
  onClick: (n: number) => void;
};

const PhaseToggle: React.FC = () => {
  const { phases, onTogglePhase } = useContext(FilterContext);
  return (
    <div className={styles.toggle}>
      <div className={styles.buttons}>
        {React.Children.toArray(
          defaultPhases.map((phase, i) => (
            <button value={1} onClick={() => onTogglePhase(phase)} className={styles.check}>
              <img src={!phases.includes(phase) ? checkOff : checkOn} />
              <span>{`Phase ${labels[i]}`}</span>
            </button>
          )),
        )}
      </div>
    </div>
  );
};

export default PhaseToggle;
