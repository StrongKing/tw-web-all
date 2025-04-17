/* eslint-disable no-unused-expressions */
import React, {
  useCallback,
  useMemo,
  Suspense,
  useEffect,
  useRef,
  useState,
  useContext,
  createContext,
} from 'react';
import { Table, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import Spin from '../loading';
import defaultComsMap, { UnSupport } from './coms-map';
import { TableCellProps, PropTypes, ColumnItemProps } from './interface';
import './index.less';

const cellRenderer = ({
  comsMap,
  uiType,
  tableDataSource,
  name,
  props = {},
  onEmit,
  primaryKey = 'id',
  comparision,
}: PropTypes &
  ColumnItemProps & {
    tableDataSource: any[] | undefined;
    onEmit: (
      eventName: string,
      index?: number,
      record?: any,
      ...args: any[]
    ) => void;
  }) => {
  const Com = comsMap[uiType] || defaultComsMap[uiType] || UnSupport;

  return (value: any, record: any, index: any) => {
    comparision.value = comparision.enable
      ? typeof comparision.valueFormatter === 'function'
        ? comparision.valueFormatter(
            record?.[comparision.name]?.[name],
            record?.[comparision.name],
            record,
          )
        : record?.[comparision.name]?.[name]
      : undefined;
    return (
      <Suspense fallback={<div>2</div>}>
        <Com
          className={classNames(`cf-table-col-${uiType}`, props.cellClassName)}
          {...props}
          value={value}
          tableProps={{
            primaryKey,
            onEmit: (eventName: any, ...args: any) => {
              onEmit(`${name}.${eventName}`, index, record, ...args);
            },
            onTableEmit: (eventName: any, ...args: any) => {
              onEmit(eventName, ...args);
            },
            tableDataSource,
            uiType,
            index,
            record,
            name,
            comparision,
          }}
          comparision={comparision}
        />
      </Suspense>
    );
  };
};

export default function CFTable({
  columns,
  dataSource,
  cellClassName,
  comsMap,
  checkable,
  selectedRowKeys,
  onSelectAll,
  onSelect,
  primaryKey,
  onPageChange,
  onEmit,
  scroll,
  size = 'small',
  virtuallistParams = null,
  fixFirstColumn = true,
  scrollTableRef,
  comparision,
  ...others
}: PropTypes & {
  onPageChange: (current: any, size: any) => void;
  onEmit: () => void;
  selectedRowKeys: any[];
  onSelectAll: (
    selected: boolean,
    selectedRows: any[],
    changeRows: any[],
  ) => void;
  onSelect: (record: any, selected: boolean, selectedRows: any[]) => void;
}) {
  const comparisionConfig = useMemo(() => {
    return {
      enable: !!comparision,
      name: 'src',
      color: '#f67d00',
      showFormatter: (val: any) => `(审价：${val})`,
      ...(comparision || {}),
    };
  }, [comparision]);
  const renderColumn = (
    {
      name,
      label,
      width,
      uiType,
      className,
      props,
      cell,
      render,
      help,
      fixed,
      children = [],
      comparision: itemComparision,
      ...others
    }: ColumnItemProps,
    colIndex: number,
  ) => {
    if (typeof cell !== 'function' && typeof render !== 'function') {
      cell = cellRenderer({
        comsMap,
        uiType: uiType || 'text',
        name,
        props,
        onEmit,
        primaryKey,
        tableDataSource: dataSource,
        children,
        comparision: {
          ...comparisionConfig,
          enable: itemComparision?.enable ?? comparisionConfig.enable,
        },
      });
    }
    let _fixed = fixed;

    // 如果列数大于 2，则根据配置锁定第一列
    if (!_fixed && columns.length > 2) {
      if (fixFirstColumn && colIndex === 0) {
        _fixed = 'left';
      }
    }

    // 操作列永久固定
    if (name === 'operation' || label === '操作' || uiType === 'buttonList') {
      _fixed = 'right';
    }
    if (!dataSource || !dataSource.length) {
      // 如果数据源为空，则取消 fixed，不然 antd 的 table 的「数据为空」的展示会异常
      _fixed = undefined;
    }
    return (
      <Table.Column
        {...others}
        dataIndex={name}
        key={name}
        title={
          <span>
            {label || name}
            {help ? (
              <Tooltip
                className="cf-table-header-help"
                placement="top"
                title={help}
              >
                <QuestionCircleOutlined />
              </Tooltip>
            ) : null}
          </span>
        }
        fixed={_fixed}
        width={width || ''}
        render={cell || render}
        className={classNames('cf-table-cell', className)}
      >
        {children.map(renderColumn)}
      </Table.Column>
    );
  };

  const renderLoading = useCallback((props: any) => {
    return <Spin delay={500} {...props} />;
  }, []);

  let { rowSelection = {}, pagination = {} } = others;
  if (pagination) {
    pagination.onChange = (pageNo: number, pageSize: number) => {
      onPageChange && onPageChange(pageNo, pageSize);
    };
    pagination.onShowSizeChange = (current: number, size: number) => {
      onPageChange && onPageChange(current, size);
    };
  }
  if (!checkable) {
    rowSelection = null;
  } else {
    rowSelection = {
      ...rowSelection,
      selectedRowKeys,
      // onChange(nextSelectedRowKeys: any[], nextSelectedRows: any[]) {
      //   onSelectChange && onSelectChange(nextSelectedRowKeys, nextSelectedRows);
      // },
      onSelectAll,
      onSelect,
    };
  }
  const _scroll = useMemo(() => {
    if (columns.length > 5 && columns.length <= 8) {
      return { x: 1000 };
    } else if (columns.length > 8 && columns.length <= 11) {
      return { x: 1300 };
    } else if (columns.length > 11 && columns.length <= 13) {
      return { x: 1600 };
    } else if (columns.length > 13) {
      return { x: 2000 };
    } else if (columns.length <= 5) {
      return { x: 800 };
    }
  }, [columns]);

  const finalScroll = { ..._scroll, ...(scroll || {}) };

  const scrollTopRef = useRef(0);

  const VirtualTableContext = createContext({
    childrenLen: 0,
    scrollTop: 0,
    startRowIndex: 0,
    startOffset: 0,
    endRowIndex: 0,
    dispatch: (params: { type: string; payload: any }) => {},
  });

  const VcComponent = useMemo(() => {
    return {
      table: ({ children: tableChildren, ...restProps }) => {
        const [childrenLen, setChildrenLen] = useState(0);
        const [scrollTop, setScrollTop] = useState(scrollTopRef.current);
        const scrollChildRef = useRef<HTMLDivElement>(null);
        const [startRowIndex, startOffset, endRowIndex] = useMemo(() => {
          const rowHeight = virtuallistParams?.height ?? 40;
          const startRowIndex = Math.floor(scrollTop / rowHeight);
          const startOffset = scrollTop - startRowIndex * rowHeight;
          const endRowIndex = Math.ceil(
            (scrollTop + (finalScroll.y as number)) / rowHeight,
          );
          return [startRowIndex, startOffset, endRowIndex];
        }, [scrollTop, virtuallistParams?.height, finalScroll.y]);
        const dispatch = ({
          type,
          payload,
        }: {
          type: string;
          payload: any;
        }) => {
          switch (type) {
            case 'childrenLen':
              setChildrenLen(payload);
              break;
            case 'scrollTop':
              setScrollTop(payload);
              break;
          }
        };
        const onVirtualScroll = (e: any) => {
          scrollTopRef.current = e.target.scrollTop;
          setScrollTop(e.target.scrollTop);
        };
        useEffect(() => {
          const scrollEle = scrollChildRef.current?.parentNode as HTMLElement;
          if (typeof scrollTableRef === 'function') {
            scrollTableRef(scrollEle);
          }
          if (scrollEle) {
            scrollEle.scrollTop = scrollTopRef.current;
            scrollEle.addEventListener('scroll', onVirtualScroll);
          }
          return () => {
            if (scrollEle) {
              scrollEle.removeEventListener('scroll', onVirtualScroll);
            }
          };
        }, []);
        return (
          <VirtualTableContext.Provider
            value={{
              childrenLen,
              scrollTop,
              startRowIndex,
              startOffset,
              endRowIndex,
              dispatch,
            }}
          >
            <div
              ref={scrollChildRef}
              style={{
                boxSizing: 'border-box',
                height: (virtuallistParams?.height || 40) * childrenLen,
                paddingTop: scrollTop,
              }}
            >
              <table
                {...restProps}
                style={{
                  ...(restProps.style || {}),
                  minWidth: '100%',
                  tableLayout: 'fixed',
                  width: finalScroll.x as number,
                  transform: `translateY(-${startOffset}px)`,
                }}
              >
                {tableChildren}
              </table>
            </div>
          </VirtualTableContext.Provider>
        );
      },
      body: {
        wrapper: ({ children: wrapperChildren, ...restProps }) => {
          const { dispatch, startRowIndex, endRowIndex } =
            useContext(VirtualTableContext);
          useEffect(() => {
            dispatch({
              type: 'childrenLen',
              payload: wrapperChildren?.[1]?.length ?? 0,
            });
          }, [wrapperChildren]);
          return (
            <tbody {...restProps}>
              {wrapperChildren[0]}
              {wrapperChildren[1].slice(startRowIndex, endRowIndex)}
            </tbody>
          );
        },
      },
    };
  }, []);

  return (
    <Table
      components={virtuallistParams ? VcComponent : undefined}
      scroll={finalScroll}
      dataSource={dataSource}
      loadingComponent={renderLoading}
      rowKey={primaryKey}
      size={size}
      {...others}
      pagination={pagination}
      rowSelection={rowSelection}
    >
      {columns.map(renderColumn)}
    </Table>
  );
}

CFTable.defaultProps = {
  dataSource: [],
  hasBorder: false,
  cellClassName: '',
  comsMap: {},
};

export { TableCellProps, PropTypes, ColumnItemProps };
