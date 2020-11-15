import { ReadCsvFromFilePromise, ReadCsvFromUrlPromise, csvResultType, csvWrapReturnType } from "./papaparsewrap"


export async function csvfile(file: Blob, columnKeys = [], delimiter = "", newline = "", skipEmptyLines = true, preview = 0) {

    let prom = await ReadCsvFromFilePromise(file, delimiter, newline, skipEmptyLines, preview);
    console.log("worked: ", prom)

    let proc_data = AssignDataColumnKeys(prom.res.data, columnKeys);
    // prom.res.data.forEach((datarow, j) => {
    //     let rowobj = {};
    //     datarow.forEach((singledata, i) => {
    //         if (i < columnKeys.length) 
    //             rowobj[columnKeys[i]] = singledata;
    //         else
    //             rowobj[i] = singledata;
    //     });
    //     rowobj.id = j;
    //     proc_data.push(rowobj);
    // });

    return ({ data: proc_data, suc: prom.suc, file: prom.file, errors: prom.res.errors, meta: prom.res.meta, });
}


export async function csvurl(url, columnKeys = [], delimiter = "", newline = "", skipEmptyLines = true, preview = 0) {

    let prom = await ReadCsvFromUrlPromise(url, delimiter, newline, skipEmptyLines, preview);
    console.log("worked: ", prom)

    let proc_data = AssignDataColumnKeys(prom.res.data, columnKeys);
    return ({ data: proc_data, suc: prom.suc, file: prom.file, errors: prom.res.errors, meta: prom.res.meta, });
}

const AssignDataColumnKeys = (data, keys) => {
    let proc_data = [];
    data.forEach((datarow, j) => {
        let rowobj = {};
        datarow.forEach((singledata, i) => {
            if (i < keys.length)
                rowobj[keys[i]] = singledata;
            else
                rowobj[i] = singledata;
        });
        rowobj.id = j;
        proc_data.push(rowobj);
    });
    return proc_data;
}