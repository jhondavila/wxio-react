
import React from 'react';
import { Container, Row, Col, Image, Modal, Button } from 'react-bootstrap';

class ModalAlert extends React.Component {

    constructor() {
        super()
        this.state = {
            show: true
        }
    }
    componentDidMount() {
        // this.timerRefresh = setInterval(() => {

        //     let cont = this.state.cont + 1;
        //     if (cont > 3) {
        //         cont = 0;
        //     }
        //     this.setState({
        //         cont: cont,
        //         text: `Cargando${".".repeat(cont)}`
        //     })
        // }, 500)
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
        this.props.resolve(true);
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
                {
                    !this.props.html ?
                        <Modal.Body >
                            {this.props.desc}
                        </Modal.Body>
                        :
                        <Modal.Body dangerouslySetInnerHTML={{ __html: this.props.html }}></Modal.Body>
                }

                <Modal.Footer>
                    {
                        !this.props.hideConfirm && <Button variant="primary" onClick={this.confirm.bind(this)}>{"Aceptar"}</Button>
                    }

                </Modal.Footer>
            </Modal >
        )
    }

}

export default ModalAlert;