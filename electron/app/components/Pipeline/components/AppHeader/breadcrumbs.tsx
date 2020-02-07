import React from "react";
import Crumb from "./crumb";
import { studiesForPath } from "../../data";
import styles from "./breadcrumbs.module.scss";

const em = { name: "", path: "" };
const defaultCrumbs = [em, em, em, em, em, em, em, em, em, em];

type Props = {
  path: string;
  compound?: string;
  onNavigate: (s: string) => void;
};

const BreadCrumbs: React.FC<Props> = ({ path, compound, onNavigate }: Props) => {
  let routePath = path;
  const studies = studiesForPath(path, "nct", compound);
  if (studies.length === 1) {
    routePath = studies[0].path;
  }

  const arr = routePath.split("/");
  const reversed = routePath.split("/").slice(2);
  const root = arr[1];

  if (root === "Compounds" && arr.length > 7) {
    arr.splice(5, 2);
    reversed.splice(3, 2);
  } else if (root === "Compounds" && arr.length > 6) {
    arr.splice(5, 1);
    reversed.splice(3, 1);
  }

  const crumbs = [...defaultCrumbs]
    .map((_, i) => {
      if (i < reversed.length) {
        const name = reversed[i];
        if (name !== "Content" && name !== "*") {
          const route = arr.slice(0, i + 3).join("/");
          return { name, path: route };
        }
      }

      return { name: "", path: "" };
    })
    .reverse();

  const tumorClass = root === "Tumors" ? styles.btnRoot : styles.btnRootOther;
  const compoundClass = root === "Compounds" ? styles.btnRoot : styles.btnRootOther;

  return (
    <div className={styles.container}>
      {root === "Tumors" && (
        <button className={compoundClass} onClick={() => onNavigate("Content/Compounds")}>
          by MECHANISM
        </button>
      )}

      {React.Children.toArray(
        crumbs.map(({ name, path: cPath }) => <Crumb name={name} path={cPath} root="Tumors" onSelect={onNavigate} />),
      )}

      {React.Children.toArray(
        crumbs.map(({ name, path: cPath }) => (
          <Crumb name={name} path={cPath} root="Compounds" onSelect={onNavigate} />
        )),
      )}

      {root === "Compounds" && (
        <button className={compoundClass} onClick={() => onNavigate("Content/Compounds")}>
          by MECHANISM
        </button>
      )}

      <button className={tumorClass} onClick={() => onNavigate("Content/Tumors")}>
        by TUMOR TYPE
      </button>
    </div>
  );
};

export default BreadCrumbs;
