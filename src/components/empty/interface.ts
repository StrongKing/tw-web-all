import { CSSProperties, ReactNode } from 'react';

export interface EmptyProps {
  className?: string;
  style?: CSSProperties;
  type?:
    | 'empty'
    | '404'
    | '500'
    | 'neterr'
    | 'recall'
    | 'delete'
    | 'loading'
    | 'construct'
    | 'permission'
    | 'search';
  text?: ReactNode | string;
  img?: string;
  btnText?: string;
  onClick?: () => void;
}
