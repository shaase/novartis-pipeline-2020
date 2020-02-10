import React, { useRef, useState } from "react";
import { TweenMax } from "gsap";
import { uniqBy } from "lodash";
import { hierarchy, pack } from "d3-hierarchy";
import { forceSimulation, forceManyBody, forceCollide } from "d3-force";
import { PipelineItem, Bubble } from "../../types";
import { flattenStudies } from "../../data";
import { colorForBackground, itemsForPath } from "../../utils";
import Bubbles from "./bubbles";
import styles from "./index.module.scss";

/* D3.js JavaScript library copyright 2017 Mike Bostock. */

const empty = {
  id: "",
  path: "",
  fill: "rgba(255,0,0,0)",
  color: "rgba(255,0,0,0)",
  value: 0,
  r: 0,
};

type Props = {
  isVisible: boolean;
  items: PipelineItem[];
  path: string;
  width: number;
  height: number;
  onNavigate: (definedPath: string, definedCompound?: string, idling?: boolean) => void;
};

const BubbleChart: React.FC<Props> = ({ isVisible, items, path, width, height, onNavigate }: Props) => {
  const [nodes, setNodes] = useState<Bubble[]>([]);
  const groups = useRef<SVGGElement[]>([]);
  const circles = useRef<SVGGElement[]>([]);
  const refGroup = useRef<SVGGElement | null>(null);
  const refCircle = useRef<SVGCircleElement | null>(null);
  const pathRef = useRef("");

  const handleSelect = (node: Bubble): void => {
    const { root, level } = itemsForPath(node.path);
    const compound = (root === "Compounds" && level === 3) || (root === "Tumors" && level === 7) ? node.id : undefined;
    onNavigate(node.path, compound);
  };

  const animate = (n: Bubble[]): void => {
    n.forEach(({ x, y, r }, i) => {
      if (groups.current[i] !== undefined && circles.current[i] !== undefined) {
        const opacity = r === 0 ? 0 : 1;
        TweenMax.to(groups.current[i], 0.5, { x, y, opacity });
        TweenMax.to(circles.current[i], 0.5, { attr: { r } });
      }
    });
  };

  const filterItems = (n: Bubble[]): void => {
    const filtered: Bubble[] = n.filter((b: Bubble) => b.id !== undefined && b.id !== "hidden");

    for (let i = filtered.length; i < 50; i += 1) {
      filtered.push({ ...empty, x: width / 2, y: height / 2 });
    }

    setNodes(filtered);

    if (groups.current.length >= 50) {
      animate(filtered);
    } else {
      setTimeout(() => {
        animate(filtered);
      }, 1000);
    }
  };

  const updateItems = (): void => {
    const children = items
      .map(
        (item: PipelineItem): Bubble => {
          const studies =
            item.studies !== undefined ? item.studies : uniqBy(flattenStudies(item.children || []), "nct");
          return {
            id: item.type || "",
            path: item.path || "",
            fill: item.color || "#222222",
            color: item.color || "#222222",
            value: studies.length,
            r: 0,
            x: 0,
            y: 0,
          };
        },
      )
      .filter((item: Bubble) => item.value > 0)
      .sort((a, b) => b.value - a.value);

    const editedWidth = children.length > 5 ? width + 100 : width - 100;

    const chartPack = pack()
      .size([editedWidth, height])
      .padding(4);

    const root = hierarchy({ children })
      .sum(d => d.value) // eslint-disable-line
      .each(d => {
        if (d.data.id !== undefined) {
          d.id = d.data.id;
          d.fill = d.data.color || "#000000";
          d.path = d.data.path;
          d.color = colorForBackground(d.data.color, "#FFFFFF");
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

    const bubbles: Bubble[] =
      children.length > 5 ? [...(chartPack(root).children || []), left, right, bottom] : chartPack(root).children;

    const mod = width < 600 ? 2 : 10;
    const sim = forceSimulation(bubbles)
      .force("charge", forceManyBody().strength(20))
      .force(
        "collision",
        forceCollide().radius((d: Bubble) => d.r + mod),
      )
      .stop();

    const ticks = Math.ceil(Math.log(sim.alphaMin()) / Math.log(1 - sim.alphaDecay()));

    for (let i = 0; i < ticks; i += 1) {
      sim.tick();
    }

    if (isVisible) {
      filterItems(bubbles);
    }
  };

  if (pathRef.current !== path) {
    updateItems();
    pathRef.current = path;
  }

  let svgClass = styles.svg;
  if (isVisible) {
    if (
      path === "Content/Tumors/Heme/Malignant" ||
      path === "Content/Tumors/Heme/Malignant/Lymphoma" ||
      path === "Content/Compounds/Targeted/Eltrombopag" ||
      path === "Content/Compounds/CAR-T/Tisagenlecleucel" ||
      path === "Content/Compounds/Targeted/Asciminib"
    ) {
      svgClass = styles.svgFew;
    } else if (path === "Content/Compounds/CAR-T/CTL119") {
      svgClass = styles.svgFewCTL119;
    }
  }
  // TODO: hook into groups and circles refs to add to array
  return (
    <div className={isVisible ? styles.bubbles : styles.bubblesHidden}>
      <Bubbles
        items={nodes}
        svgClass={svgClass}
        path={path}
        width={width}
        height={height}
        refGroup={refGroup}
        refCircle={refCircle}
        onSelect={handleSelect}
      />
    </div>
  );
};

export default BubbleChart;
