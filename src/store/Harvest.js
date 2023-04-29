import * as $ from 'jquery';
import * as Cookies from 'js-cookie';
import _ from 'lodash';
import { Utils } from '../store/Utils';
import { notify } from 'src/components_v2/common/Notification';
import { NotificationMessage } from 'src/DataContracts/NotificationMessage';
import config from '../config';

export const getHeaders = Utils.getHeaders;

export const actionCreators = {
    requestData: (results, self) => async (dispatch, getState) => {
        let headers = getHeaders();
        if (!headers) return;

        $('#block-ui-container').css('visibility', 'visible');

        const orchardFilter = await getState().picking.filter.orchardFilter;

        const siteObj =
            orchardFilter.length > 0
                ? await getState().picking.filter.orchardsAndBlocks.find(item => item.name === orchardFilter[0])
                : {};

        const url = 'api/harvest';
        const method = 'POST';
        const data = {
            StartDate: self.state.startDate.toDateString(),
            EndDate: self.state.endDate.toDateString(),
            SectorId:
                (await getState().picking.filter.sectorFilter.length) > 0
                    ? getState().picking.filter.sectorFilter[0]
                    : null,
            SiteId: siteObj.site ? siteObj.site : null,
            SiteName: orchardFilter.length > 0 ? orchardFilter[0] : null,
            BlockId:
                (await getState().picking.filter.blockFilter.length) > 0
                    ? getState().picking.filter.blockFilter[0]
                    : null,
            AreaId: $('#AreaId').length > 0 ? $('#AreaId').val() : null,
            Containers: $('#Containers').length > 0 ? $('#Containers').val() : null,
            PickerId: $('#PickerId').length > 0 ? $('#PickerId').val() : null,
            Variety: $('#Variety').length > 0 ? $('#Variety').val() : null,
            PickType: $('#PickType').length > 0 ? $('#PickType').val() : null,
            TeamLead: $('#TeamLead').length > 0 ? $('#TeamLead').val() : null,
        };
        const sucessFn = response => {
            if (response.code !== 0) throw response.message.content;
            dispatch({
                type: 'RECEIVE_HARVEST_DATA',
                harvestData: response.response.pickingData,
            });
            if (!self.props.metadata.loading && self.props.history.location.pathname === '/') {
                $('#block-ui-container').css('visibility', 'hidden');
            }
            if (results) {
                notify({ message: NotificationMessage.FilterApplied });
            }
        };
        const failFn = error => {
            if (error.status === 403) {
                Cookies.remove('LOGIN');
                self.props.history.push('/not-logged-in');
            } else {
                var status = error.status ? 'Error ' + error.status + ': ' + error.statusText : error.toString();
                notify({ message: status, type: 'error' });
            }
        };

        Utils.handleAjaxRequest(url, method, getHeaders, data, sucessFn, failFn, false, false);
    },
    clearData: () => (dispatch, getState) => {
        dispatch({
            type: 'RECEIVE_HARVEST_DATA',
            harvestData: unloadedState.pickingData,
        });
    },
    fetchDataByOrchard: () => dispatch => {
        // TODO: Remove this function once Havest page been developed
        $.ajax({
            url: 'http://localhost:3000/harvestbyorchard',
            method: 'GET',
        }).then(response => {
            dispatch({ type: 'TESTDATA_ORCHARD', payload: response });
        });
    },
    fetchDataByVariety: () => dispatch => {
        // TODO: Remove this function once Havest page been developed
        $.ajax({
            url: 'http://localhost:3000/harvestbyvariety',
            method: 'GET',
        }).then(response => {
            dispatch({ type: 'TESTDATA_VARIETY', payload: response });
        });
    },
    setGroupFlag: (pickerIndex, flag) => dispatch => {
        // TODO: Remove this function once Havest page been developed
        dispatch({
            type: 'SET_GROUP_FLAG',
            payload: { pickerIndex, flag },
        });
    },
    putDataListView: (rootId, timestamp, objKey, indexOfRow, self) => (dispatch, getState) => {
        // TODO: Remove this function once Havest page been developed
        const objName = 'testDataByOrchard';
        let fullData = getState().harvest[objName][rootId];
        fullData = Object.values(fullData)[0];
        const to = getState().harvest.saveStateOfListView.curr;
        fullData[objKey].rows[indexOfRow] = to;
        let obj = new Object();
        obj[timestamp] = fullData;

        $.ajax({
            url: `http://localhost:3000/harvestbyorchard/${rootId + 1}`,
            method: 'put',
            data: JSON.stringify(obj),
            contentType: 'application/json',
        })
            .done(response => {
                console.log('Update success');
                notify({ message: NotificationMessage.UpdateSucceed });
                const payload = { rootId, response };
                dispatch({ type: 'PUT_DATA_OF_LISTVIEW', payload: payload });
                dispatch({
                    type: 'EDIT_ROW_LIST_VIEW',
                    payload: { rootId: null, objKey: null, indexOfRow: null },
                });
            })
            .catch(err => notify({ message: NotificationMessage.UpdateFailed, type: 'error' }));
    },
    putDataBin: (rootId, orchardIndex, varietyIndex, rowIndex) => (dispatch, getState) => {
        // TODO: Remove this function once Havest page been developed
        const { indexOfBin, indexOfBinOfRow } = getState().harvest.editRowOfBin;
        const to = getState().harvest.saveStateOfBin.curr;
        let fullData;
        let url;
        let obj = new Object();
        let timestamp;
        if (orchardIndex !== null) {
            timestamp = Object.keys(getState().harvest.testDataByOrchard[rootId])[0];
            url = `http://localhost:3000/harvestbyorchard/${rootId + 1}`;
            const objName = 'testDataByOrchard';
            fullData = getState().harvest[objName][rootId];
            fullData = Object.values(fullData)[0];
            Object.values(fullData)[orchardIndex].rows[rowIndex].binTallies[indexOfBin].picks[indexOfBinOfRow] = to;
        } else if (varietyIndex !== null) {
            timestamp = Object.keys(getState().harvest.testDataByVariety[rootId])[0];
            url = `http://localhost:3000/harvestbyvariety/${rootId + 1}`;

            console.log(rootId, varietyIndex, rowIndex);
            const objName = 'testDataByVariety';
            fullData = getState().harvest[objName][rootId];
            fullData = Object.values(fullData)[0];
            Object.values(fullData)[varietyIndex].picks[rowIndex].binTallies[indexOfBin].blocks[indexOfBinOfRow] = to;
        }
        obj[timestamp] = fullData;
        $.ajax({
            url: url,
            method: 'put',
            data: JSON.stringify(obj),
            contentType: 'application/json',
        })
            .done(response => {
                console.log('Update success');
                notify({ message: NotificationMessage.UpdateSucceed });
                const payload = { rootId, response };
                const type = varietyIndex !== null ? 'PUT_DATA_BY_VARIETY' : 'PUT_DATA_OF_LISTVIEW';
                dispatch({ type: type, payload: payload });
                dispatch({
                    type: 'EDIT_ROW_BIN',
                    payload: { indexOfBin: null, indexOfBinOfRow: null },
                });
            })
            .catch(err => notify({ message: NotificationMessage.UpdateFailed, type: 'error' }));
    },
    putDataPicker:
        (rootId, orchardIndex, varietyIndex, rowIndex, pickerIndex, bottomRowIndex) => (dispatch, getState) => {
            // TODO: Remove this function once Havest page been developed
            const objName = 'testDataByOrchard';
            let fullData = getState().harvest[objName][rootId];
            fullData = Object.values(fullData)[0];
            const to = getState().harvest.saveState.curr;
            console.log('to', to);
            if (orchardIndex !== null) {
                Object.values(Object.values(fullData)[orchardIndex].rows[rowIndex].pickersInfo[pickerIndex])[0][
                    bottomRowIndex
                ] = to;
            } else if (varietyIndex !== null) {
                Object.values(Object.values(fullData)[varietyIndex].rows[rowIndex].pickersInfo[pickerIndex])[0][
                    bottomRowIndex
                ] = to;
            }
            let obj = new Object();
            const timestamp = Object.keys(getState().harvest.testDataByOrchard[rootId])[0];
            obj[timestamp] = fullData;
            console.log(obj);
            $.ajax({
                url: `http://localhost:3000/harvestbyorchard/${rootId + 1}`,
                method: 'put',
                data: JSON.stringify(obj),
                contentType: 'application/json',
            })
                .done(response => {
                    console.log('Update success');
                    notify({ message: NotificationMessage.UpdateSucceed });
                    const payload = { rootId, response };
                    dispatch({ type: 'PUT_DATA_OF_LISTVIEW', payload: payload });
                    dispatch({
                        type: 'EDIT_ROW',
                        payload: { index: null, i: null },
                    });
                })
                .catch(err => notify({ message: NotificationMessage.UpdateFailed, type: 'error' }));
        },
    toGridOrchardView: () => dispatch =>
        dispatch({
            type: 'GRID_VIEW_ORCHARD',
        }),
    toGridVarietyView: () => dispatch =>
        dispatch({
            type: 'GRID_VIEW_VARIETY',
        }),
    toListView: () => dispatch =>
        dispatch({
            type: 'LIST_VIEW',
        }),
    toDetailView: (item, byOrchardFlag, rootId, orchardIndex, varietyIndex, rowIndex) => dispatch => {
        const payload = {
            ...item,
            byOrchardFlag,
            rootId,
            orchardIndex,
            varietyIndex,
            rowIndex,
        };
        dispatch({
            type: 'DETAIL_VIEW',
        });
        dispatch({
            type: 'DETAIL_PAYLOAD',
            payload: payload,
        });
    },
    toggleAccordionTable: (item, i) => dispatch => {
        const payload = { ...item, indexOfBin: i };
        dispatch({
            type: 'DETAIL_TOGGLE_ACCORDION_TABLE',
            payload: payload,
        });
    },
    handleRowCancelListView: () => dispatch => {
        dispatch({
            type: 'EDIT_ROW_LIST_VIEW',
            payload: { rootId: null, objKey: null, indexOfRow: null },
        });
    },
    handleEditRowListView: (rootId, objKey, indexOfRow, item) => dispatch => {
        const payload = { rootId, objKey, indexOfRow };
        dispatch({
            type: 'EDIT_ROW_LIST_VIEW',
            payload: payload,
        });

        const saveStateOfListView = {
            prev: item,
            curr: item,
        };
        dispatch({
            type: 'SAVE_STATE_LIST_VIEW',
            payload: saveStateOfListView,
        });
    },
    handleRowOnchangeListView: (key, value) => dispatch => {
        dispatch({
            type: 'SAVE_CURRENT_ROW_LIST_VIEW',
            payload: { key, value },
        });
    },
    handleRowCancelBin: () => dispatch => {
        dispatch({
            type: 'EDIT_ROW_BIN',
            payload: { indexOfBin: null, indexOfBinOfRow: null },
        });
    },
    handleEditRowBin: (indexOfBin, indexOfBinOfRow, item) => dispatch => {
        const payload = { indexOfBin, indexOfBinOfRow };
        console.log(payload);
        dispatch({
            type: 'EDIT_ROW_BIN',
            payload: payload,
        });
        const saveStateOfBin = {
            prev: item,
            curr: item,
        };
        dispatch({
            type: 'SAVE_STATE_BIN',
            payload: saveStateOfBin,
        });
    },
    handleRowOnchangeBin: (key, value) => dispatch => {
        dispatch({
            type: 'SAVE_CURRENT_ROW_BIN',
            payload: { key, value },
        });
    },
    handleRowCancel: () => dispatch => {
        dispatch({
            type: 'EDIT_ROW',
            payload: { index: null, i: null },
        });

        const saveState = {
            prev: null,
            curr: null,
        };
        dispatch({
            type: 'SAVE_STATE',
            payload: saveState,
        });
    },
    handleEditRow: (index, i, item) => dispatch => {
        const payload = { index, i };
        dispatch({
            type: 'EDIT_ROW',
            payload: payload,
        });

        const saveState = {
            prev: item,
            curr: item,
        };
        dispatch({
            type: 'SAVE_STATE',
            payload: saveState,
        });
    },
    handleRowOnchange: (key, value) => dispatch => {
        dispatch({
            type: 'SAVE_CURRENT_ROW',
            payload: { key, value },
        });
    },
    confirmModal: item => dispatch => {
        dispatch({
            type: 'CONFIRM_MODAL',
            payload: item,
        });
    },
    confirmModalOfBin: item => dispatch => {
        console.log('got it', item);
        dispatch({
            type: 'CONFIRM_MODAL_OF_BIN',
            payload: item,
        });
    },
    initSelectAll: iniArr => dispatch => {
        dispatch({
            type: 'INITIAL_SELECT_ALL',
            payload: iniArr,
        });
    },
    initCheckboxRef: iniRef => dispatch => {
        dispatch({
            type: 'INITIAL_CHECKBOX_REF',
            payload: iniRef,
        });
    },
    toggleSelectAll: index => (dispatch, getState) => {
        const list = getState().harvest.checkboxList.selectAll;
        const len = getState().harvest.checkboxList.checkboxRef[index].length;
        const flag = !list[index];
        const data = Array(len).fill(flag);
        dispatch({
            type: 'UPDATE_SELECT_ALL',
            payload: { flag, index },
        });
        dispatch({
            type: 'UPDATE_ALL_CHECKBOX',
            payload: { data, index },
        });
    },
    toggleCheckbox: (index, i) => (dispatch, getState) => {
        const arr = getState().harvest.checkboxList.checkboxRef[index];
        const val = !arr[i];
        let data = _.map(arr, _.clone);
        data[i] = val;

        dispatch({
            type: 'UPDATE_ALL_CHECKBOX',
            payload: { data, index },
        });

        const allVal = new Set(getState().harvest.checkboxList.checkboxRef[index]);
        if (allVal.size > 1) {
            const flag = false;
            dispatch({
                type: 'UPDATE_SELECT_ALL',
                payload: { flag, index },
            });
        } else if (allVal.size == 1 && allVal.has(true)) {
            const flag = true;
            dispatch({
                type: 'UPDATE_SELECT_ALL',
                payload: { flag, index },
            });
        }
    },
};

