const { remote } = require("electron");
const fs = require("fs");
const csv = require("fast-csv");
const { getPersistent, setPersistent } = require("radius-electron");
const { metrics } = require("../store");

let metricsPath;
let csvFile;
let writer;

const record = ({ detail: metric }) => {
  if (metricsPath !== undefined) writer.write(metric);
};

const setMetrics = async () => {
  const { key: storeKey, defaultPath, headers: definedHeaders } = metrics;
  metricsPath = getPersistent(storeKey);

  if (metricsPath === undefined) {
    const options = { title: "Save Metrics File", defaultPath };
    metricsPath = remote.dialog.showSaveDialogSync(null, options);

    if (metricsPath !== undefined) {
      setPersistent(storeKey, metricsPath);
    }
  }

  if (csvFile === undefined) {
    const fileExists = fs.existsSync(metricsPath);
    csvFile = fs.createWriteStream(metricsPath, { flags: "a" });

    if (fileExists) csvFile.write("\n");
    writer = csv.format({ headers: !fileExists });
    writer.pipe(csvFile);

    if (!fileExists) writer.write(definedHeaders);
  }

  document.addEventListener("METRICS", record);
};

module.exports = { setMetrics };
