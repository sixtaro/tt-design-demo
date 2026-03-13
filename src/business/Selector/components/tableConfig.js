import React, { PureComponent } from 'react';
import { Modal, Checkbox, Button, message, Row, Col } from 'antd';
//import { Scrollbars } from 'react-custom-scrollbars-2';
import './tableConfig.less';
import { Storage, Request } from '@/utils';
import CheckDrop from './checkDrop';

import NoSenseDrop from './noSenseDrop';
import TreeDragDrop from './noSenseDrop3Level';

class Page extends PureComponent {
    static defaultProps = {
        exportOptions: {},
        columns: [],
        isFirstConfig: true, //是否是首次配置
    };

    constructor(props) {
        super(props);
        this.state = {
            configColumns: Object.clone(props.configColumns),
            allConfigColumns: [],
            checkedList: [],
            indeterminate: false,
            checkAll: true,
            isSecondary: false, //是否二级菜单'
            columns: Object.clone(props.defaultColumns),
            checkedValue: [],
        };
    }

    componentDidMount() {
        this.updateColumns();
    }

    processColumn = (column, level = 0, parentCol = null, isReset, checkedList, checkedColumns) => {
        const find = isReset ? { checked: true } : this.findColumn(column, level, parentCol);

        const col = {
            title: column.title,
            dataIndex: column.dataIndex,
            key: column.key,
            notControl: column.notControl || parentCol?.notControl,
            groupName: level > 0 ? parentCol?.title : undefined,
            checked: find?.checked,
            order: find?.order,
        };

        if (column.fixed || column.key?.startsWith('action')) {
            col.checked = true;
        }

        // 新增的列或者不受控制的列默认勾选
        if (!find || column.notControl || parentCol?.notControl) {
            col.checked = true;
        }
        // 初始时 表格列中不展示，但显示在列配置中，默认不勾选
        if ((!find || isReset) && column.hidden && column.showInColumnConfig) {
            col.checked = false;
        }

        if (col.checked) {
            checkedList.push(column.dataIndex || column.key || column.title);
        }
        checkedColumns.push(column.dataIndex || column.key || column.title);

        if (column.children && column.children.length > 0) {
            col.children = column.children
                .filter(child => !child.hidden || child.showInColumnConfig)
                .map(child => this.processColumn(child, level + 1, col, isReset, checkedList, checkedColumns));
            col.children.sort((a, b) => a.order - b.order);
        }

        return col;
    };

    updateColumns = isReset => {
        const { columns } = this.state;
        let allConfigColumns = [];
        let checkedColumns = [];
        let checkedList = [];
        let notControlColumns = [];
        let isSecondary = false;
        let hasMoreThanTwoLevels = false;

        // 递归检查是否存在超过两层的数据结构
        const checkDataDepth = (node, currentLevel = 0) => {
            // 如果当前节点有子节点，且当前层级>=1，则说明至少有三层数据
            if (node.children && node.children.length > 0 && currentLevel >= 1) {
                hasMoreThanTwoLevels = true;
            }
            // 递归检查所有子节点
            if (node.children && node.children.length > 0) {
                node.children.forEach(child => {
                    checkDataDepth(child, currentLevel + 1);
                });
            }
        };

        allConfigColumns = columns
            .filter(column => !column.hidden || column.showInColumnConfig)
            .map(column => {
                const col = this.processColumn(column, 0, null, isReset, checkedList, checkedColumns);
                // 检查是否有超过两层的数据
                checkDataDepth(col);
                // 如果有子节点，说明至少有两层数据
                if (col.children) {
                    isSecondary = true;
                }
                return col;
            });

        // 如果有超过两层的数据，使用NoSenseDrop组件
        if (hasMoreThanTwoLevels) {
            isSecondary = true;
        }

        allConfigColumns.sort((a, b) => a.order - b.order);
        allConfigColumns = allConfigColumns.map((item, index) => ({
            ...item,
            order: index + 1,
        }));
        this.setState({
            notControlColumns: notControlColumns,
            allConfigColumns: allConfigColumns,
            checkedColumns: checkedColumns,
            checkedList: checkedList,
            isSecondary: isSecondary,
            hasMoreThanTwoLevels: hasMoreThanTwoLevels,
            checkAll: checkedList.length === checkedColumns.length,
            indeterminate: !!checkedList.length && checkedList.length < checkedColumns.length,
        });
    }

