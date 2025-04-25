import React, { Suspense } from 'react';
import { PropTypes } from './interface';
import Button from './default';
import { Spin } from '@/components/blank';
import { Badge, Tooltip } from 'antd';

const comsMap = {
  default: Button,
  event: React.lazy(() => import('./event')),
  // 下载型按钮，参数�? request 类型按钮一致，接口返回�? data 字段为下载链�?
  download: React.lazy(() => import('./download')),
  sync: React.lazy(() => import('./sync')),
  form: React.lazy(() => import('./form')),
  'drawer-form': React.lazy(() => import('./drawerForm')),
  'business-card': React.lazy(() => import('./business-card')),
  request: React.lazy(() => import('./request')),
  link: React.lazy(() => import('./link')),
  'checkbox-group': React.lazy(() => import('../checkbox-group')),
  a: React.lazy(() => import('./anchor')),
  anchor: React.lazy(() => import('./anchor')),
  // batch: React.lazy(() => import('./batch')),
  upload: React.lazy(() => import('./upload')),
  'select-search': React.lazy(() => import('./select-search')),
  countdown: React.lazy(() => import('./countdown')),
  // 前端导出
  downloadFe: React.lazy(() => import('./downloadFe')),
  // 弹框表格
  table: React.lazy(() => import('./table')),
};

const withOuterComp =
  (Comp: any, OuterComp: any, outerPropsName: keyof PropTypes) =>
  ({ [outerPropsName]: outerProps, ...others }: PropTypes) => {
    return outerProps ? (
      <OuterComp {...outerProps}>
        <Comp {...others} />
      </OuterComp>
    ) : (
      <Comp {...others} />
    );
  };
const outerCompList = [
  [Badge, 'badgeProps'],
  [Tooltip, 'tooltipProps'],
];

export default ({ uiType = 'default', ...others }: PropTypes) => {
  let BtnCom = comsMap[uiType] || Button;
  outerCompList.forEach(([OuterComp, outerPropsName]) => {
    BtnCom = withOuterComp(
      BtnCom,
      OuterComp,
      outerPropsName as keyof PropTypes,
    );
  });
  // @ts-ignore
  return (
    <Suspense fallback={<Spin />}>
      <BtnCom {...others} />
    </Suspense>
  );
};
