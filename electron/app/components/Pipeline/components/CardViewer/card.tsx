import React, { useEffect, useRef, useState } from "react";
import isDev from "electron-is-dev";
import { fileExists } from "./utils";
import novartis from "../../../../images/pipeline/novartis.svg";
import styles from "./index.module.scss";

type Props = {
  index: number;
  type: string;
  file: string;
  compound: string;
  code: string;
};

const Card: React.FC<Props> = ({ index, type, file, compound, code }: Props) => {
  const [source, setSource] = useState("loading");
  const isMounted = useRef(false);
  const fileRef = useRef("new");

  const checkSource = async (): Promise<void> => {
    let src = "";

    const path = isDev ? "images/pipeline/cards" : "dist/images/pipeline/cards";
    if (file !== "") {
      if (type === "Compounds") {
        src = `${path}/compounds/${file}`;
      } else if (type === "MOA") {
        src = `${path}/moas/${file}`;
      } else if (type === "Studies") {
        src = `${path}/studies/${file}`;
      }
    }

    const s = await fileExists(src);
    if (isMounted.current) {
      setSource(s);
    }
  };

  if (fileRef.current !== file) {
    checkSource();
    fileRef.current = file;
  }

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  const logoClass = type === "MOA" ? styles.logoShort : styles.logo;
  const cardClass = type === "MOA" ? styles.moa : styles.card;

  let imgClass = styles.imageCompound;
  if (type === "MOA") {
    imgClass = styles.imageMOA;
  } else if (type === "Studies") {
    imgClass = styles.imageStudy;
  }

  return (
    <div className={cardClass} style={{ left: `${index * 100}%` }}>
      {source === "error" ? (
        <div>
          <img className={logoClass} src={novartis} alt="novartis" />
          {type === "Compounds" && (
            <div>
              <div className={styles.info}>
                A Novartis medical representative can provide more information about <b>{compound}</b>.
              </div>

              <div className={styles.info}>
                For clinical trial information, explore the <br />
                content to the right.
              </div>
            </div>
          )}

          {type === "Studies" && (
            <div>
              <div className={styles.info}>
                A Novartis medical representative can provide more information about <b>{code}</b>.
              </div>

              <div className={styles.info}>
                For information about the compound(s), explore the <br />
                content to the left.
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>{source !== "loading" ? <img src={source} className={imgClass} alt={file} /> : <div />}</div>
      )}
    </div>
  );
};

export default Card;
