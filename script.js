/* 
COLOR PALETTE
Dark Gray: #080708
Light Gray: #e6e8e6
Blue: #3772ff
Red: #df2935
Yellow: #fdca40
*/

d3.csv("./data/Top100Chains1.csv").then(function(data) {

    // SVG CANVAS

    const width = document.querySelector("#chart").clientWidth;
    const height = document.querySelector("#chart").clientHeight;
    const margin = {top: 50, left: 150, right: 50, bottom: 150};

    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // ADDING G ELEMENT

    const g = svg.append("g");

    // FILTERS

    const filtered_2019 = data.filter(function(d) { return d.year == 2019;
    });

    const filtered_2020 = data.filter(function(d) { return d.year == 2020;
    });

    // MIN MAX 

    const units = {
        min2019: d3.min(filtered_2019, function(d) { return +d.units - 300; }),
        max2019: d3.max(filtered_2019, function(d) { return +d.units + 300; }),
        min2020: d3.min(filtered_2020, function(d) { return +d.units - 300; }),
        max2020: d3.max(filtered_2020, function(d) { return +d.units + 300; })
    };

    const sales = {
        min2019: d3.min(filtered_2019, function(d) { return +d.sales - 100; }),
        max2019: d3.max(filtered_2019, function(d) { return +d.sales + 100; }),
        min2020: d3.min(filtered_2020, function(d) { return +d.sales - 100; }),
        max2020: d3.max(filtered_2020, function(d) { return +d.sales + 100; })
    };

    // SCALES 

    const xScale = d3.scaleLinear()
        .domain([units.min2019, units.max2019])
        .range([margin.left, width-margin.right]);

    const yScale = d3.scaleLinear()
        .domain([sales.min2019, sales.max2019])
        .range([height-margin.bottom, margin.top]);

    const rScale = d3.scaleSqrt()
        .domain([8.5, 12.5])
        .range([5,15]);

    const colorScale = d3.scaleOrdinal()
        .domain(["yes", "no"])
        .range(["#080708", "#e6e8e6"]);

    // DRAW CIRCLES 

    let points = g.selectAll("circle")
    .data(filtered_2019, function(d) { return d.chain; })
    .enter()
    .append("circle")
        .attr("cx", function(d) { return xScale(d.units); })
        .attr("cy", function(d) { return yScale(d.sales); })
        .attr("r", function(d) { return rScale(d.workerPay); })
        .attr("fill", function(d) { return colorScale(d.franchise); })
        .attr("fill-opacity", .6);

    // DRAW AXIS

    const xAxis = g.append("g")
        .attr("class","axis")
        .attr("transform", `translate(0,${height-margin.bottom})`)
        .call(d3.axisBottom().scale(xScale));

    const yAxis = g.append("g")
        .attr("class","axis")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft().scale(yScale));

    // AXIS LABELS
    
    const xAxisLabel = g.append("text")
    .attr("class","axisLabel")
    .attr("x", width/2)
    .attr("y", height-margin.bottom/2)
    .attr("fill", "white")
    .text("Number of Restaurants");

    const yAxisLabel = g.append("text")
    .attr("class","axisLabel")
    .attr("transform","rotate(-90)")
    .attr("x",-height/2)
    .attr("y",margin.left/2)
    .attr("fill", "white")
    .text("Sales (in Millions)");

    // TOOLTIP 

    let tooltip = d3.select("#chart")
        .append("div")
        .attr("class", "tooltip");

    g.selectAll("circle").on("mouseover", function(e, d) {

        let cx = +d3.select(this).attr("cx")+20;
        let cy = +d3.select(this).attr("cy")-10;

        let roundedSales = Math.round(d.sales * 100) / 100;
        let roundedUnits = Math.round(d.units);

        tooltip.style("visibility","visible") 
            .style("left", `${cx}px`)
            .style("top", `${cy}px`)
            .html(`<b>Chain:</b> ${d.chain}<br><b>Number of Restaurants:</b> ${roundedUnits}<br><b>Sales</b>: $${roundedSales} million<br><b>Avg. Worker Pay:</b> $${d.workerPay}`);

        d3.select(this)
            .attr("stroke","#fdca40")
            .attr("stroke-width",2);

    }).on("mouseout", function() {

        tooltip.style("visibility","hidden");

        d3.select(this)
            .attr("stroke","none")
            .attr("stroke-width",0);
            
    });

    

    // DATA UPDATE 

    d3.select("#year2019").on("click", function() {

        let enterPoints = svg.selectAll("circle")
            .data(filtered_2019, function(d) { return d.chain; });

        enterPoints.enter()
            .append("circle")
                .attr("cx", function(d) { return xScale(d.units); })
                .attr("cy", function(d) { return yScale(d.sales); })
                .attr("fill", function(d) { return colorScale(d.franchise); })
        .merge(enterPoints)
            .transition()
            .duration(1500)
            .attr("cx", function(d) { return xScale(d.units); })
            .attr("cy", function(d) { return yScale(d.sales); })
            .attr("fill", function(d) { return colorScale(d.franchise); });

        enterPoints.exit()
            .transition()
            .duration(1500)
            .attr("r", 0)
            .remove();

    });


    d3.select("#year2020").on("click", function() {

        let enterPoints = svg.selectAll("circle")
            .data(filtered_2020, function(d) { return d.chain; });

        enterPoints.enter()
            .append("circle")
                .attr("cx", function(d) { return xScale(d.units); })
                .attr("cy", function(d) { return yScale(d.sales); })
                .attr("fill", function(d) { return colorScale(d.franchise); })
        .merge(enterPoints)
            .transition()
            .duration(1500)
            .attr("cx", function(d) { return xScale(d.units); })
            .attr("cy", function(d) { return yScale(d.sales); })
            .attr("fill", function(d) { return colorScale(d.franchise); });

        enterPoints.exit()
            .transition()
            .duration(1500)
            .attr("r", 0)
            .remove();

    });

    // ZOOM

        const zoom = d3.zoom()
            .scaleExtent([1,10])
            .on('zoom', zoomed);

        svg.call(zoom);

        let k = 1;
        let tX = 0;
        let tY = 0;

        function zoomed(e) {

            k = e.transform.k;
            tX = e.transform.x;
            tY = e.transform.y;

            g.attr("transform", e.transform);
            g.selectAll("circle").attr("r", function() {
                return +this.attr("r")/k;
            });

        }

    // CHECKBOX FILTERING

    d3.selectAll(".segment--option").on("click", function() {
        
        let thisSegment = d3.select(this).property("value");
        let isChecked = d3.select(this).property("checked");

        let selection = points.filter(function(d) {
            return d.segment === thisSegment;
        });

        if(isChecked == true) {
            selection.attr("opacity", 1)
                .attr("pointer-events", "all");
        } else {
            selection.attr("opacity", 0)
                .attr("pointer-events", "none");
        };

    });

});