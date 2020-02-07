export interface PathItems {
  level: number;
  root: string;
  studyCode?: string;
}

export const itemsForPath = (path: string): PathItems => {
  const arr = path.split("/");
  const level = arr.length - 1;
  const root = arr[1];
  const isStudy = path.includes("NCT") || path.includes("CCTL") || path.includes("CHDM") || path.includes("CABL");
  const studyCode = isStudy ? arr[arr.length - 1] : undefined;

  return { level, root, studyCode };
};

export const slicePath = (path: string, index: number): string =>
  path
    .split("/")
    .slice(0, index)
    .join("/");
