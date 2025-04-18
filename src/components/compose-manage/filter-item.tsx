// 数据过滤组件
// @author Pluto <huarse@gmail.com>
// @create 2020/06/22 21:17

import React, { useState, useEffect, ReactNode } from 'react';
import { Request } from '../interface';
import CascaderSelect from '../../components/compose-form/mod/cascaderSelect';
import CustomSelect from '../../components/compose-form/mod/custom-select';
import useRequest from '@/common/use-request';
import ProForm, {
  ProFormText,
  ProFormSelect,
  ProFormDatePicker,
  ProFormDateTimeRangePicker,
  ProFormDateRangePicker,
} from '@ant-design/pro-form';
import { getRangeMap, tipsMap } from '@/common/dateRange';
import NumberRange from '../numberRange';

export interface NsFilterProps {
  externalComsMap: Record<string, (props: any) => JSX.Element>;
  type:
    | 'search'
    | 'select'
    | 'datepicker'
    | 'dateRangePicker'
    | 'cascader-select'
    | 'dateTimeRangePicker'
    | 'customSelect';
  name: string;
  label?: string | React.ReactNode;
  defaultValue?: any;
  /** 用于 select 的本地数据源，如果是 url 或 Request 结构，则表示从远程获取数据，返回数据结构为与本地数据一致 */
  dataSource?: string | Request | { value: string | number; label: string }[];
  labelWidth: string;
  [x: string]: any;
}

const comsMap: Record<string, (props: any) => JSX.Element> = {
  numberRange: NumberRange,
};

export default function FilterItem({
  type,
  collapsed,
  index,
  defaultColsNumber,
  dataSource,
  dataSourceFmt,
  formRef,
  props = {},
  externalComsMap = {},
  labelWidth,
  ...others
}: NsFilterProps) {
  const [localSource, setLocalSource] = useState<any[]>([]);
  const [remoteSource] = useRequest(
    !Array.isArray(dataSource) ? (dataSource as any) : null,
    {},
    (data) =>
      dataSourceFmt
        ? dataSourceFmt(data)
        : data?.dataSource || data?.formValue || data,
  );
  useEffect(() => {
    if (Array.isArray(dataSource)) {
      setLocalSource(dataSource);
    }
  }, [dataSource]);

  const getOffsetDayTips = (t = 0) => {
    return tipsMap[`${t}`]
      ? () => <div className="picker-ranges-tips">{tipsMap[`${t}`]}</div>
      : undefined;
  };

  const { name, label } = others;
  const Com = externalComsMap[type] || comsMap[type];

  if (Com) {
    return (
      <ProForm.Item
        name={name}
        label={label}
        labelCol={{ flex: labelWidth }}
        style={{
          display: collapsed && index >= defaultColsNumber - 1 ? 'none' : '',
        }}
      >
        <Com {...props} />
      </ProForm.Item>
    );
  }

  if (type === 'select') {
    const { onChange = () => {} } = props;
    return (
      <ProFormSelect
        {...props}
        {...others}
        options={remoteSource || localSource}
        fieldProps={{
          ...props,
          onChange: (val: any, option: any) => onChange(val, option, formRef),
        }}
        allowClear
      />
    );
  }

  if (type === 'cascader-select') {
    return (
      <ProForm.Item
        name={name}
        label={label}
        labelCol={{ flex: labelWidth }}
        style={{
          display: collapsed && index >= defaultColsNumber - 1 ? 'none' : '',
        }}
      >
        <CascaderSelect {...props} dataSource={remoteSource || localSource} />
      </ProForm.Item>
    );
  }

  if (type === 'customSelect') {
    const { onChange = () => {} } = props;
    return (
      <ProForm.Item
        name={name}
        label={label}
        labelCol={{ flex: labelWidth }}
        style={{
          display: collapsed && index >= defaultColsNumber - 1 ? 'none' : '',
        }}
      >
        <CustomSelect
          {...props}
          onChange={(val: any) => onChange(val, formRef)}
          dataSource={remoteSource || localSource}
        />
      </ProForm.Item>
    );
  }

  if (type === 'search') {
    return (
      <ProFormText
        {...props}
        {...others}
        fieldProps={props}
        style={{ minWidth: 300 }}
      />
    );
  }
  if (type === 'datepicker') {
    return (
      <ProFormDatePicker
        {...props}
        {...others}
        fieldProps={{
          ...(props || {}),
          className: props?.className,
        }}
        style={{ minWidth: 280 }}
      />
    );
  }
  if (type === 'dateRangePicker') {
    const {
      offsetDay = 0,
      showRanges = true,
      ranges,
      renderExtraFooter,
      className,
      ...rangePickerProps
    } = props || {};

    return (
      <ProFormDateRangePicker
        {...rangePickerProps}
        {...others}
        fieldProps={{
          ...rangePickerProps,
          ranges: showRanges ? getRangeMap(offsetDay) : ranges,
          renderExtraFooter: showRanges
            ? getOffsetDayTips(offsetDay)
            : renderExtraFooter,
          className: `filter-item-timerange ${className || ''}`,
        }}
        style={{ minWidth: 280 }}
      />
    );
  }
  if (type === 'dateTimeRangePicker') {
    const {
      offsetDay = 0,
      showRanges = true,
      ranges,
      renderExtraFooter,
      className,
      ...rangePickerProps
    } = props || {};
    return (
      <ProFormDateTimeRangePicker
        {...props}
        {...others}
        fieldProps={{
          ...rangePickerProps,
          ranges: showRanges ? getRangeMap(offsetDay) : ranges,
          renderExtraFooter: showRanges
            ? getOffsetDayTips(offsetDay)
            : renderExtraFooter,
          className: `filter-item-timerange ${className || ''}`,
        }}
        style={{ minWidth: 280 }}
        width="lg"
        colSize="8"
        props={{
          width: 'lg',
          colSize: 8,
        }}

        // onChange={() => {
        //   console.log(33);
        // }}
        // width="xs"
        // colSize={3}
      />
    );
  }

  // datepicker

  return null;
}
