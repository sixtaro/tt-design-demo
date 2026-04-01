import React from 'react';
import { Carousel as AntCarousel } from 'antd';
import { LeftCircleFilled, RightCircleFilled } from '@ant-design/icons';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { componentVersions } from '../../utils/version-config';
import './index.less';

const ArrowLeft = props => {
  const { className, onClick, currentSlide } = props;
  const disabled = currentSlide === 0;

  return (
    <div
      className={classNames('tt-carousel-arrow tt-carousel-arrow-left', className, {
        'tt-carousel-arrow-disabled': disabled,
      })}
      onClick={onClick}
    >
      <LeftCircleFilled />
    </div>
  );
};

const ArrowRight = props => {
  const { className, onClick, currentSlide, slideCount, slidesToShow } = props;
  const disabled = currentSlide === slideCount - slidesToShow;

  return (
    <div
      className={classNames('tt-carousel-arrow tt-carousel-arrow-right', className, {
        'tt-carousel-arrow-disabled': disabled,
      })}
      onClick={onClick}
    >
      <RightCircleFilled />
    </div>
  );
};

const CarouselArrow = React.forwardRef((props, ref) => {
  const { slidesToShow, children, className, carouselProps, version } = props;
  const isOver = children.length > slidesToShow;

  return (
    <div className={classNames('tt-carousel-arrow-wrapper', className)} data-component-version={version}>
      <AntCarousel
        ref={ref}
        className="tt-carousel-arrow-content"
        infinite={false}
        slidesToShow={slidesToShow}
        dots={false}
        arrows
        prevArrow={isOver ? <ArrowLeft slidesToShow={slidesToShow} /> : ''}
        nextArrow={isOver ? <ArrowRight slidesToShow={slidesToShow} /> : ''}
        style={{ padding: isOver ? '0 32px' : '0' }}
        {...carouselProps}
      >
        {children}
      </AntCarousel>
    </div>
  );
});

CarouselArrow.propTypes = {
  version: PropTypes.string,
  className: PropTypes.string,
  slidesToShow: PropTypes.number,
  children: PropTypes.node,
  carouselProps: PropTypes.object,
};

CarouselArrow.defaultProps = {
  version: componentVersions.CarouselArrow,
  slidesToShow: 1,
  carouselProps: {},
};

CarouselArrow.version = componentVersions.CarouselArrow;

export default CarouselArrow;
