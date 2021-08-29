
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS201: Simplify complex destructure assignments
 * DS203: Remove `|| {}` from converted for-own loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

import { groups } from "d3";


const createReduceGroup = function (dataKey, colPos, type) {
    let group = [];
    Object.defineProperty(group, 'type', {
        value: type,
        writable: false,
    });
    let keys = [];
    let subtotalPos = 0;
    dataKey.forEach((item, idx) => {
        if (colPos == idx) {
            group.push({
                type: type,
                value: item
            });
            keys.push(item);
            subtotalPos = idx;
        } else if (idx <= colPos) {
            group.push(item);
            keys.push(item);
        }
    });
    // newList.push(subTotal)

    Object.defineProperty(group, 'position', {
        value: subtotalPos,
        writable: false,
    });

    Object.defineProperty(group, 'attrKeys', {
        value: keys,
        writable: false,
    });

    return group;

}
const addSubTotal = function (dataKeys, colPos = 0, maxColPos = 2, collapseKeys = []) {
    let curRow = 0;
    let newList = [];
    while (curRow < dataKeys.length) {
        let dataKey = dataKeys[curRow];
        // console.log(dataKey)
        let keyStr = dataKey.slice(0, colPos + 1).join(String.fromCharCode(0));



        let endPos = spanSize(dataKeys, curRow, colPos, 1);
        let group = dataKeys.slice(curRow, curRow + endPos);
        // console.log(group)
        // if (group.length > 1 && dataKey[colPos] == "Diesel") {
        if (collapseKeys.includes(keyStr)) {
            let reduceGroup = createReduceGroup(dataKey, colPos, "collapse");
            newList.push(reduceGroup)
        } else if (colPos <= maxColPos) {
            let list = addSubTotal(group, colPos + 1, maxColPos);
            newList.push(...list);
            let reduceGroup = createReduceGroup(dataKey, colPos, "subtotal");
            newList.push(reduceGroup)
        } else {

            newList.push(...group);
        }


        if (endPos == -1) {
            curRow++;
        } else {
            curRow = curRow + endPos;
        }
    }

    return newList;
}

const spanSize = function (arr, row, col, valuesLength,) {

    if (row !== 0) {
        let colPos, asc, maxColPos;
        let noDraw = true;
        for (
            colPos = 0, maxColPos = col, asc = maxColPos >= 0;
            asc ? colPos <= maxColPos : colPos >= maxColPos;
            asc ? colPos++ : colPos--
        ) {
            if (arr[row - 1][colPos] !== arr[row][colPos]) {
                noDraw = false;
            }
        }
        if (noDraw) {
            return -1;
        }
    }
    let len = 0, nextRow;
    while ((nextRow = row + len) < arr.length) {
        let colPos, maxColPos, ascMode;
        let stop = false;
        for (
            colPos = 0, maxColPos = col, ascMode = maxColPos >= 0;
            ascMode ? colPos <= maxColPos : colPos >= maxColPos;
            ascMode ? colPos++ : colPos--
        ) {
            let val1 = arr[row][colPos];
            let val2 = arr[nextRow][colPos];

            if (val1 !== val2) {
                stop = true;
            }
        }
        if (stop) {
            break;
        }
        len++;
    }

    // console.log(subItems)
    let totalLen = len * valuesLength;

    // if (subTotal) {
    //     let list = arr.slice(row, len).map(i => {
    //         return i.slice(col + 1, i.length)
    //     }).filter(i => i.length > 0);
    //     if (list.length > 0) {
    //         list = list.map((e, rowIdx) => {
    //             return spanSize(list, rowIdx, 0, 1, subTotal, true);
    //         });
    //         list.forEach(element => {
    //             totalLen += element;
    //         });
    //     }

    // }
    return totalLen;
};


function redColorScaleGenerator(values) {
    const min = Math.min.apply(Math, values);
    const max = Math.max.apply(Math, values);
    return x => {
        // eslint-disable-next-line no-magic-numbers
        const nonRed = 255 - Math.round((255 * (x - min)) / (max - min));
        return { backgroundColor: `rgb(255,${nonRed},${nonRed})` };
    };
}


export {
    spanSize,
    redColorScaleGenerator,
    // spanSubTotal,
    // spanSubTotalDetect,
    addSubTotal
}