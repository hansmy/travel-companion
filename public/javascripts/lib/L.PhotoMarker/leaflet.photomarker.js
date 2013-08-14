L.PhotoMarkerMatrix = L.Class.extend({
	initialize : function(i) {
		var t = [];
		for (var e in i)
		t.push(parseInt(e, 10));
		t.sort(function(i, t) {
			return i - t
		});
		var o = this.metric = {};
		o.min = t[0], o.minScale = i[t[0]], o.max = t[t.length - 1], o.maxScale = i[t[t.length - 1]], o.zooms = {};
		for (var s, n = o.min; o.max >= n; n++)
			i[n] ? (o.zooms[n] = i[n], s = i[n]) : o.zooms[n] =
			void 0 !== s ? s : i[o.max]
	},
	findScale : function(i) {
		var t = this.metric, e = parseInt(i, 10);
		return t.min > e ? t.minScale : e > t.max ? t.maxScale :
		void 0 !== t.zooms[e] ? t.zooms[e] : t.maxScale
	}
}), L.PhotoIcon = L.Class.extend({
	options : {
		className : "leaflet-photomarker-img"
	},
	initialize : function(i) {
		L.setOptions(this, i), this.original_size = L.point(i.size), this.size = this.original_size
	},
	scale : function(i) {
		var t = this.original_size.multiplyBy(i);
		t.x !== this.size.x && t.y !== this.size.y && this.resize(t)
	},
	createIcon : function() {
		var i = this.options.src;
		if (!i) {
			if ("icon" === name)
				throw Error("iconUrl not set in Icon options (see the docs).");
			return null
		}
		return this._container = L.DomUtil.create("div", "leaflet-photomarker-container"), this._container.style.position = "relative", this.img = this._createImg(i), this._container.appendChild(this.img), L.DomUtil.addClass(this.img, "leaflet-marker-icon"), L.DomUtil.addClass(this.img, this.options.className), this._setIconSize(this.img, this.size), this._container
	},
	resize : function(i) {
		this.size = i, this._setIconSize(this.img, this.size)
	},
	createShadow : function() {
		return null
	},
	_setIconSize : function(i, t) {
		var e = t.divideBy(2, !0);
		e && (i.style.marginLeft = -e.x + "px", i.style.marginTop = -e.y + "px"), t && (i.style.width = t.x + "px", i.style.height = t.y + "px")
	},
	_createImg : function(i) {
		var t;
		return L.Browser.ie6 ? ( t = document.createElement("div"), t.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + i + '")') : ( t = document.createElement("img"), t.src = i), t
	}
}), L.PhotoMarker = L.Marker.extend({
	options : {
		title : "",
		clickable : !0,
		draggable : !1,
		zIndexOffset : 0,
		opacity : 1,
		riseOnHover : !0,
		riseOffset : 250,
		matrix : {
			11 : .125,
			12 : .25,
			14 : .5,
			16 : 1
		}
	},
	initialize : function(i, t) {
		t.icon = new L.PhotoIcon({
			src : t.src,
			size : t.size
		}), L.Marker.prototype.initialize.call(this, i, t)
	},
	_initIcon : function() {
		L.Marker.prototype._initIcon.call(this), this.resize()
	},
	onAdd : function(i) {
		i.on("zoomend", this.resize, this), L.Marker.prototype.onAdd.call(this, i)
	},
	onRemove : function(i) {
		i.off("zoomend", this.resize, this), L.Marker.prototype.onRemove.call(this, i)
	},
	scale : function(i) {
		var t = this.options.icon;
		t.scale(i)
	},
	resize : function() {
		"function" == typeof this.options.resize ? this.options.resize.call(this, this._map) : this._resize(this._map)
	},
	_resize : function(i) {
		void 0 === this.matrix && (this.matrix = new L.PhotoMarkerMatrix(this.options.matrix)), this.scale(this.matrix.findScale(i.getZoom()))
	}
}), L.photoMarker = function(i, t) {
	return new L.PhotoMarker(i, t)
}; 