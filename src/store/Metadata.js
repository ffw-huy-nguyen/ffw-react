import * as $ from 'jquery';
import * as Cookies from 'js-cookie';
import { apiClient, deleteData, postData } from 'src/ApiService';
import { ApiEndpoint } from 'src/ApiService/ApiEndpoint';
import { notify } from 'src/components_v2/common/Notification';
import { NotificationMessage } from 'src/DataContracts/NotificationMessage';
import { getLocalStorageItem, setLocalStorageItem, StorageKey } from 'src/helpers/storage';
import { Utils } from './Utils';

export const fetchVarieties = () => dispatch => {
    let headers = getHeaders();
    if (!headers) return;
    const url = 'api/metadata/varieties';
    const method = 'GET';
    const data = {};
    const success = response => {
        dispatch({
            type: 'FETCH_VARIETIES',
            payload: response,
        });
        return response;
    };
    const fail = error => handleError(error);

    Utils.handleAjaxRequest(url, method, getHeaders, data, success, fail, false, false);
};

export const getHeaders = () => {
    const token = window.localStorage.getItem('token');

    if (!token) {
        return null;
    }

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    return headers;
};

export const fetchOrchardSites = () => dispatch => {
    let headers = getHeaders();
    if (!headers) return;

    const url = 'api/metadata/orchardSites';
    const method = 'GET';
    const data = {};
    const success = response => {
        dispatch({
            type: 'FETCH_ORCHARDSITES',
            payload: response,
        });
        return response;
    };
    const fail = error => handleError(error);

    Utils.handleAjaxRequest(url, method, getHeaders, data, success, fail, false, false);
};

export const fetchLots = self => dispatch => {
    const headers = getHeaders();
    if (!headers) return;
    const url = 'api/metadata/lots';
    const method = 'GET';
    const data = {};
    const contentType = 'application/json';

    const success = response => {
        dispatch({
            type: 'FETCH_LOTS',
            payload: response,
        });
        return response;
    };

    const fail = error => handleError(error);

    Utils.handleAjaxRequest(url, method, getHeaders, data, success, fail, contentType, false);
};

export const submitLot =
    (payload, isCreate, id = false) =>
    dispatch => {
        const url = id ? `${ApiEndpoint.Lots}/${id}` : 'api/metadata/lots';
        const method = isCreate ? 'POST' : 'PUT';
        const type = isCreate ? 'CREATE_LOT' : 'UPDATE_LOT';
        const data = {
            ...payload,
        };
        apiClient
            .request({
                url,
                method,
                data,
            })
            .then(response => {
                payload = response.data;
                dispatch({
                    type,
                    payload,
                });
                notify({ message: NotificationMessage.Success });
                $('#block-ui-container').css('visibility', 'hidden');
                return response;
            })
            .catch(error => {
                $('#block-ui-container').css('visibility', 'hidden');
                handleError(error.response);
            });
    };

export const deleteLot = self => async dispatch => {
    if (window.confirm('Please confirm you want to delete this Lot?')) {
        const id = self.state.lot.id;
        $('#block-ui-container').css('visibility', 'visible');
        try {
            const response = await deleteData(`${ApiEndpoint.Lots}/${id}`);
            dispatch({
                type: 'DELETE_LOT',
                payload: id,
            });
            notify({ message: NotificationMessage.Success });
            $('#block-ui-container').css('visibility', 'hidden');
            self.setSector({ ...self.emptyLot });
            return response;
        } catch (error) {
            $('#block-ui-container').css('visibility', 'hidden');
            handleError(error);
        }
    }
};

export const fetchSectors = self => dispatch => {
    let headers = getHeaders();
    if (!headers) return;

    const url = 'api/metadata/sectors';
    const method = 'GET';
    const data = {};
    const success = response => {
        dispatch({
            type: 'FETCH_SECTORS',
            payload: response,
        });
        return response;
    };
    const fail = error => handleError(error);

    Utils.handleAjaxRequest(url, method, getHeaders, data, success, fail, false, false);
};

export const submitSector =
    (payload, isCreate, id = false) =>
    dispatch => {
        let headers = getHeaders();
        if (!headers) return;

        const url = id ? `api/metadata/sectors/${id}` : 'api/metadata/sectors';
        const method = isCreate ? 'POST' : 'PUT';
        const type = isCreate ? 'CREATE_SECTOR' : 'UPDATE_SECTOR';
        const data = {
            ...payload,
        };
        $('#block-ui-container').css('visibility', 'visible');

        const contentType = 'application/json';
        const success = response => {
            payload = response;
            dispatch({
                type,
                payload,
            });

            return response;
        };
        const fail = error => handleError(error);

        Utils.handleAjaxRequest(url, method, getHeaders, JSON.stringify(data), success, fail, contentType, true);
    };

export const deleteSector = self => dispatch => {
    let headers = getHeaders();
    if (!headers) return;

    if (window.confirm('Please confirm you want to delete this Sector?')) {
        const id = self.state.sector.id;
        $('#block-ui-container').css('visibility', 'visible');

        const url = `api/metadata/sectors/${id}`;
        const method = 'DELETE';
        const data = {};
        const success = response => {
            dispatch({
                type: 'DELETE_SECTOR',
                payload: id,
            });
            self.setSector({ ...self.emptySector });
            return response;
        };
        const fail = error => handleError(error);

        Utils.handleAjaxRequest(url, method, getHeaders, data, success, fail, false, true);
    }
};

