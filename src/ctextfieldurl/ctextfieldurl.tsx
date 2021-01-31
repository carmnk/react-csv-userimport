import React from "react";
import TextFieldValueChecked, { CTextFieldPropTypes } from "../ctextfield/ctextfield";

/** CTextFieldUrl Module
 *
 *  Exports:
 * - type CTextFieldUrlPropTypes
 * - const CTextFieldUrl (React.forwardRef)
 */

/** CTextFieldUrlPropTypes
 *
 * type for CTextFieldUrl react component props
 */
export type CTextFieldUrlPropTypes = CTextFieldPropTypes & { fileExtension?: string };

/** CTextFieldUrl
 *
 * react wrapper component for Material UI's <TextField/> component facilitating/specifying usage and extending functionality.\
 * CTextFieldUrl is a composition of CTextField allowing users to provide a url including validity check.
 *
 */
const CTextFieldUrl = React.forwardRef((props: CTextFieldUrlPropTypes, ref: React.RefObject<any>) => {
  const { fileExtension, ...other } = props;
  const fileExtensionInt = typeof fileExtension === "string" ? fileExtension : undefined;

  // function processing isError if URL is invalid (isError === true <=> URL invalid)
  const ProcIsErrorUrl = (val_str: string): boolean => {
    if (typeof val_str !== "string") return true;
    const fileExt = fileExtensionInt !== undefined ? fileExtensionInt.trim() : "[w]{1,}";
    const trimStr = val_str.trim();
    const regexUrlPattern = new RegExp(
      "^((((https:)+(\\/\\/)?|:(\\/\\/)?)|\\/\\/)?(www\\.)?([\\w.]{1,}\\.[\\w]{2,}\\/)+([\\w]{1,}\\/)*([\\w]{1,}\\." +
        fileExt +
        "))"
    );
    return !!regexUrlPattern.test(trimStr);
  };

  return <TextFieldValueChecked isError={ProcIsErrorUrl} ref={ref} {...other} />;
});
CTextFieldUrl.displayName = "TextFieldValueChecked";
export default CTextFieldUrl;
