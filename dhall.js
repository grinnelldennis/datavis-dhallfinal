
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



// Written and Tested by Dennis

// Data for drawing graph respectively
var dateData = new Array;
var timeData = new Array;

//---Update View 
function updateViewBar() {
	// Scaling
	//  finding Max
	var maxSwipeBar = d3.max(dateData, d => d.DineIn);
	// Drawing Bars
}

function updateViewLine() {
	// Grouping...
	// Scaling
	//  finding Max
	// Drawing lines
}

//---Filtering 
// Filtering Conditions, update on handler click
var dIsSelected = [true, true, true, true, true, true, true];
var wIsSelected = null;		//initialize
var dStart = null;	//initialize
var dEnd = null;		//initialize
var tStart = null;	//initialize
var tEnd = null;		//initialize
var dineIn = true;
var dineOut = true;

// Weekday Filter
dateData.filter(function(d) {return dIsSelected[+d.Day];})
// Day Range Filter
dateData.filter(function(d) {return +dStart <= +d && +d <= +dEnd; } )

// Time Range Filter
timeData.filter(function(d) {return +tStart <= +d && +d <= +tEnd; } )

//This code sets up handlers for our check boxes
// This code sets up a handler for the #Dining in 
d3.select('#Dining in')
  .on('change', function() { console.log(d3.select(this).node().checked); });

// This code sets up a handler for the #To-Go Box
d3.select('#To-Go Box')
  .on('change', function() { console.log(d3.select(this).node().checked); });

// This code sets up the handler for the drop down menus
// Semester drop down
d3.select('#semester')
  .on('change', function() {
    console.log(d3.select(this).node().value);
  });

// Week drop down
d3.select('#week')
  .on('change', function() {
    console.log(d3.select(this).node().value);
  });

// Day of week drop down
d3.select('#day')
  .on('change', function() {
    console.log(d3.select(this).node().value);
  });

// Loading csv data using d3
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

		// Updates Graphs
		updateViewBar();
		updateViewLine();
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
			var i = time.length;
			var j = time.indexOf(":");
			var apm = +time.substring(i-2,i-1);
			var hour = +time.substring(0, 2);
			hour = (apm === "P")? hour+=12 : hour;

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




