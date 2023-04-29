import moment from 'moment-timezone';
import { Tooltip } from 'src/components_v2/common/MUI';
import './Payroll-table-column.css';
import { Utils } from './Utils';

const PAYROLL_COLUMNS = [
    {
        title: 'Employee ID',
        field: 'staffID',
        width: 130,
        customSort: (a, b) => compareByField(a, b, 'staffID'),
        customFilterAndSearch: (term, rowData) =>
            rowData.staffID != null ? rowData.staffID.toUpperCase().indexOf(term.toUpperCase()) != -1 : false,
        render: rowData => {
            return <span className="custom-payroll-table-column-span">{rowData.staffID}</span>;
        },
    },
    {
        title: 'Last Name',
        field: 'lastName',
        width: 120,
        customSort: (a, b) => compareByField(a, b, 'lastName'),
        render: rowData => {
            return <span className="custom-payroll-table-column-span">{rowData.lastName}</span>;
        },
    },
    {
        title: 'First Name',
        field: 'firstName',
        width: 120,
        customSort: (a, b) => compareByField(a, b, 'firstName'),
        render: rowData => {
            return <span className="custom-payroll-table-column-span">{rowData.firstName}</span>;
        },
    },
    {
        title: 'Date',
        field: 'date',
        type: 'date',
        width: 80,
        sorting: false,
        customFilterAndSearch: (term, rowData) => {
            const isSubTotal = rowData.lineType === 'dailyTotal';
            const isTotal = rowData.date == null;
            return getDate(rowData, isTotal, isSubTotal).toUpperCase().indexOf(term.toUpperCase()) != -1;
        },
        render: rowData => {
            const isSubTotal = rowData.lineType === 'dailyTotal';
            const isTotal = rowData.date == null;
            return (
                <span className="custom-payroll-table-column-span" style={{ fontWeight: isTotal ? 600 : 400 }}>
                    {getDate(rowData, isTotal, isSubTotal)}
                </span>
            );
        },
    },
    {
        title: 'Activity',
        field: 'activity',
        width: 120,
        sorting: false,
        render: rowData => {
            return <span className="custom-payroll-table-column-span">{rowData.activity}</span>;
        },
    },
    {
        title: 'Supervisor',
        field: 'supervisor',
        width: 120,
        sorting: false,
        customFilterAndSearch: (term, rowData) => {
            const supervisorName = getSupervisorName(rowData);
            return supervisorName != null ? supervisorName.toUpperCase().indexOf(term.toUpperCase()) != -1 : false;
        },
        render: rowData => <span className="custom-payroll-table-column-span">{getSupervisorName(rowData)}</span>,
    },
    {
        title: 'Orchard',
        field: 'orchard',
        width: 100,
        sorting: false,
        customFilterAndSearch: (term, rowData) => {
            const orchard = getOrchard(rowData);
            return orchard != null ? orchard.toUpperCase().indexOf(term.toUpperCase()) != -1 : false;
        },
        render: rowData => <span className="custom-payroll-table-column-span">{getOrchard(rowData)}</span>,
    },
    {
        title: 'Block',
        field: 'block',
        width: 100,
        sorting: false,
        render: rowData => {
            return <span className="custom-payroll-table-column-span">{rowData.block}</span>;
        },
    },
    {
        title: 'Sub Block',
        field: 'area',
        width: 100,
        sorting: false,
        render: rowData => {
            return <span className="custom-payroll-table-column-span">{rowData.area}</span>;
        },
    },
    {
        title: 'Variety',
        field: 'variety',
        width: 100,
        sorting: false,
        render: rowData => {
            return <span className="custom-payroll-table-column-span">{rowData.variety}</span>;
        },
    },
    {
        title: 'Volume',
        field: 'volume',
        width: 100,
        customSort: (a, b) => compareByJob(a, b),
        customFilterAndSearch: (term, rowData) => {
            const volume = getVolumeByJob(rowData);
            return volume != null ? volume.toUpperCase().indexOf(term.toUpperCase()) != -1 : false;
        },
        render: rowData => {
            const volume = getVolumeByJob(rowData);
            return volume != null ? <span className="custom-payroll-table-column-span">{volume}</span> : null;
        },
    },
    {
        title: 'Rates',
        field: 'rates',
        width: 80,
        customSort: (a, b) => compareByRate(a, b),
        customFilterAndSearch: (term, rowData) => {
            const rates = getRates(rowData);
            return rates != null ? rates.toUpperCase().indexOf(term.toUpperCase()) != -1 : false;
        },
        render: rowData => {
            const rates = getRates(rowData);
            return rates != null ? <span className="custom-payroll-table-column-span">{rates}</span> : null;
        },
    },
    {
        title: 'Hours',
        field: 'hours',
        width: 70,
        customSort: (a, b) => compareByTotalField(a, b, 'hours'),
        customFilterAndSearch: (term, rowData) => {
            const hours = getHours(rowData);
            return hours != null && !Number.isNaN(term) ? hours == term : false;
        },
        render: rowData => <span className="custom-payroll-table-column-span">{getHours(rowData)}</span>,
    },
    {
        title: 'Av. Hourly Rate',
        field: 'contractHourlyRate',
        width: 96,
        customSort: (a, b) => compareByTotalField(a, b, 'contractHourlyRate'),
        customFilterAndSearch: (term, rowData) => {
            const hourlyRates = getContractHourlyRate(rowData);
            return hourlyRates != null ? hourlyRates.toUpperCase().indexOf(term.toUpperCase()) != -1 : false;
        },
        render: rowData => <span className="custom-payroll-table-column-span">{getContractHourlyRate(rowData)}</span>,
    },
    {
        title: 'Start',
        field: 'start',
        width: 80,
        sorting: false,
        customFilterAndSearch: (term, rowData) => {
            if (rowData.lineType === 'overlap' && (term === 'overlap' || term === 'overlaps')) return true;
            else {
                const startTime = getStartTime(rowData);
                return startTime != null ? startTime.toUpperCase().indexOf(term.toUpperCase()) != -1 : false;
            }
        },
        render: rowData => {
            return <span className="custom-payroll-table-column-span">{getTimeData(rowData, getStartTime)}</span>;
        },
    },
    {
        title: 'End',
        field: 'end',
        width: 80,
        sorting: false,
        customFilterAndSearch: (term, rowData) => {
            if (rowData.lineType === 'overlap' && (term === 'overlap' || term === 'overlaps')) return true;
            else {
                const endTime = getEndTime(rowData);
                return endTime != null ? endTime.toUpperCase().indexOf(term.toUpperCase()) != -1 : false;
            }
        },
        render: rowData => {
            if (rowData.lineType === 'inProgress' || (rowData.end == null && rowData.lineType === 'overlap')) {
                return (
                    <span className="custom-payroll-table-column-span" style={{ color: '#FC7D58' }}>
                        {getEndTime(rowData)}
                    </span>
                );
            } else {
                return <span className="custom-payroll-table-column-span">{getTimeData(rowData, getEndTime)}</span>;
            }
        },
    },
    {
        title: 'Comment',
        field: 'comment',
        width: 160,
        sorting: false,
        render: rowData => {
            return <span className="custom-payroll-table-column-span">{rowData.comment}</span>;
        },
    },
    {
        title: 'Wages Pay',
        field: 'wagesPay',
        width: 90,
        customSort: (a, b) => compareByTotalField(a, b, 'wagesPay'),
        customFilterAndSearch: (term, rowData) => {
            const wagesPay = getWagesPay(rowData);
            return wagesPay != null ? wagesPay.toUpperCase().indexOf(term.toUpperCase()) != -1 : false;
        },
        render: rowData => <span className="custom-payroll-table-column-span">{getWagesPay(rowData)}</span>,
    },
    {
        title: 'Breaks',
        field: 'numberOfBreaks',
        width: 70,
        render: rowData => {
            return <span className="custom-payroll-table-column-span">{rowData.numberOfBreaks}</span>;
        },
    },
    {
        title: 'Break Length',
        field: 'breakLength',
        sorting: false,
        width: 60,
        customSort: (a, b) => compareByTotalField(a, b, 'breakLength'),
        render: rowData => {
            return <span className="custom-payroll-table-column-span">{rowData.breakLength}</span>;
        },
    },
    {
        title: 'Contract Pay',
        field: 'grossContractPay',
        width: 90,
        customSort: (a, b) => compareByTotalField(a, b, 'grossContractPay'),
        customFilterAndSearch: (term, rowData) => {
            const contractPay = getContractPay(rowData);
            return contractPay != null ? contractPay.toUpperCase().indexOf(term.toUpperCase()) != -1 : false;
        },
        render: rowData => <span className="custom-payroll-table-column-span">{getContractPay(rowData)}</span>,
    },
    {
        title: 'Paid Breaks',
        field: 'breaksPay',
        width: 90,
        customSort: (a, b) => compareByTotalField(a, b, 'breaksPay'),
        customFilterAndSearch: (term, rowData) => {
            const breaksPay = getBreaksPay(rowData);
            return breaksPay != null ? breaksPay.toUpperCase().indexOf(term.toUpperCase()) != -1 : false;
        },
        render: rowData => <span className="custom-payroll-table-column-span">{getBreaksPay(rowData)}</span>,
    },
    {
        title: 'Contract & Breaks',
        field: 'contractPayWithBreaks',
        width: 90,
        customSort: (a, b) => compareByTotalField(a, b, 'contractPayWithBreaks'),
        customFilterAndSearch: (term, rowData) => {
            const contractPayWithBreaks = getContractPayWithBreaks(rowData);
            return contractPayWithBreaks != null
                ? contractPayWithBreaks.toUpperCase().indexOf(term.toUpperCase()) != -1
                : false;
        },
        render: rowData => (
            <span className="custom-payroll-table-column-span">{getContractPayWithBreaks(rowData)}</span>
        ),
    },
    {
        title: 'Top Up',
        field: 'topUp',
        width: 90,
        customSort: (a, b) => compareByTotalField(a, b, 'topUp'),
        customFilterAndSearch: (term, rowData) => {
            const topUp = getTopUp(rowData);
            return topUp != null ? topUp.toUpperCase().indexOf(term.toUpperCase()) != -1 : false;
        },
        render: rowData => <span className="custom-payroll-table-column-span">{getTopUp(rowData)}</span>,
    },
    {
        title: 'Total Pay',
        field: 'totalPay',
        width: 90,
        customSort: (a, b) => compareByTotalField(a, b, 'totalPay'),
        customFilterAndSearch: (term, rowData) => {
            const totalPay = getTotalPay(rowData);
            return totalPay != null ? totalPay.toUpperCase().indexOf(term.toUpperCase()) != -1 : false;
        },
        render: rowData => <span className="custom-payroll-table-column-span">{getTotalPay(rowData)}</span>,
    },
];

