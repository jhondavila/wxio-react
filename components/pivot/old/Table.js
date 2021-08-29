import React from 'react';
import ContainerDnD from "./choosefield/ContainerDnD"
import TableRenderers from "./TableRenderers"
import data from "./Data";
import "./pivot.scss"
class Table extends React.Component {
    constructor(opts) {
        super(opts);

        this.state = {
            data: data
        }

    }
    render() {
        return (
            <div>
                <ContainerDnD fields={this.props.fields}></ContainerDnD>

                <TableRenderers.Table
                    data={this.state.data}
                    cols={["dayDsp", "treatment"]}
                    aggregatorName={"Sum"}
                    vals={[
                        "price",
                        "day",
                        "subject"
                    ]}
                ></TableRenderers.Table>
                {/* <TableRenderers.Table
                    data={this.state.data}
                    rows={["day"]}
                    cols={["treatment"]}
                    aggregatorName={"Sum"}
                    vals={[
                        "price",
                        "day",
                    ]}
                ></TableRenderers.Table>
                <TableRenderers.Table
                    data={this.state.data}
                    cols={["treatment"]}
                    aggregatorName={"Sum"}
                    vals={[
                        "price",
                        "day",
                    ]}
                ></TableRenderers.Table>
                <TableRenderers.Table
                    data={this.state.data}
                    cols={["treatment"]}
                    aggregatorName={"Sum"}
                    vals={[
                        "price",
                        "day",
                        "subject"
                    ]}
                ></TableRenderers.Table>
                <TableRenderers.Table
                    data={this.state.data}
                    rows={["day"]}
                    cols={["treatment"]}
                    cols={["treatment"]}
                    aggregatorName={"Sum"}
                    vals={[
                        "price",
                        "day",
                        "subject"
                    ]}
                ></TableRenderers.Table>
                <TableRenderers.Table
                    data={this.state.data}
                    rows={["day"]}
                    cols={["day", "treatment"]}
                    aggregatorName={"Sum"}
                    vals={[
                        "price",
                        "day",
                        "subject"
                    ]}
                ></TableRenderers.Table> */}
            </div>
        );
    }
};

export default Table