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
            "GS"    : "etsi_gs",    // ETSI Group Specification
            "GR"    : "etsi_gr",    // ETSI Group Report 
            "SR"    : "etsi_sr",    // ETSI Special Report
            "TR"    : "etsi_tr",    // ETSI Technical Report
            "TS"    : "etsi_ts"     // ETSI Technical Specification
        };
/*
        ,   etsiWIStatus: { [
                // 0
                 { text: "Creation of WI by WG/TB", subStatusText: {
                       a  : "TB adoption of WI",
                       ga : "WI accepted by WG",
                       gn : "WI noted to WG",
                       gp : "WI proposed by WG",
                       gr : "WI rejected by WG",
                       n  : "WI noted by TB",
                       p  : "WI proposed to TB",
                       r  : "WI rejected by TB",
                       w  : "WI proposal withdrawn",
                 }},
                 // 1
                 { text: "Start of work",subStatusText: {}},
                 // 2
                 { text: "Early draft",  subStatusText: {}},
                 // 3
                 { text: "Unknown",      subStatusText: {}},
                 // 4
                 { text: "Stable draft", subStatusText: {}},
                 // 5
                 { text: "Stable draft processing",   subStatusText: {
                       AA : "Start of pre-processing",
                       AB : "End of pre-processing",
                       P  : "Suspend work",
                       Q  : "Resume work",
                       S  : "User defined",
                 }},
                 // 6
                 { text: "Final draft for approval",   subStatusText: {
                       AA : "Start of pre-processing",
                       AB : "End of pre-processing",
                 }},
                 // 7
                 { text: "WG approval",   subStatusText: {
                       A  : "Start of TB approval process",
                       AA : "Start of pre-processing",
                       AB : "End of pre-processing",
                       B  : "End of TB approval process",
                       S  : "SRDoc enquiry",
                 }},
                 // 8
                 { text: "TB approval",   subStatusText: {
                       A  : "Draft receipt by ETSI Secretariat",
                       AA : "Start of pre-processing",
                       AB : "End of pre-processing",
                       WA : "Waiting - see 'Remarks'",
                 }},
                 // 9
                "9 AA"	: "Start of pre-processing",
                "9 AB"	: "End of pre-processing",
                "9 B"	: "Start of Approval Procedure",
                "9 B"	: "Start of Public Enquiry",
                "9 C"	: "End of Approval Procedure",
                "9 C"	: "End of Public Enquiry",
                "9 D"	: "Start of TB review of AP comments",
                "9 D"	: "Start of TB review of PE comments",
                "9 Da"	: "TB approval after review of AP comments",
                "9 Da"	: "TB approval after review of PE comments",
                "9 DaA"	: "Start of TB approval process",
                "9 DaB"	: "End of TB approval process",
                "9 Dr"	: "Draft review after PE",
                "9 E	: "Draft receipt by ETSI Secretariat",
                "9 WE	: "Waiting - see 'Remarks'",
                "10 AA	: "Start of pre-processing",
                "10 AB	: "End of pre-processing",
                "10 F	: "Start of Vote",
                "10 FM	: "Start of Membership Vote",
                "10 G	: "End of Vote",
                "10 GM	: "End of Membership Vote",
                "10 H	: "Vote result determination (rejected)",
                "10 J	: "TB chairman informed",
                "11	: "Vote result determination (adopted)",
                "11 WI	: "Waiting - see 'Remarks'",
                "12	: "Completion",
                "12	: "Publication",
                "12 V	: "Delivery to the EC",
                "12 W	: "Citation in the OJ",
                "12 WU	: "Date of withdrawal (dow)",
                "13	: "TB decision to make document historical",
                "30	: "Withdrawal proposal verified",
                "35	: "Withdrawal proposal TB approved",
                "40	: "Start of Withdrawal Vote",
                "40	: "Start of Membership Withdrawal Vote",
                "45	: "End of Withdrawal Vote",
                "45	: "End of Membership Withdrawal Vote",
                "50	: "Withdrawn",
*/

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
