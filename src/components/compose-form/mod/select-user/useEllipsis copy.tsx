import { useEffect, useRef } from 'react';

export default function useEllipsis() {
  const ctx = useRef(document.createElement('canvas').getContext('2d'));
  useEffect(() => {
    ctx.current.font =
      '14px PingFang SC, Verdana, Helvetica Neue, Microsoft Yahei, Hiragino Sans GB, Microsoft Sans Serif, WenQuanYi Micro Hei, sans-serif';
  }, []);
  const getValue = (str = '', size, left = true) => {
    let i = 1;
    const len = str.length;
    while (
      ctx.current.measureText(
        left ? str.substring(0, i) : str.substring(len - i, len),
      ).width < size &&
      i < len
    ) {
      i += 1;
    }
    const textResult = left
      ? str.substring(0, i - 1)
      : str.substring(len - i + 1, len);
    return {
      textResult,
      width: ctx.current.measureText(textResult).width,
    };
  };
  const transformaVal = (targetValue: string, textWidth: number) => {
    const curValue = targetValue.toString();

    if (ctx.current.measureText(curValue).width > textWidth) {
      const maxSize = textWidth - ctx.current.measureText('...').width;
      const { textResult: leftText, width: leftWidth } = getValue(
        curValue,
        maxSize / 2,
      );
      return `${leftText}...${
        getValue(curValue, maxSize - leftWidth, false).textResult
      }`;
    } else {
      return targetValue;
    }
  };
  return { transformaVal };
}
