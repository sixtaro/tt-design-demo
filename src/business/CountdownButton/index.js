import React, { useState, useEffect, useImperativeHandle, useRef } from 'react';
import { Button } from 'antd';
import { Storage, Request } from '@/utils';

const CountdownButton = (props, ref) => {
  const interval = props.interval || 60;
  const countdownKey = props.countdownkey || 'smsTime';
  const buttonText = props.buttontext || '发送验证码';
  // const preventDefault = false;
  const [smsTime, setSmsTime] = useState(Storage.get(countdownKey) || 0);
  const [smscd, setSmscd] = useState(interval - parseInt((Date.now() - smsTime) / 1000, 10));
  const buttonRef = useRef();

  const startCountdown = () => {
    const _smsTime = Date.now();
    setSmscd(interval);
    Storage.set(countdownKey, _smsTime);
    setSmsTime(_smsTime);
  };

  const sendcode = async para => {
    setSmsTime(true);
    let result = await Request(props.api, para);
    if (result.success) {
      startCountdown();
      props.onSuccess?.(result);
    } else {
      setSmsTime(false);
      props.onError?.(result);
    }
    return result;
  };

  useEffect(() => {
    if (typeof smsTime === 'number') {
      let _smscd = interval - 1 - parseInt((Date.now() - smsTime) / 1000, 10);
      if (typeof _smscd === 'number' && _smscd > 0) {
        setTimeout(() => setSmscd(_smscd), 1000);
      } else if (smscd !== 0) {
        setTimeout(() => setSmscd(0), 1000);
      }
    }
  }, [smsTime, smscd, interval]);

  useImperativeHandle(ref, () => ({
    sendcode,
    buttonRef,
    getCountdown: () => {
      return smscd;
    },
    click: () => {
      buttonRef.current?.click();
    },
    // 不触发接口的情况下强行开始倒计时
    startCountdown,
  }));

  return (
    <Button
      ref={buttonRef}
      {...props}
      onClick={() => {
        props.onSend?.(sendcode);
      }}
      type={props.type || 'default'}
      loading={smsTime === true}
      disabled={smscd > 0}
    >
      {smsTime === true ? '短信发送中' : smscd > 0 ? smscd + 's' : buttonText}
    </Button>
  );
};

export default React.forwardRef(CountdownButton);
