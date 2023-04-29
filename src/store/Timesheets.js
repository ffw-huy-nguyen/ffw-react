import * as $ from 'jquery';
import * as moment from 'moment';
import localeData from 'moment';
import * as Cookies from 'js-cookie';
import { Utils } from '../store/Utils';
import { notify } from 'src/components_v2/common/Notification';
import { NotificationMessage } from 'src/DataContracts/NotificationMessage';
import momentTimezone from 'moment-timezone';
import config from '../config';

export const getHeaders = Utils.getHeaders;
export const fetchPayroll = Utils.fetchPayroll;

export const handleFilterSector = sectorId => (dispatch, getState) => {
    if (sectorId === 'all') {
        const orchardIds = getState()
            .timesheets.filter.sectorList.map(sec => sec.orchardSiteIds)
            .flat();
        const orchardsAndBlocks = getState().timesheets.filter.orchardsAndBlocks;
        const selectedOrchards = orchardsAndBlocks.filter(item => orchardIds.includes(item.id));
        const blockList = selectedOrchards.reduce((acc, item) => {
            acc = [...acc, ...item.blocks];
            return acc;
        }, []);
        // if select all return empty
        dispatch({
            type: 'UPDATE_SECTOR_FILTER',
            payload: [],
        });

        // update orchard list belongs to selected sectors
        dispatch({
            type: 'UPDATE_ORCHARDS_LIST',
            payload: selectedOrchards,
        });

        // update block list belongs to selected sectors
        dispatch({
            type: 'UPDATE_BLOCK_LIST',
            payload: blockList,
        });
    } else {
        const sectorSelect = getState().timesheets.filter.sectorList.find(item => item.id === sectorId);
        const orchardIds = sectorSelect.orchardSiteIds;
        const selectedOrchards = getState().timesheets.filter.orchardsAndBlocks.filter(item =>
            orchardIds.includes(item.id)
        );
        const selectedBlocks = selectedOrchards.reduce((acc, item) => {
            acc = [...acc, ...item.blocks];
            return acc;
        }, []);
        const payload = [sectorSelect.id];

        // select sector
        dispatch({
            type: 'UPDATE_SECTOR_FILTER',
            payload,
        });

        // update orchard list belongs to selected sectors
        dispatch({
            type: 'UPDATE_ORCHARDS_LIST',
            payload: selectedOrchards,
        });

        // clear selected orchard
        dispatch({
            type: 'UPDATE_ORCHARDS_FILTER',
            payload: [],
        });

        // update block list belongs to selected sectors
        dispatch({
            type: 'UPDATE_BLOCK_LIST',
            payload: selectedBlocks,
        });

        // clear selected block
        dispatch({
            type: 'UPDATE_BLOCK_FILTER',
            payload: [],
        });
    }
};

export const handleFilterOrchard = orchardId => (dispatch, getState) => {
    if (orchardId === 'all') {
        const orchardList = getState().timesheets.filter.orchardList;
        const blockList = orchardList.reduce((acc, item) => {
            acc = [...acc, ...item.blocks];
            return acc;
        }, []);
        // if select all return empty
        dispatch({
            type: 'UPDATE_ORCHARDS_FILTER',
            payload: [],
        });

        dispatch({
            type: 'UPDATE_BLOCK_LIST',
            payload: blockList,
        });
    } else {
        const orchard = getState().timesheets.filter.orchardsAndBlocks.find(item => item.id === orchardId);
        const payload = orchard.blocks || [];
        // update block list belongs to selected orchard
        dispatch({
            type: 'UPDATE_BLOCK_LIST',
            payload,
        });

        // select orchard
        dispatch({
            type: 'UPDATE_ORCHARDS_FILTER',
            payload: [orchard.id],
        });

        // clear selected block
        dispatch({
            type: 'UPDATE_BLOCK_FILTER',
            payload: [],
        });
    }
};

export const handleFilterBlock = blockId => (dispatch, getState) => {
    let payload;
    if (blockId === 'all') {
        // if select all return empty
        payload = [];
    } else {
        const block = getState().timesheets.filter.blockList.find(item => item.id === blockId);
        payload = [block.name];
    }
    dispatch({
        type: 'UPDATE_BLOCK_FILTER',
        payload,
    });
};

