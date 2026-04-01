import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '../Button';
import { componentVersions } from '../../utils/version-config';
import './index.less';

const DEFAULT_GAP = 8;
const DEFAULT_RADIUS = 8;
const VIEWPORT_PADDING = 12;

const resolveTarget = (target) => {
  if (!target) {
    return null;
  }

  if (typeof target === 'function') {
    return target() || null;
  }

  if (typeof target === 'string') {
    return document.querySelector(target);
  }

  return target;
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const getPlacementPosition = ({ placement, targetRect, popupRect, viewportWidth, viewportHeight }) => {
  if (!targetRect) {
    return {
      left: clamp((viewportWidth - popupRect.width) / 2, VIEWPORT_PADDING, viewportWidth - popupRect.width - VIEWPORT_PADDING),
      top: clamp((viewportHeight - popupRect.height) / 2, VIEWPORT_PADDING, viewportHeight - popupRect.height - VIEWPORT_PADDING),
    };
  }

  const placements = {
    top: {
      left: targetRect.left + (targetRect.width - popupRect.width) / 2,
      top: targetRect.top - popupRect.height - 12,
    },
    topLeft: {
      left: targetRect.left,
      top: targetRect.top - popupRect.height - 12,
    },
    topRight: {
      left: targetRect.right - popupRect.width,
      top: targetRect.top - popupRect.height - 12,
    },
    bottom: {
      left: targetRect.left + (targetRect.width - popupRect.width) / 2,
      top: targetRect.bottom + 12,
    },
    bottomLeft: {
      left: targetRect.left,
      top: targetRect.bottom + 12,
    },
    bottomRight: {
      left: targetRect.right - popupRect.width,
      top: targetRect.bottom + 12,
    },
    left: {
      left: targetRect.left - popupRect.width - 12,
      top: targetRect.top + (targetRect.height - popupRect.height) / 2,
    },
    right: {
      left: targetRect.right + 12,
      top: targetRect.top + (targetRect.height - popupRect.height) / 2,
    },
  };

  const nextPlacement = placements[placement] || placements.bottom;

  return {
    left: clamp(nextPlacement.left, VIEWPORT_PADDING, viewportWidth - popupRect.width - VIEWPORT_PADDING),
    top: clamp(nextPlacement.top, VIEWPORT_PADDING, viewportHeight - popupRect.height - VIEWPORT_PADDING),
  };
};

const Tour = forwardRef(({
  open,
  defaultOpen,
  current,
  defaultCurrent,
  steps,
  placement,
  mask,
  gap,
  zIndex,
  className,
  style,
  onClose,
  onFinish,
  onChange,
  getPopupContainer,
  scrollIntoViewOptions,
  version,
}, ref) => {
  const popupRef = useRef(null);
  const containerRef = useRef(null);
  const [popupStyle, setPopupStyle] = useState({ left: 0, top: 0 });
  const [targetRect, setTargetRect] = useState(null);
  const isOpenControlled = typeof open === 'boolean';
  const isCurrentControlled = typeof current === 'number';
  const [innerOpen, setInnerOpen] = useState(Boolean(defaultOpen));
  const [innerCurrent, setInnerCurrent] = useState(defaultCurrent || 0);
  const mergedOpen = isOpenControlled ? open : innerOpen;
  const mergedCurrent = isCurrentControlled ? current : innerCurrent;
  const mergedSteps = Array.isArray(steps) ? steps : [];
  const currentStep = mergedSteps[mergedCurrent] || null;
  const container = getPopupContainer ? getPopupContainer() : document.body;
  const mergedGap = useMemo(() => {
    if (typeof gap === 'number') {
      return { offset: gap, radius: DEFAULT_RADIUS };
    }

    return {
      offset: (gap && gap.offset) || DEFAULT_GAP,
      radius: (gap && gap.radius) || DEFAULT_RADIUS,
    };
  }, [gap]);

  useImperativeHandle(ref, () => ({
    close: () => {
      if (!isOpenControlled) {
        setInnerOpen(false);
      }
      if (onClose) {
        onClose();
      }
    },
  }));

  useEffect(() => {
    if (!mergedOpen || !currentStep) {
      setTargetRect(null);
      return undefined;
    }

    const updatePosition = () => {
      const nextTarget = resolveTarget(currentStep.target);
      const rect = nextTarget ? nextTarget.getBoundingClientRect() : null;

      if (nextTarget && scrollIntoViewOptions && typeof nextTarget.scrollIntoView === 'function') {
        nextTarget.scrollIntoView(
          scrollIntoViewOptions === true ? { block: 'nearest', inline: 'nearest' } : scrollIntoViewOptions
        );
      }

      setTargetRect(rect);

      if (popupRef.current) {
        const popupRect = popupRef.current.getBoundingClientRect();
        const nextPopupStyle = getPlacementPosition({
          placement: currentStep.placement || placement,
          targetRect: rect,
          popupRect,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
        });
        setPopupStyle(nextPopupStyle);
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [currentStep, mergedOpen, placement, scrollIntoViewOptions]);

  const setCurrentStep = (nextCurrent) => {
    if (!isCurrentControlled) {
      setInnerCurrent(nextCurrent);
    }
    if (onChange) {
      onChange(nextCurrent);
    }
  };

  const closeTour = () => {
    if (!isOpenControlled) {
      setInnerOpen(false);
    }
    if (onClose) {
      onClose();
    }
  };

  const goNext = () => {
    if (mergedCurrent >= mergedSteps.length - 1) {
      closeTour();
      if (onFinish) {
        onFinish();
      }
      return;
    }

    setCurrentStep(mergedCurrent + 1);
  };

  const goPrev = () => {
    if (mergedCurrent <= 0) {
      return;
    }

    setCurrentStep(mergedCurrent - 1);
  };

  if (!mergedOpen || !currentStep || !container) {
    return null;
  }

  const spotlightStyle = targetRect ? {
    left: `${targetRect.left - mergedGap.offset}px`,
    top: `${targetRect.top - mergedGap.offset}px`,
    width: `${targetRect.width + mergedGap.offset * 2}px`,
    height: `${targetRect.height + mergedGap.offset * 2}px`,
    borderRadius: `${mergedGap.radius}px`,
  } : null;

  const tourClassName = classNames('tt-tour', className);
  const isLastStep = mergedCurrent === mergedSteps.length - 1;

  const node = (
    <div
      ref={containerRef}
      className={tourClassName}
      style={{ zIndex, ...style }}
      data-component-version={version}
    >
      {mask ? <div className="tt-tour-mask" /> : null}
      {mask && spotlightStyle ? <div className="tt-tour-target-highlight" style={spotlightStyle} /> : null}
      <div ref={popupRef} className="tt-tour-popup" style={popupStyle}>
        <button type="button" className="tt-tour-close" onClick={closeTour} aria-label="关闭引导">
          ×
        </button>
        {currentStep.cover ? <div className="tt-tour-cover">{currentStep.cover}</div> : null}
        {currentStep.title ? <div className="tt-tour-title">{currentStep.title}</div> : null}
        {currentStep.description ? <div className="tt-tour-description">{currentStep.description}</div> : null}
        <div className="tt-tour-footer">
          <div className="tt-tour-indicators">
            {mergedSteps.map((step, index) => (
              <span
                key={step.key || index}
                className={classNames('tt-tour-indicator', {
                  'tt-tour-indicator-active': index === mergedCurrent,
                })}
              />
            ))}
          </div>
          <div className="tt-tour-actions">
            {mergedCurrent > 0 ? (
              <Button version={Button.version} onClick={goPrev}>
                上一步
              </Button>
            ) : null}
            <Button type="primary" version={Button.version} onClick={goNext}>
              {isLastStep ? '完成' : '下一步'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(node, container);
});

Tour.version = componentVersions.Tour;

Tour.propTypes = {
  version: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  open: PropTypes.bool,
  defaultOpen: PropTypes.bool,
  current: PropTypes.number,
  defaultCurrent: PropTypes.number,
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      title: PropTypes.node,
      description: PropTypes.node,
      cover: PropTypes.node,
      target: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.string,
        PropTypes.instanceOf(typeof Element === 'undefined' ? function ElementMock() {} : Element),
      ]),
      placement: PropTypes.oneOf([
        'top',
        'topLeft',
        'topRight',
        'bottom',
        'bottomLeft',
        'bottomRight',
        'left',
        'right',
      ]),
    })
  ),
  placement: PropTypes.oneOf([
    'top',
    'topLeft',
    'topRight',
    'bottom',
    'bottomLeft',
    'bottomRight',
    'left',
    'right',
  ]),
  mask: PropTypes.bool,
  gap: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({
      offset: PropTypes.number,
      radius: PropTypes.number,
    }),
  ]),
  zIndex: PropTypes.number,
  onClose: PropTypes.func,
  onFinish: PropTypes.func,
  onChange: PropTypes.func,
  getPopupContainer: PropTypes.func,
  scrollIntoViewOptions: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]),
};

Tour.defaultProps = {
  defaultOpen: false,
  defaultCurrent: 0,
  steps: [],
  placement: 'bottom',
  mask: true,
  gap: DEFAULT_GAP,
  zIndex: 1060,
  scrollIntoViewOptions: true,
};

export default Tour;
