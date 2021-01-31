import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table, { TableProps } from "@material-ui/core/Table";
import TableBody, { TableBodyProps } from "@material-ui/core/TableBody";
import TableCell, { TableCellProps } from "@material-ui/core/TableCell";
import TableContainer, { TableContainerProps } from "@material-ui/core/TableContainer";
import TableHead, { TableHeadProps } from "@material-ui/core/TableHead";
import TablePagination, { TablePaginationProps } from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar, { ToolbarProps } from "@material-ui/core/Toolbar";
import Typography, { TypographyProps } from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox, { CheckboxProps } from "@material-ui/core/Checkbox";

/** CTable Module
 *
 *  Exports:
 * - interface CTablePropTypes
 * - const CTable (React.forwardRef)
 * - function CTableDocu (dummy function to enable TSDoc parsing for CTable)
 */

/** interface for internal CTableHead (functional) react component props */
interface CTableHeadPropTypes {
  /** @internal */
  classHeadRow?: string;
  /** @internal */
  classStickyHeader?: string;
  /** @internal */
  order: "asc" | "desc" | "none";
  /** @internal */
  orderBy?: string;
  /** header row data typed as Array of Objects, each object representing one column's features.
   * @remark header columns are filled by sequence! of objects within enclosing array.
   * - id: column id is required if header is provided. table data witch corresponding property keys is sorted.
   * - numeric: Columns with numeric=true are aligned on right side. Otherwise column is aligned on left side.
   * - disablePadding: allows you to disable padding for each column
   * - label: column header label to be applied.
   */
  header: {
    id: string;
    numeric?: boolean;
    disablePadding?: boolean;
    label?: string;
    align?: TableCellProps["align"];
  }[];
  /** @internal */
  numSelected: number;
  /** @internal */
  rowCount: number;
  /** @internal */
  onRequestSort: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, prop: string) => void;
  /** @internal */
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** determines whether rows can be selected. If true an additional checkbox column is added on left side of table.
   * @remark Checkboxes can be customized by using [TableCheckboxProps](#TableCheckboxProps).*/
  useSelectableRows: boolean;
  /** determines whether all rows can be selected by clicking/touching the header's checkbox.
   * @remark [useSelectableRows](#useSelectableRows) must be true.\
   * Checkboxes can be customized by using [TableCheckboxProps](#TableCheckboxProps).*/
  useSelectableAllRows?: boolean;
  /** determines whether header class (see [classes](#classes)) shall be applied to table header,
   * @remark [useStickyHeader](#useStickyHeader) must be false. */
  doColorHeadRow?: boolean;
  /** TableHeadProps allows you to customize table head by providing an object containing [MUI TableHead Props](https://material-ui.com/api/table-head/)
   * @remark table head is composed of MUI's TableHead component. Propertys of TableHeadProps are passed to this component by rest operator.\
   * See https://material-ui.com/api/table-head/ for MUI TableHead propertys.
   * @nospec MUI component propertys */
  TableHeadProps?: TableHeadProps;
  /** TableCheckboxProps allows you to customize all table checkboxes by providing an object containing [MUI's Checkbox Props](https://material-ui.com/api/checkbox/)
   * @remark checkboxes to select rows are composed of MUI Checkbox components. Propertys of TableCheckboxProps are passed to these components by rest operator.\
   *  See https://material-ui.com/api/checkbox/ for MUI Checkbox propertys.
   * @nospec MUI component propertys */
  TableCheckboxProps?: CheckboxProps;
}

/** interface for internal CTableToolbar (functional) react component props */
interface CTableToolbarPropTypes {
  /** table title to display if [useToolbar](#useToolbar) is true */
  title: string;
  /** ToolbarProps allows you to customize table toolbar by providing an object containing [MUI Toolbar Props](https://material-ui.com/api/toolbar/)
   * @remark table toolbar is composed of MUI's Toolbar component. Propertys of ToolbarProps are passed to this component by rest operator.\
   * See https://material-ui.com/api/toolbar/ for MUI Toolbar propertys.
   * @nospec MUI component propertys */
  ToolbarProps?: ToolbarProps;
  /** ToolbarTypoProps allows you to customize table toolbar's title by providing an object containing [MUI Typography Props](https://material-ui.com/api/typography/)
   * @remark table toolbar title is composed of MUI's Typography component. Propertys of ToolbarTypoProps are passed to this component by rest operator.\
   * See https://material-ui.com/api/typography/ for MUI Toolbar propertys.
   * @nospec MUI component propertys */
  ToolbarTypoProps?: TypographyProps;
}

