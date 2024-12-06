import React from 'react';
// @ts-ignore
import Select from './mod/select';
// @ts-ignore
// import Covered from './mod/covered';
// @ts-ignore
import Link from './mod/link';
// @ts-ignore
import Text from './mod/text';

import BooleanToText from './mod/booleanToText';

import ArrayToText from './mod/arrayToText';

import Button from '@/components/button';
// @ts-ignore
import ButtonList from './mod/button-list';
// @ts-ignore
import DateTime from './mod/datetime';
// @ts-ignore
import Input from './mod/input';
// @ts-ignore
import Order from './mod/auto-order';
// @ts-ignore
import Status from './mod/status';
import Picture from './mod/picture';
import { TableCellProps } from './interface';

export function UnSupport(props: TableCellProps) {
  return (
    <p style={{ color: 'red' }}>不支持的 uiType：{props.tableProps.uiType}</p>
  );
}

export default {
  link: Link,
  text: Text,
  // covered: Covered,
  // passedCount: PassedCount,
  dateTime: DateTime,
  select: Select,
  order: Order,
  input: Input,
  status: Status,
  button: Button,
  buttonList: ButtonList,
  booleanToText: BooleanToText,
  arrayToText: ArrayToText,
  picture: Picture,
  // jsonInput: WrappedJSONInput,
  // functionSelector: FunctionSelector,
};
