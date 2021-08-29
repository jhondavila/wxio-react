import React from 'react';
import PropTypes from 'prop-types';
// import { PivotData } from './Utilities';
import { PivotData, aggregators, spanSize, redColorScaleGenerator, } from './UtilitiesPivot';

// helper function for setting row/col-span in pivotTableRenderer



// function makeRenderer(opts = {}) {
class TableRenderer extends React.PureComponent {


  render() {
    // debugger
    // 
    const pivotData = new PivotData({
      ...this.props,
      aggregators
    });
    this.pivotData = pivotData;

    // console.log(this.props)
    // debugger
    const colAttrs = pivotData.props.cols;
    const rowAttrs = pivotData.props.rows;
    const rowKeys = pivotData.getRowKeys();
    const colKeys = pivotData.getColKeys();


    const grandTotalAggregator = pivotData.getAggregator([], []);
    // console.log(grandTotalAggregator)

    const collapseCol = (colKey, row, col, collapse) => {
      let keys = colKey.slice(0, row + 1);
      let strKey = keys.join(String.fromCharCode(0));
      if (collapse === true) {
        this.props.onCollapseCol && this.props.onCollapseCol(strKey);
      } else {
        this.props.onExpandCol && this.props.onExpandCol(strKey);
      }
    }


    const collapseRow = (colKey, row, col, collapse) => {
      let keys = colKey.slice(0, row + 1);
      console.log(keys)
      let strKey = keys.join(String.fromCharCode(0));
      console.log(strKey)
      if (collapse === true) {
        this.props.onCollapseRow && this.props.onCollapseRow(strKey);
      } else {
        this.props.onExpandRow && this.props.onExpandRow(strKey);
      }
    }

    // debugger
    // let grandTotalAggregator = pivotData.getAggregator([], []);

    // grandTotalAggregator  = grandTotalAggregiator[0];


    // {
    //   const pivotData = new PivotData({
    //     ...this.props
    //   });
    //   const colAttrs = pivotData.props.cols;
    //   const rowAttrs = pivotData.props.rows;
    //   const rowKeys = pivotData.getRowKeys();
    //   const colKeys = pivotData.getColKeys();
    //   const grandTotalAggregator = pivotData.getAggregator([], []);

    //   console.log(pivotData)
    // }
    // debugger
    let valueCellColors = () => { };
    let rowTotalColors = () => { };
    let colTotalColors = () => { };

    let vals = this.props.vals;
    let valAttrs = this.props.vals;
    // if (opts.heatmapMode) {
    //   const colorScaleGenerator = this.props.tableColorScaleGenerator;
    //   const rowTotalValues = colKeys.map(x =>
    //     pivotData.getAggregator([], x).value()
    //   );
    //   rowTotalColors = colorScaleGenerator(rowTotalValues);
    //   const colTotalValues = rowKeys.map(x =>
    //     pivotData.getAggregator(x, []).value()
    //   );
    //   colTotalColors = colorScaleGenerator(colTotalValues);

    //   if (opts.heatmapMode === 'full') {
    //     const allValues = [];
    //     rowKeys.map(r =>
    //       colKeys.map(c =>
    //         allValues.push(pivotData.getAggregator(r, c).value())
    //       )
    //     );
    //     const colorScale = colorScaleGenerator(allValues);
    //     valueCellColors = (r, c, v) => colorScale(v);
    //   } else if (opts.heatmapMode === 'row') {
    //     const rowColorScales = {};
    //     rowKeys.map(r => {
    //       const rowValues = colKeys.map(x =>
    //         pivotData.getAggregator(r, x).value()
    //       );
    //       rowColorScales[r] = colorScaleGenerator(rowValues);
    //     });
    //     valueCellColors = (r, c, v) => rowColorScales[r](v);
    //   } else if (opts.heatmapMode === 'col') {
    //     const colColorScales = {};
    //     colKeys.map(c => {
    //       const colValues = rowKeys.map(x =>
    //         pivotData.getAggregator(x, c).value()
    //       );
    //       colColorScales[c] = colorScaleGenerator(colValues);
    //     });
    //     valueCellColors = (r, c, v) => colColorScales[c](v);
    //   }
    // }

    const getClickHandler =
      this.props.tableOptions && this.props.tableOptions.clickCallback
        ? (value, rowValues, colValues) => {
          const filters = {};
          for (const i of Object.keys(colAttrs || {})) {
            const attr = colAttrs[i];
            if (colValues[i] !== null) {
              filters[attr] = colValues[i];
            }
          }
          for (const i of Object.keys(rowAttrs || {})) {
            const attr = rowAttrs[i];
            if (rowValues[i] !== null) {
              filters[attr] = rowValues[i];
            }
          }
          return e =>
            this.props.tableOptions.clickCallback(
              e,
              value,
              filters,
              pivotData
            );
        }
        : null;

    let noConfig = (!this.props.cols.length && !this.props.rows.length && !this.props.vals.length);
    // debugger
    // let lastGroupRowSubTotal;
    // let subTotalRows = this.props.subTotalRows;
    let collapseColKeys = this.props.collapseColKeys;
    return (
      <table className={`pvtTable ${vals.length === 0 && "pvtTable-no-vals"}`}>
        <thead>
          {colAttrs.map(function (c, j) {
            // debugger
            let rowSpanTotal = colAttrs.length;
            if (valAttrs.length > 1 && rowAttrs.length > 0) {
              rowSpanTotal += 1;
            }
            if (rowAttrs.length !== 0 && valAttrs.length > 1) {
              rowSpanTotal--;
            }
            return (
              <tr key={`colAttr${j}`}>

                {j === 0 && (
                  <th className="empty-pvtAxisLabel" colSpan={rowAttrs.length > 0 ? rowAttrs.length : 1} rowSpan={colAttrs.length + (vals.length > 1 ? 1 : 0)} />
                )}


                {colKeys.map(function (colKey, i) {

                  let colspan;
                  let txt;
                  let rowspan = 1;

                  // let keys = colKey.slice(0, j + 1);
                  // let strKeys = keys.join(String.fromCharCode(0));

                  let isCollapse = false;

                  if (colKey.type === "subtotal" || colKey.type === "collapse") {
                    if (!colKey[j]) {
                      return null;
                    } else {
                      txt = colKey[colKey.position].value;
                      rowspan += colAttrs.length - 1
                      colspan = spanSize(colKeys, i, j, vals.length > 0 ? vals.length : 1);
                    }
                    isCollapse = true;
                  } else {
                    colspan = spanSize(colKeys, i, j, vals.length > 0 ? vals.length : 1);
                    txt = colKey[j];
                    rowspan = j === colAttrs.length - 1 && rowAttrs.length !== 0 && vals.length == 0 ? 2 : 1;
                  }


                  if (colspan === -1) {
                    return null;
                  }



                  return (
                    <th
                      className={`pvtColLabel ${colKey.type && "wx-col-subtotal"}`}
                      key={`colKey${i}`}
                      colSpan={colspan}
                      rowSpan={
                        rowspan
                      }
                    >
                      <span className="mr-2">
                        {txt}
                      </span>

                      {
                        (j < colAttrs.length - 1 && colKey.type !== "subtotal") &&
                        <span className="collapse-button" onClick={collapseCol.bind(this, colKey.attrKeys || colKey, j, i, !isCollapse)}>

                          {
                            isCollapse ?
                              <i className="far fa-plus-square"></i>
                              :
                              <i className="far fa-minus-square"></i>
                          }
                        </span>
                      }


                    </th>
                  );
                })}

                {j === 0 && (
                  <th
                    className="pvtTotalLabel"
                    colSpan={vals.length}
                    rowSpan={
                      rowSpanTotal
                      // colAttrs.length
                      // + (rowAttrs.length === 0 ? 0 : 1)
                      // - (vals.length > 1 && rowAttrs.length > 0 ? 1 : 0)
                    }
                  >
                    Totals
                  </th>
                )}
              </tr>
            );
          })}

          {
            (valAttrs.length == 1 && colAttrs.length == 0) &&
            <tr key={`colAttr`}>
              {
                (rowAttrs.length > 0 && colAttrs.length == 0) &&
                <th className="empty-pvtAxisLabel" colSpan={rowAttrs.length}>

                </th>
              }
              {
                valAttrs.map((val, valIndex) => {
                  let dataIndex = val.dataIndex || val;
                  return (

                    <th
                      className="pvtTotalLabel"
                      key={`colTotal-${dataIndex}-${val.aggregator}`}
                    >
                      {dataIndex}
                    </th>
                  )
                })

              }
            </tr>

          }

          {
            (valAttrs.length > 1) &&
            <tr key={`colAttr`}>
              {
                (rowAttrs.length > 0 && colAttrs.length == 0) &&
                <th className="empty-pvtAxisLabel" colSpan={rowAttrs.length}>

                </th>
              }
              {colKeys.map(function (colKey, i) {
                return vals.map(val => {
                  let dataIndex = val.dataIndex || val;
                  return (
                    <th
                      className="pvtColLabel"
                      key={`colKey-${i}-${dataIndex}-${val.aggregator}`}
                    >
                      {dataIndex}
                    </th>
                  );
                })

              })}
              {
                valAttrs.map((val, valIndex) => {
                  let dataIndex = val.dataIndex || val;
                  return (

                    <th
                      className="pvtTotalLabel"
                      key={`colTotal-${dataIndex}-${val.aggregator}`}
                    >
                      {dataIndex}
                    </th>
                  )
                })

              }
            </tr>
          }



        </thead>

        <tbody>
          {rowKeys.map(function (rowKey, i) {
            let totalAggregators;

            if (rowKey.type === "subtotal") {

              totalAggregators = pivotData.getAggregator(rowKey.attrKeys, []);
            } else {
              totalAggregators = pivotData.getAggregator(rowKey, []);
            }
            return (
              <>


                <tr key={`rowKeyRow${i}`}>
                  {rowKey.map(function (txt, j) {

                    let rowSpan,
                      colspan = 1;
                    let isCollapse = false;
                    if (rowKey.type === "subtotal" || rowKey.type === "collapse") {
                      if (!txt.value) {
                        return null;
                      } else {
                        txt = txt.value;
                        colspan += rowAttrs.length - (j + 1);
                      }
                      isCollapse = true;
                    } else {
                      rowSpan = spanSize(rowKeys, i, j,
                        1,
                      );
                    }

                    if (rowSpan === -1) {
                      // console.log(`f : ${i}, c: ${j}, span: ${x}`)
                      return null;
                    } else {
                      // console.log(`f : ${i}, c: ${j}, span: ${x}`)
                    }
                    return (
                      <th
                        key={`rowKeyLabel${i}-${j}`}
                        className={`pvtRowLabel ${rowKey.type === "subtotal" && "wx-rowSubTotal"}`}
                        rowSpan={rowSpan}
                        colSpan={colspan}
                      >
                        <span className="mr-2">
                          {txt}
                        </span>
                        {
                          (j < rowAttrs.length - 1 && rowKey.type !== "subtotal") &&
                          <span className="collapse-button" onClick={collapseRow.bind(this, rowKey.attrKeys || rowKey, j, i, !isCollapse)}>

                            {
                              isCollapse ?
                                <i className="far fa-plus-square"></i>
                                :
                                <i className="far fa-minus-square"></i>
                            }
                          </span>
                        }


                      </th>
                    );
                  })}


                  {colKeys.map(function (colKey, j) {
                    let aggregators;
                    if (rowKey.type == "subtotal") {
                      // debugger
                    }
                    if (rowKey.type == "subtotal" || colKey.type == "subtotal" || rowKey.type == "collapse" || colKey.type == "collapse") {
                      aggregators = pivotData.getSubtotal(rowKey.attrKeys || rowKey, colKey.attrKeys || colKey);
                    } else {
                      aggregators = pivotData.getAggregator(rowKey, colKey);
                    }

                    let clsRow = rowKey.type == "subtotal" ? "wx-pvtVal-row-subtotal" : "";
                    let clsCol = colKey.type == "subtotal" ? "wx-pvtVal-row-subtotal" : "";
                    return valAttrs.map((val, valIndex) => {
                      const aggregator = aggregators[valIndex];
                      // console.log(aggregator)
                      return (
                        <td
                          className={`pvtVal ${clsRow} ${clsCol}`}
                          key={`pvtVal${i}-${j}-${val.dataIndex || val}-${val.aggregator}`}
                          onClick={() => {
                            // console.log(rowKey, colKey);
                            getClickHandler &&
                              getClickHandler(aggregator.value(), rowKey, colKey)
                          }}
                          style={valueCellColors(
                            rowKey,
                            colKey,
                            aggregator.value()
                          )}
                        >
                          {aggregator.format(aggregator.value())}
                        </td>
                      );

                    })

                  })}
                  {

                    valAttrs.map((val, valIndex) => {
                      const totalAggregator = totalAggregators[valIndex]

                      return <td

                        key={`pvtTotal-${val.dataIndex || val}-${val.aggregator}`}

                        className="pvtTotal"
                        onClick={
                          getClickHandler &&
                          getClickHandler(totalAggregator.value(), rowKey, [null])
                        }
                        style={colTotalColors(totalAggregator.value())}
                      >
                        {totalAggregator.format(totalAggregator.value())}
                      </td>

                    })
                  }

                </tr>
              </>
            );
          })}

          <tr>
            {
              !noConfig &&
              <th
                className="pvtTotalLabel"
                colSpan={rowAttrs.length}
              >
                Totals
              </th>
            }

            {colKeys.map(function (colKey, i) {
              let totalAggregator;

              if (colKey.type === "subtotal") {

                totalAggregator = pivotData.getAggregator([], colKey.attrKeys);
              } else {
                totalAggregator = pivotData.getAggregator([], colKey);
              }

              // debugger
              return valAttrs.map((val, valIndex) => {
                return (
                  <td
                    className={`pvtTotal ${colKey.type === "subtotal" ? "wx-col-subtotal" : ""}`}
                    key={`total-${i}-${val.dataIndex || val}-${val.aggregator}`}
                    onClick={
                      getClickHandler &&
                      getClickHandler(totalAggregator[valIndex].value(), [null], colKey)
                    }
                    style={rowTotalColors(totalAggregator[valIndex].value())}
                  >
                    {totalAggregator[valIndex].format(totalAggregator[valIndex].value())}
                  </td>
                );

              })


            })}



            {
              valAttrs.map((val, valIndex) => {
                return (

                  <td
                    key={`pvtGrandTotal-${val.dataIndex || val}-${val.aggregator}`}
                    onClick={
                      getClickHandler &&
                      getClickHandler(grandTotalAggregator.value(), [null], [null])
                    }
                    className="pvtGrandTotal"
                  >

                    {grandTotalAggregator[valIndex].format(grandTotalAggregator[valIndex].value())}
                  </td>
                )
              })

            }
          </tr>
        </tbody>
      </table>
    );
  }
}

