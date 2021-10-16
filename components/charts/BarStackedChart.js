

import React, { component } from 'react'
import * as d3 from 'd3'
import "./style.scss"
import PropTypes from 'prop-types';

// import series from "./data/barChartHorizontal/Serie
class BarStackedChart extends React.Component {
  resizeObserver() {
    const resizeObserver = new ResizeObserver(entries => this.onResize(entries));
    resizeObserver.observe(this.container);
  }
  onResize(entries) {
    if (!Array.isArray(entries)) return;
    if (!entries.length) return;
    let entry = entries[0];
    let { width: containerWidth, height: containerHeight } = entry.contentRect;

    containerHeight = containerHeight;
    let margin = typeof this.props.margin == "number" ? this.props.margin : 50;
    let width = containerWidth - 2 * margin;
    let height = containerHeight - 2 * margin;

    // debugger
    if (height == 0) {
      margin = containerHeight * 0.1;
      width = containerWidth - 2 * margin;
      height = containerHeight - 2 * margin;
    }



    // if (this.xScale) {
    this.xScale.range([0, width]);
    if (this.props.xAxisLabel && this.labelXAxis) {
      this.labelXAxis.call(this.xAxis);
    }
    // }
    // if (this.barGroups) {
    // this.chart.selectAll("g").data(this.series)
    //   .join("g")
    //   .selectAll("rect")
    //   .data(d => d)
    //   .join("rect")
    //   .attr("x", (d, i) => { return this.props.horizontal ? this.xScale(d[0]) : this.xScale(d.data.name) })
    //   .attr("width", this.props.horizontal ? d => this.xScale(d[1]) - this.xScale(d[0]) : this.xScale.bandwidth())
    /////////////////////////////
    this.barGroups
      // .attr("fill", d => {
      //   return color(d.key);
      // })
      .selectAll("rect")
      .data(d => d)
      .join("rect")
      .attr("x", (d, i) => {
        return this.props.horizontal ? this.xScale(d[0]) : this.xScale(d.data.name)
      })
      .attr("width", this.props.horizontal ? d => this.xScale(d[1]) - this.xScale(d[0]) : this.xScale.bandwidth())

    // if (this.props.xAxisLabel) {
      this.barGroups
        .selectAll("text")
        .attr("x", (d) => {
          if (this.props.horizontal) {
            return (this.xScale(d[1]) + (this.xScale(d[0]) - this.xScale(d[1])) / 2)
          } else {

            return this.xScale(d.data.name) + this.xScale.bandwidth() / 2
          }
        })
        .attr("y", (d) => {
          if (this.props.horizontal) {
            return this.yScale(d.data.name) + this.yScale.bandwidth() / 2 + 5;
          } else {
            return (this.yScale(d[1]) + (this.yScale(d[0]) - this.yScale(d[1])) / 2) + 5
          }
        })
        .attr('text-anchor', 'middle')
        .attr('font-size', '12px')
        .text(d => { return d.data[d.key].toLocaleString() })

      ///////////////////////////
      //   let labelYAxis = this.chart.append("g")
      //     .attr("class", "y axis")
      //     .call(this.yAxis);
      //   this.labelYAxis = labelYAxis;
    // }

    // if (this.props.gridLines) {
    //   let gridLines = this.chart.append('g')
    //     .attr('class', 'grid')
    //     .call(
    //       this.makeYLines()
    //         .tickSize(-width, 0, 0)
    //         .tickFormat('')
    //     )
    //   this.gridLines = gridLines;
    // }

    this.svg.attr("width", containerWidth);
  }

