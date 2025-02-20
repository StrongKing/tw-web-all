import React, { CSSProperties } from 'react';
import ActionButton from '../button';
import './index.less';

export default ({
  buttonList,
  className,
  style,
  primaryPosition = 'start',
}: {
  buttonList: any[];
  className: string;
  style: CSSProperties;
  primaryPosition: 'start' | 'end' | 'normal';
}) => {
  const btns = buttonList.map((btnProps, index) => {
    const {
      uiType,
      request,
      isBatch,
      buttonProps: oldBtnProps = {},
      qrBeforeClick = false,
      confirmBeforeClick,
      ...others
    } = btnProps;
    const buttonProps = { ...oldBtnProps };
    if (['start', 'end'].includes(primaryPosition)) {
      if (
        index === (primaryPosition === 'start' ? 0 : buttonList.length - 1) &&
        (!btnProps.type || buttonProps.type === 'default')
      ) {
        buttonProps.type = 'primary';
      } else if (
        (primaryPosition === 'start'
          ? index > 0
          : index < buttonList.length - 1) &&
        buttonProps.type === 'primary'
      ) {
        delete buttonProps.type;
      }
    }
    if (request) {
      let nextConfirmBeforeClick = confirmBeforeClick;
      if (confirmBeforeClick) {
        const {
          renderClassName,
          renderContent,
          className: confirmClassName,
          content,
          ...otherConfirmClick
        } = confirmBeforeClick;

        nextConfirmBeforeClick = {
          className:
            typeof renderContent === 'function'
              ? renderClassName(request?.params)
              : confirmClassName,
          content:
            typeof renderContent === 'function'
              ? renderContent(request?.params)
              : content,
          ...otherConfirmClick,
        };
      }

      return (
        <ActionButton
          uiType={uiType}
          key={index}
          request={request}
          qrBeforeClick={qrBeforeClick}
          isBatch={isBatch}
          buttonProps={buttonProps}
          confirmBeforeClick={nextConfirmBeforeClick}
          {...others}
        />
      );
    }
    return (
      <ActionButton
        key={index}
        {...btnProps}
        qrBeforeClick={qrBeforeClick}
        isBatch={isBatch}
      />
    );
  });
  return (
    <div className={`ss-button-list ${className || ''}`} style={style}>
      {btns}
    </div>
  );
};
