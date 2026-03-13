import React, { PureComponent } from 'react';
import { Tree, Input, AutoComplete, Empty } from 'antd';
import './tree.less';
import ReactDOM from 'react-dom';
import cacheHelper from '@/business/cache/cache';
import { getIcon } from '@/business';
import { HomeOutlined } from '@ant-design/icons';
import NewTree, { OrgTreeSetting } from './treeV2';

const { TreeNode } = Tree;
const Search = Input.Search;

class Page extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: '',
            selectedKeys: [],
            expandedKeys: [],
            height: 500,
            dataSource: [
                {
                    type: 'org',
                    title: '组织',
                    children: [],
                },
                {
                    type: 'park',
                    title: '车场',
                    children: [],
                },
            ],
        };
    }
    directoryTree = React.createRef();

    componentDidMount() {
        if (this.props.defaultOrg) {
            const id = this.props.defaultOrg.id;
            const orgExist = !!Array.loopItem(this.props.orgtree, item => {
                if (item.attributes.orgID === this.props.defaultOrg.orgID) {
                    return item;
                }
            });
            if (orgExist) {
                this.setState({
                    expandedKeys: this.props.defaultOrg.parents.map(node => node.id),
                    selectedKeys: [id],
                });
            } else {
                const firstId = this.props.orgtree?.[0]?.id;
                this.setState({
                    expandedKeys: [firstId],
                    selectedKeys: [firstId],
                });
            }
        } else if (this.props.orgtree.length > 0) {
            this.setState({
                expandedKeys: [this.props.orgtree?.[0]?.id],
                selectedKeys: [this.props.orgtree?.[0]?.id],
            });
            // setTimeout(() => {
            //     const orgID = this.props.isPark ? this.getDefaultParkID() : this.getDefaultOrgID();
            //     if (orgID && orgID !== this.props.orgtree[0].id) {
            //         this.onSearchSelect('', {
            //             key: 'org_' + orgID,
            //         });
            //     }
            // });
        }
        this.onChange('');
        const searchParams = new URLSearchParams(window.location.search);
        const initParkID = searchParams.get('initParkID');
        if (initParkID) {
            setTimeout(() => {
                this.triggerTreeSelect(initParkID, 'parkID');
            });
        }
        setTimeout(() => {
            this.onWindowResize();
        });
        setTimeout(() => {
            this.onWindowResize();
        }, 400);
        window.addEventListener('resize', this.onWindowResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize);
    }

    getDefaultParkID = () => {
        if (cacheHelper.getCache('parkID')) {
            return cacheHelper.getCache('parkOrgID');
        }
        const { arr } = this.state;
        const park = arr.find(node => node.attributes.parkID > 0);
        if (park) {
            return park.attributes.orgID;
        }
        console.log(park);
    };
    getDefaultOrgID = () => {
        if (cacheHelper.getCache('orgID')) {
            return cacheHelper.getCache('orgID');
        }
    };

    componentDidUpdate() {
        //this.syncOwnNavSize();
    }

    //  props 数据变化时触发
    static getDerivedStateFromProps({ orgtree }, { lastOrgTree, expandedKeys}) {
        if (orgtree && orgtree.length > 0 && lastOrgTree !== orgtree) {
            let loopChildren = (childrens, parent) => {
                let arr = [];
                arr.count = 0;
                childrens &&
                    childrens.forEach((item, index) => {
                        item.parents = parent ? [...parent.parents, parent] : [];
                        arr.count++;
                        arr.push(item);
                        item.index = index;
                        if (item.children?.length) {
                            const cArr = loopChildren(item.children, item);
                            item.count = cArr.count;
                            arr.count += item.count;
                            arr.push(...cArr);
                        }
                    });
                return arr;
            };
            return { expandedKeys: [orgtree[0].id, ...expandedKeys], arr: loopChildren(orgtree), lastOrgTree: orgtree };
        }
        return null;
    }

    onChange = value => {
        let dataSource = [
            {
                type: 'org',
                title: '组织',
                children: [],
            },
            {
                type: 'park',
                title: '车场',
                children: [],
            },
        ];
        this.state.arr &&
            this.state.arr.forEach(item => {
                if (item.text.indexOf(value) > -1) {
                    if (item.attributes.parkID === 0) {
                        dataSource[0].children.push(item);
                    } else {
                        dataSource[1].children.push(item);
                    }
                }
            });
        if (dataSource[1].children.length === 0) {
            dataSource.pop();
        }
        if (dataSource[0].children.length === 0) {
            dataSource.shift();
        }
        this.setState({ dataSource, searchValue: value });
    };

    onSearchSelect = (value, option) => {
        const key = option.key;
        let { expandedKeys, arr } = this.state;
        let findChild =
            arr &&
            arr.find(item => {
                return item.id === key;
            });
        if (findChild?.attributes?.parents instanceof Array) {
            findChild.attributes.parents.forEach(parent => {
                if (!expandedKeys.includes(parent.id)) {
                    expandedKeys.push(parent.id);
                }
            });
            this.props.onTreeSelect(findChild.attributes);
            this.setState({
                selectedKeys: [key],
                expandedKeys,
                searchValue: value,
            });
            setTimeout(() => {
                this.directoryTree.current && this.directoryTree.current.scrollTo({ key: key });
            }, 100);
            // const treeDom = ReactDOM.findDOMNode(this.refs.tree).querySelector('.ant-tree-list');
            // setTimeout(() => {
            //     let offsetTop = 0;
            //     const lineHeight = 20;
            //     for (let i = 1; i < arr.length; i++) {
            //         const arrItem = arr[i];
            //         if (arrItem.id === findChild.id) {
            //             break;
            //         }
            //         if (arrItem.count && expandedKeys.includes(arrItem.id)) {
            //             if (findChild.parents.some(p => p.id === arrItem.id)) {
            //                 offsetTop += arrItem.index * lineHeight;
            //             } else {
            //                 offsetTop += arrItem.count * lineHeight;
            //             }
            //         }
            //     }
            //     if (findChild.index) {
            //         offsetTop += findChild.index * lineHeight;
            //     }
            //     treeDom.scrollTop = offsetTop;
            //     setTimeout(() => {
            //         treeDom.scrollTop = offsetTop - 200;
            //     }, 100);
            // }, 100);
        }
    };

    onTreeSelect = (selectedKeys, { node }) => {
        if (this.props.onTreeSelect(node.data.attributes)) {
            this.setState({
                selectedKeys: selectedKeys,
            });
        }
    };

    changeOrg = orgID => {
        this.onSearchSelect('', {
            key: 'org_' + orgID,
        });
    };

    onExpand = expandedKeys => {
        const rootID = this.props.orgtree[0]?.id;
        if (!expandedKeys.includes(rootID)) {
            expandedKeys.splice(0, 0, rootID);
        }
        this.setState({ expandedKeys });
    };

    triggerTreeSelect = (id, idType = 'orgID') => {
        if (idType === 'orgID') {
            this.onSearchSelect('', {
                key: 'org_' + id,
            });
        }

        if (idType === 'parkID') {
            this.searchParkNode(id);
        }
    };

    searchParkNode = id => {
        const { dataSource } = this.state;

        const parkList = dataSource.find(ds => ds.type === 'park')?.children || [];

        const parkNode = parkList.find(node => node.attributes.parkID === +id);

        if (parkNode) {
            this.onSearchSelect('', {
                key: parkNode.id,
            });
        }
    };

    onWindowResize = () => {
        const treeDom = ReactDOM.findDOMNode(this.refs.tree);
        let height = this.state.height || 500;
        if (treeDom?.offsetHeight) {
            height = treeDom.offsetHeight - 33;
        }
        this.setState({ height });
        return height;
    };

    render() {
        const { dataSource, selectedKeys, expandedKeys, height } = this.state;
        const { orgtree, isPark, onSettingChange } = this.props;
        const loop = data =>
            data &&
            data.map(item => {
                if (item.attributes.parkID === 0) {
                    const subnode = loop(item.children);
                    return (
                        <TreeNode
                            className={`ref${item.id}`}
                            selectable={!isPark}
                            key={item.id}
                            title={
                                <>
                                    <span className="title-content">{item.text}</span>
                                    <span className="online-status">{item.attributes.onlineOrder === 0 ? getIcon('icon-weilianwang') : ''}</span>
                                </>
                            }
                            icon={item === orgtree[0] ? <HomeOutlined /> : getIcon(item.attributes.orgType === 2 ? 'icon-xiangmu' : 'icon-org')}
                            data={item}
                            ref={ref => {
                                item.ref = ref;
                            }}
                        >
                            {subnode}
                        </TreeNode>
                    );
                }
                let iconType = 'icon-park';
                switch (item.attributes.orgType) {
                    case 2:
                        iconType = 'icon-xiangmu';
                        break;
                    case 4:
                        iconType = 'icon-org';
                        break;
                }
                // <Tooltip title="进入车场"><a className="go-park" onClick={e => {
                //     e.stopPropagation();
                // }} target="_blank" rel="noopener noreferrer" href={`index.html#park/${item.attributes.parkID}`}><Icon type="right-circle" theme="twoTone" className="normal" twoToneColor="#ddd" /><Icon type="right-circle" className="active" /></a></Tooltip>
                return (
                    <TreeNode
                        className={`ref${item.id}`}
                        key={item.id}
                        title={
                            <div className="park" title={item.text}>
                                <span className="title-content">{item.text}</span>
                                <span className="online-status">{item.attributes.onlineOrder === 0 ? getIcon('icon-weilianwang') : ''}</span>
                            </div>
                        }
                        icon={getIcon(iconType)}
                        data={item}
                        ref={ref => {
                            item.ref = ref;
                        }}
                    />
                );
            });

        const options = dataSource
            .filter(group => group.children.length)
            .map(group => ({
                label: group.title,
                options: group.children.map(opt => ({
                    value: opt.text,
                    key: opt.id,
                })),
            }));
        return (
            <div className="old-side-tree" ref="tree">
                <div className="complete-row">
                    <AutoComplete
                        options={options}
                        onSearch={this.onChange}
                        onSelect={this.onSearchSelect}
                        notFoundContent={<Empty description="无匹配项" image={Empty.PRESENTED_IMAGE_SIMPLE}></Empty>}
                        className="auto-complete"
                    >
                        <Search className="custom-search" placeholder="请输入需要查找的机构" allowClear />
                    </AutoComplete>
                    <OrgTreeSetting onSettingChange={onSettingChange}></OrgTreeSetting>
                </div>
                <Tree.DirectoryTree
                    ref={this.directoryTree}
                    showIcon
                    blockNode
                    height={height}
                    multiple={!isPark}
                    onSelect={this.onTreeSelect}
                    className="tree"
                    selectedKeys={selectedKeys}
                    expandedKeys={expandedKeys}
                    onExpand={this.onExpand}
                >
                    {loop(orgtree)}
                </Tree.DirectoryTree>
            </div>
        );
    }
}

const OrgTree = window.projectName === 'desktop' || window.projectName === 'managerV3' ? NewTree : Page;

export default OrgTree;
