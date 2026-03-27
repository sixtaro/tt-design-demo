import React from 'react';
import classNames from 'classnames';
import Breadcrumb from '../../components/Breadcrumb';
import Button from '../../components/Button';
import Card from '../../components/Card';
import DatePicker from '../../components/DatePicker';
import Form from '../../components/Form';
import Input from '../../components/Input';
import Pagination from '../../components/Pagination';
import Select from '../../components/Select';
import Table from '../../components/Table';
import './index.less';

const bgDecoration = 'https://www.figma.com/api/mcp/asset/cddd58b2-e68f-4ef7-8a32-df638ca12d1b';
const brandLogo = 'https://www.figma.com/api/mcp/asset/591e1f53-510f-4adb-9e4c-55b3efa99acf';
const menuIcon = 'https://www.figma.com/api/mcp/asset/88c4ae0d-6098-413d-b3c4-7053a0203920';
const agencyIcon = 'https://www.figma.com/api/mcp/asset/a5594928-779b-4d56-9054-d4b8380c3bed';
const arrowDownIcon = 'https://www.figma.com/api/mcp/asset/785add7d-35e7-47d1-bc7b-eb55bf4b4d3d';
const searchIcon = 'https://www.figma.com/api/mcp/asset/d49cb55a-e54c-4a2b-947c-d78bd6d034f1';
const recycleIcon = 'https://www.figma.com/api/mcp/asset/0094062c-997e-4223-a842-598e86bf79d1';
const exchangeIcon = 'https://www.figma.com/api/mcp/asset/5ac32557-bf8f-4204-bcc6-5161cc31d724';
const noticeBg = 'https://www.figma.com/api/mcp/asset/e02ac014-e306-40d2-8147-86d879013013';
const noticeShape = 'https://www.figma.com/api/mcp/asset/aea5dfbc-b86e-4ef5-b5f3-f58e5e042f2f';
const workflowIcon = 'https://www.figma.com/api/mcp/asset/24dc287c-7bb4-4ae7-a110-580f8f9949e3';
const approvalIcon = 'https://www.figma.com/api/mcp/asset/438bc822-f604-498b-8b9f-4653465f3f81';
const helpIcon = 'https://www.figma.com/api/mcp/asset/5220ac23-1a87-41d4-8eff-a07c051f5b2e';
const avatarBg = 'https://www.figma.com/api/mcp/asset/8fa6185d-dbf5-427e-8fd1-ff9e8c09fea9';
const avatarImage = 'https://www.figma.com/api/mcp/asset/1268cce4-8007-4201-9513-8310fb9d5131';
const tabBarBg = 'https://www.figma.com/api/mcp/asset/955591a5-f552-4a12-b1af-dc627e4abc59';
const tabCloseBg = 'https://www.figma.com/api/mcp/asset/2d6872ce-8c4a-46c5-bbca-9ca5cf904cad';
const tabCloseShape = 'https://www.figma.com/api/mcp/asset/a7906495-886b-4e35-bf44-7a6234864bf3';
const tabWidgetShape = 'https://www.figma.com/api/mcp/asset/e6f068a4-35fc-4c4e-ad8d-c7e525d55098';
const tabAllShape = 'https://www.figma.com/api/mcp/asset/fd53fb02-affc-45de-91c3-5edefb5b9a15';
const contentPanel = 'https://www.figma.com/api/mcp/asset/4eac4153-243c-40e2-97bb-29531c7efc6a';
const addContentIcon = 'https://www.figma.com/api/mcp/asset/d86b0e4f-549f-4934-b600-7e836b7cee53';
const collapseIcon = 'https://www.figma.com/api/mcp/asset/bff5ed97-f39e-4765-830f-ba345b021ff5';
const myAppIcon = 'https://www.figma.com/api/mcp/asset/5e62ff8d-5486-4b37-a50c-f601645c425d';
const myAppShape = 'https://www.figma.com/api/mcp/asset/cad4b8c6-ad95-41bb-81a7-b346b3196f7b';
const platformIcon = 'https://www.figma.com/api/mcp/asset/d3d1a9c6-ff27-4d8d-88d1-d088938904f1';
const organizationShape = 'https://www.figma.com/api/mcp/asset/857780c4-d195-4185-b9fd-52c71c884a0b';

const topNavItems = ['首页', '财务管理', '运营管理', '数据中心', '云维护', '车场管理', '系统管理'];

const { Option } = Select;

const overviewCards = [
  { title: '有效协议', value: '128', trend: '+12%', accent: 'primary' },
  { title: '本月签约', value: '32', trend: '+5%', accent: 'success' },
  { title: '待续约', value: '18', trend: '3天内', accent: 'warning' },
  { title: '异常记录', value: '6', trend: '-2', accent: 'danger' },
];

