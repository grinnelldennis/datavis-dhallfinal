/*
// SVG Stuff
var svg_width = 800;
var svg_height = 800;
var margin = 100;
var plot_width = svg_width - 2 * margin;
var plot_height = svg_height - 2 * margin;

// Create SVG for bar chart
var svg = d3.select("body")
	.append("svg")
	.attr("width", svg_width)
	.attr("height", svg_height);

// x-axis label
svg.append('text')
   .attr('class', 'x-axis')
   .attr('x', margin + plot_width / 2)
   .attr('y', 3/2 * margin + plot_height)
   .text('Day of the Week');

// y-axis label
svg.append('text')
   .attr('class', 'y-axis')
   .attr('text-anchor', 'middle')
   .attr('transform',
         'translate(' + margin / 3 + ', ' + (plot_height / 2 + margin) + ')' +
         'rotate(-90)')
   .text('Number of Swipes')


// Create x-scale and y-scale
var xScale = d3.scaleBand()
	.domain(data.map(function(d) { return d.day }))
	.range([0, svg_width * 0.95])

var yScale = d3.scaleLinear()
	.domain([0, d3.max(data, function(d) { return d.swipes; })])
	.range([svg_height, 0]);

// Create x-axis and y-axis
var xaxis = d3.axisBottom(xScale)
	.ticks(7);

var yaxis = d3.axisLeft(yScale);

// Drawing the axes
svg.append('g')
  .attr('class', 'x-axis')
  .attr('transform',
	    'translate(' + margin + ', ' + (plot_height+ margin) + ')')
  .call(xaxis);

svg.append('g')
  .attr('class','y-axis')
  .attr('transform',
     'translate(' + margin + ', ' + margin + ')')
  .call(yaxis);
*/


//This code sets up handlers for all of our check boxes
// This code sets up a handler for the #monday 
d3.select('#monday')
  .on('change', function() { console.log(d3.select(this).node().checked); });


// Below are Written and Tested by Dennis


//---Filtering 
// Filtering Conditions, update on handler click
var wkDaySelected = [true, true, true, true, true, true, true];
//dateData.filter(function(d) {return wkDaySelected[+d.Day];})
var dineIn = true;
var dineOut = true;
// Weekday Filter

// Data Array for Day Line plot_height
var dayData = [];
function populateDayArray (a, d1, d3) {
  dayData = new Array;
  for (var i = 0; i < 52; i++) { 
    dayData.push({ Time: (Math.floor(i/4)+7) + ":" + ((i%4)*15),
                  DineIn: 0, DineOut: 0, Count: 0, AvgIn: 0, AvgOut: 0}); }
  // dayData[52] stores maximum within data
  dayData.push({Max: 0});
  // filter data
  a = a.filter(function(d) { return +d1 <= +d.Date && +d.Date <= +d3; });
  for (var row of a) {
    var index = getArrayIndex(row.Date);
    if (0 <= index && index < 52){
      dayData[index].DineIn += +row.DineIn;
      dayData[index].DineOut += +row.DineOut;
      dayData[index].Count++;
    }
  }
  // aggregate data 
  for (var j = 0; j < 52; j++) {
    dayData[52].Max = (dayData[j].DineIn > dayData[52].Max)? dayData[j].DineIn : dayData[52].Max;
    dayData[j].AvgIn = dayData[j].DineIn / dayData[j].Count;
    dayData[j].AvgOut = dayData[j].DineOut / dayData[j].Count;
  }
}
function getArrayIndex (d) {
  return (d.getUTCHours()-7)*4 + (d.getUTCMinutes()-1)/15;
}


// Data Array for Week Stack Plot
var weekData = [];
function populateWeekArray (a, d1, d3, w1, w3) {
  weekData = new Array;
  // initialize empty array
  for (var i = 0; i < 7; i++) 
    weekData.push({Day: i, DineIn: 0, DineOut: 0, wkCount: 0, AvgOut: 0, AvgIn: 0}); 
  // initilizing 8th cell to store maximum 
  weekData.push({Max: 0});
  // filter data 
  a = a.filter(function(d) { return +w1 <= +d.Week && +d.Week < +w3; });
  a = a.filter(function(d) { return +d1 <= +d.Date && +d.Date <= +d3; });
  for (var row of a) { 
    if (parseInt(row.DineIn) != 0) {
      weekData[+row.Day].DineIn += +row.DineIn; 
      weekData[+row.Day].DineOut += +row.DineOut; 
      weekData[+row.Day].wkCount++;
    } 
  }
  // finding maximum
  for (var j = 0; j < 7; j++){ 
    weekData[7].Max = (weekData[j].DineIn > weekData[7].Max)? weekData[j].DineIn : weekData[7].Max;
    weekData[j].AvgIn = weekData[j].DineIn / weekData[j].Count;
    weekData[j].AvgOut = weekData[j].DineOut / weekData[j].Count;
  }
}


//---Loading CSV
d3.queue()
	.defer(d3.csv, 'formatted csv/2014f.csv')
	.defer(d3.csv, 'formatted csv/2015f.csv')
	.defer(d3.csv, 'formatted csv/2015s.csv')
	.defer(d3.csv, 'formatted csv/2016s.csv')
	.await(function(error, f2014, f2015, s2015, s2016) {
		/* DATA PROCESSING */
		processCsvData(f2014);
		processCsvData(f2015);
		processCsvData(s2015);
		processCsvData(s2016);
})


// Array Objects to Hold Aggregated Data
var trafficByFften = new Array(); 
var trafficByDay = new Array();

var processCsvData = function (data) {
	// Populating array with every row in csv sheets 
	for (var row of data) {
		if (row.Dash == "DayTotals:") {
			// pushing single day totals onto separate array
			trafficByDay.push ({
				Date: new Date(row.Date),
				Day: row.Day,
				Week: row.Week,
				DineIn: row.DineIn,
				DineOut: row.DineOut
			});
		} else {
			// process time information
			var time = row.TimeIn;
			var l = time.length;
			var j = time.indexOf(":");
			var apm = time.substring(l-2,l-1);
			var hour = +time.substring(0, j);
			hour = ((apm === "P") && (+time.substring(0,j) != 12))? hour+=12 : hour;
			// writing time into a Date object
			var date = new Date(row.Date);
			date.setUTCHours(hour);
			date.setUTCMinutes(+time.substring(j+1, j+3));

			// popuating row onto object
			trafficByFften.push({
				Date: date,
				DineIn: row.DineIn,
				DineOut: row.DineOut
			});
		}
	}
}




