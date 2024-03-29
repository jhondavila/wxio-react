import React, { Component } from 'react';
import { Uploader } from "../upload";
import { Importer } from "./Base";
import Path from "../../util/Path";
import { ModalDiffColumns } from "./DiffColumns";

class ButtonImport extends Component {

    constructor(props) {
        super(props);
    }
    componentDidMount() {

    }
    async onChageUploader(files) {
        let importer = new Importer();
        let records;
        for (let x = 0; x < files.length; x++) {
            let file = files[x];
            if (importer.isExcel(file)) {

                let { headers, results } = await importer.readerData(file);
                if (this.props.process) {
                    records = await this.props.process({ headers, results, file: file, importer })
                } else {

                    records = await this.process({ headers, results, importer });
                }
                // let columns = this.props.columns;
                // columns = header;
                // data.push(...results);
            } else if (importer.isJSON(file)) {
                // console.log(file)
                let { results } = await importer.readerDataJSON(file);
                if (this.props.process) {
                    records = await this.props.process({ results, file: file, importer })
                } else {

                    records = await this.process({ results, importer });
                }
            } else if (importer.isTxt(file)) {
                let { results } = await importer.readerTxt(file);
                if (this.props.process) {
                    records = await this.props.process({ results, file: file, importer })
                } else {
                    records = await this.process({ results, importer });
                }
            }
        }

        this.uploader.reset();

        if (records === false) {
            return;
        }

        if (this.props.onEndImport) {
            this.props.onEndImport({ records });
        }
        // console.log(data)
        // console.log(columns)
    }
    async process({ headers, results }) {
        let columns = this.props.columns;
        let keys = {}


        let headersAvailables = [...headers];

        let columnsNoFind = [];
        // debugger
        // let headerNoIdentified = [];
        if (columns) {
            columns.forEach(c => {
                let find = false;

                for (let x = 0; x < headersAvailables.length; x++) {
                    let headerText = headersAvailables[x];

                    let headerCoincidences = Array.isArray(c.headers) ? c.headers : [c.headers];

                    headerCoincidences = headerCoincidences.filter(i => !!i);
                    let headerCheck = headerText;
                    if (c.ignoreCase) {
                        headerCoincidences = headerCoincidences.map(i => i.toLowerCase());
                        headerCheck = headerText.toLowerCase();
                    }

                    if (headerCoincidences.includes(headerCheck)) {
                        keys[c.dataIndex] = headerText;
                        find = true;
                        break;
                    }
                }

                if (!find) {
                    columnsNoFind.push(c.dataIndex);
                }
            });
        } else {
            for (let x = 0; x < headersAvailables.length; x++) {
                let headerText = headersAvailables[x];
                keys[headerText] = headerText;
            }
            // columns = keys[c.dataIndex]
        }

        let records;
        if (columnsNoFind.length > 0) {
            let response = await ModalDiffColumns({
                textConfirm: this.props.textConfirm,
                textCancel: this.props.textCancel,
                columns: columns,
                keys,
                headers
            })
            if (response) {
                let data = this.processData({ results, keys: response.keys });
                records = this.props.store.add(data);
                this.props.store.emit("import");
                if (this.props.recordValidate) {
                    this.props.store.emit("validateRecords");
                    await this.validateRecords(records);
                    this.props.store.emit("validateRecordsEnd");
                }
            } else {
                return false;
            }
        } else {
            let data = this.processData({ results, keys });
            records = this.props.store.add(data);
            this.props.store.emit("import");
            if (this.props.recordValidate) {
                this.props.store.emit("validateRecords");
                await this.validateRecords(records);
                this.props.store.emit("validateRecordsEnd");
            }
        }
        return records;
    }

    async validateRecords(records) {
        let recordsErrors = [];
        let errors = [];
        for (let x = 0; x < records.length; x++) {
            let record = records[x];
            let status = await record.getValidation();
            if (status !== true) {
                recordsErrors.push(record);
                errors.push(record);
            }
        }
        if (errors.length > 0 && this.props.onError) {
            this.props.onError({
                records: records,
                recordsErrors: recordsErrors,
                errors: errors,
                totalError: errors.length
            });
        }
    }

    processData({ results, keys }) {
        let data = [];
        for (let x = 0; x < results.length; x++) {
            let row = results[x];

            let item = {};

            for (let key in keys) {

                Path.setValue(item, row[keys[key]], key);
            }

            data.push(item);
        }
        return data;
    }
    render() {
        return (
            <Uploader
                ref={c => this.uploader = c}
                onChange={this.onChageUploader.bind(this)}
                multiple={this.props.multiple}
                size={this.props.size}
                trigger={this.props.trigger}
                text={"text"}
                accept={this.props.accept || "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"}
            >{this.props.children}</Uploader>
        )
    }

}

ButtonImport.defaultProps = {
    recordValidate: true
};

export {
    ButtonImport
}

