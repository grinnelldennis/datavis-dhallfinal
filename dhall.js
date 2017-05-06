//------------------------------------------------------------------------
// Global filtering options
var diningin = false;
var togo = false;
var weekSelector = 0;
var daySelector = 0;
var semSelector = 0;
var semester = [["06/01/2014", "06/01/2016"],
        ["06/01/2014", "01/01/2015"],
        ["01/01/2015", "06/01/2015"],
        ["06/01/2015", "01/01/2016"],
        ["01/01/2016", "06/01/2016"]];

//------------------------------------------------------------------------
//---Check Boxes Handlers 
// #Dining-in checkboxes
d3.select('#diningin')
  .on('change', function() {
	console.log(d3.select(this).node().checked); 
	diningin = d3.select(this).node().checked;
	updateStack();
	updateLine();
	});

// #To-Go Box checkboxes
d3.select('#togo')
  .on('change', function() {
	console.log(d3.select(this).node().checked); 
	togo = d3.select(this).node().checked;
	updateStack();
	updateLine();
	});

//---Drop-Down Handlers
// Semester drop down
d3.select('#semester')
  .on('change', function() {
    console.log(d3.select(this).node().value);
    semSelector = d3.select(this).node().value;
    updateStack();
    updateLine();
  });
	
// Week drop down
d3.select('#week')
  .on('change', function() {
    console.log(d3.select(this).node().value);
    weekSelector = d3.select(this).node().value;
    updateStack();
	  updateLine();
  });

// Day of week drop down
d3.select('#day')
  .on('change', function() {
    console.log(d3.select(this).node().value);
    daySelector = d3.select(this).node().value;
    wkDaySelected = [false, false, false, false, false, false, false];
    if (daySelector == 0) {
		  wkDaySelected = [true, true, true, true, true, true, true];
    }	else { wkDaySelected[daySelector] = true; }
    updateStack();
  	updateLine();
});

//---Update Views
function getDate(i) { return new Date(semester[semSelector][i])

}
function updateStack() {
  populateWeekArray(trafficByDay, getDate(0),  getDate(1), weekSelector, weekSelector+1);
}

function updateLine() {
    populateDayArray(trafficByFifteen, getDate(0),  getDate(1));

}

//------------------------------------------------------------------------
//---CSV Loading
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
    //populateWeekArray(trafficByDay, new Date('04/07/1996'), new Date('04/07/2020'), -100, 10);
})

// Array Objects Holding Aggregated Data
var trafficByFifteen = new Array(); 
var trafficByDay = new Array();

function processCsvData (data) {
  // populates array with every row in csv sheets 
  for (var row of data) {
    if (row.Dash == "DayTotals:") {
      // pushes each single-day-total onto an element
      trafficByDay.push ({
        Date: new Date(row.Date),
        Day: row.Day, Week: row.Week,
        DineIn: row.DineIn, DineOut: row.DineOut
      });
    } else {
      // processes time information
      var t = row.TimeIn;
      var j = t.indexOf(":");
      var hour = +t.substring(0, j);
      var noon = (t.substring(t.length-2, t.length-1) === "P") && (hour != 12);
      hour = (noon)? hour+=12 : hour;
      // defines a Date object
      var d = new Date(row.Date);
      d.setUTCHours(hour);
      d.setUTCMinutes(+t.substring(j+1, j+3));
      // populates row into object
      trafficByFifteen.push({ Date: d, DineIn: row.DineIn,  DineOut: row.DineOut });
    }
  }
}

// Data Array for Week Stack Plot
var weeklyData = [];
function populateWeekArray (a, d1, d3, w1, w3) {
  weeklyData = new Array;
  var max = 0;
  // initializes empty array
  for (var i = 0; i < 7; i++) 
    weeklyData.push({Day: i, DineIn: 0, DineOut: 0, Count: 0, AvgOut: 0, AvgIn: 0}); 
  // filter data 
  a = a.filter(function(d) { return +w1 <= +d.Week && +d.Week < +w3; });
  a = a.filter(function(d) { return +d1 <= +d.Date && +d.Date <= +d3; });
  for (var row of a) { 
    if (+row.DineIn != 0) {
      weeklyData[+row.Day].DineIn += +row.DineIn; 
      weeklyData[+row.Day].DineOut += +row.DineOut; 
      weeklyData[+row.Day].Count++;
    } 
  }
  // finds maximum
  for (var day of weeklyData) {
    day.AvgIn = day.DineIn / day.Count;
    day.AvgOut = day.DineOut / day.Count;
    max = (day.AvgIn > max)? day.AvgIn : max;
  }
  // weeklyData[8] stores maximum 
  weeklyData.push({Max: max});
}

//---Filtering 
// Filtering Conditions, update on handler click
var wkDaySelected = [true, true, true, true, true, true, true];
//dateData.filter(function(d) {return wkDaySelected[+d.Day];})
var dineIn = true;
var dineOut = true;

