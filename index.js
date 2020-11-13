/**
 * @class ExampleComponent
 */
import * as React from "react";
export { default as CTextFieldValueChecked } from './ctextfieldvaluechecked';
export * from './ctextfieldvaluechecked';
export default class ExampleComponent extends React.Component {
    render() {
        const { text } = this.props;
        return React.createElement("div", { style: { color: "red" } },
            "Hello ",
            text);
    }
}
