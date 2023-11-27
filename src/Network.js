

import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';


export default function NetworkGraph(props){
  var margin = { top: 10, right: 0, bottom: 40, left: 0 },
  width = 400,
  height = 500;
  
  const [dataset, setDataset] = useState(null);
  const columns = ['Header_Length', 'Srate', 'rst_count', 'Radius', 'flow_duration', 'urg_count', 'Magnitude', 'syn_count'];
  let attacks = [];

  if (props.selectedAttacks && props.selectedAttacks.length > 0) {
    attacks = props.selectedAttacks;
  } else {
    attacks = ['BenignTraffic', 'MITM-ArpSpoofing', 'DDoS-ICMP_Fragmentation', 'Recon-OSScan', 'DNS_Spoofing', 'Mirai-udpplain', 'Mirai-greeth_flood', 'Mirai-greip_flood', 'DDoS-ICMP_Flood'];
  }

  async function fetchNetworkData(){
    fetch('JSON/network_data.json').then(d => {
      d.json().then(gd=>{
        // console.log('netData',gd)
        setDataset(gd);
      })
    })
  }
  useEffect(() => {
    fetchNetworkData()
  },[])

  useEffect(() => {
    if(dataset !== null) {
        function filterData(data, attacks) {
            return data.map(entry => {
                const filteredNodes = entry.nodes.filter(node => attacks.includes(node.label));
                const filteredLinks = entry.links.filter(link => attacks.includes(link.source) && attacks.includes(link.target));
                return { nodes: filteredNodes, links: filteredLinks };
            });
        }
        
        // Filter nodes and links based on attacks list and store in newData
        const filteredData = filterData(dataset, attacks);
        
        // console.log(filteredData[0]['nodes']);
        // console.log(filteredData[0]['links']);

        const colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(attacks);

        d3.select('#network_graph').select("svg").remove();
        var network_svg = d3.select('#network_graph').append("svg");
        network_svg
            .attr("width", 600)
            .attr("height", 400);

        const simulation = d3.forceSimulation(filteredData[0].nodes)
            .force('link', d3.forceLink(filteredData[0].links).id(d => d.label).distance(270))
            .force('charge', d3.forceManyBody().strength(-200))
            .force('center', d3.forceCenter((width / 1.35), height / 2.45));
        
        const link = network_svg.selectAll('.link')
            .data(filteredData[0].links)
            .enter()
                .append('line')
                .attr('class', 'link')
                .attr('stroke', '#aaa')
                .attr('stroke-width', d => Math.sqrt(d.similarity) * 2)
                .on('mouseover', handleMouseOver)
                .on('mouseout', handleMouseOut);
        
        function handleMouseOver(event, d) {
          const sourceAttack = d.source;
          const targetAttack = d.target;
          const similarity = d.similarity;

          const tooltip = d3.select('#network_graph').append('div')
            .attr('class', 'tooltip')
            .style('position', 'absolute')
            .style('background-color', 'rgba(255, 255, 255, 0.9)')
            .style('padding', '8px')
            .style('border', '1px solid #aaa')
            .style('border-radius', '4px')
            .html(`Cosine similarity between <strong>  ${sourceAttack.label} </strong> and <strong>${targetAttack.label}</strong><br>Similarity: ${similarity}`);
        
          tooltip.style('left', `${event.pageX}px`)
            .style('top', `${event.pageY}px`);
        }
        
        function handleMouseOut() {
          d3.select('.tooltip').remove();
        }

        const node = network_svg.selectAll('.node')
        .data(filteredData[0].nodes)
        .enter()
            .append('circle')
            .attr('class', 'node')
            .attr('r', 7)
            .attr('fill', d => colorScale(d.label))
            .call(drag(simulation));
      
        const nodeLabels = network_svg.selectAll('.node-label')
            .data(filteredData[0].nodes)
            .enter()
                .append('text')
                .attr('class', 'node-label')
                .text(d => d.label)
                .attr('font-size', '12px')
                .attr('dx', 15)
                .attr('dy', 4);
        
        simulation.on('tick', () => {
            link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);
        
            node
                .attr('cx', d => d.x)
                .attr('cy', d => d.y);
        
            nodeLabels
                .attr('x', d => d.x)
                .attr('y', d => d.y);
            });
        
        function drag(simulation) {
            function dragstarted(event, d) {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            }
        
            function dragged(event, d) {
                d.fx = event.x;
                d.fy = event.y;
            }
        
            function dragended(event, d) {
                if (!event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            }
        
            return d3.drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended);
            }
        

    }

  }, [dataset])


  return (
    <div>
      <h4>Similarity between attacks</h4>
      <div id="network_graph">
      </div>
    </div>
  );
}