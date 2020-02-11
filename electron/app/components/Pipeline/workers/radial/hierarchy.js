import { hierarchy, partition as d3partition } from "d3-hierarchy";
import { colorForBackground } from "../../utils";

/* D3.js JavaScript library copyright 2017 Mike Bostock. */

const setHierarchy = data => {
  const flatRoot = {};
  const root = hierarchy(data)
    .sum(d => d.size)
    .each(d => {
      /* eslint-disable */

      d.isStudyContainer = d.data.isStudyContainer || false;
      if (d.parent === null) {
        // ROOT NODE
        d.name = d.data.name;
        d.fill = "#FFFFFF";
        d.route = d.name;
        d.color = "#FFFFFF";
        d.isEmpty = false;
      } else if (d.parent.name === "root") {
        // TUMORS OR COMPOUNDS NODE (FIRST LEVEL)
        d.name = ""; //d.data.name;
        d.fill = d.data.color;
        d.route = d.data.path;
        d.color = d.data.color;
        d.isEmpty = false;
      } else if (d.data.name !== undefined) {
        d.name = d.data.name;
        d.route = d.data.path;
        d.fill = d.data.color;
        d.color = colorForBackground(d.data.color, "#FFFFFF");

        d.isEmpty =
          d.data.path === "Content/Tumors/Solid Tumors" ||
          d.data.path === "Content/Tumors/Rare Disease" ||
          d.data.path === "Content/Tumors/Heme/Malignant/B-cell Malignancy" ||
          d.data.path === "Content/Tumors/Heme/Malignant/BPDCN" ||
          (d.data.name === "*" && d.depth > 3 && d.data.path.includes("Content/Tumors"));
      } else {
        // STUDY NODES
        d.name = d.data.nct;
        d.fill = d.data.color;
        d.route = d.data.path;
        d.phase = d.data.phase;
        d.color = "#FFFFFF";
        d.isEmpty = false;
      }

      if (d.route === "Content/Tumors/Solid Tumors/*") {
        d.name = "Solid Tumors";
      }

      if (d.route === "Content/Tumors/Rare Disease/*") {
        d.name = "Rare Disease";
      }

      const nodeRoute = d.route || "";

      if (
        nodeRoute.includes("Content/Tumors/Heme/Malignant/Lymphoma/Non-Hodgkin") &&
        d.name.includes("Hodgkin") &&
        d.depth === 6
      ) {
        d.name = "NHL";
      }

      flatRoot[nodeRoute] = d;

      /* eslint-enable */
    });

  const partition = d3partition();
  partition(root);

  return { flatRoot, root };
};

export default setHierarchy;
