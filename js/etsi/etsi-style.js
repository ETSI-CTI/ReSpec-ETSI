// Module etsi/etsi-style
"use strict";
define(
    ["core/utils"
    ,"text!etsi/css/etsi.css"],
    function(utils, css) {
      return {
        run: function(conf, doc, cb, msg) {
          msg.pub("start", "etsi/etsi-style");
          // insert  etsi.css
          $(doc).find("head link").first().before($("<style/>").text(css));
          $("p.NO").addClass('note');
          $(doc).find("body").css('background-image', 'none');
          msg.pub("end", "etsi/etsi-style");
          cb();
        }
      };
    }
);
