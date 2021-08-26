'use strict'

import React from 'react'
import reactCSS from 'reactcss'
import { SketchPicker } from 'react-color'
import Utils from "../../Wx/index"

import { Container, Row, Col, Image, Modal, Button, Form } from 'react-bootstrap';
class SketchExample extends React.Component {
  state = {
    displayColorPicker: false,
    localColor: null,
  };

  componentDidMount() {
    // console.log(this.props.value)
    this.setState({
      localColor: this.props.value
    });
  }


  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      this.setState({
        localColor: this.props.value
      })
    }
  }
  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false })
  };

  handleChange = (color) => {
    // console.log(color)
    this.setState({ localColor: color.hex })

  };
  cancelValue() {
    this.setState({ displayColorPicker: false })
    if (this.props.onChange) {
      this.props.onChange(this.state.localColor);
    }
  }
  cancelValue() {
    this.setState({ displayColorPicker: false });
    this.setState({ localColor: this.props.value });
  }
  confirmValue() {
    this.setState({ displayColorPicker: false })
    if (this.props.onChange) {
      this.props.onChange(this.state.localColor);
    }
  }

  render() {

    const styles = reactCSS({
      'default': {
        color: {
          width: '36px',
          height: '14px',
          borderRadius: '2px',
          background: `${this.props.value}`,
        },
        swatch: {
          padding: '5px',
          background: '#fff',
          borderRadius: '1px',
          boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
          display: 'inline-block',
          cursor: 'pointer',
        },
        popover: {
          position: 'absolute',
          zIndex: '2',
          background: "rgb(255, 255, 255)",
          borderRadius: 4,

          boxShadow: "rgba(0, 0, 0, 0.15) 0px 0px 0px 1px, rgba(0, 0, 0, 0.15) 0px 8px 16px",
          display: "flex"

        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
        buttons: {
          zIndex: '2',
          position: "relative",
          display: "flex",
          flexDirection: "column"
        },
        textSelect: {
          fontSize: 13,
          color: "red",
          marginLeft: 10,
          marginTop: "auto",
          marginBottom: "auto"
        }
      },
    });

    return (
      <div className="d-flex">
        <div style={styles.swatch} onClick={this.handleClick}>
          <div style={styles.color} />
        </div>
        <div style={styles.textSelect}>Seleccionar</div>
        {this.state.displayColorPicker ? <div style={styles.popover}>
          <div style={styles.cover} onClick={this.handleClose} />
          <SketchPicker color={this.state.localColor} onChange={this.handleChange} presetColors={[]} style={{ boxShadow: "none" }} />
          <div className="text-right p-2" style={styles.buttons}>
            <Button variant="primary" size="sm" className="mb-2" onClick={this.confirmValue.bind(this)}>
              {Utils.t("confirm")}
          </Button>
            <Button variant="secondary" size="sm" className="" onClick={this.cancelValue.bind(this)}>
            {Utils.t("cancel")}
          </Button>
          </div>
        </div> : null}

      </div>
    )
  }
}

export default SketchExample