import { ModalProps } from 'antd/lib/modal';
export interface ValueObj {
  // 快照 id，用于获取已有数据
  selectSignature?: string;
  // 当前所属组织 ID
  orgId?: string | number;
  // 人员列表
  userInfoList: IlistItem[];
  // 部门列表
  deptInfoList: IlistItem[];
  // 标签列表
  tagInfoList: IlistItem[];
  // 客户标签
  customerTagInfoList: IlistItem[];
  // 客户
  maternalInfoList: IlistItem[];
  // 群标签
  groupTagInfoList: IlistItem[];
  // 圈子标签
  circlesTagInfoList: IlistItem[];
  // 内容标签
  contentTagInfoList: IlistItem[];

  // 组织列表
  orgInfoList: IlistItem[];
  // 分组列表
  groupInfoList: IlistItem[];
  externalUserInfoList: IlistItem[];
}

export type NodeType =
  | 'USER'
  | 'ORG'
  | 'DEPT'
  | 'GROUP_DEPT'
  | 'GROUP'
  | 'TAG'
  | 'ORG_REL';
export interface PropTypes {
  // 快照 id，用于获取已有数据
  selectSignature?: string;
  // 是否需要请求后台保存快照，true(默认): 在onOk的时候请求后台保存快照; false: 在onOk的时候仅返回当前选中的数据
  isSaveSelectSignature?: boolean;
}
export interface selectUserPropType {
  // origin
  userOrigin?: string;
  //
  strictUser?: any;
  // 显示时的初始数据，优先级低于 selectSignature。
  defaultValue?: IdefaultValue;
  // 快照 id，用于获取已有数据
  selectSignature?: string;
  // 是否需要请求后台保存快照，true(默认): 在onOk的时候请求后台保存快照; false: 在onOk的时候仅返回当前选中的数据
  isSaveSelectSignature?: boolean;
  // 弹层是否显示
  visible: boolean;
  // 需要展示的 tab 选项列表，默认为当前组织类型下的所有 tab
  // 展示的选项卡列表
  showTabList: (
    | 'dept' // 部门
    | 'group' // 下属组织
    | 'innerContacts' // 内部通讯录
    | 'equipmentContacts' // 内部通讯录
    | 'maternalContacts' //
    | 'customerTagContacts' //
    | 'schoolContacts' // 家校通讯录
    | 'groupTagContacts' // 群标签
    | 'groupContacts'
    | 'tags' // 标签
    | 'orgRel'
  )[]; // 行政组织
  onCancel?: () => void;
  onOk(value: Value): void;
  // 选择模式：人 or 部门，默认 'user'
  selectType?: 'user' | 'dept'; // 对应异步请求传 selectUser: true, false
  // 不可选节点类型, 不传默认全部可选
  unCheckableNodeType?: NodeType[];
  // 仅叶子节点可选, 搭配selectType使用, 默认为false
  // 当selectType为user时，仅可选人
  // 当selectType为dept时，仅可选部门叶子节点
  onlyLeafCheckable?: boolean;
  // 搜索框的提示文案，默认为 “搜索姓名、部门名称、手机号”
  searchPlaceholder?: string;
  // 是否多选，默认 true
  multiple?: boolean;
  // 透传给模态框的属性，如标题等，默认 {}
  dialogProps?: ModalProps;
  // 请求的基础路径，默认 'pc'
  basePath?: 'pc' | 'mobile';
  // 请求需要的额外参数
  requestParams?: {
    // 基础校区还是自定义校区
    campusType?: 'base_school_type' | 'custom_school_type';
    // 仅展示分组
    onlySelectGroup?: boolean;
    // 是否严格区分不同部门下的同一个人，默认为 false，如果为 true，则不同部门下的同一个人会认为是两个人，选择后会带上部门信息。
    strictUser?: boolean;
    // 企业微信 id，移动端鉴权用
    corpId?: string;
    // 部门类型 家校通讯录基础校区下班级class/自定义校区下自定义班级custom_class
    deptTypeList?: any;
    // 选择类型 只可选用户user,部门dept,组织org,分组group,标签tag
    selectTypeList?: any;
    // 仅在tab为下属组织时生效，'0' 虚拟节点|'1'实体节点
    nodeType?: '0' | '1';
    // 仅在tab为标签时生效，0个人标签，1通用标签，2系统标签，3员工系统标签
    tagTypeList?: ['0', '1', '2', '3'];
  };
  selectPaneProps?: any;
  // 通过签名获取该签名下组织节点
  getCheckedNodes?(value: Value): void;
  // 通过签名获取人数，只会统计人数信息，当需要统计部门信息时，需要应用自己在onOk或者getCheckedNodes里遍历结果
  getTotalCount?(value: any): void;
}

export type Value = ValueObj;

export interface IdefaultValue {
  deptInfoList?: IlistItem[];
  orgInfoList?: IlistItem[];
  userInfoList?: IlistItem[];
  tagInfoList?: IlistItem[];
  // 客户标签
  customerTagInfoList?: IlistItem[];
  // 客户
  maternalInfoList?: IlistItem[];
  // 群标签
  groupTagInfoList?: IlistItem[];
  // 圈子标签
  circlesTagInfoList?: IlistItem[];
  // 内容标签
  contentTagInfoList?: IlistItem[];

  groupInfoList?: IlistItem[];
  orgRelInfoList?: IlistItem[];
  equipmentInfoList?: IlistItem[];
  tvInfoList?: IlistItem[];
  externalUserInfoList?: IlistItem[];
  selectSignature?: string;
}

export interface IlistItem {
  id: string;
  name: string;
  type?: string;
  orgId?: string;
  orgName?: string;
  contactType?: string;
}

export interface ItreeItem {
  id: string;
  key: string;
  name: string;
  label: any;
  nodeType: string;
  // 图标
  icon?: any;
  contactType?: string;
}
// 已选展示组件props
export interface PropType {
  selectSignature?: string;
  resultTitle?: string;
  groupList: IgroupItem[];
  funDelAll: () => void;
  showSelectUser: () => void;
  btnDetele?: boolean;
  btnUpdate?: boolean;
}

// 展示分组
export interface IgroupItem {
  title: string;
  unit: string;
  type: string;
  count?: number;
  itemList: ItreeItem[];
}
