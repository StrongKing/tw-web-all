/* eslint-disable no-plusplus */
import { useMemo, useState } from 'react';
import { SplitterPanelProps } from './interface';

const useSizes = (panelPropList: SplitterPanelProps[], containerSize = 0) => {
  const propSizes = useMemo(
    () => panelPropList.map((el) => el.size),
    [panelPropList],
  );
  const [defaultSizes] = useState(() =>
    panelPropList.map((el) => el.defaultSize),
  );
  const sizes = useMemo(
    () => propSizes.map((el, i) => el ?? defaultSizes[i]),
    [propSizes, defaultSizes],
  );

  const percentSizes = useMemo(() => {
    let emptyCount = 0;
    let ptSizes = sizes.map((el) => {
      if (typeof el === 'number') {
        return el / containerSize;
      } else if (typeof el === 'string') {
        if (el.endsWith('%')) {
          const num = Number(el.replace(/%$/, ''));
          if (Number.isNaN(num)) {
            emptyCount++;
            return;
          }
          return num / 100;
        }
        const num = Number(el);
        if (Number.isNaN(num)) {
          emptyCount++;
          return;
        }
        return num / containerSize;
      }
      emptyCount++;
    });
    const ptTotal = ptSizes.reduce((prev: number, el) => prev + (el ?? 0), 0);

    if (ptTotal > 1 || emptyCount === 0) {
      ptSizes = ptSizes.map((el) => (el === undefined ? el : el / ptTotal));
    } else {
      const avgPt = (1 - ptTotal) / emptyCount;
      ptSizes = ptSizes.map((el) => (el === undefined ? avgPt : el));
    }
    return ptSizes as number[];
  }, [sizes, containerSize]);

  const percentMinSizes = useMemo(
    () =>
      panelPropList.map(({ min }) => {
        if (typeof min === 'number') {
          return min / containerSize;
        } else if (typeof min === 'string') {
          const num = Number(min.replace(/%$/, ''));
          if (Number.isNaN(num)) {
            return 0;
          }
          return num / containerSize;
        }
        return 0;
      }),
    [panelPropList, containerSize],
  );
  const percentMaxSizes = useMemo(
    () =>
      panelPropList.map(({ max }) => {
        if (typeof max === 'number') {
          return max / containerSize;
        } else if (typeof max === 'string') {
          const num = Number(max.replace(/%$/, ''));
          if (Number.isNaN(num)) {
            return 0;
          }
          return num / containerSize;
        }
        return 0;
      }),
    [panelPropList, containerSize],
  );
  const pxSizes = useMemo(
    () => percentSizes.map((el) => el * containerSize),
    [percentSizes, containerSize],
  );

  const panelSizes = useMemo(
    () => (containerSize ? pxSizes : sizes),
    [pxSizes, containerSize, sizes],
  );
  return {
    percentSizes,
    percentMinSizes,
    percentMaxSizes,
    pxSizes,
    panelSizes,
  };
};

export default useSizes;
