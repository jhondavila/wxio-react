import PropTypes from 'prop-types';

import { aggregators, aggregatorTemplates, getSort, naturalSort } from "./utilities/Aggregators";
import { spanSize, redColorScaleGenerator, addSubTotal } from "./utilities/Cell";

/*
Data Model class
*/

class PivotData {
  constructor(inputProps = {}) {
    this.props = Object.assign({}, PivotData.defaultProps, inputProps);
    PropTypes.checkPropTypes(
      PivotData.propTypes,
      this.props,
      'prop',
      'PivotData'
    );

    this.aggregator = [];
    // debugger
    this.props.vals.map(val => {
      let dataIndex = val.dataIndex || val;
      let aggregator = val.aggregator || "count";
      let aggregators = this.props.aggregators[aggregator]([dataIndex])

      this.aggregator.push(...aggregators)
    })
    // this.aggregator = this.props.aggregators[this.props.aggregatorName](
    //   this.props.vals
    // );
    this.tree = {};
    this.rowSubTotals = {};
    this.colSubTotals = {};
    this.rowKeys = [];
    this.rowKeysSubTotal = [];
    this.colKeys = [];
    this.rowTotals = {};
    this.colTotals = {};
    // this.allTotal = this.aggregator(this, [], []);
    this.allTotal = this.aggregator.map(aggregator => {
      return aggregator(this, [], [])
    });
    this.sorted = false;

    // iterate through input, accumulating data for cells
    // debugger
    PivotData.forEachRecord(
      this.props.data,
      this.props.derivedAttributes,
      record => {
        if (this.filter(record)) {
          this.processRecord(record);
          this.processRowRecordSubTotal(record);
          this.processColRecordSubTotal(record);
        }
      }
    );
  }

  filter(record) {
    for (const k in this.props.valueFilter) {
      if (record[k] in this.props.valueFilter[k]) {
        return false;
      }
    }
    return true;
  }

  forEachMatchingRecord(criteria, callback) {
    return PivotData.forEachRecord(
      this.props.data,
      this.props.derivedAttributes,
      record => {
        if (!this.filter(record)) {
          return;
        }
        for (const k in criteria) {
          const v = criteria[k];
          if (v !== (k in record ? record[k] : 'null')) {
            return;
          }
        }
        callback(record);
      }
    );
  }

  arrSort(attrs) {
    let a;
    const sortersArr = (() => {
      const result = [];
      for (a of Array.from(attrs)) {
        result.push(getSort(this.props.sorters, a));
      }
      return result;
    })();
    return function (a, b) {
      for (const i of Object.keys(sortersArr || {})) {
        const sorter = sortersArr[i];
        const comparison = sorter(a[i], b[i]);
        if (comparison !== 0) {
          return comparison;
        }
      }
      return 0;
    };
  }

  sortKeys() {
    if (!this.sorted) {
      this.sorted = true;
      const v = (r, c) => this.getAggregator(r, c).value();
      switch (this.props.rowOrder) {
        case 'value_a_to_z':
          this.rowKeys.sort((a, b) => naturalSort(v(a, []), v(b, [])));
          break;
        case 'value_z_to_a':
          this.rowKeys.sort((a, b) => -naturalSort(v(a, []), v(b, [])));
          break;
        default:
          this.rowKeys.sort(this.arrSort(this.props.rows));
      }
      switch (this.props.colOrder) {
        case 'value_a_to_z':
          this.colKeys.sort((a, b) => naturalSort(v([], a), v([], b)));
          break;
        case 'value_z_to_a':
          this.colKeys.sort((a, b) => -naturalSort(v([], a), v([], b)));
          break;
        default:
          this.colKeys.sort(this.arrSort(this.props.cols));
      }
    }
  }

  spanSize = spanSize
  getColKeys() {
    this.sortKeys();
    if (this.props.subTotalCols && this.props.cols.length > 1) {
      let size = this.props.cols.length - 2;
      this.colKeysSubTotal = addSubTotal(this.colKeys, 0, size, this.props.collapseColKeys);
      return this.colKeysSubTotal;
    } else {
      return this.colKeys;
    }
  }