const agreementColumns = [
  {
    title: '协议编号',
    dataIndex: 'code',
    key: 'code',
  },
  {
    title: '车场名称',
    dataIndex: 'parkName',
    key: 'parkName',
  },
  {
    title: '运营模式',
    dataIndex: 'mode',
    key: 'mode',
  },
  {
    title: '负责人',
    dataIndex: 'owner',
    key: 'owner',
  },
  {
    title: '到期时间',
    dataIndex: 'expireAt',
    key: 'expireAt',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (text, record) => (
      <span
        className={classNames('tt-demo-parking-page__table-status', {
          'tt-demo-parking-page__table-status--active': record.statusType === 'active',
          'tt-demo-parking-page__table-status--warning': record.statusType === 'warning',
          'tt-demo-parking-page__table-status--inactive': record.statusType === 'inactive',
        })}
      >
        {text}
      </span>
    ),
  },
];

const agreementData = [
  {
    key: '1',
    code: 'XY-202603-001',
    parkName: '南山智停中心 A 库',
    mode: '时长包月',
    owner: '陈晨',
    expireAt: '2026-06-30',
    status: '执行中',
    statusType: 'active',
  },
  {
    key: '2',
    code: 'XY-202603-002',
    parkName: '滨江科创园地下停车场',
    mode: '企业预约',
    owner: '王倩',
    expireAt: '2026-04-15',
    status: '待续约',
    statusType: 'warning',
  },
  {
    key: '3',
    code: 'XY-202603-003',
    parkName: '国际会展中心 P2',
    mode: '临停代理',
    owner: '刘涛',
    expireAt: '2026-12-31',
    status: '执行中',
    statusType: 'active',
  },
  {
    key: '4',
    code: 'XY-202603-004',
    parkName: '西溪智慧园访客车场',
    mode: '停车券合作',
    owner: '赵悦',
    expireAt: '2026-03-29',
    status: '待处理',
    statusType: 'inactive',
  },
];

const sidebarItems = [
  { label: '商家管理', icon: menuIcon, top: 0 },
  { label: '运营平台', icon: menuIcon, top: 68 },
  { label: '用户管理', icon: menuIcon, top: 136 },
  { label: '会员停车', icon: menuIcon, top: 204 },
  { label: '线上出租', icon: menuIcon, top: 272 },
  { label: '异常处置', icon: menuIcon, top: 340 },
  { label: '临停代理', icon: agencyIcon, expanded: true, top: 408 },
  { label: '时长运营', active: true, top: 476 },
  { label: '预收快收', top: 544 },
];

const topActions = [
  { key: 'search', icon: searchIcon },
  { key: 'recycle', icon: recycleIcon },
  { key: 'exchange', icon: exchangeIcon },
  { key: 'notice', icon: noticeBg, overlay: noticeShape, badge: '99', special: true },
  { key: 'workflow', icon: workflowIcon },
  { key: 'approval', icon: approvalIcon },
  { key: 'help', icon: helpIcon },
];

