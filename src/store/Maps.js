import * as $ from 'jquery';
import * as moment from 'moment';
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
            .maps.filter.sectorList.map(sec => sec.orchardSiteIds)
            .flat();
        const orchardsAndBlocks = getState().maps.filter.orchardsAndBlocks;
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
        const sectorSelect = getState().maps.filter.sectorList.find(item => item.id === sectorId);
        const orchardIds = sectorSelect.orchardSiteIds;
        const selectedOrchards = getState().maps.filter.orchardsAndBlocks.filter(item => orchardIds.includes(item.id));
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
        const orchardList = getState().maps.filter.orchardList;
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
        const orchard = getState().maps.filter.orchardsAndBlocks.find(item => item.id === orchardId);
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
        const block = getState().maps.filter.blockList.find(item => item.id === blockId);
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
    requestData: (results, self, recenter) => async (dispatch, getState) => {
        $('#block-ui-container').css('visibility', 'visible');

        const orchardFilter = await getState().maps.filter.orchardFilter;

        const siteObj =
            orchardFilter.length > 0
                ? await getState().maps.filter.orchardsAndBlocks.find(item => item.id === orchardFilter[0])
                : {};

        let orchardSite = $('#SiteId').length > 0 ? $('#SiteId').val() : '';
        let orchardName = '';
        // TODO: temporary solution until we have the IDs
        if (orchardSite.includes('_')) {
            orchardName = orchardSite.split('_')[1];
            orchardSite = orchardSite.split('_')[0];
        }

        const _data = {
            StartDate: self.state.startDate.toDateString(),
            EndDate: self.state.endDate.toDateString(),
            SectorId:
                (await getState().maps.filter.sectorFilter.length) > 0 ? getState().maps.filter.sectorFilter[0] : null,
            SiteId: siteObj.site ? siteObj.site : null,
            SiteName: siteObj.name ? siteObj.name : null,
            BlockId:
                (await getState().maps.filter.blockFilter.length) > 0 ? getState().maps.filter.blockFilter[0] : null,
            PickerId: $('#PickerId').length > 0 ? $('#PickerId').val() : null,
            Variety: $('#Variety').length > 0 ? $('#Variety').val() : null,
            PickType: $('#PickType').length > 0 ? $('#PickType').val() : null,
        };
        const formData = convertJsonToFormData(_data);
        try {
            const response = await postData(ApiEndpoint.Bins, formData);
            if (response.code !== 0) throw response.message.content;
            dispatch({
                type: 'RECEIVE_BINS_DATA',
                binsData: response.response,
            });

            if (self.heatmap) self.heatmap.setMap(null);
            for (let i = 0; i < self.markers.length; i++) self.markers[i].setMap(null);
            self.markers = [];

            if (recenter && self.props.binsData.length > 0)
                self.map.setCenter(
                    new window.google.maps.LatLng(self.props.binsData[0].latitude, self.props.binsData[0].longitude)
                );

            var data = [];
            if (self.props.binsData.length > 1) {
                // The first record is used only to initially center the map
                for (var i = 1; i < self.props.binsData.length; i++) {
                    if (self.props.binsData[i].latitude !== 0) {
                        var bin = self.props.binsData[i];
                        data.push(new window.google.maps.LatLng(bin.latitude, bin.longitude));

                        const orchard =
                            bin.orchardName == null || bin.orchardName === bin.orchardSite
                                ? bin.orchardSite
                                : `${bin.orchardName} (${bin.orchardSite})`;

                        if (self.props.binsData.length < 1000) {
                            self.markers.push(
                                new window.google.maps.Marker({
                                    position: new window.google.maps.LatLng(bin.latitude, bin.longitude),
                                    map: self.map,
                                    icon: {
                                        path: window.google.maps.SymbolPath.CIRCLE,
                                        scale: 4,
                                        strokeOpacity: 0,
                                    },
                                    title:
                                        'Bin: ' +
                                        bin.id.slice(-4) +
                                        '\n' +
                                        moment(bin.dateTimestamp).format('DD MMM YYYY') +
                                        '\n' +
                                        self.props.metadata.localisations.Site +
                                        ': ' +
                                        orchard +
                                        '\n' +
                                        'Block: ' +
                                        bin.block +
                                        '\n' +
                                        (bin.areas.length === 0
                                            ? ''
                                            : 'Area: ' + bin.areas.map(x => x.area).join(', ') + '\n') +
                                        (bin.pickers.length === 0
                                            ? ''
                                            : 'Picker(s): ' + bin.pickers.map(x => x.pickerName).join(', ') + '\n') +
                                        'Variety: ' +
                                        bin.variety +
                                        '\n' +
                                        bin.teamLeaderName,
                                })
                            );
                        }
                    }
                }
            }
            self.heatmap = new window.google.maps.visualization.HeatmapLayer({
                data: data,
                map: self.map,
                dissipating: true,
            });

            if (!self.props.metadata.loading && self.props.history.location.pathname.indexOf('maps') >= 0) {
                $('#block-ui-container').css('visibility', 'hidden');
            }
            if (results) {
                notify({
                    message: 'Filter applied -- bin details ' + (self.markers.length > 0 ? '' : 'NOT ') + 'available',
                });
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
        dispatch({
            type: 'RECEIVE_BINS_DATA',
            binsData: unloadedState.binsData,
        });
    },
};

const unloadedState = {
    binsData: null,
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
        case 'RECEIVE_BINS_DATA':
            return {
                ...state,
                binsData: action.binsData,
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
