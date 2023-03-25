import React from 'react';
import Draggable from 'react-draggable';

export class Rectangle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    
    }
  }
  render() {
    let { text, left, top, width , height, Options={} } = this.props; 
    return ( 
      <Draggable bounds="parent">
        <div className="rectangle" style={{ top:`${top}mm`, left:`${left}mm`, width: `${width}mm`, height: `${height}mm`}}>{ text || ""}</div>
      </Draggable>
    );
  }
}
 
//export default Label;