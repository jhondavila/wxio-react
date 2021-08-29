import React from 'react';
import { Form, Row, Col, Button } from "react-bootstrap";
import {
    ControlledMenu,
    MenuItem,
    useMenuState,
    MenuDivider
}
    from '@szhsin/react-menu';

export class FBoolean extends React.Component {
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

        console.log(condition);

        if (condition == "none") {
            return null;
        } else {
            return (
                <Row className="my-2">
                    <Form.Control as="select">
                        <option>Verdadero</option>
                        <option>Falso</option>
                    </Form.Control>
                </Row>
            );
        }
    }
};