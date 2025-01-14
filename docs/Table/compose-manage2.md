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

const staticDataSource = new Array(30)
  .fill(1)
  .map((el, i) => ({ name: `货吗名称${i}` }));

// console.log(isCurrentUser());
export default () => {
  const tableRef = useRef();
  const onClick = () => {
    tableRef.current.updateDataSorce(
      new Array(30)
        .fill(1)
        .map((el, i) => ({ name: `货吗名称${i}${Math.random()}` })),
    );
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
      columns: [
        {
          help: null,
          label: '活码名称',
          name: 'name',
          uiType: null,
          width: 150,
          props: {
            rows: 3,
            valueFormatter: (record, value) => `${value}-fmt`,
          },
        },
        {
          help: null,
          label: '二维码',
          name: 'qrCode',
          // width: 100,
          uiType: 'picture',
        },
        {
          help: null,
          label: '分组',
          name: 'groupName',
          uiType: null,
          width: 150,
          props: {
            rows: 3,
          },
        },
        {
          help: null,
          label: '包含员工与部门',
          name: 'staffDeptName',
          uiType: null,
          width: 150,
          props: {
            rows: 3,
          },
        },
        {
          help: null,
          label: '客户标签',
          name: 'labelName',
          // width: 100,
          uiType: null,
          width: 150,
          props: {
            rows: 3,
          },
        },
        {
          help: null,
          label: '加人验证',
          width: 90,
          name: 'skipVerify',
          uiType: null,
        },
        {
          help: null,
          label: '创建人',
          width: 100,
          name: 'createUserName',
          uiType: null,
        },
        {
          help: null,
          label: '备注',
          // width: 100,
          name: 'remark',
          uiType: null,
        },
        {
          help: null,
          label: '最后一次修改时间',
          name: 'gmtModify',
          uiType: null,
          width: 200,
        },
        {
          name: 'operation',
          uiType: 'buttonList',
          label: '操作',
          fixed: 'right',
          width: 208,
          props: {
            dataSource: [
              {
                text: '查看',
                uiType: 'link',
                to: '/sop-tool/employee/detail/${id}',
              },

              {
                text: '编辑',
                uiType: 'link',
                to: '/sop-tool/employee/add/${id}',
              },
              {
                text: '活码统计',
                uiType: 'link',
                to: '/sop-statistics/qwprivate/livecode?dateType=3&codeIdList=${id}',
              },
              {
                uiType: 'form',
                text: '企微标签手工同步',
                request: {
                  url: `/web/wechat/label/syncSpecifyLabel111`,
                  method: 'POST',
                },
                dialogPropsFormatter: ({ record }) => ({
                  title: record.name + '-企微标签手工同步123',
                }),
                formItemLayout: {
                  labelCol: {
                    xs: { span: 19 },
                    sm: { span: 5 },
                  },
                  wrapperCol: {
                    xs: { span: 19 },
                    sm: { span: 19 },
                  },
                },
                showFormAlert: true,
                initValuesFormatter: ({ record }) => record,
                requestParamsFormatter: ({ record }) => {
                  return { a: 1 };
                },
                onBeforeClick: (...args) => {
                  console.log(args);
                  return Promise.resolve(true);
                },
                formProps: {
                  alertProps: {
                    message:
                      '客户标签客户标签客户标签客户标签客户标签客户标签客户标签客户标签客户标签客户标签客户标签客户标签客户标签客户标签客户标签',
                  },
                  dataSource: [
                    {
                      label: '客户标签',
                      name: 'name',
                      uiType: 'input',
                    },
                    // {
                    //   label: '客户标签',
                    //   name: 'tagList',
                    //   props: {
                    //     wrapperKey: 'weChatTagInfoList',
                    //     selectUserProps: {
                    //       showTabList: ['weChatTagContacts'],
                    //       userOrigin: '',
                    //       unCheckableNodeType: ['ORG'],
                    //       isSaveSelectSignature: false,
                    //       multiple: true,
                    //       requestParams: {
                    //         selectTypeList: ['tag'],
                    //         tagTypeList: [0],
                    //         labelPermission: 1,
                    //       },
                    //       selectType: 'dept',
                    //       onlyLeafCheckable: true,
                    //       dialogProps: {
                    //         title: '可见范围',
                    //       },
                    //     },
                    //   },
                    //   rules: [
                    //     { required: true, message: '请选择客户标签' },
                    //     {
                    //       validator: (rule, value, callback) => {
                    //         if (Array.isArray(value) && value.length > 20) {
                    //           callback('客户标签不能超过20个');
                    //         } else {
                    //           callback();
                    //         }
                    //       },
                    //     },
                    //   ],
                    //   uiType: 'selectUser',
                    // },
                  ],
                  dataFormatBeforeSubmit: async (formValues) => {
                    return {
                      // tagList: formValues.tagList.map((el) => ({
                      //   wechatTagId: el.id,
                      //   wechatTagName: el.name,
                      // })),
                    };
                  },
                  onFinish: () => {
                    BaseInfo({
                      title: '正在同步中，请稍后刷新查看',
                      okText: '知道了',
                      loading: true,
                    });
                  },
                },
              },
            ],
          },
        },
      ],
      isPagination: true,
      rowSelection: {
        type: 'checkbox',
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
