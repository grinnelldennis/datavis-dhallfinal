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
var dailyData = [];
function populateDayArray (a, d1, d3) {
  dailyData = new Array;
  var max = 0;
  for (var i = 0; i < 52; i++) { 
    dailyData.push({ Time: (Math.floor(i/4)+7) + ":" + ((i%4)*15),
                  DineIn: 0, DineOut: 0, Count: 0, AvgIn: 0, AvgOut: 0}); }
  // filter option
  a = a.filter(function(d) { return +d1 <= +d.Date && +d.Date <= +d3; });
  for (var row of a) {
    var index = getArrayIndex(row.Date);
    if (0 <= index && index < 52){
      dailyData[index].DineIn += +row.DineIn;
      dailyData[index].DineOut += +row.DineOut;
      dailyData[index].Count++;
    }
  }
  // aggregates data 
  for (var j = 0; j < 52; j++) {
    dailyData[j].AvgIn = dailyData[j].DineIn / dailyData[j].Count;
    dailyData[j].AvgOut = dailyData[j].DineOut / dailyData[j].Count;
    max = (dailyData[j].AvgIn > max)? dailyData[j].AvgIn : max;
  }
  // dailyData[52] stores maximum within data
  dailyData.push({Max: max});
}

function getArrayIndex (d) {
  return (d.getUTCHours()-7)*4 + (d.getUTCMinutes()-1)/15;
}

// Data Array for Week Stack Plot
var weeklyData = [];
function populateWeekArray (a, d1, d3, w1, w3) {
  weeklyData = new Array;
  var max = 0;
  // initialize empty array
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
  // finding maximum
  for (var j = 0; j < 7; j++){ 
    weeklyData[j].AvgIn = weeklyData[j].DineIn / weeklyData[j].Count;
    weeklyData[j].AvgOut = weeklyData[j].DineOut / weeklyData[j].Count;
    max = (weeklyData[j].AvgIn > max)? weeklyData[j].AvgIn : max;
  }
  // initilizing 8th cell to store maximum 
  weeklyData.push({Max: max});
}

// Converts weeklyData into d3.stacks() format
var weeklyData_stacked = [];
function convertWeekData () {
  // pushes two array objects onto encapsulating array
  for (var i = 0; i < 2; i++) { weeklyData_stacked.push([]); }
  // pushes averages onto weekly data for d3
  for (var i = 0; i < 7; i++) { weeklyData_stacked[0].push({ x: i, y: weeklyData[i].AvgIn }); } 
  for (var i = 0; i < 7; i++) { weeklyData_stacked[1].push({ x: i, y: weeklyData[i].AvgOut }); } 
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
			trafficByFifteen.push({ Date: d, DineIn: row.DineIn,	DineOut: row.DineOut });
		}
	}
}




