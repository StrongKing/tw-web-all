import { CSSProperties, MouseEventHandler, ReactNode } from 'react';

export interface SplitterProps {
  layout?: 'vertical' | 'horizontal';
  children: ReactNode;
  onResize?: (sizes: number[]) => void;
  disabled?: boolean;
  disabledHideBar?: boolean;
  className?: string;
  style?: CSSProperties;
  sizes?: (string | number | undefined)[];
}

export interface SplitterPanelProps {
  children: ReactNode;
  defaultSize?: number | string;
  size?: number | string;
  min?: number | string;
  max?: number | string;
  className?: string;
}

export interface SplitterBarProps {
  onMouseDown: MouseEventHandler<HTMLDivElement>;
}
