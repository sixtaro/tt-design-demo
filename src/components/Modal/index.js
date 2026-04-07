import React from 'react';
import { Modal as AntModal } from 'antd';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';

const Modal = ({
  title,
  visible,
  onCancel,
  onOk,
  footer,
  width,
  centered,
  mask,
  maskClosable,
  confirmLoading,
  version,
  className,
  ...props
}) => {
  const modalClassName = classNames(
    'tt-modal',
    centered && 'tt-modal-centered',
    className
  );

  return (
    <AntModal
      title={title}
      visible={visible}
      onCancel={onCancel}
      onOk={onOk}
      footer={footer}
      width={width}
      centered={centered}
      mask={mask}
      maskClosable={maskClosable}
      confirmLoading={confirmLoading}
      className={modalClassName}
      {...props}
      data-component-version={version}
    />
  );
};

Modal.version = componentVersions.Modal;

// 静态方法
Modal.info = AntModal.info;
Modal.success = AntModal.success;
Modal.error = AntModal.error;
Modal.warning = AntModal.warning;
Modal.confirm = AntModal.confirm;

export default Modal;
