import React, { useState } from 'react';
import Modal from './index';
import { Button } from '../../../src';

export default {
  title: '反馈/Modal 模态框',
  component: Modal,
  argTypes: {
    title: {
      control: 'text'
    },
    visible: {
      control: 'boolean'
    },
    width: {
      control: 'number'
    },
    centered: {
      control: 'boolean'
    },
    mask: {
      control: 'boolean'
    },
    maskClosable: {
      control: 'boolean'
    },
    confirmLoading: {
      control: 'boolean'
    },
    version: {
      control: 'text'
    }
  }
};

const Template = (args) => {
  const [visible, setVisible] = useState(args.visible || false);

  const handleOpen = () => setVisible(true);
  const handleCancel = () => setVisible(false);
  const handleOk = () => setVisible(false);

  return (
    <>
      <Button type="primary" onClick={handleOpen}>
        Open Modal
      </Button>
      <Modal
        {...args}
        visible={visible}
        onCancel={handleCancel}
        onOk={handleOk}
      />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  title: 'Default Modal',
  children: 'This is the default modal content',
  version: Modal.version
};

export const Centered = Template.bind({});
Centered.args = {
  title: 'Centered Modal',
  children: 'This is a centered modal',
  centered: true,
  version: Modal.version
};

export const WithCustomWidth = Template.bind({});
WithCustomWidth.args = {
  title: 'Modal with Custom Width',
  children: 'This modal has a custom width',
  width: 800,
  version: Modal.version
};

export const WithoutMask = Template.bind({});
WithoutMask.args = {
  title: 'Modal without Mask',
  children: 'This modal has no mask',
  mask: false,
  version: Modal.version
};

export const WithConfirmLoading = Template.bind({});
WithConfirmLoading.args = {
  title: 'Modal with Confirm Loading',
  children: 'Click OK to see loading state',
  confirmLoading: true,
  version: Modal.version
};

export const WithStaticMethods = () => {
  const showInfo = () => {
    Modal.info({
      title: 'This is info',
      content: 'Some information content',
    });
  };

  const showSuccess = () => {
    Modal.success({
      title: 'This is success',
      content: 'Operation successful',
    });
  };

  const showError = () => {
    Modal.error({
      title: 'This is error',
      content: 'Operation failed',
    });
  };

  const showWarning = () => {
    Modal.warning({
      title: 'This is warning',
      content: 'Please pay attention',
    });
  };

  const showConfirm = () => {
    Modal.confirm({
      title: 'Are you sure?',
      content: 'This action cannot be undone',
      onOk() {
        console.log('OK');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  return (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Button onClick={showInfo}>Info</Button>
      <Button onClick={showSuccess}>Success</Button>
      <Button onClick={showError}>Error</Button>
      <Button onClick={showWarning}>Warning</Button>
      <Button onClick={showConfirm}>Confirm</Button>
    </div>
  );
};

WithStaticMethods.args = {
  version: Modal.version
};
