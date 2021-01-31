import React from "react";
import TextFieldValueChecked, { CTextFieldPropTypes } from "../ctextfield/ctextfield";
import { useCombinedRefs, isRefValid } from "../utils/utils";

/** CTextFieldFile Module
 *
 *  Exports:
 * - type CTextFieldFilePropTypes
 * - const CTextFieldFile (React.forwardRef)
 */

/** CTextFieldFilePropTypes
 *
 * type for CTextFieldFile react component props
 */
export type CTextFieldFilePropTypes = Omit<CTextFieldPropTypes, "onEnter"> & {
  fileExtension?: string;
  inputFileAccept?: React.InputHTMLAttributes<HTMLInputElement>["accept"]; // = string | undefined
  inputFileRef?: React.RefObject<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  onEnter?: (val: File) => void;
};

/** CTextFieldFile
 *
 * react wrapper component for Material UI's <TextField/> component facilitating/specifying usage and extending functionality.\
 * CTextFieldFile is a composition of CTextField and a hidden HTML Input providing functionality for user file uploads.
 *
 */
const CTextFieldFile = React.forwardRef((props: CTextFieldFilePropTypes, ref: React.RefObject<any>) => {
  const {
    onEnter, // custom prop -> callback for onEnter (File provided)
    inputFileAccept, // custom prop -> accept prop of hidden Input-file
    inputFileRef, // custom prop -> ref to hidden Input-file -> is forwarded
    InputProps, // mui prop -> InputProps.readOnly prop is overridden, is always true (input only via FileOpenDialog not by keyboard or similar)
    inputProps, // mui prop -> inputProps.onClick triggers virtual click on hidden Input-file -> OpenFileDialog -> if provided, inputProps.onClick is executed afterwards
    placeholder, // mui prop -> default value provided, since this component's input value is controlled
    ...other
  } = props;

  const [InputFile, setInputFile] = React.useState<File | null>(null);
  const InputRefCombined: React.RefObject<any> = useCombinedRefs(inputFileRef as React.RefObject<any>); // eslint-disable-line @typescript-eslint/no-explicit-any

  // function processing isError of Textfield if File is invalid (returns true <=> File invalid)
  const ProcIsErrorFile = (val: string): boolean => {
    if (val === undefined || val === null || val === "") return true;
    return false;
  };

  // event handler for Enter Icon Button clicked -> keyboard enter should be disabled since read-only
  const handleOnEnter = (): void => {
    if (InputFile === null) {
      // no File provided -> FileOpenDialog of Input-file
      if (isRefValid(InputRefCombined)) InputRefCombined.current.click();
    } else {
      // File provided -> trigger Callback
      if (onEnter) onEnter(InputFile);
    }
  };

  // event handler for Delete Icon clicked event
  const handleOnDelInput = (): void => {
    setInputFile(null);
    if (isRefValid(InputRefCombined)) InputRefCombined.current.value = ""; // empty FileList
  };

  // event handler for click event of MUI Textbox's Input
  const handleInputClicked = (evt: React.MouseEvent<HTMLInputElement | HTMLTextAreaElement, MouseEvent>): void => {
    if (isRefValid(InputRefCombined)) InputRefCombined.current.click();
    if (inputProps !== undefined)
      if ("onClick" in inputProps) if (typeof inputProps.onClick === "function") inputProps.onClick(evt);
  };

  // event handler for Input-file OnChange event (is triggered when user selects file or deletes selection)
  const handleInputFileChange = (evt: React.ChangeEvent<HTMLInputElement>): void => {
    const files = evt.target.files;
    if (!files) return;
    if (files.length > 0) {
      setInputFile(files[0]);
      if (onEnter) onEnter(files[0]);
    }
  };

  //rendering return
  return (
    <div style={{ position: "relative", top: 0 }}>
      <TextFieldValueChecked
        placeholder={placeholder || "Click to select file"}
        usePasteBtn={false} // currently not supported
        ref={ref}
        value={InputFile !== null ? InputFile.name : ""}
        isError={ProcIsErrorFile}
        onEnter={handleOnEnter} // needed for icon button enter (keyboard disabled since readonly)
        onDeleteInput={handleOnDelInput}
        InputProps={{
          readOnly: true,
          ...InputProps,
        }}
        inputProps={{
          onClick: handleInputClicked,
          ...inputProps,
        }}
        {...other}
      />
      <input
        type="file"
        accept={inputFileAccept}
        ref={InputRefCombined}
        style={{
          position: "absolute",
          top: 0,
          width: "100%",
          height: "100%",
          opacity: "0.0",
          visibility: "hidden",
        }} // invisible but not display: none and therefore present in dom and clickable
        onChange={handleInputFileChange}
      />
    </div>
  );
});
CTextFieldFile.displayName = "TextFieldValueChecked";
export default CTextFieldFile;
