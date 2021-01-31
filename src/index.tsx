import * as React from "react";

export { default as CTextField } from "./ctextfield/ctextfield";
export * from "./ctextfield/ctextfield";
export { default as CTextFieldUrl } from "./ctextfieldurl/ctextfieldurl";
export * from "./ctextfieldurl/ctextfieldurl";
export { default as CTextFieldFile } from "./ctextfieldfile/ctextfieldfile";
export * from "./ctextfieldfile/ctextfieldfile";
export { default as CGrid } from "./cgrid/cgrid";
export * from "./cgrid/cgrid";

export { default as CTable } from "./ctable/ctable";
export * from "./ctable/ctable";
export { default as CApiDoc } from "./capidoc/capidoc";
export * from "./capidoc/capidoc";

//export { default as CDataImport } from "./cdataimport/";
//export * from "./cdataimport/";

export type Props1 = { text: string };

export default class ExampleComponent extends React.Component<Props1> {
  render(): JSX.Element {
    const { text } = this.props;

    return <div style={{ color: "red" }}>Hello {text}</div>;
  }
}
