import React, { useEffect, useState } from 'react';
import { Switch } from 'antd';
import './index.less';

export default ({
  value,
  index,
  onChange,
  label,
  tip,
  marginTop = 0,
  ...others
}: any) => {
  const [switchdisabled, setDisabled] = useState<boolean>(value);
  const handleChange = (checked: boolean) => {
    setDisabled(checked);
    onChange(checked);
  };
  useEffect(() => {
    setDisabled(value);
  }, [value]);
  return (
    <div style={{ marginTop, lineHeight: '32px' }}>
      <Switch checked={switchdisabled} onChange={handleChange} {...others} />
    </div>
  );
};
