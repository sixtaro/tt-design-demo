import { useState, useEffect, useMemo, useCallback, useRef, useImperativeHandle, forwardRef } from 'react';
import { Modal, Cascader, Typography, Space, Divider, Empty } from 'antd';
import { Storage, Utils } from '@/utils';
const { getPinyin } = Utils;

export default forwardRef((props, ref) => {
    const refCascader = useRef();
    const [isModalVisible, setModalVisible] = useState(false);
    const [history, setHistory] = useState(Storage.get('finderHistory') || []);

    useEffect(() => {
        Storage.set('finderHistory', history);
    }, [history]);
    useEffect(() => {
        setTimeout(() => {
            refCascader.current?.focus();
        });
    }, [isModalVisible]);

    // 处理显示数组
    const handleNavright = useCallback(childrens => {
        const newList = [];
        childrens &&
            childrens.forEach(item => {
                const newItem = {
                    value: item.rightID,
                    label: item.displayName,
                    keyword: item.displayName + ' ' + getPinyin(item.displayName).join(' '),
                };
                if (item.funcFlag === 1) {
                    return;
                }
                if (item.children && item.children.length) {
                    newItem.children = handleNavright(item.children);
                }
                newList.push(newItem);
            });
        return newList;
    }, []);
    const options = useMemo(() => {
        const _options = handleNavright(props.navrights);
        return _options;
    }, [props.navrights, handleNavright]);

    // 注册快捷键
    useEffect(() => {
        const keyDownEvent = e => {
            if (e.altKey && e.code === 'KeyF') {
                setModalVisible(true);
            }
        };
        window.addEventListener('keydown', keyDownEvent);
        return () => {
            window.removeEventListener('keydown', keyDownEvent);
        };
    }, []);

    function filter(inputValue, path) {
        if (!inputValue.trim()) {
            return false;
        }
        return path.some(option => option.keyword.toLowerCase().indexOf(inputValue.trim().toLowerCase()) > -1);
    }
    // 查找页面
    const findRight = useCallback(
        (rightID, childrens = props.navrights) => {
            for (const item of childrens) {
                if (item.rightID === rightID) {
                    return item;
                }
                if (item.children && item.children.length) {
                    const right = findRight(rightID, item.children);
                    if (right) {
                        return right;
                    }
                }
            }
            return false;
        },
        [props.navrights]
    );
    // 使用map获得新的right
    const historyList = useMemo(() => history.filter(right => findRight(right.rightID)).map(right => findRight(right.rightID)), [history, findRight]);
    function goRight(right) {
        props.go(right);
        // 通过rightID查找right，不通过right整体查询，因为菜单下按钮权限修改后right不同，但页面应该是同一个页面
        const oldIndex = history.findIndex?.(el => el?.rightID === right?.rightID);
        if (~oldIndex) {
            history.splice(oldIndex, 1);
        }
        history.splice(0, 0, right);
        if (history.length > 10) {
            history.splice(10, history.length - 10);
        }
        setHistory([...history]);
        setModalVisible(false);
    }

    // 选中后打开页面
    function onChange(value) {
        const rightID = value[value.length - 1];
        const right = findRight(rightID);
        goRight(right);
    }

    useImperativeHandle(ref, () => ({
        show: () => {
            setModalVisible(true);
        },
    }), []);
    return (
        <>
            <Modal title="快捷导航" visible={isModalVisible} footer={null} onCancel={() => setModalVisible(false)}>
                <Cascader
                    ref={refCascader}
                    style={{ width: '100%' }}
                    options={options}
                    onChange={onChange}
                    value={[]}
                    placeholder="输入关键字查找页面"
                    showSearch={{ filter }}
                ></Cascader>
                <Space direction="vertical" style={{ marginTop: '20px', width: '100%' }}>
                    <Space>
                        <Typography.Text level={5}>历史记录</Typography.Text>
                    </Space>
                    <Space split={<Divider type="vertical" />} wrap style={{ width: '100%' }}>
                        {historyList.length ? (
                            historyList.map((right, index) => (
                                <Typography.Link
                                    key={index}
                                    onClick={() => {
                                        goRight(right);
                                    }}
                                >
                                    {right.displayName}
                                </Typography.Link>
                            ))
                        ) : (
                            <Empty description={null} style={{ width: '450px' }} />
                        )}
                    </Space>
                </Space>
            </Modal>
        </>
    );
});
