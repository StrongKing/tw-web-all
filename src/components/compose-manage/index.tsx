// compose manage component
// @author Pluto <huarse@gmail.com>
// @create 2020/06/21 20:58

import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
  useContext,
  useLayoutEffect,
  ForwardedRef,
} from 'react';
import { FormInstance } from 'antd/lib/form';
import { ConfigProvider, Tooltip } from 'antd';
// import { QuestionCircleFilled } from '@ant-design/icons';
import { QueryFilterProps } from '@ant-design/pro-form';
import { QueryFilter } from '@ant-design/pro-form';
import type { ProFormInstance } from '@ant-design/pro-components';
import { logger } from '@irim/saber';
import ActionButton from '../button';
import { Request } from '../interface';
import useRequest from '@/common/use-request';
import get from 'lodash/get';
// @ts-ignore
import Table from '@/components/table';
import FilterItem from './filter-item';
import NoticeSection from './notice-section';
import { PropTypes } from './interface';
import { ColumnItemProps } from './interface';
import Sort from './sort';
import moment from 'dayjs';
import './index.less';
import { Store } from 'antd/lib/form/interface';
import { BaseFormProps } from '@ant-design/pro-form/lib/BaseForm';
import emptySVG from './empty_02.svg';
import { ComposeTreeContext } from '../compose-tree';