const dispatchPromise = (data, dispatch) =>
    new Promise((resolve, reject) => {
        dispatch(data);
        resolve();
    });

const saveOrchardSite =
    (api, data, self, message, navigateBack, index = 0) =>
    async dispatch => {
        $('#block-ui-container').css('visibility', 'visible');

        let url, method, payload, dispatchPayload;
        // check is CREATE
        // state.id === "" means CREATE
        if (self.state.id !== 'group') {
            method = self.state.id === '' ? 'POST' : 'PUT';
        } else {
            method = 'POST';
        }

        if (api === 'orchardsites') {
            // url for orchards
            url =
                self.state.id === '' ? 'api/metadata/orchardsites' : `api/metadata/orchardsites/${self.state.site.id}`;
            const hasId = self.state.id === '' ? false : true;
            // data for orchards
            payload = { ...self.state.site };
            delete payload.blocks;

            dispatchPayload = {
                orchardId: hasId ? self.state.site.id : null,
            };
        }
        if (api === 'blocks') {
            // url for blocks
            url =
                self.state.id === ''
                    ? `api/metadata/orchardsites/${self.state.site.id}/blocks`
                    : `api/metadata/orchardsites/${self.state.site.id}/blocks/${self.state.block.id}`;
            const hasId = self.state.id === '' ? false : true;
            // data for blocks
            payload = { ...self.state.block };
            if (payload.hectares) {
                payload.hectares = parseFloat(payload.hectares);
            }
            delete payload.name;
            delete payload.areas;
            delete payload.newRows;
            delete payload.rowSpace;
            delete payload.varietiesNew;

            dispatchPayload = {
                orchardId: self.state.site.id,
                blockId: hasId ? self.state.block.id : null,
            };
        }
        if (api === 'area') {
            // url for areas
            url =
                self.state.id === ''
                    ? `api/metadata/orchardsites/${self.state.site.id}/blocks/${self.state.block.id}/areas`
                    : `api/metadata/orchardsites/${self.state.site.id}/blocks/${self.state.block.id}/areas/${self.state.area.id}`;
            const hasId = self.state.id === '' ? false : true;
            // data for areas
            payload = { ...self.state.area };
            delete payload.newRows;
            delete payload.rowSpace;
            delete payload.varietiesNew;

            dispatchPayload = {
                orchardId: self.state.site.id,
                blockId: self.state.block.id,
                areaId: hasId ? self.state.area.id : null,
            };

            // check if area exist
            if (method === 'POST') {
                const targetBlock = self.state.block;
                const result = targetBlock.areas.filter(item => item.code === self.state.area.code);
                if (result.length > 0) {
                    notify({ message: NotificationMessage.AreaExist, type: 'error' });
                    $('#block-ui-container').css('visibility', 'hidden');
                    return;
                }
            }
        }
        if (api === 'row') {
            let hasArea, hasRow;

            if (self.state.area === null) {
                const targetBlock = self.state.block;
                if (self.state.id === 'group') {
                    // create multiple rows
                    url = `api/metadata/orchardsites/${self.state.site.id}/blocks/${self.state.block.id}/rows/many`;
                    hasRow = false;
                } else {
                    const result = targetBlock.rows.filter(item => item.number === parseInt(self.state.row.number, 10));
                    if (result.length > 0 && method === 'POST') {
                        // stop repeat name when create
                        notify({ message: NotificationMessage.RowExist, type: 'error' });
                        $('#block-ui-container').css('visibility', 'hidden');
                        return;
                    }
                    if (result.length > 0 && method === 'PUT') {
                        if (self.state.row.id) {
                            const id = self.state.row.id;
                            // update name only
                            if (result[0].id !== id) {
                                // another row has same name
                                notify({ message: NotificationMessage.RowExist, type: 'error' });
                                $('#block-ui-container').css('visibility', 'hidden');
                                return;
                            }
                            // update nothing
                            if (
                                result[0].id === id &&
                                result[0].numberOfTrees === parseInt(self.state.row.numberOfTrees, 10)
                            ) {
                                notify({ message: NotificationMessage.RowExist, type: 'error' });
                                $('#block-ui-container').css('visibility', 'hidden');
                                return;
                            }
                            // update tree number only ok
                            // update both name and tree number ok
                        }
                    }
                    // url for row without area
                    url =
                        self.state.id === ''
                            ? `api/metadata/orchardsites/${self.state.site.id}/blocks/${self.state.block.id}/rows`
                            : `api/metadata/orchardsites/${self.state.site.id}/blocks/${self.state.block.id}/rows/${self.state.row.id}`;
                    hasRow = self.state.id === '' ? false : true;
                }
                hasArea = false;
            } else {
                const targetArea = self.state.area;

                if (self.state.id === 'group') {
                    url = `api/metadata/orchardsites/${self.state.site.id}/blocks/${self.state.block.id}/areas/${self.state.area.id}/rows/many`;
                    hasRow = false;
                } else {
                    const result = targetArea.rows.filter(item => item.number === parseInt(self.state.row.number, 10));
                    if (result.length > 0 && method === 'POST') {
                        // stop repeat name when create
                        notify({ message: NotificationMessage.RowExist, type: 'error' });
                        $('#block-ui-container').css('visibility', 'hidden');
                        return;
                    }
                    if (result.length > 0 && method === 'PUT') {
                        if (self.state.row.id) {
                            const id = self.state.row.id;
                            // update name only
                            if (result[0].id !== id) {
                                // another row has same name
                                notify({ message: NotificationMessage.RowExist, type: 'error' });
                                $('#block-ui-container').css('visibility', 'hidden');
                                return;
                            }
                            // update nothing
                            if (
                                result[0].id === id &&
                                result[0].numberOfTrees === parseInt(self.state.row.numberOfTrees, 10)
                            ) {
                                notify({ message: NotificationMessage.RowExist, type: 'error' });
                                $('#block-ui-container').css('visibility', 'hidden');
                                return;
                            }
                            // update tree number only ok
                            // update both name and tree number ok
                        }
                    }
                    // url for row under an area
                    url =
                        self.state.id === ''
                            ? `api/metadata/orchardsites/${self.state.site.id}/blocks/${self.state.block.id}/areas/${self.state.area.id}/rows`
                            : `api/metadata/orchardsites/${self.state.site.id}/blocks/${self.state.block.id}/areas/${self.state.area.id}/rows/${self.state.row.id}`;
                    hasRow = self.state.id === '' ? false : true;
                }
                hasArea = true;
            }

            if (self.state.id !== 'group') {
                // data for orchards
                payload = { ...self.state.row };
                payload.number = parseInt(payload.number, 10);
            } else {
                const isRowOnBlock = self.state.area === null ? true : false;
                const count = parseInt(self.state.row.count, 10);
                const start = parseInt(self.state.row.number, 10);
                const numberOfTrees = parseInt(self.state.row.numberOfTrees, 10);
                payload = [];
                for (let i = 0; i < count; i++) {
                    payload.push({
                        number: i + start,
                        numberOfTrees,
                    });
                }
                const numberList = payload.map(item => item.number);
                let result;
                if (isRowOnBlock) {
                    result = self.state.block.rows.filter(row => numberList.includes(row.number));
                } else {
                    result = self.state.area.rows.filter(row => numberList.includes(row.number));
                }
                if (result.length > 0) {
                    notify({ message: NotificationMessage.RowExist, type: 'error' });
                    $('#block-ui-container').css('visibility', 'hidden');
                    return;
                }
            }
            dispatchPayload = {
                orchardId: self.state.site.id,
                blockId: self.state.block.id,
                areaId: hasArea ? self.state.area.id : null,
                rowId: hasRow ? self.state.row.id : null,
            };
        }

        const contentType = 'application/json';

        const success = response => {
            let type;
            if (api === 'orchardsites') {
                if (dispatchPayload.orchardId === null) {
                    type = 'CREATE_ORCHARD';
                } else {
                    type = 'UPDATE_ORCHARD';
                }
            }
            if (api === 'blocks') {
                if (dispatchPayload.blockId === null) {
                    type = 'CREATE_BLOCK';
                } else {
                    type = 'UPDATE_BLOCK';
                }
            }
            if (api === 'area') {
                if (dispatchPayload.areaId === null) {
                    type = 'CREATE_AREA';
                } else {
                    type = 'UPDATE_AREA';
                }
            }
            if (api === 'row') {
                if (dispatchPayload.areaId === null && dispatchPayload.rowId === null) {
                    if (self.state.id !== 'group') {
                        type = 'CREATE_ROW_ON_BLOCK';
                    } else {
                        type = 'CREATE_ROWS_ON_BLOCK';
                    }
                }
                if (dispatchPayload.areaId === null && dispatchPayload.rowId !== null) {
                    type = 'UPDATE_ROW_ON_BLOCK';
                }
                if (dispatchPayload.areaId !== null && dispatchPayload.rowId === null) {
                    if (self.state.id !== 'group') {
                        type = 'CREATE_ROW_ON_AREA';
                    } else {
                        type = 'CREATE_ROWS_ON_AREA';
                    }
                }
                if (dispatchPayload.areaId !== null && dispatchPayload.rowId !== null) {
                    type = 'UPDATE_ROW_ON_AREA';
                }
            }
            dispatchPromise(
                {
                    type,
                    payload: {
                        ...dispatchPayload,
                        response,
                    },
                },
                dispatch
            ).then(() => {
                if (api === 'orchardsites') {
                    const index = self.props.orchardSites.findIndex(item => item.id === response.id);
                    self.renderSiteBlockRow({ orchardIndex: index });
                }
                if (api === 'blocks') {
                    // CREATE BLOCK
                    const index = self.props.orchardSites.findIndex(item => item.id === self.state.site.id);
                    const indexs = { orchardIndex: index };
                    if (type === 'UPDATE_BLOCK') {
                        indexs.blockId = dispatchPayload.blockId;
                    }
                    self.renderSiteBlockRow(indexs);
                }
                if (api === 'area') {
                    // CREATE AREA ON BLOCK
                    const index = self.props.orchardSites.findIndex(item => item.id === self.state.site.id);
                    const indexs = { orchardIndex: index, blockId: dispatchPayload.blockId };

                    if (type === 'UPDATE_AREA') {
                        indexs.areaId = dispatchPayload.areaId;
                    }
                    self.renderSiteBlockRow(indexs);
                }
                if (api === 'row') {
                    const index = self.props.orchardSites.findIndex(item => item.id === self.state.site.id);
                    const indexs = { orchardIndex: index, blockId: dispatchPayload.blockId };

                    if (
                        (dispatchPayload.areaId !== null && dispatchPayload.rowId === null) ||
                        (dispatchPayload.areaId !== null && dispatchPayload.rowId !== null)
                    ) {
                        // CREATE ROW ON AREA
                        // CREATE ROWS ON AREA
                        // UPDATE_ROW_ON_AREA
                        indexs.areaId = dispatchPayload.areaId;
                    }

                    self.renderSiteBlockRow(indexs);
                    // else do nothing
                    // CREATE ROW ON BLOCK
                    // CREATE ROWS ON BLOCK
                    // UPDATE ROW ON BLOCK
                }
            });
        };
        const fail = error => handleError(error);

        const response = Utils.handleAjaxRequest(
            url,
            method,
            getHeaders,
            JSON.stringify(payload),
            success,
            fail,
            contentType,
            true
        );

        return response;
    };

