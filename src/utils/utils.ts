import * as React from "react";

export interface CRefObject<T> {
  current: T | null;
}
export interface CRefObjNotNull<T> {
  current: T;
}

export const useCombinedRefs = (...refs: React.RefObject<any>[]): React.RefObject<any> => {
  const TargetRef: React.RefObject<any> = React.useRef();

  React.useEffect(() => {
    refs.forEach((ref) => {
      if (!ref) return;
      if (typeof ref === "function") {
        (ref as any)(TargetRef.current);
      }
      (ref as { current: any }).current = TargetRef.current;
    });
  }, [refs]);
  return TargetRef;
};

export const isRefValid = (
  ref: React.RefObject<any> | null
): ref is Omit<React.RefObject<any>, "current"> & { current: any } => {
  if (ref !== null && ref !== undefined) if (ref.current !== null && ref.current !== undefined) return true;
  return false;
};
