import React, { useEffect } from 'react';
import * as d3 from 'd3';

export default function LinePlot(props) {
  useEffect(() => {
    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 10, bottom: 120, left: 40 },
      width = 500 - margin.left - margin.right,
      height = 300 - margin.top;

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

      // svg.append("g").call(d3.axisBottom(x));

      // Build and Show the Y scale
      var y = d3
        .scaleLinear()
        .domain([0, d3.max(filteredData, (d) => d3.max(d.Header_Length))])
        .range([height, 0]);

      svg.append("g").call(d3.axisLeft(y));

      // Create a color scale
      var color = d3.scaleOrdinal(d3.schemeCategory10);

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
      <h1>Line Plot</h1>
      <div id="d3-line-plot"></div>
    </div>
  );
}























// --------
// import React, { useState, useEffect, useRef } from "react";
// import * as d3 from "d3";

// const LineChart = (props) => {
//   const chartRef = useRef();

//   const [lineChartData, setLineChartData] = useState(null);

//   async function fetchLineChartData() {
//     try {
//       const response = await fetch("JSON/line_plot_data.json");
//       const data = await response.json();

//       console.log(data);

//       setLineChartData(data);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   }

//   useEffect(() => {
//     fetchLineChartData();
//   }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch("JSON/line_plot_data.json");
//         const data = await response.json();
//         drawChart(data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   const drawChart = (data) => {
//     const svg = d3.select(chartRef.current);
//     svg.selectAll("*").remove(); // Clear existing content

//     const margin = { top: 20, right: 20, bottom: 30, left: 50 };
//     const width = 600 - margin.left - margin.right;
//     const height = 400 - margin.top - margin.bottom;

//     const xScale = d3
//       .scaleLinear()
//       .domain([0, d3.max(data, (entry) => d3.max(entry.Duration))])
//       .range([0, width]);

//     const yScale = d3
//       .scaleLinear()
//       .domain([0, d3.max(data, (entry) => d3.max(entry.Header_Length))])
//       .range([height, 0]);

//     const line = d3
//       .line()
//       .x((entry) => xScale(entry.Duration))
//       .y((entry) => yScale(entry.Header_Length));

//     const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

//     data.forEach((entry, index) => {
//       svg
//         .append("path")
//         .datum(entry)
//         .attr("fill", "none")
//         .attr("stroke", colorScale(index))
//         .attr("stroke-width", 2)
//         .attr("d", line);
//     });

//     svg
//       .append("g")
//       .attr("transform", `translate(0,${height})`)
//       .call(d3.axisBottom(xScale));

//     svg.append("g").call(d3.axisLeft(yScale));
//   };

//   return <svg ref={chartRef}></svg>;
// };

// export default LineChart;