  getRowKeys() {
    this.sortKeys();
    if (this.props.subTotalRows && this.props.rows.length > 1) {
      let size = this.props.rows.length - 2;
      this.rowKeysSubTotal = addSubTotal(this.rowKeys, 0, size, this.props.collapseRowKeys);
      return this.rowKeysSubTotal;
    } else {
      return this.rowKeys;
    }
  }
  processRowRecordSubTotal(record) {
    if (this.props.subTotalRows) {
      for (let r = this.props.rows.length - 1; r > 0; r--) {
        let colKey = [];
        let rowKey;
        let flatRowKey, flatColKey;

        if (this.props.cols.length > 0) {
          for (const x of Array.from(this.props.cols.slice(0, this.props.cols.length))) {
            colKey.push(x in record ? record[x] : 'null');
            rowKey = [];
            for (const x of Array.from(this.props.rows.slice(0, r))) {
              rowKey.push(x in record ? record[x] : 'null');
            }
            flatRowKey = rowKey.join(String.fromCharCode(0));
            flatColKey = colKey.join(String.fromCharCode(0));
            if (colKey.length !== 0 && rowKey.length !== 0) {
              //sub total por columna
              //////////////////////////////
              //////////////////////////////
              //////////////////////////////
              if (!this.rowSubTotals[flatRowKey]) {
                this.rowSubTotals[flatRowKey] = {};
              }
              if (!this.rowSubTotals[flatRowKey][flatColKey]) {
                this.rowSubTotals[flatRowKey][flatColKey] = this.aggregator.map(aggregator => {
                  return aggregator(
                    this,
                    rowKey,
                    colKey
                  )
                });
              }

              this.rowSubTotals[flatRowKey][flatColKey].forEach(i => {
                i.push(record);
              });
            }
          }
        } else {
          for (const x of Array.from(this.props.cols.slice(0, this.props.cols.length))) {
            colKey.push(x in record ? record[x] : 'null');
          }
          rowKey = [];
          for (const x of Array.from(this.props.rows.slice(0, r))) {
            rowKey.push(x in record ? record[x] : 'null');
          }
          flatRowKey = rowKey.join(String.fromCharCode(0));
          flatColKey = colKey.join(String.fromCharCode(0));
          if (colKey.length !== 0 && rowKey.length !== 0) {
            //sub total por columna
            //////////////////////////////
            //////////////////////////////
            //////////////////////////////
            if (!this.rowSubTotals[flatRowKey]) {
              this.rowSubTotals[flatRowKey] = {};
            }
            if (!this.rowSubTotals[flatRowKey][flatColKey]) {
              this.rowSubTotals[flatRowKey][flatColKey] = this.aggregator.map(aggregator => {
                return aggregator(
                  this,
                  rowKey,
                  colKey
                )
              });
            }

            this.rowSubTotals[flatRowKey][flatColKey].forEach(i => {
              i.push(record);
            });
          }

        }

        //////////////////////////////
        //////////////////////////////
        //////////////////////////////
        //sub total raiz
        if (rowKey.length !== 0) {
          if (!this.rowTotals[flatRowKey]) {
            this.rowTotals[flatRowKey] = this.aggregator.map(aggregator => {
              return aggregator(this, rowKey, []);
            });
          }
          this.rowTotals[flatRowKey].forEach((i) => {
            i.push(record)
          });
        }
      }
    }
  }
  processColRecordSubTotal(record) {
    if (this.props.subTotalCols) {
      for (let r = this.props.cols.length - 1; r > 0; r--) {
        let rowKey = [];
        let colKey;
        let flatRowKey, flatColKey;

        if (this.props.rows.length > 0) {
          for (const x of Array.from(this.props.rows.slice(0, this.props.rows.length))) {
            rowKey.push(x in record ? record[x] : 'null');
            colKey = [];
            for (const x of Array.from(this.props.cols.slice(0, r))) {
              colKey.push(x in record ? record[x] : 'null');
            }
            flatRowKey = rowKey.join(String.fromCharCode(0));
            flatColKey = colKey.join(String.fromCharCode(0));
            if (colKey.length !== 0 && rowKey.length !== 0) {
              if (!this.colSubTotals[flatRowKey]) {
                this.colSubTotals[flatRowKey] = {};
              }
              if (!this.colSubTotals[flatRowKey][flatColKey]) {
                this.colSubTotals[flatRowKey][flatColKey] = this.aggregator.map(aggregator => {
                  return aggregator(
                    this,
                    rowKey,
                    colKey
                  )
                });
              }
              this.colSubTotals[flatRowKey][flatColKey].forEach(i => {
                i.push(record);
              });

            }
          }

        } else {
          for (const x of Array.from(this.props.rows.slice(0, this.props.rows.length))) {
            rowKey.push(x in record ? record[x] : 'null');

          }

          colKey = [];
          for (const x of Array.from(this.props.cols.slice(0, r))) {
            colKey.push(x in record ? record[x] : 'null');
          }
          flatRowKey = rowKey.join(String.fromCharCode(0));
          flatColKey = colKey.join(String.fromCharCode(0));


          if (colKey.length !== 0 && rowKey.length !== 0) {
            //sub total por fila
            //////////////////////////////
            //////////////////////////////
            //////////////////////////////
            if (!this.colSubTotals[flatRowKey]) {
              this.colSubTotals[flatRowKey] = {};
            }
            if (!this.colSubTotals[flatRowKey][flatColKey]) {
              this.colSubTotals[flatRowKey][flatColKey] = this.aggregator.map(aggregator => {
                return aggregator(
                  this,
                  rowKey,
                  colKey
                )
              });
            }

            this.colSubTotals[flatRowKey][flatColKey].forEach(i => {
              i.push(record);
            });

          }
          if (colKey.length !== 0) {
            if (!this.colTotals[flatColKey]) {
              // this.rowKeys.push(rowKey);
              this.colTotals[flatColKey] = this.aggregator.map(aggregator => {
                return aggregator(this, rowKey, []);
              });
            }

            this.colTotals[flatColKey].forEach((i) => {
              i.push(record)
            });
          }

        }



      }




    }


  }
  processRecord(record) {
    // debugger
    // this code is called in a tight loop
    const colKey = [];
    const rowKey = [];
    for (const x of Array.from(this.props.cols)) {
      colKey.push(x in record ? record[x] : 'null');
    }
    for (const x of Array.from(this.props.rows)) {
      rowKey.push(x in record ? record[x] : 'null');
    }
    const flatRowKey = rowKey.join(String.fromCharCode(0));
    const flatColKey = colKey.join(String.fromCharCode(0));

    this.allTotal.forEach(i => {
      i.push(record);
    });
    // debugger
    if (rowKey.length !== 0) {
      if (!this.rowTotals[flatRowKey]) {
        this.rowKeys.push(rowKey);


        this.rowTotals[flatRowKey] = this.aggregator.map(aggregator => {
          return aggregator(this, rowKey, []);
        });
      }

      this.rowTotals[flatRowKey].forEach((i) => {
        i.push(record)
      });
    }

    if (colKey.length !== 0) {
      // debugger
      if (!this.colTotals[flatColKey]) {
        this.colKeys.push(colKey);
        // this.colTotals[flatColKey] = this.aggregator(this, [], colKey);
        this.colTotals[flatColKey] = this.aggregator.map(aggregator => {
          return aggregator(this, [], colKey);
        });
      }
      this.colTotals[flatColKey].forEach((i) => {
        i.push(record)
      });
    }

    if (colKey.length !== 0 && rowKey.length !== 0) {
      if (!this.tree[flatRowKey]) {
        this.tree[flatRowKey] = {};
      }
      if (!this.tree[flatRowKey][flatColKey]) {
        this.tree[flatRowKey][flatColKey] = this.aggregator.map(aggregator => {
          return aggregator(
            this,
            rowKey,
            colKey
          )
        });
      }

      this.tree[flatRowKey][flatColKey].forEach(i => {
        i.push(record);
      });
    }
  }

