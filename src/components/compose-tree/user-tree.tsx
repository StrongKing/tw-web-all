import React from 'react';
import { Tree, type TreeProps } from 'antd';
import useTreeData from './hooks/use-tree-data';
import { TreeDataSource, UserType, SelfNameMap } from './interface';
import './index.less';

export interface PropTypes {
  dataSource: TreeDataSource;
  searchText: string;
  userType: UserType;
  selfNameMap?: SelfNameMap;
  maxShowNum?: number;
  onUserSelect: any;
  handleSelect: any;
  renderExtra?: Function;
  typeKey?: string;
}
export default ({
  dataSource,
  searchText,
  userType,
  selfNameMap,
  onUserSelect,
  handleSelect,
  renderExtra,
  typeKey = 'type',
  maxShowNum = 20,
}: PropTypes) => {
  const [treeData] = useTreeData(
    dataSource,
    searchText,
    undefined,
    renderExtra,
  );
  const handleUserSelect: TreeProps['onSelect'] = (keys, arg) => {
    const { orgId, id } = arg.node;
    const type = arg?.node?.[typeKey];
    if (onUserSelect) {
      onUserSelect(id, userType, orgId);
    }
    if (type) {
      handleSelect(keys, arg, true);
    }
  };
  return (
    <>
      <div className="_treeTitle">
        {(selfNameMap && selfNameMap[treeData[0]?.iconType]) || '人员'}
      </div>
      <Tree
        className={searchText ? 'removeIndent' : ''}
        blockNode
        treeData={treeData}
        selectedKeys={[]}
        onSelect={handleUserSelect}
      />
      {treeData.length > maxShowNum - 1 ? (
        <div className="treeFooter">
          仅展示前{maxShowNum}个搜索结果，请输入更精确的搜索内容获取
        </div>
      ) : null}
    </>
  );
};
