import React, { Component } from 'react';
import { Uploader } from "../upload";
import { Importer } from "./Base"
import createConfirmation from "../modal/createModal"
import { Col, Row, Container, Image, Button, Form, Modal, Carousel } from "react-bootstrap"

class DiffColumns extends Component {

    constructor(props) {
        super(props);
        this.state = {
            show: true,
            columns: [],
            keys: {

            }
        }
    }
    componentDidMount() {
        let { columns, headers, keys } = this.props;

        let list = columns.map(i => {
            return {
                ...i
            };
        })



        this.setState({
            columns: list,
            headers,
            keys: {
                ...keys
            }
        });
    }


    hideModal() {
        this.setState({
            show: false
        });
        this.props.resolve(false);
    }

    confirm() {
        this.setState({
            show: false
        });
        this.props.resolve({
            keys: {
                ...this.state.keys
            }
        });
    }
    cancel() {
        this.setState({
            show: false
        });
        this.props.resolve(false);
    }


    render() {
        let { t } = this.props;
        return (
            <Modal
                show={this.state.show}
                onHide={this.hideModal.bind(this)}
                animation={true}
                centered={true}
                onEscapeKeyDown={false}
                backdrop={"static"}
                dialogClassName={`${this.props.dialogClassName} proxy`}
            >
                <Modal.Title>
                    <Col className={"px-4 py-2"}>
                        Missing data
                    </Col>
                </Modal.Title>
                <Modal.Body className="">

                    <Form.Group as={Row} className="mx-1">
                        <div className="col-12 text-left" >
                            <div>
                                <strong>Required</strong>
                            </div>
                        </div>
                        <div className="col-12 d-flex">
                            <strong>Column</strong>
                        </div>
                    </Form.Group>

                    {
                        this.state.columns.map((col, idx) => {

                            return (

                                <Form.Group as={Row} className="mx-1" key={col.dataIndex}>
                                    <div className="col-12 text-left" >
                                        <div>
                                            {
                                                col.text
                                            }
                                        </div>
                                    </div>
                                    <div className="col-12 d-flex">
                                        <Form.Control as="select" className="col-auto flex-fill"
                                            value={this.state.keys[col.dataIndex]}
                                            // value={this.state.section4subtitute[question.id]}
                                            onChange={e => {

                                                this.setState({
                                                    keys: {
                                                        ...this.state.keys,
                                                        [col.dataIndex]: e.target.value
                                                    }
                                                })
                                                // col.value = e.target.value;
                                                // this.forceUpdate();
                                            }}>
                                            <option value={null}>Select</option>

                                            {
                                                this.state.headers.map(option => {
                                                    return (
                                                        <option
                                                            key={option}
                                                            value={option}
                                                        >{option}</option>
                                                    );
                                                })
                                            }
                                        </Form.Control>


                                    </div>
                                </Form.Group>
                            )
                        })
                    }

                </Modal.Body>
                <Modal.Footer>
                    <Row className="mx-0">
                        <Button className="mx-1" variant="secondary" onClick={this.cancel.bind(this)}>
                            {
                                this.props.textCancel || "Cancel"
                            }
                        </Button>
                        <Button className="mx-1" onClick={this.confirm.bind(this)}>
                            {
                                this.props.textConfirm || "Confirmar"
                            }
                        </Button>
                    </Row>
                </Modal.Footer>

            </Modal>
        )
    }

}

const ModalDiffColumns = createConfirmation(DiffColumns);


export {
    ModalDiffColumns
}

