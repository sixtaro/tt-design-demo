import React from 'react';
import Card from './index';

export default {
  title: '通用/Card 卡片',
  component: Card,
  parameters: {
    docs: {
      description: {
        component: `Card 组件 - 版本: ${Card.version}`
      }
    }
  },
  argTypes: {
    version: {
      control: 'text',
      description: '组件版本号，会渲染为 data-component-version 属性'
    }
  }
};

const Template = (args) => (
  <Card {...args} style={{ width: 300 }}>
    <p>Card content</p>
    <p>Card content</p>
    <p>Card content</p>
  </Card>
);

export const Default = Template.bind({});
Default.args = {
  title: 'Default Card',
  version: Card.version
};

export const WithExtra = Template.bind({});
WithExtra.args = {
  title: 'Card with Extra',
  extra: <a href="#">More</a>,
  version: Card.version
};

export const Hoverable = Template.bind({});
Hoverable.args = {
  title: 'Hoverable Card',
  hoverable: true,
  version: Card.version
};

export const Loading = Template.bind({});
Loading.args = {
  title: 'Loading Card',
  loading: true,
  version: Card.version
};

export const WithMeta = () => (
  <Card
    style={{ width: 300 }}
    cover={<img alt="example" src="https://via.placeholder.com/300x200" />}
    version={Card.version}
  >
    <Card.Meta
      title="Card title"
      description="This is the description"
    />
  </Card>
);
