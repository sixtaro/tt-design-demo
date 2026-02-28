import React from 'react';
import { notification as AntNotification } from 'antd';
import { componentVersions } from '../../utils/version-config';

const Notification = {};

Notification.success = AntNotification.success;
Notification.error = AntNotification.error;
Notification.warning = AntNotification.warning;
Notification.info = AntNotification.info;
Notification.open = AntNotification.open;
Notification.config = AntNotification.config;
Notification.destroy = AntNotification.destroy;

Notification.version = componentVersions.Notification;

export default Notification;
