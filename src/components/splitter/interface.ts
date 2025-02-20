import { ReactNode } from 'react';

export interface SplitterProps {
  layout?: 'vertical' | 'horizontal';
  barSize?: number;
  children: ReactNode;
}

export interface SplitterPanelProps {
  children: ReactNode;
}

export interface SplitterBarProps {}
