import React from 'react';
import { Form, Row, Col, Button } from "react-bootstrap";
import {
    ControlledMenu,
    MenuItem,
    useMenuState,
    MenuDivider
}
    from '@szhsin/react-menu';

export class FString extends React.Component {
    constructor(opts) {
        super(opts);

        this.state = {
            value: ""
        }
    }

    changeFilter() {
    }

    render() {
        let { condition } = this.props;

        if (condition == "none") {
            return null;
        } else {
            return (
                <Row className="my-2">
                    <Form.Control type="text" value={this.state.value} onChange={e => this.setState({ value: e.target.value })} />
                </Row>
            );
        }
    }
};