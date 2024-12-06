import React from 'react';

// import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { compose, withHandlers } from 'recompose';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { withConfirmHOC, spreadButtonPropsHOC } from './mod/hoc';
import { LinkButtonProps } from './interface';

type LinkProps = LinkButtonProps &
  RouteComponentProps & {
    selectedRowKeys: [];
    onBeforeClick: () => Promise<void>;
    onClick?: (e: React.MouseEvent, selectedRowKeys: []) => void;
  };

export default compose(
  withConfirmHOC,
  withRouter,
  // withPropTypes:
  withHandlers({
    onClick:
      ({
        onBeforeClick,
        onClick,
        history,
        to,
        replace,
        selectedRowKeys,
      }: LinkProps) =>
      (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        onBeforeClick(to)
          .then(() => {
            history[replace ? 'replace' : 'push'](to);

            if (onClick) onClick(e, selectedRowKeys);
          })
          .catch((err) => {
            console.log(err);
            // err?.stopPropagation();
          });
      },
  }),
  spreadButtonPropsHOC,
)(Button);
