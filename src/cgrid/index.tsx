import * as React from "react";

type CssColsWidths = (number | string)[]

type Props = {
  flex?: boolean;
  colWidths?: CssColsWidths;
  colMinWidths?: CssColsWidths;
  justifyContent?: string;
  alignItems?: string[];
  textAlign?: ("start" | "end" | "left" | "right" | "center" | "justify" |  "match-parent")[];
  border?: string;
  content: any;
  borderRadius?: string;
  boxShadow?: string;
  flexMargin?: number;
  flexMinWidth?: number; // flexMargin is already included 
  margin?: string; 
}

export default function CGrid(props: Props): (React.ReactElement | null) {
  const { flex = false, colWidths, colMinWidths, content, justifyContent = "center",
    alignItems, textAlign, border, borderRadius, boxShadow, flexMargin, flexMinWidth = 320, margin } = props

  const flexInt = flex === true ? true : false;
  const colWidthsInt = flexInt === false ? colWidths : undefined;
  const colMinWidthsInt = flexInt === false ? colMinWidths : undefined;
  const borderInt = (border !== undefined) ? border : "0px solid black";


  if (content === undefined) {
    console.log("Warning CGrid without content provided");
    return null;
  }


  let CSS_gridTemplateColumns = ""
  let ncols = 0;
  if (flexInt === false) {
    let CssMinWidth: (string | undefined), CssMaxWidth: (string | undefined);
    if (colWidthsInt === undefined && colMinWidthsInt === undefined) {
      ncols = content.length;
    }
    else if (colWidthsInt === undefined && colMinWidthsInt !== undefined) {
      ncols = colMinWidthsInt.length;
    }
    else
      ncols = (colWidthsInt as CssColsWidths).length;

    if (colWidthsInt === undefined || colWidthsInt.length < ncols)
      CssMaxWidth = "100%";
    if (colMinWidthsInt === undefined || colMinWidthsInt.length < ncols)
      CssMinWidth = "0%";


    for (let i = 0; i < ncols; i++) {
      const widthMax =
        (CssMaxWidth !== undefined || colWidthsInt=== undefined)
          ? CssMaxWidth
          : (typeof colWidthsInt[i] === "number")
            ? (colWidthsInt[i] !== 0)
              ? colWidthsInt[i] + "px"
              : "100%"
            : colWidthsInt[i];

      const widthMin =
        (CssMinWidth !== undefined || colMinWidthsInt === undefined)
          ? CssMinWidth
          : (typeof colMinWidthsInt[i] === "number")
            ? (colMinWidthsInt[i] !== 0) ? colMinWidthsInt[i] + "px" : "0%"
            : colMinWidthsInt[i];

      if (i < ncols - 1)
        CSS_gridTemplateColumns += `minmax(${widthMin}, ${widthMax}) `
      else CSS_gridTemplateColumns += `minmax(${widthMin}, ${widthMax})`
    }
  }
  else {
    CSS_gridTemplateColumns = `repeat(auto-fit,minmax(${flexMinWidth}px, 1fr))`
  }

  let useAlignItems = false;
  if (alignItems !== undefined) {
    useAlignItems = (alignItems.length === content.length) ? true : false;
  }
  let useTextAlign = false;
  if (textAlign !== undefined) {
    useTextAlign = (textAlign.length === content.length) ? true : false;
  }

  let borderRadiusTopRight: string, borderRadiusTopLeft: string, borderRadiusBottomRight: string, borderRadiusBottomLeft: string;
  borderRadiusTopRight = borderRadiusTopLeft = borderRadiusBottomRight = borderRadiusBottomLeft = "0px solid black";
  if (borderRadius !== undefined) {
    const borderRadiusInt = borderRadius.trim().split(" ");
    if (borderRadiusInt.length === 1)
      borderRadiusTopRight = borderRadiusTopLeft = borderRadiusBottomRight = borderRadiusBottomLeft = borderRadiusInt[0];
    else if (borderRadiusInt.length === 2) {
      borderRadiusTopLeft = borderRadiusBottomRight = borderRadiusInt[0];
      borderRadiusTopRight = borderRadiusBottomLeft = borderRadiusInt[1];
    }
    else if (borderRadiusInt.length === 3) {
      borderRadiusTopLeft = borderRadiusInt[0];
      borderRadiusTopRight = borderRadiusBottomLeft = borderRadiusInt[1];
      borderRadiusBottomRight = borderRadiusInt[2];
    }
    else if (borderRadiusInt.length === 4) {
      borderRadiusTopLeft = borderRadiusInt[0];
      borderRadiusTopRight = borderRadiusInt[1];
      borderRadiusBottomRight = borderRadiusInt[2];
      borderRadiusBottomLeft = borderRadiusInt[3];
    }
  }

  const makeBorder = (icontent: number, ncontent: number, ncols: number, flex: boolean) => {
    const cssBorder: {
      borderLeft: string;
      borderTop: string;
      borderRight?: string,
      borderBottom?: string;
      borderTopLeftRadius?: string;
      borderTopRightRadius?: string;
      borderBottomRightRadius?: string;
      borderBottomLeftRadius?: string;
      WebkitBoxShadow?: string;
      boxShadow?: string;
    } = {
      borderLeft: borderInt,
      borderTop: borderInt,
    };

    if (flex === false) {
      if (icontent >= ncontent - ncols) { // last row
        if ((icontent + 1) % ncols === 0) { // last row and col 
          cssBorder.borderRight = borderInt;
          cssBorder.borderBottom = borderInt;
          cssBorder.borderBottomRightRadius = borderRadiusBottomRight;
        }
        else {
          if (icontent === ncontent - ncols) { // last row first col
            cssBorder.borderBottomLeftRadius = borderRadiusBottomLeft;
          }
          cssBorder.borderBottom = borderInt;
        }
      }
      if (icontent === 0) // first row and col
        cssBorder.borderTopLeftRadius = borderRadiusTopLeft;
      if ((icontent + 1) % ncols === 0) { // last cols 
        cssBorder.borderRight = borderInt;
        if (icontent + 1 === ncols) // first row, last col
          cssBorder.borderTopRightRadius = borderRadiusTopRight;
      }
    }
    else { // flex === true
      cssBorder.borderBottom = borderInt;
      cssBorder.borderRight = borderInt;
      cssBorder.borderBottomLeftRadius = borderRadiusBottomLeft;
      cssBorder.borderBottomRightRadius = borderRadiusBottomRight;
      cssBorder.borderTopLeftRadius = borderRadiusTopLeft;
      cssBorder.borderTopRightRadius = borderRadiusTopRight;
    }

    if (boxShadow !== undefined) {
      cssBorder.WebkitBoxShadow = boxShadow;
      cssBorder.boxShadow = boxShadow;
    }
    return { ...cssBorder }
  }


  return (

    <div
      style={{
        display: "grid",
        gridTemplateColumns: CSS_gridTemplateColumns,
        justifyContent: justifyContent,
        //alignItems: "center",
        //textAlign: "center",
        margin: margin !== undefined ? margin : 0,
        //border: "1px solid #333",
        position: "relative",

      }}
    >
      {content.map((val: any, ival: number) => (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "100%",
            height: flexInt ? "auto" : "100%",
            alignItems: (useAlignItems && alignItems!==undefined) ? alignItems[ival] : "center",
            textAlign: (useTextAlign && textAlign!==undefined) ? textAlign[ival] : "center",
            ...makeBorder(ival, content.length, ncols, flexInt),

            margin: (flexInt && flexMargin !== undefined) ? flexMargin : 0,
          }}
          key={"content_" + ival}
        >
          <div>{val}</div>
        </div>
      ))}

    </div>

  )
}
