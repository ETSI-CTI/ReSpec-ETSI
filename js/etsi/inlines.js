
// Module core/inlines
// Process all manners of inline information. These are done together despite it being
// seemingly a better idea to orthogonalise them. The issue is that processing text nodes
// is harder to orthogonalise, and in some browsers can also be particularly slow.
// Things that are recognised are <abbr>/<acronym> which when used once are applied
// throughout the document, [[REFERENCES]]/[[!REFERENCES]], and RFC2119 keywords.
// CONFIGURATION:
//  These options do not configure the behaviour of this module per se, rather this module
//  manipulates them (oftentimes being the only source to set them) so that other modules
//  may rely on them.
//  - normativeReferences: a map of normative reference identifiers.
//  - informativeReferences: a map of informative reference identifiers.
//  - respecRFC2119: a list of the number of times each RFC2119
//    key word was used.  NOTE: While each member is a counter, at this time
//    the counter is not used.

define(
    [],
    function () {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "etsi/inlines");
                doc.normalize();
                var abbrSection = doc.getElementById("abbreviations");
                if(abbrSection){
                    var abbrMap = {};
                    var $as = $(abbrSection);

                    $("abbr[title]", doc).each(function () { abbrMap[$(this).text()] = $(this).attr("title"); });
                    $("acronym[title]", doc).each(function () { abbrMap[$(this).text()] = $(this).attr("title"); });

                    // get abbreviations from the section
                    $as.children("p").each(function(){
                        var a = $(this).text();
                        var i = a.indexOf('\xa0'); // &nbsp;
                        if(i > 0){
                            abbrMap[a.substring(0,i)] = a.substr(i).trim();
                        }
                    });
                    var aKeys = [];
                    for (var k in abbrMap) aKeys.push(k);
                    aKeys.sort();

                    // Fill in abbreviation section
                    $as.empty();
                    $("<h2>Abbreviations</h2>").appendTo($as);
                    var $t = $("<table style='width:100%;'></table>");
                    for (var i in aKeys) {
                        var k = aKeys[i];
                        $("<tr><td style='white-space:nowrap;'><abbr title='"+abbrMap[k]+"'>"+k+"</abbr></td><td style='width: 99%;'>"+abbrMap[k]+"</td></tr>").appendTo($t);
                    }
                    $as.append($t);
		}
                msg.pub("end", "core/inlines");
                cb();
            }
        };
    }
);