  async componentDidMount() {
    let { width: containerWidth, height: containerHeight } = this.container.getBoundingClientRect();
    // debugger
    containerHeight = containerHeight || 300;
    let margin = typeof this.props.margin == "number" ? this.props.margin : 50;
    let width = containerWidth - 2 * margin;
    let height = containerHeight - 2 * margin;

    // debugger
    if (height == 0) {
      margin = containerHeight * 0.1;
      width = containerWidth - 2 * margin;
      height = containerHeight - 2 * margin;
    }
    let svg = d3.select(this.container).append("svg")
      .attr("width", containerWidth)
      .attr("height", containerHeight)

    if (this.props.border) {
      svg.style("border", "1px solid black");
    }
    this.svg = svg;
    this.resizeObserver();
    /////////////////////////////
    let data = this.props.data.slice(0);
    // console.log(data)
    let columns = data.length > 0 ? Object.keys(data[0]) : [];

    // console.log(columns)
    if (columns.indexOf("total") > -1) {
      columns.splice(columns.indexOf("total"), 1)
    }
    // console.log(columns)
    data = data.map(d => {
      d.total = d3.sum(columns, c => d[c]);
      return d;
    });
    data = data.sort((a, b) => b.total - a.total);
    let chart = svg.append("g")
      .attr('transform', `translate(${margin}, ${margin})`)


    this.chart = chart;
    /////////////////////////////
    let series = d3.stack()
      .keys(columns.slice(1))
      (data)
      .map(d => (d.forEach(v => v.key = d.key), d))
    this.series = series;
    /////////////////////////////
    let color = this.props.colorScale || d3.scaleOrdinal()
      .domain(series.map(d => d.key))
      .range(d3.schemeSpectral[series.length])
      .unknown("#ccc");
    /////////////////////////////
    let formatValue = x => isNaN(x) ? "N/A" : x.toLocaleString("en");

    /////////////////////////////
    let xScale, yScale, xAxis, yAxis;
    if (this.props.horizontal) {
      /////////////////////////////
      // debugger
      xScale = d3.scaleLinear()
        .domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
        .range([0, width])
      /////////////////////////////
      yScale = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([0, height])
        .padding(0.08)
      this.xScale = xScale;
      this.yScale = yScale;
      /////////////////////////////
      xAxis = g => g.call(d3.axisBottom(xScale).ticks(width / 100, "s")).call(g => g.selectAll(".domain").remove())
      /////////////////////////////
      yAxis = g => g.call(d3.axisLeft(yScale).tickSizeOuter(0)).call(g => g.selectAll(".domain").remove())
    } else {
      /////////////////////////////
      xScale = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([0, width])
        .padding(0.1)
      /////////////////////////////
      yScale = d3.scaleLinear()
        .domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
        .rangeRound([height, 0]);
      this.xScale = xScale;
      this.yScale = yScale;
      /////////////////////////////
      xAxis = g => g.call(d3.axisBottom(this.xScale).tickSizeOuter(0)).call(g => g.selectAll(".domain").remove())
      /////////////////////////////
      yAxis = g => g.call(d3.axisLeft(this.yScale).ticks(null, "s")).call(g => g.selectAll(".domain").remove());
    }


    this.xAxis = xAxis;
    this.yAxis = yAxis;


    /////////////////////////////
    this.barGroups = chart.selectAll("g").data(series)
      .join("g");

    /////////////////////////////
    this.barGroups
      .attr("fill", d => {
        return color(d.key);
      })
      .selectAll("rect")
      .data(d => d)
      .join("rect")
      .attr("x", (d, i) => {
        return this.props.horizontal ? xScale(d[0]) : xScale(d.data.name)
      })
      .attr("y", d => {
        return this.props.horizontal ? yScale(d.data.name) : yScale(d[1])
      })
      .attr("width", this.props.horizontal ? d => xScale(d[1]) - xScale(d[0]) : xScale.bandwidth())
      .attr("height", this.props.horizontal ? yScale.bandwidth() : d => {
        return yScale(d[0]) - yScale(d[1])
      })
      .append("title")
      .text(d => `${d.data.name} ${formatValue(d.data[d.key])}`);


    this.valueLabels = this.barGroups
      .selectAll("all")
      .data(d => d)
      .join("g")
      .append("text")
      .attr("fill", "black")
      .attr("x", (d) => {
        if (this.props.horizontal) {
          return (xScale(d[1]) + (xScale(d[0]) - xScale(d[1])) / 2)
        } else {
          return xScale(d.data.name) + xScale.bandwidth() / 2
        }
      })
      .attr("y", (d) => {
        if (this.props.horizontal) {
          return yScale(d.data.name) + yScale.bandwidth() / 2 + 5;
        } else {
          return (yScale(d[1]) + (yScale(d[0]) - yScale(d[1])) / 2) + 5
        }
      })
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .text(d => {
        // console.log(d)
        // d.data.value.toLocaleString()
        return d.data[d.key].toLocaleString()
      })


    /////////////////////////////
    if (this.props.xAxisLabel) {
      let labelXAxis = chart.append("g")
        .attr("class", "x axis")
        .call(xAxis);
      labelXAxis.attr("transform", "translate(0," + (height) + ")")
      this.labelXAxis = labelXAxis;
    }

    /////////////////////////////
    if (this.props.yAxisLabel) {
      let labelYAxis = chart.append("g")
        .attr("class", "y axis")
        .call(yAxis);
      this.labelYAxis = labelYAxis;
    }

    /////////////////////////////
    if (this.props.gridLines) {
      let gridLines = chart.append('g')
        .attr('class', 'grid')
        .call(
          this.makeYLines()
            .tickSize(-width, 0, 0)
            .tickFormat('')
        )
      this.gridLines = gridLines;
    }
  }

  makeYLines() {
    return d3.axisLeft()
      .scale(this.yScale);
  }
  render() {
    return (<div className="wx-chart w-100" ref={c => this.container = c} style={{ height: this.props.height }}></div>)
  }


}

BarStackedChart.propTypes = {
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
};

export {
  BarStackedChart
};