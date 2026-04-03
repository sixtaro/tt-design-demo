import React, { useRef } from 'react';
import { Transfer as AntTransfer, ConfigProvider } from 'antd';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';
// import Empty from '../Empty';
import './index.less';

const Transfer = ({
  version,
  className,
  dataSource = [],
  targetKeys = [],
  selectedKeys,
  onChange,
  onSelectChange,
  render,
  showSearch = false,
  filterOption,
  titles,
  operations,
  footer,
  listStyle,
  locale,
  disabled = false,
  oneWay = false,
  pagination = false,
  showSelectAll = true,
  selectAllLabels,
  status,
  onSearch,
  onScroll,
  rowKey,
  children,
  style,
  ...props
}) => {
  const transferContainerRef = useRef(null);
  const transferClassName = classNames('tt-transfer', className);

  const defaultLocale = {
    itemUnit: '项',
    itemsUnit: '项',
    searchPlaceholder: '请输入关键字',
    // notFoundContent: (
    //   <Empty
    //     description="暂无数据"
    //     imageStyle={{ height: 40 }}
    //     style={{ margin: '24px 0 0' }}
    //     version={Empty.version}
    //   />
    // ),
    ...locale,
  };

  return (
    <div
      ref={transferContainerRef}
      className={transferClassName}
      data-component-version={version}
      style={style}
    >
      <ConfigProvider getPopupContainer={() => transferContainerRef.current || document.body}>
        <AntTransfer
          className="tt-transfer-inner"
          dataSource={dataSource}
          targetKeys={targetKeys}
          selectedKeys={selectedKeys}
          onChange={onChange}
          onSelectChange={onSelectChange}
          render={render}
          showSearch={showSearch}
          filterOption={filterOption}
          titles={titles}
          operations={operations}
          footer={footer}
          listStyle={listStyle}
          locale={defaultLocale}
          disabled={disabled}
          oneWay={oneWay}
          pagination={pagination}
          showSelectAll={showSelectAll}
          selectAllLabels={selectAllLabels}
          status={status}
          onSearch={onSearch}
          onScroll={onScroll}
          rowKey={rowKey}
          {...props}
        >
          {children}
        </AntTransfer>
      </ConfigProvider>
    </div>
  );
};

Transfer.version = componentVersions.Transfer;

export default Transfer;
