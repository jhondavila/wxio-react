import React from 'react';
import { CirclePicker } from 'react-color';
import "./Style.scss";
import { Label, Text, Rectangle, Date } from "./editor";
import { ToolBar, BtnBar } from '../table';


export class PDFCreate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      document: null,
      format: props.format
    }

  }

  cmp(col, colIndex) {

    switch (col.type) {
      case 'label':
        return <Label key={colIndex} text={col.text} left={col.x} top={col.y} Options={col.Options} />
        break;
      case 'rectangle':
        return <Rectangle key={colIndex} text={col.label} left={col.left} top={col.top} width={col.width} height={col.height} Options={col.Options} />
        break;
      case 'text':
        return <Text key={colIndex} label={col.label} text={col.field} x={col.x} y={col.y}/>
        break;
      case 'date':
        return <Date key={colIndex} x={col.x} y={col.y} text={col.field || ""} />
        break;
      case 'line':
        return <div key={colIndex}></div>
        break;
      case 'table':
        return <div key={colIndex}>{col.field || ""}</div>
        break;

    }
  }

  render() {

    return (
      <div className="pdf-editor">
        <ToolBar>
          <BtnBar iconCls="fal fa-address-card" />
        </ToolBar>
        <div className="cont">
        <div className="contpage">
        
          <div className="page" size="A4">
            {
              this.state.format.content.map((col, colIndex) => {
                return (this.cmp(col, colIndex))
              })
            }
          </div>
          <div className="page" size="A4">
            {
              this.state.format.content.map((col, colIndex) => {
                return (this.cmp(col, colIndex))
              })
            }
          </div>
          </div>
        </div>
      </div>

    )
  }
}

