
/**
 *	3 ways of viewing things
 *		population with proposed boundaries (when commission published report)
 * 		pop with enacted (when act passed)
 *		pop with effected (on election day)
 */

 /**
 todo
 set map zoom to suit screen size
  and much much more
 */


// loadDistraction();
var event_detail = document.getElementById('event_detail');


/**
 *	Setup Timeline
 *
 */
var timeline_container = document.getElementById('IE-rep-timeline');
// var tl_item_categories = [general_elections, dail_terms, census_taken, census_results, commission_reports];
// var tl_tracks = ['Statutory', 'Legeslitive'];
// var timeline = initTimeline(timeline_container, tl_item_categories, tl_tracks);



var timeline = new vis.Timeline(timeline_container);


var tl_item_categories = [dail_terms, census_taken, actsOnly, 
	byAct_act_census, byAct_census_act,
	// byAct_act_census_bkg, byAct_census_act_bkg,
	byEff_election_census4, byEff_census_election4,
	byEff_election_census, byEff_census_election,
	byEff_election_census_bkg, byEff_census_election_bkg
	];
// var tl_item_categories = [general_elections, census_taken, census_results, commission_reports];
let groupMinHeight = "220";

var enacted_tracks = [1];
var empty_tracks = [0];
var effected_tracks = [2, 3, 4];
var selected_track = 2;

var tracks = new vis.DataSet([
    {
    	id: 0,
    	// content: 'Boundary Act',
    	minHeight: groupMinHeight
    },{
    	id: 1,
    	content: 'Enacted',
		// nestedGroups: ["dail"],
		// nestedGroups: [4],
		// showNested: true,
  //   	minHeight: groupMinHeight
    },{
    	id: 2,
    	content: 'Effected',
    	// nestedGroups: ["census"],
		nestedGroups: [3, 4],
		showNested: true,
    	minHeight: groupMinHeight
    } ,{
    	id: 3,
    	content: '',
    } ,{
    	id: 4,
    	content: '',
    }
]);

var options = {
	stack: false
        // height: 700
};

initTimeline(timeline, tl_item_categories, tracks); //, options);
timeline.setOptions(options);


// div.vis-panel:nth-child(5)
let pl = document.getElementsByClassName('vis-left');
console.log('total vis-left = ' + pl.length);
console.log('vis-left width = ' + pl[0].offsetWidth);

let arrow = document.getElementsByClassName('arrow-up')
let w = Math.floor((timeline_container.offsetWidth + pl[0].offsetWidth)/2) - 10;
console.log('width = ' + w);
arrow[0].style.left = w+"px";





/**
 *	Setup Map
 *
 */
var IE_map = document.getElementById('IE_map'); 	// <div> containing map

var map = L.map('IE_map').setView([53.416, -8.042], 7);	// [37.8, -96], 4); // USA coords
// var title_info = L.control(); // control that shows National stats
var hover_info = L.control(); // control that shows constituency info on hover
var legend = L.control({position: 'bottomright'});

loadTiles(map);
var current_geojson_layer =	newLayer(boundaries2013); //rr'+census);
current_geojson_layer.addTo(map);
loadAttribution(map);
var vector_layers = asyncOtherBoundaries();


var census_year = 2017;



var population_intervals = {
	/* counties from commission */
	'p2018': {'a': [new Date(2017, 6, 27), new Date(2018, 9, 1)]}, //commission report -now
	'p2013': {
		/* 2016 census */
		'b': [new Date(2016, 7, 14), new Date(2018, 9, 1)], //2016 cnsus - now
		/* 2011 census */
		'a': [new Date(2013, 3, 20), new Date(2016, 7, 14)] // act to 2016 census
	},
	'p2007': {
		/* 2011 census */
		'b': [new Date(2011, 6, 30), new Date(2016, 2, 26)] //  2011 census to 2016 election
	}
};



var current_interval = population_intervals.p2018.a; //getNextInterval(new Date());
var next_interval;



/**
 *
 */
function loadDistraction(){
	console.log("loadDistraction() was called!!");
}

/**
 * if click
 * if rangechange
 */
function updateStuff(t, group_num) {
	console.log("UPDATING!!!!");
	// getHighlitedInterval();
	// getBackgroundItem();
	var track = 'enacted';





	
	// if it is a click we can ge the item from the event
	displayNewDetails();
	displayNewMap(t, group_num);
}

/**
 *
 */
function getHighlitedInterval() {

}

/**
 *
 */
function displayNewDetails() {
	console.log("displayNewDetails() called...");
}



/**
 * simple loop if boundary intervals do NOT overlap
 */
