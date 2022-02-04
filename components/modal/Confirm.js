
import React from 'react';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
//import { faCircleNotch, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { Container, Row, Col, Image, Modal, Button } from 'react-bootstrap';

// import "./style.scss";
import Utils from "../../index";

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
                onEscapeKeyDown={false}
                backdrop={"static"}
            >

                {
                    this.props.title &&
                    <Modal.Header closeButton={this.props.closeButton}>
                        <Modal.Title className={this.props.classNameTitle}>{this.props.title}</Modal.Title>
                    </Modal.Header>
                }
                {
                    (this.props.html || this.props.desc) &&
                    (this.props.html ?
                        <Modal.Body dangerouslySetInnerHTML={{ __html: this.props.html }}></Modal.Body>
                        :
                        <Modal.Body className={this.props.classNameDesc}>
                            {this.props.desc}
                        </Modal.Body>)
                }
                <Modal.Footer>
                    {
                        !this.props.hideClose && <Button variant="secondary" onClick={this.cancel.bind(this)}>
                            {this.props.textClose || Utils.t("close")}
                            {
                                this.props.closeIcon && this.props.closeIcon()
                            }
                        </Button>
                    }

                    {
                        !this.props.hideConfirm && <Button variant="primary" onClick={this.confirm.bind(this)}>
                            {this.props.textConfirm || Utils.t("confirm")}
                            {
                                this.props.confirmIcon && this.props.confirmIcon()
                            }    
                        </Button>
                    }

                </Modal.Footer>
            </Modal >
        )
    }

}

export default ModalConfirm;