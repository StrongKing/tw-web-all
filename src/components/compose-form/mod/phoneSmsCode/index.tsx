import { ButtonProps, Input } from 'antd';
import React from 'react';
import Countdown, { CountdownProps } from '@/components/button/countdown';
import './index.less';

export interface PhoneSmsCodeProps {
  className?: string;
  value: string;
  onChange: (val: any) => void;
  maxLenght?: number;
  request?: CountdownProps['request'];
  btnText?: string;
  getCountdownText?: (val: number) => string;
  defaultCountdown?: number;
  maxCountdown?: number;
  btnProps?: ButtonProps;
}

const PhoneSmsCode = ({
  className,
  value,
  onChange,
  maxLenght = 6,
  request = { url: `${(window as any).urlCollect.url.auth}/oauth/sms/bizSend` },
  btnProps = {},
  ...countdownProps
}: PhoneSmsCodeProps) => {
  const { style, ...otherBtnprops } = btnProps;
  return (
    <div className={`ss-phone-smscode ${className}`}>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLenght}
      />
      <Countdown
        request={request}
        btnProps={{
          style: { width: '140px', flex: '0 0 140px', ...style },
          ...otherBtnprops,
        }}
        {...countdownProps}
      />
    </div>
  );
};

export default PhoneSmsCode;
