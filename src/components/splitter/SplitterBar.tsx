import React from 'react';
import { SplitterBarProps } from './interface';

const SplitterBar: React.FC<SplitterBarProps> = ({ onMouseDown }) => {
  return (
    <div className="ss-splitter-bar">
      <div className="ss-splitter-bar-dragger" onMouseDown={onMouseDown} />
    </div>
  );
};

export default SplitterBar;
