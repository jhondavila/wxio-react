
import React, { component } from 'react'
import * as d3 from 'd3'
import { ResizeObserver } from '@juggle/resize-observer'
import PropTypes from 'prop-types';

class BarChart extends React.Component {


  resizeObserver() {
    const resizeObserver = new ResizeObserver(entries => this.onResize(entries));
    resizeObserver.observe(this.container);
  }

  onResize(entries) {
    if (!Array.isArray(entries)) return;
    if (!entries.length) return;
    let entry = entries[0];
    let { width: containerWidth, height: containerHeight } = entry.contentRect;
    const margin = 40;
    const width = containerWidth - 2 * margin;
    const height = containerHeight - 2 * margin;


    if (this.xScale) {
      this.xScale.range([0, width]);
      this.xAxis.call(d3.axisBottom(this.xScale))
    }

    if (this.barGroups) {
      this.barGroups.selectAll("rect").
        attr('x', (g) => this.xScale(g.text))
        .attr('width', this.xScale.bandwidth())
      this.barGroups.selectAll("text").
        attr('x', (a) => this.xScale(a.text) + this.xScale.bandwidth() / 2);
    }

    if (this.gridLines) {
      this.gridLines.call(this.makeYLines()
        .tickSize(-width, 0, 0)
        .tickFormat(''))
    }

    if (this.labelXAxis) {
      this.labelXAxis.attr('x', width / 2 + margin);
    }
    this.svg.attr("width", containerWidth);
  }
  makeYLines() {
    return d3.axisLeft()
      .scale(this.yScale);
  }

  componentDidMount() {
    let { width: containerWidth, height: containerHeight } = this.container.getBoundingClientRect();
    containerHeight = containerHeight || 300;
    const margin = 50;
    const width = containerWidth - 2 * margin;
    const height = containerHeight - 2 * margin;
    let svg = d3.select(this.container).append("svg")
      .attr("width", containerWidth)
      .attr("height", containerHeight);
    if (this.props.border) {
      svg.style("border", "1px solid black");
    }
    this.svg = svg;
    this.resizeObserver();
    /////////////////////////////
    let data = this.props.data;
    const chart = svg.append('g')
      .attr('transform', `translate(${margin}, ${margin})`);
    /////////////////////////////
    const xScale = d3.scaleBand()
      .range([0, width])
      .domain(data.map((s) => s.text))
      .padding(0.3)
    this.xScale = xScale;
    /////////////////////////////
    const yScale = d3.scaleLinear()
      .range([height, 0])
      .domain([0, 100]);
    this.yScale = yScale;
    /////////////////////////////
    if (this.props.xAxisLabel) {
      let xAxis = chart.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(xScale));
      this.xAxis = xAxis;
    }
    /////////////////////////////
    if (this.props.yAxisLabel) {
      let yAxis = chart.append('g')
        .call(d3.axisLeft(yScale));
      this.yAxis = yAxis;
    }
    /////////////////////////////
    if (this.props.gridLines) {
      let gridLines = chart.append('g')
        .attr('class', 'grid')
        .call(this.makeYLines()
          .tickSize(-width, 0, 0)
          .tickFormat('')
        )
      this.gridLines = gridLines;
    }

    /////////////////////////////
    const barGroups = chart.selectAll()
      .data(data)
      .enter()
      .append('g')
    this.barGroups = barGroups;
    barGroups
      .append('rect')
      .attr('class', 'bar')
      .attr('fill', (g) => g.color)
      .attr('x', (g) => xScale(g.text))
      .attr('y', (g) => yScale(g.value))
      .attr('height', (g) => height - yScale(g.value))
      .attr('width', xScale.bandwidth())
    barGroups
      .append('text')
      .attr('class', 'value')
      .attr('fill', 'white')
      .attr('font-size', '12px')
      .attr('x', (a) => xScale(a.text) + xScale.bandwidth() / 2)
      .attr('y', (a) => yScale(a.value) + 30)
      .attr('text-anchor', 'middle')
      .text((a) => `${a.value}`)
    /////////////////////////////
    if (this.props.yTitle) {
      let labelYAxis = svg
        .append('text')
        .attr('class', 'label')
        .attr('x', -(height / 2) - margin)
        .attr('y', margin / 2.4)
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .text(this.props.yTitle)
      this.labelYAxis = labelYAxis;
    }
    /////////////////////////////
    if (this.props.xTitle) {
      let labelXAxis = svg.append('text')
        .attr('class', 'label')
        .attr('x', width / 2 + margin)
        .attr('y', height + margin * 1.7)
        .attr('text-anchor', 'middle')
        .text(this.props.xTitle)

      this.labelXAxis = labelXAxis;
    }
  }
  render() {

    return (<div className="wx-chart w-100" ref={c => this.container = c} height={this.props.height} ></div>)
  }


}


BarChart.propTypes = {
  xAxisLabel: PropTypes.oneOfType([
    PropTypes.bool,
  ]),
  yAxisLabel: PropTypes.oneOfType([
    PropTypes.bool,
  ]),
  xTitle: PropTypes.oneOfType([
    PropTypes.string,
  ]),
  yTitle: PropTypes.oneOfType([
    PropTypes.string,
  ]),
  border: PropTypes.oneOfType([
    PropTypes.bool,
  ]),
  gridLines: PropTypes.oneOfType([
    PropTypes.bool,
  ]),
};

export {
  BarChart
};