export default PAYROLL_COLUMNS;

function getDate(rowData, isTotal, isSubTotal) {
    let txt = isSubTotal ? 'Sub Totals' : 'Totals';
    return rowData.lastName == null && rowData.firstName == null
        ? 'GRAND TOTAL'
        : isTotal
        ? txt
        : moment(rowData.date).format('DD MMM');
}

function getSupervisorName(row) {
    if (row != null && row.firstName != null && row.lastName != null && row.supervisor != null) {
        return row.firstName + ' ' + row.lastName.toUpperCase() != row.supervisor ? row.supervisor : '';
    }

    return '';
}

function getOrchard(rowData) {
    return rowData.name == null || rowData.name === rowData.site ? rowData.site : `${rowData.name} (${rowData.site})`;
}

function getVolumeByJob(rowData) {
    if (rowData.volumesByJobs != null) {
        const items = Object.entries(rowData.volumesByJobs);
        const results = [];
        if (rowData.lineType === 'total' || rowData.lineType === 'grandTotal') {
            // Multiple jobs with volume
            if (items.length > 1) {
                for (let [key, value] of items) {
                    // TODO: put a space between key and value when the rows take more than just 100% of the screen
                    results.push(`${key}: ${Utils.formatNumber('', value, 2)}`);
                }
                return results.join('\n');
            } else if (items.length === 1) {
                return Utils.formatNumber('', items[0][1], 2);
            } else {
                return null;
            }
        } else {
            return Utils.formatNumber('', items[0][1], 2);
        }
    } else {
        return null;
    }
}

