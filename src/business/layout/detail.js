import React, { useState, useMemo, useEffect, useImperativeHandle, useCallback } from 'react';
import { Space, Collapse, Typography, message } from 'antd';
import { Request } from '@/utils';
import Detail from './components/detail';

export default React.forwardRef(function DetailLayout(props, ref) {
    const [data, setData] = useState({});

    const detailConfig = useMemo(() => {
        if (props.pageConfig) {
            const config = typeof props.pageConfig === 'object' ? { ...props.pageConfig } : eval(`(${props.pageConfig || '{}'})`);
            let param;
            if (typeof config.param === 'object') {
                param = { ...config.param };
            } else {
                param = eval(`(${config.param || '{}'})`);
                config.param = {};
            }
            config.param = Object.renderObject(Object.clone(param), props);
            config.param = { ...config.param };
            return config;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);

    const groups = useMemo(() => {
        // if (detailConfig.detailItems.length && detailConfig.detailItems[0].type !== 'group') {
        //     return [
        //         {
        //             type: 'group',
        //             list: detailConfig.detailItems,
        //         },
        //     ];
        // }
        return detailConfig.detailItems;
    }, [detailConfig]);

    const loadData = useCallback(async () => {
        const result = await Request(detailConfig.getApi, detailConfig.param);
        if (result.success) {
            const data = Object.getValue(result.data, detailConfig.resultField, {});
            setData(data);
        } else {
            message.error(result.message || '读取数据失败');
        }
    }, [detailConfig]);
    useImperativeHandle(ref, () => ({
        resize: () => {
            // tableRef.current?.resize && tableRef.current.resize();
        },
        reload: () => {
            if (detailConfig.getApi) {
                loadData();
            }
        },
        setState: () => {
            // setProp({ ...state });
        },
    }));

    useEffect(() => {
        if (detailConfig.getApi) {
            loadData();
        } else if (detailConfig.data) {
            const data = Object.renderRecord(detailConfig.data, props);
            setData(data);
        }
    }, [detailConfig.data, detailConfig.getApi, loadData, props]);

    return (
        <Detail className="no-border">
            <Space direction="vertical" style={{ width: '100%' }}>
                {groups.map((group, index) => {
                    if (typeof Object.renderRecord(group.hidden, props) === 'boolean' && Object.renderRecord(group.hidden, props)) {
                        return <></>;
                    } else {
                        return group.type === 'group' && group.title ? (
                            <Collapse
                                {...(group.enabledCollapse ? { defaultActiveKey: ['1'] } : { activeKey: ['1'] })}
                                key={index}
                                expandIconPosition="right"
                                {...Object.renderObject(Object.clone(group.collapseProps, props))}
                            >
                                <Collapse.Panel
                                    header={<Typography.Text {...group.titleProps}>{Object.renderRecord(group.title, props)}</Typography.Text>}
                                    key="1"
                                    showArrow={!!group.enabledCollapse}
                                    {...Object.renderObject(Object.clone(group.collapsePanelProps, props))}
                                >
                                    <Detail.Table bordered={false} data={data} columns={group.list} dataSource={props.dataSource} {...group.props}></Detail.Table>
                                </Collapse.Panel>
                            </Collapse>
                        ) : (
                            <Detail.Table bordered={false} data={data} columns={group.list} dataSource={props.dataSource} {...group.props}></Detail.Table>
                        );
                    }
                })}
            </Space>
        </Detail>
    );
});
