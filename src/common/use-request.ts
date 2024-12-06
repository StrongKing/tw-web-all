// use request hook
// @author Pluto <huarse@gmail.com>
// @create 2020/06/22 10:52

import { useState, useEffect, useRef } from 'react';
import { Request } from '../components/interface';
import net from '@/services';
import { message } from 'antd';
import { Context as NetContext } from '@irim/saber/types/interfaces';

/**
 * @param request
 * @param options net.request 的入参
 * @param dataFormatter 返回数据格式化
 * @param effect 数据更新时执行effect
 * @reutrn 返回数据依次是 [data, loading, error]
 */
export default function useRequest(
  request: string | Request | undefined,
  options?: NetContext,
  dataFormatter?: ((data: any) => any) | null,
  effect?: (data: any) => any,
  firstEffect = true,
): [any, boolean, Error] {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error>();
  const requestId = useRef(0);

  useEffect(() => {
    if (!request) return;

    const thisReqId = requestId.current + 1;
    requestId.current = thisReqId;
    let url: string;
    let method: any;
    let params: any;
    if (typeof request === 'string') {
      url = request;
      method = 'GET';
      params = {};
    } else {
      url = request.url;
      method = request.method;
      params = request.params;
      if (request?.postRemoveSearch) {
        delete options?.search;
      }
    }

    setLoading(true);

    // tslint:disable-next-line: no-floating-promises
    net
      .request(url, {
        method,
        ...options,
        headers: {
          Authorization: (window as any).token,
        },
        data: {
          ...params,
          ...(options?.data as any),
        },
      })
      .then((result) => {
        // 有新的请求，丢弃本次回调操作
        if (thisReqId !== requestId.current) {
          return;
        }
        if (
          result.code !== 0 &&
          (typeof request === 'string' ||
            !Array.isArray(request.hideMsgCodes) ||
            !request.hideMsgCodes.includes(result.code))
        ) {
          message.error(result.msg || '网络错误');
        }
        if (result.code === 401 && (window as any).dsGoToLogin) {
          (window as any).dsGoToLogin();
        }
        setData(result.data);
      })
      .catch((error) => {
        // 有新的请求，丢弃本次回调操作
        if (thisReqId !== requestId.current) {
          return;
        }
        setError(error || {});
      })
      .finally(() => {
        // 有新的请求，丢弃本次回调操作
        if (thisReqId !== requestId.current) {
          return;
        }
        setLoading(false);
      });
  }, [JSON.stringify(request), JSON.stringify(options)]);
  const isFirstDataEffect = useRef(true);
  useEffect(() => {
    if (!firstEffect && isFirstDataEffect.current) {
      isFirstDataEffect.current = false;
    } else {
      effect && effect(dataFormatter ? dataFormatter(data) : data);
    }
  }, [data]);

  return [dataFormatter ? dataFormatter(data) : data, loading, error];
}
