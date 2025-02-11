/* eslint-disable no-unused-expressions */
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Alert, Modal } from 'antd';
import classNames from 'classnames';
import { FormButtonProps } from '../interface';
import Form from '@/components/compose-form';
import Button from '../default';
import './index.less';

export default function DialogForm({
  className,
  onOpen,
  onCancel,
  onOk,
  dialogProps,
  formProps,
  noContainer,
  formItemLayout = {
    labelCol: {
      xs: {
        span: 19,
      },
      sm: {
        span: 5,
      },
    },
    wrapperCol: {
      xs: {
        span: 19,
      },
      sm: {
        span: 19,
      },
    },
  },
  onSuccess,
  // requestFunction = net.request.bind(net),
  request,
  onRequestFailed,
  onChange,
  onValidateFailed,
  showFormAlert = false,
  tableProps,
  initValuesFormatter,
  dialogPropsFormatter,
  onBeforeClick = () => Promise.resolve(true),
  ...others
}: FormButtonProps) {
  const modalProps = useMemo(
    () =>
      dialogPropsFormatter ? dialogPropsFormatter(tableProps) : dialogProps,
    [dialogProps, dialogPropsFormatter],
  );
  const [actions, setActions] = useState([]);
  const [dlgVis, setDlgVis] = useState(false);
  const initValues = useMemo(
    () => (initValuesFormatter ? initValuesFormatter(tableProps) : undefined),
    [initValuesFormatter, tableProps, dlgVis],
  );
  const { dataSource, onFinish, title, alertProps, ...otherFormProps } =
    formProps;
  const hideDlg = useCallback(() => {
    onCancel && onCancel();
    setDlgVis(false);
  }, [onCancel]);

  const showDlg = useCallback(() => {
    setDlgVis(true);
    onOpen && onOpen();
  }, [onOpen]);

  const handleFinish = (
    formValue: any,
    currentTarget?: EventTarget,
    response?: any,
  ) => {
    onSuccess && onSuccess(formValue, currentTarget, response);
    onFinish && onFinish(formValue);
    hideDlg();
  };

  useEffect(() => {
    setActions([
      {
        uiType: 'button',
        props: {
          children: '取消',
          onClick: hideDlg,
        },
      },
      {
        uiType: 'submit',
        props: {
          children: '确定',
          type: 'primary',
        },
      },
    ]);
  }, [hideDlg]);

  const ButtonDom = useMemo(() => {
    if (others.hasOwnProperty('to') && others.to === 'null') {
      return null;
    }
    return (
      <Button
        {...others}
        onBeforeClick={() => onBeforeClick(tableProps)}
        onClick={showDlg}
      />
    );
  }, [others]);

  return (
    <>
      {ButtonDom}

      {dlgVis ? (
        <Form
          {...formItemLayout}
          {...otherFormProps}
          initialValues={
            initValues || formProps.value || formProps.initialValues
          }
          name="dialogForm"
          onFinish={handleFinish}
          controls={dataSource}
          actions={actions}
          request={request}
          noContainer
          toastGlobalError
          renderItemList={(controlItems, actionFormItems) => {
            return (
              <Modal
                visible={dlgVis}
                onCancel={hideDlg}
                footer={actionFormItems}
                centered
                {...modalProps}
                className={classNames(
                  'cf-button-form-modal',
                  className,
                  dialogProps?.className,
                )}
              >
                <div className="ss-form-modal-box">
                  {showFormAlert && alertProps && (
                    <Alert showIcon {...alertProps} />
                  )}
                  {controlItems}
                </div>
              </Modal>
            );
          }}
        />
      ) : null}
    </>
  );
}
