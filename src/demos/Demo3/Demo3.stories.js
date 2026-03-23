import React, { useState } from 'react';
import Button from '../../components/Button';
import Demo3 from './index';

export default {
  title: '案例/Demo3-添加调度计划',
  component: Demo3,
  parameters: {
    docs: {
      description: {
        component: 'Demo3 - 根据设计稿还原的添加调度计划配置表单页面'
      }
    }
  }
};

const Template = () => {
  const [visible, setVisible] = useState(false);

  const handleOpen = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleOk = () => {
    console.log('确定');
    setVisible(false);
  };

  return (
    <div style={{ padding: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
      <Button type="primary" onClick={handleOpen}>
        打开Demo3调度计划Modal
      </Button>
      <Demo3
        visible={visible}
        onCancel={handleCancel}
        onOk={handleOk}
      />
    </div>
  );
};

export const 默认示例 = Template.bind({});
默认示例.args = {};
