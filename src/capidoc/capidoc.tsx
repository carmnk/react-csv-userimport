import React from "react";

/** CApiDoc Module
 *
 *  Exports:
 * - interface CApiDocPropTypes
 * - function CApiDoc
 */

/** CApiDocPropTypes
 *
 * interface for CApiDoc react component props
 */
export interface CApiDocPropTypes {
  content?: string;
}

/** CApiDoc
 *
 * react component rendering an api documentation page based on TS/TSDoc parsed json file which can be created using react-docgen-typescript.\
 *
 */
export default function CApiDoc(props: CApiDocPropTypes): React.ReactElement | null {
  return <div> here there be api doc content</div>;
}
