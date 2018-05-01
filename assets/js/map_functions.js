
/**
 *
 */
function onEachFeature(feature, layer, map) {
	// console.log("feature added: " + feature.properties.name);
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight,
		click: zoomToFeature
	});
}

/**
 *
 */
function loadTiles(map){	
	console.log("loadBaseMap() was called!!");

	var mapboxAccessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
	// var map = L.map('map').setView([37.8, -96], 4);
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken, 
		{
			maxZoom: 14,
			// minZoom:6,
			attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
				'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
				'Imagery © <a href="http://mapbox.com">Mapbox</a>',
			id: 'mapbox.light',
		}).addTo(map);
	// L.geoJson(statesData).addTo(map);
}


function asyncOtherBoundaries() {

	// vector_layers[2017][2016]
	// var current_geojson_layer = getLayer(ac[0].key(), ac[0][0]);


	// 	for (let yr of act_years) {
	// 	// boundary_file_names[i++] = 'boundaries' + yr + '.geojson';
	// 	let fn = 'boundaries' + yr + '.geojson';
	// 	vector_layers[yr] = {};
	// 	for (ler y of ac[yr]) {
	// 		vector_layers[yr][y] = newLayer(map, ......., 'rep_rat'); //rr'+census);
	// 	}

	// }


	let vector_layers = {};
	// boundaries_gj[2007] = boundaries2007;
	// for (let a in actcen) {
	// 	for (let c of actcen[a])
	// 	vector_layers['act'+a+'census'+c] = newLayer(map, boundaries_gj[a], 'rr'+c);
	// }
	let a = 2013
	vector_layers[a] = {};

	let b = boundaries2013;
	let c = 2016;
	vector_layers[a][c] = newLayer(b, 'rep_rat_next');
	// vector_layers[a][c].addTo(map);

	// a = 2013
	// b = boundaries2013;
	c = 2011;
	// vector_layers[a][c] = newLayer(map, b, 'rr'+c);
	vector_layers[a][c] = newLayer(b, 'rep_rat');
	// vector_layers[a][c].addTo(map);

	a = 2009;
	vector_layers[a] = {};

	b = boundaries2007;
	c = 2011;
	vector_layers[a][c] = newLayer(b, 'rep_rat_next');
	// vector_layers[a][c].addTo(map);
	
	c = 2006;
	vector_layers[a][c] = newLayer(b, 'rep_rat');
	// vector_layers[a][c].addTo(map);
	return vector_layers;
}

/**
 *
 */
function newLayer(boundaries) {
	console.log("createLayer() was called!!");
	// var bounds = getBoundaries(boundaries);
	// console.log('show_pop_next = ' + show_pop_next);
	console.log('what the hell!!!!');
	return L.geoJson(boundaries, {
			style: function(feature) { 
				console.log(' inside anon!');
				return st(feature, 'rep_rat');},
			// style: style,
			// style: function(feature) {return style(feature, show_pop_next);},
			onEachFeature: onEachFeature
		});
}

/**
 *
 */
function loadAttribution(){
	map.attributionControl.addAttribution('Boundary data &copy; <a href="">OSi</a>');
	map.attributionControl.addAttribution('Population data &copy; <a href="">CSO</a>');
}


/**
 * // get color depending on population density value
 */
function getColor(d) {
	// got these colors using d3.schemeGreens[6]
 
 	return d > 30 ? '#FF0000' :
 			d > 29  ? '#006d2c' :
 			d > 28  ? '#31a354' :
 			d > 27  ? '#74c476' :
 			d > 26  ? '#a1d99b' :
 			d > 25  ? '#c7e9c0' :
 			d > 24  ? '#edf8e9' :
 				'#0000FF';

	// got these colors by using the eye dropper on the following page
	// https://mekshq.com/how-to-convert-hexadecimal-color-code-to-rgb-or-rgba-using-php/
	// return d > 30 ? '#FF0000' :
	// 		d > 29  ? '#178000' :
	// 		d > 28  ? '#298903' :
	// 		d > 27  ? '#449906' :
	// 		d > 26   ? '#4DA00A' :
	// 		d > 25   ? '#70B50D' :
	// 		d > 24   ? '#93C814' :
	// 					'#0000FF';

	/*R = (255 * n) / 100
	G = (255 * (100 - n)) / 100 
	B = 0
	return d > 30 ? '#800026' :
			d > 29  ? '#BD0026' :
			d > 28  ? '#E31A1C' :
			d > 27  ? '#FC4E2A' :
			d > 26   ? '#FD8D3C' :
			d > 25   ? '#FEB24C' :
			d > 24   ? '#FED976' :
						'#FFEDA0';
						*/
}

function style(feature) {	
	console.log('style called ');
	var r = feature.properties['rep_rat'];
	
	return {
		weight: 2,
		opacity: 1,
		color: 'white',
		dashArray: '3',
		fillOpacity: 0.7,
		fillColor: getColor(r/1000) //'#555555'
	};
}

/**
 * It is a nightmare trying to use a single layer for 2 different styles 
 * (one for each census), just make a layer for each
 * at least we don't have to transmit the polygon data twice, just store it twice
 */
function st(feature, census) {
	// console.log('show_pop_next = ' + show_pop_next);
	// // var r = (feature.properties.total2011/feature.properties.no_members)/1000;
	// // var r = feature.properties.reprat/1000;
	// //
	// // we prolly want to use crossfilter rather than using properties...
	// // var cen_yr = getCensusYear();
	// // var con_yr = getBoundariesYear();
	// var r;

	// if (show_pop_next) {
	// 	r = feature.properties.rep_rat_next;
	// 	// feature.properties.pop_next;
	// } else {
	// 	r = feature.properties.rep_rat;
	// }
	// var r = (p/feature.properties.no_tds)/1000;
	// console.log('styling...');
	// console.log('r = ' + r);
	// var r = feature.properties['rr' + census];
	// var r = feature.properties.rep_rat;
	var r = feature.properties[census];
	
	return {
		weight: 2,
		opacity: 1,
		color: 'white',
		dashArray: '3',
		fillOpacity: 0.7,
		fillColor: getColor(r/1000) //'#555555'
	};
}

/**
 *
 */
function style_new_census(ml) {		
	console.log('layer = ' + ml);
	console.log('layer.opts = ' + ml.options);

	let r = 0;
	ml.eachLayer(function(lyr){
	// for (let l of ml._layers) {
		// r = lyr.feature.properties.rep_rat_next;
		lyr.options.style = style_new;
	});
}

function style_new() {
	var r = feature.properties.rep_rat_next;
	return {
		weight: 2,
		opacity: 1,
		color: 'white',
		dashArray: '3',
		fillOpacity: 0.7,
		fillColor: getColor(r/1000) //'#555555'
	};
}
/**
 *
 */
function highlightFeature(e) {
	var layer = e.target;

	layer.setStyle({
		weight: 5,
		color: '#666',
		dashArray: '',
		fillOpacity: 0.7
	});

	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
		layer.bringToFront();
	}

	hover_info.update(layer.feature.properties);
}

/**
 *
 */
function resetHighlight(e) {
	// geojson.resetStyle(e.target);
	// var layer = e.target;
	current_geojson_layer.resetStyle(e.target);
	hover_info.update();
}	

/**
 *
 */
function zoomToFeature(e) {
	// might be nice to return to zoom whole island if next click is on same feature...
	map.fitBounds(e.target.getBounds());
}