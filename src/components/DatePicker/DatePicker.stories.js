import React from 'react';
import DatePicker from './index';

export default {
  title: '数据录入/DatePicker 日期选择器',
  component: DatePicker,
  parameters: {
    docs: {
      description: {
        component: `DatePicker 组件 - 版本: ${DatePicker.version}`
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

const Template = (args) => <DatePicker {...args} />;

export const Default = Template.bind({});
Default.args = {
  version: DatePicker.version
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
  version: DatePicker.version
};

export const WithFormat = Template.bind({});
WithFormat.args = {
  format: 'YYYY-MM-DD',
  placeholder: 'Please select date',
  version: DatePicker.version
};

export const RangePicker = () => <DatePicker.RangePicker version={DatePicker.version} />;

export const MonthPicker = () => <DatePicker.MonthPicker version={DatePicker.version} />;
