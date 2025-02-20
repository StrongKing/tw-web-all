import React from 'react';
import useMouseMove, { UseMouseMoveProps } from '@/hooks/useMouseMove';

const SplitterBar: React.FC<UseMouseMoveProps> = ({ ...mouseFns }) => {
  const mouseEvent = useMouseMove(mouseFns);
  return <div className="ss-splitter-bar" {...mouseEvent} />;
};

export default SplitterBar;
