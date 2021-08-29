
import React from 'react';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
//import { faCircleNotch, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { Container, Row, Col, Image, Modal, Button } from 'react-bootstrap';

// import "./style.scss";
import ContainerDnD from "./ContainerDnD"

class ModalConfirm extends React.Component {

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
        // reject()
        this.props.reject(new Error("cancel"));
    }

    confirm() {
        this.setState({
            show: false
        });
        let selection = this.dnd.getSelection();
        this.props.resolve(selection);
    }
    cancel() {
        this.setState({
            show: false
        });
        this.props.reject(new Error("cancel"));
    }
    render() {
        // console.log(this.props)
        return (
            <Modal
                show={this.state.show}
                onHide={this.hideModal.bind(this)}
                animation={true}
                centered={true}
                dialogClassName={`wx-modal-choosefield-dnd ${this.props.dialogClassName}`}
                backdrop={"static"}
            >
                <Modal.Header closeButton={this.props.closeButton}>
                    <Modal.Title>{this.props.title}</Modal.Title>
                </Modal.Header>

                <Modal.Body >
                    <ContainerDnD ref={c => this.dnd = c} {...this.props}></ContainerDnD>
                </Modal.Body>
                <Modal.Footer>

                    <Button variant="secondary" onClick={this.cancel.bind(this)}>
                        {this.props.textClose || "Cerrar"}
                    </Button>

                    <Button variant="primary" onClick={this.confirm.bind(this)}>{this.props.textConfirm || "Confirmar"}</Button>

                </Modal.Footer>
            </Modal >
        )
    }

}

export default ModalConfirm;