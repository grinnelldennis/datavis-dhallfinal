

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

console.log("Hello")
