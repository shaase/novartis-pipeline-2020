import React, { useContext } from "react";
import { DefinitionsContext } from "../../state";
import { CardType } from "../../types";
import styles from "./index.module.scss";

type Props = { cards?: CardType[] };

const Bottom: React.FC<Props> = ({ cards }: Props) => {
  const { onToggleDefs } = useContext(DefinitionsContext);
  return (
    <div className={cards === undefined ? styles.bottom : styles.bottomMOA}>
      <button
        className={styles.btnDef}
        onClick={() => {
          // TODO: IdleTouch
          onToggleDefs();
        }}
      >
        DEFINITIONS
      </button>

      <div className={styles.definitions}>
        All compounds are either investigational or being studied for (a) new use(s). Efficacy and safety have not been
        established.
        <br />
        There is no guarantee that they will become commercially available for the use(s) under investigation.
        {cards !== undefined && (
          <div className={styles.moaDisclaimer}>
            MOA data are based on in vitro/in vivo data. Clinical benefit is unknown.
          </div>
        )}
      </div>
    </div>
  );
};

export default Bottom;