const deleteOrchardSite =
    (api, data, self, message, navigateBack, index = 0) =>
    async dispatch => {
        $('#block-ui-container').css('visibility', 'visible');

        let url, payload, type;
        const method = 'DELETE';

        if (api === 'orchardsites') {
            url = `api/metadata/orchardsites/${self.state.site.id}`;
            type = 'DELETE_ORCHARD';
            payload = {
                orchardId: self.state.site.id,
            };
        }
        if (api === 'blocks') {
            url = `api/metadata/orchardsites/${self.state.site.id}/blocks/${self.state.block.id}`;
            type = 'DELETE_BLOCK';
            payload = {
                orchardId: self.state.site.id,
                blockId: self.state.block.id,
            };
        }
        if (api === 'area') {
            url = `api/metadata/orchardsites/${self.state.site.id}/blocks/${self.state.block.id}/areas/${self.state.area.id}`;
            type = 'DELETE_AREA';
            payload = {
                orchardId: self.state.site.id,
                blockId: self.state.block.id,
                areaId: self.state.area.id,
            };
        }
        if (api === 'row') {
            if (self.state.area === null) {
                url = `api/metadata/orchardsites/${self.state.site.id}/blocks/${self.state.block.id}/rows/${self.state.row.id}`;
                type = 'DELETE_ROW_ON_BLOCK';
                payload = {
                    orchardId: self.state.site.id,
                    blockId: self.state.block.id,
                    areaId: null,
                    rowId: self.state.row.id,
                };
            } else {
                url = `api/metadata/orchardsites/${self.state.site.id}/blocks/${self.state.block.id}/areas/${self.state.area.id}/rows/${self.state.row.id}`;
                type = 'DELETE_ROW_ON_AREA';
                payload = {
                    orchardId: self.state.site.id,
                    blockId: self.state.block.id,
                    areaId: self.state.area.id,
                    rowId: self.state.row.id,
                };
            }
        }

        const success = response => {
            dispatchPromise(
                {
                    type,
                    payload,
                },
                dispatch
            ).then(() => {
                if (api === 'orchardsites') {
                    self.renderSiteBlockRow({ orchardIndex: -1 });
                }
                if (api === 'blocks') {
                    const index = self.props.orchardSites.findIndex(item => item.id === self.state.site.id);
                    self.renderSiteBlockRow({ orchardIndex: index });
                }
                if (api === 'area') {
                    const index = self.props.orchardSites.findIndex(item => item.id === self.state.site.id);
                    self.renderSiteBlockRow({ orchardIndex: index, blockId: payload.blockId });
                }
                if (api === 'row') {
                    const index = self.props.orchardSites.findIndex(item => item.id === self.state.site.id);
                    const indexs = { orchardIndex: index, blockId: payload.blockId };
                    if (type === 'DELETE_ROW_ON_AREA') {
                        indexs.areaId = payload.areaId;
                    }
                    self.renderSiteBlockRow(indexs);
                }
            });

            return response;
        };
        const fail = error => handleError(error);

        return Utils.handleAjaxRequest(url, method, getHeaders, {}, success, fail, false, true);
    };