const unloadedState = {
    harvestData: {
        pickers: null,
        sites: null,
        blocks: null,
        variety: null,
        picks: null,
        daily: null,
    },
    testDataByOrchard: [],
    testDataByVariety: [],
    testDetailData: null,
    testDetailAccordionTable: null,
    editRowOfBin: { indexOfBin: null, indexOfBinOfRow: null },
    saveStateOfBin: {
        prev: null,
        curr: null,
    },
    editRowOfListView: { rootId: null, objKey: null, indexOfRow: null },
    saveStateOfListView: {
        prev: null,
        curr: null,
    },
    editRow: { index: null, i: null },
    saveState: {
        prev: null,
        curr: null,
    },
    checkboxList: {
        selectAll: [],
        checkboxRef: [],
    },
    groupFlag: {
        pickerIndex: 0,
        flag: false,
    },
    viewController: {
        gridView: true,
        listView: false,
        orchardActive: true,
        detailView: false,
    },
};

export const reducer = (state = unloadedState, action) => {
    switch (action.type) {
        case 'RECEIVE_HARVEST_DATA':
            return {
                ...state,
                harvestData: action.harvestData,
            };
        case 'TESTDATA_ORCHARD':
            return {
                ...state,
                testDataByOrchard: action.payload,
            };
        case 'TESTDATA_VARIETY':
            return {
                ...state,
                testDataByVariety: action.payload,
            };
        case 'GRID_VIEW_ORCHARD':
            return {
                ...state,
                viewController: {
                    gridView: true,
                    listView: false,
                    orchardActive: true,
                    detailView: false,
                },
            };
        case 'GRID_VIEW_VARIETY':
            return {
                ...state,
                viewController: {
                    gridView: true,
                    listView: false,
                    orchardActive: false,
                    detailView: false,
                },
            };
        case 'LIST_VIEW':
            return {
                ...state,
                viewController: {
                    gridView: false,
                    listView: true,
                    orchardActive: true,
                    detailView: false,
                },
            };
        case 'SET_GROUP_FLAG':
            return {
                ...state,
                groupFlag: action.payload,
            };
        case 'PUT_DATA_OF_LISTVIEW':
            return {
                ...state,
                testDataByOrchard: state.testDataByOrchard.map((item, index) =>
                    index === action.payload.rootId ? action.payload.response : item
                ),
            };
        case 'PUT_DATA_BY_VARIETY':
            return {
                ...state,
                testDataByVariety: state.testDataByVariety.map((item, index) =>
                    index === action.payload.rootId ? action.payload.response : item
                ),
            };
        case 'DETAIL_VIEW':
            return {
                ...state,
                viewController: {
                    gridView: false,
                    listView: false,
                    orchardActive: true,
                    detailView: true,
                },
            };
        case 'DETAIL_PAYLOAD':
            return {
                ...state,
                testDetailData: action.payload,
            };
        case 'DETAIL_TOGGLE_ACCORDION_TABLE':
            return {
                ...state,
                testDetailAccordionTable: action.payload,
            };
        case 'EDIT_ROW_LIST_VIEW':
            return {
                ...state,
                editRowOfListView: action.payload,
            };
        case 'EDIT_ROW_BIN':
            return {
                ...state,
                editRowOfBin: action.payload,
            };
        case 'SAVE_STATE_LIST_VIEW':
            return {
                ...state,
                saveStateOfListView: action.payload,
            };
        case 'SAVE_CURRENT_ROW_LIST_VIEW':
            return {
                ...state,
                saveStateOfListView: {
                    ...state.saveStateOfListView,
                    curr: {
                        ...state.saveStateOfListView.curr,
                        [action.payload.key]: action.payload.value,
                    },
                },
            };
        case 'SAVE_STATE_BIN':
            return {
                ...state,
                saveStateOfBin: action.payload,
            };
        case 'SAVE_CURRENT_ROW_BIN':
            return {
                ...state,
                saveStateOfBin: {
                    ...state.saveStateOfBin,
                    curr: {
                        ...state.saveStateOfBin.curr,
                        [action.payload.key]: action.payload.value,
                    },
                },
            };
        case 'EDIT_ROW':
            return {
                ...state,
                editRow: action.payload,
            };
        case 'SAVE_STATE':
            return {
                ...state,
                saveState: action.payload,
            };
        case 'SAVE_CURRENT_ROW':
            return {
                ...state,
                saveState: {
                    ...state.saveState,
                    curr: {
                        ...state.saveState.curr,
                        [action.payload.key]: action.payload.value,
                    },
                },
            };
        case 'INITIAL_SELECT_ALL':
            return {
                ...state,
                checkboxList: {
                    ...state.checkboxList,
                    selectAll: action.payload,
                },
            };
        case 'INITIAL_CHECKBOX_REF':
            return {
                ...state,
                checkboxList: {
                    ...state.checkboxList,
                    checkboxRef: action.payload,
                },
            };
        case 'UPDATE_SELECT_ALL':
            return {
                ...state,
                checkboxList: {
                    ...state.checkboxList,
                    selectAll: {
                        ...state.checkboxList.selectAll,
                        [action.payload.index]: action.payload.flag,
                    },
                },
            };
        case 'UPDATE_ALL_CHECKBOX':
            const { checkboxRef } = state.checkboxList;
            checkboxRef[action.payload.index] = action.payload.data;
            return {
                ...state,
                checkboxRef,
            };
        default:
            return state;
    }
};
