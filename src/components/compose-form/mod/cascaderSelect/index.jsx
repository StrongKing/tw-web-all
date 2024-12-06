/* eslint-disable no-plusplus */
import React from 'react';
import { Cascader } from 'antd';

export default function cascader({
  dataSource = [],
  value = [],
  onChange,
  allowClear = true,
  disabled,
  fieldNames,
  ...others
}) {
  const onValueChange = (val) => {
    onChange(val);
  };

  const getReadOnlyValue = () => {
    const valueKey = fieldNames?.value ?? 'value';
    const labelKey = fieldNames?.label ?? 'label';
    const childrenKey = fieldNames?.children ?? 'children';

    let str = '';
    let arr = [...dataSource];
    for (let i = 0; i < value.length && arr?.length > 0; i++) {
      const el = arr?.find((item) => item?.[valueKey] === value[i]);
      if (el) {
        str = `${str}${i === 0 ? '' : ' / '}${el?.[labelKey]}`;
        arr = el?.[childrenKey];
        // eslint-disable-next-line no-plusplus
      } else {
        arr = [];
      }
    }

    return <>{str || '-'}</>;
  };

  return (
    <>
      {disabled ? (
        value.length && dataSource?.length ? (
          getReadOnlyValue()
        ) : (
          <span>-</span>
        )
      ) : (
        <Cascader
          allowClear={allowClear}
          options={dataSource}
          value={value}
          placeholder="请选择"
          onChange={onValueChange}
          fieldNames={fieldNames}
          {...others}
        />
      )}
    </>
  );
}