async function saveMetadata(api, data, self, message, navigateBack, index = 0) {
    if (message) $('#block-ui-container').css('visibility', 'visible');
    const formData = new FormData();
    formData.append('Field', self.state.mode);
    formData.append('Index', index);
    if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
            if (api !== 'savecountries') {
                formData.append('Values[' + i + ']', data[i]);
            } else {
                formData.append('Values[' + i + '][name]', data[i].name);
                if (data[i].restrictions && data[i].restrictions.length) {
                    for (let k = 0; k < data[i].restrictions.length; k++) {
                        formData.append('Values[' + i + '][restrictions][]', data[i].restrictions[k]);
                    }
                }
            }
        }
    } else {
        formData.append('Values', data);
    }

    try {
        const response = await postData('api/' + api, formData);
        if (response.code !== 0) throw response.message.content;

        navigateBack();
        self.forceUpdate();
        $('#block-ui-container').css('visibility', 'hidden');

        if (message) notify({ message: message });
    } catch (error) {
        handleError(error);
    }
}

function handleError(error) {
    $('#block-ui-container').css('visibility', 'hidden');
    const status = error.status ? 'Error ' + error.status + ': ' + error.statusText : error.toString();
    notify({ message: status, type: 'error' });

    if (error.status === 401) {
        const url = 'api/logout';
        const method = 'POST';
        const data = {};
        const success = response => {
            window.location.replace('not-logged-in');
            localStorage.removeItem('token');
        };
        const fail = error => {
            console.log(error);
        };

        Utils.handleAjaxRequest(url, method, getHeaders, data, success, fail, false, false);
        notify({ message: NotificationMessage.CredentialExpired, type: 'error' });
    }
}

