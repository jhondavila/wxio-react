
import React from 'react';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
//import { faCircleNotch, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { Container, Row, Col, Image, Modal, Button, Form } from 'react-bootstrap';

// import "./style.scss";
import Utils from "../../index";

class ModalPrompt extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            show: true,
            text: this.props.value || "",

        }
    }
    componentDidMount() {
        if (this.props.selected) {
            this.input.focus();
            this.input.select();
        }
    }
    componentWillUnmount() {
        // clearInterval(this.timerRefresh);
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
        // if (this.state.text) {
        this.props.resolve(this.state.text);
        // } else {
        //     this.props.resolve(false);
        // }
    }
    cancel() {
        this.setState({
            show: false
        });
        this.props.resolve(false);
    }
    render() {
        return (
            <Modal
                show={this.state.show}
                onHide={this.hideModal.bind(this)}
                animation={true}
                centered={true}
                dialogClassName={this.props.dialogClassName}
            >
                <Modal.Header closeButton={this.props.closeButton}>
                    <Modal.Title>{this.props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className={"wrapper-outer-label"}>
                        <Col>
                            {this.props.desc}
                        </Col>
                    </Row>
                    <Row className={"wrapper-outer-input"}>
                        <Col>
                            {
                                this.props.type == "number" ?
                                    <Form.Control
                                        // placeholder={this.props.placeholder}
                                        // autoComplete="off"
                                        // as={this.props.multiline ? "textarea" : "input"}
                                        // rows="3"
                                        type={"number"}
                                        onChange={e => this.setState({ text: e.target.value })}
                                        value={this.state.text}
                                        min={this.props.minValue}
                                        max={this.props.maxValue}
                                    />
                                    :
                                    <Form.Control
                                        placeholder={this.props.placeholder}
                                        autoComplete="off"
                                        as={this.props.multiline ? "textarea" : "input"}
                                        rows={this.props.rows || "3"}

                                        onChange={e => this.setState({ text: e.target.value })}
                                        ref={c => this.input = c}
                                        value={this.state.text} />
                            }

                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    {
                        <Button variant="secondary" onClick={this.cancel.bind(this)}>
                            {this.props.textClose || Utils.t("close")}
                        </Button>
                    }

                    {
                        !this.props.hideConfirm && <Button variant="primary" onClick={this.confirm.bind(this)}>{this.props.textConfirm || Utils.t("confirm")}</Button>
                    }
                    
                </Modal.Footer>
            </Modal>
        )
    }

}

export default ModalPrompt;