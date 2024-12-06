import widthMap from './letterWidth';

export default function useEllipsis() {
  const getStrlen = (str = '') => {
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
  };

  const getLeftValue = (value = '', width) => {
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
  };

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
  const transformaVal = (targetValue: string, textWidth: number) => {
    const curValue = targetValue.toString();
    const needWidth = getStrlen(curValue);
    if (needWidth > textWidth) {
      const resWidth = textWidth - 11.67; // ... 三个点占用11.67px宽度。
      const letf = Math.ceil(resWidth / 2);
      return `${getLeftValue(curValue, letf)}...${getRightValue(
        curValue,
        resWidth - letf,
      )}`;
    } else {
      return targetValue;
    }
  };
  return { transformaVal };
}
