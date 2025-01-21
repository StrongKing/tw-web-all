/*
 * @Author: 大鸡腿 734164941@qq.com
 * @Date: 2022-08-09 15:24:40
 * @LastEditors: 大鸡腿 734164941@qq.com
 * @LastEditTime: 2022-11-15 10:53:42
 * @FilePath: \suo-uicomponent\src\components\table\mod\text\index.jsx
 *
 * Copyright (c) 2022 by 大鸡腿 734164941@qq.com, All Rights Reserved.
 */
import React, { useRef, useEffect, useState, useMemo } from 'react';
import classNames from 'classnames';
import { Popover } from 'antd';
import widthMap from './letterWidth';
import './index.less';

function getStrlen(str = '') {
  let needWidth = 0;

  for (let i = 0; i < str.length; i += 1) {
    const c = str.charCodeAt(i);
    // 单字节加1
    if ((c >= 0x0001 && c <= 0x007e) || (c >= 0xff60 && c <= 0xff9f)) {
      needWidth += widthMap[str[i]] || 9;
    } else {
      needWidth += 14;
    }
  }
  return needWidth;
}

function getLeftValue(value = '', width) {
  let curWidth = 0;
  let str = '';
  for (let i = 0; curWidth < width; i += 1) {
    // 单字节加1
    const c = value.charCodeAt(i);
    if ((c >= 0x0001 && c <= 0x007e) || (c >= 0xff60 && c <= 0xff9f)) {
      curWidth += widthMap[value[i]] || 9;
    } else {
      curWidth += 14;
    }

    if (curWidth > width) {
      break;
    }
    str += value[i];
  }
  return str;
}

function getRightValue(value = '', width) {
  let curWidth = 0;
  let str = '';
  for (let i = value.length - 1; curWidth < width; i -= 1) {
    // 单字节加1
    const c = value.charCodeAt(i);
    if ((c >= 0x0001 && c <= 0x007e) || (c >= 0xff60 && c <= 0xff9f)) {
      curWidth += widthMap[value[i]] || 9;
    } else {
      curWidth += 14;
    }

    if (curWidth > width) {
      break;
    }
    str += value[i];
  }
  return str.split('').reverse().join('');
}

export default function TableCellText({
  value = '-',
  tableProps,
  rows = 1,
  onClick,
  unClickableExpress,
  clickable = false,
  valueFormatter,
}) {
  const { record, name } = tableProps || {};
  const textRef = useRef(null);
  const [showOverFlow, setShowOverFlow] = useState(0);
  const [overFlowValue, setOverFlowValue] = useState('');
  const showValue = useMemo(() => {
    if (!valueFormatter || typeof valueFormatter !== 'function') {
      return value;
    }
    return valueFormatter(record, value);
  }, [valueFormatter, record, value]);
  const ellipsis = useMemo(
    () =>
      rows === 1 && showValue
        ? typeof showValue === 'string'
          ? 'center'
          : 'right'
        : '',
    [showValue, rows],
  );
  useEffect(() => {
    if (showValue && rows === 1 && ellipsis === 'center') {
      const curValue = showValue.toString();
      const needWidth = getStrlen(curValue);
      const textWidth = textRef?.current?.clientWidth;
      // 经测试中文字符在字体大小14px下，占用14px宽度，但是英文字符占用宽度却不尽相同
      if (needWidth > textWidth) {
        const resWidth = textWidth - 11.67; // ... 三个点占用11.67px宽度。
        const letf = Math.ceil(resWidth / 2);
        setOverFlowValue(
          `${getLeftValue(curValue, letf)}...${getRightValue(
            curValue,
            resWidth - letf,
          )}`,
        );
        setShowOverFlow(true);
      } else {
        setShowOverFlow(false);
      }
    } else {
      setShowOverFlow(false);
    }
  }, [showValue, ellipsis]);

  let content = null;
  if (showValue instanceof Array) {
    content = (
      <span className="popoverText">
        {showValue.map((item) => (
          <div>{item}</div>
        ))}
      </span>
    );
  } else {
    content = <span className="popoverText">{showValue}</span>;
  }

  const overlayInnerStyle = {
    maxWidth: '20em',
    maxHeight: '400px',
    wordBreak: 'break-all',
    fontSize: '12px',
    color: '#666',
    overflow: 'auto',
  };

  const textClass = classNames(
    rows === 1 ? 'table-cell-text' : 'table-cell-text-rows',
    {
      'table-cell-text-right-ellipsis': ellipsis === 'right',
      'clickable-text-content':
        clickable ||
        (unClickableExpress ? !unClickableExpress(record, name) : false),
    },
  );

  const handleClick = () => {
    if (
      (unClickableExpress && !unClickableExpress(record, name)) ||
      clickable
    ) {
      onClick(record, name);
    }
  };

  const isNullOrUndefinedOrEmpty = (val) => {
    return val === null || val === undefined || val === '';
  };

  return (
    <Popover
      content={content}
      placement="bottomLeft"
      overlayInnerStyle={overlayInnerStyle}
    >
      <div
        ref={textRef}
        // onClick={onClick?.bind(null, record, name)}
        onClick={() => handleClick()}
        className={textClass}
        style={{ WebkitLineClamp: rows }}
      >
        {unClickableExpress && unClickableExpress(record, name)}
        {showOverFlow
          ? overFlowValue
          : isNullOrUndefinedOrEmpty(showValue)
          ? '-'
          : showValue}
      </div>
    </Popover>
  );
}
