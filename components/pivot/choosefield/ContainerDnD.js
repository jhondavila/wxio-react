import React, { useState, useCallback } from 'react';
import { Field } from './Field';
import update, { extend } from 'immutability-helper';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Row, Col } from "react-bootstrap"
import { ChooserField } from "./ChooserField"


// const style = {
//     width: 400,
// };
// import {

// } from '@szhsin/react-menu';
// import '@szhsin/react-menu/dist/index.css';

// import {
//     ControlledMenuTest
// }
//     from '../../../../components/menu-master/src';

import {
    ControlledMenu,
    MenuItem,
    useMenuState
}
    from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
//  from "../../menu-master/src"
// import '../../menu-master/src/styles/index.scss';

import "./choosefield.scss";
import { drag, tree, utcFormat } from 'd3';
import { FilterCfg } from "./filter/FilterCfg"
let uuid = 0;
class Container extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            fields: [],
            columns: [],
            rows: [],
            filters: [],
            values: []
        };
        // window.ChooserField = this;
    }
    getSelection() {
        return {
            columns: [...this.state.columns],
            rows: [...this.state.rows],
            filters: [...this.state.filters],
            values: [...this.state.values],
        }
    }
    componentDidUpdate(preProps) {
        if (this.props.selection !== preProps.selection) {
            this.updateSelection()
        }
    }
    updateSelection() {
        if (this.props.selection) {
            let sel = this.props.selection;
            // console.log(sel)
            // debugger
            let filterProcces = this.findFieldsFilters(sel.filters);
            console.log(filterProcces)

            this.setState({
                columns: this.findFields(sel.columns),
                rows: this.findFields(sel.rows),
                values: this.findFields(sel.values, true),
                filters: filterProcces
            });
        }
    }
    findField(value) {
        let field = this.state.fields.find(f => {
            return f.dataIndex == value;
        });
        return field;
    }
    findFieldsFilters(value, filters = []) {
        if (Array.isArray(value)) {
            value.map(i => {
                return this.findFieldsFilters(i, filters);
            });
        } else if (typeof value == "object") {
            if (value.dataIndex) {
                // debugger
                let field = this.findField(value.dataIndex);
                let obj = {
                    ...field,
                    id: `ID-${uuid++}`,
                    filter: value.filter
                };
                if (field) {
                    filters.push(obj);
                }

            } else if (value.property) {
                let field = this.findField(value.property);
                if (field) {
                    let obj = {
                        ...field,
                        id: `ID-${uuid++}`,
                        filter: value
                    };
                    filters.push(obj);
                }
            } else {
                for (let p in value) {
                    let field = this.findField(p);
                    if (field) {
                        let obj = {
                            ...field,
                            filter: {
                                property: p,
                                value: value[p],
                                type: "equal"
                            }
                        };
                        filters.push(obj);
                    }
                }
            }
        }
        return filters;
    }
    findFields(values, aggregator) {
        if (values) {
            let fields = values.map(i => {
                console.log(i)
                let field = this.state.fields.find(f => {
                    if (typeof i == "string") {
                        return f.dataIndex == i;
                    } else {
                        return f.dataIndex == i.dataIndex
                    }
                });
                if (field) {
                    return {
                        ...field,
                        id: `ID-${uuid++}`,
                        ...(aggregator && {
                            aggregator: i.aggregator
                        })
                    };
                } else {
                    return null;
                }
            });
            return fields.filter(f => !!f);
        } else {
            return [];
        }

    }
    componentDidMount() {
        // console.log(this.props.selection)
        let fields = this.props.fields || [];
        fields.map(i => {
            return {
                ...i,
                id: `ID-${uuid++}`
            }
        });
        this.setState({
            fields: fields
        }, () => {
            this.updateSelection()
        });
    }
    moveField({ group, dragIndex, hoverIndex, isAdd, data }) {
        // console.log(isAdd)
        // console.log(dragIndex)
        console.log("moveField", group, data, isAdd)
        if (isAdd) {
            console.log(hoverIndex)
            let dragCard = this.state[group].find(i => i.phantom);
            let find = this.state[group].find(i => i.dataIndex == data.dataIndex);
            if (!dragCard && !find) {
                let items = this.state[group];
                items.splice(hoverIndex, 0, {
                    // ...data,
                    id: `ID-PHANTOM-${uuid++}`,
                    phantom: true,
                    text: " "
                });
                this.setState({
                    [group]: items
                })
            } else if (dragCard && !find) {
                let dragIndex = this.state[group].indexOf(dragCard);

                this.setState({
                    [group]: update(this.state[group], {
                        $splice: [
                            [dragIndex, 1],
                            [hoverIndex, 0, dragCard],
                        ],
                    })
                });
            } else if (find) {

                let dragIndex = this.state[group].indexOf(find);

                this.setState({
                    [group]: update(this.state[group], {
                        $splice: [
                            [dragIndex, 1],
                            [hoverIndex, 0, find],
                        ],
                    })
                });
            }

        } else {
            const dragCard = this.state[group][dragIndex];
            if (dragCard) {
                this.setState({
                    [group]: update(this.state[group], {
                        $splice: [
                            [dragIndex, 1],
                            [hoverIndex, 0, dragCard],
                        ],
                    })
                });
            }
        }


    }
    onAddChooser(opts) {
        console.log("onAddChooser", opts)
        let { item, dropResult, data, from, fromMultiple, target, multiple } = opts;
        if (target) {

            if (from == target) {
                return;
            }
            if (from !== "fields") {
                if (fromMultiple) {
                    this.setState({
                        [from]: this.state[from].filter(i => item.id !== i.id)
                    })
                } else {
                    this.setState({
                        [from]: this.state[from].filter(i => item.dataIndex !== i.dataIndex)
                    })
                }

            }
            // console.log(isMultiple)
            let targetItems = this.state[target];
            let find = targetItems.find(i => i.dataIndex == data.dataIndex);
            let phantom = targetItems.find(i => i.phantom);
            // if(find.phantom)
            // debuggerfonDragEnter
            // targetItems = targetItems.filter(i => !i.phantom);
            if (!find && !phantom) {

                this.setState({
                    [target]: [
                        ...targetItems,
                        {
                            ...data,
                            id: `ID-${target.toUpperCase()}-${uuid++}`
                        }
                    ]
                })
            } else if (find && !multiple) {


            } else if (phantom) {
                let phantomIndex = targetItems.indexOf(phantom);
                targetItems.splice(phantomIndex, 1, {
                    ...data,
                    id: `ID-${target.toUpperCase()}-${uuid++}`
                });

                this.setState({
                    [target]: [...targetItems]
                })
            }

            // else if (find && multiple && !phantom) {
            //     this.setState({
            //         [target]: [
            //             ...targetItems,
            //             {
            //                 ...data,
            //                 id: `ID-VALUE-${uuid++}`
            //             }
            //         ]
            //     })
            // }
        }
    }

    onDragLeave({ group }) {
        // console.log("onDragLeave", group);
        let targetItems = this.state[group];
        let phantom = targetItems.find(i => i.phantom);

        if (phantom) {
            let phantomIndex = targetItems.indexOf(phantom);
            targetItems.splice(phantomIndex, 1);
        }
        this.setState({
            [group]: [...targetItems]
        })

    }
    onDragEnter({ group, item }) {

        let targetItems = this.state[group];
        let phantom = targetItems.find(i => i.phantom);
        let find = targetItems.find(i => i.dataIndex == item.dataIndex);
        // console.log(item)
        if (!phantom && !find) {
            this.setState({
                [group]: [
                    ...targetItems,
                    {
                        id: `ID-PHANTOM-${uuid++}`,
                        phantom: true,
                        text: item.data.text
                    }
                ]
            })

        }
    }
    showConfigMenu(e, field) {
        this.field = field;
        e.preventDefault();
        this.setState({
            showMenuAggregators: true,
            menuAggregatorsAP: { x: e.clientX, y: e.clientY }
        });
    }
    fieldOperation(operation) {
        let field = this.field;

        let object = this.state.values.find(i => i.id == field.id);

        let index = this.state.values.indexOf(object);

        let newObject = {
            ...object,
            aggregator: operation
        };

        let values = this.state.values;

        values.splice(index, 1, newObject);
        // console.log(values);

        this.setState({
            values: values
        });

    }
    showConfigMenuFilters(e, options) {
        e.preventDefault();
        let store = this.props.store;
        let field;
        if (store && store.model) {
            field = store.model.fields[options.dataIndex];
        }

        // console.log()
        let filterEdit = {
            dataIndex: options.dataIndex,
            filter: options.data.filter || {},
            field
        };

        this.setState({
            showMenuFilters: true,
            menuFiltersAP: { x: e.clientX, y: e.clientY },
            filterEdit
        });
    }
    addFilter(params) {

        let { property, config } = params;

        let field = this.state.filters.find(i => i.dataIndex == property);
        field.filter = config;

        this.setState({
            filters: [
                ...this.state.filters
            ]
        });
    }
    render() {
        let filterEdit = this.state.filterEdit || {};
        return (
            <DndProvider backend={HTML5Backend}>
                <div className="chooser-selector d-flex" style={{ height: 400 }}>


                    <ControlledMenu anchorPoint={this.state.menuAggregatorsAP} isOpen={this.state.showMenuAggregators}
                        onClose={() => {
                            this.setState({
                                showMenuAggregators: false
                            })
                        }}>
                        <MenuItem onClick={this.fieldOperation.bind(this, "sum")}>Sumar</MenuItem>
                        <MenuItem onClick={this.fieldOperation.bind(this, "count")}>Contar</MenuItem>
                        <MenuItem onClick={this.fieldOperation.bind(this, "avg")}>Promediar</MenuItem>
                        <MenuItem onClick={this.fieldOperation.bind(this, "max")}>Máximo</MenuItem>
                        <MenuItem onClick={this.fieldOperation.bind(this, "min")}>Mínimo</MenuItem>
                    </ControlledMenu>


                    <ControlledMenu anchorPoint={this.state.menuFiltersAP} isOpen={this.state.showMenuFilters}
                        onClose={(e) => {
                            // console.log("menuroot")
                            // this.setState({
                            //     showMenuFilters: false
                            // })
                        }}>
                        <FilterCfg
                            property={filterEdit.dataIndex}
                            value={filterEdit.filter}
                            field={filterEdit.field}
                            store={this.props.store}
                            onConfirm={(params) => {
                                this.addFilter(params);
                                this.setState({
                                    showMenuFilters: false
                                })
                            }}
                            onCancel={e => {
                                this.setState({
                                    showMenuFilters: false
                                })
                            }}
                        />
                    </ControlledMenu>

                    {/* <div className="chooser-fields chooser-availables">
                        {this.state.fields.map((field, index) => {
                            return (<Field
                                key={field.dataIndex}
                                index={index}
                                dataIndex={field.dataIndex}
                                data={field}
                                text={field.text}
                                multiple={false}
                                group={"fields"}
                                moveField={this.moveField.bind(this)}
                                onAddChooser={this.onAddChooser.bind(this)}
                            />);
                        })}
                    </div> */}

                    <ChooserField
                        keyProperty={"dataIndex"}
                        name="fields"
                        className="chooser-fields chooser-availables"
                        fields={this.state.fields}
                        group={"fields"}
                        moveField={this.moveField.bind(this)}
                        onAddChooser={this.onAddChooser.bind(this)}
                    // onDragEnter={this.onDragEnter.bind(this)}
                    // onDragLeave={this.onDragLeave.bind(this)}
                    />


                    <div className="chooser-groups flex-column d-flex">
                        <div className="chooser-row d-flex">
                            <ChooserField name="filters" group={"filters"} className="chooser-filters" fields={this.state.filters} moveField={this.moveField.bind(this)}
                                onAddChooser={this.onAddChooser.bind(this)}
                                onDragEnter={this.onDragEnter.bind(this)}
                                onDragLeave={this.onDragLeave.bind(this)}

                                configurable={true}
                                showMenu={this.showConfigMenuFilters.bind(this)}
                            >
                                <div>
                                    <span>
                                        Filtros
                                    <i className="fas fa-filter icon-title"></i>
                                    </span>
                                </div>

                            </ChooserField>
                            <ChooserField name="columns" group={"columns"} className="chooser-columns" fields={this.state.columns} moveField={this.moveField.bind(this)}
                                onAddChooser={this.onAddChooser.bind(this)}
                                onDragEnter={this.onDragEnter.bind(this)}
                                onDragLeave={this.onDragLeave.bind(this)}


                            >
                                <div>
                                    <span>
                                        Columnas
                                        <i className="fad fa-line-columns icon-title"></i>
                                    </span>
                                </div>
                            </ChooserField>
                        </div>

                        <div className="chooser-row d-flex">
                            <ChooserField name="rows" group={"rows"} className="chooser-rows" fields={this.state.rows} moveField={this.moveField.bind(this)}
                                onAddChooser={this.onAddChooser.bind(this)}
                                onDragEnter={this.onDragEnter.bind(this)}
                                onDragLeave={this.onDragLeave.bind(this)}

                            >

                                <div>
                                    <span>
                                        Filas
                                        <i className="fad fa-align-justify icon-title"></i>
                                    </span>
                                </div>
                            </ChooserField>
                            <ChooserField
                                name="values"
                                group={"values"}
                                className="chooser-values"
                                fields={this.state.values}
                                moveField={this.moveField.bind(this)}
                                onAddChooser={this.onAddChooser.bind(this)}
                                multiple={true}
                                onDragEnter={this.onDragEnter.bind(this)}
                                onDragLeave={this.onDragLeave.bind(this)}
                                // config={true}
                                configurable={true}
                                showMenu={this.showConfigMenu.bind(this)}
                            >
                                <div>
                                    <span>
                                        Valores
                                        <i className="far fa-sigma icon-title"></i>
                                    </span>
                                </div>
                            </ChooserField>
                        </div>
                    </div>


                </div>

            </DndProvider>
        )
    }

};
export default Container