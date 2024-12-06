import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import { throttle, set } from 'lodash';
import net from '@/services/index';

export default function selectSearch({
  api,
  initApi,
  onChange,
  value,
  disabled = false,
}) {
  let timeout: any;
  const [initValue, setInitValue] = useState(true);
  const [selectListValue, setSelectListValue] = useState([]);
  const [defaultValue, setdefaultVlaue] = useState(value);
  useEffect(() => {
    if (initValue && initApi && value) {
      net.request(`${initApi}?id=${value}`, { method: 'get' }).then((data) => {
        const dataSource = data?.data?.dataSource || [];
        // setdefaultVlaue(dataSource[0]?.label);
        setSelectListValue(dataSource);
        setdefaultVlaue(dataSource[0]?.label);
        setInitValue(false);
      });
    } else {
      setdefaultVlaue(value);
    }
  }, [value]);

  const fetch = (val: any) => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    const request = () => {
      net
        .request(api, {
          method: 'POST',
          data: {
            search: {
              keyword: val,
            },
          },
        })
        .then((data) => {
          const dataSource = data?.data?.dataSource;
          setSelectListValue(dataSource);
        });
    };
    timeout = setTimeout(request, 300);
  };

  const onChangeValue = (e) => {
    // console.log(e, 'eee');
    onChange(e);
  };
  const handleSearch = throttle(
    (val) => {
      if (val) {
        fetch(val);
      }
    },
    200,
    { trailing: false },
  );

  return (
    <div>
      <Select
        showSearch
        placeholder="请搜索"
        showArrow={false}
        // optionFilterProp="children"
        onChange={onChangeValue}
        onSearch={handleSearch}
        options={selectListValue}
        optionFilterProp="label"
        value={defaultValue}
        disabled={disabled}
      />
    </div>
  );
}
