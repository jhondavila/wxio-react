import React from 'react';

import { Col, Row, Container, Image, Button, Form } from "react-bootstrap"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons'
import plugins from "./plugins";
import toolbar from "./toolbar";

import "./style.scss";

let editorId = 0;
class TinyMCE extends React.Component {
    constructor() {
        super();
        this.state = {
        };
        editorId++
        this.tinymceId = `editor-${editorId}`;
    }
    render() {
        return (
            <div className="tinymce-container editor-container" ref={c => this.container = c}>
                <textarea className="tinymce-textarea" id={`${this.tinymceId}`}></textarea>
            </div >
        )
    }

    componentDidUpdate(prevProps) {
        if (prevProps.value !== this.props.value) {
            this.setContent(this.props.value);
        }
    }
    componentWillUnmount() {
        if (window.tinymce.get(this.tinymceId)) {
            window.tinymce.get(this.tinymceId).destroy();
        }
    }

    refreshSize() {
        window.tinymce.get(this.tinymceId).theme.resizeTo(null, this.container.clientHeight - 140);
    }
    componentDidMount() {
        const _this = this;

        // console.log(this.container.clientHeight)
        // debugger
        window.tinymce.init({
            branding: false,
            selector: `#${this.tinymceId}`,
            // height: 500,
            body_class: "panel-body ",
            object_resizing: false,
            toolbar: this.props.toolbar ? this.props.toolbar : toolbar,
            menubar: this.menubar,
            plugins: this.props.plugins || plugins,
            contextmenu_never_use_native: true,
            contextmenu: ["link | copy cut paste | inserttable row column | deletetable"].join(" "),
            end_container_on_empty_block: true,
            powerpaste_word_import: "clean",
            code_dialog_height: 450,
            code_dialog_width: 1000,
            advlist_bullet_styles: "square",
            advlist_number_styles: "default",
            imagetools_cors_hosts: ["www.tinymce.com", "codepen.io"],
            default_link_target: "_blank",
            link_title: false,
            fontsize_formats: "8px 10px 12px 14px 18px 24px 36px",
            init_instance_callback: editor => {
                if (_this.value) {
                    editor.setContent(_this.props.value);
                }
                editor.on("NodeChange Change KeyUp SetContent", () => {
                    let content = editor.getContent();
                    _this.setState({
                        content: content
                    }, () => {
                        if (_this.props.onChange) {
                            _this.props.onChange({
                                value: content
                            });
                        }
                    })
                });
            },
            setup(editor) {
                editor.on("FullscreenStateChanged", e => {
                    _this.setState({
                        fullscreen: e.state
                    })
                });
            }
            // 整合七牛上传
            // images_dataimg_filter(img) {
            //   setTimeout(() => {
            //     const $image = $(img);
            //     $image.removeAttr('width');
            //     $image.removeAttr('height');
            //     if ($image[0].height && $image[0].width) {
            //       $image.attr('data-wscntype', 'image');
            //       $image.attr('data-wscnh', $image[0].height);
            //       $image.attr('data-wscnw', $image[0].width);
            //       $image.addClass('wscnph');
            //     }
            //   }, 0);
            //   return img
            // },
            // images_upload_handler(blobInfo, success, failure, progress) {
            //   progress(0);
            //   const token = _this.$store.getters.token;
            //   getToken(token).then(response => {
            //     const url = response.data.qiniu_url;
            //     const formData = new FormData();
            //     formData.append('token', response.data.qiniu_token);
            //     formData.append('key', response.data.qiniu_key);
            //     formData.append('file', blobInfo.blob(), url);
            //     upload(formData).then(() => {
            //       success(url);
            //       progress(100);
            //     })
            //   }).catch(err => {
            //     failure('出现未知问题，刷新页面，或者联系程序员')
            //     console.log(err);
            //   });
            // },
        });
    }
    setContent(value) {
        window.tinymce.get(this.tinymceId).setContent(value);
    }
    getContent() {
        window.tinymce.get(this.tinymceId).getContent();
    }
    closeRightPanel() {
        // let project = ProjectManager.getActive();
        // let path = Utils.format(pathBase, project.name);
        // let history = this.props.history;


        // if (option.menu.reducer_key) {
        //     path = `${path}/${option.menu.reducer_key}`
        // }
        // bhistory.push(`/${project.name}/main/webinar`);
    }
}

export default TinyMCE;