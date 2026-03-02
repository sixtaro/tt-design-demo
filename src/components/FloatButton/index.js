import React from 'react';
import { componentVersions } from '../../utils/version-config';
import classNames from 'classnames';

const FloatButton = ({
    type = 'primary',
    shape = 'circle',
    size = 'default',
    icon,
    onClick,
    style,
    position = 'bottomRight',
    version,
    className,
    absolute = false,
    ...props
}) => {
    const floatButtonClassName = classNames(
        'tt-float-button',
        `tt-float-button-${type}`,
        `tt-float-button-${shape}`,
        `tt-float-button-${size}`,
        className
    );

    const positionStyles = {
        bottomRight: { right: 24, bottom: 24 },
        bottomLeft: { left: 24, bottom: 24 },
        topRight: { right: 24, top: 24 },
        topLeft: { left: 24, top: 24 },
    };

    const colors = {
        primary: '#1890ff',
        default: '#fff',
        danger: '#ff4d4f',
    };

    const sizes = {
        small: 40,
        default: 56,
        large: 72,
    };

    const baseStyle = {
        position: absolute ? 'absolute' : 'fixed',
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: shape === 'circle' ? '50%' : '8px',
        backgroundColor: colors[type],
        color: type === 'default' ? '#262626' : '#fff',
        border: type === 'default' ? '1px solid #d9d9d9' : 'none',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        width: sizes[size],
        height: sizes[size],
        ...positionStyles[position],
        ...style,
    };

    return (
        <div
            className={floatButtonClassName}
            style={baseStyle}
            onClick={onClick}
            data-component-version={version}
            {...props}
        >
            {icon || '+'}
        </div>
    );
};

FloatButton.version = componentVersions.FloatButton;

export default FloatButton;
