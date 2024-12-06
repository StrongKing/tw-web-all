import React from 'react';
import { Tree } from 'antd';
import { TreeProps } from 'antd/lib/tree';
import { useDispatch } from 'react-redux';
import useTreeData from './hooks/use-tree-data';
import { TreeDataSource, UserType, SelfNameMap } from './interface';
import './index.less';

export interface PropTypes {
  dataSource: TreeDataSource;
  searchText: string;
  userType: UserType;
  selfNameMap: SelfNameMap;
  onUserSelect: any;
  handleSelect: any;
  renderExtra?: Function;
}
export default ({
  dataSource,
  searchText,
  userType,
  selfNameMap,
  onUserSelect,
  handleSelect,
  renderExtra,
}: PropTypes) => {
  const [treeData] = useTreeData(
    dataSource,
    searchText,
    undefined,
    renderExtra,
  );
  // console.log(
  //   treeData,
  //   'treeData2222',
  //   selfNameMap,
  //   (selfNameMap && selfNameMap[treeData[0]?.iconType]) || '人员',
  // );
  // console.log(useDispatch(), 'useDispatch');
  try {
    // console.log(useDispatch(), 'useDispatch');
  } catch (error) {
    console.log(error);
  }
  // const dispatch = useDispatch();
  const handleUserSelect: TreeProps['onSelect'] = (keys, arg) => {
    const { orgId, id, type } = arg.node;
    if (onUserSelect) {
      onUserSelect(id, userType, orgId);
    }
    if (type) {
      handleSelect(keys, arg, true);
    }

    // dispatch({
    //   type: 'personnel/show',
    //   payload: {
    //     userId: id,
    //     type: userType,
    //     params: { orgId },
    //   },
    // });
  };
  // 展示自己的头部
  // console.log(treeData, 'treeDatatreeData');
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
      {treeData.length > 19 ? (
        <div className="treeFooter">
          仅展示前20个搜索结果，请输入更精确的搜索内容获取
        </div>
      ) : null}
    </>
  );
};
