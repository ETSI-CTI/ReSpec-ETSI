
// Module etsi/conformance
// Handle the conformance section properly.

define(
    ["tmpl!etsi/templates/conformance.html"],
    function (confoTmpl) {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "etsi/conformance");
                var $confo = $("#conformance");
                if ($confo.length) $confo.prepend(confoTmpl(conf));
                msg.pub("end", "etsi/conformance");
                cb();
            }
        };
    }
);
