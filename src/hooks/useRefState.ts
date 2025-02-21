import { Dispatch, RefObject, SetStateAction, useRef, useState } from 'react';

const useRefState = <S>(initialState: S | (() => S)) => {
  const [value, setValue] = useState<S>(initialState);
  const ref = useRef(value);
  const setState: Dispatch<SetStateAction<S>> = (val) => {
    ref.current =
      typeof val === 'function'
        ? (val as (prevState: S) => S)(ref.current)
        : val;
    setValue(ref.current);
  };
  return [value, setState, ref] as [
    S,
    Dispatch<SetStateAction<S>>,
    RefObject<S>,
  ];
};

export default useRefState;
