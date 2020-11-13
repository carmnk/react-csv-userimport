import * as React from "react";

interface CRefObject<T> {
  current: T | null;
}


export const useCombinedRefs = <T>(
  ...refs: (CRefObject<T> | null)[]
): CRefObject<T> | null => {
  const TargetRef: (CRefObject<T> | null) = React.useRef() as CRefObject<T>;

  React.useEffect(() => {
    refs.forEach((ref) => {
      if (!ref) return;

      ref.current = TargetRef.current;
    });
  }, [refs]);

  return TargetRef;
};


export const isRefValid = <T>(ref: (CRefObject<T> | null)): boolean => {
  if (ref !== null && ref !== undefined)
    if (ref.current !== null && ref.current !== undefined)
      return true; 
  return false; 
}