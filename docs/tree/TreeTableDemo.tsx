import React from 'react';
import ComposeManage from '@/components/compose-manage';

const AAA = () => {
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
  const props = {
    dataRequest: {
      url: `https://front.sit.suosihulian.com/gateway/group/web/liveCode/staff/page`,
      method: 'post',
      isUnfold: true,
      params: {
        groupId: 1,
      },
    },
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
        type: 'selectUser',
        name: 'aaa',
        label: '选人组件',
        props: {
          wrapperKey: 'customerManagerInfoList',
          selectUserProps: {
            multiple: true,
            selectType: 'dept',
            unCheckableNodeType: ['ORG'],
            showTabList: ['customerManagerContacts'],
            searchPlaceholder: `请输入进行搜索`,
            requestParams: {
              selectTypeList: ['user'],
            },
            userOrigin: 'https://front.sit.suosihulian.com/gateway/user-center',
            isSaveSelectSignature: false,
            // selectSignature: '',
            dialogProps: {
              title: '选择对象',
            },
          },
        },
      },
      {
        type: 'select',
        name: 'newsTypes',
        label: '类型',
        allowClear: true,
        props: {
          placeholder: '请选择',
        },
        dataSource: {
          url: 'https://front.sit.suosihulian.com/gateway/cms/web/news/widget/list?appCode=hsk&scenesType=1',
        },
        dataSourceFmt: (data) => data?.dataSource?.[0]?.props?.dataSource,
      },
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
      // {
      //   type: 'cascader-select',
      //   label: '业务分组',
      //   name: 'brgId',
      //   // rules: [{ required: true, message: '请选择业务分组' }],
      //   // dataSource: [
      //   //   {label: 'test', value: 1}
      //   // ]
      //   props: {
      //     code: '1679092295713853442'
      //   },
      //   dataSource: {
      //     url: `https://front.sit.suosihulian.com/gateway/user-center/web/brg/list`,
      //   },
      // },
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
          offsetDay: -1,
        },
        label: '时间段',
      },
    ],
    tooltip: {
      title: '测试',
    },
    tableProps: {
      primaryKey: 'id',
      otherKey: 'id',
      columns,
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
        buttonProps: {
          type: 'primary',
        },
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
        // isBatch: true,
        innerRequest: {
          url: `https://front.sit.suosihulian.com/gateway/crm/web/stats/export/result`,
          method: 'GET',
          params: {
            exportId: '',
          },
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

        request: {
          url: `https://front.sit.suosihulian.com/gateway/crm/web/stats/dayChatOrder/export`,
          method: 'GET',
          params: {
            a: 1,
          },
        },
      },
    ],
  };
  // return <ComposeManage {...props} />;
  return 22222;
};
export default AAA;
