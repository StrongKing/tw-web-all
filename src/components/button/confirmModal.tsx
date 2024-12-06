import React, { useCallback } from 'react';
import { FormButtonProps } from './interface';
import { Modal, Button } from 'antd';
const { confirm } = Modal;

export default function TestModal({ text, onClick, confirmInfo, onOk }: props) {
  const style = {
    color: '#1785ec',
    cursor: 'pointer',
    paddingLeft: '12px',
    // padding: '10px 20px',
    // border: '1px solid #eee',
  };

  const showConfirm = () => {
    confirm({
      ...confirmInfo,
      onOk() {
        onClick();
      },
      onCancel() {},
    });
  };

  return (
    <Button type="link" style={style} onClick={showConfirm}>
      {text}
    </Button>
  );
}
