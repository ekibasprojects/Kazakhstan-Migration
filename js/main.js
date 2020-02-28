var originGeo = [66.9237, 48.0196];
var currentYear = 2000;
var speed = 2800;//km/sec
var maxHeadCount = 0;
var migration, worldCountries;
var aggregatedData;
Promise.all([
    d3.csv("data/migration.csv"),
    d3.json('data/world_countries.json')

]).then(function(files) {
    migration = files[0];
    worldCountries = files[1];
    init();
}).catch(function(err) {
    console.error("Error:", err);
});



function init() {
	aggregatedData = {};

	for(var i=0;i<migration.length;i++) {
		var mEntry = migration[i];
		if(!aggregatedData.hasOwnProperty(mEntry.year)) {
			aggregatedData[mEntry.year] = [];
		}
		if(!aggregatedData[mEntry.year].some(function(entry) { return entry.country == mEntry.country })) {
			aggregatedData[mEntry.year].push({
				country: mEntry.country,
				lat: parseFloat(mEntry.lat),
				lon: parseFloat(mEntry.lon),
				in: parseInt(mEntry.in),
				out: parseInt(mEntry.out)
			});
		}
		if(parseInt(mEntry.in) >= maxHeadCount) {
			maxHeadCount = parseInt(mEntry.in);
		}
		if(parseInt(mEntry.out) >= maxHeadCount) {
			maxHeadCount = parseInt(mEntry.out);
		}
	}

	drawMap();
	drawTornadoChart();
}

function onSliderChange() {
	currentYear = document.getElementById('year-slider').value;
	drawMap();
	drawTornadoChart();
}

function drawMap() {
	// var tooltip = d3.select("#map .tooltip")
	// 		    .attr("class", "tooltip")				
	// 		    .style("opacity", 0);

	var margin = {top: 0, right: 20, bottom: 0, left: 30},
	            width = d3.select("#map").node().getBoundingClientRect().width - margin.left - margin.right,
	            height = d3.select("#map").node().getBoundingClientRect().height - margin.top - margin.bottom;

	d3.selectAll("#map .chart").selectAll("*").remove();
	var svg = d3.select("#map .chart")
	            .attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")")

	var projection = d3.geoMercator()
	                   	.scale(150)
	                  	.translate( [width/2, 400]);

	var path = d3.geoPath().projection(projection);

	svg.append("g")
		.attr("class", "countries")
		.selectAll("path")
	  	.data(worldCountries.features)
		.enter().append("path")
		.attr("d", path)
		// .style("fill", '#ddd')
		.style('stroke', 'white')		
		.style("opacity", 1)
		.style('stroke-width', 1)
		.on('mouseover',function(d){
			// tooltip.text(d.properties.name)
			// 	.style('opacity', 1);
			// appData.hoveredCountry = d.properties.name;
			
			// updateMap();
			// updateLineChart();
			// updateLeadersChart();
		})
		.on('mouseout', function(d){
			// tooltip.text(d.properties.name)
			// 	.style('opacity', 0);
			// appData.hoveredCountry = "";
			
			// updateMap();
			// updateLineChart();
			// updateLeadersChart();
		})
		.on('mousemove',function(d){
			// var mouse = d3.mouse(d3.event.target);
			// tooltip.style('left', mouse[0] + 10 + "px")
			// 	.style('top', mouse[1] - 10 + "px")
		})
		.on('click', function(d){

		})
		.attr("pointer-events", "all");

	/**********************************************/

	var data = aggregatedData[currentYear];
	var arcGroup = svg.append('g').attr('class', 'm-lines')
    
    var linksIn = getMigrationLines(data, 'in');
    var pathArcsIn = arcGroup.selectAll(".arc-in")
        .data(linksIn)
		.enter()
        .append("path")
        .attr('class', 'arc-in')
        .style('fill', 'none')
        .attr('d', function(lineString) {
			var originPos = projection(originGeo);  
			var destinationPos = projection(lineString.coordinates[0]);  
		
			var d = {
				origin: { x: originPos[0], y: originPos[1]},
				destination: { x: destinationPos[0], y: destinationPos[1]}
			};
			var s = false;
			if (d.destination.x > d.origin.x) {
				s = true;
			}
			return getArc(d, s, 'in');
        })
        // .style('stroke', '#0000ff')
        .style('stroke-width', 0.5)
        .style('opacity', 0.7)


		// pathArcsIn.transition()
		// 	.duration(function(lineString) {
		// 		var destinationGeo = lineString.coordinates[0];
		// 		var distance = calculateDistance(originGeo[1], originGeo[0], destinationGeo[1], destinationGeo[0]);
		// 		return calculateDuration(distance);
		// 	})
		// 	.attrTween('stroke-dasharray', function() {
		// 		var len = this.getTotalLength();
		// 		return function(t) {
		// 			return (d3.interpolate('0,' + len, len + ',0'))(t)
		// 		};
		// 	});

		pathArcsIn.exit().remove();


	var linksOut = getMigrationLines(data, 'out');
	var pathArcsOut = arcGroup.selectAll(".arc-out")
        .data(linksOut)
		.enter()
        .append("path")
        .attr('class', 'arc-out')
        .style('fill', 'none')
        .attr('d', function(lineString) {
			var originPos = projection(originGeo);  
			var destinationPos = projection(lineString.coordinates[0]);  

			



			// var destination = this.destinations[index];  
			// var originPos = projection(this.originGeo);  
			// var destinationPos = projection(destination.coord);  
			// var connection = [ originPos, destinationPos ];  
			// var destinationName = destination.name;  
			// var originGeo = this.originGeo;  
			// var destinationGeo = destination.coord;  
			// var distance = calculateDistance(originGeo[1], originGeo[0], destinationGeo[1], destinationGeo[0]);  
			// var duration = calculateDuration(distance);  




		
			var d = {
				origin: { x: originPos[0], y: originPos[1]},
				destination: { x: destinationPos[0], y: destinationPos[1]}
			};
			var s = false;
			if (d.destination.x > d.origin.x) {
				s = true;
			}
			return getArc(d, s, 'out');
        })
        // .style('stroke', '#ff0000')
        .style('stroke-width', 0.5)
        .style('opacity', 0.7)
        
  //       pathArcsOut.transition()
		// .duration(function(lineString) {
		// 	var destinationGeo = lineString.coordinates[0];
		// 	var distance = calculateDistance(originGeo[1], originGeo[0], destinationGeo[1], destinationGeo[0]);
		// 	return calculateDuration(distance);
		// })
		// .attrTween('stroke-dasharray', function() {
		// 	var len = this.getTotalLength();
		// 	return function(t) {
		// 		return (d3.interpolate('0,' + len, len + ',0'))(t)
		// 	};
		// });

		pathArcsOut.exit().remove();
}

