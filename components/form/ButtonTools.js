import React from 'react';
import { Button } from 'react-bootstrap';
import "./ButtonTools.scss";

export const ButtonTools = ({iconCls, onClick, href, disabled}) => {
    return ( 
        <Button onClick={ onClick ? ()=>onClick() : null} className='button-tools-form' disabled={disabled}>
          <i className={iconCls}></i>
        </Button>
     );
}