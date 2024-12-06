import React, { useContext } from 'react';
import { Collapse } from 'antd';
import ComposeForm from '@/components/compose-form';
import { ComposeTreeContext } from '@/components/compose-tree';
import useRequest from '@/common/use-request';
// import VisibleRange from '../../../../components/visible-range';
import StationSetting from '../../../../components/staion';

const { Panel } = Collapse;

export default function SettingModule() {
  const { activeKey, reloadTree } = useContext(ComposeTreeContext);
  const [stationData] = useRequest(
    '/backend/user/dept/station/user/list',
    {
      method: 'GET',
      data: {
        deptId: activeKey,
      },
    },
    (data) => data?.dataSource || [],
  );
  const [visibleRange] = useRequest(
    '/dept/customer/visible/range/setting/users',
    {
      method: 'GET',
      data: {
        deptId: activeKey,
      },
    },
    (data) => data || [],
  );

  return (
    <>
      <Collapse activeKey="1">
        <Panel showArrow={false} header="学段信息" key="1">
          <ComposeForm
            request={{
              url: '/backend/org/dept/update',
              method: 'POST',
              formatter: (data) => ({
                deptId: activeKey,
                ...data,
              }),
            }}
            initialValuesRequest={{
              url: '/backend/org/inner/dept',
              method: 'GET',
              params: { activeKey },
            }}
            controls={[
              {
                label: '学段类型',
                uiType: 'select',
                name: 'deptType',
                rules: [
                  {
                    required: true,
                    message: '请选择学段类型',
                  },
                ],
                source: {
                  url: '/backend/org/school/science/type',
                },
              },
            ]}
            actions={[
              {
                uiType: 'submit',
                props: {
                  children: '保存',
                  type: 'primary',
                },
              },
            ]}
            onFinish={() => reloadTree()}
          />
        </Panel>
      </Collapse>
      <Collapse activeKey="2">
        <Panel showArrow={false} header="岗位设置" key="2">
          {/* <StationSetting dataSource={stationData} activeKey={activeKey} />
          <VisibleRange
            dataSource={visibleRange}
            subTitle="可查看该学段的通讯录"
            activeKey={activeKey}
          /> */}
        </Panel>
      </Collapse>
    </>
  );
}
