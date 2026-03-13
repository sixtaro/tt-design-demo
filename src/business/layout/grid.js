import React, { useImperativeHandle, useMemo, useState } from 'react';
import { Row, Col, Empty, Typography, Button, Collapse } from 'antd';
import PageLayout from './index';
import { renderReact, actionEvent } from './utils';

export default React.forwardRef((props, ref) => {
    const [prop, setProp] = useState();
    const [actionComponent, setActionComponent] = useState();

    const gridConfig = useMemo(() => {
        if (props.pageConfig) {
            const config = typeof props.pageConfig === 'object' ? { ...props.pageConfig } : eval(`(${props.pageConfig || '{}'})`);
            return config;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props, prop]);
    useImperativeHandle(ref, () => ({
        resize: () => {},
        reload: () => {},
        setState: state => {
            setProp({ ...state });
        },
    }));

    const layout = {};
    const getPage = col => {
        layout[col.name] = col;
        const objectProps = { ...props, layout };
        let component;
        const colProps = Object.renderObject(Object.clone(col.props), objectProps);
        if (col.type === 'pageID') {
            component = <PageLayout {...objectProps} {...colProps} ref={ref => (col.pageRef = ref)} pageID={col.path} hasTabsExtra={false} />;
        } else if (col.type === 'path') {
            const PageComponent = props.routes[col.path] || Empty;
            component = (
                <PageComponent
                    {...objectProps}
                    {...colProps}
                    page={{ ...props.page }}
                    ref={ref => (col.pageRef = ref)}
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={`未找到页面${col.path}`}
                    hasTabsExtra={false}
                />
            );
            if (col.collapse) {
                component = <Collapse
                    {...(col.collapse.enabledCollapse ? { defaultActiveKey: ['1'] } : { activeKey: ['1'] })}
                    expandIconPosition="right"
                    style={{ margin: '10px 20px' }}
                    {...Object.renderObject(Object.clone(col.collapse.collapseProps, props))}
                >
                    <Collapse.Panel
                        header={
                            <Typography.Text {...col.collapse.titleProps}>
                                {Object.renderRecord(col.collapse.title, props)}
                            </Typography.Text>
                        }
                        key="1"
                        showArrow={!!col.collapse.enabledCollapse}
                        {...Object.renderObject(Object.clone(col.collapse.collapsePanelProps, props))}
                    >
                        {component}
                    </Collapse.Panel>
                </Collapse>
            }
        } else if (col.type === 'view' || col.type === 'web') {
            const PageComponent = props.routes['Web'];
            const page = props.page;
            component = <PageComponent {...objectProps} {...colProps} ref={ref => (col.pageRef = ref)} page={{ ...page }} url={col.path} />;
        } else if (col.type === 'component') {
            if (col.action) {
                col.param.onClick = () =>
                    actionEvent(col.action, objectProps, { reloadFunc: () => setProp({ ...prop }), reloadTable: () => {}, setActionComponent });
            }
            if (col.path === 'div') {
                component = <div {...col.param} {...colProps}></div>;
            } else if (col.path === 'Button') {
                component = <Button {...col.param} {...colProps}></Button>;
            } else if (col.path === 'Typography.Text' || col.path === 'Text') {
                component = <Typography.Text {...col.param} {...colProps}></Typography.Text>;
            } else if (col.path === 'Typography.Title') {
                component = <Typography.Title {...col.param} {...colProps}></Typography.Title>;
            } else {
                component = renderReact(col.path, { ...objectProps, ...col.param }, col.param);
            }
        }
        const isHide = Object.renderRecord(col.hide, objectProps);
        return isHide ? (
            ''
        ) : (
            <>
                {col.title ? <Typography.Text {...col.titleProps}>{col.title}</Typography.Text> : ''}
                {component}
                {actionComponent}
            </>
        );
    };

    return (
        <>
            {gridConfig.grid.map(row => (
                <Row>
                    {row.map(col => (
                        <Col span={col.span}>
                            <div style={{ height: col.height }}>
                                {col.path ? getPage(col) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂未配置页面" />}
                            </div>
                        </Col>
                    ))}
                </Row>
            ))}
        </>
    );
});
