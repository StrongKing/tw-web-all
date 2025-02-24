// eslint-disable-next-line no-unused-vars
import React, { MouseEvent, useRef } from 'react';

export interface UseMouseMoveProps {
  start?: (e: MouseEvent, ...args: any[]) => boolean;
  move?: (val: { changeX: number; changeY: number }, e: MouseEvent) => void;
  end?: (val: { changeX: number; changeY: number }, e: MouseEvent) => void;
}
const useMouseMove = ({ start, move, end }: UseMouseMoveProps) => {
  const pressPoint = useRef<{ clientX: number; clientY: number }>(null);
  /**
   * @param {MouseEvent} e
   */
  const onMouseDown = (e: MouseEvent, ...args: any[]) => {
    if (typeof start === 'function') {
      if (!start(e, ...args)) return;
    }
    pressPoint.current = {
      clientX: e.clientX,
      clientY: e.clientY,
    };
  };
  /**
   * @param {MouseEvent} e
   */
  const onMouseMove = (e: MouseEvent) => {
    if (pressPoint.current && typeof move === 'function') {
      move(
        {
          changeX: e.clientX - pressPoint.current.clientX,
          changeY: e.clientY - pressPoint.current.clientY,
        },
        e,
      );
    }
  };
  const onMouseUp = (e: MouseEvent) => {
    if (pressPoint.current && typeof end === 'function') {
      end(
        {
          changeX: e.clientX - pressPoint.current.clientX,
          changeY: e.clientY - pressPoint.current.clientY,
        },
        e,
      );
    }
    pressPoint.current = null;
  };
  return {
    onMouseDown,
    onMouseMove,
    onMouseUp,
  };
};

export default useMouseMove;
