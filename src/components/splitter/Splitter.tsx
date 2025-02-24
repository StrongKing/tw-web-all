import useMouseMove from '@/hooks/useMouseMove';
import useRefState from '@/hooks/useRefState';
import React, {
  isValidElement,
  ReactElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { SplitterPanelProps, SplitterProps } from './interface';
import { InnerPanel } from './Panel';
import './splitter.less';
import SplitterBar from './SplitterBar';
import useSizes from './useSize';

const Splitter: React.FC<SplitterProps> = ({
  layout = 'horizontal',
  children,
  onResize,
  disabled = false,
  disabledHideBar = true,
}) => {
  const splitterRef = useRef<HTMLDivElement>(null);
  const [cacheSizes, setCacheSizes, cacheSizesRef] = useRefState<number[]>([]);
  const panels = useMemo(
    () =>
      (Array.isArray(children) ? children : [children])
        .filter(isValidElement)
        .map((node, i) => {
          const { props } = node as ReactElement<SplitterPanelProps>;
          return {
            ...props,
            size: props.size ?? cacheSizes[i],
          };
        }),
    [cacheSizes, children],
  );
  const [containerSize, setContainerSize] = useState(0);
  const { panelSizes } = useSizes(panels, containerSize);
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === splitterRef.current) {
          setContainerSize(
            layout === 'horizontal'
              ? splitterRef.current.offsetWidth
              : splitterRef.current.offsetHeight,
          );
        }
      });
    });
    if (splitterRef.current) {
      observer.observe(splitterRef.current);
    }
    return () => {
      observer.disconnect();
    };
  }, []);
  const moveBar = useRef({ oldSizePrev: 0, oldSizeNext: 0, index: -1 });
  const { onMouseDown, onMouseUp, onMouseMove } = useMouseMove({
    start: (e, i: number) => {
      if (disabled) return false;
      moveBar.current = {
        index: i,
        oldSizePrev: panelSizes[i - 1] as number,
        oldSizeNext: panelSizes[i] as number,
      };
      return true;
    },
    move: ({ changeX, changeY }) => {
      if (moveBar.current.index === -1) return;
      const changePt = layout === 'horizontal' ? changeX : changeY;
      setCacheSizes((old) => {
        old[moveBar.current.index - 1] = Math.max(
          0,
          Math.min(
            moveBar.current.oldSizePrev + moveBar.current.oldSizeNext,
            moveBar.current.oldSizePrev + changePt,
          ),
        );
        old[moveBar.current.index] = Math.max(
          0,
          Math.min(
            moveBar.current.oldSizePrev + moveBar.current.oldSizeNext,
            moveBar.current.oldSizeNext - changePt,
          ),
        );
        return [...old];
      });
    },
    end: ({ changeX, changeY }) => {
      console.log(changeX, changeY);
      if (moveBar.current.index === -1) return;
      const changePt = layout === 'horizontal' ? changeX : changeY;
      setCacheSizes((old) => {
        old[moveBar.current.index - 1] = Math.max(
          0,
          Math.min(
            moveBar.current.oldSizePrev + moveBar.current.oldSizeNext,
            moveBar.current.oldSizePrev + changePt,
          ),
        );
        old[moveBar.current.index] = Math.max(
          0,
          Math.min(
            moveBar.current.oldSizePrev + moveBar.current.oldSizeNext,
            moveBar.current.oldSizeNext - changePt,
          ),
        );
        return [...old];
      });
      moveBar.current.index = -1;
      onResize?.(cacheSizesRef.current);
    },
  });
  useEffect(() => {
    document.body.addEventListener('mouseup', onMouseUp as any);
    return () => {
      document.body.removeEventListener('mouseup', onMouseUp as any);
    };
  }, [onMouseUp]);
  return (
    <div
      ref={splitterRef}
      className={[
        'ss-splitter',
        `ss-splitter-${layout}`,
        disabled ? 'ss-splitter--disabled' : '',
      ].join(' ')}
      onMouseMove={onMouseMove}
    >
      {panels.map((el, i) => (
        <>
          {i !== 0 && (!disabled || !disabledHideBar) && (
            <SplitterBar
              key={`splitter-bar-${i}`}
              onMouseDown={(e) => onMouseDown(e, i)}
            />
          )}
          <InnerPanel
            key={`splitter-panel-${i}`}
            {...el}
            size={panelSizes[i]}
          />
        </>
      ))}
    </div>
  );
};

export default Splitter;
