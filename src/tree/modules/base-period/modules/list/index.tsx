import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { ComposeTreeContext } from '@/components/compose-tree';
import useRequest from '@/common/use-request';
import ComposeManage, { ComposeManageProps } from '@/components/compose-manage';

const classNumData: { label: number; value: number }[] = [];
Array.from(new Array(101).keys()).map((item) => {
  classNumData.push({ label: item, value: item });
});
classNumData.shift();

export default function ListModule() {
  const { activeKey, treePaths, generateUrlByTreePaths, reloadTree } =
    useContext(ComposeTreeContext);
  const match = useRouteMatch();
  const { path } = match;
  const [enrollmentYear, setEnrollmentYear] = useState([]);
  const [customCampus, setCustomCampus] = useState(false);

  useEffect(() => {
    const year = new Date().getFullYear();
    const ret = [];
    // 年级是根据每年的八月份开始当前学年，故将月份大于等于八月才出现当前年
    // let i = (new Date().getMonth() + 1) <= 7 ? 1 : 0;
    // for (; i <= 9; i++) {
    //   ret.push({ label: (Number(year) - i).toString(), value: (Number(year) - i).toString() });
    // }

    // 从当前年份开始
    for (let i = 0; i <= 9; i++) {
      ret.push({
        label: (Number(year) - i).toString(),
        value: (Number(year) - i).toString(),
      });
    }
    setEnrollmentYear(ret);
  }, []);

  const [campusOptions] = useRequest(
    '/backend/org/school/grade/name',
    {
      method: 'GET',
      data: {
        id: activeKey,
      },
    },
    (data: { dataSource: any }) => data?.dataSource || [],
  );

  const handleCustomDom = () => {
    return customCampus
      ? [
          {
            uiType: 'input',
            name: 'customNodeName',
            label: '年级名称',
            props: {
              maxLength: 30,
              placeholder: '请输入年级名称',
            },
            rules: [
              { required: true, message: '请输入年级名称' },
              { max: 30, message: '最大长度不超过30个字符' },
            ],
          },
          {
            uiType: 'select',
            name: 'schoolYear',
            label: '入学年份',
            props: {
              placeholder: '请选择入学年份',
              dataSource: enrollmentYear,
            },
            rules: [{ required: true, message: '请选择入学年份' }],
          },
        ]
      : [
          {
            uiType: 'select',
            name: 'nodeName',
            label: '请选择年级',
            props: {
              placeholder: '请选择年级',
              dataSource: campusOptions,
            },
            rules: [{ required: true, message: '请选择年级' }],
          },
        ];
  };

  const manageProps: ComposeManageProps = {
    dataRequest: {
      url: '/backend/org/school/sub/node',
      params: { activityKey: activeKey },
    },
    tableProps: {
      primaryKey: 'key',
      columns: [
        { name: 'label', label: '名称' },
        {
          name: 'totalStudent',
          label: '学生人数',
          help: '该部门及下属部门的学生成员的人数统计之和',
        },
        {
          name: 'totalParent',
          label: '家长人数',
          help: '该部门及下属部门的学生成员所关联的家长人数统计之和',
        },
        {
          name: 'totalTeacher',
          label: '关联老师',
          help: '该部门及下属部门的所任职岗位的员工人数统计之和',
        },
        {
          label: '操作',
          uiType: 'buttonList',
          props: {
            dataSource: [
              {
                text: '设置',
                uiType: 'link',
                to: generateUrlByTreePaths(
                  [...treePaths, '${record.key}'],
                  path.replace(
                    /\/:treePath(\/.*)$/,
                    '/:treePath/base-grade/setting',
                  ),
                ),
              },
              {
                uiType: 'request',
                text: '删除',
                request: {
                  url: '/backend/org/inner/batch/dept',
                  method: 'PUT',
                },
                refreshAfterRequest: true,
                confirmBeforeClick: {
                  title:
                    '您确定要删除 ${record.label} ，并清空该年级下的所有信息吗？',
                },
                onSuccess() {
                  reloadTree();
                },
              },
            ],
          },
        },
      ],
      rowSelection: {
        type: 'checkbox',
      },
    },
    buttonList: [
      {
        uiType: 'form',
        text: '+ 添加年级',
        className: 'form-wrapper-base-period',
        dialogProps: { title: '添加年级', width: '550px' },
        buttonProps: { type: 'primary' },
        request: {
          url: '/backend/org/school/learn/grade/dept',
          method: 'POST',
        formatter: (formValue: any) => ({
            nodeId: activeKey,
            nodeName: formValue.customNodeName,
            ...formValue,
          }),
        },
        formItemLayout: {
          labelCol: {
            xs: { span: 19 },
            sm: { span: 5 },
          },
          wrapperCol: {
            xs: { span: 18 },
            sm: { span: 18 },
          },
        },
        formProps: {
          initialValues: {
            classNum: 6,
          },
          dataSource: [
            {
              name: 'custom',
              uiType: 'checkboxChecked',
              label: '年级名称类型',
              props: {
                children: '开启自定义',
              },
              className: 'checkbox-wrapper-checked',
            },
            {
              uiType: 'input',
              name: 'customNodeName',
              label: '年级名称',
              props: {
                maxLength: 30,
                placeholder: '请输入年级名称',
              },
              rules: [
                { required: true, message: '请输入年级名称' },
                { max: 30, message: '最大长度不超过30个字符' },
              ],
              visibleOn: (data: any) => {
                return data.custom;
              },
            },
            {
              uiType: 'select',
              name: 'schoolYear',
              label: '入学年份',
              props: {
                placeholder: '请选择入学年份',
                dataSource: enrollmentYear,
              },
              rules: [{ required: true, message: '请选择入学年份' }],
              visibleOn: (data: any) => {
                return data.custom;
              },
            },
            {
              uiType: 'select',
              name: 'nodeName',
              label: '请选择年级',
              props: {
                placeholder: '请选择年级',
                dataSource: campusOptions,
              },
              rules: [{ required: true, message: '请选择年级' }],
              visibleOn: (data: any) => {
                return !data.custom;
              },
            },
            {
              uiType: 'select',
              name: 'classNum',
              label: '选择班级数',
              props: {
                placeholder: '选择班级数',
                dataSource: classNumData,
              },
              extra: customCampus
                ? '提示：当前为自定义年级，无法在学年结束后自动升年级'
                : '提示：当前为标准年级，可以设置每学年结束后，自动升年级，如“一年级”升为“二年级”',
            },
          ],
        },
        onSuccess() {
          reloadTree();
        },
      },
      {
        uiType: 'request',
        request: {
          url: '/backend/org/inner/batch/dept',
          method: 'PUT',
        },
        isBatch: true,
        text: '批量删除',
        confirmBeforeClick: {
          title: '操作确认',
          content: '确认要将选中的年级删除，并清空该年级下的所有信息吗？',
        },
        onSuccess() {
          reloadTree();
        },
      },
    ],
    sortProps: {
      swapRequest: { url: '/backend/org/inner/sorNum' },
      toTopRequest: { url: '/backend/org/inner/toTop' },
      onOrderChange() {
        reloadTree();
      },
    },
  };

  return <ComposeManage {...manageProps} />;
}