export const actionCreators = {
    requestData: self => (dispatch, getState) => {
        let headers = getHeaders();
        if (!headers) return;
        $('#block-ui-container').css('visibility', 'visible');

        const url = 'api/metadata';
        const method = 'GET';
        const data = {};
        const success = response => {
            if (response.code !== 0) throw response.message.content;
            var results = response.response;
            results.loading = false;
            console.log('metadata - request before dispatching to redux', results);
            setLocalStorageItem(StorageKey.MetaData, results);
            $.get('localisation/' + results.localisation + '.json', function (response) {
                results.localisations = response;
                dispatch({ type: 'RECEIVE_METADATA', metadata: results });
                $('#block-ui-container').css('visibility', 'hidden');
            });
        };
        const fail = error => {
            $('#block-ui-container').css('visibility', 'hidden');
            if (error.status === 403) {
                Cookies.remove('LOGIN');
                self.props.history.push('/not-logged-in');
            } else handleError(error);
        };

        Utils.handleAjaxRequest(url, method, getHeaders, data, success, fail, false, false);
    },

    saveSite: self => async (dispatch, getState) => {
        if (self.state.site.name.trim().length === 0) {
            notify({ message: self.props.metadata.localisations.Site + ' cannot be blank', type: 'error' });
            return;
        }
        if (self.state.site.code.trim().length === 0) {
            self.state.site.code = self.state.site.name;
        }

        if (self.state.id.length > 0) {
            // self.props.orchardSites[parseInt(self.state.id, 10)] = Object.assign({}, self.state.site);
        } else {
            if (
                self.props.orchardSites.filter(s => s.code === self.state.site.code && s.name === self.state.site.name)
                    .length > 0
            ) {
                notify({ message: self.props.metadata.localisations.Site + ' already exists', type: 'error' });
                return;
            }
            // self.props.orchardSites.push(self.state.site);
        }
        self.props.orchardSites.sort((a, b) =>
            a.name.toLowerCase() + a.code.toLowerCase() > b.name.toLowerCase() + b.code.toLowerCase() ? 1 : -1
        );

        const LotID = self.state.site.lotID;
        if (typeof LotID === 'string') {
            if (window.confirm('Are you sure to change all blocks within this orchard site to the selected lot?')) {
                saveOrchardSite(
                    'orchardsites',
                    self.props.orchardSites,
                    self,
                    self.props.metadata.localisations.Site + ' saved',
                    function () {
                        self.setSite('');
                    }
                )(dispatch);
            }
        } else {
            saveOrchardSite(
                'orchardsites',
                self.props.orchardSites,
                self,
                self.props.metadata.localisations.Site + ' saved',
                function () {
                    self.setSite('');
                }
            )(dispatch);
        }
    },

    deleteSite: self => async (dispatch, getState) => {
        if (window.confirm('Please confirm you want to delete this ' + self.props.metadata.localisations.Site + '?')) {
            // self.props.orchardSites.splice(parseInt(self.state.id, 10), 1);
            deleteOrchardSite(
                'orchardsites',
                self.props.orchardSites,
                self,
                self.props.metadata.localisations.Site + ' deleted',
                function () {
                    self.setSite('');
                }
            )(dispatch);
        }
    },

    saveBlock: self => async (dispatch, getState) => {
        try {
            if (self.state.block.code.trim().length === 0) {
                notify({ message: NotificationMessage.BlockRequired, type: 'error' });
                return;
            }

            var site = self.props.orchardSites.findIndex(
                s => s.code === self.state.site.code && s.name === self.state.site.name
            );
            if (self.state.id.length > 0) {
                // self.props.orchardSites[site].blocks[parseInt(self.state.id, 10)] = Object.assign({}, self.state.block);
            } else {
                // if (!self.props.orchardSites[site].blocks) self.props.orchardSites[site].blocks = [];
                if (self.props.orchardSites[site].blocks.filter(b => b.code === self.state.block.code).length > 0) {
                    notify({ message: NotificationMessage.BlockExist, type: 'error' });
                    return;
                }
                // self.props.orchardSites[site].blocks.push(self.state.block);
            }
            self.props.orchardSites[site].blocks.sort((a, b) =>
                (a.code ? a.code.toLowerCase() : '') > (b.code ? b.code.toLowerCase() : '') ? 1 : -1
            );
            saveOrchardSite(
                'blocks',
                self.props.orchardSites[site],
                self,
                'Block saved',
                function () {
                    self.setBlock('');
                },
                site
            )(dispatch);
        } catch (e) {}
    },

    deleteBlock: self => async (dispatch, getState) => {
        if (window.confirm('Please confirm you want to delete this block?')) {
            var site = self.props.orchardSites.findIndex(
                s => s.code === self.state.site.code && s.name === self.state.site.name
            );
            // self.props.orchardSites[site].blocks.splice(parseInt(self.state.id, 10), 1);
            deleteOrchardSite(
                'blocks',
                self.props.orchardSites[site],
                self,
                'Block deleted',
                function () {
                    self.setBlock('');
                },
                site
            )(dispatch);
        }
    },

    saveArea: self => async (dispatch, getState) => {
        if (self.state.area.code.trim().length === 0) {
            notify({ message: NotificationMessage.AreaRequired, type: 'error' });
            return;
        }

        var site = self.props.orchardSites.findIndex(s => s.id === self.state.site.id);
        var block = self.props.orchardSites[site].blocks.findIndex(b => b.id === self.state.block.id);
        if (self.state.id.length > 0) {
            // self.props.orchardSites[site].blocks[block].areas[parseInt(self.state.id, 10)] = Object.assign({}, self.state.area);
        } else {
            // if (!self.props.orchardSites[site].blocks[block].areas) self.props.orchardSites[site].blocks[block].areas = [];
            if (self.props.orchardSites[site].blocks[block].areas.filter(a => a.id === self.state.area.id).length > 0) {
                notify({ message: NotificationMessage.AreaExist, type: 'error' });
                return;
            }
            // self.props.orchardSites[site].blocks[block].areas.push(self.state.area);
        }
        self.props.orchardSites[site].blocks[block].areas.sort((a, b) =>
            (a.code ? a.code.toLowerCase() : '') > (b.code ? b.code.toLowerCase() : '') ? 1 : -1
        );
        saveOrchardSite(
            'area',
            self.props.orchardSites[site],
            self,
            'Area saved',
            function () {
                self.setArea('');
            },
            site
        )(dispatch);
    },

    deleteArea: self => async (dispatch, getState) => {
        if (window.confirm('Please confirm you want to delete this area?')) {
            var site = self.props.orchardSites.findIndex(
                s => s.code === self.state.site.code && s.name === self.state.site.name
            );
            var block = self.props.orchardSites[site].blocks.findIndex(b => b.code === self.state.block.code);
            // self.props.orchardSites[site].blocks[block].areas.splice(parseInt(self.state.id, 10), 1);
            deleteOrchardSite(
                'area',
                self.props.orchardSites[site],
                self,
                'Area deleted',
                function () {
                    self.setArea('');
                },
                site
            )(dispatch);
        }
    },

    saveRow: self => async (dispatch, getState) => {
        if (!self.state.row.number) {
            notify({ message: NotificationMessage.RowNeedNumber, type: 'error' });
            return;
        }
        if (self.state.id === 'group' && !self.state.row.count) {
            notify({ message: NotificationMessage.RowsNumberRequired, type: 'error' });
            return;
        }
        if (!self.state.row.numberOfTrees) {
            notify({ message: NotificationMessage.TreesNumberRequired, type: 'error' });
            return;
        }

        var siteIndex = self.props.orchardSites.findIndex(
            s => s.code === self.state.site.code && s.name === self.state.site.name
        );
        saveOrchardSite(
            'row',
            self.props.orchardSites[siteIndex],
            self,
            'Row saved',
            function () {
                self.setRow('');
            },
            siteIndex
        )(dispatch);
    },

    deleteRow: self => async (dispatch, getState) => {
        if (window.confirm('Please confirm you want to delete this row?')) {
            var siteIndex = self.props.orchardSites.findIndex(
                s => s.code === self.state.site.code && s.name === self.state.site.name
            );
            deleteOrchardSite(
                'row',
                self.props.orchardSites[siteIndex],
                self,
                'Row deleted',
                function () {
                    self.setRow('');
                },
                siteIndex
            )(dispatch);
        }
    },

    saveValues: self => async (dispatch, getState) => {
        var value = self.state.value;
        if (self.state.mode === 'rates') value = parseFloat(self.state.value);
        else if (self.state.mode === 'pickTypes') value = parseInt(self.state.value, 10);

        if (['rates', 'pickTypes'].indexOf(self.state.mode) >= 0 && isNaN(value)) {
            notify({ message: NotificationMessage.ValueRequired, type: 'error' });
            return;
        } else if (self.state.value.trim().length === 0) {
            notify({ message: NotificationMessage.ValueRequired, type: 'error' });
            return;
        }

        if (self.state.id.length > 0) {
            self.props.metadata[self.state.mode][parseInt(self.state.id, 10)] = value;
        } else {
            if (self.props.metadata[self.state.mode].indexOf(value) >= 0) {
                notify({ message: NotificationMessage.ValueExist, type: 'error' });
                return;
            } else {
                self.props.metadata[self.state.mode].push(value);
            }
        }

        if (['rates', 'pickTypes'].indexOf(self.state.mode) >= 0) {
            self.props.metadata[self.state.mode].sort((a, b) => (a > b ? 1 : -1));
        } else {
            self.props.metadata[self.state.mode].sort((a, b) => (a.toLowerCase() > b.toLowerCase() ? 1 : -1));
        }
        await saveMetadata(
            'save' + self.state.mode.toLowerCase(),
            self.props.metadata[self.state.mode],
            self,
            'Value saved',
            function () {
                self.setId('');
            }
        );
    },

    deleteValue: self => async (dispatch, getState) => {
        if (window.confirm('Please confirm you want to delete this value?')) {
            self.props.metadata[self.state.mode].splice(parseInt(self.state.id, 10), 1);
            await saveMetadata(
                'save' + self.state.mode.toLowerCase(),
                self.props.metadata[self.state.mode],
                self,
                'Value deleted',
                function () {
                    self.setId('');
                }
            );
        }
    },
};