const ComposeManage = forwardRef(
  (
    {
      alertProps,
      dataRequest,
      dataFormatter,
      searchDataFormatter,
      filterProps = [],
      filterComsMap = {},
      filterLabelWidth = 80,
      // filterSpan = 8,
      synchValues = null,
      tableProps,
      sortProps,
      removeResetButton = false,
      filterClassName = 'ss-query-filter',
      tooltip,
      buttonList = [],
      onSearchChange,
      onRequestSuccess,
      onEmit,
      initialFilterValues = {},
      isCacheListFilter = true,
      emptyText = '暂无数据',
      staticDataSource = [],
      staticFilter = () => true,
      staticSearch = () => {},
      outerLoading = false,
      captionRight,
      defaultCollapsed = true,
    }: PropTypes,
    ref: ForwardedRef<any>,
  ) => {
    const [collapsed, setCollapsed] = useState(defaultCollapsed);
    // 定义data数据
    const [pageData, setPageData] = useState([]);
    // 定义Table的数据源
    const [tableSource, setTableSource] = useState(staticDataSource);
    const staticDataSourceCache = useRef(staticDataSource);
    const [sortTable, setSortTable] = useState(null);
    // 定义pageSize
    const [pageSize, setPageSize] = useState(
      isCacheListFilter && window.history.state?.cacheListPageSize
        ? window.history.state?.cacheListPageSize
        : get(
            tableProps,
            'pagination.pageSize',
            dataRequest?.params?.pageSize || 20,
          ),
    );
    // 当前页码
    const [pageNo, setPageNo] = useState(
      isCacheListFilter ? window.history.state?.cacheListPageNo ?? 1 : 1,
    );
    useEffect(() => {
      if (isCacheListFilter) {
        window.history.replaceState(
          { ...(window.history.state ?? {}), cacheListPageNo: pageNo },
          '',
        );
      }
    }, [pageNo]);
    useEffect(() => {
      if (isCacheListFilter) {
        window.history.replaceState(
          { ...(window.history.state ?? {}), cacheListPageSize: pageSize },
          '',
        );
      }
    }, [pageSize]);
    // 总数据条数
    const [total, setTotal] = useState(staticDataSource.length);
    // 查询条件
    const [search, setSearch] = useState<any>({
      ...initialFilterValues,
      ...(isCacheListFilter ? window.history.state?.cacheListFilter ?? {} : {}),
    });
    // Table组件的checkbox的选择值集合
    const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
    const selectedRowKeysRef = useRef<any[]>([]);
    const selectedRowsRef = useRef<any[]>([]);
    const [t, setT] = useState(Date.now());
    // 使用lodash.get从dataRequest读取method属性，如果读不到，默认使用'GET'
    const method = get(dataRequest, ['method'], 'GET');
    const isUnfold = get(dataRequest, ['isUnfold'], false);
    const searchKey = get(dataRequest, ['searchKey'], 'search');
    const pageNoKey = get(dataRequest, ['pageNoKey'], 'pageNo');
    const pageSizeKey = get(dataRequest, ['pageSizeKey'], 'pageSize');
    const dataSourceKey = get(dataRequest, ['dataSourceKey'], 'dataSource');
    const formRef = useRef<ProFormInstance>(); // 搜索框表单实力
    const manageRef = useRef<HTMLDivElement>(null);

    // 请求
    const getSearch = (val: any = {}) => {
      let search = { ...val };
      search =
        method.toUpperCase() === 'GET' || isUnfold
          ? search
          : { [searchKey]: search };

      if (searchDataFormatter) {
        search = searchDataFormatter(search);
      }
      return search;
    };
    const [, loading] = useRequest(
      dataRequest,
      {
        data: {
          ...getSearch(search),
          [pageNoKey]: pageNo,
          [pageSizeKey]: pageSize,
        },
        showError: true,
        _t: t,
      },
      dataFormatter,
      (data) => {
        // 从 data 中得到 dataSource 数据
        const nextDataSource = get(data, dataSourceKey, []);
        setPageData(data);
        setTableSource(nextDataSource);

        // setSelectedRowKeys([]);
        setTotal(
          tableProps?.total ||
            data?.pagination?.total ||
            nextDataSource?.length ||
            0,
        );
        onRequestSuccess && onRequestSuccess(data);
        // 兼容边界条件：如果删除了某一页的唯一一行，则将分页切回上一页 (第一页)
        if (pageNo > 1 && nextDataSource?.length === 0) {
          setPageNo(1);
          setT(Date.now());
        }
      },
      false,
    );

    if (sortProps && sortProps?.sortRequest) {
      useRequest(
        sortProps?.sortRequest,
        {
          data: {
            // 如果是 get 请求，平铺 search
            ...(method.toUpperCase() === 'GET'
              ? search || {}
              : { [searchKey]: search }),
            [pageNoKey]: pageNo,
            [pageSizeKey]: pageSize,
          },
          showError: true,
          _t: t,
        },
        dataFormatter,
        (data) => {
          // 从 data 中得到 dataSource 数据
          const nextDataSource = get(data, dataSourceKey, []);
          setSortTable(nextDataSource);
        },
      );
    }

    useEffect(() => {
      onSearchChange && onSearchChange(search);
    }, [onSearchChange, search]);

    // 执行分页的逻辑;
    const handlePageChange = (nextPage: number, pageSize: number) => {
      setPageNo(nextPage);
      setPageSize(pageSize);
    };

    // 执行查询的逻辑;
    const handleSearch = (values: Store = {}) => {
      filterProps?.map((item) => {
        if (item.type === 'datepicker') {
          values[item.name] = values[item.name]
            ? moment(values[item.name]).format(item.props._format)
            : '';
        }

        if (item.type === 'dateRangePicker') {
          values[item.name] = values[item.name]?.length
            ? [
                values[item.name][0]
                  ? moment(values[item.name][0]).format(
                      item.props?.format || 'YYYY-MM-DD',
                    )
                  : null,
                values[item.name][1]
                  ? moment(values[item.name][1]).format(
                      item.props?.format || 'YYYY-MM-DD',
                    )
                  : null,
              ]
            : [];
        }

        if (item.type === 'dateTimeRangePicker') {
          if (values[item.name]) {
            values[item.name] = [
              moment(values[item.name][0]).format(item.props?.format),
              moment(values[item.name][1]).format(item.props?.format),
            ];
          }
        }
      });
      let newSearch = values;

      // 判断是需要同步
      if (synchValues) {
        newSearch = { ...values, ...search };
      }

      if (
        JSON.stringify(search) === JSON.stringify(newSearch) &&
        pageNo === 1
      ) {
        setT(Date.now());
      }
      setPageNo(1);
      setSearch(newSearch);
      if (isCacheListFilter) {
        window.history.replaceState(
          {
            ...(window.history.state ?? {}),
            cacheListFilter: { ...newSearch },
          },
          '',
        );
      }

      if (!dataRequest && typeof staticFilter === 'function') {
        const newData = staticDataSourceCache.current.filter(
          (el: any, i: number) => staticFilter(newSearch, el, i),
        );
        setTableSource([...newData]);
        setTotal(newData.length);
      }
      if (!dataRequest && typeof staticSearch === 'function') {
        staticSearch(newSearch);
      }

      return Promise.resolve();
    };

    const handleReset = () => {
      if (
        JSON.stringify(search) === JSON.stringify(initialFilterValues) &&
        pageNo === 1
      ) {
        setT(Date.now());
      }
      setPageNo(1);
      setSearch(initialFilterValues);
      if (isCacheListFilter) {
        window.history.replaceState(
          {
            ...(window.history.state ?? {}),
            cacheListFilter: { ...initialFilterValues },
          },
          '',
        );
      }
      formRef.current.resetFields(); // 重置搜索框中表单
      formRef.current.setFieldsValue(initialFilterValues);

      if (!dataRequest && typeof staticSearch === 'function') {
        staticSearch(initialFilterValues);
      }
      // return Promise.resolve();
    };

    // 批量操作;
    const handleRequestButtonSuccess = useCallback(() => {
      setT(Date.now()); // 触发列表更新
    }, []);

    // 表格事件
    const handleTableEmit = useCallback(
      (eventType: string, record: any, response: any) => {
        logger.debug(`handleTableEmit: ${eventType}`, record, response);

        onEmit && onEmit(eventType, record, response);

        if (eventType === 'refreshTableData') {
          setT(Date.now());
        }
      },
      [],
    );
    // Table组件checkbox的props;
    let rowSelectionProps = {};
    const primaryKey = tableProps?.primaryKey || 'id';
    const { onSelectChange } = tableProps;

    const onSelect = (record: any, selected: boolean, ...args: any) => {
      if (tableProps?.rowSelection?.type === 'radio') {
        selectedRowKeysRef.current = [getKey(record)];
        selectedRowsRef.current = [record];
        setSelectedRowKeys([...selectedRowKeysRef.current]);
      } else if (selected) {
        selectedRowKeysRef.current = [
          ...selectedRowKeysRef.current,
          getKey(record),
        ];
        selectedRowsRef.current = [...selectedRowsRef.current, record];
        setSelectedRowKeys([...selectedRowKeysRef.current]);
      } else {
        selectedRowKeysRef.current = selectedRowKeysRef.current.filter(
          (el) => el !== getKey(record),
        );
        selectedRowsRef.current = selectedRowsRef.current.filter(
          (el) => getKey(el) !== getKey(record),
        );
        setSelectedRowKeys([...selectedRowKeysRef.current]);
      }
      onSelectChange?.(selectedRowKeysRef.current, selectedRowsRef.current);
      tableProps?.rowSelection?.onSelect?.(record, selected, ...args);
    };
    const getKey = (record: any) =>
      typeof primaryKey === 'function'
        ? primaryKey(record)
        : record[primaryKey];
    const onSelectAll = (
      selected: boolean,
      selectedRows: any[],
      changeRows: any[],
    ) => {
      const keys = changeRows.map((el) => getKey(el));
      if (selected) {
        selectedRowKeysRef.current = [...selectedRowKeysRef.current, ...keys];
        selectedRowsRef.current = [...selectedRowsRef.current, ...changeRows];
        setSelectedRowKeys([...selectedRowKeysRef.current]);
      } else {
        selectedRowKeysRef.current = selectedRowKeysRef.current.filter(
          (el) => !keys.includes(el),
        );
        selectedRowsRef.current = selectedRowsRef.current.filter(
          (el) => !keys.includes(getKey(el)),
        );
        setSelectedRowKeys([...selectedRowKeysRef.current]);
      }
      onSelectChange?.(selectedRowKeysRef.current, selectedRowsRef.current);
      tableProps?.rowSelection?.onSelectAll?.(
        selected,
        selectedRows,
        changeRows,
      );
    };

    if (tableProps?.checkable || tableProps?.rowSelection) {
      rowSelectionProps = {
        checkable: true,
        rowSelection: tableProps.rowSelection || {},
        selectedRowKeys,
        primaryKey,
        // onSelectChange: (keys: any[], rows: any[]) => {
        //   setSelectedRowKeys(keys);
        //   onSelectChange && onSelectChange(keys, rows);
        // },
        onSelect,
        onSelectAll,
      };
    }
    // Table组件pagination的props;
    const tablePagination =
      tableProps?.pagination === false
        ? false
        : {
            className: 'cf-compose-manage-pagination',
            total,
            size: 'default',
            current: pageNo,
            pageSize,
            pageSizeOptions: tableProps?.pageSizeOptions || [
              '20',
              '50',
              '100',
              '200',
            ],
            showSizeChanger: total - 20 >= 0,
            showQuickJumper: true,
            ...(tableProps?.pagination as any),
            showTotal: () => {
              return `${
                tooltip ? '' : `共 ${total} 条数据`
              } 第 ${pageNo}/${Math.ceil(total / pageSize)} 页`;
            },
          };

    const formProps: QueryFilterProps & BaseFormProps = useMemo(
      () => ({
        colon: true,
        // layout: 'vertical',
        dateFormatter: false,
        className: `ss-compose-manage-query-filter ${filterClassName || ''}`,
        onFinish: handleSearch,
        onCollapse: (val: boolean) => {
          setCollapsed(val);
        },
        onReset: handleReset,
        labelWidth: filterLabelWidth,
        submitter: {
          resetButtonProps: {
            style: {
              // 隐藏重置按钮
              display: removeResetButton ? 'none' : 'block',
            },
          },
        },
        initialValues: search,
        defaultCollapsed,
      }),
      [search],
    );

    const renderEmpty = () => {
      return (
        <div className="table-empty-style">
          <img src={emptySVG} alt="" />
          <span>{emptyText}</span>
        </div>
      );
    };

    const transformValue = (originText = '') => {
      return originText.toString().replace(/\$\{([\w.]+)\}/g, (matched, $1) => {
        switch ($1) {
          default:
            return get(pageData, $1, matched);
        }
      });
    };

    const tableTitle = () => {
      if (
        (typeof tooltip?.title === 'string' ||
          React.isValidElement(tooltip?.title)) &&
        tooltip?.title
      ) {
        const { title } = tooltip;
        return <div className="manage-tooltip-left">{title}</div>;
      }
      if (typeof tooltip?.title === 'object') {
        const { left, center, right } = tooltip?.title as {
          left?: React.ReactNode;
          center?: React.ReactNode;
          right?: React.ReactNode;
        };
        return (
          <div className="manage-tooltip-left">
            {left}
            <span className="center">{transformValue(center)}</span>
            {right}
          </div>
        );
      }
      return null;
    };
    const { isInTree } = useContext(ComposeTreeContext) || {};
    const [filterSpan, setFilterSpan] = useState(8);
    useLayoutEffect(() => {
      const onResize = () => {
        const width = manageRef.current?.offsetWidth || window.innerWidth;
        if (width > 1344) {
          setFilterSpan(6);
        } else if (width > 1000) {
          setFilterSpan(8);
        } else if (width > 520) {
          setFilterSpan(12);
        } else {
          setFilterSpan(24);
        }
      };
      onResize();
      window.addEventListener('resize', onResize);
      return () => {
        window.removeEventListener('resize', onResize);
      };
    }, []);
    const defaultColsNumber = useMemo(
      () => (24 / filterSpan) * 2,
      [filterSpan],
    );

    const filterLabelWidthStr = useMemo(
      () => (filterLabelWidth === 'auto' ? '' : `0 0 ${filterLabelWidth}px`),
      [filterLabelWidth],
    );

    const updateDataSource = (dataSorce: any[] = []) => {
      setTableSource(dataSorce);
      setTotal(dataSorce.length);
      staticDataSourceCache.current = dataSorce;
    };

    useImperativeHandle(ref, () => ({
      handleReset,
      updateDataSource,
      handleSearch,
    }));

    return (
      <div className="ss-compose-manage-container" ref={manageRef}>
        <NoticeSection
          alertProps={alertProps}
          onRefresh={() => {
            setT(Date.now());
          }}
        />
        {filterProps?.length > 0 && (
          // <div ref={}>
          <QueryFilter
            formRef={formRef}
            {...formProps}
            span={filterSpan}
            defaultColsNumber={defaultColsNumber}
          >
            {filterProps?.map((f, index) => (
              <FilterItem
                key={f.name}
                {...f}
                labelWidth={filterLabelWidthStr}
                externalComsMap={filterComsMap}
                collapsed={collapsed}
                index={index}
                defaultColsNumber={defaultColsNumber}
              />
            ))}
          </QueryFilter>
          // </div>
        )}

        {buttonList.length > 0 && (
          <section className="section-caption">
            <div className="caption-left-side">
              {buttonList.map((btnProps, index) => {
                let {
                  uiType,
                  request,
                  isBatch,
                  buttonProps = {},
                  onSuccess,
                  qrBeforeClick = false,
                  confirmBeforeClick,
                  ...others
                } = btnProps;
                if (
                  index === 0 &&
                  (!btnProps.type || buttonProps.type === 'default')
                ) {
                  buttonProps.type = 'primary';
                } else if (index > 0 && buttonProps.type === 'primary') {
                  delete buttonProps.type;
                }
                if (request) {
                  buttonProps = {
                    ...(buttonProps || {}),
                    disabled: isBatch
                      ? !selectedRowKeys.length
                      : buttonProps?.disabled,
                  };
                  request = {
                    ...(request || {}),
                    params: ['download', 'downloadFe'].includes(uiType)
                      ? {
                          //uiType为download 接口追加搜索字段值

                          ...(request?.params || {}),
                          ...(request?.method.toUpperCase() === 'GET' ||
                          request?.isUnfold
                            ? search || {}
                            : { search }),
                          idList: selectedRowKeys,
                        }
                      : {
                          ...(request?.params || {}),
                          idList: selectedRowKeys,
                          // rowList: selectedRowList || [],
                        },
                  } as Request;

                  // confirm 的占位
                  let nextConfirmBeforeClick = confirmBeforeClick;
                  if (confirmBeforeClick) {
                    const {
                      renderClassName,
                      renderContent,
                      className,
                      content,
                      ...otherConfirmClick
                    } = confirmBeforeClick;

                    nextConfirmBeforeClick = {
                      className:
                        typeof renderContent === 'function'
                          ? renderClassName(request?.params)
                          : className,
                      content:
                        typeof renderContent === 'function'
                          ? renderContent(request?.params)
                          : content,
                      ...otherConfirmClick,
                    };
                  }

                  return (
                    <ActionButton
                      uiType={uiType}
                      key={index}
                      request={request}
                      onSuccess={(...args: any) => {
                        if (isBatch) {
                          selectedRowKeysRef.current = [];
                          selectedRowsRef.current = [];
                          setSelectedRowKeys([]);
                        }
                        onSuccess && onSuccess(...args);
                        handleRequestButtonSuccess();
                      }}
                      qrBeforeClick={qrBeforeClick}
                      isBatch={isBatch}
                      buttonProps={buttonProps}
                      selectedRowKeys={selectedRowKeys}
                      confirmBeforeClick={nextConfirmBeforeClick}
                      {...others}
                    />
                  );
                }
                return (
                  <ActionButton
                    key={index}
                    {...btnProps}
                    qrBeforeClick={qrBeforeClick}
                    isBatch={isBatch}
                    selectedRowKeys={selectedRowKeys}
                    onSuccess={(...args: any) => {
                      if (isBatch) {
                        selectedRowKeysRef.current = [];
                        selectedRowsRef.current = [];
                        setSelectedRowKeys([]);
                      }
                      onSuccess && onSuccess(...args);
                      handleRequestButtonSuccess();
                    }}
                  />
                );
              })}
              {sortProps ? (
                <Sort
                  {...sortProps}
                  primaryKey={primaryKey}
                  dataSource={sortTable || tableSource}
                  tableProps={tableProps}
                  onRefresh={handleRequestButtonSuccess}
                />
              ) : null}
            </div>
            {captionRight && (
              <div className="caption-right-side">{captionRight}</div>
            )}
          </section>
        )}
        {tooltip ? (
          <div className="manage-tooltip">
            {tableTitle()}
            <span className="manage-tooltip-right">共 {total} 条数据</span>
          </div>
        ) : null}
        <ConfigProvider renderEmpty={renderEmpty}>
          <Table
            {...tableProps}
            loading={dataRequest ? loading : outerLoading}
            pagination={tablePagination}
            onPageChange={handlePageChange}
            onShowSizeChange={handlePageChange}
            {...rowSelectionProps}
            onEmit={handleTableEmit}
            comsMap={tableProps?.comsMap}
            primaryKey={tableProps?.primaryKey}
            hasBorder={tableProps?.hasBorder}
            columns={tableProps?.columns}
            dataSource={tableSource || []}
          />
        </ConfigProvider>
      </div>
    );
  },
);

export { ColumnItemProps, PropTypes };

export default ComposeManage;