/** CTablePropTypes
 *
 * interface for CTable react component props
 */
export interface CTablePropTypes extends Partial<CTableHeadPropTypes>, Partial<CTableToolbarPropTypes> {
  /** object containing custom classes (made with MUIs makeStyles() hook, only that way_???_)
   * @remark supported classes:
   * - rows: superseeds roweven and rowodd, [doColorRows](#doColorRows) must be true
   * - roweven: even rows (first row is 0), [doColorRows](#doColorRows) must be true
   * - rowodd: odd rows (first row is 0), [doColorRows](#doColorRows) must be true\
   *   default class's background is "#bdbdbd" if MUI theme is light otherwise (dark) it's "#757575"
   * - head: header row, [doColorHeadRow](#doColorHeadRow) must be true and [useStickyHeader](#useStickyHeader) false\
   *   default class's background is "#757575" if MUI theme is light otherwise (dark) it's "#bdbdbd"
   * - seleceted: selected rows, \
   *   default class's background is determined by MUI theme: theme.palette.primary.main
   * - stickyHeader: class for sticky header if [useStickyHeader](#useStickyHeader) is true, (doColorHeadRow is not active) \
   *   default class's background is theme.palette.background.default
   * - "&#64;media(pointer: fine)": css-media-query for pointers(not touch devices) intended to apply custom mouse hover effect for previously provided classes (rows, roweven...), see code example below. \
   *    by default: mouse hover effect for roweven, rowodd, selected is applied. Their hover background color is "#757575" if MUI theme is light otherwise (dark) it's "#bdbdbd"
   *
   * example\
   * JS:
   * ```ts
   * const myclasses= makeStyles(theme => ({
   *    head: {background: blue,},
   *    "&#64;media(pointer: fine)": {
   *      head: {"&:hover": {background: "orange",},},
   *   }
   * }));
   * ```
   * JSX:
   * ```jsx
   * <CTable classes={myclasses}\>
   * ```
   */
  classes?: {
    rows?: string;
    roweven?: string;
    rowodd?: string;
    head?: string;
    selected?: string;
    "@media(pointer: fine)"?: string;
    stickyHeader?: string;
  };
  /** data to be displayed typed as Array of Objects, each object representing a single row.
   * @remark Data is processed by sequence! of object propertys (not their property key!). Empty cells must be provided by property containing empty string.\
   * But! Data's property keys must be same for 1 column to provide sorting functionality.\
   * example:
   * ```ts
   * data=[{col1: 1, col2: 2, col3: 3}, {col1: 4, col2: 5, col3: 6},]
   * ```
   */
  data: { [key: string]: string }[];
  /** determines whether or not to color the table rows */
  doColorRows?: boolean;
  /** limits the amount of data (rows) displayed in the table (data is not modified/deleted, header row is not counted) */
  preview?: number;
  /** determines whether or not to use the header row if property [header](#header) is provided*/
  useHeader?: boolean;
  /** determines whether or not to use pagination */
  usePagination?: boolean;
  /** determines whether or not header is sticky, if true doColorRows is not effective, header can only be customized with stickyHeader class or by MUI theme's default background (see [classes](#classes)) */
  useStickyHeader?: boolean;
  /** determines whether or not to use the toolbar, currently just containing title */
  useToolbar?: boolean;
  /** table size can be modified by setting [MUI's table size property](#https://material-ui.com/api/table/).
   * @remark See https://material-ui.com/api/table/ for MUI Table size property.
   * @nospec MUI component propertys */
  size?: TableProps["size"];
  /** TableBodyProps allows you to customize table body by providing an object containing [MUI TableBody Props](https://material-ui.com/api/table-body/)
   * @remark table body is composed of MUI's TableBody component. Propertys of TableBodyProps are passed to this component by rest operator.\
   * See https://material-ui.com/api/table-body/ for MUI TableHead propertys.
   * @nospec MUI component propertys */
  TableBodyProps?: TableBodyProps;
  /** TableContainerProps allows you to customize table container by providing an object containing [MUI TableContainer Props](https://material-ui.com/api/table-container/)
   * @remark table container is composed of MUI's TableContainer component. Propertys of TableContainerProps are passed to this component by rest operator.\
   * See https://material-ui.com/api/table-container/ for MUI TableContainer propertys.
   * @nospec MUI component propertys */
  TableContainerProps?: TableContainerProps;
  /** TablePaginationProps allows you to customize table pagination by providing an object containing [MUI TablePagination Props](https://material-ui.com/api/table-pagination/)
   * @remark table pagination is composed of MUI's TablePagination component. Propertys of TablePaginationProps are passed to this component by rest operator.\
   * See https://material-ui.com/api/table-pagination/ for MUI TablePagination propertys.
   * @nospec MUI component propertys */
  TablePaginationProps?: TablePaginationProps;
  /** Table Props
   * @desc TableProps allows you to customize table by providing an object containing [MUI Table Props](https://material-ui.com/api/table/)
   * @remark table is composed of MUI's Table component. Propertys of TablePaginationProps are passed to this component by rest operator.\
   * See https://material-ui.com/api/table-pagination/ for MUI TablePagination propertys.
   * example
   * ```jsx
   * <CTable TableProps={{size: "small", padding: "none"}}/>
   * ```
   * @nospec MUI component propertys */
  TableProps?: TableProps;
  /** Method conditionalCellClass can be provided to highlight/modify certain specific cells by providing specific class.
   * @remark Method is called when rendering table. The following parameters are passed: (icol, irow, colkey, rowcontent).\
   * your method can perform some conditional checks based on parameters and can return a MUI class (if your condition is fulfilled).\
   * example:
   * ```jsx
   * <CTable conditionalCellClass={(icol, irow, colkey, rowcontent) => {
   *   if (irow === 1 && icol === 0) return specialcellclass
   * }} />
   * ```
   */
  conditionalCellClass?(icol: number, irow: number, colkey: string, colcontent: string): string | undefined;
  /** similar to conditionalCellClass but used to highlight/modify whole rows.
   * @remark Method is called when rendering table. The following parameters are passed: (irow).\
   * your method can perform some conditional checks based on parameters and can return a MUI class (if your condition is fulfilled).\
   * example:
   * ```jsx
   * <CTable conditionalRowClass={irow => {
   *   if (irow === 0) return specialrowclass
   * }} />
   * ```
   */
  conditionalRowClass?(irow: number): string | undefined;
}

