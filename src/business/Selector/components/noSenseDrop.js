import React, { useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { getIcon } from '@/business';
import './noSense.less';
import CheckDrop from './checkDrop';
import { Checkbox, message } from 'antd';

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);

    const [removed] = result.splice(startIndex, 1);

    result.splice(endIndex, 0, removed);
    return result;
};

const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    margin: 8,
    boxShadow: isDragging ? '0 0 8px #ccc' : '',

    ...draggableStyle,
});

export default props => {
    const noSenseOptions = useMemo(() => {
        if (props.value?.length > 0) {
            return props.value.map((item, index) => {
                const cannotChangedKeys = props.cannotChangedKeys;
                let flag = false;
                if (item.children) {
                    if (cannotChangedKeys) {
                        flag = !!item.children.find(child => cannotChangedKeys.includes(child.dataIndex || child.key || child.title));
                    }
                } else {
                    flag = cannotChangedKeys.includes(item.dataIndex || item.key || item.title);
                }
                return { ...item, order: index + 1, cannotChange: flag };
            });
        } else {
            return [];
        }
    }, [props]);

    const onDragEnd = result => {
        if (!result.destination) {
            return;
        }
        const cLength = props.cannotChangedKeys?.length;
        const next = noSenseOptions[result.destination.index];
        if (cLength > 0 && next && !!next.cannotChange) {
            return message.error('不能移动到该位置！');
        }
        const items = reorder(noSenseOptions, result.source.index, result.destination.index);
        const r = items.map((item, index) => ({ ...item, order: index + 1 }));
        props.onChange(r);
    };
    const changeItem = (value, key) => {
        let newArr = props.value;
        if (newArr.length > 0) {
            newArr.forEach(item => {
                if (item.title === key) {
                    item.children = value;
                }
            });
        }
        props.onChange(newArr);
    };
    const changeCheckList = (value) => {
        props.changeCheckList(value);
    };
    return (
        <Checkbox.Group value={props.checkedList} style={{width: '100%'}}>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                    {provided => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="nosense-drop-div">
                            {noSenseOptions
                                .map((item, index) => (
                                    item.children && item.children.length > 0 ?
                                        <Draggable
                                            key={item.title}
                                            draggableId={item.title + ''}
                                            index={
                                                index
                                            }
                                            isDragDisabled={props.cannotChangedKeys?.includes(item.dataIndex || item.key || item.title)}
                                        >
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                                                >
                                                    <div className="parent-level">
                                                        <span className="point">·</span>
                                                        <span title={item.title}>{item.title}</span>
                                                        {
                                                            !props.cannotChangedKeys?.includes(item.dataIndex || item.key || item.title) &&
                                                                !item.children?.find(child => props.cannotChangedKeys?.includes(child.dataIndex || child.key || child.title)) &&
                                                            <span className="icon"
                                                                  {...provided.dragHandleProps}
                                                            >{getIcon('icon-tuodong')}</span>
                                                        }
                                                        {
                                                            item.children.length > 0 &&
                                                            <CheckDrop value={item.children} title={item.title}
                                                                       onChange={changeItem}
                                                                       checkedList={props.checkedList}
                                                                       changeCheckList={changeCheckList}
                                                                       cannotChangedKeys={props.cannotChangedKeys}
                                                            />
                                                        }
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable> :
                                        <Draggable
                                            key={item.title}
                                            draggableId={item.title + ''}
                                            index={
                                                index
                                            }
                                            isDragDisabled={props.cannotChangedKeys?.includes(item.dataIndex || item.key || item.title)}
                                        >
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                                                >
                                                    <div className="child-level">
                                                        <Checkbox value={item.dataIndex} style={{ width: '70%', display: 'inline' }} onChange={e => {
                                                            let checkedList = props.checkedList;
                                                            if (e.target.checked) {
                                                                checkedList.push(e.target.value);
                                                            } else {
                                                                checkedList.splice(checkedList.findIndex(item => item === e.target.value), 1);
                                                            }
                                                            changeCheckList(checkedList);
                                                        }}
                                                        disabled={props.cannotChangedKeys?.includes(item.dataIndex || item.key || item.title) || item.notControl}
                                                        >
                                                            <span title={item.title} className="child-level-title">{item.title}</span>
                                                        </Checkbox>
                                                        {
                                                            !props.cannotChangedKeys?.includes(item.dataIndex || item.key || item.title) && <span className="child-level-icon">{getIcon('icon-paixu')}</span>
                                                        }
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </Checkbox.Group>
    );
};
