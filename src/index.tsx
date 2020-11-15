/**
 * @class ExampleComponent
 */

import * as React from "react";
export { default as CTextFieldValueChecked } from "./ctextfieldvaluechecked";
export * from "./ctextfieldvaluechecked";

//export * from "./ctextfieldvaluechecked";
//export { default as CTextFieldValueChecked } from "./ctextfieldvaluechecked";

export type Props1 = { text: string };

export default class ExampleComponent extends React.Component<Props1> {
  render() {
    const { text } = this.props;

    return <div style={{ color: "red" }}>Hello {text}</div>;
  }
}
