@Ben: I am going to omit the last element for both arrays and make them separate fields (probably a global) the next time I push a change. Depending on what you need I could also include a sum attribute for each of the objects. 

### populateDayArray()

```java
@param  a   an array
@param  d1  a date object
@param  d3  a date object
```

`populateDayArray()` takes an array `a`, filters the element to fit within the date and time range between two date objects `d1` and `d3` into the array `dayData`. 

`dayData` represents aggregate traffic the dinning hall receives during for each 15-minute interval within a specific date range specified by `d1` and `d2` over a day. It is a fixed size array with length 53, where [0] to [51] contains a traffic headcount from 7AM to 8PM, its normal operation hour, at 15-minute intervals. For example, traffic during 7:00AM to 7:15AM occupies `dayData[0]`, where as `dayData[51]` contains that of 7:45PM to 8:00PM. Element [52] contains the maximum of all traffic in all given elements within `dayData` array. Each one of the first 52 elements contains:
- `Time`, a string representation of time with hour and minute in 24-hours
- `DineIn`, a number of all traffic dinning in within the 15-minute period
- `DineOut`, a number of all traffic dinning out within the 15-minute period
- `Count`, the number of days aggregated in the 15-minute period
- `AvgIn`, the average number of dine-in traffic within the 15-minute period over `Count` days
- `AvgOut`, the average number of dine-out traffic within the 15-minute period over `Count` days



### populateWeekArray()

```java
@param  a   an array // 
@param  d1  a date object
@param  d3  a date object
@param  w1  a number
@param  w3  a number
```

`populateWeekArray()` takes an array `a`, filters the element to fit within the date range between two date objects `d1` and `d3` into the array `weekData`. Additionally, it has the capability to fliter by week number inclusive of `w1` and exclusive of `w2` during a semester, where the week 1 is defined as *the first full week of class*.

`weekData` represents daily aggregate traffic the dinning hall receives within a specific date range specified by `d1`,`d3`,`w1` and `w3` over a week. It is a fixed size array with length 8, where [0] to [6] contains a traffic headcount from Sunday to Saturday, its normal operation week, for each day. For example, total traffic recorded during Sunday occupies `weekData[0]`, where as `weekData[6]` contains that of Saturday. Element [7] contains the maximum single daily traffic of all days within `weekData` array. Each one of the first 7 elements contains:
- `Day`, a numerial representation for the day of the week
- `DineIn`, a number of all traffic dinning in within the day
- `DineOut`, a number of all traffic dinning out within the day
- `Count`, the number of days aggregated for each day of the week
- `AvgIn`, the average number of dine-in traffic within the day of the week over `Count` days
- `AvgOut`, the average number of dine-out traffic within the day of the week period over `Count` days



### Examples

- `populateDayArray(trafficByFften, new Date("04/06/2015"), new Date("04/07/2015"))` filters and populates `dayData[]` with data between APR06/15 to APR07/15.
- `dayData` shows 52 objetcs containing the data
- `dayData[index].AvgIn` & `dayData[index].AvgOut` would provide the necessary data to plot the graph.
- `dayData[7]` would provide the `Max` field needed for scaling. 





