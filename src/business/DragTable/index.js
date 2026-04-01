import React, { useEffect, useState, useMemo, useCallback, useRef, forwardRef, memo } from 'react';
import { MenuOutlined } from '@ant-design/icons';
import Table from '@/components/Table';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { componentVersions } from '@/utils/version-config';
import './index.less';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);

  const [removed] = result.splice(startIndex, 1);

  result.splice(endIndex, 0, removed);
  return result;
};

const DragHandle = SortableHandle(() => <MenuOutlined className="tt-drag-table-handle" />);

const SortableItem = SortableElement(props => <tr {...props} />);
const SortableBody = SortableContainer(props => <tbody {...props} />);

// 解决table有输入框，输入失焦问题 - 由于数据改变，输入框会重新加载失去焦点，使用ref保存数据，避免重新渲染
const DragTableComponent = ({ value, onChange, tableProps, columns, rowKey, version, className, ...restProps }, ref) => {
  const [dataSource, setDataSource] = useState(value || []);
  const dataSourceRef = useRef();

  const tableClassName = classNames('tt-drag-table', className);

  const _columns = useMemo(
    () => [
      {
        title: '排序',
        width: 60,
        className: 'tt-drag-table-drag-visible',
        render: () => <DragHandle />,
      },
      ...columns,
    ],
    [columns]
  );

  useEffect(() => {
    let data = value || [];
    dataSourceRef.current = data;
    setDataSource(data);
  }, [value]);

  const onSortEnd = useCallback(
    ({ oldIndex, newIndex }) => {
      if (oldIndex !== newIndex) {
        const temp = dataSourceRef.current || [];
        const items = reorder(temp.slice(), oldIndex, newIndex);
        dataSourceRef.current = items;
        setDataSource(items);
        onChange?.(items);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const DraggableContainer = useMemo(
    () => props => <SortableBody useDragHandle disableAutoscroll helperClass="tt-drag-table-row-dragging" onSortEnd={onSortEnd} lockAxis="y" {...props} />,
    [onSortEnd]
  );

  const DraggableBodyRow = useMemo(
    () =>
      ({ ...restPropsRow }) => {
        const index = dataSourceRef.current?.findIndex(item => {
          const key = typeof rowKey === 'function' ? rowKey(item) : item?.[rowKey];
          return key === restPropsRow['data-row-key'];
        });
        return <SortableItem index={index} {...restPropsRow} />;
      },
    [rowKey]
  );

  return (
    <Table
      ref={ref}
      className={tableClassName}
      rowClassName="tt-drag-table-row"
      pagination={false}
      dataSource={dataSource}
      columns={_columns}
      size="small"
      empty
      components={{
        body: {
          wrapper: DraggableContainer,
          row: DraggableBodyRow,
        },
      }}
      rowKey={rowKey}
      data-component-version={version}
      {...tableProps}
      {...restProps}
    />
  );
};

DragTableComponent.propTypes = {
  version: PropTypes.string,
  className: PropTypes.string,
  value: PropTypes.array,
  onChange: PropTypes.func,
  tableProps: PropTypes.object,
  columns: PropTypes.array.isRequired,
  rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
};

const DragTable = memo(forwardRef(DragTableComponent));
DragTable.displayName = 'DragTable';
DragTable.version = componentVersions.DragTable || '1.0.0';

export default DragTable;
