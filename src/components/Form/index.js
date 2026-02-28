import React from 'react';
import { Form as AntForm } from 'antd';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';

const { Item, useForm, useWatch, List } = AntForm;

const Form = ({ layout, labelCol, wrapperCol, version, className, ...props }) => {
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
      {...props}
      data-component-version={version}
    />
  );
};

Form.Item = Item;
Form.useForm = useForm;
Form.useWatch = useWatch;
Form.List = List;
Form.version = componentVersions.Form;

export default Form;