function getArc(d, s, migrationType) {  
	var dx = d.destination.x - d.origin.x;
	var dy = d.destination.y - d.origin.y;
	var dr = Math.sqrt(dx * dx + dy * dy) - 40*Math.random();
	var spath;
	if(migrationType == 'in') {
		spath = s == false ? ' 0 0,0 ' : ' 0 0,1 ';
	} else {
		spath = s == false ? ' 0 0,1 ' : ' 0 0,0 ';
	}

	return 'M' + d.origin.x + ',' + d.origin.y + 'A' + dr + ',' + dr + spath + d.destination.x + ',' + d.destination.y;
}

function calculateDistance(lat1, lon1, lat2, lon2) {  
	var p = 0.017453292519943295;
	var c = Math.cos;
	var a = 0.5 - c((lat2 - lat1) * p)/2 + c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))/2;
	return 12742 * Math.asin(Math.sqrt(a));
}

function calculateDuration(distance) {
        return (distance / speed) * 1000;
      }

function getMigrationLines(data, migrationType) {
	var links = [];
	for(var i=0; i<data.length; i++){
    	var lineCount = getLineCount(data[i][migrationType]);
    	for(var j=0;j<lineCount;j++) {
    		links.push({
	            type: "LineString",
	            coordinates: [
	                [ parseFloat(data[i].lon), parseFloat(data[i].lat) ],
	                originGeo
	            ],
	            country: data[i].country
	        });
    	}
    }
    return links;
}

function getLineCount(headcount) {
	// return Math.ceil(headcount/10)
	return Math.ceil(Math.log10(headcount));
}

function drawTornadoChart() {
	var data = aggregatedData[currentYear];
	var chart = tornadoChart();
  	d3.select("body")
		.datum(data)
		.call(chart);
	tornadoLegend();
}

