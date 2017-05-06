//------------------------------------------------------------------------
// Global filtering options
var diningin = false;
var togo = false;
var weekSelector = 0;
var wkDaySelected = [true, true, true, true, true, true, true];
var semSelector = 0;
var semester = [["06/01/2014", "06/01/2016"],
          ["06/01/2014", "01/01/2015"],
          ["01/01/2015", "06/01/2015"],
          ["06/01/2015", "01/01/2016"],
          ["01/01/2016", "06/01/2016"]];


//------------------------------------------------------------------------
//---Check Boxes Handlers  (Thomas Pitcher)

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
    var daySelector = d3.select(this).node().value;
    wkDaySelected = [false, false, false, false, false, false, false];
    if (daySelector == 0) {
		  wkDaySelected = [true, true, true, true, true, true, true];
    }	else { wkDaySelected[daySelector] = true; }
    updateStack();
  	updateLine();
});


//------------------------------------------------------------------------
//---Update Views (Thomas & Dennis)

// Helper that returns a Date object corresponding to correct semester date range
function getDate(i) { return new Date(semester[semSelector][i]); }

function updateStack() {
  populateWeekArray(trafficByDay, getDate(0),  getDate(1));
  displayStackedBar();
}

function updateLine() {
  populateDayArray(trafficByFifteen, getDate(0),  getDate(1));
  displayLineChartSvg();
}


//------------------------------------------------------------------------
//---CSV Loading  (Dennis)

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

    // display default graphs
    updateStack();
    updateLine();
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


//------------------------------------------------------------------------
//---Array Filtering (Dennis)

// Data Array for Week Stack Plot
var weeklyData = [];
function populateWeekArray (a, d1, d3) {
  console.log("d1, "+ d1 +" ;d2, "+ d3 +" ;wk, "+ weekSelector +" ;sem, "+semSelector);
  weeklyData = new Array;
  var max = 0;
  // initializes empty array
  for (var i = 0; i < 7; i++) 
    weeklyData.push({Day: i, DineIn: 0, DineOut: 0, Count: 0, AvgOut: 0, AvgIn: 0}); 
  // filter data 
  if (weekSelector != 0) 
    a = a.filter(function(d) { return +weekSelector <= +d.Week && +d.Week < +weekSelector+1; });
  a = a.filter(function(d) { return +d1 <= +d.Date && +d.Date <= +d3; });
  for (var row of a) { 
    if (+row.DineIn != 0) {
      weeklyData[+row.Day].DineIn += +row.DineIn; 
      weeklyData[+row.Day].DineOut += +row.DineOut; 
      weeklyData[+row.Day].Count++;
      if (+row.Day == 6) {console.log(row);}
    } 
  }
  // finds maximum
  for (var day of weeklyData) {
    day.AvgIn = day.DineIn / day.Count;
    day.AvgOut = day.DineOut / day.Count;
    max = (day.AvgIn+day.AvgOut > max)? day.AvgIn+day.AvgOut : max;
  }
  // weeklyData[7] stores maximum 
  weeklyData.push({Max: max});
}

// Data Array for Day Line 
var dailyData = [];
function populateDayArray (a, d1, d3) {
  dailyData = new Array;
  var max = 0;
  for (var i = 0; i < 52; i++) { 
    dailyData.push({ Time: (Math.floor(i/4)+7) + ":" + ((i%4)*15),
                  DineIn: 0, DineOut: 0, Count: 0, AvgIn: 0, AvgOut: 0}); }
  // filter option
  console.log(a.length);
  a = a.filter(function(d) { return +d1 <= +d.Date && +d.Date <= +d3; });
  console.log(a.length);
  //a = a.filter(function(d) {return wkDaySelected[+d.Day];})
  console.log(a.length);
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
    max = (fifteen.AvgIn+fifteen.AvgOut > max)? fifteen.AvgIn+fifteen.AvgOut : max;
  }
  // dailyData[52] stores maximum within data
  dailyData.push({Max: max});
}

function getArrayIndex (d) {
  return (d.getUTCHours()-7)*4 + (d.getUTCMinutes()-1)/15;
}


//------------------------------------------------------------------------
//---SVG Drawing, Line 

