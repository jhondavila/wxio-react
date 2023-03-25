import React from 'react';

export class Date extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    
    }
  }
  render() {
    let { text, x, y } = this.props; 
    return (  
      <div className="datefield" style={{ top:`${y}mm`, left:`${x}mm` }}>{ text || ""}</div>
    );
  }
}
 
//export default Label;