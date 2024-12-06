import React, { useRef, useEffect, useMemo, useState } from 'react';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import './index.less';

interface propsType {
  className?: string;
  children: React.ReactNode;
  closeText: React.ReactNode;
  openText: React.ReactNode;
  maxHeight: number;
  rowsNumber?: number;
  colorType?: number;
}
export default function Collapse(props: propsType) {
  const {
    className,
    children,
    openText,
    closeText,
    maxHeight,
    colorType = 1,
    rowsNumber = 6,
  } = props;
  const cardRef = useRef();
  const stylesRef = useRef({ paddingBottom: 0 });
  const [expand, setExpand] = useState(false);
  const [mode, setMode] = useState(false);
  const [styles, setStyle] = useState({ paddingBottom: 0 });

  const handleChangeMode = () => {
    setMode(!mode);
  };

  useEffect(() => {
    setTimeout(() => {
      const scrollHeight =
        stylesRef.current.paddingBottom === 0
          ? cardRef.current?.scrollHeight
          : cardRef.current?.scrollHeight - stylesRef.current.paddingBottom;

      if (scrollHeight > maxHeight) {
        setExpand(true);
        stylesRef.current = {
          paddingBottom: 30,
        };
        setStyle({
          paddingBottom: 30,
        });
      } else {
        setExpand(false);
        setMode(false);
        stylesRef.current = {
          paddingBottom: 0,
        };
        setStyle({
          paddingBottom: 0,
        });
      }
    }, 0);
  }, [cardRef.current, maxHeight, children]);

  const contentStyles = useMemo(() => {
    const newHeight = mode ? maxHeight * rowsNumber : maxHeight;
    return {
      maxHeight: newHeight,
      overflow: mode ? 'auto' : 'hidden',
      transition: `max-height .3s`,
    };
  }, [mode, maxHeight, cardRef.current]);

  return (
    <div className={classNames('expand-collapse', className)}>
      <div
        className="card-content"
        style={{ ...contentStyles, ...styles }}
        ref={cardRef}
      >
        {children}
      </div>

      
      {expand && (
        <div className="text" style={{backgroundImage: colorType === 1 ?  'linear-gradient(to bottom,rgba(255, 255, 255, 0.7) 8px,rgba(255, 255, 255, 0.9) 0,#fff 18px)' : 'linear-gradient(180deg,rgba(251, 252, 252, 0.9) 20px,rgba(251, 252, 252, 0.7) 0,#fbfcfc 18px)'}} onClick={handleChangeMode}>
          {mode ? openText : closeText}
          {/* <div className={mode ? 'arrow-up' : 'arrow-down'} /> */}
          { mode ? <UpOutlined />: <DownOutlined />}
        </div>
      )}
    </div>
  );
}
