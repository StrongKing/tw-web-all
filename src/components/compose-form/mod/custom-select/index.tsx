import React from 'react';
import { Select } from 'antd';

export default function Index({
  value,
  dataSource,
  code,
  onChange,
  optionFilterProp,
  mode = 'multiple',
  fieldNames,
  showSearch = true,
  placeholder = '全部',
}: any) {
  const handleChange = (val: string[]) => {
    if (val instanceof Array && val.includes(code)) {
      const data = dataSource
        .filter((f: { value: string }) => f.value !== code)
        .map((item: { value: string }) => item.value);
      onChange(data);
    } else {
      onChange(val);
    }
  };

  return (
    <Select
      style={{ width: '100%' }}
      value={value}
      showSearch={showSearch}
      allowClear
      mode={mode}
      placeholder={placeholder}
      optionFilterProp={optionFilterProp || 'label'}
      fieldNames={
        fieldNames || {
          label: 'label',
          value: 'value',
        }
      }
      maxTagCount="responsive"
      onChange={(v) => handleChange(v)}
      options={dataSource}
    />
  );
}
