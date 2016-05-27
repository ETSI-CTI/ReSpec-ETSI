
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

                if (!conf.normativeReferences) conf.normativeReferences = {};
                if (!conf.informativeReferences) conf.informativeReferences = {};
                if (!conf.respecRFC2119) conf.respecRFC2119 = {};

                // PRE-PROCESSING
                var abbrMap = {}, acroMap = {};
                var aKeys = [];
                $("abbr[title]", doc).each(function () { abbrMap[$(this).text()] = $(this).attr("title"); });
                $("acronym[title]", doc).each(function () { acroMap[$(this).text()] = $(this).attr("title"); });

                var abbrSection = doc.getElementById("abbreviations");
                if(abbrSection){
                    var $as = $(abbrSection);
                    // get abbreviations from the section
                    $as.children("p").each(function(){
                        var a = $(this).text();
                        var i = a.indexOf('\xa0'); // &nbsp;
                        if(i > 0){
                            abbrMap[a.substring(0,i)] = a.substr(i).trim();
                        }
                    });
                    for (var k in abbrMap) aKeys.push(k);
                    for (var k in acroMap) aKeys.push(k);
                    aKeys.sort();
                    // Fill in abbreviation section
                    $as.empty();
                    $("<h2>Abbreviations</h2>").appendTo($as);
                    var $t = $("<table style='width:100%;'></table>");
                    for (var i in aKeys) {
                        var k = aKeys[i];
                        if(abbrMap[k]) {
                            $("<tr><td style='white-space:nowrap;'><abbr title='"+abbrMap[k]+"'>"+k+"</abbr></td><td style='width: 99%;'>"+abbrMap[k]+"</td></tr>").appendTo($t);
                        }else{
                            $("<tr><td style='white-space:nowrap;'><acronym title='"+acroMap[k]+"'>"+k+"</acronym></td><td style='width: 99%;'>"+acroMap[k]+"</td></tr>").appendTo($t);
                        }
                    }
                    $as.append($t);
		}
                
                var abbrRx = aKeys.length ? "(?:\\b" + aKeys.join("\\b)|(?:\\b") + "\\b)" : null;

                // PROCESSING
                var txts = $("body", doc).allTextNodes(["pre"]);
                var rx = new RegExp("(\\bMUST(?:\\s+NOT)?\\b|" +
                                     "\\bSHOULD(?:\\s+NOT)?\\b|" +
                                     "\\bSHALL(?:\\s+NOT)?\\b|" +
                                     "\\bWILL(?:\\s+NOT)?\\b|" +
                                     "\\bCAN(?:NOT)?\\b|" +
                                     "\\bMAY\\b|" +
                                     "\\bNEED\\s+NOT\\b|" +
                                     "(?:\\[\\[(?:!|\\\\)?[A-Za-z0-9\\.-]+\\]\\])" + 
                                     ( abbrRx ? "|" + abbrRx : "") + ")", "i");
                for (var i = 0; i < txts.length; i++) {
                    var txt = txts[i];
                    var subtxt = txt.data.split(rx);
                    if (subtxt.length === 1) continue;

                    var df = doc.createDocumentFragment();
                    while (subtxt.length) {
                        var t = subtxt.shift();
                        var matched = null;
                        if (subtxt.length) matched = subtxt.shift();
                        df.appendChild(doc.createTextNode(t));
                        if (matched) {
                            // ETSI Drafting Rules
                            if (/MUST(?:\s+NOT)?/i.test(matched)) {
                                matched = matched.split(/\s+/).join(" ");
                                df.appendChild($("<em/>").attr({ "class": "edr-error", title: "Words MUST and MUST NOT are NOT allowed in ETSI deliverables except when used in direct citation" }).text(matched)[0]);
                            }else if (/SHOULD(?:\s+NOT)?|SHALL(?:\s+NOT)?|WILL(?:\s+NOT)?|CAN(?:NOT)?|MAY|NEED\sNOT/i.test(matched)) {
                                matched = matched.split(/\s+/).join(" ");
                                df.appendChild($("<em/>").attr({ "class": "rfc2119 edr-modal", title: matched }).text(matched)[0]);
                                // remember which ones were used
                                conf.respecRFC2119[matched] = true;
                            }
                            // BIBREF
                            else if (/^\[\[/.test(matched)) {
                                var ref = matched;
                                ref = ref.replace(/^\[\[/, "");
                                ref = ref.replace(/\]\]$/, "");
                                if (ref.indexOf("\\") === 0) {
                                    df.appendChild(doc.createTextNode("[[" + ref.replace(/^\\/, "") + "]]"));
                                }
                                else {
                                    var norm = false;
                                    if (ref.indexOf("!") === 0) {
                                        norm = true;
                                        ref = ref.replace(/^!/, "");
                                    }
                                    // contrary to before, we always insert the link
                                    if (norm) conf.normativeReferences[ref] = true;
                                    else      conf.informativeReferences[ref] = true;
                                    df.appendChild(doc.createTextNode("["));
                                    df.appendChild($("<cite/>").wrapInner($("<a/>").attr({"class": "bibref", href: "#bib-" + ref}).text(ref))[0]);
                                    df.appendChild(doc.createTextNode("]"));
                                }
                            }
                            // ABBR
                            else if (abbrMap[matched]) {
                                if ($(txt).parents("abbr").length) df.appendChild(doc.createTextNode(matched));
                                else df.appendChild($("<abbr/>").attr({ title: abbrMap[matched] }).text(matched)[0]);
                            }
                            // ACRO
                            else if (acroMap[matched]) {
                                if ($(txt).parents("acronym").length) df.appendChild(doc.createTextNode(matched));
                                else df.appendChild($("<acronym/>").attr({ title: acroMap[matched] }).text(matched)[0]);
                            }
                        }
                    }
                    txt.parentNode.replaceChild(df, txt);
                }
                msg.pub("end", "etsi/inlines");
                cb();
            }
        };
    }
);
