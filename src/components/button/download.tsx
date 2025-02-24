import React, { useRef } from 'react';
import { Modal, message } from 'antd';
import { ExclamationCircleFilled, LoadingOutlined } from '@ant-design/icons';
import RequestButton from './request';
import { RequestButtonProps } from './interface';
import FormConfirm from '../FormConfirm';
import net from '@/services';
import request from '@/common/request2';

export const downloadButtonHOC =
  (Comp) =>
  ({
    onSuccess,
    onError,
    onBeforeClick,
    loadingText,
    smsApiUrl,
    // smsApiUrl = `https://front.sit.suosihulian.com/gateway/auth/oauth/sms/bizSend`,
    successCodes = [],
    ...others
  }: RequestButtonProps & { smsApiUrl?: string }) => {
    const modal = useRef<{
      destroy: () => void;
      update: (configUpdate: any) => void;
    } | null>(null);
    const requesting = useRef(false);
    const handleBeforeClick = async (arg = {}) => {
      if (onBeforeClick) {
        await onBeforeClick(arg);
      }
      const { terminate } = arg;
      requesting.current = true;
      modal.current = Modal.info({
        content: '正在导出中，请稍候…',
        icon: <LoadingOutlined />,
        centered: true,
        onOk(close) {
          Modal.confirm({
            okText: '确认',
            cancelText: '取消',
            content: '您确定要取消下载吗？',
            centered: true,
            onOk() {
              close();
              terminate();
            },
          });
          requesting.current = false;
        },
        okText: '取消下载',
      });
    };
    const handleSuccess = (result: any) => {
      console.log(result);
      if (!requesting.current) return;
      requesting.current = false;
      modal.current?.destroy();
      if (!result || !/\/\//.test(result.data)) {
        console.error(
          '下载接口返回数据错误，请返回形如 { "success": true, "data": "下载链接" } 的结果',
        );
        onError && onError(new Error('下载接口错误，请联系管理员'));
        return;
      }
      // 跳转到下载链接
      window.location.href = result.data;
      message.success('下载链接获取成功，即将下载', 2);
      onSuccess && onSuccess(result.data);
    };
    const onCancel = (e?: any) => {
      requesting.current = false;
      modal.current?.destroy();
      onError && onError(e);
    };

    const onSmsExport = async (
      smsCode: string,
      requestParams: any,
      onRequestSuccess: (...args: any) => any,
      onRequestError: (...args: any) => void,
    ) => {
      try {
        const result = await net.request(requestParams.url, {
          ...requestParams.options,
          data: {
            ...requestParams.options.data,
            smsCode,
          },
        });
        return (
          onRequestSuccess &&
          onRequestSuccess(
            result,
            requestParams.options.data,
            () => {
              message.error(result.msg || '网络错误');
              const flag = result.code !== 1001 && result.code !== 9998;
              if (flag) {
                onRequestError && onRequestError(result);
              }
              return flag;
            },
            result.code !== 1001 && result.code !== 9998,
          )
        );
      } catch (err) {
        onRequestError && onRequestError(err);
      }
    };
    const handleError = async (
      e: any,
      requestParams: any,
      onRequestSuccess: (...args: any) => void,
      onRequestError: (...args: any) => void,
    ) => {
      if ([9998, 9997].includes(e.code)) {
        try {
          let smsApi = smsApiUrl;

          // eslint-disable-next-line no-undef
          FormConfirm({
            formProps: {
              controls: [
                {
                  name: 'smsCode',
                  uiType: 'phoneSmsCode',
                  props: {
                    triggerRequest: e.code === 9998,
                    requestSuccessMsg: '验证码已发送，请注意查收',
                    request: {
                      url: smsApi,
                    },
                  },
                  rules: [{ required: true, message: '请输入短信验证码' }],
                },
              ],
              labelCol: {
                xs: {
                  span: 19,
                },
                sm: {
                  span: 0,
                },
              },
              wrapperCol: {
                xs: {
                  span: 19,
                },
                sm: {
                  span: 24,
                },
              },

              actions: [
                {
                  uiType: 'button',
                  props: {
                    children: '取消',
                  },
                },
                {
                  uiType: 'submit',
                  props: {
                    children: '保存',
                    type: 'primary',
                    'data-submit-action': 'submit',
                  },
                },
              ],
            },
            dialogProps: {
              title: '数据导出验证',
              maskClosable: false,
              keyboard: false,
            },
            onConfirm: async ({ smsCode }: any) => {
              const flag = await onSmsExport(
                smsCode,
                requestParams,
                onRequestSuccess,
                onRequestError,
              );
              return flag;
            },
            onCancel: () => {
              onRequestError &&
                onRequestError({ remark: '关闭输入验证码弹窗' });
              onCancel();
            },
            topExtra: (
              <div
                style={{
                  fontSize: '14px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <ExclamationCircleFilled
                  style={{
                    marginRight: '8px',
                    fontSize: '14px',
                    color: `var(--ant-primary-color, #2c7ef8)`,
                  }}
                />
                {e.msg || '请输入短信验证码'}
              </div>
            ),
          });
        } catch (e: any) {
          onRequestError && onRequestError(e);
          onCancel();
        }
      } else {
        onRequestError && onRequestError(e);
        onCancel(e);
      }
    };
    return (
      <Comp
        {...others}
        onSuccess={handleSuccess}
        onError={handleError}
        onBeforeClick={handleBeforeClick}
        hideMsgCodes={[9998, 9997, ...successCodes]}
        successCodes={successCodes}
      />
    );
  };

export default downloadButtonHOC(RequestButton);
