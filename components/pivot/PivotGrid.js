import React from 'react';
import { ModalChooseField } from "./choosefield"
import TableRenderers from "./TableRenderers"
import { Button, Row } from "react-bootstrap"
import PropTypes from 'prop-types';
import "./pivot.scss"
class PivotGrid extends React.Component {
    constructor(opts) {
        super(opts);

        // let columns = this.props.selection.columns ? this.props.selection.columns : [];
        // let values = this.props.selection.values ? this.props.selection.values : []
        // let rows = this.props.selection.rows ? this.props.selection.rows : [];
        // let filters = this.props.selection.filters ? this.props.selection.filters : [];

        let { columns, values, rows, filters } = this.parseSelection(this.props.selection);
        let { data, fields } = this.initConfig();
        this.state = {
            columns: columns,
            values: values,
            rows: rows,
            data: data,
            fields: fields,
            selection: {
                columns: columns,
                rows: rows,
                values: values,
                filters: filters
            },
            collapseColKeys: [],
            collapseRowKeys: [],
        }

    }

    initConfig() {
        // debugger

        let fields = [], data = [];
        if (this.props.store) {
            data = this.props.store.getData();

            let model = this.props.store.model;
            let labels = this.props.labels || {};

            for (let fieldKey in model.fields) {
                let field = model.fields[fieldKey];
                fields.push({
                    dataIndex: field.name,
                    text: labels[field.name] || field.name || field.text,
                });
            }

        } else if (this.props.data) {
            data = this.props.data;
            fields = this.props.fields || [];
        }

        return {
            fields, data
        }
    }
    async componentDidMount() {
        if (this.props.store) {
            if (this.props.autoLoad) {

                if (this.props.remoteMatrix) {

                    let { columns, rows, values } = this.state.selection;

                    this.props.store.addExtraParams("matrix", JSON.stringify({
                        columns: columns,
                        rows: rows,
                        values: values
                    }))
                }
                this.props.store.load();
            }
            //     // console.log(this.props.store);
            //     // console.log(this.props.store.getData())
            //     let data = this.props.store.getData();
            //     this.setState({
            //         data: data
            //     });
        }
    }

    onStoreDataChanged() {
        // if()
        console.log("onDataChanged")
        let data = this.props.store.getData();
        this.setState({
            data: data
        });
    }

    onImport() {
        let { fields, data } = this.initConfig();
        this.setState({
            data: data,
            fields: fields,
        })
    }
    componentDidUpdate(prevProps) {
        if (this.props.selection !== prevProps.selection) {
            this.setState({
                selection: this.parseSelection(this.props.selection)
            });
        } else if (this.props.data !== prevProps.data) {
            this.setState({
                data: this.props.data
            })
        } else if (this.props.fields !== prevProps.fields) {
            this.setState({
                fields: this.props.fields
            })
        }
    }
    parseSelection(selection) {

        let columns = selection.columns ? selection.columns : [];
        let values = selection.values ? selection.values : []
        let rows = selection.rows ? selection.rows : [];
        let filters = selection.filters ? selection.filters : [];

        return {
            columns: columns,
            rows: rows,
            values: values,
            filters: filters
        }
    }
    openConfig() {
        // debugger
        let modal = ModalChooseField({
            title: "Configurar",
            fields: this.state.fields,
            selection: this.state.selection,
            data: this.state.data,
            store: this.props.store
        });

        modal.then(result => {

            console.log(result);
            this.setState({
                columns: result.columns.map(i => i.dataIndex),
                rows: result.rows.map(i => i.dataIndex),
                values: result.values.map(i => i),
                selection: result,
                filters: result.filters
            }, () => {
                if (this.props.remoteMatrix) {
                    let { columns, rows, values } = this.state.selection;
                    this.props.store.addExtraParams("matrix", JSON.stringify({
                        columns: columns,
                        rows: rows,
                        values: values
                    }));
                    this.props.store.load();
                }

            })
        }).catch(error => {
            console.log(error)
        });
    }

    onCollapseCol(strKey) {
        // console.log("onCollapse", strKey);
        this.setState({
            collapseColKeys: [
                ...this.state.collapseColKeys,
                strKey
            ]
        })
    }
    onExpandCol(strKey) {
        let collapseColKeys = this.state.collapseColKeys;

        // collapseColKeys.splice()
        const index = collapseColKeys.indexOf(strKey);
        if (index > -1) {
            collapseColKeys.splice(index, 1);
        }
        this.setState({
            collapseColKeys: collapseColKeys
        })

    }
    onCollapseRow(strKey) {
        this.setState({
            collapseRowKeys: [
                ...this.state.collapseRowKeys,
                strKey
            ]
        })
    }
    onExpandRow(strKey) {
        let collapseRowKeys = this.state.collapseRowKeys;
        const index = collapseRowKeys.indexOf(strKey);
        if (index > -1) {
            collapseRowKeys.splice(index, 1);
        }
        this.setState({
            collapseRowKeys: collapseRowKeys
        })
    }
    render() {
        let noConfig = (!this.state.columns.length && !this.state.rows.length && !this.state.values.length);
        return (

            <div className="">
                {
                    !noConfig ?
                        <>
                            <Row className="mx-0" style={{ left: 0 }}>
                                <Button size="sm" onClick={this.openConfig.bind(this)}><i className="far fa-cog"></i></Button>
                            </Row>
                            <Row className="mx-0">
                                <TableRenderers.Table
                                    ref={c => this.table = c}
                                    data={this.state.data}
                                    cols={this.state.columns}
                                    rows={this.state.rows}
                                    vals={this.state.values}
                                    subTotalCols={this.props.subTotalCols}
                                    subTotalRows={this.props.subTotalRows}
                                    collapseColKeys={this.state.collapseColKeys}
                                    collapseRowKeys={this.state.collapseRowKeys}
                                    onCollapseCol={this.onCollapseCol.bind(this)}
                                    onExpandCol={this.onExpandCol.bind(this)}
                                    onCollapseRow={this.onCollapseRow.bind(this)}
                                    onExpandRow={this.onExpandRow.bind(this)}
                                ></TableRenderers.Table>
                            </Row>

                        </>
                        :

                        <div className="pvtTable-empty">

                            <Button className="pvtTable-button-config" size="sm" onClick={this.openConfig.bind(this)}><i className="far fa-cog"></i></Button>

                        </div>
                }
            </div>
        );
    }
};



PivotGrid.defaultProps = {
    // data: [],
    selection: {},
    localFilters: true,
    remoteFilters: false
    // fields: []
};


PivotGrid.propTypes = {
    data: PropTypes.oneOfType([PropTypes.array]),
    fields: PropTypes.oneOfType([PropTypes.array]),
    selection: PropTypes.object.isRequired,
    localFilters: PropTypes.bool.isRequired,
    remoteFilters: PropTypes.bool.isRequired,
}

// console.log(PivotGrid.propTypes)
export default PivotGrid;