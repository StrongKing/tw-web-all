import React, { useCallback, useState, useEffect } from 'react';
import { Button } from 'antd';
import SelectUser from 'suo-base-select-user';
import { selectUserPropType, IdefaultValue } from './interface';
import SelectUserResult from './select-user-result';
import request2 from '@/common/request2';

export interface PropTypes {
  selectUserProps: selectUserPropType;
  onChange(val: any): void;
  btnText?: string;
  btnDisiabled?: boolean;
  resultTitle?: string;
  isNotDom?: boolean;
  btnDetele?: boolean;
  btnUpdate?: boolean;
  getCheckedNodes?: (obj: IdefaultValue) => void;
  getTotalCount?: (obj: any) => void;
}

export default ({
  onChange,
  selectUserProps,
  isNotDom = false,
  ...others
}: PropTypes) => {
  const [groupList, setGroupList] = useState<any[]>([]);
  const [data, setData] = useState<IdefaultValue>({});
  const [selectSignature, setSelectSignature] = useState(
    selectUserProps?.selectSignature,
  );
  const {
    btnText = '选择',
    btnDisiabled = false,
    resultTitle = '已选对象',
    btnDetele = false,
    btnUpdate = true,
  } = others;

  useEffect(() => {
    if (selectUserProps?.selectSignature) {
      request2(
        `${selectUserProps?.userOrigin}/select/component/result?selectSignature=${selectSignature}`,
        {
          method: 'GET',
        },
      ).then((res) => {
        setData(res);
        setSelectSignature(selectUserProps?.selectSignature);
        if (
          selectUserProps?.getCheckedNodes &&
          typeof selectUserProps?.getCheckedNodes === 'function'
        ) {
          selectUserProps.getCheckedNodes(res);
        }
      });
    }
  }, [selectUserProps?.selectSignature]);

  useEffect(() => {
    const {
      userInfoList = [],
      deptInfoList = [],
      orgInfoList = [],
      groupInfoList = [],
      tagInfoList = [],
      customerTagInfoList = [],
      maternalInfoList = [],
      groupTagInfoList = [],
      circlesTagInfoList = [],
      contentTagInfoList = [],
      equipmentInfoList = [],
      tvInfoList = [],
      externalUserInfoList = [],
    } = data || {};

    const { selectPaneProps } = selectUserProps;

    const array = [];
    if (equipmentInfoList?.length) {
      const equipmentItem = {
        title: '设备',
        type: 'EQUIPMENT',
        itemList: equipmentInfoList,
      };
      array.push(equipmentItem);
    }
    if (tvInfoList?.length) {
      const tvItem = {
        title: '设备',
        type: 'TV',
        itemList: tvInfoList,
      };
      array.push(tvItem);
    }

    if (userInfoList?.length) {
      const groupItem = {
        title: '人员',
        type: 'USER',
        itemList: userInfoList,
      };
      array.push(groupItem);
    }
    if (deptInfoList?.length) {
      const groupItem = {
        title: '部门',
        type: 'DEPT',
        itemList: deptInfoList,
        ...selectPaneProps?.dept,
      };
      array.push(groupItem);
    }

    if (orgInfoList?.length) {
      const orgItem = {
        title: '组织',
        type: 'ORG',
        itemList: orgInfoList,
      };
      array.push(orgItem);
    }

    if (groupInfoList?.length) {
      const groupItem = {
        title: '互连微信群',
        type: 'GROUP',
        itemList: groupInfoList,
      };
      array.push(groupItem);
    }

    if (tagInfoList?.length) {
      const groupItem = {
        title: '标签',
        type: 'TAG',
        itemList: tagInfoList,
      };
      array.push(groupItem);
    }

    if (tagInfoList?.length) {
      const groupItem = {
        title: '标签',
        type: 'TAG',
        itemList: tagInfoList,
      };
      array.push(groupItem);
    }

    if (externalUserInfoList?.length) {
      const groupItem = {
        title: '人员',
        type: 'USER',
        unit: '人',
        itemList: externalUserInfoList,
      };
      array.push(groupItem);
    }

    if (maternalInfoList?.length) {
      const groupItem = {
        title: '人员',
        type: 'USER',
        unit: '人',
        itemList: maternalInfoList,
      };
      array.push(groupItem);
    }
    if (customerTagInfoList?.length) {
      const groupItem = {
        title: '客户标签',
        type: 'TAG',
        unit: '人',
        itemList: customerTagInfoList,
      };
      array.push(groupItem);
    }
    if (groupTagInfoList?.length) {
      const groupItem = {
        title: '群标签',
        type: 'TAG',
        unit: '人',
        itemList: groupTagInfoList,
      };
      array.push(groupItem);
    }
    if (circlesTagInfoList?.length) {
      const groupItem = {
        title: '圈子标签',
        type: 'TAG',
        unit: '人',
        itemList: circlesTagInfoList,
      };
      array.push(groupItem);
    }
    if (contentTagInfoList?.length) {
      const groupItem = {
        title: '内容标签',
        type: 'TAG',
        unit: '人',
        itemList: contentTagInfoList,
      };
      array.push(groupItem);
    }

    setGroupList(array);
  }, [data]);

  const funDelAll = useCallback(() => {
    // 需要展示删除时才初始化删除相关函数
    if (btnDetele) {
      const emptyData: IdefaultValue = {
        userInfoList: [],
        deptInfoList: [],
        orgInfoList: [],
        groupInfoList: [],
        tagInfoList: [],
        customerTagInfoList: [],
        maternalInfoList: [],
        groupTagInfoList: [],
        circlesTagInfoList: [],
        contentTagInfoList: [],
        orgRelInfoList: [],
        equipmentInfoList: [],
        externalUserInfoList: [],
        tvInfoList: [],
      };
      setData({ ...data, ...emptyData });
      onChange({
        ...data,
        ...emptyData,
      });
    }
  }, [selectSignature, data]);

  const showSelectUser = useCallback(() => {
    SelectUser.show({
      ...selectUserProps,
      defaultValue: data,
      selectSignature,
      onOk(val: selectUserPropType) {
        setSelectSignature(val?.selectSignature);
        setData(val);
        onChange(val);
      },
    });
  }, [selectSignature, data]);

  if (isNotDom) {
    return null;
  }

  return (
    <div className="select-result">
      {groupList?.length ? (
        <div className="select-pane-wrap">
          <SelectUserResult
            groupList={groupList}
            showSelectUser={showSelectUser}
            funDelAll={funDelAll}
            btnDetele={btnDetele}
            btnUpdate={btnUpdate}
            resultTitle={resultTitle}
          />
        </div>
      ) : (
        <Button onClick={showSelectUser} disabled={btnDisiabled}>
          {btnText}
        </Button>
      )}
    </div>
  );
};