function displayLineChartSvg() {

  // Set-up for stacked bar chart
  var stack = d3.stack()
    .keys(['AvgIn', 'AvgOut']);

  // Manipulate data array to be able to create stacked bar chart
  var stackedArr = stack(dailyData);

  // Set-up scales for stacked bar chart
  var xScale = d3.scaleBand()
    .domain(d3.range(dailyData.length-1))
    .range([0, plot_width], 0.05);

  var yScale = d3.scaleLinear()
    .domain([0, dailyData[52].Max])
    .range([plot_height, 0]);

  // Create easy colors accessible from the 10-step ordinal scale
  var colors = d3.scaleOrdinal(d3.schemeCategory10);

  // Create SVG for stacked bar chart
  var svg_day = d3.select('body')
    .append('svg')
    .attr('width', svg_width)
    .attr('height', svg_height);

  // Add a group for each row of data
  var groups = svg_day.selectAll('h')
    .data(stackedArr)
    .enter()
    .append('g')
    .style('fill', function(d, i) {
      return colors(i);
    });

  // Add a rect for each data value
  var rects = groups.selectAll('rect.d')
    .data(function(d) { return d; })
    .enter()
    .append('rect')
    .attr('x', function(d, i) {
      return xScale(i) + 2 * margin;
    })
    .attr('y', function(d) {
      return yScale(d[1]) + margin;
    })
    .attr('height', function(d) {
      return yScale(d[0]) - yScale(d[1]);  
    })
    .attr('width', xScale.bandwidth() - 5);


  // Generate our x-axis labels. Here we are searching for text tags with the
  // class x-axis. This allows us to distinguish x-axis labels from other text.
  svg_day.selectAll('text.x-axis.d')
    .data(dailyData)
    .enter()
    .append('text')
      .attr('class', 'x-axis')
      .attr('x', function(d, i) {
        // The middle of the label is just half a bar's width to the right of the bar
        return xScale(i) + margin*2.15;
      })
      .attr('y', margin + plot_height + label_spacing + label_height)
          .attr('text-anchor', 'middle')
      .text(function(d, i) { 
        if (i % 4== 0) 
          return d.Time +"0"; });

  // x-axis title
  svg_day.append('text')
      .attr('class', 'x-axis')
      .attr('x', plot_width / 2)
      .attr('y', 2 * margin + plot_height + label_height)
      .text('Time During Day');

  // Add the rotated y-axis title
  svg_day.append('text')
    .attr('class', 'y-axis')
    .attr('text-anchor', 'middle')
    .attr('transform',
      // Translate and rotate the label into place. This rotates the label
        // around 0,0 in its original position, so the label rotates around its
        // center point
        'translate(' + margin/3 + ', ' + (plot_height / 2 + margin) + ')' + 
        'rotate(-90)')
    .text('Number of Swipes');

  // Create x-axis and y-axis
  var xaxis = d3.axisBottom(xScale);
  var yaxis = d3.axisLeft(yScale);


  svg_day.append('g')
      .attr('transform', 'translate(' + 2 * margin + ', ' + (plot_height + margin) + ')')
      .call(xaxis);

  svg_day.append('g')
      .attr('transform', 'translate(' + 2 * margin + ', ' + margin + ')')
      .call(yaxis);



}




//------------------------------------------------------------------------
//---SVG Drawing, Stacked Bars (Ben)

// Set up the width and height of the entire SVG
var svg_width = 800;
var svg_height = 600;
var margin = 30;

// Compute available plot area now that we know the margins
var plot_width = svg_width - 5/2 * margin;
var plot_height = svg_height - 5/2 * margin;

// Sizing and spacing for plot components
var label_height = 12 // Does not change font size, just an estimate
var label_spacing = 16;

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

function displayStackedBar() {
	
  // Set-up for stacked bar chart
  var stack = d3.stack()
    .keys(['AvgIn', 'AvgOut']);

  // Manipulate data array to be able to create stacked bar chart
  var stackedArr = stack(weeklyData);

  // Set-up scales for stacked bar chart
  var xScale = d3.scaleBand()
    .domain(d3.range(weeklyData.length-1))
    .range([0, plot_width], 0.05);

  var yScale = d3.scaleLinear()
    .domain([0, weeklyData[7].Max])
    .range([plot_height, 0]);

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
      return xScale(i) + 2 * margin;
    })
    .attr('y', function(d) {
      return yScale(d[1]) + margin;
    })
    .attr('height', function(d) {
      return yScale(d[0]) - yScale(d[1]);  
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
        return 68 + xScale(i) + (xScale.bandwidth() - 5) / 2;
      })
      .attr('y', margin + plot_height + label_spacing + label_height)
          .attr('text-anchor', 'middle')
      .text(function(d) { return d; });

  // x-axis title
  svg.append('text')
      .attr('class', 'x-axis')
      .attr('x', plot_width / 2)
      .attr('y', 2 * margin + plot_height + label_height)
      .text('Days of the Week');

  // Add the rotated y-axis title
  svg.append('text')
    .attr('class', 'y-axis')
    .attr('text-anchor', 'middle')
    .attr('transform',
      // Translate and rotate the label into place. This rotates the label
        // around 0,0 in its original position, so the label rotates around its
        // center point
        'translate(' + margin/3 + ', ' + (plot_height / 2 + margin) + ')' + 
        'rotate(-90)')
    .text('Number of Swipes');

  // Create x-axis and y-axis
  var xaxis = d3.axisBottom(xScale);
  var yaxis = d3.axisLeft(yScale);


  svg.append('g')
      .attr('transform', 'translate(' + 2 * margin + ', ' + (plot_height + margin) + ')')
      .call(xaxis);

  svg.append('g')
      .attr('transform', 'translate(' + 2 * margin + ', ' + margin + ')')
      .call(yaxis);
}

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
populateDayArray(trafficByFifteen, new Date("04/06/1997"), new Date("04/08/2019"));
var max_avgin_listing = d3.max(dayData.AvgIn);
var max_avgout_listing = d3.max(dayData.AvgOut);
var xscale = d3.scaleTime().range([0, width])
var yscale = d3.scaleLinear().
}
*/
