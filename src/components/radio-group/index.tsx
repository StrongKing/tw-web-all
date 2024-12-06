/*
 * @Author: 大鸡腿 734164941@qq.com
 * @Date: 2022-08-09 15:24:40
 * @LastEditors: 大鸡腿 734164941@qq.com
 * @LastEditTime: 2022-09-21 12:56:02
 * @FilePath: \suo-uicomponent\src\components\radio-group\index.tsx
 *
 * Copyright (c) 2022 by 大鸡腿 734164941@qq.com, All Rights Reserved.
 */
import React, { useCallback, useMemo, useEffect } from 'react';
import { Radio } from 'antd';
import './index.less';

export interface PropTypes {
  onChange?(value: any): void;
  value?: any;
  dataSource: {
    value: any;
    label?: string;
    text?: string;
  }[];
}

export default function RadioGroup({
  dataSource = [],
  value,
  onChange,
  ...others
}: PropTypes) {
  const handleOnChange = useCallback(
    (changedValue: any) => {
      onChange && onChange(changedValue);
    },
    [onChange],
  );

  useEffect(() => {
    if (!value) {
      handleOnChange(dataSource?.[0].value);
    }
  }, []);

  const $radios = useMemo(() => {
    return dataSource.map(({ value, label, text }) => (
      <Radio value={value} key={value}>
        {label || text}
      </Radio>
    ));
  }, [dataSource]);
  return (
    <div className="radio-style">
      <Radio.Group onChange={handleOnChange} {...others} value={value}>
        {$radios}
      </Radio.Group>
    </div>
  );
}
