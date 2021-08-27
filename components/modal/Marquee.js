
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { Container, Row, Col, Image, Modal, Button, Form } from 'react-bootstrap';
import { SketchPicker } from 'react-color'
// import "./style.scss";
import ButtonPicker from "./ButtonPicker";
import { withTranslation } from "react-i18next"
import Utils from "../../index"
// import { useTranslation, Trans, I18nextProvider } from 'react-i18next';
// import { i18next } from "../../translations/index"
class ModalPrompt extends React.Component {

    constructor() {
        super()
        this.state = {
            show: true,
            text: "",
            minutes: 1,
            backgroundColor: "#FFFFFF",
            textColor: "#000000"
        }
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
            text: this.state.text,
            seconds: this.state.minutes * 60,
            backgroundColor: this.state.backgroundColor,
            textColor: this.state.textColor
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
                    dialogClassName={this.props.dialogClassName}
                >
                    <Modal.Header closeButton={this.props.closeButton}>
                        <Modal.Title>{Utils.t("rss_send_text")}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col>
                                {Utils.t("rss_desc")}
                            </Col>
                        </Row>
                        <Form.Group as={Row} >
                            <Form.Label column className="text-left">
                                {Utils.t("rss_message")}
                            </Form.Label>
                            <Col sm="15">

                                <Form.Control
                                    placeholder={this.props.placeholder}
                                    autoComplete="off"
                                    as={this.props.multiline ? "textarea" : "input"}
                                    rows="3"

                                    onChange={e => this.setState({ text: e.target.value })}
                                    value={this.state.text} />
                            </Col>
                        </Form.Group>

                        {/* <Row> */}
                        <Form.Group as={Row} >
                            <Form.Label column className="text-left">
                                {Utils.t("rss_minutes")}
                            </Form.Label>
                            <Col sm="15">
                                <Form.Control type={"number"} min="10" max="300" value={this.state.minutes} onChange={e => this.setState({ minutes: e.target.value })} />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} >
                            <Form.Label column className="text-left">
                                {Utils.t("rss_background_color")}
                            </Form.Label>
                            <Col sm="15" className="d-flex align-items-center">
                                <ButtonPicker onChange={(color) => { this.setState({ backgroundColor: color }) }} value={this.state.backgroundColor}></ButtonPicker>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} >
                            <Form.Label column className="text-left">
                                {Utils.t("rss_text_color")}
                            </Form.Label>
                            <Col sm="15" className="d-flex align-items-center">
                                <ButtonPicker onChange={(color) => { this.setState({ textColor: color }) }} value={this.state.textColor}></ButtonPicker>
                            </Col>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        {
                            <Button variant="secondary" onClick={this.cancel.bind(this)}>
                                {Utils.t("close")}
                            </Button>
                        }

                        {
                            !this.props.hideConfirm && <Button variant="primary" onClick={this.confirm.bind(this)}>{Utils.t("confirm")}</Button>
                        }

                    </Modal.Footer>
                </Modal>
        )
    }

}

export default ModalPrompt;