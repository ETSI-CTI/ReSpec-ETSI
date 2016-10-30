
// Module core/equation
// Handles figures in the document. This encompasses two primary operations. One is
// converting some old syntax to use the new HTML5 figure and figcaption elements
// (this is undone by the unhtml5 plugin, but that will soon be phased out). The other
// is to enable the generation of a Table of Figures wherever there is a #tof element
// to be found as well as normalise the titles of figures.

define(
    [],
    function () {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "etsi/equations");

                // process all equations
                var eqMap = {}, num = 0;
                $("div.equation").each(function () {
                    var $e = $(this), id;
   
                    num++;
                    
                    id = $e.makeID("eq", num.toString());
                    eqMap[id] = num;

                    $e.prepend('<p>(' + num +')</p>');
                });

                // Update all anchors with empty content that reference a figure ID
                $("a[href^=#]", doc).each(function () {
                    var $a = $(this)
                    ,   id = $a.attr("href");
                    if (!id) return;
                    id = id.substring(1);
                    if (eqMap[id]) {
                        $a.addClass("fig-ref");
                        $a.html(conf.l10n.equation + ' ' + eqMap[id]);
                    }
                });

                msg.pub("end", "etsi/equations");
                cb();
            }
        };
    }
);
