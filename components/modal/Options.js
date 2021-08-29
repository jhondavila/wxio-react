
import React from 'react';
import { Container, Row, Col, Image, Modal, Button } from 'react-bootstrap';

// import "./style.scss";

class ModalConfirm extends React.Component {

    constructor() {
        super()
        this.state = {
            show: true
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

    confirm(value) {
        this.setState({
            show: false
        });
        this.props.resolve(value);
    }
    cancel() {
        this.setState({
            show: false
        });
        this.props.resolve(false);
    }

    renderOptions() {
        let options = this.props.options || [];

        return options.map(option => {
            return (
                <Button key={option.value} variant={option.variant || "primary"} onClick={this.confirm.bind(this, option.value)}>{option.text}</Button>
            );
        })
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
                    {this.props.desc}
                </Modal.Body>
                <Modal.Footer>
                    {
                        <Button variant="secondary" onClick={this.cancel.bind(this)}>
                            {this.props.textClose || "Cerrar"}
                        </Button>
                    }
                    <div className="ml-auto"></div>
                    {

                        this.renderOptions()
                        // !this.props.hideConfirm && <Button variant="primary" onClick={this.confirm.bind(this)}>{this.props.textConfirm || "Confirmar"}</Button>
                    }

                </Modal.Footer>
            </Modal>
        )
    }

}

export default ModalConfirm;