import * as React from "react";
import { useRef, useState, useEffect, forwardRef } from "react";
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import * as clipboardy from 'clipboardy';
import Icon from '@mdi/react';
import { mdiDelete } from '@mdi/js';
import { mdiSubdirectoryArrowLeft } from '@mdi/js';
import { mdiContentPaste } from '@mdi/js';
import { useCombinedRefs, isRefValid } from "../utils/utils";

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
};
interface CRefObject<T> {
    current: T | null;
}



const TextFieldValueChecked = forwardRef((props: Props, ref: React.RefObject<HTMLInputElement>) => {
    const { isError, onChange, defaultValue, inputRef, InputProps, onEnter, onDeleteInput, useDelBtn, usePasteBtn, useEnterBtn, ...other } = props;

    // isError boolean or function (val) => {.....return boolean};
    const isErrorInt = (isError !== undefined && (typeof isError === "boolean" || typeof isError === "function")) ? isError : false;
    const useDelBtnInt = (useDelBtn === false) ? false : true;
    const usePasteBtnInt = (usePasteBtn === false) ? false : true;
    const useEnterBtnInt = (useEnterBtn === false) ? false : true;

    const [IsValError, setIsValError] = useState(false);
    const InputValueRef: (CRefObject<string> | null) = useRef(null);
    const InputRefInner: (CRefObject<HTMLInputElement> | null) = useRef(null);
    const InputRefCombined: (CRefObject<HTMLInputElement> | null) = useCombinedRefs(inputRef, InputRefInner);

    console.log("component");

    const CheckIsError = (val: string): void => {
        let isErr;
        if (typeof isErrorInt === "boolean") { // input controlled 
            isErr = isErrorInt;
        }
        else if (typeof isErrorInt === "function" && val !== undefined && val !== null)
            isErr = isErrorInt(val);
        else return;
        if (IsValError !== isErr)
            setIsValError(isErr);
    }

    // handle uncontrolled input changes (not controlled by props.value )
    const handleUncontrInputChange = (val: string): void => {
        if (props.value === undefined && typeof val === "string") {
            CheckIsError(val);
            if (isRefValid(InputValueRef))
                InputValueRef.current = val;
        }
    }

    const handleOnInputChange = (evt: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        console.log("on Input Changed");
        const newVal = evt.target.value;
        handleUncontrInputChange(newVal);

    }

 
    const onKeyUp = (key: KeyboardEvent) => {
        if ((key as unknown) === "Enter") {
            if (onEnter)
                if (isRefValid<string>(InputValueRef))
                    if (typeof InputValueRef.current === "string")
                    onEnter(InputValueRef.current);
        }
    }

    useEffect(() => {
        const initVal = (defaultValue !== undefined) ? defaultValue : "";
        handleUncontrInputChange(initVal);
        if (isRefValid(InputRefCombined))
            if (InputRefCombined !== null && InputRefCombined.current !== null)
            InputRefCombined.current.addEventListener('keyup', (e) => {onKeyUp(e)});
        console.log("OnDidLoad");
        return () => {
            console.log("OnWillUnmount");
            if (isRefValid(InputRefCombined))
                if (InputRefCombined !== null && InputRefCombined.current !== null)
            InputRefCombined.current.removeEventListener("keyup", onKeyUp);
        }
    }, []);

    // handle controlled input changes (controlled by props.value )
    useEffect(() => {
        console.log("props.value changed");
        if (props.value !== undefined) {
            console.log("props.value provoked state update ");
            InputValueRef.current = props.value;
            CheckIsError(props.value);
        }
    }, [props.value]);
    useEffect(() => {
        console.log("isError changed");
        if (props.value !== undefined)
            CheckIsError(props.value);

    }, [props.isError]);

    console.log("rendering");
    return (
        <TextField

            error={IsValError}

            onChange={(evt: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
                handleOnInputChange(evt);
                if (onChange)
                    onChange(evt)
            }}
            {...other}
            inputRef={InputRefCombined}
            defaultValue={defaultValue}
            ref={ref}
            InputProps={{
                ...InputProps,
                endAdornment:
                    ((useDelBtnInt) || (usePasteBtnInt) || (useEnterBtnInt)) ?
                        <InputAdornment position="end">
                            {(useDelBtnInt)
                                ? <IconButton aria-label="delete" color="primary" onClick={() => {
                                    if (InputRefCombined !== null)
                                        if (InputRefCombined.current !== null)
                                    InputRefCombined.current.value = "";
                                    InputValueRef.current = "";
                                    CheckIsError("");
                                    if (onDeleteInput)
                                        onDeleteInput("");
                                }}>
                                    <Icon
                                        path={mdiDelete}
                                        size={1}
                                        color="#333" />
                                </IconButton>
                                : null}
                            {(usePasteBtnInt)
                                ? <IconButton aria-label="paste" color="primary" onClick={() => {
                                    const clipProm = clipboardy.read();
                                    clipProm.then(val => {
                                        if (InputRefCombined !== null)
                                            if (InputRefCombined.current !== null)
                                        InputRefCombined.current.value = val;
                                        InputValueRef.current = val;
                                        CheckIsError(val);
                                    }).catch((reason) => {
                                        // Log the rejection reason
                                        console.log(`Handle rejected Clipboard-reading promise (${reason}) here.`);
                                        alert("Error reading clipboard. Please make sure to grant permission to access clipboard.")
                                    });
                                }} >
                                    <Icon
                                        path={mdiContentPaste}
                                        size={1}
                                        color="#333" />
                                </IconButton>
                                : null}
                            {(useEnterBtnInt)
                                ? <IconButton aria-label="enter" color="primary" onClick={() => {
                                    if (onEnter)
                                        if (InputValueRef !== null)
                                            if (InputValueRef.current !== null)
                                        onEnter(InputValueRef.current)
                                }}>
                                    <Icon
                                        path={mdiSubdirectoryArrowLeft}
                                        size={1}
                                        color="#333" />
                                </IconButton>
                                : null}
                        </InputAdornment>
                        : null
            }}
        />
    )
});
TextFieldValueChecked.displayName = "TextFieldValueChecked";
export default TextFieldValueChecked; 