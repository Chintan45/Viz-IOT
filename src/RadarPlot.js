// refernce
//   https://benclinkinbeard.com/d3tips/log-and-power-scales/#:~:text=experiment%20with%20it.-,Log%20scales,-Whereas%20power%20scales
//   https://gist.github.com/nbremer/21746a9668ffdf6d8242
//   https://stackoverflow.com/questions/74406811/d3-js-spider-radar-chart-multiple-scales-on-axes

import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';


export default function RadarChart3(props){
  var radar_margin = { top: 10, right: 0, bottom: 40, left: 0 },
  radar_width = 400,
  radar_height = 300;
  
  const [dataset, setDataset] = useState(null);
  const columns = ['Header_Length', 'Srate', 'rst_count', 'Radius', 'flow_duration', 'urg_count', 'Magnitude', 'syn_count'];
  let attacks = [];

  if (props.selectedAttacks && props.selectedAttacks.length > 0) {
    attacks = props.selectedAttacks.slice(0, 5); // Keep only the first 5 attacks
  } else {
    attacks = ['DDoS-ICMP_Flood', 'DDoS-UDP_Flood'];
  }

  async function fetchRadarData(){
    fetch('JSON/radar_data.json').then(d => {
      d.json().then(gd=>{
        // console.log('radarData',gd)
        setDataset(gd);
      })
    })
  }
  useEffect(() => {
    fetchRadarData()
  },[])

  const colors = ["blue", "orange", "yellow", "green"];
  const colorScheme = () => {
    if(attacks.length == 0) return colors.slice(0, 2)
    else if (attacks.length >= colors.length) return colors.slice(0, colors.length)
    else return colors.slice(0, attacks.length)
  }

  var radar_color = d3
        .scaleOrdinal()
        .range(colorScheme());

  var options = {
    w: radar_width,
    h: radar_height,
    margin: radar_margin,
    maxValue: 0.5,
    levels: 4,
    roundStrokes: true,
    color: radar_color,
  };
  var cfg = {
    w: 400,				//Width of the circle
    h: 320,				//Height of the circle
    margin: { top: 10, right: 10, bottom: 40, left: 50 }, //The margins of the SVG
    levels: 3,				//How many levels or inner circles should there be drawn
    maxValue: 0, 			//What is the value that the biggest circle will represent
    labelFactor: 1.25, 	//How much farther than the radius of the outer circle should the labels be placed
    wrapWidth: 60, 		//The number of pixels after which a label needs to be given a new line
    opacityArea: 0.5, 	//The opacity of the area of the blob
    dotRadius: 4, 			//The size of the colored circles of each blog
    opacityCircles: 0.1, 	//The opacity of the circles of each blob
    strokeWidth: 2, 		//The width of the stroke around each blob
    roundStrokes: false,	//If true the area and stroke will follow a round path (cardinal-closed)
    color: d3.scaleOrdinal(d3.schemeCategory10)           //Color function
  };

  //Put all of the options into a variable called cfg
  if ("undefined" !== typeof options) {
    for (var i in options) {
      if ("undefined" !== typeof options[i]) {
        cfg[i] = options[i];
      }
    } //for i
  } //if
  var radius = Math.min(cfg.w/3, cfg.h/2.8); 	//Radius of the outermost circle
  const scaleList = React.useMemo(() => ({  
      "Header_Length": [4000, 7500, 15000, 22500, 2112448.50],//"Header_Length"
      "Srate": [0, 5000, 10000, 15000, 16000],//"Srate"
      "rst_count": [0, 375, 750, 1125, 1500],//"rst_count"
      "Radius": [0, 200, 400, 600, 800],//"Radius"
      "flow_duration": [0, 175, 350, 525, 700],//"flow_duration"
      "urg_count": [0, 100, 200, 300, 400],//"urg_count"
      "Magnitude": [0, 12, 25, 36, 50],//"Magnitude"
      "syn_count": [0, 0.5, 1, 1.5, 1]//"syn_count"
    }), [])

  const rScaleList = React.useMemo(() => ({
    "Header_Length": d3.scaleLinear().range([0, radius]).domain([0, scaleList['Header_Length'][4]]), // "Header_Length"
    "Srate": d3.scaleLog().range([0, radius]).domain([100, scaleList['Srate'][4]]), // "Srate"
    "rst_count": d3.scaleLog().range([0, radius]).domain([0.001, scaleList['rst_count'][4]]), // "rst_count":
    "Radius": d3.scaleLinear().range([0, radius]).domain([100, scaleList['Radius'][4]]), // "Radius"
    "flow_duration": d3.scaleLog().range([0, radius]).domain([0.001, scaleList['flow_duration'][4]]), // "flow_duration":
    "urg_count": d3.scaleLog().range([0, radius]).domain([0.1, scaleList['urg_count'][4]]), // "urg_count"
    "Magnitude": d3.scaleLinear().range([0, radius]).domain([10, scaleList['Magnitude'][4]]), // "Magnitude"
    "syn_count": d3.scaleLinear().range([0, radius]).domain([0.001, scaleList['syn_count'][4]]), // "syn_count"
  }), []);

  var legendData = attacks.map((attack, index) => ({
    name: attack,
    color: cfg.color(index),
  }));

  useEffect(() => {
    if(dataset !== null) {
        function transformData(attacks, dataset, columns, rScaleList) {
          const result = [];
          for (const i in attacks) {
            const transformedArray = Object.entries(dataset[attacks[i]])
              .filter(([axis, value]) => columns.includes(axis))
              .map(([axis, value]) => ({ 
                axis, 
                value: value, 
                scale: rScaleList[axis]
              }));
            result.push(transformedArray);
          }
          return result;
        }
        
        const data = transformData(attacks, dataset, columns, rScaleList);
        console.log(data);
      
      var allAxis = (data[0].map(function(i, j){return i.axis}));	//Names of each axis
      var total = allAxis.length;					//The number of different axes

      var Format = d3.format('.1f');			 	//Percentage formatting
      var angleSlice = (Math.PI * 2) / total;		//The width in radians of each "slice"




      d3.select('#radar_chart3').select("svg").remove();
      //Initiate the radar chart SVG
      var rdr_svg = d3.select('#radar_chart3').append("svg");
      rdr_svg
        .attr("width",  400)
        .attr("height", 320)
        .attr("class", "radar" + '#radar_chart3');
      //Append a g element		
      var g = rdr_svg.append("g")
        .attr("transform", "translate(" + (cfg.w/2 + cfg.margin.left) + "," + cfg.h/2  + ")");

      
      //Filter for the outside glow
      var filter = g.append("defs").append("filter").attr("id", "glow"),
      feGaussianBlur = filter
        .append("feGaussianBlur")
        .attr("stdDeviation", "1.8")
        .attr("result", "coloredBlur"),
      feMerge = filter.append("feMerge"),
      feMergeNode_1 = feMerge.append("feMergeNode").attr("in", "coloredBlur"),
      feMergeNode_2 = feMerge.append("feMergeNode").attr("in", "SourceGraphic");
  
      //Wrapper for the grid & axes
      var axisGrid = g.append("g").attr("class", "axisWrapper");

      //Draw the background circles
      axisGrid.selectAll(".levels")
        .data(d3.range(1,(cfg.levels+1)).reverse())
        .enter()
          .append("circle")
          .attr("class", "gridCircle")
          .attr("r", function(d, i){return (radius/cfg.levels)*d;})
          .style("fill", "#CDCDCD")
          .style("stroke", "#CDCDCD")
          .style("fill-opacity", cfg.opacityCircles)
          .style("filter" , "url(#glow)");
          

      //Create the straight lines radiating outward from the center
      var axis = axisGrid.selectAll(".axis")
        .data(allAxis)
        .enter()
          .append("g")
          .attr("class", "axis");
        
      //scale
      for (let echelleNumero = 0; echelleNumero < columns.length; echelleNumero++) {
        axis
          .append("text")
          .attr("class", "textscale")
          .style("font-size", "10px")
          .attr("fill", "#0a0a0a")
        //   .data(scaleList[echelleNumero])
          .data(d3.range(0, 100+1, 25))
          .attr("x", 4) // decale echelle  en abscisse
          .attr("dy", "-8")
          .attr("y", function (d, i) {
            return (-radius * i) / 5;
          }) // gere espacement entre données en y
          .attr("transform", function (d, i) {
            var angleI = (angleSlice * echelleNumero * 180) / Math.PI; // the angle to rotate the label
            var flip = angleI < 90 || angleI > 270 ? false : true; // 180 if label needs to be flipped
            if (flip == true) {
              return "rotate(" + angleI + ")";
            } else {
              return "rotate(" + angleI + ")";
            }
          })
          .text(function (d) { 
            if (echelleNumero == 0) {
                return d + ' %';
              } else {
                if (d != 0) {
                  return d + ' %';
                } else {
                  return;
                }
              }
          });
      }
      // append the line
      axis.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", function(d, i){ return radius * Math.cos(angleSlice*i - Math.PI/2); })
        .attr("y2", function(d, i){ return radius * Math.sin(angleSlice*i - Math.PI/2); })
        .attr("class", "line")
        .style("stroke", "white")
        .style("stroke-width", "2px");

      //Append the labels at each axis
      axis
        .append("text")
        .attr("class", "legend")
        .style("font-size", "11px")
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .attr("dy", "1px")
        .attr("x", function (d, i) {
          return radius * 1.3 * Math.cos(angleSlice * i - Math.PI / 2);
        })
        .attr("y", function (d, i) {
          return radius * 1.25 * Math.sin(angleSlice * i - Math.PI / 2);
        })
        .text(function (d) {
          return d;
        })
        .call(wrap, cfg.wrapWidth);


      //The radial line function
      var radarLine = d3.lineRadial()
        .curve(d3.curveLinearClosed)
        .radius(function(d, i) { 
          return d.scale(d.value); 
        })
        .angle(function(d, i) { return i * angleSlice; });
		
      if(cfg.roundStrokes) {
        radarLine.curve(d3.curveLinearClosed);
      }

      //Create a wrapper for the blobs	
      var blobWrapper = g.selectAll(".radarWrapper")
        .data(data)
        .enter()
          .append("g")
          .attr("class", "radarWrapper");
      
      //Append the backgrounds	
      blobWrapper
        .append("path")
        .attr("class", "radarArea")
        .attr("d", function(d,i) { return radarLine(d); })
        .style("fill", function(d,i) { return cfg.color(i); })
        .style("fill-opacity", cfg.opacityArea)
        .on('mouseover', function (d,i){
          //Dim all blobs
          d3.selectAll(".radarArea")
            .transition().duration(200)
            .style("fill-opacity", 0.1); 
          //Bring back the hovered over blob
          d3.select(this)
            .transition().duration(200)
            .style("fill-opacity", 0.7);	
        })
        .on('mouseout', function(){
          //Bring back all blobs
          d3.selectAll(".radarArea")
            .transition().duration(200)
            .style("fill-opacity", cfg.opacityArea);
        });

      //Create the outlines	
      blobWrapper.append("path")
        .attr("class", "radarStroke")
        .attr("d", function(d,i) { return radarLine(d); })
        .style("stroke-width", cfg.strokeWidth + "px")
        .style("stroke", function(d,i) { return cfg.color(i); })
        .style("fill", "none")
        .style("filter" , "url(#glow)");
      
      //Append the circles
      blobWrapper.selectAll(".radarCircle")
        .data(function(d,i) { return d; })
        .enter().append("circle")
        .attr("class", "radarCircle")
        .attr("r", cfg.dotRadius)
        .attr("cx", function(d,i){ 
          let ggg = d.scale(d.value) * Math.cos(angleSlice*i - Math.PI/2);
          return ggg;
        })
        .attr("cy", function(d,i){ return d.scale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
        .style("fill", function(d,i,j) { return cfg.color(j); })
        .style("fill-opacity", 0.8);

      
      //Wrapper for the invisible circles on top
      var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
        .data(data)
        .enter().append("g")
        .attr("class", "radarCircleWrapper");


      //Append a set of invisible circles on top for the mouseover pop-up
      blobCircleWrapper.selectAll(".radarInvisibleCircle")
        .data(function(d,i) { return d; })
        .enter().append("circle")
        .attr("class", "radarInvisibleCircle")
        .attr("r", cfg.dotRadius*1.5)
        .attr("cx", function(d,i){ return d.scale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
        .attr("cy", function(d,i){ return d.scale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseover", function(e, d) {
          let newX = parseFloat(d3.select(this).attr('cx')) - 10;
          let newY = parseFloat(d3.select(this).attr('cy')) - 10;
          rdr_tooltip
            .attr('x', newX)
            .attr('y', newY)
            .text(Format(d.value))
            .transition().duration(200)
            .style('opacity', 1);
        })
        .on("mouseout", function(){
          rdr_tooltip.transition().duration(200).style("opacity", 0);
        });
      
      //Set up the small tooltip for when you hover over a circle
      var rdr_tooltip = g.append("text")
        .attr("class", "tooltip")
        .style("opacity", 0);

      //Taken from http://bl.ocks.org/mbostock/7555321
      //Wraps SVG text	
      function wrap(text, width) {
        text.each(function() {
        var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.4, // ems
          y = text.attr("y"),
          x = text.attr("x"),
          dy = parseFloat(text.attr("dy")),
          tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
          
        while ((word = words.pop())) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
          }
        }
        });
      }//wrap	
      



    }


  }, [dataset])


  return (
    <div>
      <h3>Attribute contribution over attack</h3>
      <p>(Max 5 attacks can be visualized)</p>
      <div id="radar_chart3">

      </div>
    </div>
  );
};