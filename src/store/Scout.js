import * as $ from 'jquery';
import * as Cookies from 'js-cookie';
import { Utils } from '../store/Utils';
import { notify } from 'src/components_v2/common/Notification';
import { NotificationMessage } from 'src/DataContracts/NotificationMessage';
import config from '../config';
import { postData } from 'src/ApiService';
import { ApiEndpoint } from 'src/ApiService/ApiEndpoint';
import { convertJsonToFormData } from 'src/helpers/form';

export const getHeaders = Utils.getHeaders;
export const fetchPayroll = Utils.fetchPayroll;

export const handleFilterSector = sectorId => (dispatch, getState) => {
    if (sectorId === 'all') {
        const orchardIds = getState()
            .scout.filter.sectorList.map(sec => sec.orchardSiteIds)
            .flat();
        const orchardsAndBlocks = getState().scout.filter.orchardsAndBlocks;
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
        const sectorSelect = getState().scout.filter.sectorList.find(item => item.id === sectorId);
        const orchardIds = sectorSelect.orchardSiteIds;
        const selectedOrchards = getState().scout.filter.orchardsAndBlocks.filter(item => orchardIds.includes(item.id));
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
        const orchardList = getState().scout.filter.orchardList;
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
        const orchard = getState().scout.filter.orchardsAndBlocks.find(item => item.id === orchardId);
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
        const block = getState().scout.filter.blockList.find(item => item.id === blockId);
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
        const orchardFilter = await getState().scout.filter.orchardFilter;

        const siteObj =
            orchardFilter.length > 0
                ? await getState().scout.filter.orchardsAndBlocks.find(item => item.id === orchardFilter[0])
                : {};

        const data = {
            StartDate: self.state.startDate.toDateString(),
            EndDate: self.state.endDate.toDateString(),
            SectorId:
                (await getState().scout.filter.sectorFilter.length) > 0
                    ? getState().scout.filter.sectorFilter[0]
                    : null,
            SiteId: siteObj.site ? siteObj.site : null,
            SiteName: siteObj.name ? siteObj.name : null,
            BlockId:
                (await getState().scout.filter.blockFilter.length) > 0 ? getState().scout.filter.blockFilter[0] : null,
            AssignedId: $('#AssignedId').length > 0 ? $('#AssignedId').val() : null,
            StaffId: $('#StaffId').length > 0 ? $('#StaffId').val() : null,
            CompletedId: $('#CompletedId').length > 0 ? $('#CompletedId').val() : null,
            TaskType: $('#TaskType').length > 0 ? $('#TaskType').val() : null,
            IsComplete: $('#IsComplete').length > 0 ? $('#IsComplete').val() : null,
        };

        const formData = convertJsonToFormData(data);
        try {
            const response = await postData(ApiEndpoint.TasksData, formData);
            if (response.code !== 0) throw response.message.content;
            var rows = [];
            for (var i = 0; i < response.response.length; i++) {
                var row = response.response[i];
                row.assigneeName = row.tasksAssignees.map(x => x.assigneeName).join(', ');
                rows.push(row);
            }
            dispatch({ type: 'RECEIVE_SCOUT_DATA', scoutData: rows });
            if (!self.props.metadata.loading && self.props.history.location.pathname.indexOf('scout') >= 0) {
                $('#block-ui-container').css('visibility', 'hidden');
            }
            if (results) {
                notify({ message: NotificationMessage.FilterApplied });
            }
        } catch (e) {
            const error = e.response;
            $('#block-ui-container').css('visibility', 'hidden');
            if (error.status === 403) {
                Cookies.remove('LOGIN');
                self.props.history.push('/not-logged-in');
            } else {
                var status = error.status ? 'Error ' + error.status + ': ' + error.statusText : error.toString();
                notify({ message: status, type: 'error' });
            }
        }
    },
    clearData: () => (dispatch, getState) => {
        dispatch({ type: 'RECEIVE_SCOUT_DATA', scoutData: unloadedState.scoutData });
    },
    downloadExport: self => async (dispatch, getState) => {
        const state = await getState();
        const orchardFilter = state.scout.filter.orchardFilter;
        const siteObj =
            orchardFilter.length > 0
                ? state.scout.filter.orchardsAndBlocks.find(item => item.id === orchardFilter[0])
                : {};
        const url = config.BACKEND_API_URL + 'download/scout-data';

        const filters = {
            CurrentDate: new Date().toDateString(),
            StartDate: self.state.startDate.toDateString(),
            EndDate: self.state.endDate.toDateString(),
            SectorId:
                (await getState().scout.filter.sectorFilter.length) > 0
                    ? getState().scout.filter.sectorFilter[0]
                    : null,
            SiteId: siteObj && 'site' in siteObj ? siteObj.site : null,
            SiteName: siteObj && 'site' in siteObj ? siteObj.name : null,
            BlockId:
                (await getState().scout.filter.blockFilter.length) > 0 ? getState().scout.filter.blockFilter[0] : null,
            AssignedId: $('#AssignedId').length > 0 ? $('#AssignedId').val() : null,
            StaffId: $('#StaffId').length > 0 ? $('#StaffId').val() : null,
            CompletedId: $('#CompletedId').length > 0 ? $('#CompletedId').val() : null,
            TaskType: $('#TaskType').length > 0 ? $('#TaskType').val() : null,
            IsComplete: $('#IsComplete').length > 0 ? $('#IsComplete').val() : null,
            Columns: self.state.columns,
        };

        Utils.downloadExport(url, getHeaders(), filters);
    },
};

const unloadedState = {
    scoutData: null,
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
        case 'RECEIVE_SCOUT_DATA':
            return {
                ...state,
                scoutData: action.scoutData,
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
