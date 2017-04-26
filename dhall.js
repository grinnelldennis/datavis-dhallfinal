//This code sets up handlers for all of our check boxes
// This code sets up a handler for the #monday 
d3.select('#monday')
  .on('change', function() {
    console.log(d3.select(this).node().checked);
  });

d3.csv("2016s.csv", function(dhall) {
	var svg_width = 800;
	var svg_height = 800;
	var margin = 100;
	var plot_width = svg_width - 2 * margin;
	var plot_height = svg_height - 2 * margin;

	// Data is arbitrary and will be taken from our .csv file
	var data = [{day:"Monday", swipes: "267"},
    {day:"Tuesday", swipes: "386"},
    {day:"Wednesday", swipes: "522"},
    {day:"Thursday", swipes: "200"},
    {day:"Friday", swipes: "473"},
    {day:"Saturday", swipes: "657"},
    {day:"Sunday", swipes: "482"}
	];

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
    })
