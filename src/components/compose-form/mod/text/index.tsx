import { FormInstance } from 'antd';
import React, { ReactNode, useMemo, useRef } from 'react';
import './index.less';

export interface TextProps {
  value?: string;
  valueFormatter?: (val?: string, formValues?: Object) => ReactNode;
  form: FormInstance;
}

export default function Text(props: TextProps) {
  const { value, valueFormatter, form, ...otherProps } = props;
  const renderMark = useRef(false);

  if (!renderMark.current) {
    // console.log('render Text component');
    renderMark.current = true;
  }

  const isNullOrUndefinedOrEmpty = (val: any) => {
    return val === null || val === undefined || val === '';
  };

  const showValue = useMemo(() => {
    const newVal =
      typeof valueFormatter === 'function'
        ? valueFormatter(value, form.getFieldsValue())
        : value;
    return isNullOrUndefinedOrEmpty(newVal) ? '-' : newVal;
  }, [value, valueFormatter, form]);

  return (
    <p className="cf-form-text-item" {...otherProps}>
      {showValue}
    </p>
  );
}
