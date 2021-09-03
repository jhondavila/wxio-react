import React from 'react';

import { Col, Row, Container, Image, Button, Form } from "react-bootstrap"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons'


import "./style.scss";

class Uploader extends React.Component {
    constructor() {
        super();
        this.state = {
            files: null,
            inputKey: Date.now()
        };
    }

    click() {
        this.input.click();
    }
    componentDidUpdate(prevProps) {
        if (prevProps.files !== this.props.files) {
            this.setState({
                files: this.props.files
            });
        }
    }
    reset() {
        this.setState({
            // file: null,
            inputKey: Date.now()
        })
        // this.input.value = null;
    }
    render() {
        // let Trigger = this.props.trigger;
        return (
            <div className={"wx-input-load"}>
                {
                    this.props.trigger ?
                        this.props.trigger(this.upload.bind(this))
                        :
                        <Button onClick={this.upload.bind(this)} size={this.props.size}>
                            {
                                this.props.children
                            }
                        </Button>
                }

                <input
                    onChange={this.onUploadFile.bind(this)}
                    ref={c => this.input = c}
                    type="file"
                    key={this.state.inputKey}
                    multiple={this.props.multiple}
                    className={"input-file-upload d-none"}
                    accept={this.props.accept}
                ></input>
            </div>
        )

    }
    onUploadFile(e) {
        // console.log("onUploadFile")
        let files = e.target.files
        let err = [] // create empty array
        const types = this.props.types;
        if (types) {
            for (var x = 0; x < files.length; x++) {
                if (types.every(type => files[x].type !== type)) {
                    err[x] = files[x].type + ' is not a supported format\n';
                }
            };
        }
        for (var z = 0; z < err.length; z++) { // loop create toast massage
            e.target.value = null
        }

        if (err.length > 0) {
            files = null;
        } else {
            files = [...files];
        }
        this.setState({
            files: files
        });
        if (this.props.onChange) {
            this.props.onChange(files);
        }

    }
    upload() {
        if (this.props.loading) {
            return;
        }
        if (this.props.disabled) {
            return;
        }

        this.input.click();
    }
}

Uploader.defaultProps = {
    showFileList: false,
    autoUpload: false,
    multiple: false,
    types: null,
    accept: "*"
};
export {
    Uploader
}