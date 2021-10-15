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
export class BarParetoChart extends React.Component {

  componentDidMount() {
    // const temperatureData = [8, 5, 13, 9, 12]




    const data = [
      {
        text: 'Training Fees',
        value: 3750,
        color: '#000000'
      },
      {
        text: 'Hardware',
        value: 2440,
        color: '#00a2ee'
      },
      {
        text: 'Office supplies',
        value: 1979,
        color: '#fbcb39'
      },
      {
        text: 'Mileage',
        value: 841,
        color: '#007bc8'
      },
      {
        text: 'Other',
        value: 260,
        color: '#65cedb'
      }
    ];

    var totalAmount = 0;
    for (var i = 0; i < data.length; i++) {
      data[i].Amount = +data[i].value;
      totalAmount += data[i].value;
      if (i > 0) {
        data[i]['CumulativeAmount'] = data[i].value + data[i - 1].CumulativeAmount;
      } else {
        data[i]['CumulativeAmount'] = data[i].value;
      }
    }
    //now calculate cumulative % from the cumulative amounts & total, round %
    for (var i = 0; i < data.length; i++) {
      data[i]['CumulativePercentage'] = (data[i]['CumulativeAmount'] / totalAmount);
      data[i]['CumulativePercentage'] = parseFloat(data[i]['CumulativePercentage'].toFixed(2));
    }

    // console.log(data)


    const margin = 60;
    let containerWidth = 1000;
    let containerHeight = 600;
    // debugger
    const width = containerWidth - 2 * margin;
    const height = containerHeight - 2 * margin;

    let svg = d3.select(this.temperatures).append("svg")
      .attr("width", containerWidth)
      .attr("height", containerHeight)
      .append("g")
      .attr('transform', `translate(${margin}, ${margin})`)
      .style("border", "1px solid black")

    // const chart = svg.append('g')
    //   .attr('transform', `translate(${margin}, ${margin})`);

    const xScale = d3.scaleBand()
      .range([0, width])
      .domain(data.map((s) => s.text))
      .padding(0.3)


    var yhist = d3.scaleLinear()
      .domain([0, d3.max(data, function (d) { return d.value; })])
      .range([height, 0]);


    var ycum = d3.scaleLinear().domain([0, 1]).range([height, 0]);

    var xAxis = d3.axisBottom(xScale)
    // .scale(xScale)
    // .orient('bottom');


    var yAxis = d3.axisLeft(yhist)
    // svg.axis()
    //   .scale(yhist)
    //   .orient('left');

    var yAxis2 = d3.axisRight(ycum);


    var bar = svg.selectAll(".bar")
      .data(data)
      .enter().append("g")
      .attr("class", "bar");


    bar.append("rect")
      .attr("x", function (d) { return xScale(d.text); })
      .attr("width", xScale.bandwidth())
      .attr("y", function (d) { return yhist(d.Amount); })
      .attr("height", function (d) { return height - yhist(d.Amount); })
      .attr("fill", "steelblue")
      .attr("shape-rendering", "crispEdges");

    var guide = d3.line()
      .x(function (d) { return xScale(d.text) + xScale.bandwidth() / 2 })
      .y(function (d) { return ycum(d.CumulativePercentage) })
      .curve(d3.curveBasis);


    var line = svg.append('path')
      .datum(data)
      .attr('d', guide)
      .attr("class","line")
      .attr('fill', "none")
      .attr("stroke-width", "1.5px")
      .attr("shape-rendering", "crispEdges")
      .attr("stroke", "purple")



    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);












    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Amount");

    svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + [width, 0] + ")")
      .call(yAxis2)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 4)
      .attr("dy", "-.71em")
      .style("text-anchor", "end")
      .text("Cumulative %");

    svg
      .append('text')
      .attr('class', 'label')
      .attr('x', -(height / 2) - margin)
      .attr('y', margin / 2.4)
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .text('Love meter (%)')

    svg.append('text')
      .attr('class', 'label')
      .attr('x', width / 2 + margin)
      .attr('y', height + margin * 1.7)
      .attr('text-anchor', 'middle')
      .text('texts')

    svg.append('text')
      .attr('class', 'title')
      .attr('x', width / 2 + margin)
      .attr('y', 40)
      .attr('text-anchor', 'middle')
      .text('Most loved programming texts in 2018')

    svg.append('text')
      .attr('class', 'source')
      .attr('x', width - margin / 2)
      .attr('y', height + margin * 1.7)
      .attr('text-anchor', 'start')
      .text('Source: Wadext, 2019')
    return;

  }
  render() {

    return (<div className="wx-chart" ref={c => this.temperatures = c} ></div>)
  }

}