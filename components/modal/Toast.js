
import React from 'react';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
//import { faCircleNotch, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { Toast } from 'react-bootstrap';

// import "./style.scss";

class ModalToast extends React.Component {

    constructor() {
        super()
        this.state = {
            show: true,
            text: "",
            type: ""
        }
    }
    componentDidMount() {
        if(this.props.type=="alert"){
            this.setState({
                type: "fas fa-exclamation text-warning mr-2"
            })
        }else if(this.props.type=="error"){
            this.setState({
                type: "fas fa-exclamation-circle text-danger mr-2"
            })
        }else{
            this.setState({
                type: "fas fa-check-circle text-success mr-2"
            })
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
            <Toast show={this.state.show} onClose={this.hideModal.bind(this)} delay={3000} autohide
            style={{
                position: 'absolute',
                
                bottom: '5px',
                right: '5px',
              }}>
                <Toast.Header>
                    <i className={this.state.type}></i>
                    <strong className="mr-auto">{this.props.title}</strong>
                </Toast.Header>
                <Toast.Body>{this.props.desc}</Toast.Body>
            </Toast>
        )
    }

}

export default ModalToast;