// Some array to hold all data
var someArray = {}; 

// Populating something with every row in csv sheets 
for (var row in 2015spring) {
	// pre-process time information
	// time conversion
	var time = row.TimeIn;
	var apm = time.substring(6,7);
	var hour = parseInt(time.substring(0, 2));
	hour = (ampm === "P")? hour+=12 : hour;

	// setting time
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




// --TESTING--

// AM/PM TO 24 HOUR CONVERSION  
// Given time = "hh:mm PM"
//	substr( ]	"01234567"
var apm = time.substring(6,7);
var hour = parseInt(time.substring(0, 2));

function(sTime) {
	hour = (apm === "P")? hour+=12 : hour;
}




