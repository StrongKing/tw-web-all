import React, { useRef } from 'react';
import { Modal, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import RequestButton from './request';
import { RequestButtonProps } from './interface';

export const downloadButtonHOC =
  (Comp) =>
  ({
    onSuccess,
    onError,
    content,
    onBeforeClick,
    loadingText,
    ...others
  }: RequestButtonProps) => {
    const modal = useRef(null);
    const requesting = useRef(false);
    const handleBeforeClick = async (arg = {}) => {
      if (onBeforeClick) {
        await onBeforeClick(arg);
      }
      // const { terminate } = arg;
      requesting.current = true;
      modal.current = Modal.info({
        content,
        icon: <LoadingOutlined />,
        centered: true,
        // okText: '1',
        // footer: null,
      });
    };
    const handleSuccess = (result: any) => {
      if (!requesting.current) return;
      requesting.current = false;
      modal.current.destroy();

      // 跳转到下载链接
      // window.location.href = result.data;
      // message.success('下载链接获取成功，即将下载', 2);
      // if ()
      onSuccess && onSuccess(result.data);
    };
    const handleError = (e: any) => {
      requesting.current = false;
      modal.current.destroy();
      onError && onError(e);
    };
    return (
      <Comp
        {...others}
        onSuccess={handleSuccess}
        onError={handleError}
        onBeforeClick={handleBeforeClick}
      />
    );
  };

export default downloadButtonHOC(RequestButton);
