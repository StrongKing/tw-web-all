import React, { useRef } from 'react';
import './index.less';

export interface TextProps {
  value?: string;
}

export default function Text(props: TextProps) {
  const { value, ...otherProps } = props;
  const renderMark = useRef(false);

  if (!renderMark.current) {
    // console.log('render Text component');
    renderMark.current = true;
  }

  const isNullOrUndefinedOrEmpty = (val: any) => {
    return val === null || val === undefined || val === "";
  };

  return (
    <p className="cf-form-text-item" {...otherProps}>
      {isNullOrUndefinedOrEmpty(value) ? '-' : value}
    </p>
  );
}
