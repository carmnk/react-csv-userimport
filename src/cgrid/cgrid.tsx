import React from "react";

/** CGrid Module
 *
 *  Exports:
 * - interface CGridPropTypes
 * - function CGrid
 */

/** CGridPropTypes
 *
 * interface for CGrid react component props
 */
export interface CGridPropTypes {
  flex?: boolean;
  //colWidths?: CssColsWidths;
  //colMinWidths?: CssColsWidths;
  justifyContent?: React.CSSProperties["justifyContent"];
  border?: string;
  borderRadius?: string;
  boxShadow?: string;
  data: {
    content: React.ReactNode;
    gridCellContainerProps?: React.HTMLAttributes<HTMLDivElement>;
    gridCellProps?: React.HTMLAttributes<HTMLDivElement>;
    alignItems?: React.CSSProperties["alignItems"];
    textAlign?: React.CSSProperties["textAlign"];
  }[];
  cols?: {
    minWidth?: number | string;
    maxWidth?: number | string;
  }[];
  flexMargin?: number;
  flexMinWidth?: number; // flexMargin is already included
  //margin?: string;
  gridContainerProps?: React.HTMLAttributes<HTMLDivElement>;
}

/**  internal const for CGrid defaultProps */
const CGridDefaultProps: CGridPropTypes = {
  flex: false,
  justifyContent: "center",
  flexMinWidth: 320,
  data: [
    {
      content: {},
    },
  ],
};

/** CGrid
 *
 * react component rendering a flexible css-based grid component facilitating/specifying usage.
 * @docu
 */
