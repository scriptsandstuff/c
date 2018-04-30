

var map = L.map('IE_map').setView([53.416, -8.042], 7);	// [37.8, -96], 4); // USA coords
// var current_geojson_layer;

var hover_info = L.control(); // control that shows constituency info on hover
hover_info.onAdd = function (map) {
	this._div = L.DomUtil.create('div', 'info');
	this.update();
	return this._div;
};

hover_info.update = function (props) {
	// var r = ;
	this._div.innerHTML = 
		'<h4>Representative Ratio</h4>' +
		(props ? '<b>' + props.name + '</b><br />' + 
			props.rep_rat + ' people / TD'
		: 'Hover over a constituency');
	//-- IMPORTANT must accomodate ..._NEXT for alternate census data
};
hover_info.addTo(map);

var legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {

	var div = L.DomUtil.create('div', 'info legend'),
		// grades = [0, 10, 20, 50, 100, 200, 500, 1000],
		grades = [24, 25, 26, 27, 28, 29, 30],
		labels = [],
		from, to;

	for (var i = 0; i < grades.length; i++) {
		from = grades[i];
		to = grades[i + 1];

		labels.push(
			'<i style="background:' + getColor(from + 1) + '"></i>' +
			from + (to ? '&ndash;' + to : '+'));
	}

	div.innerHTML = labels.join('<br>');
	return div;
};
legend.addTo(map);

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
function loadBaseMap(map){	
	console.log("loadBaseMap() was called!!");

	var mapboxAccessToken =
	'pk.eyJ1IjoibWFwc2FuZHN0dWZmIiwiYSI6ImNqZ21pbW03NzAwMDYyeG5vOWQ1bmxlYjAifQ.GbJVYIbxoRcxE804FRbc0g';
	 // 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
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

/**
 *
 */
function style(feature) {
	// var r = (feature.properties.total2011/feature.properties.no_members)/1000;
	// var r = feature.properties.reprat/1000;
	//
	// we prolly want to use crossfilter rather than using properties...
	// var cen_yr = getCensusYear();
	// var con_yr = getBoundariesYear();
	var r;
	if (show_pop_next) {
		r = feature.properties.rep_rat_next;
		// feature.properties.pop_next;
	} else {
		r = feature.properties.rep_rat;
	}
	// var r = (p/feature.properties.no_tds)/1000;
	// console.log('styling...');
	// console.log('r = ' + r);
	
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
	current_boundaries_layer.resetStyle(e.target);
	hover_info.update();
}	

/**
 *
 */
function zoomToFeature(e) {
	// might be nice to return to zoom whole island if next click is on same feature...
	map.fitBounds(e.target.getBounds());
}