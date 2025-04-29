import React from 'react';
import ComposeForm from '@/components/compose-form';

export default () => {
  const props2 = {
    // title: '延期生效',
    controls: [
      {
        label: 'aaa',
        name: 'aaa',
        inlineLayoutCol: { span: 8 },
      },
      {
        label: 'bbb',
        name: 'bbb',
        uiType: 'input',
        inlineLayoutCol: { span: 8 },
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
    labelCol: { flex: '0 0 100px' },
    wrapperCol: { flex: 1 },
    initialValuesRequest: {
      url: '/data/get-form-data.json',
      method: 'GET',
    },
    comparision: {
      enable: true,
    },
  };
  return <ComposeForm {...props2} />;
};
