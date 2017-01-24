#!/usr/local/bin/node

"use strict";
const async = require("marcosc-async");
const fsp = require("fs-promise");
const pth = require("path");
const r = require("requirejs");

/**
 * Finds the name of the map file generated by Requirejs, and replaces it
 * with one that matches the filename of the ReSpec output file.
 *
 * @param  {String} respecJs The source for ReSpec, as produced by Requirejs.
 * @param  {String} outPath The path for the ReSpec source output file.
 * @return {Object} An object with a updated `source` and the new filename for
 *                  the map file.
 */
function replaceMapFilename(respecJs, outPath){
  const basename = pth.basename(outPath, ".js");
  const newMapFilename = basename + ".build.js.map";
  var source = respecJs;
  var m = respecJs.match(/\/\/# sourceMappingURL=(.+)/);
  if(m && typeof m[1] !== 'undefined') {
    source = respecJs.replace(m[1], newMapFilename);
  }
  const mapPath = pth.resolve(outPath, `../${newMapFilename}`);
  return {
    source,
    mapPath,
  };
}

 /**
 * Async function that appends the boilerplate to the generated script
 * and writes out the result. It also creates the source map file.
 *
 * @private
 * @param  {String} outPath Where to write the output to.
 * @param  {String} version The version of the script.
 * @return {Promise} Resolves when done writing the files.
 */
function appendBoilerplate(outPath, version) {
  return async(function*(optimizedJs, sourceMap) {
    const respecJs = `"use strict";
/* ReSpec ${version}
Created by Robin Berjon, http://berjon.com/ (@robinberjon)
Documentation: http://w3.org/respec/.
See original source for licenses: https://github.com/w3c/respec */
window.respecVersion = "${version}";
${optimizedJs}
require(['profile-etsi-common']);`;
    const newSource = replaceMapFilename(respecJs, outPath);
    const promiseToWriteJs = fsp.writeFile(outPath, newSource.source, "utf-8");
    const promiseToWriteMap = fsp.writeFile(newSource.mapPath, sourceMap, "utf-8");
    yield Promise.all([promiseToWriteJs, promiseToWriteMap]);
  }, Builder);
}

var Builder = {
  /**
   * Async function that gets the current version of ReSpec from package.json
   *
   * @returns {Promise<String>} The version string.
   */
  getRespecVersion: async(function*() {
    const path = pth.join(__dirname, "../package.json");
    const content = yield fsp.readFile(path, "utf-8");
    return JSON.parse(content).version;
  }),

  /**
   * Async function runs Requirejs' optimizer to generate the output.
   *
   * using a custom configuration.
   * @param  {[type]} options [description]
   * @return {[type]}         [description]
   */
  build(options) {
    return async.task(function*() {
      // optimisation settings
      const version = options.version || (yield this.getRespecVersion());
      const outputWritter = appendBoilerplate(options.out, version);
      const config = {
        generateSourceMaps: true,
        mainConfigFile: "js/profile-etsi-common.js",
        baseUrl: pth.join(__dirname, "../js/"),
        optimize: options.optimize || "uglify2",
        paths: {
          "fetch": "../node_modules/whatwg-fetch/fetch",
          "handlebars": "../node_modules/handlebars/dist/handlebars",
          "jquery": "../node_modules/jquery/dist/jquery",
          "marked": "../node_modules/marked/lib/marked",
          "Promise": "../node_modules/promise-polyfill/promise",
          "requireLib": "../node_modules/requirejs/require",
          "webidl2": "../node_modules/webidl2/lib/webidl2",
        },
        name: "profile-etsi-common",
        deps: [
          "core/jquery-enhanced",
          "jquery",
          "Promise",
          "requireLib",
        ],
        inlineText: true,
        preserveLicenseComments: false,
        useStrict: true,
      };
      const promiseToWrite = new Promise((resolve, reject)=>{
        config.out = (optimizedJs, sourceMap) => {
          outputWritter(optimizedJs, sourceMap)
            .then(resolve)
            .catch(reject);
        };
      });
      r.optimize(config);
      yield promiseToWrite;
    }, this);
  },
};

exports.Builder = Builder;