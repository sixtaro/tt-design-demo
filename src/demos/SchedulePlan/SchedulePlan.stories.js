import React, { useState } from 'react';
import Button from '../../components/Button';
import SchedulePlan from './index';

export default {
  title: '案例/添加调度计划',
  component: SchedulePlan,
  parameters: {
    docs: {
      description: {
        component: '添加调度计划 - 完整的调度计划配置表单Modal示例'
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
        打开调度计划Modal
      </Button>
      <SchedulePlan
        visible={visible}
        onCancel={handleCancel}
        onOk={handleOk}
      />
    </div>
  );
};

export const 默认示例 = Template.bind({});
默认示例.args = {};
