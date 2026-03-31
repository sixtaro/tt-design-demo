import React, { Children, forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { componentVersions } from '../../utils/version-config';
import './index.less';

const SplitterPanel = ({ children }) => children;

const getContainerSize = (container, layout) => {
  if (!container) {
    return 0;
  }

  return layout === 'vertical' ? container.clientHeight : container.clientWidth;
};

const parseSize = (size, containerSize, fallbackSize) => {
  if (typeof size === 'number') {
    return size;
  }

  if (typeof size === 'string') {
    if (size.endsWith('%')) {
      return containerSize * parseFloat(size) / 100;
    }

    if (size.endsWith('px')) {
      return parseFloat(size);
    }
  }

  return fallbackSize;
};

const getPanelConstraints = (panelProps, containerSize) => ({
  min: parseSize(panelProps.min, containerSize, 80),
  max: parseSize(panelProps.max, containerSize, Number.POSITIVE_INFINITY),
});

const buildInitialSizes = (panels, containerSize) => {
  if (!containerSize || panels.length === 0) {
    return [];
  }

  const explicitSizes = panels.map((panel) => parseSize(panel.props.size, containerSize, null));
  const definedTotal = explicitSizes.reduce((sum, size) => sum + (typeof size === 'number' ? size : 0), 0);
  const undefinedCount = explicitSizes.filter((size) => typeof size !== 'number').length;
  const remaining = Math.max(containerSize - definedTotal, 0);
  const fallbackSize = undefinedCount > 0 ? remaining / undefinedCount : 0;

  return panels.map((panel, index) => {
    const constraints = getPanelConstraints(panel.props, containerSize);
    const targetSize = typeof explicitSizes[index] === 'number' ? explicitSizes[index] : fallbackSize;
    return Math.min(Math.max(targetSize, constraints.min), constraints.max);
  });
};

const Splitter = forwardRef(({
  layout,
  className,
  style,
  children,
  version,
  onResize,
}, ref) => {
  const containerRef = useRef(null);
  const mergedRef = ref || containerRef;
  const dragStateRef = useRef(null);
  const panelNodesRef = useRef([]);
  const childPanels = useMemo(
    () => Children.toArray(children).filter(Boolean),
    [children]
  );
  const [panelSizes, setPanelSizes] = useState([]);

  useEffect(() => {
    const container = containerRef.current;
    const nextContainerSize = getContainerSize(container, layout);

    if (!nextContainerSize) {
      return undefined;
    }

    const nextSizes = buildInitialSizes(childPanels, nextContainerSize);
    setPanelSizes(nextSizes);

    return undefined;
  }, [childPanels, layout]);

  useEffect(() => {
    const handleMouseMove = (event) => {
      const dragState = dragStateRef.current;

      if (!dragState || !containerRef.current) {
        return;
      }

      const pointerPosition = layout === 'vertical' ? event.clientY : event.clientX;
      const delta = pointerPosition - dragState.startPointer;
      const nextSizes = [...dragState.startSizes];
      const containerSize = getContainerSize(containerRef.current, layout);
      const prevPanel = childPanels[dragState.index];
      const nextPanel = childPanels[dragState.index + 1];
      const prevConstraints = getPanelConstraints(prevPanel.props, containerSize);
      const nextConstraints = getPanelConstraints(nextPanel.props, containerSize);

      let prevSize = dragState.startSizes[dragState.index] + delta;
      let nextSize = dragState.startSizes[dragState.index + 1] - delta;

      if (prevSize < prevConstraints.min) {
        prevSize = prevConstraints.min;
        nextSize = dragState.startSizes[dragState.index] + dragState.startSizes[dragState.index + 1] - prevSize;
      }

      if (nextSize < nextConstraints.min) {
        nextSize = nextConstraints.min;
        prevSize = dragState.startSizes[dragState.index] + dragState.startSizes[dragState.index + 1] - nextSize;
      }

      if (prevSize > prevConstraints.max) {
        prevSize = prevConstraints.max;
        nextSize = dragState.startSizes[dragState.index] + dragState.startSizes[dragState.index + 1] - prevSize;
      }

      if (nextSize > nextConstraints.max) {
        nextSize = nextConstraints.max;
        prevSize = dragState.startSizes[dragState.index] + dragState.startSizes[dragState.index + 1] - nextSize;
      }

      nextSizes[dragState.index] = prevSize;
      nextSizes[dragState.index + 1] = nextSize;
      setPanelSizes(nextSizes);

      if (onResize) {
        onResize(nextSizes);
      }
    };

    const handleMouseUp = () => {
      dragStateRef.current = null;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [childPanels, layout, onResize]);

  const splitterClassName = classNames(
    'tt-splitter',
    `tt-splitter-${layout}`,
    className
  );

  const handleDragStart = (index, event) => {
    dragStateRef.current = {
      index,
      startPointer: layout === 'vertical' ? event.clientY : event.clientX,
      startSizes: [...panelSizes],
    };
    document.body.style.cursor = layout === 'vertical' ? 'row-resize' : 'col-resize';
    document.body.style.userSelect = 'none';
  };

  return (
    <div
      ref={(node) => {
        containerRef.current = node;
        if (typeof mergedRef === 'function') {
          mergedRef(node);
        } else if (mergedRef) {
          mergedRef.current = node;
        }
      }}
      className={splitterClassName}
      style={style}
      data-component-version={version}
    >
      {childPanels.map((panel, index) => {
        const panelClassName = classNames('tt-splitter-panel', panel.props.className);
        const panelStyle = {
          ...(panel.props.style || {}),
          flexBasis: panelSizes[index] ? `${panelSizes[index]}px` : undefined,
          flexGrow: panelSizes[index] ? 0 : 1,
          flexShrink: 0,
        };

        return (
          <React.Fragment key={panel.key || `panel-${index}`}>
            <div
              ref={(node) => {
                panelNodesRef.current[index] = node;
              }}
              className={panelClassName}
              style={panelStyle}
            >
              {panel.props.children}
            </div>
            {index < childPanels.length - 1 ? (
              <div
                className="tt-splitter-bar"
                onMouseDown={(event) => handleDragStart(index, event)}
                role="separator"
                aria-orientation={layout}
              >
                <span className="tt-splitter-bar-handle" />
              </div>
            ) : null}
          </React.Fragment>
        );
      })}
    </div>
  );
});

Splitter.Panel = SplitterPanel;
Splitter.version = componentVersions.Splitter;

Splitter.propTypes = {
  version: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  layout: PropTypes.oneOf(['horizontal', 'vertical']),
  children: PropTypes.node,
  onResize: PropTypes.func,
};

Splitter.defaultProps = {
  layout: 'horizontal',
};

SplitterPanel.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  min: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  max: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default Splitter;
