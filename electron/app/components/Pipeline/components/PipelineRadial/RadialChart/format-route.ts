import { RadialNode } from "../../../types";

interface Route {
  route: string;
  derivedCompound: string | undefined;
}

const formatRoute = (node: RadialNode, pathRoot: string, level: number): Route => {
  const { name, parent, isStudyContainer } = node;
  let { route } = node;
  route =
    isStudyContainer && route.includes("Content/Tumors")
      ? route
          .split("/")
          .slice(0, -1)
          .join("/")
      : route;

  let derivedCompound;
  if (pathRoot === "Compounds") {
    if (level === 3) {
      derivedCompound = name;
    } else if (level === 4) {
      derivedCompound = parent.name;
    } else if (level === 5) {
      derivedCompound = parent.parent.name;
    }
  } else if (isStudyContainer) {
    derivedCompound = name;
  } else if (level === 7) {
    derivedCompound = parent.name;
  }

  return { route, derivedCompound };
};

export default formatRoute;
