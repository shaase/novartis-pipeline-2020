// config store managing window/panel info, metrics and sockets

const panel = {
  key: "Novartis_Pipeline_2020_Panel_Key",
  values: [],
  orientations: [],
};

// remove to disable metrics
// const metrics = {
//   key: "Novartis_Pipeline_2020_Metrics_Key",
//   prompt: "Save Metrics File",
//   defaultPath: "~/metrics.csv",
//   headers: ["time", "action"],
// };

// remove to disable sockets
// const sockets = {
//   key: "Novartis_Pipeline_2020_Sockets_Key",
//   port: "8080",
// };

module.exports = { panel };
