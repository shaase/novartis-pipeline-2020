import React from "react";
import PhaseToggle from "./phase-toggle";
import styles from "./index.module.scss";

type Card = { file: string; label: string };

type Props = { cards: Card[] };

const RadialHeader: React.FC<Props> = ({ cards }: Props) => (
  <div>
    <div className={styles.header}>{cards.length === 0 ? "Explore the Pipeline" : "Mechanism of Action"}</div>
    {cards.length === 0 && <PhaseToggle />}
  </div>
);

export default RadialHeader;