function getRates(rowData) {
    if (rowData.volumesByRates != null) {
        const items = Object.entries(rowData.volumesByRates);
        const results = [];
        const hasMultipleRates = items.length > 1;
        for (const [rate, volume] of items) {
            if (!hasMultipleRates) {
                return Utils.formatNumber('$', rate, 2);
            } else {
                results.push(Utils.formatNumber(`${Utils.formatNumber('', volume, 2, '@$')}`, rate, 2));
            }
        }
        return results.join(' ');
    } else {
        return null;
    }
}

function getHours(rowData) {
    return Math.round((rowData.hours + Number.EPSILON) * 100) / 100;
}

function getContractHourlyRate(rowData) {
    return rowData.contractHourlyRate != null ? '$' + rowData.contractHourlyRate.toFixed(2) : '';
}

function getStartTime(rowData) {
    return rowData.start != null ? moment(rowData.start * 1000).format(moment.localeData().longDateFormat('LT')) : '';
}

function getEndTime(rowData) {
    if (rowData.lineType === 'inProgress' || (rowData.end == null && rowData.lineType === 'overlap')) {
        return 'In progress';
    } else {
        return rowData.end != null ? moment(rowData.end * 1000).format(moment.localeData().longDateFormat('LT')) : '';
    }
}

function getWagesPay(rowData) {
    return rowData.wagesPay == null || rowData.wagesPay == 0 ? '' : '$' + rowData.wagesPay.toFixed(2);
}

