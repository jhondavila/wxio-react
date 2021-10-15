// BarChart.js
// import * as d3 from 'd3';
// import React from 'react';


// export class BarChart extends React.Component {

//     render() {
//         return (<div className="chart">
//             <svg ref={c => this.grafico = c}>
//             </svg>
//         </div>)
//     }

// }

import React, { component } from 'react'
import * as d3 from 'd3'
import "./style.scss"
import PropTypes from 'prop-types';

class Piechart extends React.Component {


  resizeObserver() {
    const resizeObserver = new ResizeObserver(entries => this.onResize(entries));
    resizeObserver.observe(this.container);
  }

  onResize(entries) {
    if (!Array.isArray(entries)) return;
    if (!entries.length) return;
    let entry = entries[0];
    let { width: containerWidth, height: containerHeight } = entry.contentRect;
    const margin = 20;
    const width = containerWidth - 2 * margin;
    const height = containerHeight - 2 * margin;
    // debugger
    if (this.chart) {
      // console.log(this.chart);
      // let radius = Math.min(width, height) / 2;
      let data = this.props.data;

      let radius = Math.min(width, height) / 2 - 1;
      let pie = d3.pie().sort(null).value(d => d.value);



      // this.chart.attr("transform", "translate(" + ((width / 2) + margin) + "," + ((height / 2) + margin) + ")");
      let arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);


      this.arcs.select("path").attr("d", arc);
    }

    this.svg.attr("width", containerWidth);
  }
  componentDidMount() {


    let { width: containerWidth, height: containerHeight } = this.container.getBoundingClientRect();
    containerHeight = containerHeight || 300;
    const margin = 20;
    const width = containerWidth - 2 * margin;
    const height = containerHeight - 2 * margin;
    let svg = d3.select(this.container).append("svg")
      .attr("width", containerWidth)
      .attr("height", containerHeight)
      .attr("viewBox", [-width / 2, -height / 2, width, height]);
    if (this.props.border) {
      svg.style("border", "1px solid black");
    }
    this.svg = svg;
    this.resizeObserver();
    /////////////////////////////
    let data = this.props.data;
    let chart = svg.append("g");
    this.chart = chart;
    /////////////////////////////
    let color = d3.scaleOrdinal()
      .domain(data.map(d => d.name))
      .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse())
    /////////////////////////////
    let pie = d3.pie().sort(null).value(d => d.value);
    let pieData = pie(data);
    let radius = Math.min(width, height) / 2 - 1;
    let arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius)
    let arcs = chart
      .attr("stroke", "white")
      .selectAll("path")
      .data(pieData)
      .join("path")
      .attr("fill", d => color(d.data.name))
      .attr("d", arc)
      .append("title")
      .text(d => `${d.data.name}: ${d.data.value.toLocaleString()}`);
    arcs.append("path")
      .attr("fill", function (d, i) {
        return color(i);
      })
      .attr("d", arc);
    this.arcs = arcs;
    /////////////////////////////
    let arcLabel = d3.arc().innerRadius(Math.min(width, height) / 2 * 0.8).outerRadius(Math.min(width, height) / 2 * 0.8);
    svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 12)
      .attr("text-anchor", "middle")
      .selectAll("text")
      .data(pieData)
      .join("text")
      .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
      .call(text => text.append("tspan")
        .attr("y", "-0.4em")
        .attr("font-weight", "bold")
        .text(d => d.data.name)
      )
      .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
        .attr("x", 0)
        .attr("y", "0.7em")
        .attr("fill-opacity", 0.7)
        .text(d => d.data.value.toLocaleString()));

  }
  render() {

    return (<div className="wx-chart w-100" ref={c => this.container = c} style={{ height: this.props.height }} ></div>)
  }


}


Piechart.propTypes = {
  border: PropTypes.oneOfType([
    PropTypes.bool,
  ]),
};

export {
  Piechart
}