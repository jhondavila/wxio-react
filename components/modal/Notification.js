
import React from 'react';
import { Container, Row, Col, Image, Modal, Button, Form } from 'react-bootstrap';

// import "./style.scss";

class ModalPrompt extends React.Component {

    constructor() {
        super()
        this.state = {
            show: true,
            title: "",
            message: "",
        }
    }
    componentDidMount() {
     
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
        this.props.resolve({
            title: this.state.title,
            message: this.state.message
        });
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
                    <Row>
                        <Col>
                            {this.props.desc}
                        </Col>
                    </Row>
                    <Form.Group as={Row} >
                        <Form.Label column className="text-left">
                            Título
                                        </Form.Label>
                        <Col sm="18">
                            <Form.Control type={"text"} min="10" max="300" value={this.state.title} onChange={e => this.setState({ title: e.target.value })} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} >
                        <Form.Label column className="text-left">
                            Mensaje
                        </Form.Label>
                        <Col sm="18">
                            <Form.Control
                                placeholder={this.props.placeholder}
                                autoComplete="off"
                                as={"textarea"}
                                rows="3"
                                onChange={e => this.setState({ message: e.target.value })}
                                value={this.state.message} />
                        </Col>
                    </Form.Group>
                    {/* <Row>
                        <Col>
                            <Form.Control
                                placeholder={this.props.placeholder}
                                autoComplete="off"
                                as={this.props.multiline ? "textarea" : "input"}
                                rows="3"

                                onChange={e => this.setState({ text: e.target.value })}
                                value={this.state.text} />
                        </Col>
                    </Row> */}
                </Modal.Body>
                <Modal.Footer>
                    {
                        <Button variant="secondary" onClick={this.cancel.bind(this)}>
                            {this.props.textClose || "Cerrar"}
                        </Button>
                    }

                    {
                        !this.props.hideConfirm && <Button variant="primary" onClick={this.confirm.bind(this)}>{this.props.textConfirm || "Confirmar"}</Button>
                    }

                </Modal.Footer>
            </Modal>
        )
    }

}

export default ModalPrompt;