import { mapProps } from 'recompose';
import get from 'lodash/get';
import { ButtonList, PropTypes as ButtonProps } from '@/components/button';
import { TableCellProps } from '../interface';

export interface TableButtonListPropTypes {
  dataSource: Array<
    {
      refreshAfterRequest?: boolean;
      refreshAfterRequestErrorCode?: number | null | boolean;
      disabled: boolean | { (tableCellProps: TableCellProps): boolean };
    } & ButtonProps
  >;
}

export type PropTypes = TableButtonListPropTypes & TableCellProps;

// 装配单元格
const withTableButtonFeatures = mapProps(
  ({
    dataSource,
    tableProps,
    value,
    // onError,
    ...others
  }: PropTypes) => {
    const { primaryKey, onTableEmit, index, record } = tableProps;

    const primaryValue = record[primaryKey];

    // 替换文案中的占位符
    const replacePlaceholder = (originText = '') => {
      if (typeof originText === 'function') {
        return originText(tableProps);
      }

      return originText.replace(/\$\{([\w.]+)\}/g, (matched, $1) => {
        switch ($1) {
          case 'id':
            return primaryValue;
          // ${value} 替换为单元格的值
          case 'value':
            return value;
          // ${value} 替换为单元格的值
          case 'index':
            return index;
          default:
            return get(tableProps, $1, matched);
        }
      });
    };
    const nextDataSource = dataSource.map(
      ({
        refreshAfterRequest,
        refreshAfterRequestErrorCode,
        to,
        confirmBeforeClick,
        request,
        formProps,
        onSuccess,
        uiType,
        batchProps,
        buttonProps,
        disabledKey,
        disabledValue,
        disabledExpress,
        requestParamsFormatter,
        ...btnProps
      }) => {
        // 抛出事件，触发 manage 页面刷新
        let nextOnSuccess = onSuccess;
        if (refreshAfterRequest) {
          nextOnSuccess = (result: any, params: any) => {
            onTableEmit('refreshTableData', result);
            onSuccess && onSuccess(result, params);
          };
        }
        let nextOnError = formProps?.onError;
        if (typeof refreshAfterRequestErrorCode !== 'undefined') {
          nextOnError = (response: any) => {
            if (
              response?.code === refreshAfterRequestErrorCode ||
              refreshAfterRequestErrorCode === true
            ) {
              onTableEmit('refreshTableData');
            }
            if (
              formProps?.onError &&
              typeof formProps?.onError === 'function'
            ) {
              formProps?.onError(response);
            }
          };
        }
        // confirm 的占位
        let nextConfirmBeforeClick = confirmBeforeClick;
        if (confirmBeforeClick) {
          const {
            renderClassName,
            renderContent,
            className,
            title,
            content,
            ...others
          } = confirmBeforeClick;

          nextConfirmBeforeClick = {
            className:
              typeof renderContent === 'function'
                ? renderClassName(tableProps)
                : className,
            title: replacePlaceholder(title),
            content:
              typeof renderContent === 'function'
                ? renderContent(tableProps)
                : typeof content === 'string'
                ? replacePlaceholder(content)
                : content,
            ...others,
          };
        }

        // 装配请求参数，替换 url 中的 ${id}，在 params 中装配 id 和 idList
        function produceRequest(reqConfig) {
          if (!reqConfig) return reqConfig;
          const { url, params, idName = 'id', ...otherReqConfig } = reqConfig;

          // 注入的请求参数
          const data = {
            // 主键
            [idName]: primaryValue,
            // 行内容
            rowData: record,
            // 兼容单个操作和批量操作走同一接口的场景
            idList: [primaryValue],
            ...(params || {}),
            ...(requestParamsFormatter
              ? requestParamsFormatter(tableProps)
              : {}),
          };
          return {
            ...otherReqConfig,
            url: replacePlaceholder(url),
            params: data,
            // formatter: () => reqConfig.formatter && reqConfig.formatter(record)
          };
        }

        function disabled() {
          if (typeof disabledValue === 'object') {
            return disabledValue.indexOf(record[disabledKey]) > -1;
          }

          if (disabledExpress) {
            return disabledExpress(record);
          }

          return record[disabledKey] === disabledValue;
        }

        // console.log(buttonProps, 'buttonProps');

        const nextButtonProps = {
          type: 'link',
          ...(buttonProps || {}),
          disabled: disabledKey || disabledExpress ? disabled() : false,
        };

        // 导入导出封装，后续考虑换成洋葱模型
        let nextBatchProps = batchProps;
        if (uiType === 'batch') {
          const { uploadProps, downloadProps, ...otherBatchProps } = batchProps;
          nextBatchProps = {
            uploadProps: {
              ...uploadProps,
              request: produceRequest(uploadProps.request),
            },
            downloadProps: {
              ...downloadProps,
              request: produceRequest(downloadProps.request),
            },
            ...otherBatchProps,
          };
        }
        return {
          ...btnProps,
          uiType,
          buttonProps: nextButtonProps,
          to: replacePlaceholder(to),
          confirmBeforeClick: nextConfirmBeforeClick,
          onSuccess: nextOnSuccess,
          request: request && produceRequest(request),
          batchProps: nextBatchProps,
          tableProps,
          formProps: formProps && {
            ...formProps,
            request: formProps.request && produceRequest(formProps.request),
            initialValuesRequest:
              formProps.initialValuesRequest &&
              produceRequest(formProps.initialValuesRequest),
            onError: nextOnError,
            dataFormatAfterInit: formProps.dataFormatAfterInit
              ? (...args: any[]) => {
                  return formProps.dataFormatAfterInit(...args, record);
                }
              : formProps.dataFormatAfterInit,
          },
        };
      },
    );
    return {
      maxItems: 4,
      ...others,
      noMargin: true,
      dataSource: nextDataSource,
    };
  },
);

export default withTableButtonFeatures(ButtonList);
