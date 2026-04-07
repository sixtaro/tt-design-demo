import React, { useImperativeHandle, useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Request } from '@/utils';
import { ReloadOutlined, CloseOutlined, LoadingOutlined, DoubleRightOutlined } from '@ant-design/icons';
import { componentVersions } from '@/utils/version-config';
import classNames from 'classnames';
import './index.less';

const statusEnum = {
  LOADDING: 'loadding',
  SUCCESS: 'success',
  FAIL: 'fail',
  CHECKING: 'checking',
  NORMAL: 'normal',
  TRYING: 'trying',
  ERROR: 'error',
  MOVING: 'moving',
};

const VerificationCode = React.forwardRef((props, ref) => {
  const { defaultShowPic, onCancel, handleManualRefresh, type, api, checkApi, onChange, onSuccess, className, version, ...restProps } = props;

  const [position, setPosition] = useState({
    offsetX: 0,
  });
  const refBox = useRef();
  const refBg = useRef();
  const refIndex = useRef();
  const stamp = useRef(0);
  const [status, setStatus] = useState(statusEnum.LOADDING);
  const [captcha, setCaptcha] = useState({});
  const [picLoaded, setPicLoaded] = useState(true);
  const changedValue = useCallback(
    (value, data) => {
      onChange && onChange(value, data);
      onSuccess && onSuccess(value, data);
    },
    [onChange, onSuccess]
  );

  const load = useCallback(async () => {
    let _stamp = Math.random();
    stamp.current = _stamp;
    setStatus(statusEnum.LOADDING);
    const result = await Request(api);
    // 防止初始化过程中多次调用时的接口响应速度不同导致的返回顺序混乱问题
    if (_stamp !== stamp.current) {
      return;
    }
    if (result.success) {
      setStatus(statusEnum.NORMAL);
      setCaptcha(result.data);
      refIndex.current && (refIndex.current.captcha = result.data);
      if (type === 'rotate') {
        refBg.current.style.transform = `rotate(0deg)`;
      }
    } else {
      setStatus(statusEnum.ERROR);
    }
  }, [api, type]);

  // 刷新验证码
  const refresh = useCallback(async () => {
    if (status === statusEnum.LOADDING) {
      return;
    }
    load();
  }, [load, status]);

  // 暴露刷新方法
  useImperativeHandle(ref, () => ({
    refresh: () => {
      refresh();
    },
  }));

  useEffect(() => {
    load();
  }, [load]);

  // 鼠标左键按下事件
  const onMouseDown = e => {
    e.stopPropagation();
    e.preventDefault();
    e.target.focus();
    let clientX;
    if (e.type === 'touchstart') {
      clientX = e.touches?.[0]?.clientX;
    }
    if (e.button === 0) {
      clientX = e.clientX;
    }
    if (clientX) {
      const currentPosition = {
        ...position,
        downX: clientX,
      };
      setPosition(currentPosition);
      refIndex.current.position = currentPosition;
      setStatus(statusEnum.TRYING);
    }
    return false;
  };

  useEffect(() => {
    const onMouseMove = e => {
      e.stopPropagation();
      e.preventDefault();
      if (refIndex.current?.position?.downX) {
        const clientX = e.clientX ?? e.touches?.[0]?.clientX;
        let offsetX = Math.min(Math.max(clientX - refIndex.current?.position.downX, 0), refBox.current.offsetWidth - 45);
        if (window.screenScale) {
          offsetX = offsetX / window.screenScale;
        }
        const currentPosition = {
          ...refIndex.current.position,
          moveX: clientX,
          offsetX,
        };
        setPosition(currentPosition);
        refIndex.current.position = currentPosition;
        refIndex.current.style.left = offsetX + 'px';
        if (type === 'rotate') {
          refBg.current.style.transform = `rotate(-${(offsetX / (refBox.current.offsetWidth - 45)) * 720}deg)`;
        }
        setStatus(statusEnum.MOVING);
      }
      return false;
    };
    const onMouseUp = async () => {
      if (!refIndex.current?.position?.downX) {
        return;
      }
      delete refIndex.current.position.downX;
      let params = {};
      if (type === 'rotate') {
        params = {
          angle: Math.round(((refIndex.current.position.offsetX / (refBox.current.offsetWidth - 45)) * 720) % 360),
        };
      } else {
        const maskX = ~~((refIndex.current.position.offsetX * refBg.current.naturalWidth) / refBg.current.offsetWidth);
        params = {
          maskX,
        };
      }
      const captchaSessionId = refIndex.current.captcha.captchaSessionId;
      setStatus(statusEnum.CHECKING);
      const result = await Request(checkApi, { captchaCode: refIndex.current.captcha.captchaCode, captchaSessionId, ...params });
      setStatus(statusEnum.NORMAL);
      setCaptcha(result.data);
      if (result.success) {
        setStatus(statusEnum.SUCCESS);
        changedValue(refIndex.current.captcha.captchaCode, result.data);
      } else {
        setStatus(statusEnum.FAIL);
        setTimeout(() => {
          refresh();
        }, 1000);
      }
      setPosition({
        moveX: undefined,
        downX: undefined,
        offsetX: 0,
      });
    };
    document.addEventListener('mousemove', onMouseMove, { passive: false });
    document.addEventListener('touchmove', onMouseMove, { passive: false });
    document.addEventListener('mouseup', onMouseUp, { passive: false });
    document.addEventListener('touchend', onMouseUp, { passive: false });
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('touchmove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('touchend', onMouseUp);
    };
  }, [checkApi, changedValue, refresh, type, captcha]);

  useEffect(() => {
    if (!captcha.imageBase64) {
      setPicLoaded(false);
    } else {
      setPicLoaded(true);
    }
  }, [captcha.imageBase64]);

  const outerClassName = classNames('tt-verification-code-outer', className);

  const codeClassName = classNames('tt-verification-code', status, defaultShowPic ? 'tt-verification-code-defaultShowPic' : '');

  return (
    <div className={outerClassName} {...restProps} data-component-version={version}>
      {defaultShowPic && (
        <>
          <div className="tt-verification-code-title">请完成安全验证</div>
        </>
      )}
      <div className={codeClassName} ref={refBox}>
        {defaultShowPic && <div className="tt-verification-code-bg" style={{ width: position.offsetX + 'px' }}></div>}
        <div className="tt-verification-code-pic">
          <div
            style={!picLoaded || status === statusEnum.LOADDING || status === statusEnum.CHECKING ? {} : { display: 'none' }}
            className="tt-verification-code-load-box"
          >
            <LoadingOutlined />
            <span></span>
          </div>
          <div
            className="tt-verification-code-image-outer"
            style={!picLoaded || status === statusEnum.LOADDING || status === statusEnum.CHECKING ? { display: 'none' } : {}}
          >
            <img className="tt-verification-code-pic-bg" ref={refBg} style={type !== 'rotate' ? {} : { width: '180px' }} src={captcha.imageBase64} alt="" />
            <img
              className="tt-verification-code-pic-index"
              ref={refIndex}
              style={type !== 'rotate' ? { left: position.offsetX + 'px' } : {}}
              src={captcha.maskBase64}
              alt=""
            />
          </div>
        </div>
        <div className="tt-verification-code-input">
          <div className="tt-verification-code-text" onClick={refresh}></div>
          <div className="tt-verification-code-status-bg" style={{ width: position.offsetX + 20 + 'px' }}></div>
          <div className="tt-verification-code-btn" style={{ left: position.offsetX + 'px' }} onMouseDown={onMouseDown} onTouchStart={onMouseDown} tabIndex="1">
            <DoubleRightOutlined />
          </div>
        </div>
      </div>
      {defaultShowPic && (
        <div className="tt-verification-code-buttons">
          <div
            title="点击刷新拼图"
            onClick={() => {
              handleManualRefresh ? handleManualRefresh() : refresh();
            }}
          >
            <ReloadOutlined />
          </div>
          <div
            title="关闭"
            onClick={() => {
              onCancel && onCancel();
            }}
          >
            <CloseOutlined />
          </div>
        </div>
      )}
    </div>
  );
});

VerificationCode.propTypes = {
  defaultShowPic: PropTypes.bool,
  onCancel: PropTypes.func,
  handleManualRefresh: PropTypes.func,
  type: PropTypes.oneOf(['slide', 'rotate']),
  api: PropTypes.string.isRequired,
  checkApi: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  onSuccess: PropTypes.func,
  className: PropTypes.string,
  version: PropTypes.string,
};

VerificationCode.defaultProps = {
  defaultShowPic: false,
  type: 'slide',
};

VerificationCode.version = componentVersions.VerificationCode;

export default VerificationCode;
