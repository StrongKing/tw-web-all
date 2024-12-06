import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import { Modal, ModalProps } from 'antd';
import classNames from 'classnames';
import ComposeForm, { CFFormProps } from '@/components/compose-form';
import { CFFormActionProps } from '../compose-form/interface';
import EventEmitter from '../compose-form/events';

export interface ConfirmFormProps {
  formProps: CFFormProps;
  dialogProps: ModalProps;
  topExtra?: ReactNode;
  bottomExtra?: ReactNode;
  cancelBtnText?: string;
  confirmBtnText?: string;
  destroy: () => void;
  eventBus: EventEmitter;
  onConfirm?: (formValue: any) => any;
  onCancel?: () => void;
}
export interface FormConfirmConfig {
  formProps: CFFormProps;
  dialogProps: ModalProps;
  topExtra?: ReactNode;
  bottomExtra?: ReactNode;
  cancelBtnText?: string;
  confirmBtnText?: string;
  onCancel?: () => void;
  onConfirm?: (formValue: any) => any;
}
const ConfirmForm = ({
  formProps,
  dialogProps,
  topExtra,
  bottomExtra,
  cancelBtnText = '取消',
  confirmBtnText = '确定',
  eventBus,
  destroy,
  onConfirm,
  onCancel,
}: ConfirmFormProps) => {
  const {
    labelCol = {
      xs: {
        span: 19,
      },
      sm: {
        span: 5,
      },
    },
    wrapperCol = {
      xs: {
        span: 19,
      },
      sm: {
        span: 19,
      },
    },

    ...otherFormProps
  } = formProps;
  const [loading, setLoading] = useState(false);
  const [visible] = useState(true);
  const beforeSumbmit = (formValue: any) => {
    const promise = onConfirm && onConfirm(formValue);
    if (promise instanceof Promise) {
      setLoading(true);
      promise
        .then((flag) => {
          if (typeof flag === 'undefined' || !!flag) {
            destroy();
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (promise !== false) {
      destroy();
    }
    return Promise.resolve(false);
  };
  const [top, setTop] = useState(topExtra);
  const [bottom, setBottom] = useState(bottomExtra);
  useEffect(() => {
    eventBus.subscribe(
      'update',
      (obj: { topExtra?: ReactNode; bottomExtra?: ReactNode }) => {
        if (obj.topExtra) {
          setTop(obj.topExtra);
        }
        if (obj.bottomExtra) {
          setBottom(obj.bottomExtra);
        }
      },
    );
    return () => {
      eventBus.remove();
    };
  }, []);
  const actions = useMemo<CFFormActionProps[]>(
    () => [
      {
        uiType: 'button',
        props: {
          children: cancelBtnText,
          onClick: () => {
            destroy();
            onCancel && onCancel();
          },
        },
      },
      {
        uiType: 'submit',
        props: {
          children: confirmBtnText,
          type: 'primary',
          'data-submit-action': 'submit',
          customLoading: loading,
        },
      },
    ],
    [cancelBtnText, confirmBtnText, loading],
  );
  return (
    <ComposeForm
      labelCol={labelCol}
      wrapperCol={wrapperCol}
      {...otherFormProps}
      initialValues={formProps.value || formProps.initialValues}
      name="dialogForm"
      beforeSubmit={beforeSumbmit}
      noContainer
      actions={actions}
      renderItemList={(controlItems, actionFormItems) => {
        return (
          <Modal
            visible={visible}
            onCancel={() => {
              destroy();
              onCancel && onCancel();
            }}
            footer={actionFormItems}
            {...dialogProps}
            className={classNames(
              'cf-button-form-modal',
              dialogProps?.className,
            )}
          >
            {top}
            {controlItems}
            {bottom}
          </Modal>
        );
      }}
    />
  );
};
const FormConfirm = ({ ...config }: FormConfirmConfig) => {
  const container = document.createDocumentFragment();
  const eventBus = new EventEmitter();
  const destroy = () => {
    ReactDOM.unmountComponentAtNode(container);
    eventBus.remove();
  };
  const update = (obj: { topExtra?: ReactNode; bottomExtra?: ReactNode }) => {
    eventBus.dispatch('update', obj);
  };
  ReactDOM.render(
    <ConfirmForm {...config} eventBus={eventBus} destroy={destroy} />,
    container,
  );
  return {
    update,
    destroy,
  };
};
export default FormConfirm;
