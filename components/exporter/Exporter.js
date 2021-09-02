import React, { useDebugValue, useEffect } from 'react';
// import PDFViewer from 'pdfjs-dist/web/pdf_viewer';
import { Row, Col, Button } from 'react-bootstrap';
import XLSX from "sheetjs-style";
import DataReport from "./DataReport";

export class Exporter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    async componentDidMount() {

    }
    async exportXLS(opts = {}) {
        let { columns, store, filename } = this.props;
        // console.log(columns, store)
        // let { filename } = opts;
        if (opts.filename) {
            filename = opts.filename;
        }

        let data;

        data = opts.data || [];
        columns = opts.columns || columns;
        filename = opts.filename || filename;

        if (store) {
            let totalPages = store.getTotalPages();
            for (let x = 1; x <= totalPages; x++) {
                await store.loadPage(x);
                data.push(...store.data.slice(0));
            }
        }

        // let data = store.map((record) => {
        //     return record;
        // });

        DataReport.export({
            data: data,
            columns: columns,
            filename: filename
        });
    }
    render() {
        return (
            null
        );
    }
}