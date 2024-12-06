// loading module
// @author Pluto <huarse@gmail.com>
// @create 2018/05/22

import React from 'react';
import classNames from 'classnames';
import './index.less';
import imgSrc from './permission.svg';

export default function PermissionMod({
  horizontal = false,
  showImg = true,
  height = '100%',
  className,
  noborder,
  text = '权限不足',
}) {
  const clazz = classNames('container', 'loading', 'className', {
    horizontal,
    bordered: !noborder,
  });

  return (
    <div className={clazz} style={{ height }}>
      {showImg ? (
        <div className="imgbox">
          <img src={imgSrc} alt="" />
        </div>
      ) : null}
      {text ? <div className="per-desc">{text}</div> : null}
    </div>
  );
}
