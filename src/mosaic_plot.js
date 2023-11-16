import React, { useEffect } from 'react';
import * as d3 from 'd3';

export default function MosaicPlot(props) {
  useEffect(() => {
    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 10, bottom: 120, left: 40 },
      width = 600 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;

    // Remove existing SVG element
    d3.select("#d3-mosaic-plot svg").remove();

    // append the svg object to the body of the page
    var svg = d3.select("#d3-mosaic-plot")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    // Load data from JSON file
    d3.json("JSON/mosaic_plot_data.json").then(data => {
      // Convert the data to long format
      const longData = data.flatMap(entry => {
        const label = entry.label;
        const variables = Object.keys(entry).filter(key => key !== "label");
        return variables.flatMap(variable => entry[variable].map(value => ({ label, variable, value })));
      });

      // Set up scales
      const xScale = d3.scaleBand().range([0, width]).padding(0.1);
      const yScale = d3.scaleLinear().range([height, 0]);

      // Assign data to scales
      xScale.domain(longData.map(d => `${d.label} - ${d.variable}`));
      yScale.domain([0, d3.max(longData, d => d.value)]);

      // Create rectangles for the mosaic plot
      svg.selectAll("rect")
        .data(longData)
        .enter().append("rect")
        .attr("x", d => xScale(`${d.label} - ${d.variable}`))
        .attr("y", d => yScale(d.value))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - yScale(d.value))
        .attr("fill", "steelblue");

      // Add axes
      svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

      svg.append("g")
        .call(d3.axisLeft(yScale));
    });
  }, []);

  return (
    <div id="d3-mosaic-plot"></div>
  );
}
