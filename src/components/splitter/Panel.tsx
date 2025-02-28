import React from 'react';
import { SplitterPanelProps } from './interface';

export const InnerPanel: React.FC<SplitterPanelProps> = ({
  children,
  size,
  className = '',
}) => {
  return (
    <div
      className={['ss-splitter-panel', className].join(' ')}
      style={{ flexBasis: size, flexGrow: size ? 1 : 0, flexShrink: 1 }}
    >
      {children}
    </div>
  );
};
const Panel: React.FC<SplitterPanelProps> = () => null;

export default Panel;
