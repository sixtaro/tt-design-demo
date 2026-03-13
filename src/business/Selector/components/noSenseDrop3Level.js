import { useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { getIcon } from '@/business';
import { Checkbox, message } from 'antd';
import './noSense.less';

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

/**
 * 递归检查节点及其子节点是否存在不可修改的键值
 */
const hasCannotChangeKey = (item, cannotChangedKeys) => {
    const key = item.dataIndex || item.key || item.title;
    if (cannotChangedKeys?.includes(key)) {
        return true;
    }
    if (item.children && item.children.length > 0) {
        return item.children.some(child => hasCannotChangeKey(child, cannotChangedKeys));
    }
    return false;
};

/**
 * 递归处理节点，为每个节点添加order和cannotChange属性，并过滤隐藏的子节点
 */
const processItemWithCannotChange = (item, index, cannotChangedKeys) => {
    const flag = hasCannotChangeKey(item, cannotChangedKeys);
    // 保留原有的order属性（如果存在），否则根据索引计算
    const processedItem = { ...item, order: item.order || index + 1, cannotChange: flag };

    if (item.children && item.children.length > 0) {
        const visibleChildren = item.children.filter(child => !child.hidden || child.showInColumnConfig);
        if (visibleChildren.length > 0) {
            processedItem.children = visibleChildren.map((child, childIndex) => processItemWithCannotChange(child, childIndex, cannotChangedKeys));
        }
    }

    return processedItem;
};

/**
 * 递归更新树中指定节点的子节点
 */
const updateItemInTree = (items, key, newChildren) => {
    return items.map(item => {
        const _key = item.dataIndex || item.key || item.title;
        if (_key === key) {
            return { ...item, children: newChildren };
        }
        if (item.children && item.children.length > 0) {
            return { ...item, children: updateItemInTree(item.children, key, newChildren) };
        }
        return item;
    });
};

/**
 * 多层级树形数据拖拽排序选择组件
 * 支持：
 * - 无限层级的树形数据结构
 * - 叶节点支持勾选
 * - 支持拖拽排序
 * - 支持禁用不可修改的节点
 */
export default function TreeDragDrop(props) {
    // 解构props：value-树形数据；cannotChangedKeys-不可修改的节点key列表；checkedList-已勾选的叶节点；onChange-数据变化回调；changeCheckList-勾选状态变化回调
    const { value = [], cannotChangedKeys = [], checkedList = [], onChange, changeCheckList } = props;
    console.log(value);
    // 数据预处理：过滤隐藏项并标记不可修改的节点
    const processedData = useMemo(() => {
        if (value.length > 0) {
            return value
                .filter(item => !item.hidden || item.showInColumnConfig)
                .map((item, index) => processItemWithCannotChange(item, index, cannotChangedKeys));
        }
        return [];
    }, [value, cannotChangedKeys]);

    // 处理根层级拖拽排序
    const handleDragEnd = (result, items) => {
        if (!result.destination) {
            return;
        }
        const cLength = cannotChangedKeys?.length;
        const next = items[result.destination.index];
        if (cLength > 0 && next && !!next.cannotChange) {
            return message.error('不能移动到该位置！');
        }
        const newItems = reorder(items, result.source.index, result.destination.index);
        const r = newItems.map((item, index) => ({ ...item, order: index + 1 }));
        onChange(r);
    };

    // 处理子层级拖拽排序
    const handleChildDragEnd = (result, children, parentKey) => {
        if (!result.destination) {
            return;
        }
        const cLength = cannotChangedKeys?.length;
        const next = children[result.destination.index];
        if (cLength > 0 && next && !!next.cannotChange) {
            return message.error('不能移动到该位置！');
        }
        // 重新排序子节点
        const newChildren = reorder(children, result.source.index, result.destination.index);
        // 更新每个子节点的order属性
        const updatedChildren = newChildren.map((child, index) => ({
            ...child,
            order: index + 1,
        }));
        // 更新父节点的子节点
        const newData = updateItemInTree(processedData, parentKey, updatedChildren);
        onChange(newData);
    };

    // 处理根层级叶节点勾选
    const handleCheckChange = (item, e) => {
        let newCheckedList = [...checkedList];
        const key = item.dataIndex || item.key || item.title;
        if (e.target.checked) {
            newCheckedList.push(key);
        } else {
            newCheckedList = newCheckedList.filter(k => k !== key);
        }
        changeCheckList(newCheckedList);
    };

    // 处理子层级叶节点勾选
    const handleChildCheckChange = e => {
        let newCheckedList = [...checkedList];
        if (e.target.checked) {
            newCheckedList.push(e.target.value);
        } else {
            newCheckedList = newCheckedList.filter(k => k !== e.target.value);
        }
        changeCheckList(newCheckedList);
    };

    // 处理子节点数据变更（拖拽后更新）
    const handleChildChange = (newChildren, parentKey) => {
        const newData = updateItemInTree(processedData, parentKey, newChildren);
        onChange(newData);
    };

    /**
     * 渲染单个可拖拽节点（递归）
     * item-节点数据；index-节点索引；level-层级深度（用于缩进）
     */
    function renderTreeItem(item, index, level = 0) {
        const hasChildren = item.children && item.children.length > 0;
        const key = item.dataIndex || item.key || item.title;
        const isParentDisabled = cannotChangedKeys?.includes(key);
        const hasChildCannotChange = hasChildren && item.children?.some(child => hasCannotChangeKey(child, cannotChangedKeys));
        const allDisabled = isParentDisabled || hasChildCannotChange;

        if (hasChildren) {
            // 渲染父节点（包含子节点容器）
            return (
                <Draggable key={key} draggableId={key + ''} index={index} isDragDisabled={allDisabled}>
                    {(provided, snapshot) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}>
                            <div className="parent-level" style={{ paddingLeft: 6 }}>
                                <span className="point">·</span>
                                <span title={item.title}>{item.title}</span>
                                {!allDisabled && (
                                    <span className="icon" {...provided.dragHandleProps}>
                                        {getIcon('icon-tuodong')}
                                    </span>
                                )}
                                {/* 子节点容器，递归渲染所有子节点 */}
                                <TreeChildren
                                    children={item.children}
                                    parentKey={item.dataIndex || item.key || item.title}
                                    level={level}
                                    cannotChangedKeys={cannotChangedKeys}
                                    checkedList={checkedList}
                                    onChildCheckChange={handleChildCheckChange}
                                    onChildChange={handleChildChange}
                                    onChildDragEnd={handleChildDragEnd}
                                />
                            </div>
                        </div>
                    )}
                </Draggable>
            );
        }

        // 渲染叶节点（可勾选）
        return (
            <Draggable key={key} draggableId={key + ''} index={index} isDragDisabled={isParentDisabled || item.notControl}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                    >
                        <div className="child-level" style={{ paddingLeft: 6 }}>
                            <Checkbox
                                value={item.dataIndex}
                                style={{ width: '70%', display: 'inline' }}
                                onChange={e => handleCheckChange(item, e)}
                                disabled={isParentDisabled || item.notControl}
                            >
                                <span title={item.title} className="child-level-title">
                                    {item.title}
                                </span>
                            </Checkbox>
                            {!isParentDisabled && (
                                <span className="child-level-icon" style={{ marginRight: 0 }}>
                                    {getIcon('icon-paixu')}
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </Draggable>
        );
    }

    // 递归渲染所有节点
    const renderAllItems = (items, level = 0, isRoot = true) => {
        return items.map((item, index) => renderTreeItem(item, index, level, isRoot));
    };

    return (
        <Checkbox.Group className="tree-drag-drop" value={checkedList} style={{ width: '100%' }}>
            {/* 根层级拖拽容器 */}
            <DragDropContext onDragEnd={result => handleDragEnd(result, processedData)}>
                <Droppable droppableId="droppable">
                    {provided => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="nosense-drop-div">
                            {renderAllItems(processedData)}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </Checkbox.Group>
    );
}

/**
 * 子节点容器组件
 * 负责渲染子节点
 */
function TreeChildren({ children, parentKey, level, cannotChangedKeys, checkedList, onChildCheckChange, onChildChange, onChildDragEnd }) {
    if (!children || children.length === 0) {
        return null;
    }

    return (
        <div className="children-container">
            <Checkbox.Group value={checkedList} style={{ width: '100%' }}>
                <DragDropContext onDragEnd={result => onChildDragEnd(result, children, parentKey)}>
                    <Droppable droppableId={`droppable-${parentKey}`}>
                        {provided => (
                            <div {...provided.droppableProps} ref={provided.innerRef} className="nosense-drop-div">
                                {children.map((child, index) =>
                                    renderChildItem(child, index, level + 1, cannotChangedKeys, checkedList, onChildCheckChange, onChildChange, onChildDragEnd)
                                )}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </Checkbox.Group>
        </div>
    );
}

/**
 * 渲染子节点（递归）
 */
function renderChildItem(item, index, level, cannotChangedKeys, checkedList, onChildCheckChange, onChildChange, onChildDragEnd) {
    const hasChildren = item.children && item.children.length > 0;
    const key = item.dataIndex || item.key || item.title;
    const isParentDisabled = cannotChangedKeys?.includes(key);
    const hasChildCannotChange = hasChildren && item.children?.some(child => hasCannotChangeKey(child, cannotChangedKeys));
    const allDisabled = isParentDisabled || hasChildCannotChange;

    if (hasChildren) {
        return (
            <Draggable key={key} draggableId={key + ''} index={index} isDragDisabled={allDisabled}>
                {(provided, snapshot) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}>
                        <div className="parent-level" style={{ paddingLeft: 6 }}>
                            <span className="point">·</span>
                            <span title={item.title}>{item.title}</span>
                            {!allDisabled && (
                                <span className="icon" {...provided.dragHandleProps}>
                                    {getIcon('icon-tuodong')}
                                </span>
                            )}
                            <SubChildren
                                children={item.children}
                                parentKey={item.dataIndex || item.key || item.title}
                                level={level}
                                cannotChangedKeys={cannotChangedKeys}
                                checkedList={checkedList}
                                onChildCheckChange={onChildCheckChange}
                                onChildChange={onChildChange}
                                onChildDragEnd={onChildDragEnd}
                            />
                        </div>
                    </div>
                )}
            </Draggable>
        );
    }

    return (
        <Draggable key={key} draggableId={key + ''} index={index} isDragDisabled={isParentDisabled || item.notControl}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                >
                    <div className="child-level" style={{ paddingLeft: 6 }}>
                        <Checkbox
                            value={item.dataIndex || item.key || item.title}
                            style={{ width: '70%', display: 'inline' }}
                            onChange={onChildCheckChange}
                            disabled={isParentDisabled || item.notControl}
                        >
                            <span title={item.title} className="child-level-title">
                                {item.title}
                            </span>
                        </Checkbox>
                        {!isParentDisabled && (
                            <span className="child-level-icon" style={{ marginRight: 0 }}>
                                {getIcon('icon-paixu')}
                            </span>
                        )}
                    </div>
                </div>
            )}
        </Draggable>
    );
}

/**
 * 孙子节点容器组件（用于第三层及更深层级）
 */
function SubChildren({ children, parentKey, level, cannotChangedKeys, checkedList, onChildCheckChange, onChildChange, onChildDragEnd }) {
    if (!children || children.length === 0) {
        return null;
    }

    return (
        <div className="children-container">
            <Checkbox.Group value={checkedList} style={{ width: '100%' }}>
                <DragDropContext onDragEnd={result => onChildDragEnd(result, children, parentKey)}>
                    <Droppable droppableId={`droppable-${parentKey}-sub`}>
                        {provided => (
                            <div {...provided.droppableProps} ref={provided.innerRef} className="nosense-drop-div">
                                {children.map((child, index) =>
                                    renderChildItem(child, index, level + 1, cannotChangedKeys, checkedList, onChildCheckChange, onChildChange, onChildDragEnd)
                                )}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </Checkbox.Group>
        </div>
    );
}
