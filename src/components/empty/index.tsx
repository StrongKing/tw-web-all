import React, { useMemo } from 'react';
import { Button } from 'antd';
import classNames from 'classnames';
import { EmptyProps } from './interface';
import  './index.less';

import img404 from './imgs/404.svg';
import img500 from './imgs/500.svg';
import permissionImg from './imgs/permission.svg';
import neterrImg from './imgs/neterr.svg';
import constructImg from './imgs/construct.svg';
import searchImg from './imgs/search.svg';
import emptyImg from './imgs/empty.svg';
import recallImg from './imgs/recall.svg';
import deleteImg from './imgs/delete.svg';
import loadingImg from './imgs/loading.svg';

const Empty = ({
  className = '',
  style = {},
  type = 'empty',
  img,
  text,
  btnText = '',
  onClick = () => {},
}: EmptyProps) => {
  const emptyConfig: {
    [key: string]: { img: string; text: string };
  } = {
    '404': {
      img: img404,
      text: '页面丢失',
    },
    '500': {
      img: img500,
      text: '500错误',
    },
    permission: {
      img: permissionImg,
      text: '无权限',
    },
    neterr: {
      img: neterrImg,
      text: '网络异常，请再次重试',
    },
    construct: {
      img: constructImg,
      text: '正在建设中...',
    },
    search: {
      img: searchImg,
      text: '没有搜索到相关内容',
    },
    empty: {
      img: emptyImg,
      text: '暂无内容',
    },
    recall: {
      img: recallImg,
      text: '内容已撤回',
    },
    delete: {
      img: deleteImg,
      text: '内容已删除',
    },
    loading: {
      img: loadingImg,
      text: '努力加载中，请稍后...',
    },
  };
  const str = useMemo(() => text ?? emptyConfig[type].text ?? '', [type, text]);
  const image = useMemo(() => img ?? emptyConfig[type].img ?? '', [type, img]);
  return (
    <div className={classNames('ss-empty', className)} style={style}>
      {image && (
        <img className='ss-empty-img' src={image} alt={type} />
      )}
      {str && <p className='ss-empty-text'>{str}</p>}
      {btnText && (
        <Button
          type="primary"
          className='ss-empty-btn'
          onClick={onClick}
        >
          {btnText}
        </Button>
      )}
    </div>
  );
};

export default Empty;
