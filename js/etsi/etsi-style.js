// Module etsi/etsi-style
"use strict";
define(
    ["core/utils"],
    function(utils) {
      return {
        run: function(conf, doc, cb, msg) {
          msg.pub("start", "etsi/etsi-style");
          utils.linkCSS(doc, conf.rootHtml + "/etsi.css");
          $("p.NO").addClass('note');
          msg.pub("end", "etsi/etsi-style");
          cb();
        }
      };
    }
);
