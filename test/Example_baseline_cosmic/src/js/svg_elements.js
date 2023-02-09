/* Create an svg element and display a linear curve
 *
 * @param dataset {array} - Array containing data to display
 * @param col {String} - Color of the display data
 */
function svg_gestion(dataset,col){
    var svg = d3.select("svg"),
            margin = 50,
            width = svg.attr("width") - margin -50, //300
            height = svg.attr("height") - margin -100 //200
  
        // Step 4 
        var xScale = d3.scaleLinear().domain([0, 1100]).range([0, width]),
            yScale = d3.scaleLinear().domain([0, 15]).range([height, 0]);
            
        var g = svg.append("g")
            .attr("transform", "translate(" + 100 + "," + 100 + ")");
  
        // Step 5
        // Title
        svg.append('text')
        .attr('x', width/2 + 100)
        .attr('y', 100)
        .attr('text-anchor', 'middle')
        .style('font-family', 'Helvetica')
        .style('font-size', 20)
        .text('Line Chart');
        
        // X label
        svg.append('text')
        .attr('x', width/2 + 100)
        .attr('y', height - 15 + 150)
        .attr('text-anchor', 'middle')
        .style('font-family', 'Helvetica')
        .style('font-size', 12)
        .text('Independant');
        
        // Y label
        svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', 'translate(60,' + height + ')rotate(-90)')
        .style('font-family', 'Helvetica')
        .style('font-size', 12)
        .text('Dependant');
  
        // Step 6
        g.append("g")
         .attr("transform", "translate(0," + height + ")")
         .call(d3.axisBottom(xScale));
        
        g.append("g")
         .call(d3.axisLeft(yScale));
        
        // Step 7
        svg.append('g')
        .selectAll("dot")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return xScale(d[0]); } )
        .attr("cy", function (d) { return yScale(d[1]); } )
        .attr("r", 3)
        .attr("transform", "translate(" + 100 + "," + 100 + ")")
        .style("fill", col);
  
        // Step 8        
        var line = d3.line()
        .x(function(d) { return xScale(d[0]); }) 
        .y(function(d) { return yScale(d[1]); }) 
        .curve(d3.curveMonotoneX)
        
        svg.append("path")
        .datum(dataset) 
        .attr("class", "line") 
        .attr("transform", "translate(" + 100 + "," + 100 + ")")
        .attr("d", line)
        .style("fill", "none")
        .style("stroke", col)
        .style("stroke-width", "2");
  
  
  }