const localMetaData = getLocalStorageItem(StorageKey.MetaData);

export const unloadedState = {
    metadata: {
        loading: true,
        accountType: '',
        staff: [],
        blocks: [],
        areas: [],
        contractors: [],
        exportationCountries: [],
        localisations: {},
        mobileOptions: [],
        pickTypes: [],
        qcDefects: [],
        qualities: [],
        rates: [],
        tasktypes: [],
        treatments: [],
        varieties: [],
        options: localMetaData
            ? localMetaData.options
            : {
                  enableOvertimeFeature: true,
                  hasLots: true,
                  hasSectors: true,
                  hasSpray: true,
                  orchardLocationVersion2: true,
                  seeInsights: true,
              },
        payroll: {},
        orchardSites: [],
        oldOrchardSites: [],
        activityTypes: [],
        jobTypes: [],
        defaults: {},
        sectors: [],
        defects: {
            picker: [
                {
                    id: '1',
                    name: 'pcker1',
                    highlightFigure: 8,
                },
            ],
            cosmetic: [
                {
                    id: '1',
                    name: 'cosmetic1',
                    highlightFigure: 8,
                },
            ],
            pest: [
                {
                    id: '1',
                    name: 'Pp1',
                    highlightFigure: 8,
                },
            ],
        },
    },
    sectors: [],
    orchardSites: [],
    varieties: [],
};