function tornadoChart() {
	var legendHeight = d3.select("#tornado-chart .legend").node().getBoundingClientRect().height;
	var margin = {top: 20, right: 30, bottom: 20, left: 80},
		width = d3.select("#tornado-chart").node().getBoundingClientRect().width - margin.left - margin.right,
		height = d3.select("#tornado-chart").node().getBoundingClientRect().height - margin.top - margin.bottom - legendHeight;

	var x = d3.scaleSymlog()
		// .domain([10, 100000])
		.range([0, width]);

	var y = d3.scaleBand()
		.rangeRound([0, height]).padding(0.1);

	var xAxis = d3.axisBottom()
		.scale(x)
		.tickValues([-100000, -10000, -1000, -100, -10, 0, 10, 100, 1000, 10000, 100000])
		// .ticks(10)

	var yAxis = d3.axisLeft()
		.scale(y)
		.tickSize(0)

	d3.selectAll("#tornado-chart .chart").selectAll("*").remove();
	var svg = d3.select("#tornado-chart .chart")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
    	.append("g")
		.attr("transform", "translate(" + margin.left + ", 0)");


	svg.append("rect")
		.attr("class", "grid-background")
		.attr("width", width)
		.attr("height", height);

	// svg.append("g")
	// 	.attr("class", "grid")
		// .attr("transform", "translate(0," + height + ")")
		
		// .selectAll(".tick")
		// .data(x.ticks(10), function(d) { return d; })
		// .exit()
		// .classed("minor", true);

	function chart(selection) {
		selection.each(function(data) {
			var maxIn = d3.max(data, function(d) { return d.in });
			var maxOut = d3.max(data, function(d) { return d.out });
			x.domain([-maxHeadCount, maxHeadCount]).nice();
			y.domain(data.map(function(d) { return d.country }));

			// var minInteractions = Math.min.apply(Math, data.map(function(o){return o.interactions;}))
			yAxis.tickPadding(Math.abs(x(maxHeadCount) - x(0)) + 10);

			svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + height + ")")
				.call(xAxis.scale(x).ticks().tickSize(-height))
				.call(xAxis)
				.classed("minor", true);

			svg.append("g")
				.attr("class", "y axis")
				.attr("transform", "translate(" + x(0) + ",0)")
				.call(yAxis);

			var bar = svg.selectAll(".bar")
				.data(data)

			bar.enter().append("rect")
				.attr("class", "bar bar-in")
				.attr("x", function(d) { return x(Math.min(0, d.in)); })
				.attr("y", function(d) { return y(d.country); })
				.attr("width", function(d) { return Math.abs(x(d.in) - x(0)); })
				.attr("height", y.bandwidth())

			bar.enter().append("rect")
				.attr("class", "bar bar-out")
				.attr("x", function(d) { return x(Math.min(0, -d.out)); })
				.attr("y", function(d) { return y(d.country); })
				.attr("width", function(d) { return Math.abs(x(d.out) - x(0)); })
				.attr("height", y.bandwidth())

			bar.enter().append('text')
				.attr("text-anchor", "middle")
				.attr("x", function(d,i) {
				  return x(Math.min(0, d.in)) + (Math.abs(x(d.in) - x(0)) / 2);
				})
				.attr("y", function(d,i) {
				  return y(d.country) + (y.bandwidth() / 2);
				})
				.attr("dy", ".35em")
				.text(function (d) { return d.in ? d.in : ""; })

			bar.enter().append('text')
				.attr("text-anchor", "middle")
				.attr("x", function(d,i) {
				  return x(Math.min(0, -d.out)) + (Math.abs(x(d.out) - x(0)) / 2);
				})
				.attr("y", function(d,i) {
				  return y(d.country) + (y.bandwidth() / 2);
				})
				.attr("dy", ".35em")
				.text(function (d) { return d.out ? d.out : ""; })
		});
	}

	return chart;
}

function tornadoLegend() {
	var margin = {top: 20, right: 30, bottom: 40, left: 80},
		width = d3.select("#tornado-chart").node().getBoundingClientRect().width - margin.left - margin.right,
		height = d3.select("#tornado-chart .legend").node().getBoundingClientRect().height;

	var boxSize = 15;

	d3.selectAll("#tornado-chart .legend").selectAll("*").remove();
	var svg = d3.select("#tornado-chart .legend")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height)
    	.append("g")
		.attr("transform", "translate(" + margin.left + ", 0)");


	svg.append("rect")
		.attr("width", boxSize)
		.attr("height", boxSize)
		.attr("class", "bar-out");
	svg.append("text")
		.attr("text-anchor", "left")
		.attr("x", function() {
		  return boxSize + 5;
		})
		.attr("y", function(d,i) {
		  return boxSize/2;
		})
		.attr("dy", ".35em")
		.text("Emigration")

	var xOffset = 90;
	svg.append("rect")
		.attr("width", boxSize)
		.attr("height", boxSize)
		.attr("x", xOffset)
		.attr("class", "bar-in");
	svg.append("text")
		.attr("text-anchor", "left")
		.attr("x", function() {
		  return boxSize + xOffset + 5;
		})
		.attr("y", function(d,i) {
		  return boxSize/2;
		})
		.attr("dy", ".35em")
		.text("Immigration (number of people)")
}

