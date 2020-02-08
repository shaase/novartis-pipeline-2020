import { uniqBy } from "lodash";
import { flattenChildren, flattenCombos } from "./utils";
import { itemsForPath } from "../utils";
import { content } from "./loaded-json";
import { PipelineItem, PipelineStudy } from "../types";

// TODO: update calls for phases coming before compound
export const dataForBubbles = (routePath: string, phases: number[], compound?: string): PipelineItem[] => {
  const { root, level, studyCode } = itemsForPath(routePath);
  const arrRoute = routePath.split("/");
  const items = content[root].children || [];
  const editedArr = studyCode === undefined ? arrRoute : arrRoute.slice(0, -1);
  let editedPath = editedArr.join("/");

  const data = items.reduce((arr: PipelineItem[], item: PipelineItem) => {
    if (root === "Tumors") {
      editedPath = editedArr.slice(0, 6).join("/");
      // HEME
      if (item.children !== undefined && item.children[0].type !== undefined) {
        let hemes: PipelineItem[] = [];
        item.children.forEach((heme: PipelineItem) => {
          (heme.children || []).forEach((heme2: PipelineItem) => {
            const tumors = (heme2.children || [])
              .map((child: PipelineItem) => {
                let subs = (child.children || []).filter(
                  (sub: PipelineItem) => sub.path !== undefined && sub.path.includes(routePath),
                );

                subs = subs
                  .map((sub: PipelineItem) => {
                    const studies = (sub.studies || []).filter((study: PipelineStudy) => phases.includes(study.phase));
                    return { ...sub, studies };
                  })
                  .filter((sub: PipelineItem) => (sub.studies || []).length > 0);

                const { color, path } = child;
                const type = child.type || heme2.type;
                return { type, color, path, children: subs };
              })
              .filter((child: PipelineItem) => (child.children || []).length > 0);

            if (level < 4) {
              const { type, color, path } = heme2;
              hemes = [...hemes, { type, color, path, children: tumors }];
            } else {
              hemes = [...hemes, ...tumors];
            }
          });
        });

        return arr.concat(hemes.filter((child: PipelineItem) => (child.children || []).length > 0));
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
              let studies = sub.studies; // eslint-disable-line
              if (compound !== undefined) {
                studies = (studies || []).filter((study: PipelineStudy) => study.target === compound);
              }

              studies = (studies || []).filter((study: PipelineStudy) => phases.includes(study.phase));

              const { type, color, path } = sub;
              return { type, color, path, studies };
            })
            .filter(
              (sub: PipelineItem) =>
                sub.path !== undefined && sub.path.includes(routePath) && (sub.studies || []).length > 0,
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

      return arr.concat(children);
    }

    // COMPOUNDS

    if (level < 7) {
      const filtered = (item.children || []).filter(
        (child: PipelineItem) =>
          child.path !== undefined && (child.path.includes(editedPath) || editedPath.includes(child.path)),
      );
      const children = flattenCombos(filtered, editedPath, phases);

      if (children.length === 1) {
        const filtered2 = (children[0].children || []).filter(
          (child: PipelineItem) =>
            child.path !== undefined && (child.path.includes(editedPath) || editedPath.includes(child.path)),
        );

        // console.log(filtered2); // compound > down
        return arr.concat(filtered2);
      }

      // console.log(children); // all | cat
      return arr.concat(children);
    }

    if (item.path !== undefined && routePath.includes(item.path)) {
      const flattened = flattenChildren(item.children || []);
      const children = flattened.filter(
        (child: PipelineItem) => child.path !== undefined && editedPath.includes(child.path),
      );

      let { studies } = children[0];

      studies = (studies || []).filter((study: PipelineStudy) => phases.includes(study.phase));

      const itm = { ...children[0], studies: uniqBy(studies, "nct") };
      return arr.concat([itm]);
    }
    return arr;
  }, []);

  return data;
};
