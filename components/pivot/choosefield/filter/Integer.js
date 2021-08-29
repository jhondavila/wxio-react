import React from 'react';
import { Form, Row, Col, Button } from "react-bootstrap";
import {
    ControlledMenu,
    MenuItem,
    useMenuState,
    MenuDivider
}
    from '@szhsin/react-menu';
import typesFilters from "./TypesFilters";

export class FInteger extends React.Component {
    constructor(opts) {
        super(opts);

        this.state = {
            value: "",
            valueMin: "",
            valueMax: ""
        }


        this.rangeEval = [
            typesFilters.between.key,
            typesFilters.notBetween.key,
        ];
    }

    changeFilter() {
    }

    render() {
        let { condition } = this.props;

        console.log(condition);

        if (condition == "none") {
            return null;
        } else if (this.rangeEval.includes(condition)) {
            return (
                <Row className="my-2">
                    <Col className="p-0">
                        <Form.Control type="text" value={this.state.valueMin} onChange={e => this.setState({ valueMin: e.target.value })} />
                    </Col>
                    <Col className="col-auto d-flex align-items-center">
                        Y
                </Col>
                    <Col className="p-0">
                        <Form.Control type="text" value={this.state.valueMax} onChange={e => this.setState({ valueMax: e.target.value })} />
                    </Col>
                </Row>
            )
        } else {
            return (
                <Row className="my-2">
                    <Form.Control type="number" value={this.state.value} onChange={e => this.setState({ value: e.target.value })} />
                </Row>
            );
        }
    }
};