import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { CheckOutlined } from '@ant-design/icons';

const CardItem = ({ record, selected, onClick, type, position, disabled, children, className, style, ...props }) => {
  const cardClassName = classNames(
    'tt-card-select',
    `tt-card-select-${type}`,
    `tt-card-select-${position}`,
    {
      'tt-card-select-selected': selected,
      'tt-card-select-disabled': disabled,
    },
    className
  );

  // 渲染 radio 指示器
  const renderRadioIndicator = () => <div className="tt-card-select-radio-indicator"></div>;

  return (
    <div className={cardClassName} onClick={onClick} style={style} {...props}>
      {type === 'corner' && selected && (
        <div className={`tt-card-select-corner-mark ${position === 'left' ? 'tt-card-select-corner-mark-left' : ''}`}>
          <CheckOutlined />
        </div>
      )}

      {type === 'radio' && position === 'left' && renderRadioIndicator()}

      <div className="tt-card-select-content">{children}</div>

      {type === 'radio' && position === 'right' && renderRadioIndicator()}
    </div>
  );
};

CardItem.propTypes = {
  record: PropTypes.object,
  selected: PropTypes.bool,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['corner', 'border', 'radio']),
  position: PropTypes.oneOf(['left', 'right']),
  disabled: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
};

CardItem.defaultProps = {
  type: 'corner',
  position: 'left',
  disabled: false,
};

export default CardItem;