TableRenderer.defaultProps = PivotData.defaultProps;
TableRenderer.propTypes = PivotData.propTypes;
TableRenderer.defaultProps.tableColorScaleGenerator = redColorScaleGenerator;
TableRenderer.defaultProps.tableOptions = {};
TableRenderer.propTypes.tableColorScaleGenerator = PropTypes.func;
TableRenderer.propTypes.tableOptions = PropTypes.object;
//   return TableRenderer;
// }

// class TSVExportRenderer extends React.PureComponent {
//   render() {
//     const pivotData = new PivotData(this.props);
//     const rowKeys = pivotData.getRowKeys();
//     const colKeys = pivotData.getColKeys();
//     if (rowKeys.length === 0) {
//       rowKeys.push([]);
//     }
//     if (colKeys.length === 0) {
//       colKeys.push([]);
//     }

//     const headerRow = pivotData.props.rows.map(r => r);
//     if (colKeys.length === 1 && colKeys[0].length === 0) {
//       headerRow.push(this.props.aggregatorName);
//     } else {
//       colKeys.map(c => headerRow.push(c.join('-')));
//     }

//     const result = rowKeys.map(r => {
//       const row = r.map(x => x);
//       colKeys.map(c => {
//         const v = pivotData.getAggregator(r, c).value();
//         row.push(v ? v : '');
//       });
//       return row;
//     });

//     result.unshift(headerRow);

//     return (
//       <textarea
//         value={result.map(r => r.join('\t')).join('\n')}
//         style={{ width: window.innerWidth / 2, height: window.innerHeight / 2 }}
//         readOnly={true}
//       />
//     );
//   }
// }

// TSVExportRenderer.defaultProps = PivotData.defaultProps;
// TSVExportRenderer.propTypes = PivotData.propTypes;

// export default {
//   Table: makeRenderer(),
//   'Table Heatmap': makeRenderer({ heatmapMode: 'full' }),
//   'Table Col Heatmap': makeRenderer({ heatmapMode: 'col' }),
//   'Table Row Heatmap': makeRenderer({ heatmapMode: 'row' }),
//   'Exportable TSV': TSVExportRenderer,
// };

export default {
  Table: TableRenderer
}