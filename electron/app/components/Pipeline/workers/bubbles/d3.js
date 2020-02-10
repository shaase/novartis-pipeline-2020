// web worker
import { uniqBy } from "lodash";
import { hierarchy, pack } from "d3-hierarchy";
import { forceSimulation, forceManyBody, forceCollide } from "d3-force";
import { flattenStudies } from "../../data";
import { colorForBackground } from "../../utils";

/* D3.js JavaScript library copyright 2017 Mike Bostock. */

const empty = {
  id: "",
  path: "",
  fill: "rgba(255,0,0,0)",
  color: "rgba(255,0,0,0)",
  value: 0,
  r: 0,
};

const filterBubbles = (nodes, width, height) => {
  const filtered = nodes.filter(node => node.id !== undefined && node.id !== "hidden");

  for (let i = filtered.length; i < 50; i += 1) {
    filtered.push({ ...empty, x: width / 2, y: height / 2 });
  }

  return filtered;
};

const packBubbles = (items, width, height) => {
  const children = items
    .map(item => {
      const studies = item.studies !== undefined ? item.studies : uniqBy(flattenStudies(item.children), "nct");
      return {
        id: item.type,
        value: studies.length,
        color: item.color,
        path: item.path,
      };
    })
    .filter(item => item.value > 0)
    .sort((a, b) => b.value - a.value);

  const editedWidth = children.length > 5 ? width + 100 : width - 100;

  const chartPack = pack()
    .size([editedWidth, height])
    .padding(4);

  const root = hierarchy({ children })
    .sum(d => d.value)
    .each(d => {
      if (d.data.id !== undefined) {
        /* eslint-disable*/ // disabling re-assign warning for d3 handling
        d.id = d.data.id;
        d.fill = d.data.color || "#000000";
        d.path = d.data.path;
        d.color = colorForBackground("#FFFFFF", d.data.color);
        /* eslint-enable */
      }
    });

  const left = {
    id: "hidden",
    fill: "#000000",
    path: "hidden",
    color: "#000000",
    value: 2000,
    r: 2000,
    x: -1980,
    y: 380,
  };

  const right = {
    ...left,
    x: 2455,
  };

  const bottom = {
    ...left,
    r: 300,
    x: 250,
    y: 1040,
  };

  const bubbles = children.length > 5 ? [...chartPack(root).children, left, right, bottom] : chartPack(root).children;

  const mod = width < 600 ? 2 : 10;
  const sim = forceSimulation(bubbles)
    .force("charge", forceManyBody().strength(20))
    .force(
      "collision",
      forceCollide().radius(d => d.r + mod),
    )
    .stop();

  const ticks = Math.ceil(Math.log(sim.alphaMin()) / Math.log(1 - sim.alphaDecay()));

  for (let i = 0; i < ticks; i += 1) {
    sim.tick();
  }

  return bubbles;
};

const getBubbles = (data, width, height) => {
  const bubbles = packBubbles(data, width, height);
  const filtered = filterBubbles(bubbles, width, height);
  return filtered;
};

export default getBubbles;
