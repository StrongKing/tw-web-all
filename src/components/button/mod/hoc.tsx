import { withHandlers, mapProps } from 'recompose';
import React from 'react';
import { Modal } from 'antd';
import { PropTypes } from '../interface';
import infoIcon from './info.svg';
import './index.less';

export const withConfirmHOC = withHandlers({
  toggleVisibility: ({ toggleVis, isVisible }) => {
    return () => {
      return toggleVis(!isVisible);
    };
  },
  onBeforeClick:
    ({ confirmBeforeClick, onBeforeClick, ...others }: PropTypes) =>
    async (arg) => {
      if (!confirmBeforeClick) {
        if (onBeforeClick) {
          await onBeforeClick(arg);
        }
        return true;
      }

      return new Promise((resolve, reject) => {
        const {
          title = '确定要删除吗？',
          content,
          modalTitle = '提示',
        } = confirmBeforeClick || {};
        Modal.confirm({
          okText: '确认',
          cancelText: '取消',
          closable: true,
          className: 'ssp-buttom-comfirm-modal',
          title: (
            <div className="ssp-button-comfirm">
              <span>{modalTitle}</span>
              <div className="ssp-button-comfirm-title">
                <img src={infoIcon} alt="" />
                <span>{title}</span>
              </div>
              <span>{content}</span>
            </div>
          ),

          onOk() {
            if (onBeforeClick) {
              onBeforeClick().then(() => resolve(true));
            } else {
              resolve(true);
            }
          },
          onCancel() {
            reject(false);
          },
        });
      });
    },
  onClick:
    ({ onClick, onEmit }: PropTypes) =>
    (...args: any) => {
      onEmit && onEmit('click', ...args);
      onClick && onClick(...args);
    },
});

export const spreadButtonPropsHOC = mapProps(
  ({ buttonProps, text, onClick }: PropTypes) => {
    return {
      ...buttonProps,
      children: text,
      onClick,
    };
  },
);