export const reducer = (state, action) => {
    if (action.type === 'RECEIVE_METADATA')
        return {
            ...state,
            metadata: { ...state.metadata, ...action.metadata },
        };
    if (action.type === 'FETCH_ORCHARDSITES')
        return {
            ...state,
            orchardSites: action.payload || [],
        };
    if (action.type === 'CREATE_ORCHARD')
        return {
            ...state,
            orchardSites: [...state.orchardSites, action.payload.response],
        };
    if (action.type === 'UPDATE_ORCHARD')
        return {
            ...state,
            orchardSites: state.orchardSites.map(orchard =>
                orchard.id === action.payload.orchardId ? action.payload.response : orchard
            ),
        };
    if (action.type === 'DELETE_ORCHARD')
        return {
            ...state,
            orchardSites: state.orchardSites.filter(orchard => orchard.id !== action.payload.orchardId),
        };
    if (action.type === 'CREATE_BLOCK')
        return {
            ...state,
            orchardSites: state.orchardSites.map(orchard => {
                return orchard.id === action.payload.orchardId
                    ? { ...orchard, blocks: [...orchard.blocks, action.payload.response] }
                    : orchard;
            }),
        };
    if (action.type === 'UPDATE_BLOCK')
        return {
            ...state,
            orchardSites: state.orchardSites.map(orchard => {
                return orchard.id === action.payload.orchardId
                    ? {
                          ...orchard,
                          blocks: orchard.blocks.map(block =>
                              block.id === action.payload.blockId ? action.payload.response : block
                          ),
                      }
                    : orchard;
            }),
        };
    if (action.type === 'DELETE_BLOCK')
        return {
            ...state,
            orchardSites: state.orchardSites.map(orchard => {
                return orchard.id === action.payload.orchardId
                    ? { ...orchard, blocks: orchard.blocks.filter(block => block.id !== action.payload.blockId) }
                    : orchard;
            }),
        };
    if (action.type === 'CREATE_AREA')
        return {
            ...state,
            orchardSites: state.orchardSites.map(orchard => {
                return orchard.id === action.payload.orchardId
                    ? {
                          ...orchard,
                          blocks: orchard.blocks.map(block =>
                              block.id === action.payload.blockId
                                  ? { ...block, areas: [...block.areas, action.payload.response] }
                                  : block
                          ),
                      }
                    : orchard;
            }),
        };
    if (action.type === 'UPDATE_AREA')
        return {
            ...state,
            orchardSites: state.orchardSites.map(orchard => {
                return orchard.id === action.payload.orchardId
                    ? {
                          ...orchard,
                          blocks: orchard.blocks.map(block =>
                              block.id === action.payload.blockId
                                  ? {
                                        ...block,
                                        areas: block.areas.map(area =>
                                            area.id === action.payload.areaId ? action.payload.response : area
                                        ),
                                    }
                                  : block
                          ),
                      }
                    : orchard;
            }),
        };
    if (action.type === 'DELETE_AREA')
        return {
            ...state,
            orchardSites: state.orchardSites.map(orchard => {
                return orchard.id === action.payload.orchardId
                    ? {
                          ...orchard,
                          blocks: orchard.blocks.map(block =>
                              block.id === action.payload.blockId
                                  ? { ...block, areas: block.areas.filter(area => area.id !== action.payload.areaId) }
                                  : block
                          ),
                      }
                    : orchard;
            }),
        };
    if (action.type === 'CREATE_ROW_ON_AREA')
        return {
            ...state,
            orchardSites: state.orchardSites.map(orchard => {
                return orchard.id === action.payload.orchardId
                    ? {
                          ...orchard,
                          blocks: orchard.blocks.map(block => {
                              return block.id === action.payload.blockId
                                  ? {
                                        ...block,
                                        areas: block.areas.map(area => {
                                            return area.id === action.payload.areaId
                                                ? { ...area, rows: [...area.rows, action.payload.response] }
                                                : area;
                                        }),
                                    }
                                  : block;
                          }),
                      }
                    : orchard;
            }),
        };
    if (action.type === 'CREATE_ROWS_ON_AREA')
        return {
            ...state,
            orchardSites: state.orchardSites.map(orchard => {
                return orchard.id === action.payload.orchardId
                    ? {
                          ...orchard,
                          blocks: orchard.blocks.map(block => {
                              return block.id === action.payload.blockId
                                  ? {
                                        ...block,
                                        areas: block.areas.map(area => {
                                            return area.id === action.payload.areaId
                                                ? { ...area, rows: [...area.rows, ...action.payload.response] }
                                                : area;
                                        }),
                                    }
                                  : block;
                          }),
                      }
                    : orchard;
            }),
        };
    if (action.type === 'UPDATE_ROW_ON_AREA')
        return {
            ...state,
            orchardSites: state.orchardSites.map(orchard => {
                return orchard.id === action.payload.orchardId
                    ? {
                          ...orchard,
                          blocks: orchard.blocks.map(block => {
                              return block.id === action.payload.blockId
                                  ? {
                                        ...block,
                                        areas: block.areas.map(area => {
                                            return area.id === action.payload.areaId
                                                ? {
                                                      ...area,
                                                      rows: area.rows.map(row =>
                                                          row.id === action.payload.rowId
                                                              ? action.payload.response
                                                              : row
                                                      ),
                                                  }
                                                : area;
                                        }),
                                    }
                                  : block;
                          }),
                      }
                    : orchard;
            }),
        };
    if (action.type === 'DELETE_ROW_ON_AREA')
        return {
            ...state,
            orchardSites: state.orchardSites.map(orchard => {
                return orchard.id === action.payload.orchardId
                    ? {
                          ...orchard,
                          blocks: orchard.blocks.map(block => {
                              return block.id === action.payload.blockId
                                  ? {
                                        ...block,
                                        areas: block.areas.map(area => {
                                            return area.id === action.payload.areaId
                                                ? {
                                                      ...area,
                                                      rows: area.rows.filter(row => row.id !== action.payload.rowId),
                                                  }
                                                : area;
                                        }),
                                    }
                                  : block;
                          }),
                      }
                    : orchard;
            }),
        };
    if (action.type === 'CREATE_ROW_ON_BLOCK')
        return {
            ...state,
            orchardSites: state.orchardSites.map(orchard => {
                return orchard.id === action.payload.orchardId
                    ? {
                          ...orchard,
                          blocks: orchard.blocks.map(block => {
                              return block.id === action.payload.blockId
                                  ? {
                                        ...block,
                                        rows:
                                            block.rows !== null
                                                ? [...block.rows, action.payload.response]
                                                : [action.payload.response],
                                    }
                                  : block;
                          }),
                      }
                    : orchard;
            }),
        };
    if (action.type === 'CREATE_ROWS_ON_BLOCK')
        return {
            ...state,
            orchardSites: state.orchardSites.map(orchard => {
                return orchard.id === action.payload.orchardId
                    ? {
                          ...orchard,
                          blocks: orchard.blocks.map(block => {
                              return block.id === action.payload.blockId
                                  ? {
                                        ...block,
                                        rows:
                                            block.rows !== null
                                                ? [...block.rows, ...action.payload.response]
                                                : [action.payload.response],
                                    }
                                  : block;
                          }),
                      }
                    : orchard;
            }),
        };
    if (action.type === 'UPDATE_ROW_ON_BLOCK')
        return {
            ...state,
            orchardSites: state.orchardSites.map(orchard => {
                return orchard.id === action.payload.orchardId
                    ? {
                          ...orchard,
                          blocks: orchard.blocks.map(block =>
                              block.id === action.payload.blockId
                                  ? {
                                        ...block,
                                        rows: block.rows.map(row =>
                                            row.id === action.payload.rowId ? action.payload.response : row
                                        ),
                                    }
                                  : block
                          ),
                      }
                    : orchard;
            }),
        };
    if (action.type === 'DELETE_ROW_ON_BLOCK')
        return {
            ...state,
            orchardSites: state.orchardSites.map(orchard => {
                return orchard.id === action.payload.orchardId
                    ? {
                          ...orchard,
                          blocks: orchard.blocks.map(block =>
                              block.id === action.payload.blockId
                                  ? {
                                        ...block,
                                        rows: block.rows.filter(row => row.id !== action.payload.rowId),
                                    }
                                  : block
                          ),
                      }
                    : orchard;
            }),
        };
    if (action.type === 'FETCH_VARIETIES')
        return {
            ...state,
            varieties: action.payload || [],
        };

    if (action.type === 'FETCH_LOTS')
        return {
            ...state,
            lots: action.payload || [],
        };
    if (action.type === 'CREATE_LOT')
        return {
            ...state,
            lots: [...state.lots, action.payload],
        };
    if (action.type === 'UPDATE_LOT')
        return {
            ...state,
            lots: state.lots.map(item => (item.id === action.payload.id ? action.payload : item)),
        };
    if (action.type === 'DELETE_LOT')
        return {
            ...state,
            lots: state.lots.filter(item => item.id !== action.payload),
        };
    if (action.type === 'FETCH_SECTORS')
        return {
            ...state,
            sectors: action.payload || [],
        };
    if (action.type === 'CREATE_SECTOR')
        return {
            ...state,
            sectors: [...state.sectors, action.payload],
        };
    if (action.type === 'UPDATE_SECTOR')
        return {
            ...state,
            sectors: state.sectors.map(item => (item.id === action.payload.id ? action.payload : item)),
        };
    if (action.type === 'DELETE_SECTOR')
        return {
            ...state,
            sectors: state.sectors.filter(item => item.id !== action.payload),
        };

    return state || unloadedState;
};
