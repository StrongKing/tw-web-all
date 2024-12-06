// loading module
// @author Pluto <huarse@gmail.com>
// @create 2018/05/22

import React from 'react';
import classNames from 'classnames';
import './index.less';
import loadingGif from './loading.gif';

export default function LoadingMod({
  horizontal = false,
  imgSrc = loadingGif,
  showImg = true,
  height = '200px',
  className,
  noborder,
  children,
}) {
  const clazz = classNames('container', 'loading', 'className', {
    horizontal: horizontal,
    bordered: !noborder,
  });

  return (
    <div className={clazz} style={{ height }}>
      {showImg ? (
        <div className="imgbox">
          <img src={imgSrc} alt="" />
        </div>
      ) : null}
      {children ? <div className="desc">{children}</div> : null}
    </div>
  );
}
