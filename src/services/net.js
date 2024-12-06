import axios from 'axios';
import { getLogInfo } from './log';
import packageData from '../../package.json';

export default async function net(url, options = {}) {
  const appCode = getLogInfo();
  return new Promise((resolve, reject) => {
    return axios({
      url,
      ...options,
      // withCredentials: true,
      headers: {
        Authorization: window.token,
        'page-log': `suo-web-all=${packageData.version}&appCode=${appCode}`,
        'app-code': appCode,
      },
    })
      .then((response) => {
        const { data } = response;
        if (data.code === 401 && window.dsGoToLogin) {
          window.dsGoToLogin();
          return reject(data || {});
        }
        return resolve(data);
      })
      .catch((error) => {
        const { response } = error || {};
        const { data } = response || {};
        return reject(data || {});
      });
  });
}
