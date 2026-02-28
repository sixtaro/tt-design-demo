import React from 'react';
import Notification from './index';
import Button from '../Button';

export default {
  title: '反馈/Notification',
  component: Notification,
  parameters: {
    docs: {
      description: {
        component: `Notification 组件 - 版本: ${Notification.version}`
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
    <Button onClick={() => Notification.success({ message: 'Success', description: 'This is the content of the notification.' })}>Success</Button>
    <Button onClick={() => Notification.error({ message: 'Error', description: 'This is the content of the notification.' })}>Error</Button>
    <Button onClick={() => Notification.warning({ message: 'Warning', description: 'This is the content of the notification.' })}>Warning</Button>
    <Button onClick={() => Notification.info({ message: 'Info', description: 'This is the content of the notification.' })}>Info</Button>
  </div>
);
