import * as React from "react";
import { useRef, useState, useEffect, forwardRef } from "react";
import TextField, { TextFieldProps } from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import * as clipboardy from "clipboardy";
import Icon from "@mdi/react";
import { mdiDelete } from "@mdi/js";
import { mdiSubdirectoryArrowLeft } from "@mdi/js";
import { mdiContentPaste } from "@mdi/js";
import { useCombinedRefs, isRefValid } from "../utils/utils";

/** CTextField Module
 *
 *  Exports:
 * - type CTextFieldPropTypes
 * - const CTextField (React.forwardRef)
 */

/** CTextFieldPropTypes
 *
 * type for CTextField react component props
 */
export type CTextFieldPropTypes = TextFieldProps & {
  isError?: boolean | ((val: string) => boolean);
  onEnter?: (val: string) => void;
  onDeleteInput?: (val: string) => void;
  useDelBtn?: boolean;
  usePasteBtn?: boolean;
  useEnterBtn?: boolean;
};

/**  internal const for CTextField defaultProps */
const CTextFieldDefaultProps: CTextFieldPropTypes = {
  useDelBtn: true,
  usePasteBtn: true,
  useEnterBtn: true,
};

/** CTextField
 *
 * react wrapper component for Material UI's <TextField/> component facilitating/specifying usage and extending functionality.
 *
 */
const CTextField = forwardRef((props: CTextFieldPropTypes, ref: React.RefObject<any>) => {
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    error, // mui prop: depreciated, just extract from ...other
    isError, // custom prop, replacing "error" which is depreciated, (is passed to underlying mui textfield as error)
    onChange, //mui prop, React.ChangeEvent
    defaultValue, //mui prop, just read an pass to underlying textfield
    inputRef, // mui prop, used for combined ref, inputRef from underlying textfield is forwaded
    InputProps, // mui prop, added endAdornment for control buttons (enter, paste, del)
    onEnter, // custom prop, callback when enter is fired on keyboard or iconbutton
    onDeleteInput, // custom prop, callback when delete iconbutton is fired
    useDelBtn, // custom prop, dets if Delete Icon Button is displayed
    usePasteBtn, // custom prop, dets if Paste Icon Button is displayed
    useEnterBtn, // custom prop, dets if Enter Icon Button is displayed
    ...other
  } = props;

  const isErrorInt =
    isError !== undefined && (typeof isError === "boolean" || typeof isError === "function") ? isError : false;

  const [IsValError, setIsValError] = useState<boolean>(false);
  const InputValueRef: React.RefObject<any> = useRef(""); // eslint-disable-line @typescript-eslint/no-explicit-any
  const InputRefCombined: React.RefObject<any> = useCombinedRefs(inputRef as React.RefObject<any>); // eslint-disable-line @typescript-eslint/no-explicit-any

  const ProcIsError = (val: string): void => {
    let isErr;
    if (typeof isErrorInt === "boolean") {
      isErr = isErrorInt;
    } else if (typeof isErrorInt === "function" && val !== undefined && val !== null) isErr = isErrorInt(val);
    else return;
    if (IsValError !== isErr) setIsValError(isErr);
  };

  const ProcUncontrInputChange = (val: string): void => {
    if (props.value === undefined && typeof val === "string") {
      ProcIsError(val);
      if (isRefValid(InputValueRef)) InputValueRef.current = val;
    }
  };

  // evt handler for OnChange evt of Input/Textfield (only component-internal)
  const HandleOnInputChange = (evt: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => {
    const newVal = evt.target.value;
    ProcUncontrInputChange(newVal);
    if (onChange) onChange(evt);
  };

  // evt handler for KeyUp evt of Input/Textfield -> Callback onEnter
  const HandleOnKeyUp = (key: KeyboardEvent): void => {
    if ((key as unknown) === "Enter") {
      if (onEnter)
        if (isRefValid(InputValueRef)) if (typeof InputValueRef.current === "string") onEnter(InputValueRef.current);
    }
  };

  // evt handler for Delete Icon Clicked
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const HandleOnDeleteIconClicked = (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    if (isRefValid(InputRefCombined)) {
      InputRefCombined.current.value = "";
    }
    ProcIsError("");
    let valBeforeDel = "";
    if (isRefValid(InputValueRef)) {
      valBeforeDel = InputValueRef.current;
      InputValueRef.current = "";
    }
    if (onDeleteInput) onDeleteInput(valBeforeDel);
  };

  // evt handler for Paste Icon clicked
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const HandleOnPasteIconClicked = (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    const clipProm = clipboardy.read();
    clipProm
      .then((val) => {
        if (isRefValid(InputRefCombined)) InputRefCombined.current.value = val;
        if (isRefValid(InputValueRef)) InputValueRef.current = val;
        ProcIsError(val);
      })
      .catch((reason) => {
        // Log the rejection reason
        console.log(`Handle rejected Clipboard-reading promise (${reason}) here.`);
        alert("Error reading clipboard. Please make sure to grant permission to access clipboard.");
      });
  };

  // evt handler for Enter Icon clicked
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const HandleOnEnter = (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    if (onEnter && isRefValid(InputValueRef)) onEnter(InputValueRef.current);
  };

  // OnDidLoad
  useEffect(() => {
    const initVal =
      typeof defaultValue === "string" || typeof defaultValue === "number" ? (defaultValue.toString() as string) : "";
    ProcUncontrInputChange(initVal);
    if (isRefValid(InputRefCombined))
      InputRefCombined.current.addEventListener("keyup", (e: KeyboardEvent) => {
        HandleOnKeyUp(e);
      });
    // OnWillUnMount
    return () => {
      if (isRefValid(InputRefCombined)) InputRefCombined.current.removeEventListener("keyup", HandleOnKeyUp);
    };
  }, []);

  // OnPropertyChanged(prop=value) - handle controlled input changes (controlled by props.value)
  useEffect(() => {
    if (props.value !== undefined) {
      if (isRefValid(InputValueRef)) InputValueRef.current = props.value as string;
      ProcIsError(props.value as string);
    }
  }, [props.value]);

  // OnPropertyChanged(prop=isError) - if isError boolean/function is changed recheck if is error
  useEffect(() => {
    console.log("isError changed");
    if (props.value !== undefined) ProcIsError(props.value as string);
  }, [props.isError]);

  // rendering return
  return (
    <TextField
      error={IsValError}
      onChange={HandleOnInputChange}
      inputRef={InputRefCombined}
      defaultValue={defaultValue}
      ref={ref}
      {...other}
      InputProps={{
        ...InputProps,
        endAdornment:
          useDelBtn || usePasteBtn || useEnterBtn ? (
            <InputAdornment position="end">
              {useDelBtn ? (
                <IconButton aria-label="delete" color="primary" onClick={HandleOnDeleteIconClicked}>
                  <Icon path={mdiDelete} size={1} color="#333" />
                </IconButton>
              ) : null}
              {usePasteBtn ? (
                <IconButton aria-label="paste" color="primary" onClick={HandleOnPasteIconClicked}>
                  <Icon path={mdiContentPaste} size={1} color="#333" />
                </IconButton>
              ) : null}
              {useEnterBtn ? (
                <IconButton aria-label="enter" color="primary" onClick={HandleOnEnter}>
                  <Icon path={mdiSubdirectoryArrowLeft} size={1} color="#333" />
                </IconButton>
              ) : null}
            </InputAdornment>
          ) : null,
      }}
    />
  );
});
CTextField.displayName = "CTextField";
CTextField.defaultProps = CTextFieldDefaultProps;
export default CTextField;
