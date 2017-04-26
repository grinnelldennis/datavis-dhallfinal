// Some array to hold all data
var someArray = {}; 
var dayTotalArray = {};

// Populating something with every row in csv sheets 
for (var row in 2015spring) {
	if (row.dash === "Day Totals:") {
		// pushing single day totals onto separate array
		dayTotalArray.push ({
			date: new Date(row.Date),
			day: row.Day,
			week: row.Week,
			dineIn: row.DineIn;
			dineOut: row.Dine;
		})
	} else {
		// pre-process time information
		var time = row.TimeIn;
		var apm = time.substring(6,7);
		var hour = parseInt(time.substring(0, 2));
		hour = (ampm === "P")? hour+=12 : hour;

		// writing time into a Date object
		var date = new Date(row.Date);
		date.setHours(hour);
		date.setMinutes(time.substring(3, 5));

		// popuating row onto object
		someArray.push({
			timeStamp: date,
			dineIn: row.DineIn;
			dineOut: row.Dine;
		})
	}
}


// --TESTING--

// AM/PM TO 24 HOUR CONVERSION  
// Given time = "hh:mm PM"
//	substr( ]	"01234567"
var apm = time.substring(6,7);
var hour = parseInt(time.substring(0, 2));

function(sTime) {
	hour = (apm === "P")? hour+=12 : hour;
}




