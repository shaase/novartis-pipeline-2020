declare module "*.png";
declare module "*.jpg";
declare module "*.svg";
declare module "*.mp4";
declare module "*.mp3";
declare module "radius-utils";
declare module "radius-electron";
declare module "svg-mesh-3d";
declare module "three-simplicial-complex";

declare module "*.module.scss" {
  interface ClassNames {
    [className: string]: string;
  }
  const classNames: ClassNames;
  export = classNames;
}

interface Window {
  storeDataPath: string;
  wsServerIP: string;
}