export default function CGrid(props: CGridPropTypes): React.ReactElement | null {
  const {
    flex,
    //colWidths,
    //colMinWidths,
    justifyContent,
    border,
    borderRadius,
    boxShadow,
    flexMargin,
    flexMinWidth,
    //margin,
    gridContainerProps,
    data,
    cols,
  } = props;

  const { style: gridContainerPropsStyle, ...gridContainerPropsNoStyle } =
    gridContainerProps !== undefined ? gridContainerProps : { style: undefined };
  const flexInt = flex === true ? flex : false;
  const borderInt = border !== undefined ? border : "0px solid black";

  if (data === undefined) {
    console.log("Warning CGrid without data provided");
    return null;
  }

  // make CSS-gridTemplateColumns Prop based on provided cols/data
  let CSS_gridTemplateColumns = "";
  let ncols = 0;
  if (flexInt === false) {
    if (cols === undefined) {
      ncols = data.length;
    } else ncols = cols.length;

    //if (colWidthsInt === undefined || colWidthsInt.length < ncols) CssMaxWidth = "100%";
    //if (colMinWidthsInt === undefined || colMinWidthsInt.length < ncols) CssMinWidth = "0%";

    // let CssMinWidth = "0%";
    // let CssMaxWidth = "100%";
    for (let i = 0; i < ncols; i++) {
      const widthMax =
        cols === undefined
          ? "100%"
          : cols[i].maxWidth === undefined
          ? "100%"
          : typeof cols[i].maxWidth === "number"
          ? cols[i].maxWidth === 0
            ? "100%"
            : cols[i].maxWidth + "px"
          : cols[i].maxWidth;

      const widthMin =
        cols === undefined
          ? "0%"
          : cols[i].minWidth === undefined
          ? "0%"
          : typeof cols[i].minWidth === "number"
          ? cols[i].minWidth === 0
            ? "0%"
            : cols[i].minWidth + "px"
          : cols[i].minWidth;

      // const widthMax =
      //   CssMaxWidth !== undefined || colWidthsInt === undefined
      //     ? CssMaxWidth
      //     : typeof colWidthsInt[i] === "number"
      //     ? colWidthsInt[i] !== 0
      //       ? colWidthsInt[i] + "px"
      //       : "100%"
      //     : colWidthsInt[i];

      // const widthMin =
      //   CssMinWidth !== undefined || colMinWidthsInt === undefined
      //     ? CssMinWidth
      //     : typeof colMinWidthsInt[i] === "number"
      //     ? colMinWidthsInt[i] !== 0
      //       ? colMinWidthsInt[i] + "px"
      //       : "0%"
      //     : colMinWidthsInt[i];

      if (i < ncols - 1) CSS_gridTemplateColumns += `minmax(${widthMin}, ${widthMax}) `;
      else CSS_gridTemplateColumns += `minmax(${widthMin}, ${widthMax})`;
    }
  } else {
    CSS_gridTemplateColumns = `repeat(auto-fit,minmax(${flexMinWidth}px, 1fr))`;
  }

  // extract CSS borderRadius property since border and radii are not applied on GridContainer but on GridCellContainer
  let borderRadiusTopRight: string,
    borderRadiusTopLeft: string,
    borderRadiusBottomRight: string,
    borderRadiusBottomLeft: string;
  borderRadiusTopRight = borderRadiusTopLeft = borderRadiusBottomRight = borderRadiusBottomLeft = "0px solid black";
  if (borderRadius !== undefined) {
    const borderRadiuses = borderRadius.trim().split(" ");
    if (borderRadiuses.length === 1)
      borderRadiusTopRight = borderRadiusTopLeft = borderRadiusBottomRight = borderRadiusBottomLeft = borderRadiuses[0];
    else if (borderRadiuses.length === 2) {
      borderRadiusTopLeft = borderRadiusBottomRight = borderRadiuses[0];
      borderRadiusTopRight = borderRadiusBottomLeft = borderRadiuses[1];
    } else if (borderRadiuses.length === 3) {
      borderRadiusTopLeft = borderRadiuses[0];
      borderRadiusTopRight = borderRadiusBottomLeft = borderRadiuses[1];
      borderRadiusBottomRight = borderRadiuses[2];
    } else if (borderRadiuses.length === 4) {
      borderRadiusTopLeft = borderRadiuses[0];
      borderRadiusTopRight = borderRadiuses[1];
      borderRadiusBottomRight = borderRadiuses[2];
      borderRadiusBottomLeft = borderRadiuses[3];
    }
  }

  // make Border and Borderradius
  const ProcMakeBorder = (icontent: number, ncontent: number, ncols: number, flex: boolean) => {
    const cssBorder: {
      borderLeft: string;
      borderTop: string;
      borderRight?: string;
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
      if (icontent >= ncontent - ncols) {
        // last row
        if ((icontent + 1) % ncols === 0) {
          // last row and col
          cssBorder.borderRight = borderInt;
          cssBorder.borderBottom = borderInt;
          cssBorder.borderBottomRightRadius = borderRadiusBottomRight;
        } else {
          if (icontent === ncontent - ncols) {
            // last row first col
            cssBorder.borderBottomLeftRadius = borderRadiusBottomLeft;
          }
          cssBorder.borderBottom = borderInt;
        }
      }
      if (icontent === 0)
        // first row and col
        cssBorder.borderTopLeftRadius = borderRadiusTopLeft;
      if ((icontent + 1) % ncols === 0) {
        // last cols
        cssBorder.borderRight = borderInt;
        if (icontent + 1 === ncols)
          // first row, last col
          cssBorder.borderTopRightRadius = borderRadiusTopRight;
      }
    } else {
      // flex === true
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
    return { ...cssBorder };
  };

  // render
  return (
    <div
      style={{
        ...gridContainerPropsStyle,
        display: "grid",
        gridTemplateColumns: CSS_gridTemplateColumns,
        justifyContent: justifyContent,
        //margin: margin !== undefined ? margin : 0,
      }}
      {...gridContainerPropsNoStyle}
    >
      {data.map((val, ival: number) => {
        const { style: gridCellContainerPropsStyle, ...gridCellContainerPropsNoStyle } =
          val.gridCellContainerProps !== undefined ? val.gridCellContainerProps : { style: undefined };
        return (
          <div
            {...gridCellContainerPropsNoStyle}
            style={{
              ...gridCellContainerPropsStyle,
              display: "grid",
              gridTemplateColumns: "100%",
              height: flexInt ? "auto" : "100%",
              alignItems: val.alignItems !== undefined ? val.alignItems : "center",
              textAlign: val.textAlign !== undefined ? val.textAlign : "center",
              ...ProcMakeBorder(ival, data.length, ncols, flexInt),
              margin: flexInt && flexMargin !== undefined ? flexMargin : 0,
            }}
            key={"content_" + ival}
          >
            <div {...val.gridCellProps}>{val}</div>
          </div>
        );
      })}
    </div>
  );
}
CGrid.defaultProps = CGridDefaultProps;
