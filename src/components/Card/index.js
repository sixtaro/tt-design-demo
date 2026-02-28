import React from 'react';
import { Card as AntCard } from 'antd';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';

const { Meta } = AntCard;

const Card = ({ title, extra, hoverable, loading, version, className, ...props }) => {
  const cardClassName = classNames(
    'tt-card',
    className
  );

  return (
    <AntCard
      title={title}
      extra={extra}
      hoverable={hoverable}
      loading={loading}
      className={cardClassName}
      {...props}
      data-component-version={version}
    />
  );
};

Card.Meta = Meta;
Card.version = componentVersions.Card;

export default Card;
