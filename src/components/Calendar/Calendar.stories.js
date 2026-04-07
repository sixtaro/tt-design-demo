import React, { useState } from 'react';
import Calendar from './index';

export default {
  title: '数据展示/Calendar 日历',
  component: Calendar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `基于 Ant Design 4.24 封装的 Calendar 日历组件，版本：${Calendar.version}`
      }
    }
  }
};

// 基础用法
export const 基础用法 = () => <Calendar />;

// 受控模式
export const 受控模式 = () => {
  const [value, setValue] = useState(null);
  return <Calendar value={value} onChange={setValue} />;
};

// 卡片模式
export const 卡片模式 = () => <Calendar fullscreen={false} />;
