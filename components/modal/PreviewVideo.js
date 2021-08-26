
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch, faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons'
import { Container, Row, Col, Image, Modal, Button, Form } from 'react-bootstrap';

// import "./style.scss";

class ModalPrompt extends React.Component {

  constructor() {
    super()
    this.state = {
      show: true,
      text: ""
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
        dialogClassName={`modal-preview-photo ${this.props.dialogClassName || ""}`}
      >
        <Modal.Body>
          <Button onClick={this.hideModal.bind(this)} className="modal-preview-photo-close">
            <FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>
          </Button>
          <Row className="m-auto">
            <video className="preview-photo-image w-100" src={this.props.src} type="video/mp4" controls autoPlay={this.props.autoPlay} muted={this.props.muted} />
          </Row>
        </Modal.Body>
      </Modal>
    )
  }

}

export default ModalPrompt;