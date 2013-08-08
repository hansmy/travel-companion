
// Example Controller

App.IndexController = Ember.ObjectController.extend({
    zoom : 15,
    center : Ember.Object.create({
        lat : 41.276387375928984,
        lng : -8.371624946594238
    }),
    supermarkets : Ember.A([App.Twitter.create({
        name : 'A',
        location : {
            lat : 41.276081,
            lng : -8.356861
        }
    }), App.Twitter.create({
        name : 'B',
        location : {
            lat : 41.276081,
            lng : -8.366861
        }
    }), App.Twitter.create({
        name : 'C',
        location : {
            lat : 41.276081,
            lng : -8.376861
        }
    }), App.Twitter.create({
        name : 'D',
        location : {
            lat : 41.276081,
            lng : -8.386861
        }
    })]),
    remove : function(s) {
        this.get('supermarkets').removeObject(s);
    },
    zoomIn : function() {
        this.incrementProperty('zoom');
    },
    zoomOut : function() {
        this.decrementProperty('zoom');
    },
    add : function() {
        this.get('supermarkets').pushObject(App.Supermarket.create({
            location : {
                lat : this.get('center.lat'),
                lng : this.get('center.lng')
            },
            name : 'New Marker'
        }));
    },
    highlight : function(s) {
        s.toggleProperty('highlight');
    },
    lock : function(s) {
        this.highlight(s);
        s.toggleProperty('draggable');
    },
    centerMarker : function(s) {
        this.set('center', Ember.Object.create({
            lat : s.get('location.lat'),
            lng : s.get('location.lng')
        }))
    },
    icons:[
        {
            label: 'Supermarket',
            icon: L.AwesomeMarkers.icon({
                icon : 'shopping-cart',
                color : 'blue'
            }),
        },
        {
            label: 'Rocket!',
            icon:L.AwesomeMarkers.icon({
                icon : 'rocket',
                color : 'orange'
            })
        },
        {
            label: 'Fire! Fire!',
            icon:L.AwesomeMarkers.icon({
                icon : 'fire-extinguisher',
                color : 'red'
            })
        },
        {
            label: 'Let\'s play!',
            icon:L.AwesomeMarkers.icon({
                icon : 'gamepad',
                color : 'cadetblue'
            })
        },
        {
            label: 'Ember',
            icon:L.AwesomeMarkers.icon({
                icon : 'fire',
                color : 'green'
            })
        }
    ],
    changeIcon : function(s, icon){
        s.set('icon',icon);
    },
    paths:[
        App.Pipe.create({
            label:'Pipe 1',
            locations:[
                Ember.Object.create({lat : 41.276081,lng : -8.356861}),
                Ember.Object.create({lat : 41.276081,lng : -8.366861})
            ]
        }),
        App.Pipe.create({
            label:'Pipe 2',
            locations:[
                Ember.Object.create({lat : 41.276081,lng : -8.366861}),
                Ember.Object.create({lat : 41.276081,lng : -8.376861})
            ]
        }),
        App.Pipe.create({
            label:'Pipe 3',
            locations:[
                Ember.Object.create({lat : 41.276081,lng : -8.376861}),
                Ember.Object.create({lat : 41.276081,lng : -8.386861})
            ],
            color:'red',
            weight:10,
            opacity:0.8,
            dashArray:'5, 1'
        }),
        App.Valve.create({
            label: 'Valve 1',
            location:{
                lat:41.276081,
                lng:-8.361861
            }
        }),
        App.Valve.create({
            label: 'Valve 2',
            location:{
                lat:41.276081,
                lng:-8.371860999999999
            }
        }),
        App.Valve.create({
            label: 'Valve 3',
            location:{
                lat:41.276081,
                lng:-8.381861
            }
        })
    ],
    centerPath:function(p){
        var c = p.get('path').getBounds().getCenter();
        this.set('center', Ember.Object.create({
            lat : c.lat,
            lng : c.lng
        }));
    },
    removePath:function(p){
        this.get('paths').removeObject(p);
    },
    changeColor:function(p,c){
        p.set('color',c);
    },
    changeFillColor:function(p,c){
        p.set('fillColor',c);
    },
    addPipe : function() {
        this.get('paths').pushObject(App.Pipe.create({
            label:'New Pipe',
            locations:[
                Ember.Object.create({lat : this.get('center.lat')-0.0005,lng : this.get('center.lng')-0.001}),
                Ember.Object.create({lat : this.get('center.lat')+0.0005,lng : this.get('center.lng')+0.001})
            ],
            color:'purple'
        }));
    },
    addValve : function() {
        this.get('paths').pushObject(App.Valve.create({
            label:'New Valve',
            location: {
                lat : this.get('center.lat'),
                lng : this.get('center.lng')
            },
            color:'lime'
        }));
    }
});
