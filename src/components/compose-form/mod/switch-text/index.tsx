import React, { useEffect, useState } from 'react';
import { Switch } from 'antd';

export default ({
  value,
  onChange,
  checkedValue = true,
  uncheckedValue = false,
  ...others
}: any) => {
  const [switchChecked, setSwitchChecked] = useState<boolean>(
    value === checkedValue,
  );
  const handleChange = (checked: boolean) => {
    setSwitchChecked(checked);
    onChange(checked ? checkedValue : uncheckedValue);
  };
  useEffect(() => {
    setSwitchChecked(value === checkedValue);
  }, [value]);
  return (
    <div style={{ lineHeight: '32px' }}>
      <Switch checked={switchChecked} onChange={handleChange} {...others} />
    </div>
  );
};
