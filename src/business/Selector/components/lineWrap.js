/* eslint-disable no-unused-vars */
/**
 * td 溢出隐藏 组件
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';

export default class LineWrap extends PureComponent {
    tooltip = React.createRef();
    static propTypes = {
        title: PropTypes.string,
    };
    state = {
        placement: 'top'
    }
    render() {
        let { children, title, enabledHtml, split, noEllipsis, overlayClassName, tooltipTitleFormatter, renderParams, maxLength } = this.props;
        enabledHtml = typeof children === 'string' && enabledHtml;
        if (enabledHtml) {
            const oDiv = document.createElement('div');
            oDiv.innerHTML = children;
            title = oDiv.innerText;
        }

        let tooltipTitle;
        if (split && typeof children === 'string') {
            const tipArr = children.split(split);
            const tooltipDiv = <div>{tipArr && tipArr.map(item => <div key={item}>{item}</div>)}</div>;
            tooltipTitle = tooltipDiv;
        } else if (typeof tooltipTitleFormatter === 'function') {
            tooltipTitle = tooltipTitleFormatter({ ...renderParams }, { children, title });
        }
        const calcTitle = tooltipTitle || title || children;
        return (
            <Tooltip
                ref={this.tooltip}
                title={calcTitle}
                mouseEnterDelay={1}
                overlayClassName={overlayClassName || 'selector-tooltip-overlay'}
                autoAdjustOverflow
                placement={this.state.placement}
                onOpenChange={(open) => {
                    let placement = 'top';
                    const x = this.props.event?.mouse?.clientX;
                    const w = Math.min(calcTitle.length * 7 + 16, 380);
                    if (x < w) {
                        placement = 'topLeft';
                    } else if (document.body.offsetWidth - x < w) {
                        placement = 'topRight';
                    }
                    open && this.setState({ placement });
                }}
            >
                {
                    noEllipsis ? children :
                        enabledHtml ? (
                            <span className="lineEllipsis" dangerouslySetInnerHTML={{ __html: children }}></span>
                        ) : (
                            typeof maxLength === 'number' ? <span>{`${children}`.length > maxLength ? `${`${children}`.slice(0, maxLength)}...` : children}</span> : <span className="lineEllipsis">{children}</span>
                        )
                }
            </Tooltip>
        );
    }
}
