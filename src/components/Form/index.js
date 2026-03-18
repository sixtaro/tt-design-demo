import React from 'react';
import { Form as AntForm } from 'antd';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './index.less';

const { Item, useForm, useWatch, List, Provider } = AntForm;

const Form = ({ 
  layout, 
  labelCol, 
  wrapperCol, 
  version, 
  className, 
  colon,
  disabled,
  component,
  initialValues,
  name,
  preserve,
  requiredMark,
  scrollToFirstError,
  size,
  validateMessages,
  validateTrigger,
  onFinish,
  onFinishFailed,
  onValuesChange,
  ...props 
}) => {
  const formClassName = classNames(
    'tt-form',
    className
  );

  return (
    <AntForm
      layout={layout}
      labelCol={labelCol}
      wrapperCol={wrapperCol}
      className={formClassName}
      colon={colon}
      disabled={disabled}
      component={component}
      initialValues={initialValues}
      name={name}
      preserve={preserve}
      requiredMark={requiredMark}
      scrollToFirstError={scrollToFirstError}
      size={size}
      validateMessages={validateMessages}
      validateTrigger={validateTrigger}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      onValuesChange={onValuesChange}
      {...props}
      data-component-version={version}
    />
  );
};

Form.Item = Item;
Form.useForm = useForm;
Form.useWatch = useWatch;
Form.List = List;
Form.Provider = Provider;
Form.version = componentVersions.Form || '1.0.0';

Form.propTypes = {
  version: PropTypes.string,
  className: PropTypes.string,
  layout: PropTypes.oneOf(['horizontal', 'vertical', 'inline']),
  labelCol: PropTypes.object,
  wrapperCol: PropTypes.object,
  colon: PropTypes.bool,
  disabled: PropTypes.bool,
  component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  initialValues: PropTypes.object,
  name: PropTypes.string,
  preserve: PropTypes.bool,
  requiredMark: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf(['optional'])]),
  scrollToFirstError: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  size: PropTypes.oneOf(['small', 'default', 'large']),
  validateMessages: PropTypes.object,
  validateTrigger: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  onFinish: PropTypes.func,
  onFinishFailed: PropTypes.func,
  onValuesChange: PropTypes.func,
};

export default Form;
