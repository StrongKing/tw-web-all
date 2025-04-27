import React from 'react';
import ComposeForm from '@/components/compose-form';

export default () => {
  const props2 = {
    // title: '延期生效',
    controls: [
      {
        label: 'aaa',
        name: 'aaa',
        props: {
          valueFormatter: (val) => {
            console.log(val);
            return `bbb${val}`;
          },
        },
        comparision: {
          isComparisionEqual: (val, oldVal) => {
            console.log(val, oldVal);
            return true;
          },
        },
      },
      {
        label: 'bbb',
        name: 'bbb',
        uiType: 'input',
      },
      {
        label: 'ddd',
        name: 'ddd',
      },
    ],
    initialValuesRequest: {
      url: '/data/get-form-data.json',
      method: 'GET',
    },
    comparision: {
      enable: true,
    },
  };
  return (
    <ComposeForm {...props2} labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} />
  );
};
