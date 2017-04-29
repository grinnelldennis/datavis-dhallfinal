//This code sets up handlers for all of our check boxes
// This code sets up a handler for the #monday 
d3.select('#monday')
  .on('change', function() {
    console.log(d3.select(this).node().checked);
  });

var someArray = new Array(); 
var dayTotalArray = new Array();

// Loading csv data using d3
d3.queue()
	.defer(d3.csv, 'formatted csv/2014f.csv')
	.defer(d3.csv, 'formatted csv/2015f.csv')
	.defer(d3.csv, 'formatted csv/2015s.csv')
	.defer(d3.csv, 'formatted csv/2016s.csv')
	.await(function(error, f2014, f2015, s2015, s2016) {

		/* PROCESSING DATA */
		// Some array to hold all data
		console.log("queued");

		// Populating something with every row in csv sheets 
		for (var row of f2014) {
			if (row.Dash == " Day Totals:") {
				// pushing single day totals onto separate array
				dayTotalArray.push ({
					date: new Date(row.Date),
					day: row.Day,
					week: row.Week,
					dineIn: row.DineIn,
					dineOut: row.DineOut
				});
				console.log("pushed " + row);
			} else {
				// pre-process time information
				var time = row.TimeIn;
				var i = time.length;
				var apm = time.substring(i-2,i-1);
				var hour = parseInt(time.substring(0, 2));
				hour = (apm === "P")? hour+=12 : hour;

				// writing time into a Date object
				var date = new Date(row.Date);
				date.setHours(hour);
				date.setMinutes(time.substring(3, 5));

				// popuating row onto object
				someArray.push({
					timeStamp: date,
					dineIn: row.DineIn,
					dineOut: row.DineOut
				});
				
			}
		}

		console.log(someArray);
		console.log(dayTotalArray);
})

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