  getSubtotal(rowKey, colKey) {
    let agg;
    const flatRowKey = rowKey.join(String.fromCharCode(0));
    const flatColKey = colKey.join(String.fromCharCode(0));
    // if (rowKey.length === 0 && colKey.length === 0) {
    //   agg = this.allTotal;
    // } else if (rowKey.length === 0) {
    //   agg = this.colTotals[flatColKey];
    // } else if (colKey.length === 0) {
    //   agg = this.rowTotals[flatRowKey];
    // } else {
    if (this.rowSubTotals[flatRowKey]) {
      agg = this.rowSubTotals[flatRowKey][flatColKey];
    } else if (this.colSubTotals[flatRowKey]) {
      agg = this.colSubTotals[flatRowKey][flatColKey];
    }
    // }
    return (
      agg ||

      this.aggregator.map(aggregator => {
        return {
          value() {
            return null;
          },
          format() {
            return '';
          },
        }
      })
    );
  }

  getAggregator(rowKey, colKey) {
    let agg;
    const flatRowKey = rowKey.join(String.fromCharCode(0));
    const flatColKey = colKey.join(String.fromCharCode(0));
    // console.log(flatRowKey, flatColKey)
    // if(rowKey.type === "subtotal"){

    // }
    if (rowKey.length === 0 && colKey.length === 0) {
      agg = this.allTotal;
    } else if (rowKey.length === 0) {
      agg = this.colTotals[flatColKey];
    } else if (colKey.length === 0) {
      agg = this.rowTotals[flatRowKey];
    } else if (this.tree[flatRowKey]) {
      agg = this.tree[flatRowKey][flatColKey];
    }
    return (
      agg ||

      this.aggregator.map(aggregator => {
        return {
          value() {
            return null;
          },
          format() {
            return '';
          },
        }
      })
    );
  }
}

