import * as $ from 'jquery';
import * as Cookies from 'js-cookie';
import { Utils } from '../store/Utils';
import { notify } from 'src/components_v2/common/Notification';
import { NotificationMessage } from 'src/DataContracts/NotificationMessage';
import momentTimezone from 'moment-timezone';
import config from '../config';
import PAYROLL_COLUMNS from '../store/Payroll-table-columns';
import { getData } from 'src/ApiService';
import { ApiEndpoint } from 'src/ApiService/ApiEndpoint';

export const getHeaders = Utils.getHeaders;
export const fetchPayroll = Utils.fetchPayroll;

export const handlePayrollColumns = selectedTitles => dispatch => {
    dispatch({
        type: 'SELECT_PAYROLL_COLUMNS',
        payload: selectedTitles,
    });
};

export const toggleLunchBreak = () => dispatch => {
    dispatch({
        type: 'TOOGLE_LUNCH_BREAK',
    });
};

export const fetchSectorOrchardBlocks = () => async dispatch => {
    let metadata, sectors, orchardList;
    let orchardsAndBlocks = [];
    try {
        metadata = (await getData(ApiEndpoint.Metadata)).response;
    } catch (error) {
        console.log(error);
    }

    if (!metadata || !metadata.options) {
        return;
    }

    try {
        sectors = await getData(ApiEndpoint.MetadataSectors);
    } catch (error) {
        console.log(error);
    }

    try {
        orchardsAndBlocks = await getData(ApiEndpoint.OrchardSitesAndBlocks);
    } catch (error) {
        console.log(error);
    }

    const hasSectors = metadata.options.hasSectors;

    if (hasSectors && sectors.length > 0) {
        // if not empty means have sector then go for the current logic flow
        dispatch({
            type: 'FETCH_SECTOR_NAMES',
            payload: sectors,
        });

        const orchardIds = sectors.map(sec => sec.orchardSiteIds).flat();
        orchardList = orchardsAndBlocks && orchardsAndBlocks.filter(item => orchardIds.includes(item.id));
    } else {
        // if empty means no sector asigned so hide sector list and display all orchards/blocks
        orchardList = orchardsAndBlocks;
    }

    dispatch({
        type: 'FETCH_ORCHARDS_AND_BLOCKS',
        payload: { orchardList, orchardsAndBlocks },
    });

    const blockList = orchardList.reduce((acc, item) => {
        acc = [...acc, ...item.blocks];
        return acc;
    }, []);

    dispatch({
        type: 'UPDATE_BLOCK_LIST',
        payload: blockList,
    });
};

