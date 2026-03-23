import React, { useState } from 'react';
import Button from '../../components/Button';
import SchedulePlan from './index';

const SchedulePlanDemo = () => {
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

export default SchedulePlanDemo;
