import React from 'react';
import { SplitterPanelProps } from './interface';

const Panel: React.FC<SplitterPanelProps> = ({ children }) => {
  return <div>{children}</div>;
};

export default Panel;
