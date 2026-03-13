import React, { PureComponent, useState, useEffect, useRef, useMemo } from 'react';
import { Input, Tree, Modal, AutoComplete } from "antd";
import { Request, Utils } from '@/utils';
import cloneDeep from 'lodash/cloneDeep';
import intersection from 'lodash/intersection';
// import difference from 'lodash/difference';
import groupBy from 'lodash/groupBy';
import { HomeOutlined } from "@ant-design/icons";
import { getIcon } from '@/business';

const { getIconNameByNodeType } = Utils;

const getIconByNode = (treeNode) => {
    return treeNode.iconCls === 'icon-root' ? (
        <HomeOutlined></HomeOutlined>
    ) : getIcon(
        getIconNameByNodeType(
            treeNode.iconCls
        )
    );
};

const generateTree = (node, parks, regions, orgs) => {
    if (node.children) {
        node.children.forEach(item => {
            generateTree(item, parks, regions, orgs);
        });
    }
    node.title = node.text;
    node.key = `${node.attributes.type}-${node.id}`;
    node.icon = getIconByNode(node);
    if (node.attributes.type === 1) {
        parks.push(node);
    } else if (node.attributes.type === 2) {
        regions.push(node);
    } else {
        orgs.push(node);
    }
};

const Region = (props) => {
    const { value, onChange, disabled } = props;
    const [visible, setVisible] = useState(false);
    const [checkedKeys, setCheckedKeys] = useState([]);
    const [lastSaveKeys, setLastSaveKeys] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [treeData, setTreeData] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [subExpandedKeys, setSubExpandedKeys] = useState([]);
    const allParks = useRef([]);
    const allRegions = useRef([]);
    const allOrgs = useRef([]);
    const allParksMap = useRef();
    const allRegionsMap = useRef();
    const [autoCompleteOptions, setOptions] = useState([]);
    const tree = useRef();
    const subTree = useRef();
    // 生成已选择的树结构，即右侧树结构
    const selectedTree = useMemo(() => {
        const filter = node => {
            // 有 children 就处理 children
            if (node.children && node.children.length > 0) {
                node.children = node.children.map(item => filter(item));
            }
            // 经过处理之后的 children 中还有数据，那就确定子树里有内容被选中了
            let hasChecked = node.children && node.children.length !== 0 && node.children.filter(item => item !== null).length !== 0;
            // 两种情况决定这一个节点是否保留：1、子树里有内容被选中了。2、这个节点的id被选中了。
            if (hasChecked || checkedKeys.includes(node.key)) {
                node.children = node.children.filter(item => !!item);
                return node;
            } else {
                return null;
            }
        };
        if (!!treeData.length) {
            // cloneDeep 一下，免得原数据被改了
            let result = cloneDeep(treeData).map(item => filter(item));
            return result.filter(item => !!item);
        } else {
            return [];
        }
    }, [checkedKeys, treeData]);

    const handleCheck = (value, e) => {
        setCheckedKeys(value);
        let position = e.checkedNodesPositions.filter(item => e.node.key === item.node.key)[0]?.pos;
        if (position) {
            position = position.split('-');
            position.shift();
            let nodesKeys = [];
            let currentNode = treeData;
            for (let i = 0; i < position.length; i++) {
                nodesKeys.push(currentNode[position[i]].key);
                currentNode = currentNode[position[i]].children;
            }
            let nowSubExpandedKeys = Array.from(new Set([...subExpandedKeys].concat(nodesKeys)));
            setSubExpandedKeys(nowSubExpandedKeys);
        }
    };

    /**
     * 点击右侧树结构进行反选时，处理逻辑只有一点，就是保留 value 中处于末端的区域或者车场，但凡父节点通通不考虑去手动处理勾选
     * @param value
     */
    const handleSelectedCheck = (value) => {
        // console.log(value, e);
        // 从右侧树结构反选的时候，值里有两种是需要保留的：1、所有区域，左侧的树会自动响应区域的节点来处理父节点的勾选状态。2、被选中的空车场，否则它们会因为没有区域而自动取消勾选状态。
        let checkedRegion = value.filter(item => item.includes('_'));
        let remainParks = value.filter(item => item.includes('1-'));
        let emptyParks = allParks.current.filter(item => item.children.length === 0).map(item => item.key);
        let selectedEmptyParks = intersection(remainParks, emptyParks);
        setCheckedKeys(checkedRegion.concat(selectedEmptyParks));
    };

    const handleMainTreeSelect = (values, e) => {
        let key = e.node.key;
        setSelectedKeys([key]);
    };

    const handleSelect = (values, e) => {
        let key = e.node.key;
        tree.current && tree.current.scrollTo({ key });
    };

    /**
     * 处理数据的逻辑如下
     * 1、首先获取所有选中的节点。筛选出车场和区域的部分，车场的特征为字符串中带 1-， 而区域的特征是有 _
     * 2、车场能被勾选中，代表肯定是下面的区域节点被全选了（不管它有没有区域可选），所以这些车场全部按照 ${parkID}_0 的方式拼接就好。但其实有些情况下会出现子节点全选了但逻辑里没被勾选的情况，后面处理。
     * 3、用 groupBy 分组所有的区域，解析区域中间的部分（如 2-1332_1 根据 1332 来分组），最后会以车场的 id 为 key 生成一个对象，如 { 1332: ['2-1332_1',...],... }
     * 4、根据每个车场其拥有的区域数量进行判断， 跟原数据区域数量一样，按照全选来处理，不一样，那就按照 ${parkID}_${regionID},${regionID}来拼接
     */
    const handleData = () => {
        // 1 获取所有被选中的车场是必要的，因为其中包含无区域的车场，这些车场无法在后面第三步中处理
        let checked = [...checkedKeys];
        let parks = checked.filter(item => item.includes('1-'));
        let regions = checked.filter(item => item.includes('_'));
        // 2
        let parksWithAll = parks.map(item => item.substring(2));
        let parksWithAllDeal = parks.map(item => {
            let id = item.substring(2);
            return id + '_0';
        });
        // 3
        // 那剩下的其他车场就肯定是有区域被选中的了
        let regionGroups = groupBy(regions, item => {
            return String.Resovle(item, '2-', '_');
        });
        // 4
        let otherParks = [];
        for (let key in regionGroups) {
            if (regionGroups.hasOwnProperty(key) && !parksWithAll.includes(key)) {
                if (regionGroups[key].length === allParksMap.current.get(key).children.length) {
                    otherParks.push(`${key}_0`);
                } else {
                    let r = regionGroups[key].map(item => {
                        let _index = item.indexOf('_');
                        return item.substring(_index + 1);
                    }).join(',');
                    otherParks.push(`${key}_${r}`);
                }
            }
        }
        let all = [...parksWithAllDeal, ...otherParks].join(';');
        onChange && onChange(all);
        setVisible(false);
    };

    const renderTitle = (title) => (
        <span>{title}</span>
    );

    const renderItem = (item) => ({
        value: item.title,
        key: item.key,
        label: (
            <div>
                {item.title}
            </div>
        ),
    });

    const handleSearch = (inputValue) => {
        if (typeof inputValue === 'string' && inputValue.length >= 1) {
            let orgs = allOrgs.current.filter(item => item.title.includes(inputValue)).slice(0, 10);
            let parks = allParks.current.filter(item => item.title.includes(inputValue)).slice(0, 10);
            let regions = allRegions.current.filter(item => item.title.includes(inputValue)).slice(0, 10);
            setOptions([
                {
                    label: renderTitle('组织'),
                    options: orgs.map(item => renderItem(item))
                },
                {
                    label: renderTitle('车场'),
                    options: parks.map(item => renderItem(item))
                },
                {
                    label: renderTitle('区域'),
                    options: regions.map(item => renderItem(item))
                }
            ]);
        } else {
            setOptions([
                {
                    label: renderTitle('组织'),
                    options: []
                },
                {
                    label: renderTitle('车场'),
                    options: []
                },
                {
                    label: renderTitle('区域'),
                    options: []
                }
            ]);
        }
    };

    const handleAutoCompleteSelect = (title, option) => {
        tree.current && tree.current.scrollTo({ key: option.key });
        handleMainTreeSelect(null, { node: { key: option.key } });
    };

    const handleSubTreeExpand = (value)=>{
        setSubExpandedKeys(value);
    };

    const handleCancel = () => {
        setCheckedKeys([...lastSaveKeys]);
        setVisible(false);
    };

    useEffect(() => {
        const getData = async () => {
            let result = await Request(
                {
                    _url:
                        'home/group/orgparkregiontree',
                    _type: 'get',
                    _cache: '5m',
                },
                { sysVersion: 4 }
            );
            let parks = [], regions = [], orgs = [];
            if (!Array.isArray(result)) {
                result = [];
            }
            result.forEach(item=>{
                generateTree(item, parks, regions, orgs);
            });
            allParks.current = parks;
            allRegions.current = regions;
            allOrgs.current = orgs;
            allParksMap.current = new Map(parks.map(item => {
                return [item.id, item];
            }));
            allRegionsMap.current = new Map(regions.map(item => {
                return [item.id, item];
            }));
            setTreeData(result);
        };
        getData();
    }, []);

    useEffect(() => {
        // 没有获取 value 或没有 treeData 的时候就不处理了
        if (!value || !treeData.length) {
            setInputValue('');
            return;
        }
        let parkRegions = value?.split(';') || [];
        let checked = [];
        let str = [];
        parkRegions.forEach(item => {
            let _index = item.indexOf('_');
            let parkID = item.substring(0, _index);
            let park = allParksMap.current?.get(parkID);
            let parkName = park?.text || parkID, regionNames = [];
            if (item.includes('_0')) {
                checked = checked.concat([`1-${item.substring(0, _index)}`]);
                let park = allParksMap.current?.get(parkID);
                // 车场是全选状态，那两种处理情况：1、下面有区域，把所有区域带上。2、下面没有车场，那就带车场自己。
                // 注意：在第1中情况中，不要只勾选车场，虽然在左侧树结构中，勾选了车场之后会自动勾选所有区域，但右侧的树节点不会获取到车场下的区域树结构！
                if (park && park.children.length === 0) {
                    checked = checked.concat([`1-${item.substring(0, _index)}`]);
                } else {
                    checked = checked.concat(park?.children.map(region => `2-${region.id}`) || []);
                }
                str.push(`${parkName}(全部区域)`);
            } else {
                let regions = item.substring(_index + 1).split(',').map(regionID => {
                    let treeRegionID = `${parkID}_${regionID}`;
                    let name = allRegionsMap.current?.get(treeRegionID)?.text || regionID;
                    name && regionNames.push(name);
                    return `2-${item.substring(0, _index)}_${regionID}`;
                });
                str.push(`${parkName}(${regionNames.join(',')})`);
                checked = checked.concat(regions);
            }
        });
        setInputValue(str.join(','));
        setCheckedKeys(checked);
        setSubExpandedKeys(checked);
        setLastSaveKeys(checked);
    }, [value, treeData]);

    return (
        <>
            <Input readOnly onClick={() => setVisible(true)} value={inputValue} disabled={disabled}></Input>
            <Modal
                destroyOnClose
                visible={visible}
                onCancel={()=>handleCancel()}
                width={1000}
                title="选择车场区域"
                onOk={() => handleData()}
            >
                <div style={{ padding: 20, display: 'flex' }}>
                    <div style={{ flex: 1, border: '1px solid #ececec', padding: 10, marginRight: 10 }}>
                        <div style={{ marginBottom: 20 }}>可选择车场区域</div>
                        <AutoComplete style={{width: '100%',marginBottom: 20}} options={autoCompleteOptions} onSearch={handleSearch} onSelect={handleAutoCompleteSelect} placeholder="输入搜索"></AutoComplete>
                        <Tree
                            defaultExpandAll
                            checkable
                            selectedKeys={selectedKeys}
                            height={450}
                            checkedKeys={checkedKeys}
                            treeData={treeData}
                            onCheck={handleCheck}
                            onSelected={handleMainTreeSelect}
                            ref={tree}
                            showIcon
                        />
                    </div>
                    <div style={{ flex: 1, border: '1px solid #ececec', padding: 10, marginRight: 10 }}>
                        <div style={{ marginBottom: 20 }}>已选择车场区域</div>
                        <Tree
                            checkable
                            defaultExpandAll
                            checkedKeys={checkedKeys}
                            treeData={selectedTree}
                            onCheck={handleSelectedCheck}
                            onSelect={handleSelect}
                            height={450}
                            ref={subTree}
                            showIcon
                            expandedKeys={subExpandedKeys}
                            onExpand={handleSubTreeExpand}
                        ></Tree>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default class RegionTreeSelect extends PureComponent {
    render() {
        return (
            <Region {...this.props}></Region>
        );
    }
}