    findColumn = (column, _level, parentCol) => {
        const { configColumns } = this.state;
        return Array.loopItem(configColumns, (item, index, { level, parent }) => {
            if (_level === 0 && level === 0) {
                if ((column.dataIndex && column.dataIndex === item.dataIndex) || (column.key && column.key === item.key) || (column.title && column.title === item.title)) {
                    return item;
                }
            } else if (_level === level && ((parentCol.title && parentCol.title === parent.title) || (parentCol.dataIndex && parentCol.dataIndex === parent.dataIndex))) {
                if ((column.dataIndex && column.dataIndex === item.dataIndex) || (column.key && column.key === item.key) || (column.title && column.title === item.title)) {
                    return item;
                }
            }
        });
    }

    onChange = checkedList => {
        this.setState({
            checkedList: checkedList,
            indeterminate: !!checkedList.length && checkedList.length < this.state.checkedColumns.length,
            checkAll: checkedList.length === this.state.checkedColumns.length,
        });
    };

    onCheckAllChange = e => {
        const cannotChangedKeys = this.cannotChangedKeys;
        const all = Object.clone(this.state.checkedColumns);
        const checked = e.target.checked;
        let finalChanged = [];
        finalChanged = checked ? all : (cannotChangedKeys ? [...cannotChangedKeys] : []);
        let indeterminate = false;
        if (cannotChangedKeys?.length > 0) {
            indeterminate = !checked;
        }
        this.setState({
            checkedList: finalChanged,
            indeterminate: indeterminate,
            checkAll: checked,
        });
    };
    changeCheckList = value => {
        const { checkedColumns } = this.state;
        let checkedList = Object.clone(value);
        this.setState({
            checkedList: checkedList,
            indeterminate: !!checkedList?.length && checkedList?.length < checkedColumns.length,
            checkAll: checkedList?.length === checkedColumns.length,
        });
    };

    handleOk = async () => {
        const { tableID } = this.props;
        let { allConfigColumns, checkedList } = this.state;
        // 递归处理任意深度的节点，设置checked状态
        const setCheckedRecursively = (node, checkedList) => {
            // 设置当前节点的checked状态
            if (node.dataIndex) {
                node.checked = checkedList.indexOf(node.dataIndex) > -1;
            }
            // 递归处理子节点
            if (node.children && node.children.length > 0) {
                node.children.forEach(child => {
                    setCheckedRecursively(child, checkedList);
                });
            }
        };
        // 对所有顶级节点应用递归函数
        allConfigColumns.map(column => {
            setCheckedRecursively(column, checkedList);
            return column;
        });
        // let tableColumns = newColunms.concat(configColumns);
        this.saveConfig(tableID, allConfigColumns);
    };
    saveConfig = async (tableID, tableColumns) => {
        const { checkedValue } = this.state;
        // 保存之后只控制显隐
        // 递归处理任意深度的节点，保存配置
        const processColumnsRecursively = node => {
            const col = {
                title: node.title,
                dataIndex: node.dataIndex,
                key: node.key,
                checked: node.checked,
                order: node.order,
            };
            // 递归处理子节点
            if (node.children && node.children.length > 0) {
                col.children = node.children.map(child => processColumnsRecursively(child));
            }
            return col;
        };

        const _tableColumns = Object.clone(tableColumns).map(item => {
            return processColumnsRecursively(item);
        });
        let param = {
            configKey: tableID,
            configValue: JSON.stringify(_tableColumns)
        };
        checkedValue.forEach(item => {
            param[item] = true;
        });
        // 页面配置接口都走PublicV2
        let columnConfigUrl = '../PublicV2/home/sysconfig/savecolumnconfig';
        const systemID = this.props.getSystemID?.();
        if (systemID === 12) {
            // 商户平台
            columnConfigUrl = `../tongtongpay/mch/sys-config/save-config`;
            param.configType = 1;
        } else if (systemID === 13) {
            // 商户平台管理端
            columnConfigUrl = `../tongtongpay/manager/user/sys-config/save-config`;
            param.configType = 1;
        }
        const result = await Request({
            _url: `${columnConfigUrl}?${new Date().getTime()}`,
            _type: 'post',
        }, param);
        if (result.success) {
            this.props.updateConfigColumns(tableColumns);
            message.success('配置成功');
            this.handleCancel();
        } else {
            message.warning(result.data.message || '页面配置失败');
            return false;
        }
    }
    handleCancel = () => {
        this.setState({ loading: false });
        this.props.onClose();
    }
    changeColumns = (value) => {
        this.setState({
            allConfigColumns: Object.clone(value),
        });
    }
    resetColunms = () => {
        this.updateColumns(true);
    }

    get cannotChangedKeys() {
        const { defaultColumns, tableConfigProps } = this.props;
        const cannotChangedKeys = tableConfigProps?.cannotChangedKeys || [];
        Array.loopItem(defaultColumns, (item, index, { parent }) => {
            if (item.notControl || parent?.notControl || item.fixed || parent?.fixed || item.key?.startsWith('action')) {
                cannotChangedKeys.push(item.dataIndex || item.key || item.title);
            }
        });
        return cannotChangedKeys;
    }

