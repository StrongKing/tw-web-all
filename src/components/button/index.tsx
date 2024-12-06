import React from 'react';
import { Dropdown, Menu, Button as AntdButton } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import Button from './button';
import { PropTypes } from './interface';
import './index.less';

export function ButtonList({
  dataSource,
  maxItems,
}: {
  dataSource: PropTypes[];
  maxItems?: number | undefined;
}) {
  let newDataSource = dataSource.slice() || [];
  newDataSource = newDataSource.filter(
    (item: any) => !item?.buttonProps?.disabled,
  );

  let firstPart = newDataSource;
  let secondPart: PropTypes[] = [];
  if (newDataSource.length - maxItems > 0) {
    firstPart = newDataSource.slice(0, maxItems - 1);
    secondPart = newDataSource.slice(maxItems - 1);
  }

  let result = firstPart.map((item, index) => {
    if (item.buttonProps?.disabled) {
      return null;
    }
    return (
      <Button
        key={index}
        {...item}
        buttonProps={{
          ...(item.buttonProps || {}),
          className: classNames(item.className, 'cfListButton'),
        }}
      />
    );
  });
  if (secondPart.length) {
    const menu = (
      <Menu>
        {secondPart.map((item, index) => {
          return (
            <Menu.Item key={index}>
              <Button
                key={index}
                {...item}
                buttonProps={{
                  ...(item.buttonProps || {}),
                  type: 'link',
                }}
              />
            </Menu.Item>
          );
        })}
      </Menu>
    );
    result = [
      ...result,
      <Dropdown key="button-list-more-dropdown" overlay={menu}>
        <AntdButton className="cfListButton" type="link">
          更多 <DownOutlined />
        </AntdButton>
      </Dropdown>,
    ];
  }
  return <div className="buttonList">{result}</div>;
}

export default Button;

export { PropTypes };
