import React from 'react';
import { Modal } from 'antd';
import infoIcon from './info.svg';
import './index.less';

const { confirm } = Modal;

const Confirm = ({
  onOk,
  onCancel,
  title = '确认要删除吗？',
  modalTitle = '提示',
  content,
}) => {
  return confirm({
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
      onOk();
    },
    onCancel() {
      onCancel && onCancel();
    },
  });
};
export default Confirm;
