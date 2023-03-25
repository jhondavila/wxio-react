import React, { useRef } from 'react';
import { msgAlert } from '..';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Modal, Button, Form } from 'react-bootstrap';


export const ListItemDrag = ({ field, moveField, group, data, select, text, onClick, onAddChooser }) => {
  const ref = useRef(null);
  const index = data.index;

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: "field",

    drop: (a) => {
      //      console.log(a);
    },

    drop: (item, monitor) => {
      
    },
    hover(item, monitor) {

      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
    
      moveField(field, dragIndex, field.hidden, null)

      item.index = hoverIndex;
    },
  });

  const [{ isDragging, opacity, monitor }, drag] = useDrag({
    item: {
      type: "field",
      // id,
      index,
      // group,
      data: { index },
      field: field,
      from: group
      // fromMultiple: multiple
    },
    isDragging(monitor) {

    },
    end(item, monitor) {

      const dropResult = monitor.getDropResult();

      if (item && dropResult && dropResult.group !== group) {
       
          onAddChooser({
            item,
            dropResult,
            data,
            from: group,
            // fromMultiple: item.fromMultiple,
            target: dropResult.group,
            // multiple: dropResult.multiple,
          });
      }
    },
    collect: (monitor) => ({
      monitor: monitor,
      opacity: monitor.isDragging() ? 0.4 : 1,
      isDragging: monitor.isDragging()
    }),
  });

  // const opacity = isDragging ? 0 : 1;
  // drag(ref);
  drag(drop(ref));
  //console.log('options : ', { canDrop, isOver });

  // const opacity = isDragging ? 0.4 : 1;

  return (
    <div ref={ref} style={{ opacity }} className={`item-col ${select}`} >{text}</div>
    /* 
    <div ref={drag} className='movable-item' style={{  opacity }}>
    We will move this item
    </div>
    */
  )
}