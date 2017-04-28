// Loading Data
d3.queue()
	.defer(d3.csv, 'formattedCsv/2014f.csv')
	.defer(d3.csv, 'formattedCsv/2015f.csv')
	.defer(d3.csv, 'formattedCsv/2015s.csv')
	.defer(d3.csv, 'formattedCsv/2016s.csv')
	.await(function(error, 2014f, 2015f, 2015s, 2016s)) {

		// process data



	}