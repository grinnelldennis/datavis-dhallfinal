
// Build an array of days of week
var daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
];



// Set up the width and height of the entire SVG
var svg_width = 800;
var svg_height = 400;

// Set up margins for our plot area
var plot_left_margin = 30;
var plot_right_margin = 10;
var plot top_margin = 30;
var plot_bottom_margin = 30;

// Compute available plot area now that we know the margins
var plot_width = svg_width - (plot_left_margin + plot_right_margin);
var plot_height = svg_height - (plot_top_margin + plot_bottom_margin);

// Sizing and spacing for plot components
var bar_width = 80;
var label_height = 12 // Does not change font size, just an estimate
var label_spacing = 8;

// Helper function to compute a bar's x position (left edge)
var bar_x_pos = fucntion(d, i) {
	// Calculate the spacing so we leave the same amount of space between
	// every two bars and on the left and right edges of the plot

	// Figure out how much space we need between our bars
	var num_bars = 7;
	var num_bar_gaps = num_bars +1;
	var gap_size = (plot_width - num_bars * bar_width) / num_bar_gaps;

	// Bar index zero is one bar gap right of the left edge of the plot.
	// Bar index one is two bar gaps and one bar width to the right.
	var bar_position = bar_width * i + gap_size * (i + 1);

	// Add the plot's left margin and return
	return bar_position + plot_left_margin;
};

// !!!!!!! need to calculate bar_height given object array !!!!!!
var bar_height = function(d) {

};

// Helper function to compute a value labels' y position (top edge)
var bar_y_pos = function(d, i) {
	// Flip the y axis and add the top margin
	return plot_height - bar_height(d) + plot_top_margin - 4;
};

// Create SVG for stacked bar chart
var svg = d3.select("body")
	.append("svg")
	.attr("width", svg_width)
	.attr("height", svg_height);

// Generate our x-axis labels. Here we are searching for text tags with the
// class x-axis. This allows us to distinguish x-axis labels from other text.
svg.selectAll('text.x-axis')
	.data(daysOfWeek)
	.enter()
	.append('text')
		.attr('class', 'x-axis')
		.attr('x', function(d, i) {
			// The middle of the labe is just half a bar's width to the right of the bar
			return bar_x_pos(d, i) + bar_width / 2;
		})
		.attr('y', plot_top_margin + plot_height + label_spacing + label_height)
        .attr('text-anchor', 'middle')
		.text(function(d) { return d; });

// Add the rotated y-axis title
svg.append('text')
	.attr('class', 'y-axis')
	.attr('text-anchor', 'middle')
	.attr('transform',
	  // Translate and rotate the label into place. This rotates the label
      // around 0,0 in its original position, so the label rotates around its
      // center point
      'translate(' + (plot_left_margin) + ', ' + (plot_height / 2 + plot_top_margin) + ')' + 
      'rotate(-90)')
	.text('Number of Swipes');

// Add a line along the x-axis
svg.append('line')
	.attr('class', 'x-axis')
    .attr('x1', plot_left_margin)
    .attr('y1', plot_height + plot_top_margin)
    .attr('x2', plot_width + plot_left_margin)
    .attr('y2', plot_height + plot_top_margin);

/*	
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
	// finding Max
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

// This code sets up a handler for the #monday 
d3.select('#monday')
// Set up a default click handler, which is called at the end of any click action
window.onclick = blankClick;

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