export const clearFilter = () => dispatch => {
    dispatch({
        type: 'CLEAR_FILTER',
        payload: unloadedState.filter,
    });
};

export const actionCreators = {
    requestData: (results, self) => async (dispatch, getState) => {
        $('#block-ui-container').css('visibility', 'visible');

        const orchardFilter = await getState().timesheets.filter.orchardFilter;

        const siteObj =
            orchardFilter.length > 0
                ? await getState().timesheets.filter.orchardsAndBlocks.find(item => item.id === orchardFilter[0])
                : {};

        $.ajax({
            url: config.BACKEND_API_URL + 'api/timesheetdata',
            method: 'POST',
            data: {
                StartDate: self.state.startDate.toDateString(),
                EndDate: self.state.endDate.toDateString(),
                TeamLead: $('#TeamLead').length > 0 ? $('#TeamLead').val() : null,
                SectorId:
                    (await getState().timesheets.filter.sectorFilter.length) > 0
                        ? getState().timesheets.filter.sectorFilter[0]
                        : null,
                SiteId: siteObj.site ? siteObj.site : null,
                SiteName: siteObj.name ? siteObj.name : null,
                BlockId:
                    (await getState().timesheets.filter.blockFilter.length) > 0
                        ? getState().timesheets.filter.blockFilter[0]
                        : null,
                AreaId: $('#AreaId').length > 0 ? $('#AreaId').val() : null,
                StaffId: $('#StaffId').length > 0 ? $('#StaffId').val() : null,
                Activity: $('#Activity').length > 0 ? $('#Activity').val() : null,
                Contractor: $('#Contractor').length > 0 ? $('#Contractor').val() : null,
            },
            headers: getHeaders(),
        })
            .then(function (response) {
                const isMilitaryTimeFormat = self.props.metadata.defaults.militaryTimeFormat;

                let dateFormat = '';
                if (isMilitaryTimeFormat == null) {
                    dateFormat = 'h:mm A';
                } else if (isMilitaryTimeFormat) {
                    dateFormat = 'HH:mm';
                } else {
                    dateFormat = 'hh:mm a';
                }

                if (response.code !== 0) throw response.message.content;
                var rows = [];
                for (var i = 0; i < response.response.length; i++) {
                    var row = response.response[i];
                    row.rate = row.rate > 0 ? row.rate : row.pieceRate;
                    row.name = row.firstName + ' ' + row.lastName;

                    if (row.start != null && row.start > 0) {
                        row.startTime = moment(row.start * 1000).format(dateFormat);
                    }
                    if (row.end != null && row.end > 0) {
                        row.endTime = moment(row.end * 1000).format(dateFormat);
                    }
                    rows.push(row);
                }
                dispatch({ type: 'RECEIVE_TIMESHEETS_DATA', timesheetsData: rows });

                if (!self.props.metadata.loading && self.props.history.location.pathname.indexOf('timesheets') >= 0) {
                    $('#block-ui-container').css('visibility', 'hidden');
                }
                if (results) {
                    notify({ message: NotificationMessage.FilterApplied });
                }
            })
            .catch(function (error) {
                $('#block-ui-container').css('visibility', 'hidden');
                if (error.status === 403) {
                    Cookies.remove('LOGIN');
                    self.props.history.push('/not-logged-in');
                } else {
                    var status = error.status ? 'Error ' + error.status + ': ' + error.statusText : error.toString();
                    notify({ message: status, type: 'error' });
                }
            });
    },
    clearData: () => (dispatch, getState) => {
        dispatch({ type: 'RECEIVE_TIMESHEETS_DATA', timesheetsData: unloadedState.timesheetsData });
    },
    saveTimesheet: self => (dispatch, getState) => {
        self.state.timesheet.rate = parseFloat(self.state.timesheet.rate) ? parseFloat(self.state.timesheet.rate) : 0;
        self.state.timesheet.wageRate = parseFloat(self.state.timesheet.wageRate)
            ? parseFloat(self.state.timesheet.wageRate)
            : 0;

        self.state.rows[self.state.index] = self.state.timesheet;
        self.forceUpdate();
        $('.popup-new-task.hide').hide();

        $.ajax({
            url: config.BACKEND_API_URL + 'api/savetimesheet',
            method: 'POST',
            data: self.state.timesheet,
            headers: getHeaders(),
        })
            .then(function (response) {
                if (response.code !== 0) throw response.message.content;
                notify({ message: NotificationMessage.TimesheetSaved });
            })
            .catch(function (error) {
                var status = error.status ? 'Error ' + error.status + ': ' + error.statusText : error.toString();
                notify({ message: status, type: 'error' });
            });
    },

    downloadExport: self => async (dispatch, getState) => {
        const state = await getState();
        const orchardFilter = state.timesheets.filter.orchardFilter;
        const siteObj =
            orchardFilter.length > 0
                ? state.timesheets.filter.orchardsAndBlocks.find(item => item.id === orchardFilter[0])
                : {};
        const url = config.BACKEND_API_URL + 'download/timesheets-data';

        const filters = {
            CurrentDate: new Date().toDateString(),
            StartDate: self.state.startDate.toDateString(),
            EndDate: self.state.endDate.toDateString(),
            TeamLead: $('#TeamLead').length > 0 ? $('#TeamLead').val() : null,
            SectorId:
                (await getState().timesheets.filter.sectorFilter.length) > 0
                    ? getState().timesheets.filter.sectorFilter[0]
                    : null,
            SiteId: siteObj && 'site' in siteObj ? siteObj.site : null,
            SiteName: siteObj && 'site' in siteObj ? siteObj.name : null,
            BlockId:
                (await getState().timesheets.filter.blockFilter.length) > 0
                    ? getState().timesheets.filter.blockFilter[0]
                    : null,
            AreaId: $('#AreaId').length > 0 ? $('#AreaId').val() : null,
            StaffId: $('#StaffId').length > 0 ? $('#StaffId').val() : null,
            Activity: $('#Activity').length > 0 ? $('#Activity').val() : null,
            Contractor: $('#Contractor').length > 0 ? $('#Contractor').val() : null,
            TimezoneId: momentTimezone.tz.guess(true),
            Columns: self.state.columns,
        };

        Utils.downloadExport(url, getHeaders(), filters);
    },
};

