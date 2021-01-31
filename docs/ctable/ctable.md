# `<CTable />`
react wrapper component for Material UI's `<Table/>` component facilitating/specifying usage and extending functionality.

| Name        | Type           | Default  | Required  | Description  |
| :------------- |:-------------| :-----:| :-----:|:-------------:| 
| [classes](#classes) | {rows?:string;<br/>roweven?:string;<br/>rowodd?:string;<br/>head?:string;<br/>selected?:string;<br/>"@media(pointer:fine)"?:string;<br/>stickyHeader?:string;} | {} |  | object containing custom classes (made with MUIs makeStyles() hook, only that way_???_) |
| [conditionalCellClass](#conditionalCellClass) | (icol:number,<br/>irow:number,<br/>colkey:string,<br/>colcontent:string)=>string |  |  | Method conditionalCellClass can be provided to highlight/modify certain specific cells by providing specific class. |
| [conditionalRowClass](#conditionalRowClass) | (irow:number)=>string |  |  | similar to conditionalCellClass but used to highlight/modify whole rows. |
| [data](#data) | {[key:string]:string;}[] | [] |  | data to be displayed typed as Array of Objects, each object representing a single row. |
| [doColorHeadRow](#doColorHeadRow) | boolean | true |  | determines whether header class (see [classes](#classes)) shall be applied to table header, |
| [doColorRows](#doColorRows) | boolean | true |  | determines whether or not to color the table rows |
| [header](#header) | {id:string;<br/>numeric?:boolean;<br/>disablePadding?:boolean;<br/>label?:string;<br/>align?:Alignment;}[] | [] |  | header row data typed as Array of Objects, each object representing one column's features. |
| [preview](#preview) | number | 0 |  | limits the amount of data (rows) displayed in the table (data is not modified/deleted, header row is not counted) |
| [size](#size) | ```TODO 🚧``` | ```TODO 🚧 ``` |  | table size can be modified by setting [MUI's table size property](#https://material-ui.com/api/table/). |
| [TableBodyProps](#TableBodyProps) | ```TODO 🚧``` | ```TODO 🚧 ``` |  | TableBodyProps allows you to customize table body by providing an object containing [MUI TableBody Props](https://material-ui.com/api/table-body/) |
| [TableCheckboxProps](#TableCheckboxProps) | ```TODO 🚧``` | ```TODO 🚧 ``` |  | TableCheckboxProps allows you to customize all table checkboxes by providing an object containing [MUI's Checkbox Props](https://material-ui.com/api/checkbox/) |
| [TableContainerProps](#TableContainerProps) | ```TODO 🚧``` | ```TODO 🚧 ``` |  | TableContainerProps allows you to customize table container by providing an object containing [MUI TableContainer Props](https://material-ui.com/api/table-container/) |
| [TableHeadProps](#TableHeadProps) | ```TODO 🚧``` | ```TODO 🚧 ``` |  | TableHeadProps allows you to customize table head by providing an object containing [MUI TableHead Props](https://material-ui.com/api/table-head/) |
| [TablePaginationProps](#TablePaginationProps) | ```TODO 🚧``` | ```TODO 🚧 ``` |  | TablePaginationProps allows you to customize table pagination by providing an object containing [MUI TablePagination Props](https://material-ui.com/api/table-pagination/) |
| [TableProps](#TableProps) | ```TODO 🚧``` | ```TODO 🚧 ``` |  | TableProps allows you to customize table by providing an object containing [MUI Table Props](https://material-ui.com/api/table/) |
| [title](#title) | string | Title 1235813 |  | table title to display if [useToolbar](#useToolbar) is true |
| [ToolbarProps](#ToolbarProps) | ```TODO 🚧``` | ```TODO 🚧 ``` |  | ToolbarProps allows you to customize table toolbar by providing an object containing [MUI Toolbar Props](https://material-ui.com/api/toolbar/) |
| [ToolbarTypoProps](#ToolbarTypoProps) | ```TODO 🚧``` | ```TODO 🚧 ``` |  | ToolbarTypoProps allows you to customize table toolbar's title by providing an object containing [MUI Typography Props](https://material-ui.com/api/typography/) |
| [useHeader](#useHeader) | boolean | true |  | determines whether or not to use the header row if property [header](#header) is provided |
| [usePagination](#usePagination) | boolean | true |  | determines whether or not to use pagination |
| [useSelectableAllRows](#useSelectableAllRows) | boolean | true |  | determines whether all rows can be selected by clicking/touching the header's checkbox. |
| [useSelectableRows](#useSelectableRows) | boolean | true |  | determines whether rows can be selected. If true an additional checkbox column is added on left side of table. |
| [useStickyHeader](#useStickyHeader) | boolean | true |  | determines whether or not header is sticky, if true doColorRows is not effective, header can only be customized with stickyHeader class or by MUI theme's default background (see [classes](#classes)) |
| [useToolbar](#useToolbar) | boolean | true |  | determines whether or not to use the toolbar, currently just containing title |

### \(`classes`\) 
object containing custom classes (made with MUIs makeStyles() hook, only that way_???_)\
supported classes:
- rows: superseeds roweven and rowodd, [doColorRows](#doColorRows) must be true
- roweven: even rows (first row is 0), [doColorRows](#doColorRows) must be true
- rowodd: odd rows (first row is 0), [doColorRows](#doColorRows) must be true\
default class's background is "#bdbdbd" if MUI theme is light otherwise (dark) it's "#757575"
- head: header row, [doColorHeadRow](#doColorHeadRow) must be true and [useStickyHeader](#useStickyHeader) false\
default class's background is "#757575" if MUI theme is light otherwise (dark) it's "#bdbdbd"
- seleceted: selected rows, \
default class's background is determined by MUI theme: theme.palette.primary.main
- stickyHeader: class for sticky header if [useStickyHeader](#useStickyHeader) is true, (doColorHeadRow is not active) \
default class's background is theme.palette.background.default
- "@media(pointer: fine)": css-media-query for pointers(not touch devices) intended to apply custom mouse hover effect for previously provided classes (rows, roweven...), see code example below. \
by default: mouse hover effect for roweven, rowodd, selected is applied. Their hover background color is "#757575" if MUI theme is light otherwise (dark) it's "#bdbdbd"

example\
JS:
```ts
const myclasses= makeStyles(theme => ({
head: {background: blue,},
"@media(pointer: fine)": {
head: {"&:hover": {background: "orange",},},
}
}));
```
JSX:
```jsx
<CTable classes={myclasses}\>
```
### \(`conditionalCellClass`\) 
Method conditionalCellClass can be provided to highlight/modify certain specific cells by providing specific class.\
Method is called when rendering table. The following parameters are passed: (icol, irow, colkey, rowcontent).\
your method can perform some conditional checks based on parameters and can return a MUI class (if your condition is fulfilled).\
example:
```jsx
<CTable conditionalCellClass={(icol, irow, colkey, rowcontent) => {
if (irow === 1 && icol === 0) return specialcellclass
}} />
```
### \(`conditionalRowClass`\) 
similar to conditionalCellClass but used to highlight/modify whole rows.\
Method is called when rendering table. The following parameters are passed: (irow).\
your method can perform some conditional checks based on parameters and can return a MUI class (if your condition is fulfilled).\
example:
```jsx
<CTable conditionalRowClass={irow => {
if (irow === 0) return specialrowclass
}} />
```
### \(`data`\) 
data to be displayed typed as Array of Objects, each object representing a single row.\
Data is processed by sequence! of object propertys (not their property key!). Empty cells must be provided by property containing empty string.\
But! Data's property keys must be same for 1 column to provide sorting functionality.\
example:
```ts
data=[{col1: 1, col2: 2, col3: 3}, {col1: 4, col2: 5, col3: 6},]
```
### \(`doColorHeadRow`\) 
determines whether header class (see [classes](#classes)) shall be applied to table header,\
[useStickyHeader](#useStickyHeader) must be false.
### \(`doColorRows`\) 
determines whether or not to color the table rows
### \(`header`\) 
header row data typed as Array of Objects, each object representing one column's features.\
header columns are filled by sequence! of objects within enclosing array.
- id: column id is required if header is provided. table data witch corresponding property keys is sorted.
- numeric: Columns with numeric=true are aligned on right side. Otherwise column is aligned on left side.
- disablePadding: allows you to disable padding for each column
- label: column header label to be applied.
### \(`preview`\) 
limits the amount of data (rows) displayed in the table (data is not modified/deleted, header row is not counted)
### \(`size`\) 
table size can be modified by setting [MUI's table size property](#https://material-ui.com/api/table/).\
See https://material-ui.com/api/table/ for MUI Table size property.
### \(`TableBodyProps`\) 
TableBodyProps allows you to customize table body by providing an object containing [MUI TableBody Props](https://material-ui.com/api/table-body/)\
table body is composed of MUI's TableBody component. Propertys of TableBodyProps are passed to this component by rest operator.\
See https://material-ui.com/api/table-body/ for MUI TableHead propertys.
### \(`TableCheckboxProps`\) 
TableCheckboxProps allows you to customize all table checkboxes by providing an object containing [MUI's Checkbox Props](https://material-ui.com/api/checkbox/)\
checkboxes to select rows are composed of MUI Checkbox components. Propertys of TableCheckboxProps are passed to these components by rest operator.\
See https://material-ui.com/api/checkbox/ for MUI Checkbox propertys.
### \(`TableContainerProps`\) 
TableContainerProps allows you to customize table container by providing an object containing [MUI TableContainer Props](https://material-ui.com/api/table-container/)\
table container is composed of MUI's TableContainer component. Propertys of TableContainerProps are passed to this component by rest operator.\
See https://material-ui.com/api/table-container/ for MUI TableContainer propertys.
### \(`TableHeadProps`\) 
TableHeadProps allows you to customize table head by providing an object containing [MUI TableHead Props](https://material-ui.com/api/table-head/)\
table head is composed of MUI's TableHead component. Propertys of TableHeadProps are passed to this component by rest operator.\
See https://material-ui.com/api/table-head/ for MUI TableHead propertys.
### \(`TablePaginationProps`\) 
TablePaginationProps allows you to customize table pagination by providing an object containing [MUI TablePagination Props](https://material-ui.com/api/table-pagination/)\
table pagination is composed of MUI's TablePagination component. Propertys of TablePaginationProps are passed to this component by rest operator.\
See https://material-ui.com/api/table-pagination/ for MUI TablePagination propertys.
### \(`TableProps`\) 
TableProps allows you to customize table by providing an object containing [MUI Table Props](https://material-ui.com/api/table/)\
table is composed of MUI's Table component. Propertys of TablePaginationProps are passed to this component by rest operator.\
See https://material-ui.com/api/table-pagination/ for MUI TablePagination propertys.
example
```jsx
<CTable TableProps={{size: "small", padding: "none"}}/>
```
### \(`title`\) 
table title to display if [useToolbar](#useToolbar) is true
### \(`ToolbarProps`\) 
ToolbarProps allows you to customize table toolbar by providing an object containing [MUI Toolbar Props](https://material-ui.com/api/toolbar/)\
table toolbar is composed of MUI's Toolbar component. Propertys of ToolbarProps are passed to this component by rest operator.\
See https://material-ui.com/api/toolbar/ for MUI Toolbar propertys.
### \(`ToolbarTypoProps`\) 
ToolbarTypoProps allows you to customize table toolbar's title by providing an object containing [MUI Typography Props](https://material-ui.com/api/typography/)\
table toolbar title is composed of MUI's Typography component. Propertys of ToolbarTypoProps are passed to this component by rest operator.\
See https://material-ui.com/api/typography/ for MUI Toolbar propertys.
### \(`useHeader`\) 
determines whether or not to use the header row if property [header](#header) is provided
### \(`usePagination`\) 
determines whether or not to use pagination
### \(`useSelectableAllRows`\) 
determines whether all rows can be selected by clicking/touching the header's checkbox.\
[useSelectableRows](#useSelectableRows) must be true.\
Checkboxes can be customized by using [TableCheckboxProps](#TableCheckboxProps).
### \(`useSelectableRows`\) 
determines whether rows can be selected. If true an additional checkbox column is added on left side of table.\
Checkboxes can be customized by using [TableCheckboxProps](#TableCheckboxProps).
### \(`useStickyHeader`\) 
determines whether or not header is sticky, if true doColorRows is not effective, header can only be customized with stickyHeader class or by MUI theme's default background (see [classes](#classes))
### \(`useToolbar`\) 
determines whether or not to use the toolbar, currently just containing title
