import React from 'react';
import Skeleton from './index';
import Button from '../Button';

export default {
  title: '反馈/Skeleton 骨架屏',
  component: Skeleton,
  tags: ['autodocs'],
  argTypes: {
    active: { control: 'boolean' },
    loading: { control: 'boolean' },
    avatar: { control: 'boolean' },
    round: { control: 'boolean' },
    paragraph: { control: 'boolean' },
    title: { control: 'boolean' },
  },
};

const Template = (args) => <Skeleton {...args} />;

export const 基础用法 = Template.bind({});
基础用法.args = {
  active: true,
};

export const 复杂组合 = () => (
  <Skeleton avatar active paragraph={{ rows: 4 }} />
);

export const 包含子组件 = () => {
  const [loading, setLoading] = React.useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Skeleton loading={loading} avatar active>
        <div>
          <h4 style={{ margin: '0 0 8px' }}>标题内容</h4>
          <p style={{ margin: 0, color: 'var(--tt-text-secondary)' }}>
            这是实际的内容区域。当 loading 为 false 时显示此内容。
          </p>
        </div>
      </Skeleton>
      <Button onClick={() => setLoading(!loading)} type="primary">
        {loading ? '显示内容' : '显示骨架屏'}
      </Button>
    </div>
  );
};

export const 圆角 = () => (
  <Skeleton active round paragraph={{ rows: 3 }} />
);

export const 自定义样式 = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <Skeleton active title={false} paragraph={{ rows: 2 }} />
    <Skeleton active avatar paragraph={{ rows: 1 }} />
    <Skeleton active title={{ width: '50%' }} paragraph={{ rows: 3, width: ['80%', '60%', '40%'] }} />
  </div>
);