/** sorting helper functions */
function descendingComparator(
  a: { [key: string]: string },
  b: { [key: string]: string },
  orderBy: NonNullable<CTableHeadPropTypes["orderBy"]>
) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order: CTableHeadPropTypes["order"], orderBy: NonNullable<CTableHeadPropTypes["orderBy"]>) {
  return order === "desc"
    ? (a: { [key: string]: string }, b: { [key: string]: string }) => descendingComparator(a, b, orderBy)
    : (a: { [key: string]: string }, b: { [key: string]: string }) => -descendingComparator(a, b, orderBy);
}

function stableSort(
  array: CTablePropTypes["data"],
  comparator: (a: { [key: string]: string }, b: { [key: string]: string }) => number
) {
  const stabilizedThis: [{ [key: string]: string }, number][] = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

/**  internal Table Head functional react component*/
function CTableHead(props: CTableHeadPropTypes): any {
  const {
    classHeadRow,
    order,
    orderBy,
    header,
    numSelected,
    rowCount,
    onRequestSort,
    onSelectAllClick,
    useSelectableRows,
    useSelectableAllRows,
    doColorHeadRow,
    TableHeadProps,
    TableCheckboxProps,
    classStickyHeader,
  } = props;

  const useSelectableAllRowsInt =
    useSelectableAllRows !== true && useSelectableAllRows !== false ? useSelectableRows : useSelectableAllRows;
  const headRowProps = doColorHeadRow && typeof classHeadRow === "string" ? { className: classHeadRow } : {};

  // evt handler for TableSortLabel Click evt
  const HandleSortRequest = (property: string) => (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    onRequestSort(event, property);
  };

  // render
  return (
    <TableHead {...TableHeadProps}>
      <TableRow {...headRowProps}>
        {useSelectableRows !== false ? (
          /* 1row below prop of TableCell -> classes={{ stickyHeader: classStickyHeader }}>*/
          <TableCell padding="checkbox" key={"checkbox_selector"} classes={{ stickyHeader: classStickyHeader }}>
            {useSelectableAllRowsInt === false ? (
              <span style={{ opacity: 0 }}>CBx </span>
            ) : (
              <Checkbox
                indeterminate={numSelected > 0 && numSelected < rowCount}
                checked={rowCount > 0 && numSelected === rowCount}
                onChange={onSelectAllClick}
                {...TableCheckboxProps}
              />
            )}
          </TableCell>
        ) : null}
        {header.map(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          (headCell, icol) => {
            let cellalign: TableCellProps["align"] = "left";
            let cellpadding: TableCellProps["padding"] = "default";
            let celllabel = "";
            if ("numeric" in headCell && !("align" in headCell)) cellalign = headCell.numeric ? "right" : "left";
            else if ("align" in headCell) cellalign = headCell.align;
            if ("disablePadding" in headCell) cellpadding = headCell.disablePadding ? "none" : "default";
            if ("label" in headCell) celllabel = headCell.label !== undefined ? headCell.label : "";

            return (
              <TableCell
                key={headCell.id}
                align={cellalign}
                padding={cellpadding}
                sortDirection={orderBy === headCell.id && order !== "none" ? order : false}
                classes={{ stickyHeader: classStickyHeader }}
              >
                <TableSortLabel
                  hideSortIcon={true}
                  active={orderBy === headCell.id && order !== "none"}
                  direction={orderBy === headCell.id && order !== "none" ? order : "asc"}
                  onClick={HandleSortRequest(headCell.id)}
                >
                  {celllabel}
                </TableSortLabel>
              </TableCell>
            );
          }
        )}
      </TableRow>
    </TableHead>
  );
}

/**  internal styles for table toolbar */
const useToolbarStyles = makeStyles((theme) => ({
  toolbar: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
}));

/**  internal Table Toolbar functional react component*/
const CTableToolbar = (props: CTableToolbarPropTypes) => {
  const { title, ToolbarProps, ToolbarTypoProps } = props;

  const classes = useToolbarStyles();
  const ToolbarPropsInt = typeof ToolbarProps === "object" ? ToolbarProps : {};
  if (!("className" in ToolbarPropsInt)) ToolbarPropsInt.className = classes.toolbar;
  const ToolbarTypoPropsInt = typeof ToolbarTypoProps === "object" ? ToolbarTypoProps : {};
  if (!("variant" in ToolbarTypoPropsInt)) ToolbarTypoPropsInt.variant = "h6";

  // render
  return (
    <Toolbar {...ToolbarPropsInt}>
      <Typography {...ToolbarTypoPropsInt}>{title}</Typography>
    </Toolbar>
  );
};

/**  internal preset-styles for table */
const useTableStyles = makeStyles((theme) => {
  const oddcolor = theme.palette.type === "light" ? "#bdbdbd" : "#757575";
  const headcolor = theme.palette.type === "light" ? "#757575" : "#bdbdbd";
  const selcolor = headcolor;
  return {
    rowodd: {
      background: oddcolor,
    },
    head: {
      background: headcolor,
    },
    selected: {
      background: theme.palette.primary.main,
    },
    stickyHeader: {
      background: theme.palette.background.default,
    },
    "@media(pointer: fine)": {
      roweven: {
        "&:hover": {
          background: selcolor,
        },
      },
      rowodd: {
        "&:hover": {
          background: selcolor,
        },
      },
      selected: {
        "&:hover": {
          background: selcolor,
        },
      },
    },
    // avoid different color state when switching from order=desc to order=none
    // sortlabel: {"&:focus": {color: "rgba(0, 0, 0, 0.87)"}}
  };
});

/**  internal const for CTable defaultProps */
const CTableDefaultProps: CTablePropTypes = {
  header: [],
  data: [],
  TableContainerProps: {},
  ToolbarProps: {},
  ToolbarTypoProps: {},
  TableProps: {},
  TableBodyProps: {},
  TableHeadProps: {},
  TableCheckboxProps: {},
  useToolbar: true,
  useHeader: true,
  useSelectableRows: true,
  useSelectableAllRows: true,
  usePagination: true,
  useStickyHeader: true,
  size: "small",
  title: "Title 1235813",
  preview: 0,
  doColorHeadRow: true,
  doColorRows: true,
  classes: {},
};

/** CTableDocu
 *
 * @remark react wrapper component for Material UI's <Table/> component facilitating/specifying usage and extending functionality.
 * @docu component to create docs for CTable forwardRef with react-docgen-typescript (not recognized as function), @dummy CTable
 *
 */
export const CTableDocu = (props: CTablePropTypes, ref: React.RefObject<HTMLDivElement>) => {
  return null; //<CTable {...props} ref={ref} />;
};
CTableDocu.defaultProps = CTableDefaultProps;

/** CTable
 *
 * react wrapper component for Material UI's <Table/> component facilitating/specifying usage and extending functionality.
 *
 */
const CTable = React.forwardRef((props: CTablePropTypes, ref: React.RefObject<any>) => {
  const {
    header = [],
    data = [],
    useToolbar,
    useHeader,
    useSelectableRows,
    useSelectableAllRows,
    usePagination,
    doColorHeadRow,
    doColorRows,
    preview,
    title,
    size,
    useStickyHeader,
    TableContainerProps,
    ToolbarProps,
    ToolbarTypoProps,
    TableProps,
    TableBodyProps,
    TablePaginationProps,
    TableHeadProps,
    TableCheckboxProps,
    conditionalCellClass,
    conditionalRowClass,
    classes,
  } = props;

  const useHeaderInt = useHeader === false || header.length <= 0 ? false : true; // ensure is always boolean with true as default
  const useSelectableAllRowsInt = useSelectableAllRows === false ? false : true; // ...
  const previewInt = typeof preview === "number" ? (preview % 1 === 0 ? preview : Math.round(preview)) : 0;
  const classesPreset = useTableStyles();
  const rowclasses: CTablePropTypes["classes"] = { ...classesPreset, ...classes };

  const [order, setOrder] = React.useState<CTableHeadPropTypes["order"]>("none"); // order method: "asc", "desc", "none"
  const [orderBy, setOrderBy] = React.useState<CTableHeadPropTypes["orderBy"]>(); // order column by id
  const [selected, setSelected] = React.useState<string[]>([]); // array of selected items
  const [RawData, setRawData] = React.useState<CTablePropTypes["data"]>([]); // data provided by props is used as State -> RawData is not supposed to be changed
  //const [TableData, setTableData] = React.useState<CTablePropTypes["data"]>([]); // data provided by props is used as State -> TableData can be changed for display/sort/filter purposes
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
  const [page, setPage] = React.useState<number>(0);

  if (data !== RawData && data !== undefined) {
    setRawData(data);
    //setTableData(data);
  }

  // Filters preview
  const ProcPreview = (data: CTablePropTypes["data"], n_preview: number): CTablePropTypes["data"] => {
    if (n_preview > 0) return data.slice(0, n_preview);
    else return data;
  };

  const ProcSort = (data: CTablePropTypes["data"]): CTablePropTypes["data"] => {
    if (order === "none" || orderBy === undefined) return data;
    else return stableSort(data, getComparator(order, orderBy));
  };

  const ProcSlicePagination = (data: CTablePropTypes["data"]): CTablePropTypes["data"] => {
    if (usePagination) return data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    else return data;
  };

  // Determines if id is selected
  const ProcIsSelected = (id: string): boolean => selected.indexOf(id) !== -1;

  // shortcuts
  const datakeys: string[] = RawData.length > 0 ? Object.keys(RawData[0]) : [];
  const tempTablePreview = ProcPreview(RawData, previewInt);
  const tempTableData = ProcSlicePagination(ProcSort(tempTablePreview));
  const ndata = previewInt === 0 ? RawData.length : previewInt;

  // evt handler for TableSortLabel Click evt -> triggered in TableHead Component
  const HandleRequestSort = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, property: string): void => {
    const newOrder =
      orderBy === property && order === "asc"
        ? "desc"
        : orderBy === property && order === "desc"
        ? "none" // if already sorted go to next mode
        : "asc"; // if  not yet sorted start witch asc
    setOrder(newOrder);
    setOrderBy(property);
  };

  // evt handler for Row Click evt
  const HandleRowClick = (event: React.MouseEvent<HTMLTableRowElement, MouseEvent>, id: string): void => {
    if (useSelectableRows === false) return;
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      // not yet selected, add to selection
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      // first is selected, to be deselected
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      // last is selected, to be deselected
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      // some item in between is selected, to be deselected
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  // event handler for Click on Header Checkbox (selects all Rows) -> forwarded as prop to Header Component
  const HandleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>): void => {
    // newstate is checked
    if (event.target.checked) {
      const newSelecteds = tempTablePreview.map((data) => data.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  // event handler for pagination change rows per page evt
  const HandleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // evt handler for pagination change page evt
  const HandleChangePage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number): void => {
    setPage(newPage);
  };

  // rendering return
  return (
    <Paper elevation={4}>
      <TableContainer {...TableContainerProps}>
        {useToolbar === true ? (
          <CTableToolbar title={title as string} ToolbarProps={ToolbarProps} ToolbarTypoProps={ToolbarTypoProps} />
        ) : null}
        <Table size={size} stickyHeader={useStickyHeader} ref={ref} {...TableProps}>
          {useHeaderInt === true ? (
            <CTableHead
              classHeadRow={rowclasses.head}
              doColorHeadRow={doColorHeadRow}
              header={header}
              numSelected={selected.length}
              onRequestSort={HandleRequestSort}
              onSelectAllClick={HandleSelectAllClick}
              order={order}
              orderBy={orderBy}
              rowCount={ndata} //RawData.length
              classStickyHeader={rowclasses.stickyHeader}
              TableCheckboxProps={TableCheckboxProps}
              TableHeadProps={TableHeadProps}
              useSelectableAllRows={useSelectableAllRowsInt}
              useSelectableRows={useSelectableRows as boolean}
            />
          ) : null}
          <TableBody {...TableBodyProps}>
            {tempTableData.map((row, irow) => {
              const isItemSelected = ProcIsSelected(row.id);
              const rowclass: { className?: string } = {};
              if (doColorRows)
                rowclass.className =
                  rowclasses.rows !== undefined
                    ? rowclasses.rows
                    : irow % 2 === 0
                    ? rowclasses.roweven
                    : rowclasses.rowodd;
              if (typeof conditionalRowClass === "function") {
                const condRowClass = conditionalRowClass(irow);
                if (typeof condRowClass === "string") {
                  if ("className" in rowclass) {
                    rowclass.className = `${rowclass.className} ${condRowClass}`;
                  } else rowclass.className = condRowClass;
                }
              }
              return (
                <TableRow
                  onClick={(event: React.MouseEvent<HTMLTableRowElement, MouseEvent>) => {
                    HandleRowClick(event, row.id);
                  }}
                  tabIndex={-1}
                  key={irow}
                  //selected={isItemSelected}
                  //{...rowclass}
                  className={isItemSelected ? rowclasses.selected : rowclass.className}
                >
                  {useSelectableRows === true ? (
                    <TableCell padding="checkbox">
                      <Checkbox checked={isItemSelected} {...TableCheckboxProps} />
                    </TableCell>
                  ) : null}
                  {datakeys.map((key, icol) => {
                    let cellalign: TableCellProps["align"] = "left";
                    let cellpadding: TableCellProps["padding"] = "default";
                    const cellClass: any = {};
                    if (icol < header.length) {
                      if ("numeric" in header[icol] && !("align" in header[icol]))
                        cellalign = header[icol].numeric ? "right" : "left";
                      else if ("align" in header[icol]) cellalign = header[icol].align;
                      if ("disablePadding" in header[icol])
                        cellpadding = header[icol].disablePadding ? "none" : "default";
                      if (typeof conditionalCellClass === "function") {
                        const conditionalCellRes = conditionalCellClass(icol, irow, key, row[key]);
                        if (typeof conditionalCellRes === "string") cellClass.className = conditionalCellRes;
                      }
                    }
                    return key !== "id" && key in row ? (
                      <TableCell align={cellalign} padding={cellpadding} key={`${irow}r_${icol}col`} {...cellClass}>
                        {row[key]}
                      </TableCell>
                    ) : null;
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {usePagination ? (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component={"div" as React.ElementType}
          count={ndata}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={HandleChangePage}
          onChangeRowsPerPage={HandleChangeRowsPerPage}
          {...TablePaginationProps}
        />
      ) : null}
    </Paper>
  );
});
CTable.displayName = "CTable";
CTable.defaultProps = CTableDefaultProps;
export { CTable };
export default CTable;
