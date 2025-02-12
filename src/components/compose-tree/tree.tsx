import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useContext,
} from 'react';
import { EventDataNode } from 'antd/lib/tree';
import { Spin, Input, Tree } from 'antd';
import { debounce } from 'lodash';
import net from '@/services/index';
import { ComposeTreeContext } from './hooks/use-compose-tree';
import UserTree from './user-tree';
import useTreeData from './hooks/use-tree-data';
import {
  IComposeTreeContext,
  TreeProps as PropTypes,
  SelectedDataNode,
  TreeNodeKey,
  SelfNameMap,
} from './interface';
import { getUid } from './utils';

import './index.less';

export const nameMap: SelfNameMap = {
  org: '组织',
  dept: '部门',
  group: '分组',
  tag: '标签',
  'tag-label': '标签',
  'tag-group': '标签组',
  permission: '权限',
  village: '小区',
  building: '楼幢',
  cell: '单元',
  user: '人员',
  house: '房屋',
  menu_first: '应用名称',
  menu_second: '菜单名称',
  'gzh-group': '分组',
  'gzh-list': '公众号',
};

const { Search } = Input;

function CFTree({
  request: { searchTreeNodes },
  onSelect,
  onUserSelect,
  permissionCode,
  searchProps,
  showSearch = true,
  userType = 'employee',
  rootIconType,
  renderExtra,
  selfNameMap,
  renderSearchExtra,
  firstLoadAll,
  groupTypeList = [],
  maxShowNum = 20,
  typeKey = 'type',
  customSwitcherIcon,
  ...others
}: PropTypes) {
  const {
    expandedKeys,
    dataSource,
    treePaths,
    setIsSearch,
    setExpandedKeys,
    loadData,
    firstLoaded,
  } = useContext<IComposeTreeContext>(ComposeTreeContext);
  const [selectedKeys, setSelectedKeys] = useState([]);
  // 渲染树的数据
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userList, setUserList] = useState([]);
  const [searchText, setSearchText] = useState('');
  const requestIds = useRef({ search: 0 });
  const partialDataSource = useMemo(
    () => (searchText ? searchResult : dataSource),
    [searchText, searchResult, dataSource],
  );
  const treeWrapper = useRef<HTMLDivElement>();
  const [treeData] = useTreeData(
    partialDataSource,
    searchText,
    rootIconType,
    renderExtra,
  );
  // const [height, setHeight] = useState(0);
  const [minWidth, setMinWidth] = useState(0);

  useEffect(() => {
    if (searchText) {
      setIsSearch(true);
    } else {
      setIsSearch(false);
    }
  }, [searchText]);

  useEffect(() => {
    updateMinWidth();
  }, [
    treeWrapper.current?.scrollWidth,
    searchText,
    userList.length,
    treeData.length,
  ]);

  const updateMinWidth = useCallback(() => {
    if (searchText && userList.length + treeData.length === 0) {
      setMinWidth(259);
    } else if (treeWrapper.current?.scrollWidth !== minWidth) {
      setMinWidth(treeWrapper.current?.scrollWidth);
    }
  }, [
    minWidth,
    treeWrapper,
    setMinWidth,
    searchText,
    userList.length,
    treeData.length,
  ]);
  // 搜索
  const search = useCallback(
    (value: string, requestId: number) => {
      // 丢掉旧的请求
      // 如果输入的内容为纯空格，则不发送请求
      if (requestIds.current.search !== requestId || !value.trim()) {
        return;
      }
      const { url, method, params = {} } = searchTreeNodes;
      setLoading(true);
      // 增量获取子树
      // tslint:disable-next-line: no-floating-promises
      net
        .request(url, {
          method,
          data: {
            ...params,
            keyword: value,
          },
          showError: true,
        })
        .then(({ data }) => {
          if (requestIds.current.search !== requestId) {
            return;
          }

          setSearchResult(
            (data?.dataSource || []).map((item: any) => ({
              ...item,
              key: getUid(),
              id: item.key,
              label: item.labelPath || item.label,
              isLeaf: true,
            })),
          );
          setUserList(
            (data?.peopleList || []).map((item: any) => ({
              ...item,
              key: getUid(),
              id: item.key,
              iconType: item.iconType || 'user',
            })),
          );
          setSearchText(value);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    },
    [searchTreeNodes],
  );

  const debounced = useRef(debounce(search, 300, { leading: false }));

  const handleSearch = (e: any) => {
    // e.persist();
    const {
      target: { value },
    } = e;
    const requestId = requestIds.current.search + 1;
    requestIds.current.search = requestId;

    // 如果是清空搜索框，则恢复原来的树
    if (!value) {
      setSearchText(value);
      setSearchResult([]);
      setLoading(false);
      return;
    }
    debounced.current(value, requestId);
  };
  const handleSelect = (
    nextSelectedKeys: TreeNodeKey[],
    event: SelectedDataNode,
    peopleListBool: boolean,
  ) => {
    // 点击展开收起
    const { key } = event.node;
    const type = event?.node?.[typeKey];
    const matchedExpandIndex = expandedKeys.indexOf(key);
    // 禁止反选
    // if (event.selected) {
    //   setSelectedKeys(nextSelectedKeys);
    // }
    // setTimeout(() => {
    // 点击同一个项目
    if (nextSelectedKeys[0] === selectedKeys[0] && matchedExpandIndex >= 0) {
      setExpandedKeys([
        ...expandedKeys.slice(0, matchedExpandIndex),
        ...expandedKeys.slice(matchedExpandIndex + 1),
      ]);
    } else {
      const newKeys = expandedKeys ? [...expandedKeys] : [];
      if (type && groupTypeList.includes(type)) {
        const index = newKeys.indexOf(key);
        if (index > -1) {
          newKeys.splice(index, 1);
        } else {
          newKeys.push(key);
        }
        setExpandedKeys(newKeys);
      } else {
        setExpandedKeys(Array.from(new Set([...newKeys, key])));
      }
    }
    // 禁止反选
    if (!event.selected) {
      return;
    }
    onSelect(
      nextSelectedKeys,
      event,
      peopleListBool ? userList : partialDataSource,
    );
    // }, 0);
  };

  const handleExpand = (
    nextExpandedKeys: any[],
    event: {
      node: EventDataNode;
      expanded: boolean;
      nativeEvent: MouseEvent;
    },
  ) => {
    if (event.expanded) {
      loadData(event.node);
    } else {
      setExpandedKeys(nextExpandedKeys);
    }
  };

  // 根据 selectedKeys 寻找选中的节点 key
  useEffect(() => {
    // 如果有搜索内容，则不更新高亮项
    if (searchText) return;
    if (!dataSource) {
      setSelectedKeys([]);
      return;
    }
    let traverser = dataSource;
    let activeKey;
    const max = treePaths.length;
    treePaths.every((id, index) => {
      if (!traverser) return false;
      const matchedItem = traverser.find((item) => item.id === id);
      // 没有找到目标节点，跳过
      if (!matchedItem) {
        return false;
      }
      if (index === max - 1) {
        activeKey = matchedItem.key;
      }
      traverser = matchedItem.children;
      return true;
    });
    setSelectedKeys(activeKey ? [activeKey] : []);
  }, [treePaths, dataSource, searchText]);

  const finalNameMap = { ...nameMap, ...selfNameMap };
  const title = finalNameMap[treeData[0]?.iconType];

  return (
    <div className="ss-biz-tree">
      {showSearch ? (
        <div className="biz-search-main">
          <Search allowClear {...searchProps} onChange={handleSearch} />
        </div>
      ) : null}

      <div className="biz-tree-main" ref={treeWrapper}>
        <div style={{ width: minWidth }}>
          <Spin
            delay={500}
            // wrapperClassName="biz-tree-main"
            spinning={loading}
          >
            {permissionCode === 30512 && <p className="emptyText">权限不足</p>}
            {permissionCode === 9000 && <p className="emptyText">暂无数据</p>}
            {
              // 如果没有搜索结果，则提示文案
              permissionCode !== 30512 &&
                searchText &&
                userList.length + treeData.length === 0 && (
                  <p className="emptyText">搜索结果为空，请调整搜索内容</p>
                )
            }
            {permissionCode !== 30512 && searchText && userList.length > 0 ? (
              <UserTree
                dataSource={userList}
                searchText={searchText}
                userType={userType}
                maxShowNum={maxShowNum}
                selfNameMap={finalNameMap}
                onUserSelect={onUserSelect}
                handleSelect={handleSelect}
                renderExtra={renderSearchExtra}
                typeKey={typeKey}
              />
            ) : null}

            {permissionCode !== 30512 && searchText && treeData.length > 0 && (
              <div className="treeTitle">{title}</div>
            )}
            {permissionCode !== 30512 && (!firstLoadAll || firstLoaded) && (
              <Tree
                className={searchText ? 'removeIndent000' : ''}
                onExpand={handleExpand}
                expandedKeys={expandedKeys}
                onSelect={handleSelect}
                blockNode
                // height={height}
                // loadData={loadData}
                treeData={treeData}
                selectedKeys={selectedKeys}
                {...others}
                checkable={false}
                // titleRender={(nodeData: any) => {
                //   let swticherIcon = null;
                //   if (typeof customSwitcherIcon === 'function') {
                //     swticherIcon = customSwitcherIcon(
                //       expandedKeys?.includes(nodeData.key) || false,
                //       nodeData,
                //     );
                //   }
                //   return (
                //     <div className="treeNode" title={nodeData.label}>
                //       {swticherIcon}
                //       {nodeData.title}
                //     </div>
                //   );
                // }}
              />
            )}

            {searchText && treeData.length > maxShowNum - 1 ? (
              <div className="treeFooter">
                仅展示前{maxShowNum}个搜索结果，请输入更精确的搜索内容获取
              </div>
            ) : null}
          </Spin>
        </div>
      </div>
    </div>
  );
}

export default CFTree;

export { PropTypes, ComposeTreeContext };
