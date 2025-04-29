<!--
 * @Author: 大鸡腿 734164941@qq.com
 * @Date: 2022-08-23 13:45:50
 * @LastEditors: 大鸡腿 734164941@qq.com
 * @LastEditTime: 2022-10-10 15:24:50
 * @FilePath: \suo-uicomponent\docs\Form\index.md
 *
 * Copyright (c) 2022 by 大鸡腿 734164941@qq.com, All Rights Reserved.
-->

## compose-form

Demo:

```tsx
import React, { useState, useRef, createRef, useEffect } from 'react';
import moment from 'moment';
import { Modal } from 'antd';
import { groupBy } from 'lodash';
import ComposeForm from '@/components/compose-form';
import EventEmitter from '@/components/compose-form/events';
import Card from '@/components/expand-collapse';
import { getRangeMap } from '@/common/dateRange';
import Empty from '@/components/empty';
import {
  RangePicker_ as BaseRangePicker,
  DatePicker_ as BaseDatePicker,
} from '@/components/compose-form/mod/datePick';

export default () => {
  // const eventEmitter = useRef(new EventEmitter());
  const formRef = createRef();
  const wrapRef = useRef(null);
  const [wrapWith, setWrapWith] = useState(null);

  useEffect(() => {
    if (wrapRef?.current?.clientWidth) {
      setWrapWith(wrapRef?.current?.clientWidth - 40);
    }
  }, [wrapRef?.current]);
  const initFormSource = [
    // {
    //   name: 'executionTime',
    //   label: '生效时间',
    //   uiType: 'date-range-picker',
    //   props: {
    //     // showTime: true,
    //     dateFormat: 'YYYY-MM-DD HH:mm',
    //     format: 'YYYY-MM-DD HH:mm',
    //     showTime: true,
    //     showRanges: false,
    //     ranges: getRangeMap(0),
    //   },
    //   rules: [{ required: true, message: '请选择生效时间' }],
    // },
    // {
    //   name: 'executionTime1',
    //   label: '生效时间1',
    //   uiType: 'date-range-picker',
    //   props: {
    //     // showTime: true,
    //     dateFormat: 'YYYY-MM-DD HH:mm',
    //     format: 'YYYY-MM-DD HH:mm',
    //     showTime: true,
    //     showRanges: true,
    //     offsetDay: -1,
    //   },
    //   rules: [{ required: true, message: '请选择生效时间' }],
    // },
    // {
    //   name: 'time',
    //   label: '时间',
    //   uiType: 'date-picker',
    //   props: {
    //     showToday: true,
    //     dateFormat: 'YYYY-MM-DD',
    //     format: 'YYYY-MM-DD',
    //   },
    //   rules: [{ required: true, message: '请选择生效时间' }],
    // },
    {
      label: 'aaa',
      name: 'aaa',
      props: {
        valueFormatter: (val) => {
          console.log(val);
          return 'bbb' + val;
        },
      },
    },
    {
      label: 'ddd',
      name: 'ddd',
    },
    {
      uiType: 'upload-img',
      label: '图片上传',
      name: 'img',
      props: {
        appCode: 'hsk',
        maxCount: 1,
        requestParams: {
          // orgId: '111',
        },
        requestUrl: 'https://front.sit.suosihulian.com/gateway/file-center',
        typeMaxSize: { gif: 0.5 },
      },
    },
    {
      uiType: 'upload-img',
      label: '图片上传',
      name: 'img1',
      props: {
        disabled: true,
        appCode: 'hsk',
        maxCount: 1,
        requestParams: {
          // orgId: '111',
        },
        requestUrl: 'https://front.sit.suosihulian.com/gateway/file-center',
        typeMaxSize: { gif: 0.5 },
      },
    },
    {
      uiType: 'upload-file',
      label: '视频上传',
      name: 'video11',
      props: {
        appCode: 'hsk',
        accept: '.mp4',
        maxCount: 1,
        maxSize: 10,
        tips: '提示：视频大小10MB以内，支持MP4格式',
        requestUrl: 'https://front.sit.suosihulian.com/gateway/file-center',
      },
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
  //最后结果：
  // newArr = [
  //   {
  //     name: '一组组组组组组组组组组组组组组组组组组组222222哈哈1',
  //     data: [
  //       {
  //         materialName: '耗材一',
  //         deliverStatus: '状态一',
  //       },
  //     ],
  //   },
  //   {
  //     name: '二组组组组组组组组组组组组组组组组组组组222222哈哈2',
  //     data: [
  //       {
  //         materialName: '耗材一',
  //         deliverStatus: '状态一',
  //       },
  //       {
  //         materialName: '我是materialName',
  //         deliverStatus: '状态不明',
  //       },
  //     ],
  //   },
  // ];

  // const [list, setList] = useState([]);
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
    'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2luZm8iOiIlN0IlMjJhdmF0YXIlMjIlM0ElMjJodHRwcyUzQSUyRiUyRndld29yay5xcGljLmNuJTJGd3dwaWMzYXolMkY3ODg2NzNfeHpJZ1VCcTBTU1c1bWZYXzE3MTY1Njc0NzglMkYwJTIyJTJDJTIyY29ycElkJTIyJTNBJTIyd3BvRzg0Q2dBQWpWZThBU21zbFd1eTFla3ZzSVFXUHclMjIlMkMlMjJpbmR1c3RyeVR5cGUlMjIlM0ElMjJteXR4bCUyMiUyQyUyMmxvZ2luVHlwZSUyMiUzQSUyMm5vcm1hbCUyMiUyQyUyMm1lbWJlcklkJTIyJTNBMTU2OTU2NDYwMjkwNDI2MDYxMCUyQyUyMm1lbWJlck5hbWUlMjIlM0ElMjIlRTklQTklQUMlRTYlOUQlQjAlMjIlMkMlMjJtb2JpbGUlMjIlM0ElMjIxODc1ODI4NzAwMSUyMiUyQyUyMm9yZ0lkJTIyJTNBMzAwMTAwMTAwMTAwMDAwNiUyQyUyMm9yZ05hbWUlMjIlM0ElMjIlRTYlOUQlQUQlRTUlQjclOUUlRTYlQUQlQTMlRTUlOUQlOUIlRTclQTclOTElRTYlOEElODAlRTYlOUMlODklRTklOTklOTAlRTUlODUlQUMlRTUlOEYlQjglRUYlQkMlODglRTYlQUYlOEQlRTUlQTklQjQlRUYlQkMlODklMjIlMkMlMjJvcmdUeXBlJTIyJTNBJTIyZ2VuZXJhbCUyMiUyQyUyMnJlZ2lvbkNvZGUlMjIlM0ElMjIzMzAxMDIwMDAwMDAwMDAwMDAlMjIlMkMlMjJzaG9ydE5hbWUlMjIlM0ElMjIlRTYlQUQlQTMlRTUlOUQlOUIlRTclQTclOTElRTYlOEElODAlMjIlMkMlMjJ1c2VySWQlMjIlM0ExNTY5NTY0NjAyOTA0MjYwNjEwJTJDJTIydXNlck5hbWUlMjIlM0ElMjIlRTklQTklQUMlRTYlOUQlQjAlMjIlMkMlMjJ1c2VyVHlwZSUyMiUzQSUyMmVtcGxveWVlJTIyJTdEIiwidXNlcl9uYW1lIjoiMzAwMTAwMTAwMTAwMDAwNjsxNTY5NTY0NjAyOTA0MjYwNjEwO2VtcGxveWVlO25vcm1hbCIsIm9yZ19pZCI6MzAwMTAwMTAwMTAwMDAwNiwic2NvcGUiOlsid3JpdGUiXSwiZXhwIjoxNzM0NjY0NTkzLCJqdGkiOiJmODYwMDMzMC1kYzU5LTQ0OGQtOTg0OC00ZWJjMWMzNTA4MjMiLCJjbGllbnRfaWQiOiJzaXQifQ.mZuwjAZ9KY4Mpa7T7v4HFrcU33qOIP_kJtjKcKvADiHV1-VV089mPRfVEmV0_1Zl7VBZ5J9Odmy-1ADBcLo9iahNwlzlBvFoJIjtSeYhVmFcOQAW3Jsjxm5lclKAPvnitJSS6WC5rbA0_KawjnrLuJGR9Rp1md8TolElFxBTjWY';
  const dataForm = [
    {
      uiType: 'date-range-picker-disabled',
      name: 'time',
      label: '有效期',
      props: {
        dateFormat: 'YYYY-MM-DD',
        // defaultValue: [moment(moment(), 'YYYY-MM-DD'), null],
        // disabled: [true, false],
        tips: '有限期到期后，不会对已经选择该人群包的业务产生影响，仅会让业务无法选择到该人群包。',
      },
    },
    {
      uiType: 'upload-img',
      label: '图片上传',
      name: 'img',
      props: {
        appCode: 'hsk',
        maxCount: 1,
        isUseGroupId: false,
        requestParams: {
          // orgId: '111',
        },
        requestUrl: '//front.sit.suosihulian.com/gateway/file-center',
      },
    },
    {
      label: '选择客户白名单',
      name: 'customerSignature',
      props: {
        btnText: '请选择',
        selectUserProps: {
          userOrigin: 'https://front.sit.suosihulian.com/gateway/user-center',
          multiple: true,
          showTabList: ['maternalContacts', 'customerTagContacts'],
          dialogProps: {
            title: '请选择',
          },
          isSaveSelectSignature: true,
          requestParams: {
            selectTypeList: ['user', 'tag'],
            tagTypeList: [0],
          },
          selectType: 'dept',
        },
      },
      rules: [],
      uiType: 'selectUser',
    },
  ];
  const props = {
    title: '添加',
    controls: dataForm,
    initialValues: {
      aaa: 'ccc',
      img: '0',
      time: [moment(moment(), 'YYYY-MM-DD'), null],
      // groupId: '1536330523708399617',
      // deviceId: [
      //   {
      //     id: '1526430948989280258',
      //     name: '测试运营标签',
      //     type: 'CUSTOMER_TAG',
      //     contactType: 9,
      //     childDelete: true,
      //     noTagLabelPermission: true,
      //   },
      // ],
      // deviceId: '3001001001000006-202207171658073249630',
      a: [
        {
          id: '1589512616673996995',
          name: '备孕_群用户属性',
          type: 'GROUP_TAG',
          contactType: 14,
        },
      ],

      // test4: '1509105356252717058',
      // select: 1,
      // checkboxGroup: 1,
      deptIds: [
        {
          name: '',
          id: '',
        },
      ],
    },
    comsMap: {},
    request: {
      url: 'https://baidu.com',
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
      // {
      //   uiType: 'button',
      //   props: {
      //     customLoading: false,
      //     customDisabled: true,
      //     type: 'primary',
      //     children: '提交',
      //     'data-submit-action': 'add',
      //   },
      // },
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
    // disabled: true,
    // target: 'tool',
    // modalWidth: 300,
    selectType: 'dept',
    searchPlaceholder: '请选择',
    dialogProps: {
      title: '请选择',
    },
  };

  const props2 = {
    // title: '延期生效',
    controls,
    initialValuesRequest: {
      url: '/data/get-form-data.json',
      method: 'GET',
    },
    comparision: {
      enable: true,
    },
    // initialValues: {
    //   aaa: 'ccc',
    //   cusSignature: [
    //     {
    //       childDelete: true,
    //       contactType: 11,
    //       extendedAttribute: {
    //         realName: '马杰',
    //         externalUserId: 'wmoG84CgAAhJVh6QoAmZzAgic0Z40DsQ',
    //         openId: '',
    //       },
    //       externalUserId: 'wmoG84CgAAhJVh6QoAmZzAgic0Z40DsQ',
    //       openId: '',
    //       realName: '马杰',
    //       id: 'wmoG84CgAAhJVh6QoAmZzAgic0Z40DsQ',
    //       key: 'wmoG84CgAAhJVh6QoAmZzAgic0Z40DsQ',
    //       name: '马杰(wmoG84CgAAhJVh6QoAmZzAgic0Z40DsQ)',
    //       type: 'EXTERNAL_USER',
    //     },
    //   ],
    // },
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

  const onCancel = () => {
    // setDelayVis(false);
  };

  // return (
  //   <div>
  //     <ComposeForm {...props}></ComposeForm>
  //   </div>
  // );
  const rangePickerProps = {
    dateFormat: 'YYYY-MM-DD HH:mm',
    format: 'YYYY-MM-DD HH:mm',
    showTime: true,
    showRanges: true,
  };
  const datePickerProps = {
    dateFormat: 'YYYY-MM-DD',
    format: 'YYYY-MM-DD',
    showToday: true,
  };
  return (
    <div style={{ background: '#fbfcfc', width: '500px' }} ref={wrapRef}>
      <BaseRangePicker {...rangePickerProps} />
      <BaseDatePicker {...datePickerProps} />
      <div>3333</div>
      {list?.length > 0 && (
        <div
          onClick={() => {
            formRef.current.showSelectUser();
          }}
        >
          测试测试测试
        </div>
      )}
      <ComposeForm
        {...props2}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 19 }}
      />

      <Modal
        title="延期生效"
        footer={null}
        destroyOnClose
        visible={false}
        okText="确认"
        cancelText="取消"
        wrapClassName="modal-form-wrap"
      >
        <ComposeForm
          {...props2}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 19 }}
        />
      </Modal>
    </div>
  );
};
```

<code src="./requestDemo.tsx" description="请求报错">请求报错</code>

<code src="./comparisionDemo.tsx" description="对比">对比</code>
<code src="./formItemLayoutDemo.tsx" description="布局">布局</code>

More skills for writing demo: https://d.umijs.org/guide/basic#write-component-demo
