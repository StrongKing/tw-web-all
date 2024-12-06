import React from 'react';
import { Input } from 'antd';
import './index.less';

export default ({
  value,
  onChange,
  maxLength,
  noShowSuffix,
  emitter,
  onBlur,
  form,
  ...others
}: any) => {
  return (
    <>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value.trim())}
        onBlur={() => onBlur && onBlur({ value, form })}
        maxLength={maxLength}
        placeholder="请输入"
        {...others}
        suffix={
          maxLength && !noShowSuffix ? `${value?.length || 0}/${maxLength}` : ''
        }
        className={maxLength ? 'input-withMaxLength' : ''}
      />
    </>
  );
};
