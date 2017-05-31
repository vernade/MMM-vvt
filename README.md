# MMM-vvt
VVT Departures for MagicMirror

Departures of busses, trams and trains within Tyrol, Austria.
This includes public transport services of VVT (Verkehrsverbund Tirol) and IVB (Innsbrucker Verkehrsbetriebe).

Configuration:
```
config: {    
    vvtid: "<generated ID>",  // generated ID, see below
    refresh: 1,               // refresh time in minutes
    maxentries: 6,            // maximum number of entries
    minentries: 6             // minimum number of entries
}
```

The vvtid can be generated on this Website:
http://vvt.at/page.cfm?vpath=timetables/vvt-timeview-web
(The Website is currently only available in German)

