## compose-manage2-virtual

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

const staticDataSource = new Array(100).fill(1).map((el, i) => ({
  id: `${i + 1}`,
  name: `货吗名称${i + 1}`,
  groupName: 'groupName分组',
  childList: new Array(10).fill(1).map((el, j) => ({
    id: `${i + 1}-${j + 1}`,
    name: `货吗名称${i + 1}-${j + 1}`,
    groupName: 'groupName分组',
    childList: new Array(10).fill(1).map((el, k) => ({
      id: `${i + 1}-${j + 1}-${k + 1}`,
      name: `货吗名称${i + 1}-${j + 1}-${k + 1}`,
      groupName: 'groupName分组',
    })),
  })),
}));
// const staticDataSource = [];

// console.log(isCurrentUser());
export default () => {
  const tableRef = useRef();
  const [selectedId, setSelectedId] = useState('');
  const onClick = () => {
    // tableRef.current.updateDataSource(
    //   new Array(30)
    //     .fill(1)
    //     .map((el, i) => ({ name: `货吗名称${i}${Math.random()}` })),
    // );
    tableRef.current.scrollTo({ top: 600, behavior: 'smooth' });
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
    staticDataSource: staticDataSource,
    virtualTable: true,
    tableProps: {
      virtuallistParams: { height: 40 },
      primaryKey: 'id',
      otherKey: 'id',
      pagination: false,
      scroll: { y: 600 },
      expandable: {
        // expandedRowKeys: ['1', '1-2', '2', '2-3'],
        defaultExpandAllRows: true,
        childrenColumnName: 'childList',
      },
      // onRow: (record) => {
      //   return {
      //     onClick: (event) => {
      //       console.log('onClick', record, event);
      //     }, // 点击行
      //     onDoubleClick: (event) => {
      //       console.log('onDoubleClick', record, event);
      //     },
      //     onContextMenu: (event) => {
      //       console.log('onContextMenu', record, event);
      //     },
      //     onMouseEnter: (event) => {
      //       console.log('onMouseEnter', record, event);
      //     }, // 鼠标移入行
      //     onMouseLeave: (event) => {
      //       console.log('onConMouseLeavelick', record, event);
      //     },
      //   };
      // },
      rowClassName: (record, index) =>
        record.id === selectedId ? 'custom-rowwww' : '',
      rowSelection: {
        type: 'radio',
        onSelect: (...args) => {
          console.log('onSelect', args);
        },
        onSelectAll: (...args) => {
          console.log('onSelectAll', args);
        },
      },
      onRow: (record) => {
        return {
          onClick: () => {
            setSelectedId(record.id);
          },
        };
      },
      columns: [
        {
          help: '123123',
          label: '活码名称',
          name: 'name',
          uiType: null,
          props: {
            // valueFormatter: (record, value) => (
            //   <span>
            //     <span
            //       style={{
            //         display: 'inline-block',
            //         width: 10,
            //         height: 10,
            //         backgroundColor: 'red',
            //       }}
            //     ></span>
            //     {`${value}-fmt`}
            //   </span>
            // ),
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
          // width: 150,
        },
        {
          help: null,
          label: '包含员工与部门',
          name: 'staffDeptName',
          uiType: null,
          // width: 150,
        },
        {
          help: null,
          label: '客户标签',
          name: 'labelName',
          // width: 100,
          uiType: null,
          // width: 150,
        },
        {
          help: null,
          label: '加人验证',
          // width: 90,
          name: 'skipVerify',
          uiType: null,
        },
        {
          help: null,
          label: '创建人',
          // width: 100,
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
        // {
        //   name: 'operation',
        //   uiType: 'buttonList',
        //   label: '操作',
        //   fixed: 'right',
        //   width: 320,
        //   props: {
        //     dataSource: [
        //       {
        //         text: '查看',
        //         uiType: 'link',
        //         to: '/sop-tool/employee/detail/${id}',
        //       },

        //       {
        //         text: '编辑',
        //         uiType: 'link',
        //         to: '/sop-tool/employee/add/${id}',
        //       },
        //       {
        //         text: '活码统计',
        //         uiType: 'link',
        //         to: '/sop-statistics/qwprivate/livecode?dateType=3&codeIdList=${id}',
        //       },
        //       {
        //         uiType: 'form',
        //         text: '企微标签手工同步',
        //         request: {
        //           url: `/web/wechat/label/syncSpecifyLabel111`,
        //           method: 'POST',
        //         },
        //         dialogPropsFormatter: ({ record }) => ({
        //           title: record.name + '-企微标签手工同步123',
        //         }),
        //         formItemLayout: {
        //           labelCol: {
        //             xs: { span: 19 },
        //             sm: { span: 5 },
        //           },
        //           wrapperCol: {
        //             xs: { span: 19 },
        //             sm: { span: 19 },
        //           },
        //         },
        //         showFormAlert: true,
        //         initValuesFormatter: ({ record }) => record,
        //         requestParamsFormatter: ({ record }) => {
        //           return { a: 1 };
        //         },
        //         onBeforeClick: (...args) => {
        //           console.log(args);
        //           return Promise.resolve(true);
        //         },
        //         formProps: {
        //           alertProps: {
        //             message:
        //               '客户标签客户标签客户标签客户标签客户标签客户标签客户标签客户标签客户标签客户标签客户标签客户标签客户标签客户标签客户标签',
        //           },
        //           dataSource: [
        //             {
        //               label: '客户标签',
        //               name: 'name',
        //               uiType: 'input',
        //             },
        //             // {
        //             //   label: '客户标签',
        //             //   name: 'tagList',
        //             //   props: {
        //             //     wrapperKey: 'weChatTagInfoList',
        //             //     selectUserProps: {
        //             //       showTabList: ['weChatTagContacts'],
        //             //       userOrigin: '',
        //             //       unCheckableNodeType: ['ORG'],
        //             //       isSaveSelectSignature: false,
        //             //       multiple: true,
        //             //       requestParams: {
        //             //         selectTypeList: ['tag'],
        //             //         tagTypeList: [0],
        //             //         labelPermission: 1,
        //             //       },
        //             //       selectType: 'dept',
        //             //       onlyLeafCheckable: true,
        //             //       dialogProps: {
        //             //         title: '可见范围',
        //             //       },
        //             //     },
        //             //   },
        //             //   rules: [
        //             //     { required: true, message: '请选择客户标签' },
        //             //     {
        //             //       validator: (rule, value, callback) => {
        //             //         if (Array.isArray(value) && value.length > 20) {
        //             //           callback('客户标签不能超过20个');
        //             //         } else {
        //             //           callback();
        //             //         }
        //             //       },
        //             //     },
        //             //   ],
        //             //   uiType: 'selectUser',
        //             // },
        //           ],
        //           dataFormatBeforeSubmit: async (formValues) => {
        //             return {
        //               // tagList: formValues.tagList.map((el) => ({
        //               //   wechatTagId: el.id,
        //               //   wechatTagName: el.name,
        //               // })),
        //             };
        //           },
        //           onFinish: () => {
        //             BaseInfo({
        //               title: '正在同步中，请稍后刷新查看',
        //               okText: '知道了',
        //               loading: true,
        //             });
        //           },
        //         },
        //       },
        //     ],
        //   },
        // },
      ],
      isPagination: true,
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
