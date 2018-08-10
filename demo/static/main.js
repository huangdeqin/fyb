$(function() {

	var draw_accusation_probability = function (data) {
			$("#accusation-display").empty();

			data = data.sort(function(a, b) {
				return d3.ascending(a.value, b.value);
			});

			var margin = {
	            top: 15,
	            right: 25,
	            bottom: 15,
	            left: 60
        	};

			var width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        var svg = d3.select("#accusation-display").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var x = d3.scale.linear()
            .range([0, width])
            .domain([0, d3.max(data, function (d) {
                return d.value;
            })]);

        var y = d3.scale.ordinal()
            .rangeRoundBands([height, 0], .1)
            .domain(data.map(function (d) {
                return d.name;
            }));

        //make y axis to show bar names
        var yAxis = d3.svg.axis()
            .scale(y)
            //no tick marks
            .tickSize(0)
            .orient("left");

        var gy = svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)

        var bars = svg.selectAll(".bar")
            .data(data)
            .enter()
            .append("g")

        //append rects
        bars.append("rect")
            .attr("class", "bar")
            .attr("y", function (d) {
                return y(d.name);
            })
            .attr("height", y.rangeBand())
            .attr("x", 0)
            .attr("width", function (d) {
                return x(d.value);
            });

        //add a value label to the right of each bar
        bars.append("text")
            .attr("class", "label")
            //y position of the label is halfway down the bar
            .attr("y", function (d) {
                return y(d.name) + y.rangeBand() / 2 + 4;
            })
            //x position is 3 pixels to the right of the bar
            .attr("x", function (d) {
                return x(d.value) + 3;
            })
            .text(function (d) {
                return d.value;
            });
	}

	// click button
	$("#predict").click(function(){
		console.log("I am clicked");

		// ajax call to predict
		$.post( "/predict", 
			{'fact': $("#fact").val()},
			function( data ) {
				console.log(data);
				var fact = data.fact;
				var accusation = data.accusation;
				var term = data.term;
				$('#fact-display').text('fact: ' + fact);
				// $('#accusation-display').text("accusation: " + accusation);
				$('#term-display').text("term: " + term);
				draw_accusation_probability(accusation)
			});
	});
});
