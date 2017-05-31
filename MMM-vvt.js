/* global Module */

/* Magic Mirror
 * Module: MMM-vvt
 *
 * By Benjamin Kostner 
 */

Module.register("MMM-vvt", {
	defaults: {
		vvtid: "",
        refresh: 1,
        minentries: 6,
        maxentries: 6
	},

    getStyles: function() {
        return ['mmm-vvt.css'];
    },

	getDom: function() {
        console.log(this.fahrplandaten);
        var plan = document.createElement("DIV");
        //plan.id = "vvt-" + ;

    
        var title = document.createElement("header");
        title.className = "medium";
        plan.appendChild(title);

        if (!this.fahrplandaten) {
            title.innerText = "Lade Fahrplan...";
            return plan;
        }
        f = this.fahrplandaten.Fahrten
        title.innerText = f.HaltName;
        
        table = document.createElement("TABLE");
        table.className = "small";
        plan.appendChild(table);
        for (i = 0; i < f.Fahrt.length && i < this.config.maxentries; i++) {
            var d = f.Fahrt[i];
            row = document.createElement("TR");
            table.appendChild(row);
            
            row.appendChild(this._cell(d.LinienText, "bright"));
            row.appendChild(this._cell(d.RichtungsText, "light"));
            if (d.AbfahrttInMinuten < 60) {
                row.appendChild(this._cell(d.AbfahrttInMinuten + "'", "bright departure-time"));
            } else {
                row.appendChild(this._cell(d.AbfahrtInStunden + "'", "bright departure-time"));
            }
            
            // console.log(f.Fahrt[i]); 
        }
        for (var i = 0; i < this.config.maxentries - f.Fahrt.length; i++) {
            row = document.createElement("TR");
            table.appendChild(row);
            for (var j = 0; j < 3; j++) {
                td = document.createElement("TD");
                td.innerText = "-"
                row.appendChild(td); 
            }
        }
        
		return plan;
	},

    _cell: function(text, cssClass) {
        td = document.createElement("TD");
        td.innerText = text;
        if (cssClass) {
            td.className = cssClass;
        }
        return td;
    },

    start: function() {
        Log.info('Starting module: ' + this.name);
        Log.info(this.config);
        this.loaded = false;
        this.sendSocketNotification('CONFIG', this.config);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "STARTED") {
            // nichts? 
        } else if (notification === "DATA") {
            if (payload.vvtid == this.config.vvtid) {
                this.fahrplandaten = payload.data;
                this.updateDom();
            }
        }
    }
});
