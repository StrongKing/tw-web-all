import React from 'react';
import { InputNumber } from 'antd';

export default ({ value, index, onChange, ...others }: any) => {
  return (
    <InputNumber
      value={value}
      placeholder="请输入"
      onChange={(e) => onChange(e, index)}
      {...others}
    />
  );
};
