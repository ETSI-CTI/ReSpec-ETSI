/*global respecEvents */

// Module etsi/utils
// As the name implies, this contains a ragtag gang of methods that just don't fit
// anywhere else.
"use strict";
define(
    [],
    function () {
        const _etsiDelivery = "http://www.etsi.org/deliver/";
        
        const docTypeFolders = {
            "EG"    : "etsi_eg",    // ETSI Guide
            "EN"    : "etsi_en",    // European Standard
            "ES"    : "etsi_es",    // ETSI Standard
            "ETR"   : "etsi_etr",   // ETSI Technical Report
            "GS"    : "etsi_gs",    // Group Specification
            "GTS"   : "etsi_gts",   // GSM Technical Specification
            "I-ETS" : "etsi_i_ets", // European Telecommunication Standard
            "NET"   : "etsi_net",   // Norme Européenne de Télécommunication
            "SR"    : "etsi_sr",    // Special Report
            "TBR"   : "etsi_tbr",   // TECHNICAL BASIS for REGULATION
            "TCRTR" : "etsi_tcrtr", // ETSI TECHNICAL COMMITTEE REFERENCE TECHNICAL REPORT
            "TR"    : "etsi_tr",    // Technical Report
            "TS"    : "etsi_ts"     // Technical Specification
        };

        function _split100(p) {
            var ret = "";
            var i;
            for(i=p.length; i>3; i-=3){
                ret = p.substring(i-3, i) + ' ' + ret;
            }
            if(i > 0) {
                ret = p.substring(0, i) + ' ' + ret;
            }
            return ret.trim();
        }

        var utils = {
            // --- SET UP
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "etsi/utils");
                msg.pub("end", "etsi/utils");
                cb();
            }
        ,   splitToThousands: function(p) {
                return _split100(p);
            }
        ,   etsiDeliveryUrl: function(specType, specIndex, specVersion, specStatus) {
                var s;
                let m = specIndex.indexOf('-');
                if(m>0) {
                     s = specIndex.slice(0,m-2);
                     let u = specIndex.slice(m+1);
                     specIndex = specIndex.slice(0,m) + ((u<10)?'0':'') + u;
                }else{
                     s = specIndex.slice(0,-2);
                }

                let av = specVersion.toString().split('.');
                for(let i=0; i<av.length; i++){
                    let t=av[i]; av[i] = t<=9 ? '0'+t : t;
                }
                return _etsiDelivery 
                    + 'etsi_' + specType.toLowerCase() + '/'
                    + s + '00_' + s + '99/'
                    + specIndex + '/'
                    + av.join('.') + '_60/'
                    + specType.toLowerCase() + '_' + specIndex +'v' + av.join('') + 'p.pdf';
            }
        ,   etsiShortName: function(specType, specIndex) {
                let m = specIndex.indexOf('-');
                var s = specIndex;
                var e;
                if(m > 0){
                    s = specIndex.substring(0, m);
                    e = specIndex.substring(m);
                }
                return specType + ' ' +  _split100(s) + ((m>0)?e:'');
            }
        };
        return utils;
    }
);
