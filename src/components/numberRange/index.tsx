import React, { FocusEvent, useMemo, useRef } from 'react';
import { CloseCircleFilled, SwapRightOutlined } from '@ant-design/icons';
import './index.less';
import { clamp } from '@/common/util';

export interface NumberRangeProps {
  value: string[];
  min?: number;
  max?: number;
  /** 是否是非负数 默认false */
  nonnegative?: boolean;
  /** 是否是整数 默认false */
  integer?: boolean;
  /** 最小值最大值是否保持顺序 */
  order?: boolean;
  placeholder?: string[] | string;
  clearable?: boolean;
  onChange: (val?: string[]) => void;
  onOneBlur?: (e: FocusEvent) => void;
  onBlur?: (e: FocusEvent) => void;
  onFocus?: (e: FocusEvent) => void;
}

const NumberRange = ({
  value,
  min = -Infinity,
  max = Infinity,
  nonnegative = false,
  integer = false,
  order = true,
  placeholder = '请输入',
  clearable = true,
  onBlur,
  onOneBlur,
  onFocus,
  onChange,
}: NumberRangeProps) => {
  const [minVal, maxVal] = useMemo(() => {
    if (min > max) {
      return [max, min];
    }
    return [min, max];
  }, [min, max]);
  const _formatter = (val: string) => {
    let newVal = (val || '').toString();
    if (nonnegative && integer) {
      newVal = newVal.replace(/[^0-9]/g, '');
    } else if (nonnegative) {
      newVal = newVal
        .replace(/[^0-9.]/g, '')
        .replace(/(\.[^.]*)\./g, '$1')
        .replace(/(-|^)\./, '$1');
    } else if (integer) {
      newVal = newVal.replace(/[^0-9-]/g, '').replace(/(.+)-/g, '$1');
    } else {
      newVal = newVal
        .replace(/[^0-9.-]/g, '')
        .replace(/(\.[^.]*)\./g, '$1')
        .replace(/(.+)-/g, '$1')
        .replace(/(-|^)\./, '$1');
    }
    newVal = newVal.replace(/(^|-)0+(\d)/, '$1$2');
    if (newVal === '-') return '-';
    const newNum = clamp(+newVal, minVal, maxVal);
    if (newNum === +newVal) return newVal;
    return newNum.toString();
  };
  const isFocus = useRef(false);
  const [startVal, endVal] = useMemo(() => {
    if (Array.isArray(value)) {
      return [_formatter(value[0] || ''), _formatter(value[1] || '')];
    } else {
      return ['', ''];
    }
  }, [value]);
  const [placeholderStart, placeholderEnd] = useMemo(() => {
    if (Array.isArray(placeholder)) {
      return [placeholder[0] || '', placeholder[1] || ''];
    } else {
      return [placeholder || '', placeholder || ''];
    }
  }, [placeholder]);
  const handleBlur = (e: FocusEvent) => {
    onOneBlur && onOneBlur(e);
    isFocus.current = false;
    setTimeout(() => {
      if (!isFocus.current) {
        if (order && startVal && endVal && +startVal > +endVal) {
          onChange([endVal, startVal]);
        }
        onBlur && onBlur(e);
      }
    });
  };
  const handleFocus = (e: FocusEvent) => {
    isFocus.current = true;
    onFocus && onFocus(e);
  };
  const clear = () => {
    onChange(undefined);
  };
  return (
    <div
      className={`ss-number-range ${clearable ? 'ss-number-range-icons' : ''}`}
    >
      <input
        value={startVal}
        onChange={(e) => onChange([_formatter(e.target.value), endVal])}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholder={placeholderStart}
      />
      <SwapRightOutlined />
      <input
        value={endVal}
        onChange={(e) => onChange([startVal, _formatter(e.target.value)])}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholder={placeholderEnd}
      />
      {clearable && (
        <CloseCircleFilled
          onClick={clear}
          style={{ display: startVal || endVal ? 'block' : 'none' }}
        />
      )}
    </div>
  );
};
export default NumberRange;
