"use strict";
// this is only set in a build, not at all in the dev environment
require.config({
  shim: {
    shortcut: {
      exports: "shortcut"
    },
    Promise: {
      exports: "Promise"
    },
  },
  paths: {
    "fetch": "/node_modules/whatwg-fetch/fetch",
    "handlebars": "/node_modules/handlebars/dist/handlebars",
    "jquery": "/node_modules/jquery/dist/jquery",
    "marked": "/node_modules/marked/lib/marked",
    "Promise": "/node_modules/promise-polyfill/promise",
    "webidl2": "/node_modules/webidl2/lib/webidl2",
  },
  deps: [
    "fetch",
    "jquery",
    "Promise",
    "core/jquery-enhanced",
  ],
});

define([
    // order is significant
    "domReady",
    "core/base-runner",
    "core/ui",
    "core/include-config",
    "core/override-configuration",
    "core/default-root-attr",
    "etsi/l10n",
    "core/markdown",
    "core/style",
    "etsi/style",
    "etsi/headers",
    "etsi/abstract",
    "etsi/conformance",
    "core/data-transform",
    "core/data-include",
    "etsi/inlines",
    "core/dfn",
    "etsi/rfc2119",
    "core/examples",
    "core/issues-notes",
    "core/requirements",
    "core/highlight",
    "core/best-practices",
    "core/figures",
    "etsi/equations",
    "core/biblio",
    "core/webidl-contiguous",
    "core/webidl-oldschool",
    "core/link-to-dfn",
    "core/contrib",
    "core/fix-headers",
    "core/structure",
    "etsi/informative",
    "etsi/permalinks",
    "core/id-headers",
    "core/rdfa",
    "etsi/aria",
    "core/shiv",
    "core/remove-respec",
    "core/location-hash",
    "etsi/etsi-style",
    "ui/about-respec",
    "ui/dfn-list",
    "ui/save-html",
    "ui/search-specref",
  ],
  function(domReady, runner, ui) {
    var args = Array.from(arguments);
    domReady(function() {
      
//      window.respecConfig["rootHtml"]= "file:///C:/Users/filatov/Work/NWM/CTILab/respec/etsi";
      window.respecConfig["rootHtml"]= "http://ctilab.etsiqa.org/js/data";

      ui.addCommand("Save Snapshot", "ui/save-html", "Ctrl+Shift+Alt+S");
      ui.addCommand("About ReSpec", "ui/about-respec", "Ctrl+Shift+Alt+A");
      ui.addCommand("Definition List", "ui/dfn-list", "Ctrl+Shift+Alt+D");
      ui.addCommand("Search Specref DB", "ui/search-specref", "Ctrl+Shift+Alt+space");
      runner
        .runAll(args)
        .then(document.respecIsReady)
        .then(ui.show)
        .then(function (){
          parent.$('body').trigger( 'respecDone' )
        })
        .catch(function(err){
          console.error(err);
          // even if things go critically bad, we should still try to show the UI
          ui.show();
        })
    });
  }
);
