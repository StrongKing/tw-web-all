## compose-form2

Demo:

```tsx
import React, { useState, useRef, createRef, useEffect } from 'react';
import moment from 'moment';
import { Modal, DatePicker } from 'antd';
import { groupBy } from 'lodash';
import ComposeForm from '@/components/compose-form';
import FormConfirm from '@/components/FormConfirm';
import EventEmitter from '@/components/compose-form/events';
import Card from '@/components/expand-collapse';
import SelectFormUser from '@/components/compose-form/mod/select-user';
import SelectUserResult from '@/components/compose-form/mod/select-user/result';
import { getRangeMap } from '@/common/dateRange';
import Empty from '@/components/empty';
import {
  RangePicker_ as BaseRangePicker,
  DatePicker_ as BaseDatePicker,
} from '@/components/compose-form/mod/datePick';
const { RangePicker } = DatePicker;
export default () => {
  const formRef = createRef();
  const wrapRef = useRef(null);
  const [wrapWith, setWrapWith] = useState(null);

  const range = (start, end) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  };
  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < moment().endOf('day');
  };
  const disabledDateTime = (c) => {
    const isToday = c?._d?.getDate() === new Date().getDate();
    const hourFlag = c?._d?.getHours() === new Date().getHours();
    const limitH = !c || isToday ? new Date().getHours() : 0;
    const limitM = !c || (isToday && hourFlag) ? new Date().getMinutes() : 0;
    return {
      disabledHours: () => range(0, 20),
      disabledMinutes: () => range(0, 31),
      disabledSeconds: () => [55, 56],
    };
  };
  const disabledRangeTime = (c, type) => {
    const isToday = c?._d?.getDate() === new Date().getDate();
    const hourFlag = c?._d?.getHours() === new Date().getHours();
    const limitH = !c || isToday ? new Date().getHours() : 0;
    const limitM = !c || (isToday && hourFlag) ? new Date().getMinutes() : 0;
    return {
      disabledHours: () => range(0, limitH),
      disabledMinutes: () => range(0, limitM),
    };
  };
  const rangePickerProps = {
    // dateFormat: 'YYYY-MM-DD HH:mm:ss',
    // format: 'YYYY-MM-DD HH:mm:ss',
    // showTime: true,
    // disabledDate,
    // disabledTime: disabledRangeTime,
    disabledDate: disabledDate,
    disabledTime: disabledRangeTime,
    showTime: true,
    format: 'YYYY-MM-DD HH:mm:ss',
  };
  const initFormSource = [
    {
      uiType: 'date-range-picker',
      label: '所属分类1222',
      name: 'columnIds333',
      props: {
        showTime: { format: 'HH:mm:ss' },
        format: 'YYYY-MM-DD HH:mm:ss',
        dateFormat: 'YYYY-MM-DD HH:mm:ss',
        disabledDate: disabledDate,
        disabledTime: disabledRangeTime,
      },
    },
    {
      label: '所属分类1',
      uiType: 'cascader-select',
      name: 'columnIds',
      props: {
        placeholder: '请选择',
        changeOnSelect: true,
        fieldNames: { label: 'title', value: 'id', children: 'children' },
        showSearch: true,
        disabled: true,
      },
      source: {
        url: `https://front.sit.suosihulian.com/gateway/cms/web/columns/all/tree?appCode=hsk`,
      },
      rules: [
        {
          required: true,
          message: '请选择',
        },
      ],
    },
    {
      name: 'remark',
      label: '原因',
      uiType: 'textarea',
      rules: [{ required: true, message: '请输入原因备注' }],
    },
    {
      name: 'input',
      label: '原因2',
      uiType: 'input',
      rules: [{ required: true, message: '请输入原因备注' }],
    },
  ];

  const [controls] = useState(() => initFormSource);

  const selectRows = [
    {
      centerWarehouseName: '一组组组组组组组组组组组组组组组组组组组',
      materialCode: '222222',
      materialName: '耗材1',
      deliverStatus: '状态一',
      toDeliverStockNum: '哈哈1',
    },
    {
      centerWarehouseName: '二组组组组组组组组组组组组组组组组组组组',
      materialCode: '222222',
      materialName: '耗材2',
      deliverStatus: '状态一',
      toDeliverStockNum: '哈哈2',
    },
    {
      centerWarehouseName: '二组组组组组组组组组组组组组组组组组组组',
      materialCode: '222222',
      materialName: '耗材3',
      deliverStatus: '状态不明',
      toDeliverStockNum: '哈哈2',
    },
  ];
  const oldArr = groupBy(selectRows, function (n) {
    return n.centerWarehouseName;
  });

  let newArr = [];
  Object.keys(oldArr).forEach((key) => {
    // 数组组组组组组组组组组组组组组组组组组组
    newArr.push({ name: key, data: oldArr[key] });
  });

  console.log(newArr);

  const [list, setList] = useState([
    {
      id: 'etoG84CgAAf6oXnYFIogssKp0uCCLEfw',
      key: 'etoG84CgAAf6oXnYFIogssKp0uCCLEfw',
      name: '#COMPASS Live Arena',
      type: 'WECHAT_TAG',
      contactType: 20,
      childDelete: true,
      labelPathName: '导入游戏标签组',
    },
    {
      id: 'etoG84CgAAHRkDaAaqQRZA8X1wFJNSWQ',
      key: 'etoG84CgAAHRkDaAaqQRZA8X1wFJNSWQ',
      name: '&0(And Zero)',
      type: 'WECHAT_TAG',
      contactType: 20,
      childDelete: true,
      labelPathName: '导入游戏标签组',
    },
  ]);
  window.token =
    'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2luZm8iOiIlN0IlMjJhdmF0YXIlMjIlM0ElMjJodHRwcyUzQSUyRiUyRndld29yay5xcGljLmNuJTJGd3dwaWMlMkYxMzIyNTBfTnlsbkFGMVdROVNlN3J5XzE2NjI2MDIxNzYlMkYwJTIyJTJDJTIyY29ycElkJTIyJTNBJTIyd3BvRzg0Q2dBQWpWZThBU21zbFd1eTFla3ZzSVFXUHclMjIlMkMlMjJpbmR1c3RyeVR5cGUlMjIlM0ElMjJteXR4bCUyMiUyQyUyMmxvZ2luVHlwZSUyMiUzQSUyMm5vcm1hbCUyMiUyQyUyMm1lbWJlcklkJTIyJTNBMTU2OTU2NDYwMjkwNDI2MDYxMCUyQyUyMm1lbWJlck5hbWUlMjIlM0ElMjIlRTklQTklQUMlRTYlOUQlQjAlMjIlMkMlMjJtb2JpbGUlMjIlM0ElMjIxODc1ODI4NzAwMSUyMiUyQyUyMm9yZ0lkJTIyJTNBMzAwMTAwMTAwMTAwMDAwNiUyQyUyMm9yZ05hbWUlMjIlM0ElMjIlRTYlOUQlQUQlRTUlQjclOUUlRTYlQUQlQTMlRTUlOUQlOUIlRTclQTclOTElRTYlOEElODAlRTYlOUMlODklRTklOTklOTAlRTUlODUlQUMlRTUlOEYlQjglRUYlQkMlODglRTYlQUYlOEQlRTUlQTklQjQlRUYlQkMlODklMjIlMkMlMjJvcmdUeXBlJTIyJTNBJTIyZ2VuZXJhbCUyMiUyQyUyMnJlZ2lvbkNvZGUlMjIlM0ElMjIzMzAxMDIwMDAwMDAwMDAwMDAlMjIlMkMlMjJzaG9ydE5hbWUlMjIlM0ElMjIlRTYlQUQlQTMlRTUlOUQlOUIlRTclQTclOTElRTYlOEElODAlMjIlMkMlMjJ1c2VySWQlMjIlM0ExNTY5NTY0NjAyOTA0MjYwNjEwJTJDJTIydXNlck5hbWUlMjIlM0ElMjIlRTklQTklQUMlRTYlOUQlQjAlMjIlMkMlMjJ1c2VyVHlwZSUyMiUzQSUyMmVtcGxveWVlJTIyJTdEIiwidXNlcl9uYW1lIjoiMzAwMTAwMTAwMTAwMDAwNjsxNTY5NTY0NjAyOTA0MjYwNjEwO2VtcGxveWVlO25vcm1hbCIsIm9yZ19pZCI6MzAwMTAwMTAwMTAwMDAwNiwic2NvcGUiOlsid3JpdGUiXSwiZXhwIjoxNzAzNjY2MDU0LCJqdGkiOiI1YjJlYTE5OS04ZTdmLTQxYWEtYTIyMC1hNjA0NTgyODk3ZDIiLCJjbGllbnRfaWQiOiJzaXQifQ.m2Zf3NmlRW0913pP0NcMb0NDdWRnk07hf2YALGmfX3sxqVq6SNAt1PsPDq1GaWT1gRafHNgij-4S42EJOTmJYOWRqaR0o67s9B8RvFz3qW2wfSuDrTWwVplQJcpNru-dGgP5FgKq8TUdYvzW5d5K1bonyh2pp3m2U-Fet-Bhcic';

  const props111 = {
    title: '添加',
    controls,
    initialValues: {
      columnIds: ['1637644811258527746', '1642720376200835073'],
      img: '0',
      time: [moment(moment(), 'YYYY-MM-DD'), null],
      userDeptList: [
        {
          id: '1561967846723284994',
          name: '客服 001',
          type: 'USER',
        },
      ],
      a: [
        {
          id: '1589512616673996995',
          name: '备孕_群用户属性',
          type: 'GROUP_TAG',
          contactType: 14,
        },
      ],
      deptIds: [
        {
          name: '',
          id: '',
        },
      ],
    },

    request: {
      url: `/web/robot/save`,
      method: 'POST',
    },

    actions: [
      {
        uiType: 'button',
        props: {
          children: '取消',
        },
      },
      {
        uiType: 'submit',
        props: {
          children: '保存',
          type: 'primary',
          'data-submit-action': 'submit',
        },
      },
    ],

    onFinish: (form, currentTarget) => {
      console.log(form, currentTarget);
    },
    onSubmit: (form, currentTarget) => {
      console.log(form, currentTarget);
    },
  };

  const selectUserProps = {
    userOrigin: 'https://front.sit.suosihulian.com/gateway/user-center',
    disabled: true,
  };

  const selectUserProps2 = {
    disabled: false,
    showTabList: ['weChatTagContacts'],
    userOrigin: 'https://front.sit.suosihulian.com/gateway/user-center',
    unCheckableNodeType: ['ORG'],
    isSaveSelectSignature: true,
    multiple: true,
    requestParams: {
      selectTypeList: ['tag'],
    },
    onlyLeafCheckable: true,
    selectType: 'dept',
    searchPlaceholder: '请选择',
    dialogProps: {
      title: '请选择',
    },
  };

  const props2 = {
    controls,
    initialValues: {
      remark: '1699973600257142786',
      userDeptList: [
        {
          id: '1561967846723284994',
          name: '客服 001',
          type: 'USER',
        },
      ],
      columnIds: ['1637644811258527746', '1642720376200835073'],
    },
    actions: [
      {
        uiType: 'button',
        props: {
          children: '取消',
          'data-submit-action': 'goBack',
          onClick() {
            // setDelayVis(false);
          },
        },
      },
      {
        uiType: 'submit',
        props: {
          children: '确认',
          type: 'primary',
          'data-submit-action': 'refresh',
        },
      },
    ],
    dataFormatBeforeSubmit: async (formValue) => {
      console.log(formValue, 'formValue');
      const { executionTime, time, remark } = formValue;
      // console.log('formValue', formValue);
      return {
        ...formValue,
        executionTime: `${executionTime} ${time}`,
        remark,
      };
    },
    onFinish(cancelForm, btnTarget) {
      const { submitAction } = btnTarget.dataset;

      if (submitAction === 'refresh') {
        // setDelayVis(false);
        // getData(keyword);
      }
    },
  };

  const datePickerProps = {
    dateFormat: 'YYYY-MM-DD',
    format: 'YYYY-MM-DD',
    showToday: true,
  };
  FormConfirm({
    formProps: {
      controls: [
        {
          name: 'input',
          uiType: 'input',
          rules: [{ required: true, message: '请输入原因备注' }],
        },
      ],
      labelCol: {
        xs: {
          span: 19,
        },
        sm: {
          span: 0,
        },
      },
      wrapperCol: {
        xs: {
          span: 19,
        },
        sm: {
          span: 24,
        },
      },

      actions: [
        {
          uiType: 'button',
          props: {
            children: '取消',
          },
        },
        {
          uiType: 'submit',
          props: {
            children: '保存',
            type: 'primary',
            'data-submit-action': 'submit',
          },
        },
      ],
    },
    dialogProps: {
      title: '222',
    },
    onConfirm: (args) => {
      console.log(args);
    },
    topExtra: '请输入发送至155****7860的短信验证码',
  });

  return (
    <div style={{ background: '#fbfcfc', width: '900px' }} ref={wrapRef}>
      <BaseRangePicker {...rangePickerProps} />
      <BaseRangePicker
        disabledDate={rangePickerProps.disabledDate}
        disabledTime={rangePickerProps.disabledRangeTime}
        showTime={rangePickerProps.showTime}
        format={rangePickerProps.format}
      />
      <RangePicker
        disabledDate={disabledDate}
        disabledTime={disabledRangeTime}
        showTime
        format="YYYY-MM-DD HH:mm:ss"
      />
      <ComposeForm
        {...props111}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 19 }}
      />
    </div>
  );
};
```

More skills for writing demo: https://d.umijs.org/guide/basic#write-component-demo