const ParkingManagementPage = ({ className }) => {
  const pageClassName = classNames('tt-demo-parking-page', className);

  return (
    <div className={pageClassName}>
      <div className="tt-demo-parking-page__viewport">
        <div className="tt-demo-parking-page__stage">
          <div className="tt-demo-parking-page__background" />
          <img alt="" className="tt-demo-parking-page__decoration" src={bgDecoration} />

          <div className="tt-demo-parking-page__brand-block">
            <img alt="" className="tt-demo-parking-page__brand-logo" src={brandLogo} />
            <span className="tt-demo-parking-page__brand-text">停车管理云平台</span>
          </div>

          <div className="tt-demo-parking-page__primary-nav">
            {topNavItems.map((item) => (
              <div
                key={item}
                className={classNames('tt-demo-parking-page__primary-nav-item', {
                  'tt-demo-parking-page__primary-nav-item--active': item === '运营管理',
                })}
              >
                {item}
              </div>
            ))}
          </div>

          <div className="tt-demo-parking-page__top-actions">
            {topActions.map((item) => (
              <div
                key={item.key}
                className={classNames('tt-demo-parking-page__top-action', {
                  'tt-demo-parking-page__top-action--notice': item.special,
                })}
              >
                <img alt="" className="tt-demo-parking-page__top-action-icon" src={item.icon} />
                {item.overlay ? <img alt="" className="tt-demo-parking-page__top-action-overlay" src={item.overlay} /> : null}
                {item.badge ? <span className="tt-demo-parking-page__top-action-badge">{item.badge}</span> : null}
              </div>
            ))}
            <div className="tt-demo-parking-page__avatar">
              <img alt="" className="tt-demo-parking-page__avatar-bg" src={avatarBg} />
              <img alt="" className="tt-demo-parking-page__avatar-image" src={avatarImage} />
            </div>
          </div>

          <div className="tt-demo-parking-page__menu-strip">
            {topNavItems.map((item) => (
              <div key={item} className="tt-demo-parking-page__menu-strip-item">
                <span
                  className={classNames('tt-demo-parking-page__menu-strip-text', {
                    'tt-demo-parking-page__menu-strip-text--active': item === '运营管理',
                  })}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>

          <div className="tt-demo-parking-page__sidebar">
            {sidebarItems.map((item) => (
              <div
                key={item.label}
                className={classNames('tt-demo-parking-page__sidebar-item', {
                  'tt-demo-parking-page__sidebar-item--leaf': !item.icon,
                  'tt-demo-parking-page__sidebar-item--active': item.active,
                })}
                style={{ top: item.top }}
              >
                {item.icon ? <img alt="" className="tt-demo-parking-page__sidebar-icon" src={item.icon} /> : null}
                <span className="tt-demo-parking-page__sidebar-text">{item.label}</span>
                {item.icon && !item.active ? (
                  <img
                    alt=""
                    className={classNames('tt-demo-parking-page__sidebar-arrow', {
                      'tt-demo-parking-page__sidebar-arrow--expanded': item.expanded,
                    })}
                    src={arrowDownIcon}
                  />
                ) : null}
              </div>
            ))}
          </div>

          <div className="tt-demo-parking-page__tabbar">
            <img alt="" className="tt-demo-parking-page__tabbar-bg" src={tabBarBg} />
            <div className="tt-demo-parking-page__tab">
              <div className="tt-demo-parking-page__tab-button tt-demo-parking-page__tab-button--all">
                <img alt="" className="tt-demo-parking-page__tab-button-bg" src={tabCloseBg} />
                <img alt="" className="tt-demo-parking-page__tab-button-shape" src={tabAllShape} />
              </div>
              <span className="tt-demo-parking-page__tab-label">时长运营</span>
              <div className="tt-demo-parking-page__tab-button tt-demo-parking-page__tab-button--widget">
                <img alt="" className="tt-demo-parking-page__tab-button-bg" src={tabCloseBg} />
                <img alt="" className="tt-demo-parking-page__tab-button-shape" src={tabWidgetShape} />
              </div>
              <div className="tt-demo-parking-page__tab-button tt-demo-parking-page__tab-button--close">
                <img alt="" className="tt-demo-parking-page__tab-button-bg" src={tabCloseBg} />
                <img alt="" className="tt-demo-parking-page__tab-button-shape" src={tabCloseShape} />
              </div>
              <span className="tt-demo-parking-page__tab-divider" />
            </div>
          </div>

          <img alt="" className="tt-demo-parking-page__content-panel" src={contentPanel} />

          <div className="tt-demo-parking-page__portal">
            <div className="tt-demo-parking-page__portal-tools">
              <div className="tt-demo-parking-page__portal-add">
                <img alt="" className="tt-demo-parking-page__portal-add-icon" src={addContentIcon} />
                <span>添加内容</span>
              </div>
              <div className="tt-demo-parking-page__portal-collapse">
                <img alt="" className="tt-demo-parking-page__portal-collapse-icon" src={collapseIcon} />
              </div>
            </div>

            <span className="tt-demo-parking-page__portal-divider" />

            <div className="tt-demo-parking-page__portal-item">
              <span className="tt-demo-parking-page__portal-item-icon tt-demo-parking-page__portal-item-icon--myapp">
                <img alt="" className="tt-demo-parking-page__portal-icon-bg" src={myAppIcon} />
                <img alt="" className="tt-demo-parking-page__portal-icon-shape" src={myAppShape} />
              </span>
              <span>我的应用</span>
            </div>
            <div className="tt-demo-parking-page__portal-item">
              <img alt="" className="tt-demo-parking-page__portal-item-icon" src={platformIcon} />
              <span>平台管理</span>
            </div>
            <div className="tt-demo-parking-page__portal-item">
              <span className="tt-demo-parking-page__portal-item-icon tt-demo-parking-page__portal-item-icon--organization">
                <img alt="" className="tt-demo-parking-page__portal-icon-bg" src={myAppIcon} />
                <img alt="" className="tt-demo-parking-page__portal-icon-shape tt-demo-parking-page__portal-icon-shape--organization" src={organizationShape} />
              </span>
              <span>组织管理</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParkingManagementPage;
