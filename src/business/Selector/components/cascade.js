import { useState, useEffect, useMemo } from 'react';
import { Cascader } from 'antd';
import { Request } from '@/utils';
import { generateTradeTypeTree } from '@/utils/utils';
import './cascade.less';

const transformTreeData = data => {
    return data.map(item => ({
        ...item,
        label: item.label || item.text,
        children: transformTreeData(item.children || []),
    }));
};

export default function CustomCascade({ value, onChange, dataSource, appUID, style, disabled, requestApi, requestParam, cascadeProps }) {
    const [treeData, setTreeData] = useState([]);

    const keys = useMemo(() => {
        return value || [];
    }, [value]);

    useEffect(() => {
        const fetchList = async () => {
            const result = await Request('../mortisejointenon/leveldatasource/getleveldatasourcelist', {
                appUID,
            });

            if (result.success) {
                const sourceList = result.data.list;

                const source = sourceList.find(item => item.dataSourceUID === dataSource);

                setTreeData(JSON.parse(source?.dataSourceContent || '[]'));
            }
        };

        if (appUID) {
            fetchList();
        }
    }, [appUID, dataSource]);

    useEffect(() => {
        const fetchData = async () => {
            const result = await Request(requestApi, requestParam);
            if (result.success) {
                const data = Object.getValue(result.data, cascadeProps.dataField) || [];
                let treeData = cascadeProps?.isTreeData ? transformTreeData(data) : generateTradeTypeTree(result.data.options);
                setTreeData(treeData);
            }
        };
        if (requestApi && requestParam) {
            fetchData();
        }
    }, [requestApi, requestParam, cascadeProps]);

    useEffect(() => {
        if (cascadeProps.treeData) {
            setTreeData(cascadeProps.treeData);
        }
    }, [cascadeProps]);

    return (
        <Cascader
            className="component-selector-filter-cascade"
            popupClassName="component-selector-filter-cascade-dropdown"
            style={style}
            value={keys}
            options={treeData}
            onChange={onChange}
            disabled={disabled}
            changeOnSelect
            {...cascadeProps}
            showCheckedStrategy={cascadeProps?.multiple ? Cascader.SHOW_CHILD : Cascader.SHOW_PARENT}
        ></Cascader>
    );
}
