//
// event_listeners
//
var rangeChanged = false;
/**
 *
 */
timeline.on('rangechange', function (properties) {
	// logEvent('rangechange', properties);
	var t = getCentreDate(properties);
	// if (!isSameInterval(t)) updateStuff(t);
	if (!isSameInterval(t)) updateStuff(t);
	rangeChanged = true;
});

/**
 *
 */
function centreNewInterval(g, t) {
	
}

timeline.on('click', function (p) {
/*
	// if (rangeChanged) {
	// 	rangeChanged = false;
	// 	return;
	// }

	console.log('Bad Bad Bad to have the "selected_track" variable defined outside this funnction');
	console.log(selected_track);

	// logEvent('rangechange', properties);
	let what = p.what;
	let item = p.item;
	let group = p.group;
	console.log(p);
	console.log(what + ', ' + item);
	// if (!isSameInterval(t)) updateStuff(t);
*/
	// if click not on one of tracks
	if ([1, 2, 3, 4].indexOf(p.group) == -1) 
		return;
	if (p.time > byAct_act_census[0].end) 
		return;
	if (p.time < byAct_census_act[byAct_census_act.length-1].start) 
		return;
	
	if (selected_track == p.group) {
		if (!isSameInterval(t)) {
			centreNewInterval(p.group, p.time);
		}
	}



		if (p.group == 1) 
	setCentreDate(timeline, p.time);

	let t;
	if (p.what == 'background') {

		t = p.time;
	} else return;
	
	if (isSameInterval(t) && selected_track == group) {
		
	} else {
		updateStuff(t, group);
	}


});





/** 
 *
 */
/*title_info.onAdd = function(map) {
 	this._div = L.DomUtil.create('div', 'info');
	this.update();
	return this._div;
 }*/

/**
 * updated when timeline changed or switch clicked...
 */
/*title_info.update = function (props) {
	console.log("want to see if we can use props of collection rather than of individual feature");
	console.log("have to write them into the geojson too, they are not in spec but not forbidden");
	// console.log(props.rep_rat_next);
	this._div.innerHTML =
			'<h3>YEAR...</h3>'+
			'put the switch view button here...' + 
			'' + 
			'<h4>Nationwide Representative Ratio</h4>' +
			'<b>' + 'CENSUS total...' + '</b><br />' + 
			0 + ' people / TD';
};
title_info.addTo(map);
*/
/**
 *
 */
hover_info.onAdd = function (map) {
	this._div = L.DomUtil.create('div', 'info');
	this.update();
	return this._div;
};

// var year = 2011;

/**
 *
 */
hover_info.update = function (props) { 	
	// my_update(props, year)
	console.log('It is really bad that I have to have the "year" variable defined outside this funnction');
	console.log(census_year);
	var r;
	this._div.innerHTML = '<h4>Representative Ratio</h4>';
	if (props){
		console.log(props.rep_rat_next);
		// if (show_pop_next) r = props.rep_rat_next;
		// else r = props.rep_rat;		
		r = props['rep_rat'];

		this._div.innerHTML += '<b>' + props.name + '</b><br />' + r + ' people / TD';
	} else {
		this._div.innerHTML += 'Hover over a constituency';
	}
	/*
	console.log("r = " + r);
	//ha can put the title in here too for when the hover is not over a constituency

	this._div.innerHTML = 
		'<h4>Representative Ratio</h4>' +
		(props ? '<b>' + props.name + '</b><br />' + 
			r + ' people / TD'
		: 'Hover over a constituency');
	//-- IMPORTANT must accomodate ..._NEXT for alternate census data
	*/
};
hover_info.addTo(map);

/**
 *
 */
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
