import React from 'react';
import ComposeForm from '@/components/compose-form';

const DrawLottery = ({ id, title = '', luckyNumberSource = '' }) => {
  const props = {
    initialValues: { title, luckyNumberSource },
    controls: [
      {
        label: '标题',
        uiType: 'text',
        name: 'title',
      },
      {
        label: '幸运号码来源',
        uiType: 'text',
        name: 'luckyNumberSource',
      },
      {
        label: '幸运号码',
        uiType: 'number',
        name: 'luckyNumber',
        props: { min: 1 },
        rules: [{ message: '幸运号码为空', required: true }],
      },
      {
        name: 'content',
        uiType: 'rich-text',
        label: '内容',
        rules: [
          {
            message: '请输入',
            required: true,
          },
        ],
        props: {
          showMenu: true,
          showQuickMenu: false,
        },
      },
    ],
    request: {
      url: `https://front.sit.suosihulian.com/gateway/game-season/web/lottery/draw`,
      method: 'post',
      params: {
        id,
      },
    },
    showActionInPageFooter: false,
    labelCol: {
      xs: { span: 5 },
      sm: { span: 5 },
    },
    wrapperCol: {
      xs: { span: 19 },
      sm: { span: 19 },
    },
    actions: [
      {
        uiType: 'button',
        props: {
          children: '取消',
          'data-submit-action': 'goBack',
        },
      },
      {
        uiType: 'submit',
        props: {
          children: '确定',
          type: 'primary',
          'data-submit-action': 'goBack',
        },
      },
    ],
  };
  return <ComposeForm {...props} />;
};

export default DrawLottery;
