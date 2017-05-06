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
