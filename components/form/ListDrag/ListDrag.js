import React, { useRef } from 'react';
import { msgAlert } from '..';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Modal, Button, Form } from 'react-bootstrap';


export const ListDrag = ({ children, name, group }) => {

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: 'field',
    drop: (item, monitor) => {
      return {
        item: item,
        // allowedDropEffect,
        group: group,
      };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  });

  //console.log('options : ', { canDrop, isOver });

  return (
    <div ref={drop} className='list-content' /*style={{ width: 200, height: 400 }}*/>
      {children}

    </div>
  )
}