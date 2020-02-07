import React from "react";
import ReactDOM from "react-dom";
import { initPersistent } from "radius-electron";
import HMR from "./index-hot";

initPersistent(window.storeDataPath);

ReactDOM.render(<HMR />, document.getElementById("root"));