function displayNewMap(time){	

	getYears();
	vector_layers.addTo(map);


	console.log("displayNewMap() called...");
	map.removeLayer(current_geojson_layer);

	if (time > population_intervals.p2018.a[0]) {
		console.log("--ERROR -- Future unknown --");
		show_pop_next = false;
		current_geojson_layer = layer_b2013_next;
		next_interval = population_intervals.p2018.a;
	} else if ( time > population_intervals.p2013.b[0]) {
		show_pop_next = true;
		current_geojson_layer = layer_b2013_next;
		next_interval = population_intervals.p2013.b;
		// BOGUS
		// this layer has to change when it is available
	}
	else if (time > population_intervals.p2013.a[0]) {
		show_pop_next = false;
		current_geojson_layer = layer_b2013;
		next_interval = population_intervals.p2013.a;
	}
	else if (time > population_intervals.p2007.b[0]) {
		show_pop_next = false;
		current_geojson_layer = layer_b2007_next;
		next_interval = population_intervals.p2007.b;
	} else {
		console.log("--INVERVAL-- ERROR, boundaries prior to Act 2005 (General Election 2007) not found");
		show_pop_next = false;
		current_geojson_layer = layer_b2007_next;
		next_interval = population_intervals.p2007.b;
	}
	// update_constituency_style();

	map.addLayer(current_geojson_layer);
}


/**
 *
 */
function displayNewMap(time, group_num){	
	console.log("displayNewMap(time, track) called...");
	
	map.removeLayer(current_geojson_layer);
	
	let track = '';
	let act = 2009;
	let census = 2011;
	// let act = getActYear(time);
	// let years = {2009: [2006, 2011]};

	if (enacted_tracks.indexOf(group_num) != -1) {
		track = 'enacted';
		act = getActYear_enacted(time);
		census = getCensusYear_enacted(time);
		// getEnactedLayer(time);

		// current_geojson_layer = vector_layers[act][census];
		// current_geojson_layer = vector_layers[years[0]][years[1]];
		// current_geojson_layer = getEnactedMap(time);
	} else if (effected_tracks.indexOf(group_num) != -1) {
		track = 'effected';
		
		// current_geojson_layer = getEffectedMap(time);

	} else {
		console.log('click not on a track')
		// act
	}
	// update_constituency_style();
	current_geojson_layer = vector_layers[act][census];
	map.addLayer(current_geojson_layer);
}

function getCensusYear_enacted(time) {
	let year = -1;
	for (let i = 0; i < census_taken.length; i++) {		
		if (time < census_taken[i].end) {
		// if (census_taken[i].end < time && time < census_taken[i-1].end) {
			// return census_taken[i].start.year;
			// year = 
			// continue;
		} else {
			year = census_taken[i].start.getFullYear();
			break;
		}
	}
	return year;
}

function getActYear_enacted(time) {
	let year = -1;
	for (let i = 0; i < actsOnly.length; i++) {
		if (time < actsOnly[i].start) {
		// if (actsOnly[i].start < time && time < actsOnly[i+1].start) {
			// return actsOnly[i].start.getFullYear();

		} else {
			year = actsOnly[i].start.getFullYear();
			break;
		}
	}
	// for (let i of byAct_census_act) {
	// 	if (within(time, i)) return i.start.year();
	// }
	// for (let i of byAct_census_act) {
	// 	if (within(time, i)) return i.start.year();
	// }	
	return year;

}

function within(time, interval) {
	if (interval.start < time && time < interval.end) {
		return true;
	} else {
		return false;
	}
}

/**
 *
 */
function getEnactedYears(time) {
	let a = 0;
	let c = 0;
	let acts = byAct_census_act;
	for (let i = 0; i < acts.lenght; i++) {
		if (acts[i].start < time && acts[i+1] < time) {
			a = acts[i].start.year;
		}
	}

	// for (let y of actcen[a]) {
	if (censuses.id['census '+ actcen[a][0]].end > time ) {
		console.log('next...');
		c = actcen[a][1]; //.start.year;
	}
	return [a, c];
}

/**
 *
 */
function getEffectedMap(time) {

}
// 	if (time > population_intervals.p2018.a[0]) {
// 		console.log("--ERROR -- Future unknown --");
// 		show_pop_next = false;
// 		current_geojson_layer = layer_b2013_next;
// 		next_interval = population_intervals.p2018.a;
// 	} else if ( time > population_intervals.p2013.b[0]) {
// 		show_pop_next = true;
// 		current_geojson_layer = layer_b2013_next;
// 		next_interval = population_intervals.p2013.b;
// 		// BOGUS
// 		// this layer has to change when it is available
// 	}
// 	else if (time > population_intervals.p2013.a[0]) {
// 		show_pop_next = false;
// 		current_geojson_layer = layer_b2013;
// 		next_interval = population_intervals.p2013.a;
// 	}
// 	else if (time > population_intervals.p2007.b[0]) {
// 		show_pop_next = false;
// 		current_geojson_layer = layer_b2007_next;
// 		next_interval = population_intervals.p2007.b;
// 	} else {
// 		console.log("--INVERVAL-- ERROR, boundaries prior to Act 2005 (General Election 2007) not found");
// 		show_pop_next = false;
// 		current_geojson_layer = layer_b2007_next;
// 		next_interval = population_intervals.p2007.b;
// 	}
// }



