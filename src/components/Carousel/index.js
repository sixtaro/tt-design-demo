import React from 'react';
import PropTypes from 'prop-types';
import { Carousel as AntCarousel } from 'antd';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';
import './index.less';

const Carousel = React.forwardRef(({ version, className, ...props }, ref) => {
  const carouselClassName = classNames('tt-carousel', className);

  return (
    <AntCarousel
      ref={ref}
      className={carouselClassName}
      {...props}
      data-component-version={version}
    />
  );
});

Carousel.version = componentVersions.Carousel;

Carousel.displayName = 'Carousel';

Carousel.propTypes = {
  version: PropTypes.string,
  className: PropTypes.string,
  autoplay: PropTypes.bool,
  autoplaySpeed: PropTypes.number,
  dots: PropTypes.bool,
  dotPosition: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  easing: PropTypes.string,
  effect: PropTypes.oneOf(['scrollx', 'fade']),
  afterChange: PropTypes.func,
  beforeChange: PropTypes.func,
};

export default Carousel;
