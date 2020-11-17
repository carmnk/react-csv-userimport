import React, {useRef} from "react"; 
import TextFieldValueChecked, {TextFieldVC_Props} from "../ctextfieldvaluechecked";
import { useCombinedRefs } from "../utils/utils";



// type Props = {
//   isError?: boolean | ((val: string) => boolean);
//   onEnter?: (val: { name: string }) => void;
//   InputProps?: any;
//   inputProps?: any;
//   inputFileRef?: any;
//   placeholder?: string;
//   inputAccept?: string;
// };

type Props = Omit<TextFieldVC_Props, "onEnter"> & {
  fileExtension?: string;
  onEnter?: (val: { name: string }) => void;
  inputFileRef?: any;
  inputAccept?: string;
};


const TextFieldFile = React.forwardRef(
  (props: Props, ref: React.RefObject<HTMLInputElement>) => {
    const {
      onEnter,
      inputAccept,
      inputFileRef,
      InputProps,
      inputProps,
      placeholder,
      ...other
    } = props;

    const [InputFile, setInputFile] = React.useState({ name: "" });
    const InputRefInner = useRef(null);
    const InputRefCombined = useCombinedRefs(inputFileRef, InputRefInner);

    const onInputFileChange = (e) => {
      // mirror <input type="file".../> to Textfield and trigger onEnter-prop
      const files = e.target.files;
      if (files.length > 0) {
        setInputFile(files[0]); //
        console.log("On Enter triggered", files[0]);
        if (onEnter) onEnter(files[0]);
      }
    };
    const handleIsError = (val) => {
      if (val === undefined || val === null || val === "") return true;
      return false;
    };
    const handleOnEnter = () => {
      if (InputRefCombined.current !== null && InputFile.name === "") {
        InputRefCombined.current.click();
      } else {
        console.log("On Enter triggered", InputFile);
        if (onEnter) onEnter(InputFile);
      }
    };
    const handleOnDelInput = () => {
      setInputFile({ name: "" });
      InputRefCombined.current.value = "";
    };

    return (
      <div style={{ position: "relative", top: 0 }}>
        <TextFieldValueChecked
          placeholder={placeholder || "Click to select file"}
          ref={ref}
          value={InputFile.name}
          isError={handleIsError}
          usePasteBtn={false}
          onEnter={handleOnEnter}
          onDeleteInput={handleOnDelInput}
          InputProps={{
            readOnly: true,
            ...InputProps,
          }}
          inputProps={{
            onClick: () => {
              InputRefCombined.current.click();
            },
            ...inputProps,
          }}
          {...other}
        />
        <input
          type="file"
          accept={inputAccept}
          ref={InputRefCombined}
          style={{
            position: "absolute",
            top: 0,
            width: "100%",
            height: "100%",
            opacity: "0.0",
            visibility: "hidden",
          }} // invisible but not display: none and therefore present in dom and clickable
          onChange={(e) => {
            onInputFileChange(e);
          }}
        />
      </div>
    );
  }
);
TextFieldFile.displayName = "TextFieldValueChecked";
export default TextFieldFile;