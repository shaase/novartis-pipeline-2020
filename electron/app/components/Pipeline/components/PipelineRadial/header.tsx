import React from "react";
import PhaseToggle from "./phase-toggle";
import styles from "./index.module.scss";

type Card = { file: string; label: string };

type Props = { cards?: Card[] };

const RadialHeader: React.FC<Props> = ({ cards }: Props) => (
  <div>
    <div className={styles.header}>{cards === undefined ? "Explore the Pipeline" : "Mechanism of Action"}</div>
    {cards === undefined && <PhaseToggle />}
  </div>
);

export default RadialHeader;
