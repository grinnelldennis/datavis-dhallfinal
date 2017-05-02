### populateArray

```java
@param  a   an array
@param  d1  a date object
@param  d3  a date object
```

`populateArray()` takes an array `a`, filters the element to fit within the range range between two date objects `d1` and `d3` into the array `dayData`. 

`dayData` represents aggregate traffic the dinning hall receives within a specific date range specified by `d1` and `d2`. It is a fixed size array with length 53, where [0] to [51] contains a traffic headcount from 7AM to 8PM, its normal operation hour, at 15-minute intervals. For example, traffic during 7:00AM to 7:15AM occupies `dayData[0]`, where as `dayData[51]` contains that of 7:45PM to 8:00PM. Element [52] contains the maximum of all traffic in all given elements within `dayData` array. Each one of the first 52 elements contains:
- `Time`, a string representation of time with hour and minute in 24-hours
- `DineIn`, a number of all traffic dinning in within the 15-minute period
- `DineOut`, a number of all traffic dinning out within the 15-minute period
- `Count`, the number of days aggregated in the 15-minute period
- `AvgIn`, the average number of dine-in traffic within the 15-minute period over `Count` days
- `AvgOut`, the average number of dine-out traffic within the 15-minute period over `Count` days