// Data Array for Day Line plot_height
var dailyData = [];
function populateDayArray (a, d1, d3) {
  dailyData = new Array;
  var max = 0;
  for (var i = 0; i < 52; i++) { 
    dailyData.push({ Time: (Math.floor(i/4)+7) + ":" + ((i%4)*15),
                  DineIn: 0, DineOut: 0, Count: 0, AvgIn: 0, AvgOut: 0}); }
  // filter option
  a = a.filter(function(d) { return +d1 <= +d.Date && +d.Date <= +d3; });
  a = a.filter(function(d) {return wkDaySelected[+d.Day];})
  for (var row of a) {
    var index = getArrayIndex(row.Date);
    if (0 <= index && index < 52){
      dailyData[index].DineIn += +row.DineIn;
      dailyData[index].DineOut += +row.DineOut;
      dailyData[index].Count++;
    }
  }
  // finds average data 
  for (var fifteen of dailyData) {
    fifteen.AvgIn = fifteen.DineIn / fifteen.Count;
    fifteen.AvgOut = fifteen.DineOut / fifteen.Count;
    max = (fifteen.AvgIn > max)? fifteen.AvgIn : max;
  }
  // dailyData[52] stores maximum within data
  dailyData.push({Max: max});
}

function getArrayIndex (d) {
  return (d.getUTCHours()-7)*4 + (d.getUTCMinutes()-1)/15;
}



//------------------------------------------------------------------------
//---SVG Drawing

// Builds an array of days of week
var daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
];

// Stacked bar chart
var stack = d3.stack()
	.keys(['AvgIn', 'AvgOut']);

// Manipulate data array to be able to create stacked bar chart
var stackedArr = stack(weeklyData);

// Set up the width and height of the entire SVG
var svg_width = 800;
var svg_height = 400;

// Set up margins for our plot area
var plot_left_margin = 30;
var plot_right_margin = 10;
var plot_top_margin = 30;
var plot_bottom_margin = 30;

// Compute available plot area now that we know the margins
var plot_width = svg_width - (plot_left_margin + plot_right_margin);
var plot_height = svg_height - (plot_top_margin + plot_bottom_margin);

// Sizing and spacing for plot components
var bar_width = 80;
var label_height = 12 // Does not change font size, just an estimate
var label_spacing = 8;

// Set-up scales for stacked bar chart
var xScale = d3.scale.Band()
	.domain(d3.range(weeklyData.length))
	.rangeRoundBands([0, plot_width], 0.05);

// Helper function to compute a bar's x position (left edge)
var bar_x_pos = function(d, i) {
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

var yScale = d3.scale.linear()
	.domain([0,
			d3.max(stackedArr, function(d) {
				return d3.max(d, function(d) {
					return d[0] + d[1];
				});
			})
	])
	.range([0, plot_height]);

// Create easy colors accessible from the 10-step ordinal scale
var colors = d3.scaleOrdinal(d3.schemeCategory10);

// Create SVG for stacked bar chart
var svg = d3.select('body')
	.append('svg')
	.attr('width', svg_width)
	.attr('height', svg_height);

// Add a group for each row of data
var groups = svg.selectAll('g')
	.data(stackedArr)
	.enter()
	.append('g')
	.style('fill', function(d, i) {
		return colors(i);
	});

// Add a rect for each data value
var rects = groups.selectAll('rect')
	.data(function(d) { return d; })
	.enter()
	.append('rect')
	.attr('x', function(d, i) {
		return xScale(i);
	})
	.attr('y', function(d) {
		return yScale(d[0]);
	})
	.attr('height', function(d) {
		return yScale(d[1]);
	})
	.attr('width', xScale.bandwidth() - 5);

// Generate our x-axis labels. Here we are searching for text tags with the
// class x-axis. This allows us to distinguish x-axis labels from other text.
svg.selectAll('text.x-axis')
	.data(daysOfWeek)
	.enter()
	.append('text')
		.attr('class', 'x-axis')
		.attr('x', function(d, i) {
			// The middle of the label is just half a bar's width to the right of the bar
			return xScale(i) + (xScale.bandwidth() - 5) / 2;
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
// Converts weeklyData into d3.stacks() format
var weeklyData_stacked = [];
function convertWeeklyData () {
  weeklyData_stacked = new Array;
  // pushes two array objects onto encapsulating array
  for (var i = 0; i < 2; i++) { weeklyData_stacked.push([]); }
  // pushes averages onto weekly data for d3
  for (var i = 0; i < weeklyData.length-1; i++) { 
    weeklyData_stacked[0].push({ x: i, y: weeklyData[i].AvgIn }); 
    weeklyData_stacked[1].push({ x: i, y: weeklyData[i].AvgOut }); 
  } 
}
*/


/*
// Line Graph dining hall traffic over time
var svg_height_2 = 800;
var svg_width_2 = 800;
var margin_2 = 100;
var plot_width_2 = svg_width - 2 * margin;
var plot_height_2 = svg_height - 2 * margin;

// Create SVG for line plot
var svg_2 = d3.select('body').append('svg')
.attr('width', svg_width_2)
.attr('height', svg_height);

// x-axis label
svg_2.append('text')
	.attr('class', 'x-axis')
	.attr('x', margin + plot_width / 2)
	.atter('y', 3/2 * margin + plot_height)
	.text('Time');

// y-axis label
svg_2.append('text')
   	.attr('class', 'y-axis')
    .attr('text-anchor', 'middle')
    .attr('transform',
      	'translate(' + margin/3 + ', ' + (plot_height / 2 + margin) + ')' +
      	'rotate(-90)')
    .text('Number of Swipes');

populateDayArray(trafficByFften, new Date("04/06/1997"), new Date("04/08/2019"));

var max_avgin_listing = d3.max(dayData.AvgIn);
var max_avgout_listing = d3.max(dayData.AvgOut);

var xscale = d3.scaleTime().range([0, width])
var yscale = d3.scaleLinear().
}
*/

