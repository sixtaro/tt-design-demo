import { message as AntMessage } from 'antd';
import { componentVersions } from '../../utils/version-config';

const Message = {};

Message.success = AntMessage.success;
Message.error = AntMessage.error;
Message.warning = AntMessage.warning;
Message.info = AntMessage.info;
Message.loading = AntMessage.loading;
Message.open = AntMessage.open;
Message.config = AntMessage.config;
Message.destroy = AntMessage.destroy;

Message.version = componentVersions.Message;

export default Message;
