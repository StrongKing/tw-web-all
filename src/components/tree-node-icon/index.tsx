import React from 'react';
import './index.less';

// 标签
export const TagIcon: React.FunctionComponent = () => {
  return <span className="user-center-tree-node-icon select-user-icon-tag" />;
};

// 标签组
export const TagGroupIcon: React.FunctionComponent = () => {
  return (
    <span className="user-center-tree-node-icon select-user-icon-tag-group" />
  );
};

// 部门
export const DeptIcon: React.FunctionComponent = () => {
  return <span className="user-center-tree-node-icon select-user-icon-dept" />;
};

// 用户
export const UserIcon: React.FunctionComponent = () => {
  return <span className="user-center-tree-node-icon select-user-icon-user" />;
};

// 群
export const GroupIcon: React.FunctionComponent = () => {
  return <span className="user-center-tree-node-icon select-user-icon-group" />;
};

// 组织
export const OrgIcon: React.FunctionComponent = () => {
  return <span className="user-center-tree-node-icon select-user-icon-org" />;
};

//行政区划
export const XzqhIcon: React.FunctionComponent = () => {
  return <span className="user-center-tree-node-icon select-user-icon-xzqh" />;
};

//设备
export const EqumentIcon: React.FunctionComponent = () => {
  return (
    <span className="user-center-tree-node-icon select-user-icon-equment" />
  );
};
//设备
export const HouseIcon: React.FunctionComponent = () => {
  return <span className="user-center-tree-node-icon select-user-icon-house" />;
};

// 根节点
export const RootIcon: React.FunctionComponent = () => {
  return <span className="user-center-tree-node-icon select-user-icon-root" />;
};

// 社区
export const CommunityIcon: React.FunctionComponent = () => {
  return (
    <span className="user-center-tree-node-icon select-user-icon-community" />
  );
};
// 资源
export const ResourceIcon: React.FunctionComponent = () => {
  return (
    <span className="user-center-tree-node-icon select-user-icon-resource" />
  );
};

// 公众号
export const GzhList: React.FunctionComponent = () => {
  return <span className="user-center-tree-node-icon gzh-list-icon" />;
};
// 公众号文章
export const GzhGroup: React.FunctionComponent = () => {
  return <span className="user-center-tree-node-icon gzh-group-icon" />;
};

// 菜单
export const menuIcon: React.FunctionComponent = () => {
  return <span className="user-center-tree-node-icon menu-icon" />;
};

// 内容模型
export const contentIcon: React.FunctionComponent = () => {
  return <span className="user-center-tree-node-icon content-icon" />;
};

// 任务管理
export const taskIcon: React.FunctionComponent = () => {
  return <span className="user-center-tree-node-icon task-icon" />;
};

export const conditionIcon: React.FunctionComponent = () => {
  return <span className="user-center-tree-node-icon condition-icon" />;
};
// 活码
export const liveCodeIcon: React.FunctionComponent = () => {
  return <span className="user-center-tree-node-icon livecode-icon" />;
};

export type IconType =
  | 'root'
  | 'province'
  | 'country'
  | 'area'
  | 'equipment'
  | 'city'
  | 'street'
  | 'community'
  | 'resource'
  | 'resource_group'
  | 'village'
  | 'building'
  | 'cell'
  | 'house'
  | 'org'
  | 'dept'
  | 'disabled-dept'
  | 'dept-position'
  | 'disabled-home'
  | 'disabled-user'
  | 'no_group'
  | 'group'
  | 'tag'
  | 'tag-label'
  | 'tag-group'
  | 'menu_first'
  | 'menu_second'
  | 'user'
  | 'gzh-group'
  | 'gzh-list'
  | 'icon-region'
  | 'icon-content'
  | 'shop'
  | 'partner'
  | 'condition'
  | 'liveCode'
  | 'liveCodeGroup'
  | 'icon-task';

const iconMap: {
  [iconType in IconType]: React.ComponentType;
} = {
  org: OrgIcon,
  dept: DeptIcon,
  root: RootIcon,
  province: XzqhIcon,
  country: XzqhIcon,
  city: XzqhIcon,
  'disabled-dept': XzqhIcon,
  area: XzqhIcon,
  street: XzqhIcon,
  community: CommunityIcon,
  resource: ResourceIcon,
  resource_group: ResourceIcon,
  building: HouseIcon,
  cell: HouseIcon,
  village: HouseIcon,
  house: HouseIcon,
  group: GroupIcon,
  tag: TagIcon,
  'dept-position': DeptIcon,
  'disabled-home': DeptIcon,
  no_group: DeptIcon,
  'tag-group': TagGroupIcon,
  'tag-label': TagIcon,
  shop: DeptIcon,
  partner: DeptIcon,
  user: UserIcon,
  menu_first: menuIcon,
  menu_second: menuIcon,
  'disabled-user': UserIcon,
  equipment: EqumentIcon,
  'gzh-group': GzhGroup,
  'gzh-list': GzhList,
  'icon-region': XzqhIcon,
  'icon-content': contentIcon,
  'icon-task': taskIcon,
  condition: conditionIcon,
  liveCode: liveCodeIcon,
  liveCodeGroup: TagGroupIcon,
};

export default iconMap;
