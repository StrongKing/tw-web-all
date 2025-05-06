import React, { useState } from 'react';
import { Switch } from 'antd';
import ComposeForm from '@/components/compose-form';

export default () => {
  const [inlineFlex, setInlineFlex] = useState(true);
  const props2 = {
    inlineFlex,
    // title: '延期生效',
    controls: [
      {
        label: 'aaa',
        name: 'aaa',
        layoutCol: { span: 8 },
      },
      {
        label: 'bbb',
        name: 'bbb',
        uiType: 'input',
        layoutCol: { span: 8 },
      },
      {
        label: 'ddd',
        name: 'ddd',
        labelCol: { span: 4 },
        wrapperCol: { span: 18 },
      },
      {
        label: 'eee',
        name: 'eee',
        labelCol: { span: 4 },
        wrapperCol: { span: 18 },
      },
    ],
    layout: 'inline',
    labelCol: { flex: '0 0 80px' },
    inlineLayoutCol: { span: 8 },
    wrapperCol: { flex: 1 },
    initialValuesRequest: {
      url: '/data/get-form-data.json',
      method: 'GET',
    },
    comparision: {
      enable: true,
    },
  };
  return (
    <div>
      inlineFlex：
      <Switch checked={inlineFlex} onChange={(val) => setInlineFlex(val)} />
      <ComposeForm {...props2} />
    </div>
  );
};