// can handle arrays or jQuery selections of tables
PivotData.forEachRecord = function (input, derivedAttributes, f) {
  let addRecord, record;
  if (Object.getOwnPropertyNames(derivedAttributes).length === 0) {
    addRecord = f;
  } else {
    addRecord = function (record) {
      for (const k in derivedAttributes) {
        const derived = derivedAttributes[k](record);
        if (derived !== null) {
          record[k] = derived;
        }
      }
      return f(record);
    };
  }

  // if it's a function, have it call us back
  if (typeof input === 'function') {
    return input(addRecord);
  } else if (Array.isArray(input)) {
    if (Array.isArray(input[0])) {
      // array of arrays
      return (() => {
        const result = [];
        for (const i of Object.keys(input || {})) {
          const compactRecord = input[i];
          if (i > 0) {
            record = {};
            for (const j of Object.keys(input[0] || {})) {
              const k = input[0][j];
              record[k] = compactRecord[j];
            }
            result.push(addRecord(record));
          }
        }
        return result;
      })();
    }

    // array of objects
    return (() => {
      const result1 = [];
      for (record of Array.from(input)) {
        result1.push(addRecord(record));
      }
      return result1;
    })();
  }
  throw new Error('unknown input format');
};

PivotData.defaultProps = {
  aggregators: aggregators,
  cols: [],
  rows: [],
  vals: [],
  aggregatorName: 'Count',
  sorters: {},
  valueFilter: {},
  rowOrder: 'key_a_to_z',
  colOrder: 'key_a_to_z',
  derivedAttributes: {},
  subTotalCols: false,
  subTotalRows: false,
  collapseColKeys: [],
  collapseRowKeys: []
};

PivotData.propTypes = {
  data: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.func]).isRequired,
  aggregatorName: PropTypes.string,
  cols: PropTypes.arrayOf(PropTypes.string),
  rows: PropTypes.arrayOf(PropTypes.string),
  vals: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.func, PropTypes.string]),
  // vals: PropTypes.arrayOf([PropTypes.string]),
  valueFilter: PropTypes.objectOf(PropTypes.objectOf(PropTypes.bool)),
  sorters: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.objectOf(PropTypes.func),
  ]),
  derivedAttributes: PropTypes.objectOf(PropTypes.func),
  rowOrder: PropTypes.oneOf(['key_a_to_z', 'value_a_to_z', 'value_z_to_a']),
  colOrder: PropTypes.oneOf(['key_a_to_z', 'value_a_to_z', 'value_z_to_a']),
  subTotalCols: PropTypes.bool,
  subTotalRows: PropTypes.bool,
  collapseColKeys: PropTypes.array,
  collapseRowKeys: PropTypes.array

};


export {
  aggregatorTemplates,
  aggregators,
  // derivers,
  // locales,
  naturalSort,
  // numberFormat,
  getSort,
  // sortAs,
  PivotData,
  spanSize,
  // spanSubTotal,
  redColorScaleGenerator,
  // spanSubTotalDetect
};
