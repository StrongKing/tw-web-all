import React from 'react';
import { SplitterPanelProps } from './interface';

export const InnerPanel: React.FC<SplitterPanelProps> = ({
  children,
  size,
}) => {
  return (
    <div
      className="ss-splitter-panel"
      style={{ flexBasis: size, flexGrow: size ? 1 : 0 }}
    >
      {children}
    </div>
  );
};
const Panel: React.FC<SplitterPanelProps> = () => null;

export default Panel;
