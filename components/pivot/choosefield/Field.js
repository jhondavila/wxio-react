import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
// import { ItemTypes } from './ItemTypes';



export const Field = ({ id, text, index, showMenu, dataIndex, moveField, onAddChooser, data, group, multiple = false, configurable,displayConfig }) => {
    const ref = useRef(null);
    const [, drop] = useDrop({
        accept: "field",

        hover(item, monitor) {
            if (!ref.current) {
                return;
            }
            // console.log("from field", item, monitor)
            const dragIndex = item.index;
            const hoverIndex = index;
            // if (item.from != group) {//is Add
            //     return;
            // }
            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return;
            }
            // Determine rectangle on screen
            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            // Get vertical middle
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            // Determine mouse position
            const clientOffset = monitor.getClientOffset();
            // Get pixels to the top
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;
            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%
            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }
            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }
            // Time to actually perform the action
            if (moveField) {
                moveField({ group, dragIndex, hoverIndex, isAdd: item.from != group, data: item.data });
            }
            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            item.index = hoverIndex;
        },
    });
    const [{ isDragging, opacity }, drag] = useDrag({
        item: {
            type: "field",
            id,
            index,
            dataIndex,
            data,
            from: group,
            fromMultiple: multiple
        },
        // isDragging(monitor) {
        //     console.log(monitor.didDrop());
        // },
        end(item, monitor) {
            // debugger
            const dropResult = monitor.getDropResult();
            if (item && dropResult) {
                // console.log(item, dropResult);

                if (onAddChooser) {
                    onAddChooser({
                        item,
                        dropResult,
                        data,
                        from: item.from,
                        fromMultiple: item.fromMultiple,
                        target: dropResult.group,
                        multiple: dropResult.multiple,
                    });
                }
                // let alertMessage = '';
                // const isDropAllowed = dropResult.allowedDropEffect === 'any' ||
                //     dropResult.allowedDropEffect === dropResult.dropEffect;
                // if (isDropAllowed) {
                //     const isCopyAction = dropResult.dropEffect === 'copy';
                //     const actionName = isCopyAction ? 'copied' : 'moved';
                //     alertMessage = `You ${actionName} ${item.name} into ${dropResult.name}!`;
                // }
                // else {
                //     alertMessage = `You cannot ${dropResult.dropEffect} an item into the ${dropResult.name}`;
                // }
                // alert(alertMessage);
            }
        },
        collect: (monitor) => ({
            opacity: monitor.isDragging() ? 0.4 : 1,
            isDragging: monitor.isDragging(),
        }),
    });
    // const opacity = isDragging ? 0 : 1;
    // drag(ref);
    drag(drop(ref));



    const _showMenu = (e) => {
        e.stopPropagation();
        showMenu(e, {
            dataIndex: dataIndex,
            text: text,
            data,
            group,
            id
        });
    }


    return (
        <div ref={ref} style={{ opacity }} className="choose-field d-flex w-100">

            <div className="flex-fill">
                {text}
            </div>

            {
                configurable &&
                <div className="type-aggregator float-right">
                    {
                        displayConfig && <span>{displayConfig}</span>
                    }
                    <span className="config ml-2" onClick={_showMenu}>
                        <i className="far fa-cog"></i>
                    </span>
                </div>
            }

        </div>
    );
};
