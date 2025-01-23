import React, { useState, useRef } from 'react';
import { Button, message, MessageArgsProps } from 'antd';
import { compose, withState } from 'recompose';
import { RequestButtonProps } from './interface';
import { withConfirmHOC, spreadButtonPropsHOC } from './mod/hoc';
import { parseParam } from '@/common/util';
import net from '@/services';

const withRequest =
  (Comp) =>
  ({
    onBeforeClick,
    onSuccess,
    onError,
    request,
    loadingText,
    buttonProps,
    onClick,
    hideMsgCodes = [],
    successCodes = [],
    ...others
  }: RequestButtonProps) => {
    const { confirmBeforeClick, innerRequest, searchDataFormatter } = others;

    const [loading, _setLoading] = useState(false);
    const { requestParams = null } = parseParam(location.search);
    // 同步缓存 loading 的值，用于实时判断
    const loadingRef = useRef(false);
    const setLoading = (nextLoading: boolean) => {
      _setLoading(nextLoading);
      loadingRef.current = nextLoading;
    };

    const queryDownloadByfieldName = async (value) => {
      const { url, params, method } = innerRequest || {};
      const id = Object.keys(params)[0];
      const result = await net.request(url, {
        method: method || 'POST',
        data: {
          [id]: value,
        },
      });
      if (result.data === '0') {
        setTimeout(() => {
          queryDownloadByfieldName(value);
        }, 5000);
      } else {
        message.success('操作成功', 1, () => {
          onSuccess && onSuccess(result);
        });
      }
    };

    const getVisible = () => {
      const { params } = request;
      if (!confirmBeforeClick) {
        return true;
      }
      return (
        !requestParams ||
        (params?.idList?.length > 0 &&
          JSON.stringify(requestParams?.idList) !==
            JSON.stringify(params?.idList))
      );
    };
    const onRequestSuccess = (
      result: any,
      newParams: any,
      onDefaultError: () => void,
      hideLoading = true,
    ) => {
      if (!loadingRef.current) return;
      if (
        result &&
        (result.code === 0 ||
          result.code === 200 ||
          successCodes.includes(result.code))
      ) {
        hideLoading && setLoading(false);
        if (innerRequest) {
          queryDownloadByfieldName(result.data);
        } else if (hideMsgCodes.includes(result.code)) {
          onSuccess && onSuccess(result, newParams);
        } else {
          message.success(result?.msg || '操作成功', 1, () => {
            onSuccess && onSuccess(result, newParams);
          });
        }
      } else if (/<br\s*\/>/.test(result.msg)) {
        hideLoading && setLoading(false);
        const content: MessageArgsProps = {
          content: (
            <div
              dangerouslySetInnerHTML={{
                __html: result?.msg,
              }}
            />
          ),
          duration: 6,
          type: 'warning',
          className: 'custom-antd-message',
        };
        message.warning(content);
        onError && onError();
      } else {
        if (!hideMsgCodes.includes(result.code)) {
          hideLoading && setLoading(false);
        }
        return onDefaultError();
      }
    };
    const onRequestError = (error: any) => {
      setLoading(false);
      onError && onError(error);
    };
    const handleClick = async () => {
      if (loadingRef.current) return;
      try {
        const {
          url,
          params,
          method,
          formatter,
          tableSource,
          ...requestOptions
        } = request;

        // 只有在不需要扫码或者扫码成功后弹出“导出中”弹框
        const exportLoading = async () => {
          if (getVisible()) {
            await onBeforeClick({
              terminate() {
                setLoading(false);
              },
            });
          }
        };

        let _params = {};
        if (formatter && !tableSource) {
          try {
            _params = await formatter(params);
          } catch (err) {
            console.warn(`请求中断：${err.message}`);
            return;
          }
        }

        const getSearch = (val: any = {}) => {
          let search = { ...val };

          if (searchDataFormatter) {
            search = searchDataFormatter(search);
          }
          return search;
        };

        await exportLoading();
        setLoading(true);

        const newParams = getSearch({ ...(params || {}), ...(_params || {}) });
        net
          .request(url, {
            method: method || 'POST',
            data: newParams,
            showError: true,
            ...requestOptions,
          })
          .then((result) => {
            onRequestSuccess(result, newParams, () => {
              if (!hideMsgCodes.includes(result?.code)) {
                message.error(result.msg || '网络错误');
              }
              if (onError) {
                return onError(
                  result,
                  {
                    url,
                    options: {
                      method: method || 'POST',
                      data: newParams,
                      showError: true,
                      ...requestOptions,
                    },
                  },
                  onRequestSuccess,
                  onRequestError,
                );
              }
            });
          })
          .catch((error) => {
            onRequestError(error);
          });
      } catch (err) {
        setLoading(false);
      }
    };
    return (
      <>
        <Comp
          {...others}
          buttonProps={{
            ...(buttonProps || {}),
            loading,
          }}
          onClick={handleClick}
        />
      </>
    );
  };
export const requestHoc = compose(
  withState('isVisible', 'toggleVis', false),
  withConfirmHOC,
  withRequest,
  spreadButtonPropsHOC,
);
export default requestHoc(Button);
