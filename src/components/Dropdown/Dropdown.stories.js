import React, { useState } from 'react';
import Button from '../Button';
import { DownOutlined } from '@ant-design/icons';
import Dropdown from './index';

export default {
  title: '导航/Dropdown 下拉菜单',
  component: Dropdown,
  parameters: {
    docs: {
      description: {
        component: `Dropdown 下拉菜单组件 - 版本: ${Dropdown.version}\n\n点击或悬停触发的下拉菜单组件，支持多种触发方式、多级菜单、搜索功能、自定义添加等。`
      }
    }
  },
  argTypes: {
    trigger: {
      control: {
        type: 'select',
        options: ['hover', 'click', 'contextMenu']
      }
    },
    placement: {
      control: {
        type: 'select',
        options: ['top', 'topLeft', 'topRight', 'bottom', 'bottomLeft', 'bottomRight']
      }
    },
    visible: {
      control: 'boolean'
    },
    disabled: {
      control: 'boolean'
    },
    searchable: {
      control: 'boolean'
    },
    addable: {
      control: 'boolean'
    },
    addMode: {
      control: {
        type: 'select',
        options: ['inline', 'popover']
      }
    },
    onVisibleChange: {
      action: 'visibleChange'
    },
    onSelect: {
      action: 'select'
    },
    onAdd: {
      action: 'add'
    },
    version: {
      control: 'text'
    }
  }
};

const basicItems = [
  { key: '1', label: '菜单项 1' },
  { key: '2', label: '菜单项 2' },
  { key: '3', label: '菜单项 3' },
];

const multiLevelItems = [
  { key: '1', label: '一级菜单 1' },
  {
    key: '2',
    label: '一级菜单 2',
    children: [
      { key: '2-1', label: '二级菜单 2-1' },
      {
        key: '2-2',
        label: '二级菜单 2-2',
        children: [
          { key: '2-2-1', label: '三级菜单 2-2-1' },
          { key: '2-2-2', label: '三级菜单 2-2-2' },
        ]
      },
    ]
  },
  { key: '3', label: '一级菜单 3' },
];

const manyItems = [
  { key: '1', label: '选项 1' },
  { key: '2', label: '选项 2' },
  { key: '3', label: '选项 3' },
  { key: '4', label: '选项 4' },
  { key: '5', label: '选项 5' },
  { key: '6', label: '选项 6' },
  { key: '7', label: '选项 7' },
  { key: '8', label: '选项 8' },
];

const Template = (args) => (
  <Dropdown {...args}>
    <Button type="primary">
      点击触发下拉菜单 <DownOutlined />
    </Button>
  </Dropdown>
);

export const Default = Template.bind({});
Default.args = {
  trigger: ['click'],
  placement: 'bottom',
  items: basicItems,
  version: Dropdown.version
};
Default.storyName = '默认用法';

export const MultiLevel = () => {
  return (
    <Dropdown
      placement="bottom"
      items={multiLevelItems}
      multiple
      version={Dropdown.version}
      visible={true}
    >
      <Button type="primary">
        多级菜单 <DownOutlined />
      </Button>
    </Dropdown>
  );
};
MultiLevel.storyName = '多级菜单';

export const WithSearch = () => {
  return (
    <Dropdown
      trigger={['click']}
      placement="bottom"
      items={basicItems}
      searchable
      searchPlaceholder="请输入关键字"
      version={Dropdown.version}
    >
      <Button type="primary">
        带搜索 <DownOutlined />
      </Button>
    </Dropdown>
  );
};
WithSearch.storyName = '带搜索功能';

export const WithAddInline = () => {
  const [items, setItems] = useState(basicItems);
  const handleAdd = (value) => {
    setItems([...items, { key: `new-${Date.now()}`, label: value }]);
  };
  return (
    <Dropdown
      trigger={['click']}
      placement="bottom"
      items={items}
      addable
      addMode="inline"
      onAdd={handleAdd}
      version={Dropdown.version}
    >
      <Button type="primary">
        内联添加 <DownOutlined />
      </Button>
    </Dropdown>
  );
};
WithAddInline.storyName = '内联添加';

export const WithAddPopover = () => {
  const [items, setItems] = useState(basicItems);
  const handleAdd = (value) => {
    setItems([...items, { key: `new-${Date.now()}`, label: value }]);
  };
  return (
    <Dropdown
      trigger={['click']}
      placement="bottom"
      items={items}
      addable
      addMode="popover"
      onAdd={handleAdd}
      version={Dropdown.version}
    >
      <Button type="primary">
        弹窗添加 <DownOutlined />
      </Button>
    </Dropdown>
  );
};
WithAddPopover.storyName = '弹窗添加';

export const WithMaxVisible = () => {
  return (
    <Dropdown
      trigger={['click']}
      placement="bottom"
      items={manyItems}
      maxVisible={5}
      version={Dropdown.version}
    >
      <Button type="primary">
        限制显示数量 <DownOutlined />
      </Button>
    </Dropdown>
  );
};
WithMaxVisible.storyName = '限制显示数量';

export const WithSelected = () => {
  const [selectedKey, setSelectedKey] = useState('1');
  return (
    <Dropdown
      trigger={['click']}
      placement="bottom"
      items={basicItems}
      selectedKey={selectedKey}
      onSelect={({ key }) => setSelectedKey(key)}
      version={Dropdown.version}
    >
      <Button type="primary">
        选中状态 <DownOutlined />
      </Button>
    </Dropdown>
  );
};
WithSelected.storyName = '选中状态';

export const AllFeatures = () => {
  const [items, setItems] = useState(manyItems);
  const [selectedKey, setSelectedKey] = useState(null);
  const handleAdd = (value) => {
    setItems([...items, { key: `new-${Date.now()}`, label: value }]);
  };
  return (
    <Dropdown
      trigger={['click']}
      placement="bottom"
      items={items}
      searchable
      addable
      addMode="inline"
      maxVisible={5}
      selectedKey={selectedKey}
      onSelect={({ key }) => setSelectedKey(key)}
      onAdd={handleAdd}
      version={Dropdown.version}
    >
      <Button type="primary">
        全部功能 <DownOutlined />
      </Button>
    </Dropdown>
  );
};
AllFeatures.storyName = '全部功能';
