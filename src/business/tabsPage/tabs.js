import React, { PureComponent, Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Tabs, Layout, Spin, Tooltip, Typography, message, Dropdown, Menu, Empty } from 'antd';
import Tree from '../tree/tree';
import { request, Utils, Storage } from '@/utils';
import { CloseOutlined, PushpinFilled, PushpinOutlined, SyncOutlined } from '@ant-design/icons';
import cacheHelper from '@/business/cache/cache';
import installOrStart from './installOrStart';
import { getIcon } from '@/business';
import Verify from './verify';
import Finder from './finder';
import ConfigPage from '../configPage/configPage';
import HelpCenter from '../helpCenter2/helpCenter';
import './tab.less';
import './tab-desktop.less';
import { mockOrg } from './mockData';
import { ReplaceContext } from '@/utils/replaceProvider';
import PageComponent from './pageComponent';
import Track from '@/business/track/track';
import { getPageView, isTabPage } from './utils';

const { Sider, Content } = Layout;
const { Text } = Typography;

// const path = window._baseURL + 'home/';
class Page extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pages: [],
      init: false,
      orgTreeLoading: true,
      refreshKey: null,
    };
    this.pageKeyNumber = 1;
  }

  static contextType = ReplaceContext;

  keyDownEvent = e => {
    const index = e.keyCode - 49;
    if (e.altKey && index >= 0 && index < 10) {
      const key = this.state.pages[index]?.key;
      key && this.onChange(key);
    }
    if (e.altKey && e.code === 'KeyW') {
      this.closePage('current');
    }
    if (e.altKey && e.code === 'KeyR') {
      this.refreshPage('current');
    }
  };

  componentDidMount() {
    window.addEventListener('keydown', this.keyDownEvent);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.keyDownEvent);
  }

  componentDidUpdate(prevProps, prevState) {
    const { pages, activeKey, init } = this.state;
    if ((this.props.version === 'V3' || window.projectName === 'managerV3') && !init && this.props.navrights?.length) {
      const page = this.getRight(this.props.defaultRightName);
      if (page) {
        this.changeShow(page);
      } else {
        this.changeShow(this.props.navrights?.[0]?.children?.[0]);
      }
      this.setState({ init: true });
    }
    if (prevState.activeKey !== this.state.activeKey) {
      const activePage = pages.find(page => page.key === activeKey);
      if (!Object.isEmpty(activePage?.data?.parents)) {
        this.props.setSelectedMenuItem?.(activePage.data.parents.map(n => `${n}`));
      }
    }
    if (prevProps.orgtree !== this.props.orgtree) {
      this.state.pages.forEach(page => {
        // if (page.key === this.state.activeKey) {
        if (page.showTree) {
          page.filterOrgtree = this.getFilterOrgtree(page);
          if (page.org) {
            // 判断新机构树中是否存在上次选择的机构
            const hasOrg = Array.loopItem(page.filterOrgtree, item => {
              if (item.attributes.orgID === page.org.orgID) {
                return item;
              }
            });
            if (!hasOrg) {
              page.org = this.getDefaultOrgID(page.data.isPark, page.filterOrgtree);
            }
          } else {
            page.org = this.getDefaultOrgID(page.data.isPark, page.filterOrgtree);
          }
        }
        // }
      });
      this.setState({
        pages: [...this.state.pages],
        orgTreeLoading: false,
      });
    }
    if (prevState.activeKey !== this.state.activeKey) {
      const { appInfo } = this.props;
      const page = this.activePage;
      const { depStatus, allowPark, allowCharge, allowCommplatform, allowWash } = page?.data || {};
      if (typeof depStatus === 'string' && appInfo) {
        const businessTypes = appInfo.businessTypes.split(',');

        const hasPark = businessTypes.some(type => {
          if ((type === '0' && allowPark) || (type === '1' && allowCharge) || (type === '2' && allowWash) || (type === '3' && allowCommplatform)) {
            return true;
          } else {
            return false;
          }
        });

        if (!hasPark) {
          // message.warn('应用与页面的业务范围未配置或没有交集，机构树不展示任何项目节点');
        }
      }
    }
  }

  get activePage() {
    const { pages, activeKey } = this.state;

    return pages.find(page => page.key === activeKey);
  }

  getActivePage = () => {
    return this.activePage;
  };

  initNavDrop = () => {
    setTimeout(() => {
      if (this.isInitNavDrop) {
        return;
      }
      const tabsDom = ReactDOM.findDOMNode(this.refs.navTabs);
      if (tabsDom) {
        this.isInitNavDrop = true;
        const tabsNavDom = tabsDom.querySelector('.ant-tabs-nav-wrap');
        if (tabsNavDom) {
          tabsNavDom.ondragover = e => {
            e.preventDefault();
          };
          tabsNavDom.ondrop = e => {
            if (e.path[0] === tabsNavDom) {
              const oldIndex = Number(e.dataTransfer.getData('pageIndex'));
              const { pages } = this.state;
              const [oldPage] = pages.splice(oldIndex, 1);
              pages.push(oldPage);
              this.setState({ pages: [...pages] });
            }
          };
        }
      }
    });
  };

  // 刷新页面
  refreshPage = (pageID, forceRefresh) => {
    const page = this.getPage(pageID);
    if (page) {
      if (page.ref && page.ref.reload && !forceRefresh) {
        page.ref.reload();
      } else {
        const reloadPage = page.ref?.reloadPage;
        if (reloadPage?.getPageParams) {
          page.params = reloadPage?.getPageParams?.();
        }
        const component = page.component;
        page.component = () => <></>;
        this.setState({ pages: [...this.state.pages] }, () => {
          page.component = component;
          this.setState({ pages: [...this.state.pages] }, () => {
            const reloadPage = page.ref?.reloadPage;
            reloadPage?.reload?.();
          });
        });
      }
      this.setState({
        refreshKey: pageID,
      });
    }
  };

  clearRefreshKey() {
    this.setState({
      refreshKey: null,
    });
  }

  // 获取页面
  getPage = pageID => {
    const { pages, activeKey } = this.state;
    if (pageID === 'current') {
      pageID = activeKey;
    }
    const page = pages.find(
      page =>
        page === pageID ||
        page.data.rightID === pageID ||
        page.data.rightName === pageID ||
        page.key === pageID ||
        page.data.path === pageID ||
        page.data.pageID === pageID ||
        page.data.pageParam === pageID
    );
    return page;
  };

  getFilterOrgtree(page) {
    const { orgtree, appInfo, showEmptyNode } = this.props;
    // const page = this.activePage;

    const { depStatus, allowPark, allowCharge, allowCommplatform, allowEBike, isClosedPark, isRoadsidePark } = page?.data || {};
    let businessTypes = ['0', '1', '2', '3'];
    if (appInfo) {
      businessTypes = appInfo?.businessTypes?.split(',') || [];
    }

    const iterator = item => {
      if ([1, 3].includes(item.attributes.orgType)) {
        let text = item.text;
        let attributes = item.attributes;
        if (typeof depStatus === 'string') {
          if (!allowPark || !businessTypes.includes('0')) {
            text = text.replace(/\(\d+\/\d+\)/, '');
            attributes = {
              ...item.attributes,
              parkIDs: [],
              parks: [],
            };
          }
          if ((!allowCharge || !businessTypes.includes('1')) && (!allowEBike || !businessTypes.includes('4'))) {
            attributes = {
              ...item.attributes,
              stationIDs: [],
            };
          }
        }
        const result = {
          ...item,
          text,
          attributes,
          children: item.children.map(iterator).filter(Boolean),
        };

        if (typeof showEmptyNode === 'boolean' && !showEmptyNode) {
          if (result.children.length === 0) {
            return null;
          }
        }

        return result;
      } else {
        const orgType = item.attributes.orgType;
        if (typeof depStatus === 'string') {
          if (orgType === 0) {
            // 车场节点
            if (!allowPark || !businessTypes.includes('0')) {
              return null;
            }
            // 配置了封闭/路侧车场，需要过滤
            if (isClosedPark) {
              if (item.attributes.isRoadSide === 0) {
                return item;
              } else {
                return null;
              }
            }
            if (isRoadsidePark) {
              if (item.attributes.isRoadSide > 0) {
                return item;
              } else {
                return null;
              }
            }
          }
          if (orgType === 4) {
            // 充电站节点
            if (!allowCharge || !businessTypes.includes('1')) {
              return null;
            }
          }
          if (orgType === 2) {
            if (!allowCommplatform || !businessTypes.includes('3')) {
              return null;
            }
          }
          if (orgType === 5) {
            // 二轮车节点
            if (!allowEBike || !businessTypes.includes('4')) {
              return null;
            }
          }
        }
        return item;
      }
    };

    if (typeof depStatus === 'string') {
      return orgtree.map(root => ({
        ...root,
        children: root.children.map(iterator).filter(Boolean),
      }));
    }

    return orgtree;
  }

  // 获取上次选择的org
  getDefaultOrgID = (isPark, filterOrgtree) => {
    let org = cacheHelper.getCache('org');
    // 如果org不存在于orgtree中，就把org置空
    if (org) {
      const orgExist = !!Array.loopItem(filterOrgtree, item => {
        if (item.attributes.orgID === org.orgID) {
          org = item.attributes;
          return item;
        }
      });

      if (!orgExist) {
        org = null;
      }
    }

    if (isPark && !org?.parkID) {
      const park = Array.loopItem(filterOrgtree, item => {
        if (item.attributes.parkID > 0) {
          return item;
        }
      });
      if (park) {
        org = park.attributes;
      }
    }
    if (!org) {
      org = (filterOrgtree?.[0] || { attributes: { parents: [] } }).attributes;
    }
    if (this.props.origin === 'manager') {
      org = mockOrg;
    }
    org.id = 'org_' + org.orgID;
    cacheHelper.addNonNilCache('org', org);
    return org;
  };

  onChange = activeKey => {
    const page = this.state.pages.find(page => page.key === activeKey);
    if (page && page.org) {
      cacheHelper.addNonNilCache('parkID', page.org.parkID);
      cacheHelper.addNonNilCache('parkIDs', page.org.parkIDs);
      cacheHelper.addNonNilCache('orgID', page.org.orgID);
      cacheHelper.addNonNilCache('parkOrgID', page.org.orgID);
      cacheHelper.addNonNilCache('parkType', page.org.parkType);
      cacheHelper.addNonNilCache('dealerID', page.org.dealerID);
      cacheHelper.addNonNilCache('version', page.org.parkVersion);
      cacheHelper.addNonNilCache('orgText', page.org.parents?.map(o => o.name)?.join(' > '));
      cacheHelper.addNonNilCache('orgType', page.org.orgType);
      cacheHelper.addNonNilCache('sortID', page.org.id);
      cacheHelper.addNonNilCache('org', page.org);
      cacheHelper.addNonNilCache('isRoadSide', page.org.isRoadSide);
      page.onChangePark?.(page.org.orgID);
      // if (page.data && page.data.isPark) {
      //     if (page.org.parkID) {
      //         cacheHelper.addNonNilCache('parkID', page.org.parkID);
      //         cacheHelper.addNonNilCache('parkOrgID', page.org.orgID);
      //         cacheHelper.addNonNilCache('parkType', page.org.parkType);
      //         cacheHelper.addNonNilCache('dealerID', page.org.dealerID);
      //         cacheHelper.addNonNilCache('version', page.org.parkVersion);
      //     }
      // } else if (page.onChangePark) {
      //     cacheHelper.addNonNilCache('orgID', page.org.orgID);
      // }
    }
    if (page && page.ref && page.ref.resize) {
      setTimeout(() => {
        page.ref?.resize && page.ref.resize();
      });
    }
    // 触发浏览器resize事件，防止切换页面后布局不适配
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    });
    false && this.saveOpenTabs(page);
    this.setState({ activeKey, lastActiveKey: this.state.activeKey });
    // ----埋点 页面进入离开 使用未setState前的数据，不然删除的page拿不到数据
    // 处理非当前页面的情况
    if (this.state.activeKey !== activeKey) {
      this.pageLeave(this.state.activeKey);
      this.pageEnter(activeKey);
    }
  };

  // 页面进入
  pageEnter = (key, pages) => {
    const page = (pages || this.state.pages)?.find(page => page.key === key);
    const isTab = isTabPage(page);
    // 判断是否是已打开的tab页，对于关闭其他的tab页时，需要进入页面是tab的页面
    const isExistTab = this.state.pages.find(page => page.key === key);
    // 页面是tabs页，通过页面中的视图tab埋点
    if (page && (!isTab || isExistTab)) {
      const { pageID, pageName, viewID, viewName } = getPageView(page);
      console.log('埋点 pageEnter', pageName, 'viewID', viewID);
      Track?.trackPageEnter(pageID, {
        pageName,
        viewId: viewID,
        viewName,
      });
    }
  };
  // 页面离开
  pageLeave = (key, pages) => {
    const page = (pages || this.state.pages)?.find(page => page.key === key);
    // 页面离开不需要判断是否是tab页
    if (page) {
      const { pageID, pageName, viewID, viewName } = getPageView(page);
      console.log('埋点 pageLeave', pageName, 'viewID', viewID);
      Track?.trackPageLeave(pageID, {
        pageName,
        viewId: viewID,
        viewName,
      });
    }
  };

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  };

  remove = targetKey => {
    const { lastActiveKey } = this.state;
    let activeKey = this.state.activeKey;
    let lastIndex;
    let current = null;
    this.state.pages.forEach((page, i) => {
      if (page.key === targetKey) {
        lastIndex = i - 1;
        current = page;
      }
    });

    const removeFunc = () => {
      const pages = this.state.pages.filter(page => page.key !== targetKey);
      if (pages.length && activeKey === targetKey) {
        if (lastIndex >= 0) {
          activeKey = pages[lastIndex].key;
        } else {
          activeKey = pages[0].key;
        }
      }
      if (pages.length === 0) {
        // 对于删除第一个页面的情况，需要将activeKey设置为undefined
        activeKey = undefined;
      }
      // 如果关闭当前页面，并且上次打开页面依然存在，则返回上次打开页面
      if (targetKey === this.state.activeKey && pages.some(page => page.key === lastActiveKey)) {
        activeKey = lastActiveKey;
      }
      this.onChange(activeKey);
      // 页面进入离开 onChange实现
      this.setState({ pages, activeKey, lastActiveKey: targetKey });
    };
    if (typeof current?.ref?.onPageClose === 'function') {
      current.ref.onPageClose(removeFunc);
      return;
    }
    removeFunc();
  };

  closePage = pageID => {
    const page = this.getPage(pageID);
    if (page) {
      this.remove(page.key);
    }
  };

  removeAllPage = () => {
    this.setState({ pages: [], activeKey: undefined, lastActiveKey: undefined });
    // 只处理当前页面的离开，无需处理其他页面的离开，切换tab就已经离开了
    this.pageLeave(this.state.activeKey);
  };

  changePageTitle = ({ pageID = 'current', newTitle }) => {
    const { pages } = this.state;
    const page = this.getPage(pageID);
    if (page && page.title !== newTitle) {
      page.title = newTitle;
      this.setState({ pages: pages.concat() });
    }
  };

  onOrgChange = (page, org) => {
    const { depStatus } = page?.data || {};
    if (typeof depStatus === 'undefined') {
      if (page.data.isPark && !org.parkID) {
        message.info('请选择车场');
        return false;
      }
    }
    page.org = org;
    cacheHelper.addNonNilCache('parkID', org.parkID);
    cacheHelper.addNonNilCache('parkIDs', org.parkIDs);
    cacheHelper.addNonNilCache('orgID', org.orgID);
    cacheHelper.addNonNilCache('parkOrgID', org.orgID);
    cacheHelper.addNonNilCache('parkType', org.parkType);
    cacheHelper.addNonNilCache('dealerID', org.dealerID);
    cacheHelper.addNonNilCache('version', org.parkVersion);
    cacheHelper.addNonNilCache('orgText', org.parents.map(o => o.name).join(' > '));
    cacheHelper.addNonNilCache('orgType', org.orgType);
    cacheHelper.addNonNilCache('sortID', org.id);
    cacheHelper.addNonNilCache('org', org);
    cacheHelper.addNonNilCache('isRoadSide', page.org.isRoadSide);
    if (page.data.isPark) {
      if (org.parkID) {
        if (page.ref) {
          if (page.ref.onOrgChange) {
            page.ref.onOrgChange(org);
          }
        }
      }
      // else {
      //     message.info('请选择车场');
      //     return false;
      // }
    } else if (page.data.isCommplatform) {
      page.treeInfo = {
        id: org.orgID,
        code: org.code,
        sortID: org.id,
        name: org.name,
        orgType: org.orgType,
      };
      if (page.onTabPageEvent) {
        page.onTabPageEvent(page.treeInfo, 'change');
      }
    } else if (page.onChangePark) {
      page.onChangePark(org.orgID);
    }
    if (!page.data.isOldPage) {
      page.ref && page.ref.setState && page.ref.setState({ time: new Date() });
    } else {
      if (!page.onChangePark) {
        page.ref && page.ref.reload && page.ref.reload();
      }
    }
    return true;
  };

  changeShow = (para, manual, params, pageProps) => {
    console.log('open tab:', para);
    if (!para) {
      return;
    }
    const memberCardText = this.context?.textReplacements?.memberCard || '会员卡';
    if (para.displayName) {
      para.displayName = para.displayName.replace(/会员[卡车](?!管理)/g, memberCardText);
    }
    this.initNavDrop();
    /* cloudimplement 参数处理 start */
    const searchParams = new URLSearchParams(window.location.search);
    const hostName = searchParams.get('hostName');
    const parkID = searchParams.get('parkID');
    const token = searchParams.get('token');
    /* cloudimplement 参数处理  end */
    const { pages, activeKey } = this.state;
    const { user } = this.props;
    const { UserConfig } = user;

    user.token = user.token || token;

    const keywords = String.Resovles(para.url, '{', '}');
    let url = para.url || '';
    keywords.forEach(keyword => {
      url = String.replaceAll(url, '{' + keyword + '}', Object.getValue({ ...this.props, para }, keyword, keyword));
    });
    if (url.indexOf('~/') === 0) {
      url = url.replace('~/', window._baseURL);
    }
    if (this.props.origin !== 'manager' && (token || parkID)) {
      url = url + `/${token || user.token}?initParkID=${parkID}&hideTree=1&systemID=18`;
    }
    if (hostName) {
      url = hostName + url;
    }
    if (para.isApp) {
      const options = {
        startUrl: url,
        installUrl: para.path,
        appName: para.pageParam || para.displayName,
      };
      installOrStart(options);
    }
    if (para.newPage) {
      window.open(url);
      return;
    }
    // url地址请求参数-针对嵌入的页面的传参
    const urlRequestParams = Utils.getRequestParams('decode');
    // 增值服务的嵌入页面增加传参
    if (urlRequestParams.isValueAdd && urlRequestParams.identity) {
      this.props.api.home.valueadd = {
        ...this.props.api.home.valueadd,
        _params: {
          identity: urlRequestParams.identity,
        },
      };
      this.loopToAddParam(this.props.api.home.valueadd);
    }
    if (!para.originalSystemID) {
      para.originalSystemID = this.activePage?.data?.originalSystemID;
    }
    let newTab = para.multiple === true || ((para.multiple || para.multiple === undefined) && UserConfig?.newTab);
    const page = (!newTab && pages.find(page => page.data.rightID === para.rightID && page.data.path === para.path)) || {
      ...pageProps,
      title: para.displayName,
      showTree: urlRequestParams?.hideCommonTree ? !urlRequestParams?.hideCommonTree : para.showTree,
      displayTree: page => {
        page.showBar = false;
        this.updateState();
      },
      hideTree: page => {
        page.showBar = true;
        this.updateState();
      },
      showBar: !!urlRequestParams?.hideTree,
      barVisible: !urlRequestParams?.hideTree,
      url: para.url,
      data: para,
      options: para.options || [],
      params: params || undefined,
      pageID: para.pageID || (typeof para.pageParam === 'string' ? para.pageParam : undefined),
      newPage: true,
      urlRequestParams: urlRequestParams,
      pageGroup: para.pageGroup || `${user.userGroupID}-${para.appID || window.appInfo?.appID}`,
    };

    page.filterOrgtree = this.getFilterOrgtree(page);

    page.url = url;
    if (window.projectName === 'desktop') {
      this.checkStartPage(page);
    }
    // 页面需要短信验证后才能进入
    if (para.verify === '2' && !user.verify && user.userGroup.userGroupManagerTel) {
      this.setState({ showVerify: true, paraVerify: para });
      return;
    }

    if (params) {
      // 打开已经存在的tab页，重新赋值传参
      page.params = params;
    } else {
      // pageParam尝试解析为对象。
      let _pageParam = undefined;
      try {
        _pageParam = eval(`(${para.pageParam || 'undefined'})`);
        if (typeof _pageParam === 'object') {
          page.params = _pageParam;
          if (!page.pageID && _pageParam.pageID) {
            page.pageID = _pageParam.pageID;
          }
        } else {
          page.params = undefined;
        }
      } catch (error) {
        page.params = undefined;
      }
    }

    page.exist = !!pages.find(page => page.data.rightID === para.rightID && page.data.path === para.path);
    page.hasRight = rightName => page.options.includes(rightName);

    const Path = this.props.routes;
    if (page.newPage) {
      if (this.props.orgtree) {
        // 对于新打开的tab页，设置数据，解决老页面或tab页中有老页面拿不到数据的问题
        const org = this.getDefaultOrgID(para.isPark, page.filterOrgtree);
        cacheHelper.addNonNilCache('orgID', org.orgID);
        cacheHelper.addNonNilCache('orgText', org.parents.map(o => o.name).join(' > '));
        cacheHelper.addNonNilCache('orgType', org.orgType);
        cacheHelper.addNonNilCache('sortID', org.id);
        cacheHelper.addNonNilCache('org', org);
        cacheHelper.addNonNilCache('parkID', org.parkID);
        cacheHelper.addNonNilCache('parkIDs', org.parkIDs);
        cacheHelper.addNonNilCache('parkOrgID', org.orgID);
        cacheHelper.addNonNilCache('parkType', org.parkType);
        cacheHelper.addNonNilCache('dealerID', org.dealerID);
        cacheHelper.addNonNilCache('version', org.parkVersion);
        cacheHelper.addNonNilCache('isRoadSide', org.isRoadSide);
      }
      // 页面需要判断是否为云运营主体身份
      if (para.verify === '3' && user.userGroup?.operationUserGroupID !== user.userGroup?.userGroupID) {
        const Com = () => (
          <Layout>
            <Empty style={{ paddingTop: '10%' }} description="当前功能仅支持运营主体使用" />
          </Layout>
        );
        page.component = ConfigPage(Com, para.path, page);
      } else if (para.path && !para.isCloudPage) {
        const pagePath = Path[para.path];
        if (!pagePath) {
          console.log('no', para.path);
          return;
        }
        page.component = ConfigPage(pagePath, para.path, page);
      } else if (para.url) {
        page.component = ConfigPage(Path.Web, 'Web', page);

        if (this.props.orgtree) {
          window.__defineSetter__('onChangePark', func => {
            page.onChangePark = func;
            console.log(page.title, '已注册回调');
          });

          const org = this.getDefaultOrgID(para.isPark, page.filterOrgtree);
          // cacheHelper.addNonNilCache('orgID', org.orgID);
          // cacheHelper.addNonNilCache('orgText', org.parents.map(o => o.name).join(' > '));
          // cacheHelper.addNonNilCache('orgType', org.orgType);
          // cacheHelper.addNonNilCache('sortID', org.id);
          // cacheHelper.addNonNilCache('org', org);
          // cacheHelper.addNonNilCache('parkID', org.parkID);
          // cacheHelper.addNonNilCache('parkIDs', org.parkIDs);
          // cacheHelper.addNonNilCache('parkOrgID', org.orgID);
          // cacheHelper.addNonNilCache('parkType', org.parkType);
          // cacheHelper.addNonNilCache('dealerID', org.dealerID);
          // cacheHelper.addNonNilCache('version', org.parkVersion);
          // cacheHelper.addNonNilCache('isRoadSide', org.isRoadSide);
          page.treeInfo = {
            id: org.orgID,
            code: org.code,
            sortID: org.id,
            name: org.name,
            orgType: org.orgType,
          };
        }
      } else {
        if (window.projectName === 'desktop') {
          if (!Object.isEmpty(para.parents)) {
            this.props.setSelectedMenuItem?.(para.parents.map(n => `${n}`));
          }
        }
        console.log('emtpy page', para);
        return;
      }
    }
    if (para.showTree && page.newPage) {
      // 且不是已打开的页面
      page.org = this.getDefaultOrgID(para.isPark, page.filterOrgtree);
    }
    let temp = [...pages];
    if (!page.key) {
      page.key = `tab${this.pageKeyNumber++}`;
      temp = pages.filter(p => p.data?.rightID !== page?.data.rightID);
      temp.push(page);
      false && manual && this.saveOpenTabs(page);
    }
    if (!page.newPage) {
      setTimeout(() => {
        page.ref?.reload && page.ref.reload();
      });
    }
    page.newPage = false;
    this.setState({
      pages: temp,
      activeKey: page.key,
      lastActiveKey: activeKey,
    });
    // ----埋点 页面进入离开 使用未setState前的数据，不然删除的page拿不到数据
    // 处理非当前页面的情况
    if (page.key !== activeKey) {
      // 只有非默认打开的页面才触发pageLeave事件
      if (!pageProps?.isStartPage) {
        this.pageLeave(activeKey, temp);
      }
      // 非默认打开页面 或 最后一个默认打开的页面才触发pageEnter事件
      if (!pageProps?.isStartPage || pageProps?.isLastPage) {
        this.pageEnter(page.key, temp);
      }
    }
  };

  // 给api下的某一类接口增加params参数
  loopToAddParam = obj => {
    if (typeof obj === 'object') {
      for (let key in obj) {
        if (key.indexOf('_') === 0) {
          continue;
        }
        let val = obj[key];
        if (typeof val === 'object') {
          if (obj._params) {
            if (val._params) {
              val._params = Object.extend(val._params, obj._params);
            } else {
              val._params = obj._params;
            }
          }
          if (!Object.isEmpty(val, [/^_/])) {
            this.loopToAddParam(val);
          }
        }
      }
    }
  };
  // 关闭其他标签
  closeOtherPage = pageID => {
    const page = this.getPage(pageID);
    // ----埋点 非当前页面，需要离开当前页面，进入新页面
    if (page.key !== this.state.activeKey) {
      this.pageLeave(this.state.activeKey);
      this.pageEnter(page.key);
    }
    // 当前页面，无需处理其他页面的离开，切换tab就已经离开了
    // TO DO 此处还未写对于未保存页面的关闭逻辑
    this.setState({ pages: [page], activeKey: page.key, lastActiveKey: undefined });
  };

  // 添加固定页面
  addStartPage = async page => {
    // const { user } = this.props;
    const user = Storage.get('user');
    const config = user.UserConfig || {};
    if (!config.startPage) {
      config.startPage = {};
    }
    const startPages = config.startPage[page.pageGroup || window.projectName] || [];
    if (!startPages.includes(page.data.rightName)) {
      startPages.push(page.data.rightName);
    }
    config.startPage[page.pageGroup || window.projectName] = startPages;
    page.isStartPage = true;
    await request('../PublicV2/home/sysversion/upsertuserconfig', { userID: user.userID, config }, { silence: true });
    Storage.set('user', user);
    // this.props.saveUser(user);
  };

  // 移除固定页面
  removeStartPage = async page => {
    // const { user } = this.props;
    const user = Storage.get('user');
    const config = user.UserConfig || {};
    if (!config.startPage) {
      config.startPage = {};
    }
    const startPages = config.startPage[page.pageGroup || window.projectName] || [];
    if (startPages.includes(page.data.rightName)) {
      startPages.splice(startPages.indexOf(page.data.rightName), 1);
    }
    page.isStartPage = false;
    await request('../PublicV2/home/sysversion/upsertuserconfig', { userID: user.userID, config }, { silence: true });
    Storage.set('user', user);
    // this.props.saveUser(user);
  };

  checkStartPage = page => {
    const user = Storage.get('user');
    const config = user.UserConfig || {};
    if (!config.startPage) {
      config.startPage = {};
    }
    const startPages = config.startPage[page.pageGroup || window.projectName] || [];
    page.isStartPage = startPages.includes(page.data.rightName);
  };

  saveOpenTabs = async page => {
    // const { user } = this.props;
    const user = Storage.get('user');
    // const activePage = pages.find(page => page.key === activeKey);
    const config = user.UserConfig || {};
    const lastTabs = [];
    if (page && page.data && page.data.rightName) {
      lastTabs.push(page.data.rightName);
    }
    // pages.forEach(page => {
    //     if (page.data.rightName && !lastTabs.includes(page.data.rightName)) {
    //         lastTabs.push(page.data.rightName);
    //     }
    // });
    if (JSON.stringify(config.lastTab) !== JSON.stringify(lastTabs)) {
      config.lastTab = lastTabs;
      await request(this.props.api.home.sysversion.upsertuserconfig, { userID: user.userID, config }, { silence: true });
      Storage.set('user', user);
      // this.props.saveUser(user);
    }
  };

  // 支持通过组件、路径、
  openPage = (pageName, page, pageProps) => {
    let para = {
      displayName: pageName,
      params: pageProps,
      pageProps,
    };
    if (typeof page === 'object' && page.$$typeof) {
      para.component = page;
    } else if (typeof page === 'object' && (page.rightID || page.path)) {
      para = { ...para, ...page };
    } else if (typeof page === 'string') {
      if (page.indexOf('://') > -1 || page.indexOf('//') === 0) {
        para.url = page;
      } else {
        para.path = page;
      }
    }
    this.changeShow(para, false, pageProps);
  };

  getRight = rightName => {
    const getNav = (childs, rightName) => {
      for (const i in childs) {
        const child = childs[i];
        if (child.rightName === rightName) {
          return child;
        }
        if (child.children) {
          const result = getNav(child.children, rightName);
          if (result) {
            return result;
          }
        }
      }
      return null;
    };
    return getNav(this.props.navrights, rightName);
  };

  hasRight = rightName => !!this.getRight(rightName);

  getSystemID = page => {
    return page.data.originalSystemID || this.props.appInfo?.systemID || window.systemID;
  };

  get pageControl() {
    return {
      currentPage: this.getPage('current'),
      openPage: this.openPage,
      closePage: this.closePage,
      refreshPage: this.refreshPage,
      pages: this.state.pages,
      changePageTitle: this.changePageTitle,
      setTreeVisible: this.setTreeVisible,
      setTreeBarVisible: this.setTreeBarVisible,
    };
  }

  showFinder() {
    this.refs.refFinder.show();
  }

  setTreeVisible = (pageID, visible) => {
    const page = this.getPage(pageID);
    if (page) {
      page.showBar = !visible;
      this.updateState();
    }
  };

  // 切换页面显示机构树的状态
  setTreeBarVisible = (pageID = 'current', visible) => {
    const page = this.getPage(pageID);
    if (page) {
      page.barVisible = visible;
      this.updateState();
    }
  };

  updateState = () => {
    this.setState(
      {
        now: Date.now(),
      },
      () => {
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        });
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 400);
      }
    );
  };

  changePageShowTree = (pageID, showTree) => {
    const temp = [];
    this.state.pages.forEach(page => {
      if (page.pageID === pageID) {
        temp.push({ ...page, showTree: showTree });
      } else {
        temp.push({ ...page });
      }
    });
    this.setState({
      pages: Array.from(temp),
    });
  };

  render() {
    const style = { width: '100%', height: '100%' };
    const { orgtree, getConfig, HelpCenter2, hideWelcome, className } = this.props;
    const { pages, activeKey, orgTreeLoading } = this.state;
    const hideHelpCenter = getConfig('V3.hideHelpCenter');
    // 特殊页面需要 设置tab页不display:none 如：杆位管理
    const notDisplayNone = { display: 'block', position: 'absolute', top: -9999, left: -9999, zIndex: -9999 };

    window.hasRight = this.hasRight;
    window.getConfig = getConfig;
    return (
      <div
        ref="navTabs"
        style={{
          width: '100%',
          height: '100%',
          overflow: 'auto',
          ...(hideWelcome && !pages.length ? { display: 'none' } : {}),
        }}
        className={`home-tabs-wrap components-tabs ${window.projectName} ${this.props.origin === 'manager' ? 'desktop' : ''}`}
      >
        <Tabs
          hideAdd
          onChange={this.onChange}
          onEdit={this.onEdit}
          activeKey={activeKey}
          type="editable-card"
          className={`park-tabs home-tabs ${pages.length < 2 ? 'less-than-2' : ''} ${className || ''} ${this.props.recycle ? 'recycle' : ''}`}
          style={style}
          popupClassName={window.projectName === 'desktop' || this.props.origin === 'manager' ? 'ant-drapdown-desktop' : ''}
        >
          {pages.map((page, index) => {
            const overlay = (
              <Menu>
                <Tooltip title="重新加载后，页面回到最初状态，未保存的数据将丢失" mouseLeaveDelay={0}>
                  <Menu.Item
                    key="1"
                    onClick={e => {
                      e.domEvent.stopPropagation();
                      e.domEvent.preventDefault();
                      this.refreshPage(page.key);
                    }}
                  >
                    重新加载
                  </Menu.Item>
                </Tooltip>
                {window.projectName === 'desktop' && (
                  <Menu.Item
                    key="4"
                    disabled={!page.data.rightName}
                    onClick={e => {
                      e.domEvent.stopPropagation();
                      e.domEvent.preventDefault();
                      page.isStartPage ? this.removeStartPage(page) : this.addStartPage(page);
                      this.setState({ now: new Date() });
                    }}
                  >
                    {page.isStartPage ? '取消起始页' : '设为起始页'}
                  </Menu.Item>
                )}
                <Menu.Divider />
                <Menu.Item
                  key="2"
                  onClick={e => {
                    e.domEvent.stopPropagation();
                    e.domEvent.preventDefault();
                    this.closePage(page.key);
                  }}
                >
                  关闭
                </Menu.Item>
                <Menu.Item
                  key="3"
                  disabled={pages.length === 1}
                  onClick={e => {
                    e.domEvent.stopPropagation();
                    e.domEvent.preventDefault();
                    this.closeOtherPage(page.key);
                  }}
                >
                  关闭其他
                </Menu.Item>
              </Menu>
            );
            return (
              <Tabs.TabPane
                tab={
                  <Dropdown overlay={overlay} trigger={['contextMenu']} overlayClassName="ant-drapdown-desktop">
                    <div
                      onDragStart={e => {
                        e.dataTransfer.setData('pageIndex', index);
                      }}
                      onDrop={e => {
                        e.stopPropagation();
                        const oldIndex = Number(e.dataTransfer.getData('pageIndex'));
                        const [oldPage] = pages.splice(oldIndex, 1);
                        pages.splice(index, 0, oldPage);
                        this.setState({ pages: [...pages] });
                      }}
                      draggable
                      onMouseEnter={() => {
                        if (page.ref && page.ref.reload) {
                          // this.setState({ now: new Date() });
                        }
                      }}
                      className={activeKey === page.key ? 'show-reload' : ''}
                    >
                      {(window.projectName === 'desktop' || this.props.origin === 'manager') && (
                        <Dropdown overlay={overlay} overlayClassName="ant-drapdown-desktop" trigger={['hover']}>
                          {(window.projectName === 'desktop' || this.props.origin === 'manager') && getIcon('icon-yemian', { className: 'icon-yemian' })}
                        </Dropdown>
                      )}
                      <Tooltip title={page.title} mouseEnterDelay={1.5} overlayClassName="tab-tooltip">
                        <Text ellipsis>{page.title}</Text>
                      </Tooltip>
                      {window.projectName === 'desktop' &&
                        page.data.rightName &&
                        (page.isStartPage ? (
                          <PushpinFilled
                            className="tab-start-btn-active"
                            onClick={() => {
                              this.removeStartPage(page);
                              this.setState({ now: new Date() });
                            }}
                          />
                        ) : (
                          <PushpinOutlined
                            className="tab-start-btn"
                            onClick={() => {
                              this.addStartPage(page);
                              this.setState({ now: new Date() });
                            }}
                          />
                        ))}
                      {window.projectName !== 'desktop' && this.props.origin !== 'manager' ? (
                        <Tooltip getPopupContainer={() => document.body} title="重新加载" mouseLeaveDelay={0}>
                          <SyncOutlined
                            className="tab-refresh-btn"
                            onClick={() => {
                              this.refreshPage(page.key);
                            }}
                          />
                        </Tooltip>
                      ) : (
                        ''
                      )}
                      <Tooltip title="关闭页面" getPopupContainer={() => document.body}>
                        <CloseOutlined
                          onClick={event => {
                            event.stopPropagation();
                            this.closePage(page.key);
                          }}
                        />
                      </Tooltip>
                    </div>
                  </Dropdown>
                }
                key={page.key}
                // 特殊页面需要 设置tab页不display:none 如：杆位管理  暂时写死，后续还有页面需要，可考虑做成配置项
                style={{ ...style, ...(activeKey !== page.key && page.data?.path === 'PoleManage' ? notDisplayNone : {}) }}
                className="abc"
                closable={false}
              >
                <Layout style={style} className={`page-content ${page.showBar ? 'close' : ''}`}>
                  {page.showTree && orgtree && (
                    <Sider
                      className={'sider'}
                      width={window.projectName === 'desktop' || this.props.origin === 'manager' ? 288 : 254}
                      style={this.props.origin !== 'manager' ? {} : { display: 'none' }}
                    >
                      <Spin spinning={orgTreeLoading}>
                        <Tree
                          getConfig={getConfig}
                          orgtree={page.filterOrgtree}
                          page={page}
                          isPark={page.data.isPark}
                          isSider
                          defaultOrg={page.org}
                          onTreeSelect={org => this.onOrgChange(page, org)}
                          onFoldClick={() => {
                            page.showBar = !page.showBar;
                            this.updateState();
                          }}
                          onSettingChange={this.props.onTreeSettingChange}
                          ref={ref => {
                            page.tree = ref;
                          }}
                        />
                      </Spin>
                    </Sider>
                  )}
                  <Content className={this.props.origin === 'manager' ? 'content from-manager-content' : 'content'} style={{ ...style }}>
                    {page.data?.isPark && page.org?.parkIDs?.length === 0 ? ( // 车场级页面，且企业下没有车场
                      <Empty style={{ paddingTop: '10%' }} description="请选择车场查看数据" />
                    ) : (
                      <Suspense fallback={<Spin style={{ ...style, paddingTop: '30%' }} />}>
                        {page.data?.showFlag === 1 && page.data?.remark && page.data?.rightName !== 'NAV_PUBLIC_MEMBER_CARD' && (
                          <div className="function-desc">{'功能说明\n' + page.data.remark}</div>
                        )}
                        <div style={{ flex: 1, height: '100%' }}>
                          <PageComponent
                            appInfo={this.props.appInfo}
                            page={page}
                            model={this.props.api}
                            routes={this.props.routes}
                            user={this.props.user}
                            openTab={this.props.openTab}
                            closePage={() => this.closePage(page.key)}
                            refreshPage={forceRefresh => this.refreshPage(page.key, forceRefresh)}
                            systemHook={this.props.systemHook}
                            hasAppOperateRight={this.props.hasAppOperateRight}
                            getConfig={getConfig}
                            getPageConfig={
                              this.props.api.manager?.sysconfig?.getpageconfig ||
                              this.props.api.home?.sysconfig?.getpageconfig ||
                              '../PublicV2/home/sysconfig/getpageconfig'
                            }
                            pageControl={this.pageControl}
                            hasRight={this.hasRight}
                            getRight={this.getRight}
                            getSystemID={() => this.getSystemID(page)}
                            origin={this.props.origin}
                            setTreeVisible={this.setTreeVisible}
                            tabsRef={this}
                            changePageShowTree={showTree => this.changePageShowTree(page.pageID, showTree)}
                          />
                        </div>
                      </Suspense>
                    )}
                  </Content>
                  {page.showTree && page.barVisible && this.props.origin !== 'manager' && (
                    <div
                      className="switchbar"
                      onClick={() => {
                        page.showBar = !page.showBar;
                        this.updateState();
                      }}
                    ></div>
                  )}
                  {!hideHelpCenter && HelpCenter2 && (
                    <div className="help-switch">
                      <HelpCenter2 param={{ rightID: page?.data?.rightID }} rightID={page?.data?.rightID} />
                    </div>
                  )}
                  {window.systemID === 5 && !hideHelpCenter && !HelpCenter2 && this.props.api.home?.helpcenter && (
                    <div className="help-switch">
                      <HelpCenter api={this.props.api.home.helpcenter.query} param={{ rightID: page?.data?.rightID }} rightID={page?.data?.rightID} />
                    </div>
                  )}
                </Layout>
              </Tabs.TabPane>
            );
          })}
        </Tabs>
        {this.state.showVerify ? (
          <Verify
            {...this.props}
            onOk={() => {
              this.changeShow(this.state.paraVerify);
              this.setState({ showVerify: false, paraVerify: null });
            }}
            onCancel={() => {
              this.setState({ showVerify: false, paraVerify: null });
            }}
          />
        ) : (
          ''
        )}
        <Finder navrights={this.props.navrights || []} go={this.changeShow} ref="refFinder"></Finder>
      </div>
    );
  }
}

export default Page;