export const handleFilterSector = sectorId => (dispatch, getState) => {
    if (sectorId === 'all') {
        const orchardIds = getState()
            .payroll.filter.sectorList.map(sec => sec.orchardSiteIds)
            .flat();
        const orchardsAndBlocks = getState().payroll.filter.orchardsAndBlocks;
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
        const sectorSelect = getState().payroll.filter.sectorList.find(item => item.id === sectorId);
        const orchardIds = sectorSelect.orchardSiteIds;
        const selectedOrchards = getState().payroll.filter.orchardsAndBlocks.filter(item =>
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
        const orchardList = getState().payroll.filter.orchardList;
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
        const orchard = getState().payroll.filter.orchardsAndBlocks.find(item => item.id === orchardId);
        const payload = orchard.blocks || [];
        // update block list belongs to selected orchard
        dispatch({
            type: 'UPDATE_BLOCK_LIST',
            payload,
        });

        // select orchard
        dispatch({
            type: 'UPDATE_ORCHARDS_FILTER',
            payload: [orchard.name],
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
        const block = getState().payroll.filter.blockList.find(item => item.id === blockId);
        // check block isExist to avoid blockId = null
        payload = block ? [block.name] : [];
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

        const orchardFilter = await getState().payroll.filter.orchardFilter;

        const siteObj =
            orchardFilter.length > 0
                ? await getState().payroll.filter.orchardsAndBlocks.find(item => item.name === orchardFilter[0])
                : {};

        const url = 'api/payroll';
        const method = 'POST';
        const contentType = 'application/json';
        const data = JSON.stringify({
            StartDate: self.state.startDate.toDateString(),
            EndDate: self.state.endDate.toDateString(),
            StaffId:
                document.getElementById('StaffId') &&
                document.getElementById('StaffId').selectedOptions &&
                document.getElementById('StaffId').selectedOptions[0] &&
                document.getElementById('StaffId').selectedOptions[0].value !== ''
                    ? document.getElementById('StaffId').selectedOptions[0].value
                    : null,
            Activity: self.state.jobs.length > 0 ? ',' + self.state.jobs.join(',') + ',' : null,
            Activities: self.state.jobs,
            PayBy: $('#PayBy').length > 0 ? $('#PayBy').val() : null,
            TeamLead: $('#TeamLead').length > 0 ? $('#TeamLead').val() : null,
            SectorId:
                (await getState().payroll.filter.sectorFilter.length) > 0
                    ? getState().payroll.filter.sectorFilter[0]
                    : null,
            SiteId: siteObj.site ? siteObj.site : null,
            SiteName: orchardFilter.length > 0 ? orchardFilter[0] : null,
            BlockId:
                (await getState().payroll.filter.blockFilter.length) > 0
                    ? getState().payroll.filter.blockFilter[0]
                    : null,
            Variety: $('#Variety').length > 0 ? $('#Variety').val() : null,
            Contractor: $('#Contractor').length > 0 ? $('#Contractor').val() : null,
        });

        const success = response => {
            const bins = response.unassignedBins.filter(item => !item.isBucket);
            const buckets = response.unassignedBins.filter(item => item.isBucket);

            dispatch({
                type: 'RECEIVE_PAYROLL_DATA',
                payrollData: response.payrollData,
                unassignedBins: bins,
                unassignedBuckets: buckets,
            });
            $('#block-ui-container').css('visibility', 'hidden');

            const showWarningHeader = self.hasAnyOverlapJob() || self.hasAnyInProgressJob();
            self.determineBodyHeight(showWarningHeader, self.state.advanced);
        };
        const fail = error => {
            if (error.status === 403) {
                Cookies.remove('LOGIN');
                self.props.history.push('/not-logged-in');
            } else {
                handleError(error);
            }
        };

        Utils.handleAjaxRequest(url, method, getHeaders, data, success, fail, contentType, true);
    },
    clearData: () => (dispatch, getState) => {
        dispatch({
            type: 'RECEIVE_PAYROLL_DATA',
            payrollData: unloadedState.payrollData,
            unassignedBins: unloadedState.unassignedBins,
            unassignedBuckets: unloadedState.unassignedBuckets,
        });
    },

    downloadExport: (path, self, payrollSetting) => async (dispatch, getState) => {
        const orchardFilter = await getState().payroll.filter.orchardFilter;

        const url = config.BACKEND_API_URL + path;

        const siteObj =
            orchardFilter.length > 0
                ? await getState().payroll.filter.orchardsAndBlocks.find(item => item.name === orchardFilter[0])
                : {};

        const _filters = getState().payroll.filter;
        // TODO: Map payroll columns into the way it's currently sent accros all the modules but will need to be re-done at some point
        const payrollColumns = PAYROLL_COLUMNS.map(it => {
            return { key: it.field, hide: false };
        });

        // Add data into FormData obj
        const filters = {
            PayrollSystemName: payrollSetting.payrollSystemName,
            CurrentDate: new Date().toDateString(),
            StartDate: self.state.startDate.toDateString(),
            EndDate: self.state.endDate.toDateString(),
            StaffId: $('#StaffId').length > 0 ? $('#StaffId').val() : null,
            Activities: self.state.jobs,
            Activity: self.state.jobs.length > 0 ? ',' + self.state.jobs.join(',') + ',' : null,
            PayBy: $('#PayBy').length > 0 ? $('#PayBy').val() : null,
            TeamLead: $('#TeamLead').length > 0 ? $('#TeamLead').val() : null,
            SectorId: _filters.sectorFilter.length > 0 ? _filters.sectorFilter[0] : null,
            SiteId: siteObj.site ? siteObj.site : null,
            SiteName: orchardFilter.length > 0 ? orchardFilter[0] : null,
            BlockId: _filters.blockFilter.length > 0 ? _filters.blockFilter[0] : null,
            Variety: $('#Variety').length > 0 ? $('#Variety').val() : null,
            Contractor: $('#Contractor').length > 0 ? $('#Contractor').val() : null,
            TimezoneId: momentTimezone.tz.guess(true),
            Columns: payrollColumns,
        };

        Utils.downloadExport(url, getHeaders(), filters);
    },
};

const unloadedState = {
    payrollSettings: null,
    payrollData: [],
    unassignedBins: [],
    unassignedBuckets: [],
    filter: {
        sectorList: [],
        orchardList: [],
        blockList: [],
        sectorFilter: [],
        orchardsAndBlocks: [],
        orchardFilter: [],
        blockFilter: [],
    },
    toggleLunchBreak: true,
    payrollColumns: [],
    selectedPayrollColumnTitles: [],
};

export const reducer = (state, action) => {
    switch (action.type) {
        case 'RECEIVE_PAYROLL_DATA':
            return {
                ...state,
                payrollData: action.payrollData,
                unassignedBins: action.unassignedBins,
                unassignedBuckets: action.unassignedBuckets,
            };
        case 'CLEAR_FILTER':
            return {
                ...state,
                filter: action.payload,
            };
        case 'FETCH_PAYROLL_SETTINGS':
            return {
                ...state,
                payrollSettings: action.payload,
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
        case 'TOOGLE_LUNCH_BREAK':
            return {
                ...state,
                toggleLunchBreak: !state.toggleLunchBreak,
            };
        case 'SELECT_PAYROLL_COLUMNS':
            return {
                ...state,
                selectedPayrollColumnTitles: action.payload,
                payrollColumns: payrollColumnsUtil(PAYROLL_COLUMNS, action),
            };
        default:
            return state || unloadedState;
    }
};

// ------------------------- Helpers -------------------------

function handleError(error) {
    $('#block-ui-container').css('visibility', 'hidden');

    var status = error.status ? 'Error ' + error.status + ': ' + error.statusText : error.toString();
    notify({ message: status, type: 'error' });
}

function payrollColumnsUtil(original, action) {
    let result = [];
    original.map(col => {
        const inx = action.payload.indexOf(col.title);
        // if title exist
        if (inx > -1) {
            result[inx] = col;
        }
    });
    return result;
}
