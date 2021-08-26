
import React from 'react';
import {
    List,
    AutoSizer,
    CellMeasurer,
    CellMeasurerCache,
} from 'react-virtualized';

class DataView extends React.Component {


    constructor(props) {
        super(props);
        this.state = {

        };

        this.cache = React.createRef();

        this.cache = new CellMeasurerCache({
            fixedWidth: true,
            // defaultHeight: 70,
        });

    }

    render() {
        let { store } = this.props;
        let count = store ? store.count() : 0;
        return (
            <AutoSizer>
                {({ width, height }) => {
                    return (
                        (
                            <List
                                width={width}
                                height={height}
                                rowHeight={this.cache.rowHeight}
                                deferredMeasurementCache={this.cache}
                                rowCount={count}
                                rowRenderer={({ key, index, style, parent }) => {
                                    const record = store.getAt(index);
                                    return (
                                        <CellMeasurer
                                            key={record.get(this.props.propertyId)}
                                            cache={this.cache}
                                            parent={parent}
                                            columnIndex={0}
                                            rowIndex={index}
                                        >
                                            <div className="wrapper-item" style={style}>
                                                {
                                                    this.props.rowRenderer ? this.props.rowRenderer({ key, index, parent, style, record }) : null
                                                }
                                            </div>

                                        </CellMeasurer>
                                    );
                                }}
                            />
                        )
                    )
                }}
            </AutoSizer>
        )

    }
}
DataView.defaultProps = {
    propertyId: "id"
};


export {
    DataView
}