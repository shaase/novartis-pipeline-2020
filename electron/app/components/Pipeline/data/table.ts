import { getStudyContainers, flattenStudies } from "./utils";
import { itemsForPath } from "../utils";
import { PipelineItem, PipelineStudy } from "../types";
import { content } from "./loaded-json";

let prevRoutePath = "";
let prevSections: PipelineItem[] = [];
let prevPhases: number[] = [];

const rowItemForTable = (routePath: string, sectionType: string, phases: number[]): PipelineItem => {
  if (routePath !== prevRoutePath || phases !== prevPhases) {
    const { root, level, studyCode } = itemsForPath(routePath);
    const items = content[root].children;
    const arrRoute = routePath.split("/");
    const editedArr = studyCode === undefined ? arrRoute : arrRoute.slice(0, -1);
    let editedPath = editedArr.join("/");

    const sections = (items || []).reduce((arr: PipelineItem[], item: PipelineItem) => {
      if (root === "Tumors") {
        editedPath = editedArr.slice(0, 6).join("/");
        // HEME
        if (item.children !== undefined && item.children[0].type !== undefined) {
          let hemes: PipelineItem[] = [];
          item.children.forEach((heme: PipelineItem) => {
            let children: PipelineItem[] = [];
            (heme.children || []).forEach((heme2: PipelineItem) => {
              const tumors = (heme2.children || [])
                .map((child: PipelineItem) => {
                  const subs = (child.children || [])
                    .map((sub: PipelineItem) => {
                      const containers = getStudyContainers(child, sub, phases);
                      const { type, color, path } = sub;
                      return { type, color, path, children: containers };
                    })
                    .filter(
                      (sub: PipelineItem) =>
                        sub.path !== undefined &&
                        sub.path.includes(routePath) &&
                        sub.children !== undefined &&
                        sub.children.length > 0,
                    );

                  subs.forEach((sub, i) => {
                    if (sub.type === undefined) {
                      subs.splice(i, 1);
                      subs.unshift(sub);
                    }
                  });

                  const { color, path } = child;
                  const type = child.type || heme2.type;
                  return { type, color, path, children: subs };
                })
                .filter((child: PipelineItem) => (child.children || []).length > 0);

              children = [...children, ...tumors];
            });

            const { type, color, path } = heme;
            hemes = [...hemes, { type, color, path, children }];
          });

          return arr.concat(hemes);
        }

        // SOLID TUMOR & RARE DISEASE
        const solidRare =
          item.children !== undefined &&
          item.children[0].children !== undefined &&
          item.children[0].children[0].children !== undefined
            ? item.children[0].children[0].children
            : [];

        const children = solidRare
          .map((child: PipelineItem) => {
            const subs = (child.children || [])
              .map((sub: PipelineItem) => {
                const { type, color, path } = sub;
                const containers = getStudyContainers(child, sub, phases);
                return { type, color, path, children: containers };
              })
              .filter(
                (sub: PipelineItem) =>
                  sub.path !== undefined &&
                  sub.path.includes(routePath) &&
                  sub.children !== undefined &&
                  sub.children.length > 0,
              );

            subs.forEach((sub, i) => {
              if (sub.type === undefined) {
                subs.splice(i, 1);
                subs.unshift(sub);
              }
            });

            const { type, color, path } = child;
            return { type, color, path, children: subs };
          })
          .filter((child: PipelineItem) => (child.children || []).length > 0);

        const { type, color, path } = item;
        return arr.concat([{ type, color, path, children }]);
      }

      // COMPOUNDS
      const { type, color, path } = item;
      if (level < 3) {
        const children = (item.children || []).filter((child: PipelineItem) => {
          const studies = flattenStudies(child.children || []).filter((study: PipelineStudy) =>
            phases.includes(study.phase),
          );

          return child.path !== undefined && child.path.includes(editedPath) && studies.length > 0;
        });

        return arr.concat([{ type, color, path, children }]);
      }

      return arr.concat([{ type, color, path, children: [] }]);
    }, []);

    prevRoutePath = routePath;
    prevSections = sections;
    prevPhases = phases;
  }

  return prevSections.filter((section: PipelineItem) => section.type === sectionType)[0];
};

export const sectionsForTable = (routePath: string, phases: number[]): PipelineItem[] => {
  const { root } = itemsForPath(routePath);
  const items = content[root].children;

  const sections = (items || []).reduce((arr: PipelineItem[], item: PipelineItem): PipelineItem[] => {
    // HEME
    if (root === "Tumors" && item.children !== undefined && item.children[0].type !== undefined) {
      const children = (item.children || []).map((child: PipelineItem) => {
        const { type, color, path } = child;
        return { type, color, path };
      });

      return arr.concat(children);
    }

    // SOLID TUMOR & COMPOUNDS
    const { type, color, path } = item;
    return arr.concat([{ type, color, path }]);
  }, []);

  const arr = routePath.split("/");
  const trunc = arr[1] === "Tumors" ? arr.slice(0, 7).join("/") : routePath;

  return sections.map((sec: PipelineItem) => rowItemForTable(trunc, sec.type || "", phases));
};
