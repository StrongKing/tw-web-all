import { Button, ButtonProps, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
// eslint-disable-next-line import/no-named-default
import { default as requestApi } from '@/common/request2';

export interface CountdownProps {
  request: {
    url: string;
    params?: any;
    method?: string;
    [key: string]: any;
  };
  btnText?: string;
  getCountdownText?: (val: number) => string;
  defaultCountdown?: number;
  maxCountdown?: number;
  btnProps?: ButtonProps;
  requestSuccessMsg?: string;
  /** 是否直接触发一次请求 */
  triggerRequest?: boolean;
}
const Countdown = ({
  request: { url, ...requestOptions },
  btnText = '获取验证码',
  getCountdownText = (val: number) => `重新获取（${val}s）`,
  maxCountdown = 60,
  defaultCountdown = 0,
  btnProps = {},
  requestSuccessMsg,
  triggerRequest,
}: CountdownProps) => {
  // eslint-disable-next-line no-undef
  const sto = useRef<NodeJS.Timeout | null>(null);
  const [countdown, setCountdown] = useState(defaultCountdown);
  const countdownRef = useRef(defaultCountdown);
  const onClick = () => {
    if (countdownRef.current > 0) return;
    requestApi(url, {
      ...requestOptions,
    }).then(() => {
      if (requestSuccessMsg) {
        message.success(requestSuccessMsg);
      }
      countdownRef.current = maxCountdown;
      setCountdown(countdownRef.current);
      loop();
    });
  };
  const loop = () => {
    sto.current = setTimeout(() => {
      // eslint-disable-next-line no-plusplus
      countdownRef.current--;
      setCountdown(countdownRef.current);
      if (countdownRef.current > 0) {
        loop();
      }
    }, 1000);
  };
  useEffect(() => {
    if (triggerRequest) {
      onClick();
    }
    return () => {
      if (sto.current) {
        clearTimeout(sto.current);
      }
    };
  }, []);
  return (
    <Button
      type="primary"
      {...btnProps}
      onClick={onClick}
      disabled={countdown > 0}
    >
      {countdown > 0 ? getCountdownText(countdown) : btnText}
    </Button>
  );
};

export default Countdown;
