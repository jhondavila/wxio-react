import React from 'react';
// import { Panel, Content, Separador } from '../../components';
import { Col, Row } from 'react-bootstrap';
import { BarStackedChart } from './BarStackedChart';
import "./style.scss"
import * as d3 from 'd3'


export class Indicator extends React.Component {
    constructor(opts) {
        super(opts);

        // console.log(model);

        this.state = {
            // barChartData: BarChartData
            // colorScale: color
        }


    }
    render() {
        let { data } = this.props;
        let columns = data.length > 0 ? Object.keys(data[0]) : [];
        let series = d3.stack().keys(columns.slice(1))(data).map(d => (d.forEach(v => v.key = d.key), d))
        let colorScale = d3.scaleOrdinal()
            .domain(series.map(d => d.key))
            .range(d3.schemeSpectral[series.length])
            .unknown("#ccc");

        return (
            <Row style={{ height: this.props.height }} className="wx-chart wx-indicator w-100 d-flex flex-nowrap">
                <div className="mx-0 d-flex justify-content-center align-items-center flex-column w-100 overflow-hidden mx-2">
                    <div className="current-value">{this.props.value}</div>
                    <div className="w-100">
                        <BarStackedChart
                            height={40}
                            data={this.props.data}
                            margin={0}
                            horizontal={true}
                            border={false}
                            xAxisLabel={false}
                            yAxisLabel={false}
                            gridLines={false}
                            colorScale={colorScale}
                        />
                    </div>
                    <Row className="legend-container">
                        {
                            columns.slice(1).map(v => {
                                return (

                                    <Col className="d-flex align-items-center justify-content-center" key={v}>
                                        <div className={"item-color mr-1"} style={{ backgroundColor: colorScale(v) }}></div>
                                        <div>{v}</div>
                                    </Col>
                                );
                            })
                        }
                    </Row>
                </div>
                <div className={"d-flex flex-column justify-content-center align-items-center position-relative"}>
                    <div className="separator"></div>
                    <div className="text-center mx-2">

                        <div className="goal-title">{"Meta"}</div>
                        <div className="goal-value">{this.props.goal}</div>
                    </div>
                </div>

            </Row>
        );
    }
};

//export default dshinventario;