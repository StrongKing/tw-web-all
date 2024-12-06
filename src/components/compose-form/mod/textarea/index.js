import React from 'react';
import { Input } from 'antd';
import './index.less';

const { TextArea } = Input;

export default ({
  value,
  onChange,
  maxLength = 200,
  form,
  onBlur,
  type = 'normal',
  autoSize,
  ...others
}) => {
  return (
    <>
      <TextArea
        className={type === 'normal' ? 'ssp-textarea pre-wrap' : ''}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/^ +| +$/g, ''))}
        onBlur={() => onBlur && onBlur({ value, form })}
        maxLength={maxLength}
        bordered={type !== 'normal'}
        placeholder="请输入"
        showCount={type === 'normal'}
        autoSize={
          type !== 'normal' || autoSize ? autoSize : { minRows: 4, maxRows: 4 }
        }
        {...others}
      />
    </>
  );
};
