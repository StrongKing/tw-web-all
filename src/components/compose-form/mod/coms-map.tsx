/*
 * @Author: 大鸡腿 734164941@qq.com
 * @Date: 2022-08-09 15:24:40
 * @LastEditors: 大鸡腿 734164941@qq.com
 * @LastEditTime: 2022-09-23 14:37:35
 * @FilePath: \suo-uicomponent\src\components\compose-form\mod\coms-map.tsx
 *
 * Copyright (c) 2022 by 大鸡腿 734164941@qq.com, All Rights Reserved.
 */
import { Button, Checkbox, Input } from 'antd';
import { compose, withProps } from 'recompose';
import Select from '@/components/select';
import TreeSelect from '@/components/tree-select';
import MobilePhone from './mobile-phone';
import InputPostfix from './input';
import InputNumber from './inputNumber';
import {
  DatePicker_,
  RangePicker_,
  TimePicker_,
  TimeRangePicker_,
  RangePickerDisabled,
} from './datePick';
import ConfirmSubmit from './confirmSubmit';
import RadioGroup from '../../radio-group';
import CheckboxGroup from '../../checkbox-group';
import SwitchChecked from './switch-checked';
import Text from './text';
import BooleanToText from './booleanToText';
import Form_ from '@/components/button/form';
import SelectSearch from '@/components/button/select-search';
import BusinessCard from '@/components/button/business-card';
import UploadFile from './uploadFile';
import UploadImg from './uploadImg';
import Textarea from './textarea';
import cascaderSelect from './cascaderSelect';

import LinkText from '@/components/link-text';
import PhoneSmsCode from './phoneSmsCode';
import SwitchText from './switch-text';

const submitHOC = compose(
  withProps(() => ({
    htmlType: 'submit',
  })),
);

export default {
  input: InputPostfix,
  password: Input.Password,
  textarea: Textarea,
  number: InputNumber,
  'upload-file': UploadFile,
  'upload-img': UploadImg,
  'cascader-select': cascaderSelect,
  'date-picker': DatePicker_,
  datepicker: DatePicker_,
  'date-range-picker': RangePicker_,
  'date-range-picker-disabled': RangePickerDisabled,

  'time-range-picker': TimeRangePicker_,
  'time-picker': TimePicker_,
  timepicker: TimePicker_,

  form: Form_,
  'select-search': SelectSearch,
  'business-card': BusinessCard,
  switch: SwitchChecked,
  select: Select,
  treeSelect: TreeSelect,
  text: Text,
  booleanToText: BooleanToText,
  // form表单底部按钮
  button: Button,
  submit: submitHOC(Button),
  confirmSubmit: ConfirmSubmit,
  reset: Button,

  checkbox: Checkbox,
  checkboxGroup: CheckboxGroup,
  'checkbox-group': CheckboxGroup,
  radio: RadioGroup,
  mobilePhone: MobilePhone,
  linkText: LinkText,
  phoneSmsCode: PhoneSmsCode,
  switchText: SwitchText,
};

export { default as UnSupport } from './un-support';
