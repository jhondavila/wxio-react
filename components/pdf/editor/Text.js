import React from 'react';

export class Text extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    
    }
  }
  render() {
    let { label, text, x, y } = this.props; 
    return (  
      <div className="text" style={{ top:`${y}mm`, left:`${x}mm` }}>{ label ? `${label}: ${text}` : text }</div>
    );
  }
}
 
//export default Label;