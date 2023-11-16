import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";

const LineChart = (props) => {
  const chartRef = useRef();

  const [lineChartData, setLineChartData] = useState(null);

  async function fetchLineChartData() {
    try {
      const response = await fetch("JSON/line_plot_data.json");
      const data = await response.json();

      console.log(data);

      setLineChartData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    fetchLineChartData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("JSON/line_plot_data.json");
        const data = await response.json();
        drawChart(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const drawChart = (data) => {
    const svg = d3.select(chartRef.current);
    svg.selectAll("*").remove(); // Clear existing content

    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (entry) => d3.max(entry.Duration))])
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (entry) => d3.max(entry.Rate))])
      .range([height, 0]);

    const line = d3
      .line()
      .x((entry) => xScale(entry.Duration))
      .y((entry) => yScale(entry.Rate));

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    data.forEach((entry, index) => {
      svg
        .append("path")
        .datum(entry)
        .attr("fill", "none")
        .attr("stroke", colorScale(index))
        .attr("stroke-width", 2)
        .attr("d", line);
    });

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    svg.append("g").call(d3.axisLeft(yScale));
  };

  return <svg ref={chartRef}></svg>;
};

export default LineChart;
