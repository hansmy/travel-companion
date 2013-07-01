
var tfv = ( function($) {
		var config, loadPhotos, display, map;
		
		loadPhotos = function(lat, lon, cont, number_pics) {
			if (cont) {
				map = cont;
				number_pics = (number_pics < 10 || !number_pics) ? 10 : number_pics;
				$.getJSON('http://api.flickr.com/services/rest/?jsoncallback=?', {
					method : 'flickr.photos.search',
					api_key : 'c375f1e26e8b14300d2945a0fd6c4e8e',
					lat : lat,
					lon : lon,
					//bbox : '-89.6037,42.9642,-89.1663,43.1799',
					//bbox : '-0.10249,51.527242,-0.102225,51.527286',
					min_taken_date : Date.now() - (24 * 60 * 60 * 60 ),
					per_page : number_pics,
					extras : 'description, license, date_upload, date_taken, owner_name, icon_server, original_format, last_update, geo, tags, machine_tags, o_dims, views, media, path_alias, url_sq,url_t, url_s, url_q, url_m, url_n, url_z, url_c, url_l, url_o',
					format : 'json'
				}, display);
			}
			
		}
		display = function(resp) {
			if (resp.photos && resp.photos.photo) {
				$("#loading").hide();

				// Marker Cluster group
				var photo_layer = new L.MarkerClusterGroup({
					showCoverageOnHover : false,
					spiderfyDistanceMultiplier : 5,
					maxClusterRadius : 10
				}).addTo(map);
				
				$.each(resp.photos.photo, function(k, photo) {
					var title = (photo.title != null) ? photo.title : "";
					var photo_marker = L.photoMarker([photo.latitude, photo.longitude], {
						src : photo.url_t,
						size : [photo.width_t, photo.height_t],
						draggable: true
					});
					//photo_marker.dragging.disable();
					//photo_marker.dragging.enable();
					photo_marker.on('click', function(e) {
						var title = photo.title;
						if (photo.ownername) {
							title += ' (' + photo.ownername + ')';
						}
						$("#modal .modal-header h3").html(title);
						$("#modal .modal-body").css('max-height', parseInt(photo.height_m) + 20);
						var img = L.DomUtil.create('img', 'modal-image');
						img.src = photo.url_m;
						$("#modal .modal-body").html(img);
						$("#modal").dialog({
							height : parseInt(photo.height_m) + 20,
							modal : true
						});

					});

					// Preload the images
					$("<img>").attr("src", photo.url_t).load(function() {
						photo_layer.addLayer(photo_marker);
					});

				});

			}
		}
		return {
			loadPhotos : loadPhotos
		};
		// Display the flickr photos
	}(jQuery));
