export {
  logger,
  random,
  uuid,
  isEmpty,
  serialize,
  parseJSON,
} from '@irim/saber';

/**
 * 解析URL search
 * @param  {string}  [str]      要解析的字符串
 * @param  {Boolean} [isDecode=true] 是否decode
 * @return {object}
 * @example
 * parseParam('aaa=1&bbb=2&ccc=3'); // { aaa: '1', bbb: '2', ccc: '3' }
 */
export function parseParam(
  str = location.search || location.href,
  isDecode = true,
) {
  const ary = str.split(/[?&]/);
  const result = {};
  for (let i = 0, j = ary.length; i < j; i++) {
    const n = ary[i];
    if (!n) continue;
    const tmp = n.split('=');
    result[tmp[0]] = isDecode && !!tmp[1] ? decodeURIComponent(tmp[1]) : tmp[1];
  }
  return result;
}

/**
 * 从对象中解析出想要的值
 * @param {object} obj object
 * @param {string} key keys
 * @example
 * parseValue({ a: [{ b: 100 }] }, 'a.0.b'); // 100
 */
export function parseValue(obj, key) {
  if (!obj) return undefined;

  const keys = key.split('.');
  return keys.reduce((prev, curr) => {
    return (prev && prev[curr]) || undefined;
  }, obj);
}

let SEED = Math.round(Date.now() * Math.random());

/** 返回一个唯一的key */
export function uniqueKey() {
  return `CC${(SEED++).toString(36).toUpperCase()}`;
}

/**
 * 保留几位小数点
 * @param {number} num
 * @param {number} [unit=2]
 */
export function toFixed(num, fix = 2) {
  const unit = Math.pow(10, fix);
  return Math.round(num * unit) / unit;
}

// 复制文本到剪贴板
export function copy2Clipboard(text) {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.style.position = 'fixed';
    input.style.opacity = '0';
    input.value = text;
    document.body.appendChild(input);
    input.select();

    document.execCommand('copy') ? resolve(true) : reject(false);
    document.body.removeChild(input);
  });
}

/** 字符串排序 */
export function compare4ASCII(a, b) {
  if (!a && !b) return 0;
  // if (!isNaN(a) && !isNaN(b)) return a - b;
  if (typeof a === 'number' && typeof b === 'number') return a - b;

  // 没有内容应该放最后
  if (!a) return -1;
  if (!b) return 1;
  if (a === b) return 0;

  const aIsEN = /^[\w\s]+$/.test(a);
  const bIsEN = /^[\w\s]+$/.test(b);

  if (aIsEN && bIsEN) return a > b ? 1 : -1;
  if (aIsEN && !bIsEN) return -1;
  if (!aIsEN && bIsEN) return 1;

  if (String.prototype.localeCompare) {
    return String.prototype.localeCompare.call(a, b, 'zh');
  }

  return a > b ? 1 : -1;
}

export const ENV = (
  document.querySelector('meta[name="x-server-env"]') || { content: 'test' }
).content;

/**
 * 在后端存在脏数据的情况下，为列表数据加上唯一key
 * @param data object 请求返回的数据
 * @param data.dataSource array
 * @param data.pagination object
 * @returns object
 */
export const getUniqueData = (data) => {
  const { dataSource = [], pagination } = data || {};
  return {
    dataSource: dataSource.map((item, index) => ({
      ...item,
      uniqueId: pagination?.pageSize * (pagination?.pageNo - 1) + index + 1,
    })),
    pagination,
  };
};
/**
 * 获取视频时长
 * @param {File} file 视频文件
 * @returns {Promise<number>}
 */
export const getVideoDuration = (file) => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    const videoUrl = URL.createObjectURL(file);
    video.addEventListener('loadedmetadata', function () {
      const { duration } = video;
      URL.revokeObjectURL(videoUrl);
      resolve(duration);
    });
    video.addEventListener('error', () => {
      resolve(0);
    });
    video.src = videoUrl;
  });
};
export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