const unloadedState = {
    timesheetsData: null,
    filter: {
        sectorList: [],
        orchardList: [],
        blockList: [],
        sectorFilter: [],
        orchardsAndBlocks: [],
        orchardFilter: [],
        blockFilter: [],
    },
};

export const reducer = (state, action) => {
    switch (action.type) {
        case 'RECEIVE_TIMESHEETS_DATA':
            return {
                ...state,
                timesheetsData: action.timesheetsData,
            };
        case 'CLEAR_FILTER':
            return {
                ...state,
                filter: action.payload,
            };
        case 'FETCH_SECTOR_NAMES':
            return {
                ...state,
                filter: {
                    ...state.filter,
                    sectorList: action.payload,
                },
            };
        case 'UPDATE_SECTOR_FILTER':
            return {
                ...state,
                filter: {
                    ...state.filter,
                    sectorFilter: action.payload,
                },
            };
        case 'UPDATE_ORCHARDS_LIST':
            return {
                ...state,
                filter: {
                    ...state.filter,
                    orchardList: action.payload,
                },
            };
        case 'UPDATE_ORCHARDS_FILTER':
            return {
                ...state,
                filter: {
                    ...state.filter,
                    orchardFilter: action.payload,
                },
            };
        case 'FETCH_ORCHARDS_AND_BLOCKS':
            return {
                ...state,
                filter: {
                    ...state.filter,
                    orchardsAndBlocks: action.payload.orchardsAndBlocks,
                    orchardList: action.payload.orchardList,
                    blockList: action.payload.orchardsAndBlocks.reduce((acc, item) => {
                        acc = [...acc, ...item.blocks];
                        return acc;
                    }, []),
                },
            };
        case 'UPDATE_BLOCK_LIST':
            return {
                ...state,
                filter: {
                    ...state.filter,
                    blockList: action.payload,
                },
            };
        case 'UPDATE_BLOCK_FILTER':
            return {
                ...state,
                filter: {
                    ...state.filter,
                    blockFilter: action.payload,
                },
            };
        default:
            return state || unloadedState;
    }
};