function getContractPay(rowData) {
    return rowData.grossContractPay == null || rowData.grossContractPay == 0
        ? ''
        : '$' + rowData.grossContractPay.toFixed(2);
}

function getBreaksPay(rowData) {
    return rowData.breaksPay == null ? '' : '$' + rowData.breaksPay.toFixed(2);
}

function getContractPayWithBreaks(rowData) {
    return rowData.contractPayWithBreaks == null ? '' : '$' + rowData.contractPayWithBreaks.toFixed(2);
}

function getTopUp(rowData) {
    return rowData.topUp == null ? '' : '$' + rowData.topUp.toFixed(2);
}

function getTotalPay(rowData) {
    return rowData.totalPay == null ? '' : '$' + rowData.totalPay.toFixed(2);
}

function getTimeData(rowData, functionToCall) {
    if (rowData.lineType === 'overlap') {
        return (
            <Tooltip title="Overlap">
                <span>{functionToCall(rowData)}</span>
            </Tooltip>
        );
    } else {
        return <span>{functionToCall(rowData)}</span>;
    }
}

// Sorting functions
// Because we cannot now with the current version of the library if it's ascending or descending order, we cannot show null value at the bottom
// for both of sortings so we showing them last when sorting desc. When sorting asc, it is then shown first

function compareByField(a, b, field) {
    // full total fixed on top
    if (a.lineType === 'grandTotal' || b.lineType === 'grandTotal') {
        return 1;
    }

    if (a[field] < b[field]) {
        return -1;
    }
    if (a[field] > b[field]) {
        return 1;
    }
    return 0;
}

function compareByTotalField(a, b, field) {
    // full total fixed on top
    if (a.lineType === 'grandTotal' || b.lineType === 'grandTotal') {
        return 1;
    }

    // sort the total lines and keep the rest same order
    if (a.lineType === 'total' && b.lineType !== 'total') {
        return 1;
    } else if (b.lineType === 'total' && a.lineType !== 'total') {
        return -1;
    } else if (a.lineType === 'total' && b.lineType === 'total') {
        if (a[field] < b[field]) {
            return -1;
        }
        if (a[field] > b[field]) {
            return 1;
        }
    } else {
        return 0;
    }
}

// compare the sum of each row's rate
function compareByRate(a, b) {
    // full total fixed on top
    if (a.lineType === 'grandTotal' || b.lineType === 'grandTotal') {
        return 1;
    }

    // sort the total lines and keep the rest same order
    if (a.volumesByRates != null && b.volumesByRates == null) {
        return 1;
    } else if (a.volumesByRates == null && b.volumesByRates != null) {
        return -1;
    } else if (a.volumesByRates != null && b.volumesByRates != null) {
        const reducer = (accumulator, currentValue) => accumulator + parseFloat(currentValue);
        // sum all values
        const arrA = Object.keys(a.volumesByRates);
        const arrB = Object.keys(b.volumesByRates);
        const sumA = arrA.reduce(reducer, 0);
        const sumB = arrB.reduce(reducer, 0);
        if (sumA < sumB) {
            return -1;
        }
        if (sumA > sumB) {
            return 1;
        }
    } else {
        return 0;
    }
}

