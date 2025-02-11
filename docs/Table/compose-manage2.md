## compose-manage2

Demo:

```tsx
import React, { useState, useEffect, useRef } from 'react';
import { Button, Modal } from 'antd';
// import style from './index.less';
import moment from 'moment';
// console.log(import './index.less');
import ComposeManage, { ColumnItemProps } from '@/components/compose-manage';
import CustomSelect from '@/components/compose-form/mod/custom-select';
import { getRangeMap } from '@/common/dateRange';
import net from '@/services/net';
import './index.less';
import { isCurrentUser, isIncludeCurrentUser } from '@/utils';

const staticDataSource = new Array(50).fill(1).map((el, i) => ({
  id: `${i + 1}`,
  name: `货吗名称${i + 1}`,
  groupName: 'groupName分组',
}));

// console.log(isCurrentUser());
export default () => {
  const tableRef = useRef();
  const onClick = () => {
    tableRef.current.updateDataSorce(
      new Array(30).fill(1).map((el, i) => ({
        name: `货吗名称货吗名称货吗名称货吗名称货吗名称货吗名称${i}${Math.random()}`,
      })),
    );
  };

  const props222 = {
    searchDataFormatter: (data) => {
      const newData = { ...data };

      if (newData?.aaa) {
        const aaa = newData?.aaa.map(({ id }) => id);
        newData.aaa = aaa;
      }
      if (newData?.groupIds) {
        const groupIds = newData?.groupIds.map(({ id }) => id);
        newData.groupIds = groupIds;
      }

      return newData;
    },
    staticFilter: (searchParams, el) => el.name.includes(searchParams.keyword),
    staticDataSource,
    tableProps: {
      primaryKey: 'id',
      columns: [
        { name: 'sn', label: '序号', width: 80 },
        { name: 'supplier', label: '供货方', width: 120 },
        { name: 'number', label: '编号', width: 140 },
        { name: 'name', label: '名称', width: 140 },
        { name: 'spec', label: '规格', width: 100 },
        { name: 'unit', label: '单位', width: 100 },
        { name: 'dosage', label: '用量', width: 100 },
        { name: 'lossRate', label: '损耗率(%)', width: 140 },
        { name: 'includeTaxPrice', label: '含税单价(元)', width: 140 },
        { name: 'excludeTaxPrice', label: '除税单价(元)', width: 140 },
        { name: 'tax', label: '税率(%)', width: 140 },
        { name: 'totalIncludeTaxPrice', label: '含税合价(元)', width: 140 },
        { name: 'totalExcludeTaxPrice', label: '除税合价(元)', width: 140 },
        { name: 'isDistribution', label: '配送', width: 100 },
        { name: 'isDeviceMaterial', label: '设备性材料' },
      ],
      isPagination: false,
      // pageSizeOptions: 10,
      rowSelection: {
        type: 'radio',
      },
      onSelectChange: (...args) => {
        console.log;
      },
    },
  };
  const props111 = {
    ref: tableRef,
    alertProps: {
      message:
        '注：请根据业务情况，设置聊天机器人，聊天机器人将在配置时间范围内，自动解答客户问题。',
      closable: false,
    },

    searchDataFormatter: (data) => {
      const newData = { ...data };

      if (newData?.aaa) {
        const aaa = newData?.aaa.map(({ id }) => id);
        newData.aaa = aaa;
      }
      if (newData?.groupIds) {
        const groupIds = newData?.groupIds.map(({ id }) => id);
        newData.groupIds = groupIds;
      }

      return newData;
    },
    filterSpan: 12,
    filterProps: [
      {
        type: 'search',
        name: 'keyword',
        label: '搜索',
        className: 'employee-search-name',
        allowClear: true,
        props: {
          placeholder: '请输入所在部门、运营人员、userid、acctid搜索',
        },
      },
      {
        type: 'search',
        name: 'userId',
        label: 'userid',
        className: 'employee-search-name',
        allowClear: true,
        props: {
          placeholder: '请输入',
        },
      },
      {
        type: 'search',
        name: 'acctId',
        label: 'acctid',
        className: 'employee-search-name',
        allowClear: true,
        props: {
          placeholder: '请输入',
        },
      },
      {
        type: 'dateTimeRangePicker',
        name: 'dateList',
        className: 'student-search-name',
        allowClear: true,
        valueType: 'dateRange',
        props: {
          format: 'YYYY-MM-DD HH:mm:ss',
          allowClear: true,
          showTime: true,
          showRanges: true,
          ranges: getRangeMap(0),
          offsetDay: -1,
        },
        label: '时间段',
      },
    ],
    tooltip: {
      title: '测试',
    },
    staticFilter: (searchParams, el) => el.name.includes(searchParams.keyword),
    staticDataSource,
    tableProps: {
      primaryKey: 'id',
      // virtuallistParams: { height: 578 },
      columns: [
        { name: 'sn', label: '序号', width: 80 },
        { name: 'supplier', label: '供货方', width: 120 },
        { name: 'number', label: '编号', width: 140 },
        { name: 'name', label: '名称', width: 140 },
        { name: 'spec', label: '规格', width: 100 },
        { name: 'unit', label: '单位', width: 100 },
        { name: 'dosage', label: '用量', width: 100 },
        { name: 'lossRate', label: '损耗率(%)', width: 140 },
        { name: 'includeTaxPrice', label: '含税单价(元)', width: 140 },
        { name: 'excludeTaxPrice', label: '除税单价(元)', width: 140 },
        { name: 'tax', label: '税率(%)', width: 140 },
        { name: 'totalIncludeTaxPrice', label: '含税合价(元)', width: 140 },
        { name: 'totalExcludeTaxPrice', label: '除税合价(元)', width: 140 },
        { name: 'isDistribution', label: '配送', width: 100 },
        { name: 'isDeviceMaterial', label: '设备性材料' },
        // { name: 'materialType', label: '材料类型', width: 140 },
        // { name: 'weight', label: '单重(kg)', width: 120 },
        // { name: 'packageFactor', label: '包装系数(%)', width: 140 },
        // { name: 'transportType', label: '运输类型', width: 140 },
        {
          name: 'operation',
          uiType: 'buttonList',
          label: '操作',
          width: 200,
          fixed: 'right',
          props: {
            dataSource: [
              {
                type: 'default',
                text: '点击',
                onClick: (e, tp) => {
                  console.log(e, tp);
                },
              },
              {
                uiType: 'table',
                text: '表格',
                dialogProps: {
                  title: '测试',
                  width: 1000,
                },
                manageProps: props222,
              },
              {
                uiType: 'request',
                text: '删除',
                request: {
                  url: '/',
                  method: 'POST',
                },
                refreshAfterRequest: true,
                confirmBeforeClick: {
                  modalTitle: '删除',
                  title: `删除后，该活动将永久失效`,
                },
              },
              {
                uiType: 'form',
                request: {
                  url: `https://front.sit.suosihulian.com/gateway/crm/web/cloudMobile/bind`,
                  method: 'POST',
                },
                text: '表单',
                dialogProps: {
                  title: '分配',
                },
                formItemLayout: {
                  labelCol: {
                    xs: { span: 19 },
                    sm: { span: 6 },
                  },
                  wrapperCol: {
                    xs: { span: 19 },
                    sm: { span: 18 },
                  },
                },
                refreshAfterRequest: true,
                formProps: {
                  dataSource: [
                    {
                      uiType: 'input',
                      name: 'status2',
                      label: '状态2',
                    },
                    {
                      uiType: 'select',
                      name: 'status',
                      label: '状态',
                      props: {
                        dataSource: [
                          { label: '上架', value: 0 },
                          { label: '下架', value: 1 },
                        ],
                      },
                    },
                  ],
                  initialValuesRequest: {
                    url: `https://front.sit.suosihulian.com/gateway/crm/web/cloudMobile/get`,
                    method: 'GET',
                  },
                },
              },
            ],
          },
        },
      ],
      isPagination: false,
      rowSelection: {
        type: 'radio',
      },
      onSelectChange: (...args) => {
        console.log;
      },
    },
  };

  return (
    <div>
      <button onClick={onClick}>更新</button>
      <ComposeManage {...props111} />
    </div>
  );
};
```

More skills for writing demo: https://d.umijs.org/guide/basic#write-component-demo
