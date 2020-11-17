import React from "react";
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import CTable from "./table"


import  TextFieldFile from "../ctextfieldfile";
import TextFieldFileUrlChecked from "../ctextfieldurlchecked"
import Checkbox from '@material-ui/core/Checkbox';
import { Typography } from "@material-ui/core";
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { css } from "@emotion/css"
import Button from '@material-ui/core/Button';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';

const worker = require("workerize-loader!../utils/worker"); // eslint-disable-line 

// eslint-disable-next-line
//import worker from "workerize-loader!../utils/worker"; // eslint-disable-line import/no-webpack-loader-syntax



const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

type Props = {
    onFinish: any; 
}


const borderCSS = "border: 1px solid #eee; border-radius: 6px;-webkit-box-shadow: 0 7px 14px 0 rgba(65,69,88,.1), 0 3px 6px 0 rgba(0,0,0,.07);box-shadow: 0 7px 14px 0 rgba(65,69,88,.1), 0 3px 6px 0 rgba(0,0,0,.07);"
export default function CDataImport(props: Props) {
  const { onFinish } = props;

  const [value, setValue] = React.useState(0);
  const [ImportedData, setImportedData] = React.useState([]);
  const [File, setFile] = React.useState([]);
  const [HasHeader, setHasHeader] = React.useState(false);
  const [CanUseHeader, setCanUseHeader] = React.useState(true);
  const [CsvDelimiter, setCsvDelimiter] = React.useState(0);
  const [CsvNewLine, setCsvNewLine] = React.useState(0);
  const [BackdropOpen, setBackdropOpen] = React.useState(false);
  const classes = useStyles();

  // instance.expensive(1000).then(count => {
  //     console.log(`Ran ${count} loops`)
  // })

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const CheckIfHasHeader = (data0) => {
    const cleanSepsandDels = (str) => {
      return str.replace(".", "").replace(",", "");
    };
    const keys = Object.keys(data0);
    const data0Arr = [];
    keys.forEach((key, ikey) => {
      if (key !== "datetime" && key !== "id")
        data0Arr.push(cleanSepsandDels(data0[key]));
    });
    //const data0Arr =[cleanSepsandDels(data0.open), cleanSepsandDels(data0.high),
    //cleanSepsandDels(data0.low), cleanSepsandDels(data0.close), cleanSepsandDels(data0.vol)];
    for (const d of data0Arr) {
      if (isNaN(d) === true) return true;
    }
    return false;
  };

  const LoadCsv = async (
    input,
    type,
    delimiter = "",
    newline = "",
    skipEmptyLines = true,
    preview = 0,
    doFinish = false
  ) => {
    const columnObjKeys = ["datetime", "open", "high", "low", "close", "vol"];

    const winst = new worker();
    let resprom;
    if (type === "file") {
      resprom = await winst.csvfile(
        input,
        columnObjKeys,
        delimiter,
        newline,
        skipEmptyLines,
        preview,
        columnObjKeys
      );
    } else if (type === "url") {
      resprom = await winst.csvurl(
        input,
        columnObjKeys,
        delimiter,
        newline,
        skipEmptyLines,
        preview,
        columnObjKeys
      );
    }
    console.log(resprom);
    const suc = resprom.suc;
    let data = resprom.data;
    const errors = resprom.errors;
    const meta = resprom.meta;
    const file = resprom.file;

    const hasHeader = CheckIfHasHeader(data[0]);
    if (!doFinish) {
      setImportedData(data);
      setValue(2);
      setFile(file);

      setHasHeader(hasHeader);
      setCanUseHeader(!hasHeader);
    } else {
      if (hasHeader) {
        data = data.slice(1);
      }
      if (onFinish) onFinish(data, file);
    }
  };

  let isdataimported = false;
  if (ImportedData !== null && ImportedData !== undefined) {
    if (ImportedData.length > 0) isdataimported = true;
  }

  const ref1 = React.useRef();
  const ref2 = React.useRef();
  const csvDelimiterEnum = {
    0: "",
    10: ",",
    20: ";",
  };
  const csvNewLineEnum = {
    0: "",
    10: "\r",
    20: "\n",
    30: "\r\n",
  };

  const tabData = [
    {
      tablabel: "Local",
      tabcontent: (
        <TextFieldFile
          inputAccept="text/csv, .csv, application/vnd.ms-excel"
          label="Load local file"
          style={{ margin: "0px", width: "100%" }}
          placeholder="Click to open local file"
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
          onEnter={(file) => {
            LoadCsv(file, "file", "", "", true, 5);
          }}
        />
      ),
    },
    {
      tablabel: "URL",
      tabcontent: (
        <TextFieldFileUrlChecked
          id="url-input"
          label="Load file by url (https required)"
          style={{ margin: 0, width: "100%" }}
          placeholder="Enter or paste url"
          ref={ref1}
          inputRef={ref2}
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
          onEnter={(url) => {
            LoadCsv(url, "url", "", "", true, 5);
          }}
        />
      ),
    },
    {
      tablabel: "Data",
      disabled: true,
      tabcontent:
        isdataimported === true ? (
          <>
            <CTable
              data={ImportedData}
              useToolbar={false}
              useHeader={true}
              useSelectableRows={false}
              header={[
                {
                  id: "datetime",
                  numeric: false,
                  disablePadding: false,
                  label: "Datetime",
                },
                {
                  id: "open",
                  numeric: true,
                  disablePadding: false,
                  label: "Open",
                },
                {
                  id: "high",
                  numeric: true,
                  disablePadding: false,
                  label: "High",
                },
                {
                  id: "low",
                  numeric: true,
                  disablePadding: false,
                  label: "Low",
                },
                {
                  id: "close",
                  numeric: true,
                  disablePadding: false,
                  label: "Close",
                },
                {
                  id: "vol",
                  numeric: true,
                  disablePadding: false,
                  label: "Volume",
                },
              ]}
            />
            <Paper style={{ marginTop: 10 }}>
              <div
                css={css`
                  display: grid;
                  grid-template-columns: 100px minmax(200px, max-content);
                  margin: 0px;
                  justify-content: center;
                  align-items: center;
                `}
              >
                <div style={{ gridColumn: "1 / span 2" }}>
                  <Typography component="div">
                    {" "}
                    Previewing 5 Items of parsed csv file.{" "}
                  </Typography>
                  <Typography component="div">
                    {" "}
                    Please check if values are separated correctly. If not try
                    to adjust parameters
                  </Typography>
                </div>

                <div
                  css={css`
                    border: 1px solid black;
                    ${borderCSS};
                  `}
                >
                  <div
                    css={css`
                      width: 50px;
                      margin: 0 auto;
                    `}
                  >
                    <Checkbox
                      color={CanUseHeader ? "primary" : "secondary"}
                      checked={HasHeader}
                      onChange={() => {
                        if (CanUseHeader) setHasHeader(!HasHeader);
                      }}
                    />
                  </div>
                </div>
                <div
                  css={css`
                    border: 1px solid black;
                    ${borderCSS}
                  `}
                >
                  {CanUseHeader ? (
                    <Typography>csv contains header</Typography>
                  ) : (
                    <Typography>
                      csv contains unconvertible non-numeric header
                    </Typography>
                  )}
                </div>

                <div
                  css={css`
                    border: 1px solid black;
                    ${borderCSS}
                  `}
                >
                  <Select
                    labelId="select-csv-delimiter-char"
                    value={CsvDelimiter}
                    margin="dense"
                    variant="outlined"
                    onChange={(e, child) => {
                      setCsvDelimiter(e.target.value);
                    }}
                  >
                    <MenuItem value={0}>auto</MenuItem>
                    <MenuItem value={10}>{csvDelimiterEnum[10]}</MenuItem>
                    <MenuItem value={20}>{csvDelimiterEnum[20]}</MenuItem>
                  </Select>
                </div>
                <div
                  css={css`
                    border: 1px solid black;
                    ${borderCSS}
                  `}
                >
                  <Typography component="span"> csv delimiter char</Typography>
                </div>

                <div
                  css={css`
                    border: 1px solid black;
                    ${borderCSS}
                  `}
                >
                  <Select
                    labelId="select-csv-newline-char"
                    value={CsvNewLine}
                    margin="dense"
                    variant="outlined"
                    onChange={(e, child) => {
                      setCsvNewLine(e.target.value);
                    }}
                  >
                    <MenuItem value={0}>auto</MenuItem>
                    <MenuItem value={10}>\r</MenuItem>
                    <MenuItem value={20}>\n</MenuItem>
                    <MenuItem value={30}>\r\n</MenuItem>
                  </Select>
                </div>
                <div
                  css={css`
                    border: 1px solid black;
                    ${borderCSS}
                  `}
                >
                  <Typography component="span">
                    {" "}
                    csv newline char (auto recommended)
                  </Typography>
                </div>
              </div>
              <Divider variant="middle" />
              <div
                css={css`
                  display: grid;
                  grid-template-columns: 50% 50%;
                  margin: 10px 0;
                  justify-content: center;
                  align-items: center;
                  grid-column: 1 / span 2;
                `}
              >
                <div
                  css={css`
                    justify-self: center;
                    align-self: center;
                  `}
                >
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      LoadCsv(
                        File,
                        "file",
                        csvDelimiterEnum[CsvDelimiter],
                        csvNewLineEnum[CsvNewLine],
                        true,
                        5
                      );
                    }}
                  >
                    Reload Csv
                  </Button>
                </div>
                <div
                  css={css`
                    justify-self: center;
                    align-self: center;
                  `}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setBackdropOpen(true);
                      LoadCsv(
                        File,
                        "file",
                        csvDelimiterEnum[CsvDelimiter],
                        csvNewLineEnum[CsvNewLine],
                        true,
                        0,
                        true
                      );
                    }}
                  >
                    Continue
                  </Button>
                  <Backdrop
                    className={classes.backdrop}
                    open={BackdropOpen}
                    onClick={() => {
                      setBackdropOpen(false);
                    }}
                  >
                    <CircularProgress color="inherit" />
                  </Backdrop>
                </div>
              </div>
            </Paper>
          </>
        ) : (
          <div>not yet loaded yet</div>
        ),
    },
  ];

  return (
    <>
      <Paper square style={{ padding: "0 0 20px 0", margin: "0 10px" }}>
        <Tabs
          value={value}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChange}
          aria-label="disabled tabs example"
        >
          {tabData.map((val, idx) => {
            const tab = tabData[idx];
            const disabled =
              tab.disabled === true && isdataimported === false ? true : false;

            return <Tab label={tab.tablabel} disabled={disabled} key={idx} />;
          })}
        </Tabs>
      </Paper>

      <div style={{ margin: "20px 10px 0px 10px" }}>
        <div style={{ position: "relative", top: 0 }}>
          {tabData[value].tabcontent}
        </div>
      </div>
    </>
  );
}