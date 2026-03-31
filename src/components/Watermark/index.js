import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { componentVersions } from '../../utils/version-config';
import './index.less';

const DEFAULT_FONT = {
  color: 'rgba(31, 42, 68, 0.12)',
  fontSize: 16,
  fontWeight: 'normal',
  fontFamily: 'sans-serif',
};

const normalizeContent = (content) => {
  if (Array.isArray(content)) {
    return content;
  }

  if (content === undefined || content === null) {
    return [];
  }

  return [String(content)];
};

const createWatermarkSvg = ({
  lines,
  width,
  height,
  rotate,
  font,
}) => {
  const fontSize = font.fontSize || DEFAULT_FONT.fontSize;
  const lineHeight = fontSize + 8;
  const startY = Math.max((height - lineHeight * Math.max(lines.length - 1, 0)) / 2, fontSize);
  const textNodes = lines.map((line, index) => (
    `<text x="50%" y="${startY + index * lineHeight}" text-anchor="middle">${line}</text>`
  )).join('');

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <g transform="rotate(${rotate} ${width / 2} ${height / 2})"
         fill="${font.color}"
         font-size="${fontSize}"
         font-family="${font.fontFamily}"
         font-weight="${font.fontWeight}">
        ${textNodes}
      </g>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const Watermark = ({
  content,
  width,
  height,
  rotate,
  gap,
  offset,
  zIndex,
  font,
  className,
  style,
  children,
  version,
  ...props
}) => {
  const mergedFont = {
    ...DEFAULT_FONT,
    ...(font || {}),
  };
  const lines = useMemo(() => normalizeContent(content), [content]);
  const [backgroundImage, setBackgroundImage] = useState('');
  const mergedOffset = offset || [0, 0];
  const mergedGap = gap || [100, 100];

  useEffect(() => {
    if (lines.length === 0) {
      setBackgroundImage('');
      return;
    }

    setBackgroundImage(createWatermarkSvg({
      lines,
      width,
      height,
      rotate,
      font: mergedFont,
    }));
  }, [lines, width, height, rotate, mergedFont]);

  const watermarkClassName = classNames('tt-watermark', className);

  return (
    <div
      className={watermarkClassName}
      style={style}
      data-component-version={version}
      {...props}
    >
      {children}
      {backgroundImage ? (
        <div
          className="tt-watermark-overlay"
          style={{
            backgroundImage: `url("${backgroundImage}")`,
            backgroundSize: `${width + mergedGap[0]}px`,
            backgroundPosition: `${mergedOffset[0]}px ${mergedOffset[1]}px`,
            zIndex,
          }}
        />
      ) : null}
    </div>
  );
};

Watermark.version = componentVersions.Watermark;

Watermark.propTypes = {
  version: PropTypes.string,
  content: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  width: PropTypes.number,
  height: PropTypes.number,
  rotate: PropTypes.number,
  gap: PropTypes.arrayOf(PropTypes.number),
  offset: PropTypes.arrayOf(PropTypes.number),
  zIndex: PropTypes.number,
  font: PropTypes.shape({
    color: PropTypes.string,
    fontSize: PropTypes.number,
    fontWeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    fontFamily: PropTypes.string,
  }),
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node,
};

Watermark.defaultProps = {
  content: 'TT Design',
  width: 120,
  height: 64,
  rotate: -22,
  gap: [100, 100],
  offset: [0, 0],
  zIndex: 9,
  font: DEFAULT_FONT,
};

export default Watermark;
