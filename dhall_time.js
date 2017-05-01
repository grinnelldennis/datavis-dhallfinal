var dhall = crossfilter();
var dhallByWeek = dhall.dimension(d => d.week);
var dhallByDay = dhall.dimension(d => d.day);
var dhallByDate = dhall.dimension(d => d.date);


