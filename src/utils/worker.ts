import { ReadCsvFromFilePromise, ReadCsvFromUrlPromise, csvResultType } from "./papaparsewrap"

type csvDataObjectified = {
    id: number;
    [key: string]: (string | number);
}
type csvResultTransformedType = Omit<csvResultType, "data">
    & {
        suc: boolean;
        data: csvDataObjectified[];
        file: Blob;
    };


export async function csvfile(file: Blob, columnKeys = [], delimiter = "", newline = "", skipEmptyLines = true, preview = 0): Promise<csvResultTransformedType> {

    const prom = await ReadCsvFromFilePromise(file, delimiter, newline, skipEmptyLines, preview);
    console.log("worked: ", prom)
    const proc_data = AssignDataColumnKeys(prom.res.data, columnKeys);

    return ({ data: proc_data, suc: prom.suc, file: prom.file, errors: prom.res.errors, meta: prom.res.meta, });
}


export async function csvurl(url: string, columnKeys: string[] = [], delimiter = "", newline = "", skipEmptyLines = true, preview = 0): Promise<csvResultTransformedType> {

    const prom = await ReadCsvFromUrlPromise(url, delimiter, newline, skipEmptyLines, preview);
    console.log("worked: ", prom)

    const proc_data = AssignDataColumnKeys(prom.res.data, columnKeys);
    return ({ data: proc_data, suc: prom.suc, file: prom.file, errors: prom.res.errors, meta: prom.res.meta, });
}

const AssignDataColumnKeys = (data: string[][], keys: string[]): csvDataObjectified[] => {
    const proc_data = [];
    data.forEach((datarow, j) => {
        const rowobj: csvDataObjectified = { id: 0 };
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