import { text } from 'd3';
import React, { useState, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { Field } from './Field';

// import { ItemTypes } from './ItemTypes';
const style = {
    height: '12rem',
    width: '12rem',
    marginRight: '1.5rem',
    marginBottom: '1.5rem',
    color: 'white',
    padding: '1rem',
    textAlign: 'center',
    fontSize: '1rem',
    lineHeight: 'normal',
    float: 'left',
};
function selectBackgroundColor(isActive, canDrop) {
    if (isActive) {
        return 'rgba(248, 248, 17,0.1)';
    }
    else if (canDrop) {
        return 'rgba(179, 229, 252, 0.1)';
    }
    else {
        return '#FFFFFF';
    }
}
export const ChooserField = ({ allowedDropEffect, showMenu,name,configurable, keyProperty,children, className, fields, title, group, moveField, onAddChooser, multiple = false, onDragLeave, onDragEnter }) => {
    // return <div></div>
    const [hasRender, setHasRender] = useState(false)
    const [{ canDrop, isOver }, drop] = useDrop({
        accept: "field",
        // hover(item, monitor) {
        //     const dragIndex = item.index;

        //     // console.log("fromChooseField",item,monitor);
        //     // if (!ref.current) {
        //     //     return;
        //     // }
        // },
        drop: (item, monitor) => {
            // let item = monitor.getItem();
            // console.log(item)
            return {
                // name: `${name}`,
                item: item,
                // allowedDropEffect,
                group: group,
                multiple: multiple ? true : false,
            }
        },
        collect: (monitor) => {
            // console.log("collect")
            let item = monitor.getItem();
            // console.log(item,monitor.didDrop());
            if (!monitor.didDrop()) {
                if (monitor.isOver() && onDragEnter) {
                    onDragEnter({ group, item })
                } else {
                    if(hasRender && onDragLeave){
                        onDragLeave({ group, item });
                    }
                }
            }

            return {
                isOver: monitor.isOver(),
                canDrop: monitor.canDrop(),
            };
        },
    });

    useEffect(() => {
        setHasRender(true);
    }, []);

    const isActive = canDrop && isOver;
    const backgroundColor = selectBackgroundColor(isActive, canDrop);
    return (
        <div ref={drop} style={{ backgroundColor }} className={["chooser-fields", className].join(" ")}>
            {children}
            {fields.map((field, index) => {
                return (<Field
                    key={keyProperty ? field[keyProperty] :field.id}
                    index={index}
                    dataIndex={field.dataIndex}
                    id={field.id}
                    group={group}
                    data={field}
                    text={field.text}
                    moveField={moveField}
                    onAddChooser={onAddChooser}
                    multiple={multiple}
                    displayConfig={field ? field.aggregator : null}
                    configurable={configurable}
                    showMenu={showMenu}
                // moveCard={this.moveCard.bind(this)}
                />);
            })}

        </div>
    );
};
