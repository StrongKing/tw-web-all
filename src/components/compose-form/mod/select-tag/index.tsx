import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { Input, Select, Tag } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { LabeledValue } from 'antd/lib/select';
import { uniqBy } from 'lodash';
import SelectUser from 'suo-base-select-user';
import {
  Value as SelectUserValueProps,
  SelectUserFuncArgProps,
  IlistItem as ValueItem,
} from 'suo-base-select-user/lib/components/select-user/interface';
import request2 from '@/common/request2';
import Confirm from '@/components/Confirm';
import './index.less';

export interface PropTypes {
  value?: ValueItem | ValueItem[];
  selectUserProps: Omit<SelectUserFuncArgProps, 'onOk' | 'onCancel'>;
  onChange?: (val: any) => void;
  // 获取 info 的 key，如果设置了，则会自动将值回填到选人组件中，否则不回填
  wrapperKey?: string;
  confirmContent?: string;
  confirmTitle?: string;
}

export default ({
  value,
  onChange,
  wrapperKey,
  selectUserProps,
  confirmContent,
  confirmTitle,
}: PropTypes) => {
  const { multiple, isSaveSelectSignature, requestParams } =
    selectUserProps || {};
  const [options, setOptions] = useState<LabeledValue[]>([]);
  const [arrayValue, setArrayValue] = useState([]);

  const [userIds] = useMemo(() => {
    const ids = [];
    // if (arrayValue.length === 0) {
    //   return [];
    // }
    arrayValue.forEach((user) => {
      ids.push(user?.id);
    });

    return [ids];
  }, [arrayValue]);

  useEffect(() => {
    if (Array.isArray(value)) {
      setArrayValue(value.filter(({ id, name }) => id && name));
    } else if (value) {
      // debugger;
      // console.log('selectTagValue', value);
      request2(
        `${selectUserProps.userOrigin}/select/component/result?selectSignature=${value}`,
      ).then((data) => {
        // console.log(data, 'userInfoList22222');
        const {
          userInfoList = [],
          cameraInfoList = [],
          deptInfoList = [],
          equipmentInfoList = [],
          maternalInfoList = [],
          tvInfoList = [],
          workGroupInfoList = [],
          groupInfoList = [],
          tagInfoList = [],
          customerTagInfoList = [],
          groupTagInfoList = [],
          circlesTagInfoList = [],
          contentTagInfoList = [],
          externalUserInfoList = [],
        } = data || [];
        const list = userInfoList
          .concat(cameraInfoList)
          .concat(deptInfoList)
          .concat(equipmentInfoList)
          .concat(maternalInfoList)
          .concat(tvInfoList)
          .concat(workGroupInfoList)
          .concat(groupInfoList)
          .concat(tagInfoList)
          .concat(customerTagInfoList)
          .concat(groupTagInfoList)
          .concat(circlesTagInfoList)
          .concat(contentTagInfoList)
          .concat(externalUserInfoList)
          .filter((item) => item);
        // console.log(list, '33333');
        if (list.length === 0) {
          onChange(null);
        }
        setArrayValue(list);
      });
    } else {
      setArrayValue([]);
    }
  }, [value]);
  // 复选场景：根据组件 value 生成 select 的下拉菜单和 value
  useEffect(() => {
    // console.log(arrayValue, 'arrayValuetag');
    setOptions(
      arrayValue.map(({ id, name, childDelete, noTagLabelPermission }) => {
        return {
          label: name,
          value: id,
          disabled: noTagLabelPermission ? false : !childDelete,
          noTagLabelPermission,
        };
      }),
    );
  }, [arrayValue]);

  const onUsersSelectChange = useCallback(
    (selectValue) => {
      Confirm({
        title: confirmTitle,
        content: confirmContent,
        onCancel() {},
        onOk() {
          const nextUserList = arrayValue.filter(
            (user) => selectValue !== user.id,
          );
          if (isSaveSelectSignature) {
            saveResult(nextUserList);
          } else {
            onChange(nextUserList);
          }
        },
      });
    },
    [arrayValue, selectUserProps],
  );

  const saveResult = (params) => {
    // debugger;
    request2(`${selectUserProps.userOrigin}/select/component/result`, {
      method: 'POST',
      data: {
        selectTypeList: requestParams.selectTypeList,
        id: value,
        tagInfoList: params,
        userInfoList: [],
        cameraInfoList: [],
        equipmentInfoList: [],
        maternalInfoList: [],
        tvInfoList: [],
        workGroupInfoList: [],
        deptInfoList: [],
        orgInfoList: [],
        groupInfoList: [],
        externalUserInfoList: [],
      },
    }).then((data) => {
      onChange(data);
    });
  };

  const removeInputValue = useCallback(
    (e) => {
      e?.stopPropagation();
      onChange(null);
      setArrayValue([{ name: '' }]);
    },
    [onChange],
  );

  const handleChange = useCallback(
    (val: SelectUserValueProps) => {
      // 整合所有的内容
      const mergedValue = [
        'userInfoList',
        'cameraInfoList',
        'equipmentInfoList',
        'maternalInfoList',
        'tvInfoList',
        'workGroupInfoList',
        'deptInfoList',
        'tagInfoList',
        'circlesTagInfoList',
        'customerTagInfoList',
        'groupTagInfoList',
        'contentTagInfoList',
        'orgInfoList',
        'groupInfoList',
        'externalUserInfoList',
      ]
        .reduce((result, key) => {
          // @ts-ignore
          return result.concat(val[key] || []);
        }, [])
        .filter((_) => _);
      const sign = isSaveSelectSignature
        ? val.selectSignature
        : multiple
        ? uniqBy(mergedValue, 'id')
        : mergedValue;
      onChange(sign);
    },
    [onChange],
  );
  const showSelectUser = useCallback(
    (e) => {
      e.preventDefault();
      SelectUser.show({
        defaultValue: wrapperKey ? { [wrapperKey]: arrayValue } : null,
        ...selectUserProps,
        selectSignature:
          typeof value === 'string' ? value : selectUserProps.selectSignature,
        onOk(val: SelectUserValueProps) {
          // console.log(val, 'vallll');
          handleChange(val);
        },
      });
    },
    [selectUserProps, wrapperKey, arrayValue, value],
  );
  return multiple && selectUserProps?.disabled ? (
    options.length ? (
      <div className="suo-tag-box">
        {options.map((item) => (
          <Tag key={item.value}>{item.label}</Tag>
        ))}
      </div>
    ) : (
      '-'
    )
  ) : (
    <>
      <div
        className="ssl-select-user"
        onClick={selectUserProps?.disabled ? () => {} : showSelectUser}
      >
        <div>
          <Select
            mode="multiple"
            options={options}
            open={false}
            placeholder="请选择"
            value={userIds}
            dropdownStyle={{ display: 'none' }}
            onDeselect={onUsersSelectChange}
            disabled={selectUserProps?.disabled}
            showArrow={false}
            dropdownRender={() => null}
          />
        </div>
        <div className="add-icon" />
      </div>
    </>
  );
};
