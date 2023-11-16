import React, { useEffect } from 'react';
import * as d3 from 'd3';

export default function ViolinPlot(props) {
  useEffect(() => {
    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 10, bottom: 120, left: 40 },
      width = 600 - margin.left - margin.right,
      height = 300 - margin.top;

    // Remove existing SVG element
    d3.select("#d3-violin-plot svg").remove();

    // append the svg object to the body of the page
    var svg = d3.select("#d3-violin-plot")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    d3.json('JSON/violin-plot_Duration_data.json').then((data) => {

      const selectedAttacks = props.selectedAttacks && props.selectedAttacks.length > 0
      ? props.selectedAttacks
      : data.map(d => d.label);

      // console.log("SelectedAttacks: ", selectedAttacks)
      const filteredData = data.filter(d => selectedAttacks.includes(d.label));

      // Build and Show the Y scale
      var y = d3.scaleLinear()
        // .domain([0, d3.max(data, d => d3.max(d.Duration))])
        .domain([0, d3.max(filteredData, d => d3.max(d.Duration))])
        .range([height, 0]);

      svg.append("g").call(d3.axisLeft(y));

      // Build and Show the X scale
      var x = d3.scaleBand()
        .range([0, width])
        .domain(filteredData.map(d => d.label))
        .padding(0.5);

      svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("transform", "rotate(-45)");

      // Features of the histogram
      var histogram = d3.histogram()
        .domain(y.domain())
        .thresholds(y.ticks(20))
        .value(d => d);

      // Compute the binning for each group of the dataset
      var sumstat = filteredData.map(function (group) {
        return {
          key: group.label,
          value: histogram(group.Duration)
        };
      });

      // What is the biggest number of value in a bin?
      var maxNum = d3.max(sumstat, d => d3.max(d.value, a => a.length));

      // The maximum width of a violin must be x.bandwidth
      var xNum = d3.scaleLinear()
        .range([0, x.bandwidth()])
        .domain([-maxNum, maxNum]);

      // Add the shape to this svg!
      svg
        .selectAll("myViolin")
        .data(sumstat)
        .enter()
        .append("g")
        .attr("transform", d => "translate(" + x(d.key) + " ,0)")
        .append("path")
        .datum(d => d.value)
        .style("stroke", "none")
        .style("fill", "#69b3a2")
        .attr("d", d3.area()
          .x0(d => xNum(-d.length))
          .x1(d => xNum(d.length))
          .y(d => y(d.x0))
          .curve(d3.curveCatmullRom)
        );
    });

    // Cleanup function
    return () => {
      // Cleanup code if needed
    };
  }, []); // Empty dependency array ensures this effect runs once after the initial render

  return (
    <div>
      <h1>Violin Plot</h1>
      <div id="d3-violin-plot"></div>
    </div>
  );
}
