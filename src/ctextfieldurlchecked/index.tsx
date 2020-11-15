import React from "react"
import TextFieldValueChecked from "../ctextfieldvaluechecked";
  
type Props = {
    isError?: (boolean | ((val: string) => boolean));
    onChange?: ((val: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void);
    onEnter?: ((val: string) => void);
    onDeleteInput?: ((val: string) => void);
    defaultValue?: string;
    useDelBtn?: boolean;
    usePasteBtn?: boolean;
    useEnterBtn?: boolean;
    InputProps?: any;
    inputRef?: any;
    value?: string;
    fileExtension?: string; 

};

const TextFieldFileUrlChecked = React.forwardRef((props: Props, ref: React.RefObject<HTMLInputElement>) => {
    const { fileExtension, ...other } = props;
    const FileExtension = (fileExtension !== null && fileExtension !== undefined && typeof fileExtension === "string") ? fileExtension : "csv"

    const isErrorUrl = (val_str) => {
        if (typeof val_str !== "string")
            return true; 

        if (val_str.substr(0, 8) !== "https://"
            || val_str.indexOf(".", 8) < 8
            || val_str.indexOf("/", 8) < 8
            || val_str.substr(-4) !== "." + FileExtension) {
            //console.log("no valid link like - https://___.xxx/.../___.csv recognized");
            return true;
        }
        return false;
    }

    return (
        <TextFieldValueChecked
            isError={isErrorUrl}
            ref={ref}
            {...other}
        />
    )
});
TextFieldFileUrlChecked.displayName = "TextFieldValueChecked";
export default TextFieldFileUrlChecked;
