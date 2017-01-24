#!/usr/local/bin/node

"use strict";
const async = require("marcosc-async");
const Builder = require("./builder-etsi").Builder;
const path = require("path");
const colors = require("colors");

colors.setTheme({
  data: "grey",
  debug: "cyan",
  error: "red",
  help: "cyan",
  info: "green",
  input: "grey",
  prompt: "grey",
  verbose: "cyan",
  warn: "yellow",
});

const buildETSI = async(function*() {
  let versionsToBuild = Array.from(arguments);
  if (!versionsToBuild.length){
    versionsToBuild.push("latest");
  }
  const builds = path.join(__dirname, "../builds");
  for(let aVersion of versionsToBuild){
    const isLatest = aVersion === "latest";
    const version = (isLatest) ? yield Builder.getRespecVersion() : aVersion;
    const outFile = "respec-etsi-common" + ((isLatest) ? ".js" : `-${aVersion}.js`);
    const out = path.join(builds, outFile);
    console.log(colors.info(`  ⏲  Generating ${outFile}. Please wait...`));
    yield Builder.build({out, version});
  }
});

if (require.main === module) {
  buildETSI("latest")
    .catch((err) => console.log(colors.error(err.stack)));
}

exports.buildW3C = buildETSI;
