
import React from 'react';
import { Container, Row, Col, Image, Modal, Button, Form } from 'react-bootstrap';

// import "./style.scss";

class ModalPrompt extends React.Component {

  constructor() {
    super()
    this.state = {
      show: true,
      text: "",
      errorSrc: false
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
    let src = this.state.errorSrc && this.props.thumbailSrc ? this.props.thumbailSrc : this.props.src;
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
            {/* <FontAwesomeIcon icon={faTimes}></FontAwesomeIcon> */}
            <strong style={{ color: "#ffffff", fontSize: 16 }}>X</strong>
          </Button>
          <Row className="m-auto">
            <img className="preview-photo-image " src={src} ref={c => this.image = c} onError={() => { this.setState({ errorSrc: true }) }} />
          </Row>
        </Modal.Body>
      </Modal>
    )
  }

}

export default ModalPrompt;