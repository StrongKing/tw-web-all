## compose-table

Demo:

```tsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
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
// console.log(isCurrentUser());
export default () => {
  const formRef = useRef(null);

  window.token =
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcmVhX25hbWUiOiLmtZnmsZ8iLCJ1c2VyX2lkIjoxLCJ1c2VyX25hbWUiOiJhZG1pbiIsInNjb3BlIjpbInNlcnZlciJdLCJjb21wYW55X25hbWUiOiLlm73nvZHmtZnmsZ_nnIHnlLXlipvlhazlj7giLCJ1c2VyX2tleSI6IjNkNmIxOGYxLThiNjYtNDQ2NC04ZDc4LTI0N2ZjNDM1N2Y2NSIsImFyZWFfbmF0dXJlIjowLCJleHAiOjE3Mzk4ODYzMDgsImp0aSI6ImtCeU1HZTJIS3R6ODJBU1Z1QmlzY3RGaUZaSSIsImNsaWVudF9pZCI6ImFwcCJ9.2hM9dU0Fi0LNrxlWtJqRlgiUI9I0XBjLjJKwg5HdlGc';

  const getData = (value) => value;
  const url = {
    crm: 'https://gateway.sit.suosihulian.com/crm',
    hsk: 'https://front.sit.suosihulian.com/gateway/hsk',
  };

  const getHsManageProps = ({
    btn: { appCode, requestParams = {} },
    maxLength,
    onSelectChange,
  }) => ({
    isCacheListFilter: false,
    dataRequest: {
      url: `${url.hsk}/web/hs/page`,
      method: 'POST',
      params: {
        appCode,
        ...requestParams,
      },
    },
    filterSpan: 8,
    filterProps: [
      {
        type: 'search',
        name: 'keyword',
        label: '话术标题',
        allowClear: true,
        props: {
          placeholder: '请输入',
        },
      },
      {
        type: 'cascader-select',
        name: 'columnIds',
        label: '分类',
        allowClear: true,
        props: {
          placeholder: '请选择',
          changeOnSelect: true,
          fieldNames: {
            label: 'title',
            value: 'id',
            children: 'children',
          },
          showSearch: true,
        },
        dataSource: {
          url: `${url.cms}/web/columns/all/tree?appCode=${appCode}`,
        },
      },
    ],
    filterClassName: 'special-filter',
    tableProps: {
      primaryKey: 'id',
      columns: [
        { label: '话术标题', name: 'title', help: null, uiType: '' },
        { label: '类型', name: 'newsTypeDesc', help: null, uiType: '' },
        { label: '话术内容', name: 'hsContent', help: null, uiType: 'content' },
        { label: '所属分类', name: 'columnTitle', help: null, uiType: '' },
      ],
      checkable: true,
      rowSelection: {
        type: 'radio',
      },
      onSelectChange,
    },
  });

  const props11 = getHsManageProps({
    btn: {
      appCode: 'hsk',
      requestParams: {
        newsTypes: [2],
      },
    },
    maxLength: 1,
    onSelectChange: (id, selectItem) => {
      // eslint-disable-next-line prefer-destructuring
    },
  });
  const propsss = {
    alertProps: {
      message: '每日凌晨01：00~04:00更新数据，数据统计截至今日凌晨 00:00',
      closable: false,
    },
    dataRequest: {
      url: `http://xunhong.sit.suosihulian.com/rpa/config/query_tasklist`,
      method: 'POST',
      isUnfold: true,
      hideMsgCodes: [200],
    },
    filterProps: [
      {
        type: 'select',
        name: 'userType',
        dataSource: [
          { label: '微信', value: 1 },
          { label: '企业微信', value: 2 },
        ],
        label: '类型',
      },
      {
        type: 'select',
        name: 'addWay',
        dataSource: [
          { label: '未知来源', value: 0 },
          { label: '扫描二维码', value: 1 },
          { label: '搜索手机号', value: 2 },
          { label: '名片分享', value: 3 },
          { label: '群聊', value: 4 },
          { label: '手机通讯录', value: 5 },
          { label: '微信联系人', value: 6 },
          { label: '安装第三方应用时自动添加的客服人员', value: 8 },
          { label: '搜索邮箱', value: 9 },
          { label: '视频号添加', value: 10 },
          { label: '通过日程参与人添加', value: 11 },
          { label: '通过会议参与人添加', value: 12 },
          { label: '添加微信好友对应的企业微信', value: 13 },
          { label: '通过智慧硬件专属客服添加', value: 14 },
          { label: '通过上门服务客服添加', value: 15 },
          { label: '通过获客链接添加', value: 16 },
          { label: '通过定制开发添加', value: 17 },
          { label: '通过需求回复添加', value: 18 },
          { label: '内部成员共享', value: 201 },
          { label: '管理员/负责人分配', value: 202 },
        ],
        label: '客户来源',
      },
      {
        type: 'select',
        name: 'stateId',
        dataSource: {
          url: `${url.group}/web/liveCode/staff/search`,
        },
        props: {
          showSearch: true,
          allowClear: true,
          mode: 'tags',
          optionFilterProp: 'label',
        },
        label: '员工活码',
      },
      {
        type: 'dateRangePicker',
        name: 'addTime',
        label: '添加时间',
      },
      {
        type: 'dateRangePicker',
        name: 'addTime1',
        label: '添加时间1',
        props: {
          format: 'YYYY-MM-DD',
          allowClear: true,
        },
      },
      {
        type: 'select',
        name: 'relationStatus',
        dataSource: [
          { label: '正常', value: '0' },
          { label: '客户删除', value: '1' },
          { label: '主动删除', value: '2' },
          { label: '互相删除', value: '3' },
          { label: '系统删除', value: '4' },
          { label: '流失', value: '5' },
        ],
        label: '关系状态',
        tooltip: '流失包含客户删除，主动删除，相互删除，系统删除',
      },
      {
        type: 'dateRangePicker',
        name: 'deleteTime',
        label: '流失时间',
      },
      {
        type: 'search',
        name: 'externalUserName',
        label: '客户昵称',
        placeholder: '请输入客户昵称进行搜索',
      },

      {
        type: 'selectUser',
        name: 'realNameSign',
        label: '所属客户经理',
        // placeholder: '请输入客户经理进行搜索',
        props: {
          selectUserProps: {
            multiple: true,
            selectType: 'dept',
            unCheckableNodeType: ['ORG'],
            showTabList: ['customerManagerContacts'],
            searchPlaceholder: `请选择客户经理`,
            requestParams: {
              selectTypeList: ['manager_account'],
            },
            onlyLeafCheckable: true,
            userOrigin: url.usercenter,
            isSaveSelectSignature: true,
            dialogProps: {
              title: '选择对象',
            },
          },
        },
      },
      {
        type: 'search',
        name: 'remark',
        label: '客户经理企微备注',
        placeholder: '请输入备注内容进行搜索',
      },
      {
        type: 'search',
        name: 'unionId',
        label: '客户unionid',
        placeholder: '请输入客户完整unionid进行搜索',
      },
    ],
    initialFilterValues: {
      sendTimeList: ['2024-01-08 00:00', '2024-01-08 23:59'],
    },
    tableProps: {
      primaryKey: 'id',
      columns: [
        { label: '客户昵称', name: 'alias', help: null, uiType: null },
        { label: 'unionId', name: 'unionId', help: null, uiType: null },
        { label: '类型', name: 'typeDesc', help: null, uiType: null },
        {
          label: '虚拟客户经理',
          name: 'managerUserName',
          help: null,
          uiType: null,
        },
        { label: '业务分组', name: 'brgName' },
        { label: '企微备注', name: 'remark', help: null, uiType: null },
        { label: '客户来源', name: 'addWayDesc', help: null, uiType: null },
        { label: '员工活码', name: 'stateName', help: null, uiType: null },
        { label: '关系状态', name: 'statusDesc', help: null, uiType: null },
        {
          label: '添加时间',
          name: 'createTime',
          help: null,
          uiType: null,
          width: 194,
        },
        {
          label: '流失时间',
          name: 'deletedTime',
          help: null,
          uiType: null,
          width: 194,
        },
        {
          label: '客户发送消息数',
          name: 'userSendMsgNum',
          help: null,
          uiType: null,
        },
        {
          label: '运营人员消息数',
          name: 'managerSendMsgNum',
          help: null,
          uiType: null,
        },
        {
          label: '自动发送消息数',
          name: 'autoSendMsgNum',
          help: null,
          uiType: null,
        },
      ],
    },
    captionRight: 'captionRightcaptionRight',
    staticSearch: (...args) => {
      console.log(args, '***************');
    },
    buttonList: [
      {
        uiType: 'downloadFe',
        text: '导出筛选明细',
        importHeaders: [
          { key: 'groupName', label: '群聊名称' },
          { key: 'groupId', label: '咚咚群id' },
          { key: 'creator', label: '发送人' },
          {
            key: 'sendStatus',
            label: '状态',
            formatter: (value, row) => {
              console.log(value, row);
              return '状态';
            },
          },
          { key: 'failedReason', label: '备注' },
        ],
        buttonProps: {
          type: 'primary',
        },
        request: {
          url: `http://xunhong.sit.suosihulian.com/rpa/config/query_sendlist`,
          method: 'POST',
          params: {},
        },
        searchDataFormatter: ({ search: val }) => ({
          condition: {
            ...val,
            taskId: '8c7e04ed8f1618a895fbf62a7e6a6e7c',
          },
        }),
        successCodes: [200],
        dataFormatter: (res) => res?.data?.sendList,
        filename: '咚咚群发记录',
      },
      {
        uiType: 'download',
        text: '导出筛选明细',
        // isBatch: true,
        buttonProps: {
          type: 'primary',
        },
        request: {
          url: `https://front.sit.suosihulian.com/gateway/crm/web/stats/privateChat/friend/export`,
          method: 'post',
          isUnfold: true,
        },
        innerRequest: {
          url: `https://front.sit.suosihulian.com/gateway/crm/web/stats/export/result`,
          method: 'GET',
          params: {
            exportId: '',
          },
        },
      },
      {
        uiType: 'download',
        text: '导出筛选明细',
        // isBatch: true,
        buttonProps: {
          type: 'primary',
        },
        request: {
          url: `https://front.sit.suosihulian.com/gateway/crm/web/stats/privateChat/friend/export`,
          method: 'post',
          isUnfold: true,
        },
        innerRequest: {
          url: `https://front.sit.suosihulian.com/gateway/crm/web/stats/export/result`,
          method: 'GET',
          params: {
            exportId: '',
          },
        },
      },
      {
        uiType: 'download',
        text: '导出筛选明细',
        // isBatch: true,
        buttonProps: {
          type: 'primary',
        },
        request: {
          url: `https://front.sit.suosihulian.com/gateway/crm/web/stats/privateChat/friend/export`,
          method: 'post',
          isUnfold: true,
        },
        innerRequest: {
          url: `https://front.sit.suosihulian.com/gateway/crm/web/stats/export/result`,
          method: 'GET',
          params: {
            exportId: '',
          },
        },
      },
      {
        uiType: 'download',
        text: '导出筛选明细',
        // isBatch: true,
        buttonProps: {
          type: 'primary',
        },
        request: {
          url: `https://front.sit.suosihulian.com/gateway/crm/web/stats/privateChat/friend/export`,
          method: 'post',
          isUnfold: true,
        },
        innerRequest: {
          url: `https://front.sit.suosihulian.com/gateway/crm/web/stats/export/result`,
          method: 'GET',
          params: {
            exportId: '',
          },
        },
      },
      {
        uiType: 'download',
        text: '导出筛选明细',
        // isBatch: true,
        buttonProps: {
          type: 'primary',
        },
        request: {
          url: `https://front.sit.suosihulian.com/gateway/crm/web/stats/privateChat/friend/export`,
          method: 'post',
          isUnfold: true,
        },
        innerRequest: {
          url: `https://front.sit.suosihulian.com/gateway/crm/web/stats/export/result`,
          method: 'GET',
          params: {
            exportId: '',
          },
        },
      },
      {
        uiType: 'download',
        text: '导出筛选明细',
        // isBatch: true,
        buttonProps: {
          type: 'primary',
        },
        request: {
          url: `https://front.sit.suosihulian.com/gateway/crm/web/stats/privateChat/friend/export`,
          method: 'post',
          isUnfold: true,
        },
        innerRequest: {
          url: `https://front.sit.suosihulian.com/gateway/crm/web/stats/export/result`,
          method: 'GET',
          params: {
            exportId: '',
          },
        },
      },
      // {
      //   uiType: 'download',
      //   text: '导出筛选明细',
      //   // isBatch: true,
      //   buttonProps: {
      //     type: 'primary',
      //   },
      //   request: {
      //     url: `https://front.sit.suosihulian.com/gateway/crm/web/stats/privateChat/friend/export`,
      //     method: 'post',
      //     isUnfold: true,
      //   },
      //   innerRequest: {
      //     url: `https://front.sit.suosihulian.com/gateway/crm/web/stats/export/result`,
      //     method: 'GET',
      //     params: {
      //       exportId: '',
      //     },
      //   },
      // },
      // {
      //   uiType: 'download',
      //   text: '导出筛选明细',
      //   // isBatch: true,
      //   buttonProps: {
      //     type: 'primary',
      //   },
      //   request: {
      //     url: `https://front.sit.suosihulian.com/gateway/crm/web/stats/privateChat/friend/export`,
      //     method: 'post',
      //     isUnfold: true,
      //   },
      //   innerRequest: {
      //     url: `https://front.sit.suosihulian.com/gateway/crm/web/stats/export/result`,
      //     method: 'GET',
      //     params: {
      //       exportId: '',
      //     },
      //   },
      // },
      // {
      //   uiType: 'download',
      //   text: '导出筛选明细',
      //   // isBatch: true,
      //   buttonProps: {
      //     type: 'primary',
      //   },
      //   request: {
      //     url: `https://front.sit.suosihulian.com/gateway/crm/web/stats/privateChat/friend/export`,
      //     method: 'post',
      //     isUnfold: true,
      //   },
      //   innerRequest: {
      //     url: `https://front.sit.suosihulian.com/gateway/crm/web/stats/export/result`,
      //     method: 'GET',
      //     params: {
      //       exportId: '',
      //     },
      //   },
      // },
      // {
      //   uiType: 'download',
      //   text: '导出筛选明细',
      //   // isBatch: true,
      //   buttonProps: {
      //     type: 'primary',
      //   },
      //   request: {
      //     url: `https://front.sit.suosihulian.com/gateway/crm/web/stats/privateChat/friend/export`,
      //     method: 'post',
      //     isUnfold: true,
      //   },
      //   innerRequest: {
      //     url: `https://front.sit.suosihulian.com/gateway/crm/web/stats/export/result`,
      //     method: 'GET',
      //     params: {
      //       exportId: '',
      //     },
      //   },
      // },
    ],
  };
  const [visible, setVisible] = useState(false);
  const modalProps11 = {
    onCancel: () => {
      setVisible(false);
    },
    onOk: () => {
      setVisible(false);
    },
    width: 600,
    title: `选择文本话术`,
  };

  const columns = [
    {
      help: null,
      label: '活码名称',
      name: 'name',
      uiType: null,
      width: 150,
      props: {
        rows: 3,
      },
      children: [
        {
          help: null,
          label: '活码名称1',
          name: 'groupName',
          uiType: null,
          width: 150,
          props: {
            rows: 3,
          },
        },
        {
          help: null,
          label: '活码名称2',
          name: 'labelName',
          uiType: null,
          width: 150,
          props: {
            rows: 3,
          },
        },
      ],
    },
    {
      help: null,
      label: '二维码',
      name: 'qrCode',
      width: 60,
      uiType: 'picture',
    },
    // {
    //   help: null,
    //   label: '分组',
    //   name: 'groupName',
    //   uiType: null,
    //   width: 150,
    //   props: {
    //     rows: 3,
    //   },
    // },
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
    // {
    //   help: null,
    //   label: '客户标签',
    //   name: 'labelName',
    //   // width: 100,
    //   uiType: null,
    //   width: 150,
    //   props: {
    //     rows: 3,
    //   },
    // },
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
            uiType: 'request',
            text: '删除',
            request: {
              url: `https://front.sit.suosihulian.com/gateway/group/web/liveCode/staff/delete`,
              method: 'POST',
            },
            onSuccess(res, params) {
              console.log(params, 'res');
            },
            refreshAfterRequest: true,
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
        ],
      },
    },
  ];

  const [areaCode, setAreaCode] = useState('');

  const list = useMemo(() => {
    return [
      {
        type: 'customSelect',
        name: 'newsTypes',
        label: '所属地市',
        allowClear: true,
        props: {
          placeholder: '请选择1',
          mode: '',
          optionFilterProp: 'areaName',
          fieldNames: {
            label: 'areaName',
            value: 'areaCode',
          },
          onChange: (val, formVal) => {
            setAreaCode((e) => {
              if (e !== val) {
                formVal.current.setFieldsValue({ newsTypes1: '' });
                return val;
              }
              return e;
            });
          },
        },
        dataSource: 'http://tei.sit.zjds.tech/prod-api/sys/sys/area/city_tree',
      },
      {
        type: 'customSelect',
        name: 'newsTypes1',
        label: `所属区县`,
        allowClear: true,
        props: {
          placeholder: '请选择',
          mode: '',
          optionFilterProp: 'areaName',
          fieldNames: {
            label: 'areaName',
            value: 'areaCode',
          },
        },
        dataSource: areaCode
          ? `http://tei.sit.zjds.tech/prod-api/sys/sys/area/county_tree?areaCode=${areaCode}`
          : [],
      },
    ];
  }, [areaCode]);

  const props = {
    dataRequest: {
      url: `https://front.sit.suosihulian.com/gateway/group/web/liveCode/staff/page`,
      method: 'post',
      isUnfold: true,
      params: {
        groupId: 1,
      },
    },
    filterClassName: 'special-filter',
    alertProps: {
      message:
        '注：请根据业务情况，设置聊天机器人，聊天机器人将在配置时间范围内，自动解答客户问题。1',
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
    filterLabelWidth: 100,
    defaultCollapsed: false,
    filterProps: [
      // {
      //   type: 'select',
      //   name: 'userType',添加时间2
      //   dataSource: [
      //     { label: '微信', value: 1 },
      //     { label: '企业微信', value: 2 },
      //   ],
      //   label: '类型',
      // },
      // {
      //   type: 'select',
      //   name: 'addWay',
      //   dataSource: [
      //     { label: '未知来源', value: 0 },
      //     { label: '扫描二维码', value: 1 },
      //     { label: '搜索手机号', value: 2 },
      //     { label: '名片分享', value: 3 },
      //     { label: '群聊', value: 4 },
      //     { label: '手机通讯录', value: 5 },
      //     { label: '微信联系人', value: 6 },
      //     { label: '安装第三方应用时自动添加的客服人员', value: 8 },
      //     { label: '搜索邮箱', value: 9 },
      //     { label: '视频号添加', value: 10 },
      //     { label: '通过日程参与人添加', value: 11 },
      //     { label: '通过会议参与人添加', value: 12 },
      //     { label: '添加微信好友对应的企业微信', value: 13 },
      //     { label: '通过智慧硬件专属客服添加', value: 14 },
      //     { label: '通过上门服务客服添加', value: 15 },
      //     { label: '通过获客链接添加', value: 16 },
      //     { label: '通过定制开发添加', value: 17 },
      //     { label: '通过需求回复添加', value: 18 },
      //     { label: '内部成员共享', value: 201 },
      //     { label: '管理员/负责人分配', value: 202 },
      //   ],
      //   label: '客户来源',
      // },
      ...list,
      // {
      //   type: 'datepicker',
      //   name: 'addTime2',
      //   label: '添加时间2',
      // },
      // {
      //   type: 'dateRangePicker',
      //   name: 'addTime',
      //   label: '添加时间',
      // },
      // {
      //   type: 'dateTimeRangePicker',
      //   name: 'addTime1',
      //   label: '添加时间1',
      //   props: {
      //     format: 'YYYY-MM-DD HH:mm',
      //     allowClear: true,
      //   },
      // },
      {
        type: 'select',
        name: 'stateId',
        dataSource: {
          url: `${url.group}/web/liveCode/staff/search`,
        },
        props: {
          showSearch: true,
          allowClear: true,
          mode: 'tags',
          optionFilterProp: 'label',
        },
        label: '员工活码',
      },
      {
        type: 'select',
        name: 'relationStatus',
        dataSource: [
          { label: '正常', value: '0' },
          { label: '客户删除', value: '1' },
          { label: '主动删除', value: '2' },
          { label: '互相删除', value: '3' },
          { label: '系统删除', value: '4' },
          { label: '流失', value: '5' },
        ],
        label: '关系状态',
        tooltip: '流失包含客户删除，主动删除，相互删除，系统删除',
      },
      {
        type: 'dateRangePicker',
        name: 'deleteTime',
        label: '流失时间',
      },
      {
        type: 'selectUser',
        name: 'realNameSign222',
        label: '所属客户经理222',
        // placeholder: '请输入客户经理进行搜索',
        props: {
          selectUserProps: {
            multiple: true,
            selectType: 'dept',
            unCheckableNodeType: ['ORG'],
            showTabList: ['customerManagerContacts'],
            searchPlaceholder: `请选择客户经理`,
            requestParams: {
              selectTypeList: ['manager_account'],
            },
            onlyLeafCheckable: true,
            userOrigin: url.usercenter,
            isSaveSelectSignature: true,
            dialogProps: {
              title: '选择对象',
            },
          },
        },
      },

      {
        type: 'selectUser',
        name: 'realNameSign',
        label: '所属客户经理',
        // placeholder: '请输入客户经理进行搜索',
        props: {
          selectUserProps: {
            multiple: true,
            selectType: 'dept',
            unCheckableNodeType: ['ORG'],
            showTabList: ['customerManagerContacts'],
            searchPlaceholder: `请选择客户经理`,
            requestParams: {
              selectTypeList: ['manager_account'],
            },
            onlyLeafCheckable: true,
            userOrigin: url.usercenter,
            isSaveSelectSignature: true,
            dialogProps: {
              title: '选择对象',
            },
          },
        },
      },
      {
        type: 'selectUser',
        name: 'realNameSign111',
        label: '所属客户经理111',
        // placeholder: '请输入客户经理进行搜索',
        props: {
          selectUserProps: {
            multiple: true,
            selectType: 'dept',
            unCheckableNodeType: ['ORG'],
            showTabList: ['customerManagerContacts'],
            searchPlaceholder: `请选择客户经理`,
            requestParams: {
              selectTypeList: ['manager_account'],
            },
            onlyLeafCheckable: true,
            userOrigin: url.usercenter,
            isSaveSelectSignature: true,
            dialogProps: {
              title: '选择对象',
            },
          },
        },
      },
      {
        type: 'search',
        name: 'remark',
        label: '客户经理企微备注',
        placeholder: '请输入备注内容进行搜索',
      },
      {
        type: 'search',
        name: 'unionId',
        label: '客户unionid',
        placeholder: '请输入客户完整unionid进行搜索',
      },
    ],
    tooltip: {
      title: '测试',
    },
    tableProps: {
      primaryKey: 'id',
      columns: columns,
      isPagination: true,
      rowSelection: {
        type: 'checkbox',
      },
      // pagination: {
      //   simple: true,
      //   showTitle: true,
      // },
      onSelectChange: (...args) => {
        console.log;
      },
    },
    buttonList: [
      {
        uiType: 'form',
        request: {
          url: `https://front.sit.suosihulian.com/gateway/crm/web/label/group/save`,
          method: 'POST',
        },
        text: '添加',
        // buttonProps: {
        //   type: 'primary',
        // },
        dialogProps: {
          title: '添加',
          className: 'xxx',
          wrapClassName: 'msg-modal',
        },
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
        formProps: {
          dataSource: [
            {
              uiType: 'radio',
              name: 'input2',
              label: '输入框',
              props: {
                dataSource: [{ label: '选项1', value: '1' }],
              },
            },
            {
              uiType: 'input',
              name: 'input3',
              label: '输入框2',
            },
          ],
          dataFormatBeforeSubmit: (formValue) => {
            return {
              ...formValue,
              ...formValue.syncCorpSelect,
            };
          },
          initialValues: {
            groupPermission: 1,
            labelGroupType: 0,
            syncCorpSelect: {
              syncCorpSelect: 1,
            },
          },
        },
      },
      {
        uiType: 'sync',
        text: '同步',
        // isBatch: true,
        // buttonProps: {
        //   type: 'primary',
        // },
        content: 'xxx',
        request: {
          url: `https://front.sit.suosihulian.com/gateway/contact-sync/contact-sync/wechat/internal/user`,
          method: 'get',
        },
      },
      {
        uiType: 'download',
        text: '导出筛选明细',
        buttonProps: {
          type: 'primary',
        },
        request: {
          url: 'https://front.sit.suosihulian.com/gateway/user-center/web/followUser/exportList',
          method: 'post',
        },
        innerRequest: {
          url: `https//front.sit.suosihulian.com/gateway/publicity/web/file/fileUrlByRedisKey`,
          method: 'GET',
          params: {
            redisKey: '',
          },
        },
      },
    ],
  };
  const [count, setCount] = useState(1);
  const [text, setText] = useState({ a: 2 });
  const [key, setKey] = useState(Date.now());

  const useAA = ({ a, b }) => {
    useEffect(() => {
      console.log('useEffect triggered', JSON.stringify(a), JSON.stringify(b));
    }, [JSON.stringify(a), JSON.stringify(b)]);
  };

  useAA({ a: { count, key }, b: text });

  const handleClick = () => {
    setCount(2);
    setText({ a: 3 });
    setKey(Date.now());
    return Promise.resolve();
  };

  return (
    <div>
      <button
        onClick={() => {
          setVisible(true);
        }}
      >
        333
      </button>
      {visible && (
        <Modal visible={visible} {...modalProps11}>
          <ComposeManage {...props11} />
        </Modal>
      )}
      <ComposeManage ref={formRef} {...props} />
    </div>
  );
  // return <App />
  let a = {
    label: '业务分组',
    name: 'brgId',
    code: '1679092295713853442',
    onChange: (v) => {
      console.log(v);
    },
    dataSource: [
      {
        label: '12',
        value: '1636272686102708225',
      },
      {
        label: '12334-1111',
        value: '1679092295713853442',
      },
      {
        label: '24154',
        value: '1679101384477995009',
      },
      {
        label: 'li-测试',
        value: '1681570795751305217',
      },
      {
        label: 'test',
        value: '1645721872893411329',
      },
      {
        label: 'test-01',
        value: '1678320221671047169',
      },
      {
        label: 'test3',
        value: '1676171519291404290',
      },
      {
        label: 'test4',
        value: '1676413775031496705',
      },
      {
        label: '业务分组',
        value: '1636272636995796994',
      },
      {
        label: '旺财旺旺 😄😄🐟',
        value: '1678716359813283841',
      },
      {
        label: '机器人测试',
        value: '1637690802105552897',
      },
      {
        label: '测试_ChatGPT',
        value: '1668907345369817089',
      },
      {
        label: '测试操作日志-2',
        value: '1679032824877985794',
      },
      {
        label: '通用',
        value: '1636208538916560897',
      },
    ],
  };
  // return <CustomSelect  {...a}></CustomSelect>
};
```

More skills for writing demo: https://d.umijs.org/guide/basic#write-component-demo
