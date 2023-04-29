import * as $ from 'jquery';
import config from '../config';
import { notify } from 'src/components_v2/common/Notification';
import { NotificationMessage } from 'src/DataContracts/NotificationMessage';
import { convertJsonToFormData } from 'src/helpers/form';
import { apiClient } from 'src/ApiService';
export class Utils {
    static filterNumber(num) {
        // filter not digit or dot
        num = num.replace(/[^\d\.]/g, '');
        // must start with digit not dot
        num = num.replace(/^\./g, '');
        // max one 0 at begining
        num = num.replace(/^0{2,}/, '0');
        // start with 0 must follow with decimal
        num = num.replace(/^0[\d]/, '0');
        // max one decimal allowed
        num = num.replace(/\.{2,}/g, '.');
        num = num.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
        return num;
    }

    static sortStaffName(a, b) {
        const result = sortStrings(a.firstName, b.firstName);

        return result !== 0 ? result : sortStrings(a.lastName, b.lastName);
    }

    static sortSector(a, b) {
        return sortStrings(a.name, b.name);
    }

    static sortLot(a, b) {
        return sortStrings(a.name, b.name);
    }

    static sortOrchard(a, b) {
        return sortStrings(a.name, b.name);
    }

    static sortBlock(a, b) {
        return sortStrings(a.name, b.name);
    }

    static sortBlockByCode(a, b) {
        return sortStrings(a.code, b.code);
    }

    static sortVariety(a, b) {
        return sortStrings(a.name, b.name);
    }

    static sortDefects(a, b) {
        return sortStrings(a.name, b.name);
    }

    static sortJob(a, b) {
        return sortStrings(a.name, b.name);
    }

    static sortArea(a, b) {
        return sortStrings(a.code, b.code);
    }

    static sortRow(a, b) {
        return a.number - b.number;
    }

    static sortTaskTypes(a, b) {
        return sortStrings(a.code, b.code);
    }

    static sortPlainString(a, b) {
        return sortStrings(a, b);
    }

    static sortPlainNumbers(a, b) {
        return sortNumbers(a, b);
    }

    static sortCaseInsensitive(a, b) {
        return a.localeCompare(b, 'en', { sensitivity: 'base' });
    }

    static formatNumber(prefix, number, decimalDigitNumber = 2, suffix = '') {
        if (number == null || number === 0) return '';

        return Number.isInteger(Number(number))
            ? `${prefix}${number}${suffix}`
            : `${prefix}${Number(number).toFixed(decimalDigitNumber)}${suffix}`;
    }

    static moveItem(arr, old_index, new_index) {
        while (old_index < 0) {
            old_index += arr.length;
        }
        while (new_index < 0) {
            new_index += arr.length;
        }
        if (new_index >= arr.length) {
            var k = new_index - arr.length;
            while (k-- + 1) {
                arr.push(undefined);
            }
        }
        arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
        return arr;
    }

    static downloadExport(url, headers, filters) {
        $('#block-ui-container').css('visibility', 'visible');

        const XHR = new XMLHttpRequest();
        const FD = new FormData();

        // Add data into FormData obj
        FD.append('paramsJson', JSON.stringify(filters));

        XHR.responseType = 'blob';

        // callback
        XHR.addEventListener('load', event => {
            if (event.target.status === 200) {
                const blob = event.target.response;
                var contentDispo = XHR.getResponseHeader('Content-Disposition');
                var fileName = contentDispo
                    ? contentDispo
                          .match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)[1]
                          .replace('"', '')
                          .replace('"', '')
                    : '';
                saveBlob(blob, fileName);
            } else if (event.target.status === 500) {
                notify({ message: NotificationMessage.DownloadFailed, type: 'error' });
            }

            $('#block-ui-container').css('visibility', 'hidden');
        });

        // This one seems to be called only for network down or invalid URL error types. Not for a 500
        XHR.addEventListener('error', event => {
            $('#block-ui-container').css('visibility', 'hidden');
            notify({ message: NotificationMessage.DownloadFailed, type: 'error' });
        });

        // set url, method
        XHR.open('POST', url);
        XHR.setRequestHeader('Authorization', headers['Authorization']);

        XHR.send(FD);

        const saveBlob = (blob, fileName) => {
            var a = document.createElement('a');
            a.href = window.URL.createObjectURL(blob);
            a.download = fileName;
            a.dispatchEvent(new MouseEvent('click'));
        };
    }

    static getHeaders = () => {
        const token = window.localStorage.getItem('token');

        if (!token) {
            return null;
        }

        const headers = {
            Authorization: `Bearer ${token}`,
        };

        return headers;
    };

    static fetchPayroll = () => dispatch => {
        const url = 'api/metadata/payroll';
        const method = 'GET';
        const data = {};
        const success = response => {
            dispatch({
                type: 'FETCH_PAYROLL_SETTINGS',
                payload: response || [],
            });
            return response;
        };
        const fail = error => {
            $('#block-ui-container').css('visibility', 'hidden');

            var status = error.status ? 'Error ' + error.status + ': ' + error.statusText : error.toString();
            notify({ message: status, type: 'error' });
        };

        Utils.handleAjaxRequest(url, method, Utils.getHeaders, data, success, fail, false, false);
    };

    static fetchHarvestExportSettings = () => dispatch => {
        const url = 'api/metadata/harvest-export-settings';
        const method = 'GET';
        const data = {};
        const success = response => {
            dispatch({
                type: 'FETCH_EXPORT_SETTINGS',
                payload: response || [],
            });
            return response;
        };
        const fail = error => {
            $('#block-ui-container').css('visibility', 'hidden');

            var status = error.status ? 'Error ' + error.status + ': ' + error.statusText : error.toString();
            notify({ message: status, type: 'error' });
        };

        Utils.handleAjaxRequest(url, method, Utils.getHeaders, data, success, fail, false, false);
    };

    static getUserTimeZone = () => {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    };

    static handleAjaxRequest(url, method, getHeaders, data, success, fail, type, showToast) {
        apiClient
            .request({
                url,
                method,
                data: typeof data === 'object' ? convertJsonToFormData(data) : JSON.parse(data),
            })
            .then(response => {
                success(response.data);
                if (showToast) {
                    notify({ message: NotificationMessage.Success });
                }
                $('#block-ui-container').css('visibility', 'hidden');
                return response.data;
            })
            .catch(error => {
                $('#block-ui-container').css('visibility', 'hidden');
                fail(error.response);
            });
    }
}

function sortStrings(a, b) {
    try {
        if (a.toLowerCase() > b.toLowerCase()) {
            return 1;
        }
        if (a.toLowerCase() < b.toLowerCase()) {
            return -1;
        }
        return 0;
    } catch (e) {
        console.log('Error on sortStrings', e);
    }
}

function sortNumbers(a, b) {
    if (a > b) {
        return 1;
    }
    if (a < b) {
        return -1;
    }

    return 0;
}
