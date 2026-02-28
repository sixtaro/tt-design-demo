import React from 'react';
import Message from './index';
import Button from '../Button';

export default {
  title: '反馈/Message',
  component: Message,
  parameters: {
    docs: {
      description: {
        component: `Message 组件 - 版本: ${Message.version}`
      }
    }
  },
  argTypes: {
    version: {
      control: 'text',
      description: '组件版本号'
    }
  }
};

export const AllTypes = () => (
  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
    <Button onClick={() => Message.success('This is a success message')}>Success</Button>
    <Button onClick={() => Message.error('This is an error message')}>Error</Button>
    <Button onClick={() => Message.warning('This is a warning message')}>Warning</Button>
    <Button onClick={() => Message.info('This is an info message')}>Info</Button>
    <Button onClick={() => Message.loading('Action in progress..')}>Loading</Button>
  </div>
);
