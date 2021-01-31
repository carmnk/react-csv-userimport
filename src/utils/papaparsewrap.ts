import PapaParse from "papaparse";

export type csvResultType = {
  data: string[][];
  errors: {
    code: string;
    message: string;
    type: string;
  }[];
  meta: {
    aborted: boolean;
    cursor: number;
    delimiter: string;
    linebreak: string;
    truncated: boolean;
  };
};

export type csvWrapReturnType = {
  suc: boolean;
  file: Blob;
  res: csvResultType;
};

export async function ReadCsvFromUrl(
  url: string,
  onFinishedCallback: (suc: boolean, res: csvResultType, file: Blob) => void,
  delimiter = "",
  newline = "",
  skipEmptyLines = true,
  preview = 0
): Promise<void> {
  const blobfile = await fetch(url).then((r) => r.blob());
  ReadCsvFromFile(
    blobfile,
    (suc, res, file) => {
      console.log("blobbed csv: ", suc, res, file);
      onFinishedCallback(suc, res, file);
    },
    delimiter,
    newline,
    skipEmptyLines,
    preview
  );
}

export function ReadCsvFromFile(
  file: Blob,
  onFinishedCallback: (suc: boolean, res: csvResultType, file: Blob) => void,
  delimiter = "",
  newline = "",
  skipEmptyLines = true,
  preview = 0
): void {
  const options = {
    delimiter: delimiter, // auto-detect: ""
    newline: newline, // auto-detect: ""
    header: false, // header to be processed customly
    preview: preview,
    skipEmptyLines: skipEmptyLines,
    encoding: "",
    //worker: true,
  };
  const reader = new FileReader();
  reader.onload = (e) => {
    PapaParse.parse(
      file,
      Object.assign(
        {},
        {
          download: true,
          error: (err, fileout) => {
            // fileout is not passed when in worker mode
            console.log("Error fetching/reading remote csv file", err);
            if (onFinishedCallback) onFinishedCallback(false, err, file);
          },
          complete: (res, fileout) => {
            // fileout is not passed when in worker mode
            if (onFinishedCallback) onFinishedCallback(true, res, file);
          },
        },
        options
      )
    );
  };
  //reader.onloadend = () => {
  //}
  console.log(file);
  reader.readAsText(file, options.encoding || "utf-8");
}

export async function ReadCsvFromUrlPromise(
  url: string,
  delimiter = "",
  newline = "",
  skipEmptyLines = true,
  preview = 0
): Promise<csvWrapReturnType> {
  const blobfile = await fetch(url).then((r) => r.blob());
  return ReadCsvFromFilePromise(blobfile, delimiter, newline, skipEmptyLines, preview);
}

export function ReadCsvFromFilePromise(
  file: Blob,
  delimiter = "",
  newline = "",
  skipEmptyLines = true,
  preview = 0
): Promise<csvWrapReturnType> {
  const options = {
    delimiter: delimiter, // auto-detect: ""
    newline: newline, // auto-detect: ""
    header: false, // header to be processed customly
    preview: preview,
    skipEmptyLines: skipEmptyLines,
    encoding: "",
    //worker: true,
  };
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      PapaParse.parse(
        file,
        Object.assign(
          {},
          {
            download: true,
            error: (res, fileout) => {
              reject({ suc: false, res, file });
            },

            complete: (res, fileout) => {
              resolve({ suc: true, res, file });
            },
          },
          options
        )
      );
    };
    //reader.onloadend = () => {
    //}
    //console.log(file)
    reader.readAsText(file, options.encoding || "utf-8");
  });
}
