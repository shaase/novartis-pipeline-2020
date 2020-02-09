import React from "react";
import styles from "./index.module.scss";

type Props = { title: string };

// TODO: find alternative to danger
const StudyTitle: React.FC<Props> = ({ title }: Props) => (
  <div key={title} className={styles.btnTitle} dangerouslySetInnerHTML={{ __html: title }} /> // eslint-disable-line
);

export default StudyTitle;
