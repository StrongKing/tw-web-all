## compose-tree

Demo:

```tsx
import React, { useRef, useState } from 'react';
import { Route, HashRouter as Router, Switch } from 'react-router-dom';
import ComposeTab from '@/components/compose-tab';
import ComposeTree from '@/components/compose-tree';
import { Provider } from 'react-redux';
import { Link } from 'umi';
import TreeTableDemo from './TreeTableDemo';

import configStore from '@/store';
const store = configStore();
export default ({ title }: { title: string }) => {
  const TreeComponent = () => {
    const ref = useRef(null);
    const click = () => {
      console.log(';click', ref, ref.current);
      setCcc((old) => old + 1);
      ref.current.updateDataSource();
    };
    const filterLevel = (arr, level = Infinity, currLevel = 1) => {
      const isLeaf = currLevel >= level;
      return arr.map((el) => ({
        ...el,
        isLeaf: isLeaf || el.Leaf,
        children: isLeaf
          ? []
          : filterLevel(el.children || [], level, currLevel + 1),
      }));
    };
    const [ccc, setCcc] = useState(1);
    return (
      <>
        <button onClick={click}>更新, {ccc}</button>
        <ComposeTree
          ref={ref}
          firstLoadAll
          extraTransparentParams={ccc}
          dataSourceFormatter={(val) => {
            console.log('dataSourceFormatter', val);
            return filterLevel(val);
          }}
          request={{
            getTreeNodes: {
              url: '/data/get-tree-nodes.json',
              method: 'GET',
              params: { foo: '12322' },
            },
            searchTreeNodes: {
              url: '/data/search-tree.json',
              method: 'GET',
              params: { foo: '123' },
            },
          }}
          renderExtra={() => {
            return <span>建��</span>;
          }}
          // showSearch={false}
          groupTypeList={['tag-group122']}
          requestDataFormatter={(data, { treePath }) => {
            console.log(treePath);
            return data.dataSource;
          }}
          routerConfig={[
            {
              path: 'base-period1', // 校区设置
              Com: () => React.lazy(() => import('@/tree/modules/base-period')),
            },
            {
              path: 'tag-group',
              Com: () => <TreeTableDemo text="1111" />,
            },
            {
              path: 'tag-group1',
              Com: () => <TreeTableDemo text="2222" />,
            },
          ]}
          extendModuleMap={{
            'tag-group1': 'tag-group1',
          }}
          selfNameMap={{
            'tag-label': '标签1',
            'tag-group': '标签组1',
          }}
          maxShowNum={10}
          renderSearchExtra={({ labelPathName }) => (
            <div
              style={{
                color: 'rgba(0, 0, 0, 0.45)',
                whiteSpace: 'break-spaces',
                margin: 0,
                fontSize: '12px',
              }}
            >
              {labelPathName}
            </div>
          )}
          customSwitcherIcon={(flag) => (flag ? '11' : '22')}
        />
      </>
    );
  };

  const props = {
    request: {
      getTabDataSource: {
        url: '/data/get-tab-data-source.json',
        method: 'GET',
        params: { foo: '123' },
      },
    },
    onChange: () => {},
    defaultActiveKey: 'people',
    /* 直接 routerConfig 为 module 列表，path 与 tab 的 dataSource 的 key 保持一致，tab 改变时，展示相应的 module */
    routerConfig: [
      {
        path: 'people',
        isTree: true,
        Com: TreeComponent,
      },
      {
        path: 'department',
        Com: () => <div>department module</div>,
      },
    ],
  };

  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route path="/*" component={() => <ComposeTab {...props} />} />
        </Switch>
      </Router>
    </Provider>
  );
};
```

More skills for writing demo: https://d.umijs.org/guide/basic#write-component-demo
