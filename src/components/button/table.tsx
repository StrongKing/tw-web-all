import React, { useState, useCallback } from 'react';
import { Modal } from 'antd';
import { ModalButtonProps } from './interface';
import ComposeManage from '../compose-manage';
import Button from './default';

export default function BatchButton({
  className,
  dialogProps,
  manageProps,
  uiType,
  confirmBeforeClick,
  onBeforeClick,
  confirmBeforeClickFormatter,
  ...restProps
}: ModalButtonProps) {
  const [dlgVis, setDlgVis] = useState(false);
  const hideDlg = useCallback(() => {
    setDlgVis(false);
  }, []);

  const showDlg = useCallback(() => {
    setDlgVis(true);
  }, []);

  return (
    <>
      <Button {...restProps} onClick={showDlg} />
      <Modal visible={dlgVis} onCancel={hideDlg} footer={null} {...dialogProps}>
        <ComposeManage {...manageProps} />
      </Modal>
    </>
  );
}
