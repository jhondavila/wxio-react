import React from 'react';

import { Col, Row, Container, Image, Button, Form } from "react-bootstrap"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight, faCheckCircle, faUpload, faTimes } from '@fortawesome/free-solid-svg-icons'
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons'


import "./style.scss";
import image from "./transparentbackground.png"


class VideoPicker extends React.Component {
    constructor() {
        super();
        this.state = {
            files: null,
            previews: null
        };
    }

    componentDidMount() {
        if (typeof this.props.value == "string") {
            this.setState({
                previews: [
                    this.props.value
                ]
            })
        } else if (this.props.value instanceof File) {
            this.previewFromFile(this.props.value)
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.value !== this.props.value) {
            if (typeof this.props.value == "string") {
                this.setState({
                    previews: [
                        this.props.value
                    ]
                })
            } else if (this.props.value instanceof File) {
                this.previewFromFile(this.props.value)
            }
        }
    }

    clear() {
        this.setState({
            previews: null
        })
        if (this.props.onChange) {
            this.props.onChange(null);
        }
    }
    async previewFromFile(value) {
        this.setState({
            previews: [value ? value.name : ""]
        })
    }
    openUrl() {
        try {
            let url = this.state.previews[0];
            if (url) {
                let regExp = new RegExp("^(http|https):\/\/", "gmi");
                if (regExp.exec(url)) {
                    window.open(url, '_blank');
                }
            }
        } catch (error) {

        }
    }
    renderPreviewMode() {
        // let previewImage = 

        // console.log(this.props.value);
        let previews = this.state.previews ? this.state.previews : [];
        let text = previews.join("");

        return (
            <div className={"d-flex"}>
                <Form.Control value={text} readOnly={true} className={"input-url-open"} onClick={this.openUrl.bind(this)}></Form.Control>
                {/* <div className="wrapper-preview" style={{ backgroundImage: `url(${image})` }}> */}


                {/* {
                        this.state.previews && this.state.previews.map((src, idx) => {
                            return (
                                <img key={`${idx}`} className="imageupload" width="100%" src={src} />
                            )
                        })
                    } */}
                {/* </div> */}
                {
                    this.props.trigger ?
                        this.props.trigger(this.upload.bind(this), this.clear.bind(this))
                        :
                        <div className={"tools-buttons mx-1 d-flex flex-row"}>
                            <div className={"d-flex mx-2"}>
                                <Button size={"sm"} className={"button-video-picker"} onClick={this.upload.bind(this)}>
                                    <FontAwesomeIcon className={"mx-2"} icon={faUpload}></FontAwesomeIcon>
                                    {/* {this.props.textSelectFile || "Select file"} */}
                                </Button>
                            </div>
                            <div className={"d-flex "}>
                                <Button size={"sm"} variant={"danger"} className={"button-video-picker"} onClick={this.clear.bind(this)}>
                                    <FontAwesomeIcon className={"mx-2"} icon={faTimes}></FontAwesomeIcon>
                                    {/* {this.props.textClear || "Clear"} */}
                                </Button>
                            </div>
                        </div>
                }
            </div>
        )
    }
    render() {
        // let Trigger = this.props.trigger;
        return (
            <div className={"wx-input-load"}>

                {
                    this.renderPreviewMode()
                }



                <input
                    onChange={this.onUploadFile.bind(this)}
                    ref={c => this.input = c}
                    type="file"
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


        // URL.createObjectURL(i[this.propertyFile])


        this.setState({
            files: files
        }, () => {
            // this.loadPreviews();
        });
        if (this.props.onChange) {
            this.props.onChange(files);
        }
    }
    // async loadPreviews() {
    //     const types = ['image/png', 'image/jpeg', 'image/gif']
    //     let files = this.state.files;
    //     let previews = [];
    //     for (var x = 0; x < files.length; x++) {
    //         let imgLoad;
    //         if (types.includes(files[x].type)) {
    //             imgLoad = await this.createReadFile(files[x]);
    //             previews.push(imgLoad);
    //         }
    //     }

    //     this.setState({
    //         previews
    //     })
    // }
    // createReadFile(file) {
    //     return new Promise((resolve, reject) => {
    //         let reader = new FileReader();
    //         reader.onloadend = function () {
    //             resolve(reader.result);
    //         }
    //         reader.readAsDataURL(file);
    //     })
    // }
    upload() {
        this.input.click();
    }
}

VideoPicker.defaultProps = {
    showFileList: false,
    autoUpload: false,
    multiple: false,
    types: null,
    previewMode: false,
    accept: "video/*"
};
export {
    VideoPicker
}