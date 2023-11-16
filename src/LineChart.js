import React, { useEffect } from 'react';
import * as d3 from 'd3';

export default function LinePlot(props) {
  useEffect(() => {
    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 10, bottom: 120, left: 40 },
      width = 500 - margin.left - margin.right+ 300,
      height = 300 - margin.top + 100;

    // Remove existing SVG element
    d3.select("#d3-line-plot svg").remove();

    // append the svg object to the body of the page
    var svg = d3
      .select("#d3-line-plot")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.json("JSON/line_plot_data.json").then((data) => {
      const selectedAttacks =
        props.selectedAttacks && props.selectedAttacks.length > 0
          ? props.selectedAttacks
          : data.map((d) => d.label);

      // Filter data based on selected attacks
      const filteredData = data.filter((d) =>
        selectedAttacks.includes(d.label)
      );

      // Build and Show the X scale
      var x = d3
        .scaleLinear()
        .domain([0, d3.max(filteredData, (d) => d3.max(d.Duration))])
        .range([0, width]);

      svg.append("g").call(d3.axisBottom(x)).attr("transform", "translate(0," + height + ")");

      // X-axis label
      svg
        .append("text")
        .attr("transform", "translate(" + width / 2 + " ," + (height + margin.top + 40) + ")")
        .style("text-anchor", "middle")
        .text("Duration");

      // Build and Show the Y scale
      var y = d3
        .scaleLinear()
        .domain([0, d3.max(filteredData, (d) => d3.max(d.Header_Length))])
        .range([height, 0]);

      svg.append("g").call(d3.axisLeft(y));

      // Y-axis label
      svg
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left - 5)
        .attr("x", 0 - height / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Header Length");

      // Create a color scale
      var color = d3.scaleOrdinal(d3.schemeCategory10);

      // Add a legend for each label
      var legend = svg.selectAll(".legend")
        .data(filteredData.map((d) => d.label)) // Use the labels from your data
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => `translate(${width - 220},${i * 30 + 200})`); // Adjusted the legend position

      legend.append("rect")
        .attr("x", 0)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", (d, i) => color(i)); // Use the color scale

      legend.append("text")
        .attr("x", 26)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text((d) => d);

      // Add a line for each dataset
      filteredData.forEach((dataset, i) => {
        svg
          .append("path")
          .datum(dataset.Duration.map((d, j) => ({ x: d, y: dataset.Header_Length[j] })))
          .attr("fill", "none")
          .attr("stroke", color(i)) // Use the color scale
          .attr("stroke-width", 2)
          .attr(
            "d",
            d3
              .line()
              .x((d) => x(d.x))
              .y((d) => y(d.y))
          );
      });
    });

    // Cleanup function
    return () => {
      // Cleanup code if needed
    };
  }, []); // Empty dependency array ensures this effect runs once after the initial render

  return (
    <div>
      <h4>Line Plot</h4>
      <p>Header Length vs Duration for individual attacks</p>
      <div id="d3-line-plot"></div>
    </div>
  );
}