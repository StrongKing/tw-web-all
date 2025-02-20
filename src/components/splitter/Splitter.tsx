import React, { useEffect, useRef } from 'react';
import { SplitterProps } from './interface';
import './splitter.less';
import SplitterBar from './SplitterBar';

const Splitter: React.FC<SplitterProps> = ({
  layout = 'horizontal',
  barSize = 4,
  children,
}) => {
  const splitterRef = useRef<HTMLDivElement>(null);
  const childList = Array.isArray(children) ? children : [children];
  const onMove = (e) => {
    console.log('start', e);
  };
  useEffect(() => {}, []);
  return (
    <div
      ref={splitterRef}
      className={`ss-splitter ss-splitter-${layout}`}
      style={{ '--ss-splitter-bar-size': `${barSize}px` }}
    >
      {childList.map((el, i) => (
        <>
          {i !== 0 && <SplitterBar move={onMove} />}
          <div
            style={{
              ...(layout === 'vertical'
                ? { width: '100%' }
                : { height: '100%' }),
            }}
          >
            {el}
          </div>
        </>
      ))}
    </div>
  );
};

export default Splitter;