// compare the sum of each row's job quantity
function compareByJob(a, b) {
    // full total fixed on top
    if (a.lineType === 'grandTotal' || b.lineType === 'grandTotal') {
        return 1;
    }

    // sort the total lines and keep the rest same order
    if (a.volumesByJobs !== null && b.volumesByJobs === null) {
        return 1;
    } else if (a.volumesByJobs === null && b.volumesByJobs !== null) {
        return -1;
    } else if (a.volumesByJobs !== null && b.volumesByJobs !== null) {
        const reducer = (accumulator, currentValue) => accumulator + parseInt(currentValue, 10);

        // sum all values
        const arrA = Object.values(a.volumesByJobs);
        const arrB = Object.values(b.volumesByJobs);

        // display empty rows after rows with value
        if (arrA.length === 0) {
            return 1;
        }
        if (arrB.length === 0) {
            return -1;
        }

        // sum up values
        const sumA = arrA.reduce(reducer, 0);
        const sumB = arrB.reduce(reducer, 0);
        if (sumA < sumB) {
            return -1;
        }
        if (sumA > sumB) {
            return 1;
        }
    } else {
        return 0;
    }
}

export function generateRowOfExportCSV(row, headerRow) {
    const customizedDate = row => {
        const isSubTotal = row.lineType === 'dailyTotal';
        const isTotal = row.date == null;
        return getDate(row, isTotal, isSubTotal);
    };

    const customizedSupervisor = row => getSupervisorName(row);
    const customizedOrchard = row => getOrchard(row);
    const customizedVolume = row => {
        const volume = getVolumeByJob(row);
        return volume != null ? volume.split('\n').join('; ') : null;
    };
    const customizedRates = row => {
        const rates = getRates(row);
        return rates != null ? rates : null;
    };
    const customizedHours = row => getHours(row);
    const customizedHourlyRates = row => getContractHourlyRate(row);
    const customizedStartTime = row => getStartTime(row);
    const customizedEndTime = row => getEndTime(row);
    const customizedWagesPay = row => getWagesPay(row);
    const customizedContractPay = row => getContractPay(row);
    const customizedBreaksPay = row => getBreaksPay(row);
    const customizedContractPayWithBreaks = row => getContractPayWithBreaks(row);
    const customizedTopUp = row => getTopUp(row);
    const customizedTotalPay = row => getTotalPay(row);

    const keyList = {
        'Employee ID': 'staffID',
        'Last Name': 'lastName',
        'First Name': 'firstName',
        Date: 'date',
        Activity: 'activity',
        Supervisor: 'supervisor',
        Orchard: 'orchard',
        Block: 'block',
        'Sub Block': 'area',
        Variety: 'variety',
        Volume: 'volume',
        Rates: 'rates',
        Hours: 'hours',
        'Av. Hourly Rate': 'contractHourlyRate',
        Start: 'start',
        End: 'end',
        Comment: 'comment',
        'Wages Pay': 'wagesPay',
        Breaks: 'numberOfBreaks',
        'Break Length': 'breakLength',
        'Contract Pay': 'grossContractPay',
        'Paid Breaks': 'breaksPay',
        'Contract & Breaks': 'contractPayWithBreaks',
        'Top Up': 'topUp',
        'Total Pay': 'totalPay',
    };

    let rowObject = {};
    headerRow.map(head => {
        if (keyList[head]) {
            const k = keyList[head];
            if (k === 'date') {
                rowObject[k] = customizedDate(row);
            } else if (k === 'supervisor') {
                rowObject[k] = customizedSupervisor(row);
            } else if (k === 'orchard') {
                rowObject[k] = customizedOrchard(row);
            } else if (k === 'volume') {
                rowObject[k] = customizedVolume(row);
            } else if (k === 'rates') {
                rowObject[k] = customizedRates(row);
            } else if (k === 'hours') {
                rowObject[k] = customizedHours(row);
            } else if (k === 'contractHourlyRate') {
                rowObject[k] = customizedHourlyRates(row);
            } else if (k === 'start') {
                rowObject[k] = customizedStartTime(row);
            } else if (k === 'end') {
                rowObject[k] = customizedEndTime(row);
            } else if (k === 'comment') {
                rowObject[k] = row[k] != null ? row[k].split('\n').join('; ').split(',').join(';') : null;
            } else if (k === 'wagesPay') {
                rowObject[k] = customizedWagesPay(row);
            } else if (k === 'grossContractPay') {
                rowObject[k] = customizedContractPay(row);
            } else if (k === 'breaksPay') {
                rowObject[k] = customizedBreaksPay(row);
            } else if (k === 'contractPayWithBreaks') {
                rowObject[k] = customizedContractPayWithBreaks(row);
            } else if (k === 'topUp') {
                rowObject[k] = customizedTopUp(row);
            } else if (k === 'totalPay') {
                rowObject[k] = customizedTotalPay(row);
            } else {
                rowObject[k] = row[k];
            }
        }
    });
    return rowObject;
}