    render() {
        const { page, exportOptions, isReset } = this.props;
        const cannotChangedKeys = this.cannotChangedKeys;
        const { isSecondary, allConfigColumns, checkedList, checkedValue, hasMoreThanTwoLevels } = this.state;
        const pageTitle = exportOptions.exportTitle || (this.props.api && this.props.api._name) || Object.getValue(page, 'title', '');
        const systemID = this.props?.getSystemID?.();

        const user = Storage.get('user');
        const isSuperAdmin = user.isSuperAdmin;
        const isOperation = user.userGroup?.operationUserGroupID === user.userGroupID;
        return (
            <div>
                <Modal
                    maskClosable={false}
                    title={`页面列表配置${pageTitle ? '-' + pageTitle : ''}`}
                    width={'718px'}
                    visible={this.props.visible}
                    destroyOnClose={true}
                    // onOk={this.handleOk}
                    okButtonProps={
                        {
                            disabled: this.state.checkedList.length < 2,
                            loading: this.state.loading,
                        }
                    }
                    // okText="确定"
                    onCancel={this.handleCancel}
                    className="selector-table-config no-scale"
                    footer={(
                        <>
                            {![12, 13].includes(systemID) && <div style={{ marginLeft: '10px', lineHeight: 0 }}>
                                <Checkbox.Group style={{ width: '100%' }} value={checkedValue} onChange={checkedValue => this.setState({ checkedValue })}>
                                    <Row>
                                        {(isOperation && isSuperAdmin) ? <>
                                            <Col span={8}>
                                                <Checkbox value={'checkCloudConfig'}>
                                                    设为云默认配置
                                                </Checkbox>
                                            </Col>
                                            <Col span={8}>
                                                <Checkbox value={'checkAllUserGroupConfig'}>
                                                    覆盖所有企业默认配置
                                                </Checkbox>
                                            </Col>
                                            <Col span={8}>
                                                <Checkbox value={'checkAllUserConfig'}>
                                                    覆盖所有个人配置
                                                </Checkbox>
                                            </Col>
                                        </> : <></>}
                                        {isSuperAdmin ? <>
                                            <Col span={8}>
                                                <Checkbox value={'checkUserGroupConfig'}>
                                                    设为本企业默认配置
                                                </Checkbox>
                                            </Col>
                                            <Col span={8}>
                                                <Checkbox value={'checkGroupUserConfig'}>
                                                    覆盖本企业个人配置
                                                </Checkbox>
                                            </Col>
                                        </> : <></>}
                                    </Row>
                                </Checkbox.Group>
                            </div>}
                            <div>
                                {
                                    isReset ||
                                    <Button type="link" onClick={this.resetColunms}>重置</Button>
                                }
                                <Button key="cancal" onClick={this.handleCancel}>取消</Button>
                                <Button type="primary" onClick={this.handleOk} disabled={this.state.checkedList.length < 2}>确定</Button>
                            </div>
                        </>
                    )
                    }
                >
                    <div>
                        <div className='title'>列表字段显示和顺序配置</div>
                        <div className='table-select'>
                            <div style={{ display: 'inline', float: 'left', marginLeft: '10px', lineHeight: '2.2' }}>
                                <Checkbox
                                    indeterminate={this.state.indeterminate}
                                    onChange={this.onCheckAllChange}
                                    checked={this.state.checkAll}
                                >
                                    全选
                                    {this.state.checkedList.length < 2 && '(需至少选择2列)'}
                                </Checkbox>
                            </div>
                            {
                                hasMoreThanTwoLevels ? <TreeDragDrop value={allConfigColumns} onChange={this.changeColumns} checkedList={checkedList} changeCheckList={this.changeCheckList} cannotChangedKeys={cannotChangedKeys} /> :
                                isSecondary ?
                                    <NoSenseDrop value={allConfigColumns} onChange={this.changeColumns} checkedList={checkedList} changeCheckList={this.changeCheckList} cannotChangedKeys={cannotChangedKeys} />
                                    :
                                    // configColumns && configColumns.map(column => (
                                    //     <Checkbox value={configColumns} ><span title={column.title}>{column.title}</span></Checkbox>
                                    // ))
                                    <CheckDrop value={allConfigColumns} onChange={this.changeColumns} checkedList={checkedList} changeCheckList={this.changeCheckList} cannotChangedKeys={cannotChangedKeys} />
                            }
                        </div>
                    </div>
                </Modal >
            </div >
        );
    }
}

export default Page;
