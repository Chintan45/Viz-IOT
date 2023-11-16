import * as d3 from "d3";
import React, { useEffect, useRef, useState } from "react";

const ScatterPlot = (props) => {
  const svgRef = useRef();
  const [scatterPlotData, setScatterPlotData] = useState(null);

  async function fetchScatterPlotData() {
    try {
      const response = await fetch("JSON/scatter-plot_Size_data.json");
      const data = await response.json();

      console.log(data);

      setScatterPlotData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    fetchScatterPlotData();
  }, []);

  useEffect(() => {
    if (scatterPlotData) {
      const selectedAttacks =
        props.selectedAttacks && props.selectedAttacks.length > 0
          ? props.selectedAttacks
          : scatterPlotData.map((d, i) => {
              if (i < 5) return d.label;
            });

      const filteredData = scatterPlotData.filter((d) =>
        selectedAttacks.includes(d.label)
      );

      // Set up dimensions and margins
      const margin = { top: 40, right: 50, bottom: 50, left: 60 }; // Increased right margin
      const width = 500 - margin.left - margin.right;
      const height = 500 - margin.top - margin.bottom;

      // Create SVG container
      const svg = d3
        .select(svgRef.current)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Extract unique labels and assign colors
      const labels = Array.from(new Set(filteredData.map((d) => d.label)));
      const colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(labels);

      // Calculate the maximum values for x and y axes across all datasets
      const maxDuration = d3.max(filteredData, (d) => d3.max(d.Duration));
      const maxTotSize = d3.max(filteredData, (d) => d3.max(d["Tot size"]));

      // Create scales with common axes
      const xScale = d3
        .scaleLinear()
        .domain([0, maxDuration])
        .range([0, width]);
      const yScale = d3
        .scaleLinear()
        .domain([0, maxTotSize])
        .range([height, 0]);

      // Add X-axis
      svg
        .append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale))
        .append("text")
        .attr("x", width / 2)
        .attr("y", 30)
        .attr("fill", "#000")
        .text("Duration");

      // Add Y-axis
      svg
        .append("g")
        .call(d3.axisLeft(yScale))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("x", -height / 2)
        .attr("dy", "1em")
        .attr("fill", "#000")
        .text("Total Size");

      // Add scatter plot points
      filteredData.forEach((dataset, i) => {
        svg
          .selectAll(`circle-${i}`)
          .data(dataset.Duration)
          .enter()
          .append("circle")
          .attr("cx", (d) => xScale(d))
          .attr("cy", (d, j) => yScale(dataset["Tot size"][j]))
          .attr("r", 5)
          .attr("fill", colorScale(dataset.label))
          .append("title")
          .text(
            (d, j) =>
              `${dataset.label}: Duration=${d}, Tot Size=${dataset["Tot size"][j]}`
          );
      });

      // Add legend
      const legend = svg
        .selectAll(".legend")
        .data(labels)
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => `translate(${width - 200},${i * 30})`); // Adjusted legend position

      legend
        .append("rect")
        .attr("x", 0)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", colorScale);

      legend
        .append("text")
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text((d) => d);
    }
  }, [scatterPlotData]);

  return (
    <>
      <h4>Total size of different attacks by duration</h4>
      <svg ref={svgRef}></svg>
    </>
    // <canvas id="scatterPlotCanvas"></canvas>
  );
};

export default ScatterPlot;
