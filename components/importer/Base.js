import XLSX from "sheetjs-style";

class Importer {

    readerData(rawFile) {
        this.loading = true
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = e => {
                const data = e.target.result
                const workbook = XLSX.read(data, { type: 'array' })
                const firstSheetName = workbook.SheetNames[0]
                const worksheet = workbook.Sheets[firstSheetName]
                const headers = this.getHeaderRow(worksheet)
                const results = XLSX.utils.sheet_to_json(worksheet, {
                    raw: false, cellDates: true,
                    cellStyles : true,
                    // sheetRows : true,
                    // cellHTML : true,
                    // cellNF : true


                    // dateNF: 'yyyy-mm-dd'
                })

                // console.log("headers =>",worksheet)
                // console.log("headers =>",headers)
                // console.log("results =>",results)
                // this.generateData({ header, results })
                this.loading = false;
                resolve({ headers, results });
            }
            reader.readAsArrayBuffer(rawFile)
        })
    }
    getHeaderRow(sheet) {
        const headers = []
        const range = XLSX.utils.decode_range(sheet['!ref'])
        let C
        const R = range.s.r
        /* start in the first row */
        for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
            const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
            /* find the cell in the first row */
            let hdr = 'UNKNOWN ' + C // <-- replace with your desired default
            if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
            headers.push(hdr)
        }
        return headers
    }
    // generateData({ header, results }) {
    //     this.excelData.header = header
    //     this.excelData.results = results
    //     this.onSuccess && this.onSuccess(this.excelData)
    // }
    isExcel(file) {
        return /\.(xlsx|xls|csv)$/.test(file.name)
    }
}

export {
    Importer
}