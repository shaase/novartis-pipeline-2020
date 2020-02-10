// web worker
import { sectionsForTable } from "../../data";

self.addEventListener(
  "message",
  e => {
    const { path, phases } = e.data;
    const sections = sectionsForTable(path, phases);
    const allChildren = sections.reduce((a, b) => a.concat(b.children || []), []);

    self.postMessage({ sections, allChildren });
  },
  false,
);
