"use strict";

const NodeHelper = require("node_helper");
var request = require('request');


module.exports = NodeHelper.create({
    
    log: function(outstr) {
        console.log("[MMM-vvt] " + outstr);
    },

    debug: function(outstr) {
        // console.debug("[MMM-vvt] " + outstr);
    },

    start: function () {
        var self = this;
        self.log("Starte Modul");
        this.started = true;
        this.widgetmap = { }
        setTimeout(function() { self.getData(); }, 6 * 1000);
    },

    timeSec: function() {
        return Math.floor(new Date().getTime() / 1000);
    },

    getData: function() {
        var timenow = this.timeSec(); 
        this.debug("Checking, if new data needs to be loaded [ts:" + timenow + "]...");
        for (var vvtid in this.widgetmap) {
            var d = this.widgetmap[vvtid];
            this.debug("vvtid: " + vvtid)
            this.debug("   refresh every " + (d.refreshrate * 60) + "s");
            if (d.lastrefresh == 0) { 
                this.debug("   lastrefresh: never");
            } else {
                this.debug("   lastrefresh: " + (timenow - d.lastrefresh) + "s ago");
            }
            if (timenow - d.lastrefresh > 60 * d.refreshrate) {
                this.loadData(vvtid);
            }
        }
        var self = this;
        setTimeout(function() { self.getData(); }, 6 * 1000);
    },

    loadData: function(vvtid) {
        var myUrl = "https://www.vvt.at/modules/airfeed.cfc?method=getScheduleData&show=" + vvtid;
        this.log("Loading from URL: " + myUrl);
         
        var self = this;
        request({
            url: myUrl,
            method: 'GET',
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                self.widgetmap[vvtid].lastrefresh = self.timeSec(); 
                var sendData = {
                    vvtid: vvtid,
                    data: JSON.parse(body)
                };
                self.sendSocketNotification("DATA", sendData);
            }
        });
    },

    socketNotificationReceived: function(notification, payload) {
        // var self = this;
        if (notification === 'CONFIG') {
            this.log("Adding VVT ID: " + payload.vvtid);
            this.widgetmap[payload.vvtid] = {
                "refreshrate": payload.refresh,
                "lastrefresh": 0
            }
        }
    }
});


