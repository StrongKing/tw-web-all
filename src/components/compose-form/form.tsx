/* eslint-disable no-console */
import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from 'react';
import classNames from 'classnames';
import { Form, Alert, message, Spin, Divider } from 'antd';
import { isBoolean, isEqual } from 'lodash';
import net from '@/services/index';
import CFFormItem from '@/components/compose-form/form-item';
import { getComByUiType } from '@/components/compose-form/helper';
import useRequest from '@/common/use-request';
import { CFFormProps, CFFormActionProps, CFFormItemProps } from './interface';
import './form.less';
import EventEmitter from '@/components/compose-form/events';

const { Item: FormItem } = Form;

interface FormSubmitResponse {
  success: boolean;
  msg?: string;
  code?: any;
  data?: any;
}

function CFForm({
  alertProps,
  comsMap = {},
  className,
  controls,
  actions,
  onSubmit,
  request,
  // 用于转化请求传参
  formatParams,
  dataFormatAfterInit,
  customValidateFields,
  dataFormatBeforeSubmit,
  beforeSubmit,
  initialValuesRequest,
  groupIdRequest,
  onFinish,
  onError,
  initialValuesRequestSuccess,
  onValuesChange = () => {},
  renderItemList,
  disableSubmitWhenUnChanged = true,
  showActionInPageFooter = false,
  title,
  toastGlobalError,
  value,
  initialValues,
  noContainer,
  labelCol = {
    xs: { span: 19 },
    sm: { span: 3 },
  },
  wrapperCol = {
    xs: { span: 19 },
    sm: { span: 19 },
  },
  comparision,
  ...others
}: CFFormProps) {
  // 标识 form 原始的值，用于配合 disableSubmitWhenUnChanged 属性判断是否要禁用提交。
  const initialValuesRef = useRef<any>(initialValues);
  const [formValues, setFormValues] = useState(initialValues);
  const [globalError, setGlobalError] = useState(null);
  const [submitLoadGoBack, setSubmitLoadGoBack] = useState(false);
  const [submitLoadRefresh, setSubmitLoadRefresh] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(
    !!disableSubmitWhenUnChanged,
  );
  const [form] = Form.useForm();
  const eventEmitter = useRef<EventEmitter>(new EventEmitter());
  const [comparisionValues, setComparisionValues] = useState(
    comparision?.init?.values || {},
  );

  const comparisionConfig = useMemo(() => {
    return {
      enable: !!comparision,
      name: 'source',
      color: '#f67d00',
      showFormatter: (val: any) => `(送审：${val})`,
      ...comparision,
      init: {
        valueFormatter: (val: any) => val,
        ...(comparision || {}),
      },
    };
  }, [comparision]);
  const updateConparisionVal = async (val: any) => {
    if (comparisionConfig.enable) {
      const comparisionVals = await comparisionConfig.init.valueFormatter(
        val?.[comparisionConfig.name],
        val,
      );
      setComparisionValues(comparisionVals);
    }
  };
  useEffect(() => {
    if ((controls || []).some((_) => _.name === 'nodeName')) {
      console.error(
        'Compose Form',
        '表单项的名称不能为 nodeName，否则提交会出问题。',
      );
    }
  }, [controls]);

  useEffect(() => {
    // 如果组件非受控，则在初始化时将 initialValues 设置为表单初始值
    if (value === undefined) {
      updateConparisionVal(initialValues);
      form.setFieldsValue(initialValues);
      setFormValues(initialValues);
      initialValuesRequestSuccess && initialValuesRequestSuccess(eventEmitter);
    }
  }, []);

  useEffect(() => {
    // 如果组件受控，则受控同步 form 的值
    if (value !== undefined) {
      updateConparisionVal(value);
      form.setFieldsValue({ ...form.getFieldsValue(), ...value });
      setFormValues({ ...form.getFieldsValue(), ...value });
    }
  }, [value]);
  // 请求
  const {
    url,
    params = {},
    data: _data = {},
    search = {},
    ...otherParams
  } = initialValuesRequest || {};
  // 具体请求

  const [, formLoading] = useRequest(
    initialValuesRequest,
    {
      ...otherParams,
      showError: true,
      data: { ...params, ..._data },
      search: { ...params, ...search },
    },
    null,
    // 相应回调
    async (data) => {
      let initialFormValue = data?.formValue || data;
      let remoteData = null;
      if (dataFormatAfterInit) {
        initialFormValue = await dataFormatAfterInit(initialFormValue || {});
      }
      if (groupIdRequest) {
        const res = await net.request(groupIdRequest?.url, {
          method: 'GET',
          data: groupIdRequest?.params,
        });
        remoteData = res.data;
      }
      if (remoteData) {
        const newObj: any = {};
        for (const i of remoteData) {
          const itemName = i.formName;
          const findItem = controls.find((item) => item.name === itemName);

          if (findItem) {
            newObj[itemName] = i.groupId;
          }
        }
        initialFormValue = await { ...initialFormValue, ...newObj };
      }

      if (initialValuesRequest) {
        await updateConparisionVal(initialFormValue);
        form.setFieldsValue(initialFormValue);
        setFormValues(initialFormValue);
      }
      initialValuesRequestSuccess && initialValuesRequestSuccess(eventEmitter);
      initialValuesRef.current = form.getFieldsValue();
    },
  );
  // 表单提交
  const handleSubmit = async (submitEvt: Event): Promise<void> => {
    const { currentTarget } = submitEvt;
    setGlobalError(null);

    if (!request) {
      // 校验表单
      try {
        await form.validateFields();
      } catch (e) {
        console.log('form valid error', e);
        return;
      }

      let formValue = form.getFieldsValue();

      // 如果有dataFormatBeforeSubmit这个函数，先在提交之前将数据处理一下，不然之间用表单数据
      formValue = dataFormatBeforeSubmit
        ? await dataFormatBeforeSubmit(formValue)
        : formValue;

      if (beforeSubmit) {
        const couldSubmit = await beforeSubmit(formValue);
        if (!couldSubmit) {
          return;
        }
      }
      onValuesChange('submit', formValue, form.setFieldsValue, form);
      onSubmit && onSubmit(formValue, currentTarget);
      onFinish && onFinish(form, currentTarget);
      return;
    }

    // 校验表单
    try {
      await form.validateFields();
    } catch (e) {
      console.log('form valid error', e);
      return;
    }
    // debugger;
    const isGoBack = currentTarget?.dataset?.submitAction === 'goBack';
    isGoBack ? setSubmitLoadGoBack(true) : setSubmitLoadRefresh(true);
    setSubmitDisabled(true);
    try {
      // 获取表单数据
      let formValue = form.getFieldsValue();

      if (customValidateFields) {
        const shouldNext = customValidateFields(formValue);
        if (!shouldNext) {
          isGoBack ? setSubmitLoadGoBack(false) : setSubmitLoadRefresh(false);
          return;
        }
      }

      // 如果有dataFormatBeforeSubmit这个函数，先在提交之前将数据处理一下，不然之间用表单数据
      formValue = dataFormatBeforeSubmit
        ? await dataFormatBeforeSubmit(formValue)
        : formValue;

      // console.log('submit', formValue);
      // 如果有beforeSubmit，也执行
      if (beforeSubmit) {
        const couldSubmit = await beforeSubmit(formValue);
        if (!couldSubmit) {
          isGoBack ? setSubmitLoadGoBack(false) : setSubmitLoadRefresh(false);
          return;
        }
      }

      onSubmit && onSubmit(formValue, currentTarget);
      // 发送请求
      const response = await net.request(request.url, {
        method: request.method,
        data: formatParams
          ? formatParams({ ...formValue, ...request?.params })
          : { ...formValue, ...request?.params },
        formatter: request?.formatter,
        showError: false,
      });
      // button form 的场景不需要复杂的报错提示
      if (response?.code == 200 || response?.code == 0) {
        // 更新缓存值
        initialValuesRef.current = form.getFieldsValue();
        // disableSubmitIfPossible();
        const { successMsg } = request || {};
        const msg = successMsg
          ? isBoolean(successMsg)
            ? response?.msg
            : successMsg
          : '操作成功';
        message.success(msg, 1, () => {
          onFinish && onFinish(form, currentTarget, response);
        });
      } else {
        handleSubmitError(response);
      }
    } catch (e) {
      console.log(e);
      message.error(e.message || '操作失败');
    } finally {
      setTimeout(() => {
        isGoBack ? setSubmitLoadGoBack(false) : setSubmitLoadRefresh(false);
        setSubmitDisabled(false);
      }, 2000);
    }
  };
  // 表单处理
  const handleFormChange = (changedValue: any, formValue: any) => {
    onValuesChange(changedValue, formValue, form.setFieldsValue, form);
    setFormValues(form.getFieldsValue());
    disableSubmitIfPossible();
  };

  // 当 disableSubmitWhenUnChanged 为 true 时，如果表单值与初始值一样，则禁用提交
  const disableSubmitIfPossible = useCallback(() => {
    let _submitDisabled = false;
    if (
      disableSubmitWhenUnChanged &&
      isEqual(form.getFieldsValue(), initialValuesRef.current)
    ) {
      _submitDisabled = true;
    }
    setSubmitDisabled(_submitDisabled);
  }, [initialValuesRef.current, disableSubmitWhenUnChanged]);
  // 提交表单后，错误提示的处理
  const handleSubmitError = (response?: FormSubmitResponse) => {
    const { msg } = response || {};
    onError && typeof onError === 'function' && onError(response);
    // 如果后端什么错误信息都没返回，则弹层报错
    if (!msg) {
      message.error('请求异常，请稍后再试。');
      return;
    }
    if (toastGlobalError) {
      if (/<br\s*\/>/.test(msg)) {
        message.warning({
          content: (
            <div
              dangerouslySetInnerHTML={{
                __html: msg,
              }}
            />
          ),
          type: 'warning',
          className: 'custom-antd-message',
          duration: 6,
        });
      } else {
        message.error(msg || globalError);
      }
    } else {
      setGlobalError(msg || globalError);
    }
  };
  // 渲染Form组件里的FormItem
  const renderItem = (
    { comparision: itemComparision, ...config }: CFFormItemProps,
    index: number,
  ) => {
    return (
      <CFFormItem
        key={`cf-form-item-${config.name || index}`}
        {...config}
        externalComsMap={comsMap}
        index={index}
        form={form}
        emitter={eventEmitter.current}
        comparision={{
          ...comparisionConfig,
          enable: itemComparision?.enable ?? comparisionConfig.enable,
          showBottom: itemComparision?.showBottom ?? true,
          showFormatter:
            itemComparision?.showFormatter ?? comparisionConfig.showFormatter,
          value: comparisionValues?.[config.name],
        }}
        comparisionValues={comparisionValues}
        currFieldValue={formValues?.[config.name]}
      />
    );
  };
  // 渲染一些有执行逻辑的组件
  const renderAction = (config: CFFormActionProps, index: number) => {
    const { uiType = 'submit', props } = config;
    const Com = getComByUiType(uiType, comsMap);
    const comProps = { ...props };

    switch (uiType) {
      case 'submit':
        // @ts-ignore
        comProps.onClick = handleSubmit;
        comProps.loading = comProps?.customLoading
          ? comProps?.customLoading
          : props['data-submit-action'] === 'goBack'
          ? submitLoadGoBack
          : submitLoadRefresh;
        comProps.disabled = !comProps?.customDisabled
          ? comProps?.customDisabled
          : comProps.loading
          ? false
          : submitDisabled;
        break;
      case 'confirmSubmit':
        // @ts-ignore
        comProps.onOk = handleSubmit;
        comProps.loading =
          props['data-submit-action'] === 'goBack'
            ? submitLoadGoBack
            : submitLoadRefresh;
        comProps.disabled = comProps.loading ? false : submitDisabled;
        break;
      case 'reset':
        comProps.onClick = () => {
          form.setFieldsValue(initialValuesRef.current);
          setFormValues(initialValuesRef.current);
        };
        break;
      default:
        break;
    }

    return <Com key={`action-${index}`} {...comProps} />;
  };

  const formItemNodes = useMemo(
    () => (controls || []).map(renderItem),
    [controls, comsMap, comparisionValues],
  );
  const formActionNodes = useMemo(
    () => (actions || []).map(renderAction),
    [actions, submitLoadGoBack, submitLoadRefresh, submitDisabled],
  );

  return (
    <div
      className={classNames(
        `${
          noContainer
            ? 'cf-compose-form-container no-container'
            : 'cf-compose-form-container'
        }`,
      )}
    >
      {title ? (
        <div className="cf-compose-form-title">
          <span>{title}</span>
          <Divider />
        </div>
      ) : null}
      {alertProps && <Alert showIcon closable {...alertProps} />}
      {!toastGlobalError && globalError && (
        <Alert
          type="error"
          closable
          showIcon
          message={
            <div
              dangerouslySetInnerHTML={{
                __html: globalError,
              }}
            />
          }
        />
      )}
      <Spin delay={500} spinning={formLoading}>
        <Form
          form={form}
          className={classNames('cf-compose-form', className)}
          labelCol={labelCol}
          wrapperCol={wrapperCol}
          {...others}
          onValuesChange={handleFormChange}
        >
          {renderItemList(
            formItemNodes,
            !showActionInPageFooter && formActionNodes.length ? (
              <FormItem
                className="cf-form-action"
                wrapperCol={
                  others.labelCol
                    ? {
                        offset: others.labelCol.span,
                        ...(others.wrapperCol || {}),
                      }
                    : null
                }
              >
                {formActionNodes}
              </FormItem>
            ) : null,
          )}
        </Form>
        {showActionInPageFooter && formActionNodes ? (
          <div className={classNames('fixedActionWrapper', 'cf-form-action')}>
            {formActionNodes}
          </div>
        ) : null}
      </Spin>
    </div>
  );
}

export default CFForm;
