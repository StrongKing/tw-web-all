import React, {
  useCallback,
  useState,
  useEffect,
  useMemo,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import { Select, Tag, Popover } from 'antd';
import { groupBy, uniqBy } from 'lodash';
import { LabeledValue } from 'antd/lib/select';
import SelectUser from 'suo-base-select-user';
import {
  Value as SelectUserValueProps,
  SelectUserFuncArgProps,
  IlistItem as ValueItem,
  IdefaultValue,
  NodeType,
} from 'suo-base-select-user/lib/components/select-user/interface';

import classNames from 'classnames';
import Card from '@/components/expand-collapse';
import request2 from '@/common/request2';
import Confirm from '@/components/Confirm';
import useEllipsis from './useEllipsis';
import close from './close.svg';
import './index.less';

const overlayInnerStyle = {
  maxWidth: '20em',
  fontSize: '12px',
  color: '#666',
  overflow: 'auto',
  maxHeight: '400px',
};
function groupByType(arr: any[]) {
  const userInfoList: any = {};
  const deptInfoList: any = {};

  arr.forEach((item: any) => {
    if (item.type === 'USER') {
      if (!userInfoList[item.type]) {
        userInfoList[item.type] = [];
      }
      userInfoList[item.type].push(item);
    } else if (item.type === 'DEPT') {
      if (!deptInfoList[item.type]) {
        deptInfoList[item.type] = [];
      }
      deptInfoList[item.type].push(item);
    }
  });

  return { userInfoList, deptInfoList };
}

const treeState = () => {
  return {
    deptInfoList: [],
    userInfoList: [],
    equipmentInfoList: [],
    customerManagerInfoList: [],
    managerUserInfoList: [],
    managerGroupInfoList: [],
    employeeCodeInfoList: [],
    tvInfoList: [],
    maternalInfoList: [],
    cameraInfoList: [],
    tagInfoList: [],
    customerTagInfoList: [],
    weChatTagInfoList: [],
    groupTagInfoList: [],
    circlesTagInfoList: [],
    contentTagInfoList: [],
    groupInfoList: [],
    workGroupInfoList: [],
    externalUserInfoList: [],
  };
};

const getListByType = (type: NodeType) => {
  const typeToKeyMap = {
    DEPT: 'deptInfoList',
    GROUP_DEPT: 'deptInfoList',
    TAG: 'tagInfoList',
    CUSTOMER_TAG: 'customerTagInfoList',
    WECHAT_TAG: 'weChatTagInfoList',
    CUSTOMER_MANAGER_USER: 'customerManagerInfoList',
    MANAGER_GROUP: 'managerGroupInfoList',
    MANAGER_USER: 'managerUserInfoList',
    EMPLOYEE_CODE: 'employeeCodeInfoList',
    GROUP_TAG: 'groupTagInfoList',
    CIRCLES_TAG: 'circlesTagInfoList',
    CONTENT_TAG: 'contentTagInfoList',
    USER: 'userInfoList',
    EQUIPMENT: 'equipmentInfoList',
    TV: 'tvInfoList',
    CAMERA: 'cameraInfoList',
    MATERNAL: 'maternalInfoList',
    GROUP: 'groupInfoList',
    WORK_GROUP: 'workGroupInfoList',
    EXTERNAL_USER: 'externalUserInfoList',
  };
  // @ts-ignore
  const key: string = typeToKeyMap[type];
  return key;
};

export interface PropTypes {
  value?: ValueItem | ValueItem[];
  selectUserProps: Omit<SelectUserFuncArgProps, 'onOk' | 'onCancel'>;
  onChange?: (val: any) => void;
  // 获取 info 的 key，如果设置了，则会自动将值回填到选人组件中，否则不回填
  wrapperKey?: string;
  isUserAndDept?: boolean;
  maxTagCount?: boolean;
  placeholder?: string;
  wrapWith?: any;
  colorType?: number;
  confirmContent?: string;
  sidebarWrapClassName?: string;
  confirmTitle?: string;
  mode?: 'sidebar' | 'default';
  onArrayChange?: (val: any[]) => void;
}

const UserForm = forwardRef(
  (
    {
      value,
      onChange,
      wrapperKey,
      isUserAndDept = false,
      wrapWith,
      colorType = 1,
      placeholder = '请选择',
      maxTagCount = false,
      selectUserProps,
      sidebarWrapClassName,
      mode,
      confirmContent,
      confirmTitle,
      onArrayChange = () => {},
    }: PropTypes,
    ref: any,
  ) => {
    const { multiple, isSaveSelectSignature, requestParams } =
      selectUserProps || {};
    const [options, setOptions] = useState<LabeledValue[]>([]);
    const [arrayValue, setArrayValue] = useState<ValueItem>([]);
    const wrapRef = useRef(null);
    const { transformaVal } = useEllipsis();

    useImperativeHandle(ref, () => ({
      showSelectUser,
    }));

    const [userIds, newValue] = useMemo(() => {
      const ids: ValueItem[] = [];
      onArrayChange(arrayValue);
      arrayValue.forEach((user: any) => {
        ids.push(user?.id);
      });

      const oldArr = groupBy(arrayValue, function (n) {
        return n.labelPathName;
      });

      const newArr: any[] = [];
      Object.keys(oldArr).forEach((key) => {
        // 数组
        newArr.push({ name: key, data: oldArr[key] });
      });

      return [ids, newArr];
    }, [arrayValue]);

    useEffect(() => {
      if (Array.isArray(value)) {
        setArrayValue(value.filter(({ id, name }) => id && name));
      } else if (value) {
        request2(
          `${selectUserProps.userOrigin}/select/component/result?selectSignature=${value}`,
        ).then((data) => {
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
            weChatTagInfoList = [],
            groupTagInfoList = [],
            circlesTagInfoList = [],
            contentTagInfoList = [],
            customerManagerInfoList = [],
            managerUserInfoList = [],
            managerGroupInfoList = [],
            employeeCodeInfoList = [],
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
            .concat(weChatTagInfoList)
            .concat(groupTagInfoList)
            .concat(circlesTagInfoList)
            .concat(contentTagInfoList)
            .concat(customerManagerInfoList)
            .concat(managerUserInfoList)
            .concat(managerGroupInfoList)
            .concat(employeeCodeInfoList)
            .concat(externalUserInfoList)
            .filter((item: ValueItem) => !!item);

          if (list?.length === 0) {
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
      setOptions(
        arrayValue.map(({ id, name, type = '', childDelete = true }: any) => {
          return {
            label: name,
            value: id,
            disabled: !childDelete,
            type,
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
              (user: ValueItem) => selectValue !== user.id,
            );
            let nextTreeState: IdefaultValue = treeState();
            if (nextUserList.length === 0) {
              nextTreeState = treeState();
            } else {
              nextUserList.map((item: ValueItem) => {
                const key = getListByType(item?.type || 'USER');
                nextTreeState[key].push(item);
              });
            }

            if (isSaveSelectSignature) {
              saveResult(nextTreeState);
            } else {
              onChange(nextUserList);
            }
          },
        });
      },
      [arrayValue, selectUserProps],
    );

    const saveResult = (array: IdefaultValue) => {
      request2(`${selectUserProps.userOrigin}/select/component/result`, {
        method: 'POST',
        data: {
          selectTypeList: requestParams.selectTypeList,
          id: Array.isArray(value) ? undefined : value,
          ...array,
        },
      }).then((data) => {
        onChange(data);
      });
    };

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
          'weChatTagInfoList',
          'groupTagInfoList',
          'contentTagInfoList',
          'employeeCodeInfoList',
          'customerManagerInfoList',
          'managerGroupInfoList',
          'managerUserInfoList',
          'groupInfoList',
          'externalUserInfoList',
        ]
          .reduce((result, key) => {
            // @ts-ignore
            return result.concat(val[key] || []);
          }, [])
          .filter((_) => _);

        let sign;

        if (
          !isSaveSelectSignature &&
          !selectUserProps?.onlyLeafCheckable &&
          multiple &&
          selectUserProps?.showTabList?.includes('innerContacts') &&
          !isUserAndDept
        ) {
          // 内部通讯录非签名模式又能选人选部门多选,新增逻辑
          sign = uniqBy((value || []).concat(mergedValue), 'id');
        } else if (!isSaveSelectSignature) {
          sign = uniqBy(mergedValue, 'id');
        } else if (isSaveSelectSignature) {
          sign = val.selectSignature;
        }
        onChange(sign);
      },
      [onChange],
    );

    const getDefaultValue = () => {
      if (isUserAndDept) {
        const { userInfoList, deptInfoList } = groupByType(arrayValue);
        return {
          userInfoList: userInfoList?.USER,
          deptInfoList: deptInfoList?.DEPT,
        };
      }
      if (wrapperKey) {
        return { [wrapperKey]: arrayValue };
      }
      return null;
    };

    const showSelectUser = useCallback(
      (e: any) => {
        e?.preventDefault();
        SelectUser.show({
          defaultValue: getDefaultValue(),
          ...selectUserProps,
          selectSignature:
            typeof value === 'string' ? value : selectUserProps.selectSignature,
          onOk(val: SelectUserValueProps) {
            handleChange(val);
          },
        });
      },
      [selectUserProps, wrapperKey, arrayValue, value],
    );

    const DefaultDom = () => {
      const params = maxTagCount
        ? {
            maxTagCount: 'responsive',
          }
        : {};
      return (
        <div
          className="ssl-select-user"
          onClick={selectUserProps?.disabled ? () => {} : showSelectUser}
        >
          <div>
            <Select
              mode="multiple"
              options={options}
              open={false}
              placeholder={placeholder}
              value={userIds}
              dropdownStyle={{ display: 'none' }}
              onDeselect={onUsersSelectChange}
              disabled={selectUserProps?.disabled}
              showArrow={false}
              dropdownRender={() => null}
              {...params}
            />
          </div>
          <div className="add-icon" />
        </div>
      );
    };

    const SideBarDom = useMemo(() => {
      return (
        <div
          className={classNames('sidebar-select-user', sidebarWrapClassName)}
          ref={wrapRef}
        >
          {newValue.length > 0 ? (
            newValue.map((item: any, index: number) => {
              return (
                <div className="content" key={index}>
                  <Popover
                    placement="bottomLeft"
                    overlayInnerStyle={overlayInnerStyle}
                    content={item.name}
                    trigger="hover"
                  >
                    <div className="tag-box">
                      {transformaVal(item.name, 136 + 16)}
                    </div>
                  </Popover>
                  {item?.data.map((inner: any, inerindex: number) => {
                    return (
                      <div key={inerindex} className="tag-box">
                        <Popover
                          placement="bottomLeft"
                          overlayInnerStyle={overlayInnerStyle}
                          content={inner.name}
                          trigger="hover"
                        >
                          <span>
                            {transformaVal(
                              inner.name,
                              wrapRef?.current?.clientWidth || wrapWith,
                            )}
                          </span>
                        </Popover>
                        {!!inner.childDelete && (
                          <img
                            src={close}
                            alt="11"
                            onClick={() => onUsersSelectChange(inner.id)}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })
          ) : (
            <DefaultDom />
          )}
        </div>
      );
    }, [newValue]);

    return selectUserProps?.disabled ? (
      options.length ? (
        <Card
          colorType={colorType}
          closeText={
            <div>
              等共{options?.length}个<span>展开</span>
            </div>
          }
          openText={<div>收起</div>}
          maxHeight={65}
        >
          <div className="suo-tag-box">
            {options.map((item: any, index: number) => {
              if (typeof item === 'string') {
                return <Tag key={index}>{item}</Tag>;
              } else if (item.label) {
                return (
                  <Tag
                    key={index + item.id}
                    style={{ display: 'inline-flex', alignItems: 'center' }}
                  >
                    <SelectUser.TreeNodeIcon type={item.type} />
                    <span style={{ marginLeft: '6px' }}>{item.label}</span>
                  </Tag>
                );
              } else {
                return '-';
              }
            })}
          </div>
        </Card>
      ) : (
        '-'
      )
    ) : (
      <>{mode === 'sidebar' ? SideBarDom : <DefaultDom />}</>
    );
  },
);

export default UserForm;
