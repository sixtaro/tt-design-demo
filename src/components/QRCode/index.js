import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import QRCodeReact from 'qrcode.react';
import { componentVersions } from '../../utils/version-config';
import './index.less';

const QRCode = forwardRef(({
  value,
  size,
  level,
  bgColor,
  fgColor,
  includeMargin,
  renderAs,
  imageSettings,
  className,
  style,
  title,
  version,
  ...props
}, ref) => {
  const qrCodeClassName = classNames('tt-qrcode', className);

  return (
    <div
      ref={ref}
      className={qrCodeClassName}
      style={style}
      title={title}
      data-component-version={version}
      {...props}
    >
      <QRCodeReact
        value={value}
        size={size}
        level={level}
        bgColor={bgColor}
        fgColor={fgColor}
        includeMargin={includeMargin}
        renderAs={renderAs}
        imageSettings={imageSettings}
      />
    </div>
  );
});

QRCode.version = componentVersions.QRCode;

QRCode.propTypes = {
  version: PropTypes.string,
  value: PropTypes.string.isRequired,
  size: PropTypes.number,
  level: PropTypes.oneOf(['L', 'M', 'Q', 'H']),
  bgColor: PropTypes.string,
  fgColor: PropTypes.string,
  includeMargin: PropTypes.bool,
  renderAs: PropTypes.oneOf(['canvas', 'svg']),
  imageSettings: PropTypes.shape({
    src: PropTypes.string,
    x: PropTypes.number,
    y: PropTypes.number,
    height: PropTypes.number,
    width: PropTypes.number,
    excavate: PropTypes.bool,
  }),
  className: PropTypes.string,
  style: PropTypes.object,
  title: PropTypes.string,
};

QRCode.defaultProps = {
  size: 160,
  level: 'M',
  bgColor: '#FFFFFF',
  fgColor: '#1F2A44',
  includeMargin: false,
  renderAs: 'canvas',
};

export default QRCode;
