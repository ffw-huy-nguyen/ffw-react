import {
    GO_BACK,
    INIT_INVENTORY_COLUMNS,
    INIT_INVENTORY_DATA,
    INIT_INVENTORY_OPERATORS_DATA,
    INIT_INVENTORY_STORAGE_DATA,
    SELECT_DATE,
    FETCH_CHEMICAL_TYPES,
    UPDATE_ORDER_ID,
    FETCH_OPERATORS_LIST,
    UPDATE_RECEIVED_BY,
    FETCH_SUPPLIER_LIST,
    SELECT_SUPPLIER,
    ADD_CHEM_ROW,
    DELETE_CHEM_ROW,
    ADD_SUB_ROW,
    DELETE_SUB_ROW,
    FETCH_PRODUCTS,
    SELECT_CHEM_TYPE,
    SELECT_CHEM_NAME,
    SET_PRICE,
    SET_QUANTITY,
    FETCH_LOCATION_LIST,
    SET_LOCATION,
    CLEAR_NEW_INVENTORY
} from './inventory.types';
import { localAPI, sprayAPI } from './inventory.apis';

export const setTabIndex = index => dispatch => {
    dispatch({ type: GO_BACK, payload: index });
};

export const fetchInventoryCols = () => async dispatch => {
    const colByType = [
        {
            title: 'Supplier',
            field: 'supplier',
            render: rowData => {
                return rowData.parentId ? null : rowData.supplier;
            }
        },
        {
            title: 'Chemical Type',
            field: 'chemicalType'
        },
        { title: 'Chemical Name', field: 'name' },
        { title: 'Quantity', field: 'quantity' },
        { title: 'Stock At', field: 'location' }
    ];
    const colByLocation = [
        {
            title: 'Stock At',
            field: 'location',
            render: rowData => {
                return rowData.parentId ? null : rowData.location;
            }
        },
        { title: 'Chemical Type', field: 'chemicalType' },
        { title: 'Chemical Name', field: 'name' },
        { title: 'Quantity', field: 'quantity' }
    ];
    const payload = {
        byType: colByType,
        byLocation: colByLocation
    };
    dispatch({ type: INIT_INVENTORY_COLUMNS, payload });
};

export const fetchInventoryData = () => async dispatch => {
    const flatProducts = await sprayAPI.get('/api/spray/inventory');
    const supplierRef = await sprayAPI.get('/api/spray/suppliers');
    const supplierList = supplierRef.data.data ?? supplierRef.data;
    const storageRef = await sprayAPI.get('/api/spray/storages');
    const storageList = storageRef.data.data;
    const chemicalTypeRef = await sprayAPI.get('/api/spray/chemicaltypes');
    const typeList = chemicalTypeRef.data.data ?? chemicalTypeRef.data;
    console.log('flatProducts', flatProducts);

    const groupBySupplierId = flatProducts.data.data.reduce((acc, item) => {
        acc[item.product.supplierId] = [
            ...(acc[item.product.supplierId] || []),
            item
        ];
        return acc;
    }, {});

    const groupByStorageSiteId = flatProducts.data.data.reduce((acc, item) => {
        acc[item.storageSiteId] = [...(acc[item.storageSiteId] || []), item];
        return acc;
    }, {});
    console.log('groupBySupplierId', groupBySupplierId);
    console.log('groupByStorageSiteId', groupByStorageSiteId);
    // add if only one supplier and hide supplier col in future

    // if the supplier is more then one

    const findChemType = (chemTypeId, typeList) => {
        const type = typeList.find(t => t.id === chemTypeId);
        const typeName = type.name;
        return typeName;
    };

    const createDataBySupplier = () => {
    // create parents row by type by supplier
        let parentRows = Object.keys(groupBySupplierId).map(supplierId => {
            const supplier = supplierList.find(s => (s.id = supplierId));
            const supplierName = supplier.name;
            return {
                id: supplierId,
                supplier: supplierName,
                chemicalType: '',
                name: '',
                quantity: '',
                location: ''
            };
        });

        // create data by type by supplier
        let childRows = [];
        Object.values(groupBySupplierId).map(arr => {
            arr.map(item =>
                childRows.push({
                    ...item,
                    parentId: item.product.supplierId,
                    chemicalType: findChemType(item.product.chemicalTypeId, typeList),
                    name: item.product.name,
                    location: item.storageSite.name
                })
            );
        });
        const dataByType = [...parentRows, ...childRows];
        return dataByType;
    };

    const createDataByStorageSite = () => {
        const parentRows = Object.keys(groupByStorageSiteId).map(storageSiteId => {
            const storage = storageList.find(s => s.id === storageSiteId);
            const storageName = storage.name;
            return {
                id: storageSiteId,
                chemicalType: '',
                name: '',
                quantity: '',
                location: storageName
            };
        });
        let childRows = [];
        Object.values(groupByStorageSiteId).map((arr, i) => {
            arr.map(item =>
                childRows.push({
                    ...item,
                    parentId: item.storageSiteId,
                    chemicalType: findChemType(item.product.chemicalTypeId, typeList),
                    name: item.product.name,
                    location: item.storageSite.name
                })
            );
        });
        const dataByLocation = [...parentRows, ...childRows];
        return dataByLocation;
    };

    let dataBySupplier = createDataBySupplier();

    let dataByStorageSite = createDataByStorageSite();

    const payload = {
        byType: dataBySupplier,
        byLocation: dataByStorageSite
    };
    dispatch({ type: INIT_INVENTORY_DATA, payload });
};

export const fetchInventoryStorageData = () => async dispatch => {
    const response = await localAPI.get('/inventoryStorageData');
    dispatch({
        type: INIT_INVENTORY_STORAGE_DATA,
        payload: response.data
    });
};

export const fetchInventoryOperatorsData = () => async dispatch => {
    const response = await localAPI.get('/inventoryOperatorsData');
    dispatch({
        type: INIT_INVENTORY_OPERATORS_DATA,
        payload: response.data
    });
};

// Create new inventory page
export const selectDate = date => dispatch => {
    dispatch({
        type: SELECT_DATE,
        payload: date
    });
};

export const updateOrderId = id => dispatch => {
    dispatch({
        type: UPDATE_ORDER_ID,
        payload: id
    });
};

export const fetchOperatorsList = () => async dispatch => {
    const response = await sprayAPI.get('/api/spray/operators');
    dispatch({
        type: FETCH_OPERATORS_LIST,
        payload: response.data
    });
};

export const updateRecievedBy = name => dispatch => {
    dispatch({
        type: UPDATE_RECEIVED_BY,
        payload: name
    });
};

export const fetchSupplierList = () => async dispatch => {
    const response = await sprayAPI.get('/api/spray/suppliers');
    dispatch({
        type: FETCH_SUPPLIER_LIST,
        payload: response.data
    });
};

export const selectSupplier = supplier => dispatch => {
    dispatch({
        type: SELECT_SUPPLIER,
        payload: supplier
    });
};

export const addChemRow = () => (dispatch, getState) => {
    const products = getState().inventory.newInventory.products;
    const id = products[products.length - 1].id + 1;
    let chem = {
        id: id,
        chemType: '',
        name: '',
        price: 0,
        locations: [
            {
                location: '',
                quantity: 0
            }
        ]
    };
    // check if locationList only have one address
    const locationList = getState().inventory.locationList.data;
    if (locationList.length === 1) {
    // set the address as selected
        chem.locations[0].location = locationList[0].name;
    }
    dispatch({
        type: ADD_CHEM_ROW,
        payload: chem
    });
};

export const deleteChemRow = id => dispatch => {
    dispatch({
        type: DELETE_CHEM_ROW,
        payload: id
    });
};

export const addSubRow = id => (dispatch, getState) => {
    let payload = {
        id,
        newItem: {
            location: '',
            quantity: 0
        }
    };
    // check if locationList only have one value
    const locationList = getState().inventory.locationList.data;
    if (locationList.length === 1) {
    // set the address as selected
        payload.newItem.location = locationList[0].name;
    }
    dispatch({
        type: ADD_SUB_ROW,
        payload
    });
};

export const deleteSubRow = (productId, locationIndex) => dispatch => {
    const payload = { productId, locationIndex };
    dispatch({
        type: DELETE_SUB_ROW,
        payload
    });
};

export const fetchChemicalTypes = () => async dispatch => {
    const response = await sprayAPI.get('/api/spray/chemicaltypes');
    const types = response.data;
    dispatch({
        type: FETCH_CHEMICAL_TYPES,
        payload: types
    });
};

export const fetchProducts = () => async dispatch => {
    const response = await sprayAPI.get('/api/spray/products');
    const products = response.data.data;
    const groupedProducts = products.reduce((acc, item) => {
        acc[item.chemicalTypeId] = [...(acc[item.chemicalTypeId] || []), item];
        return acc;
    }, {});
    dispatch({
        type: FETCH_PRODUCTS,
        payload: { products, groupedProducts }
    });
};

export const selectChemType = (type, productId) => dispatch => {
    const payload = { type, productId };
    dispatch({
        type: SELECT_CHEM_TYPE,
        payload
    });
};

export const selectChemName = (name, productId) => dispatch => {
    const payload = { name, productId };
    dispatch({
        type: SELECT_CHEM_NAME,
        payload
    });
};

export const setPrice = (priceStr, productId) => dispatch => {
    const price = parseInt(priceStr);
    const payload = { price, productId };
    dispatch({
        type: SET_PRICE,
        payload
    });
};

export const setQuantity = (
    quantityStr,
    productId,
    locationIndex
) => dispatch => {
    const quantity = parseInt(quantityStr);
    const payload = { quantity, productId, locationIndex };
    dispatch({
        type: SET_QUANTITY,
        payload
    });
};

export const fetchLocationList = () => async dispatch => {
    const response = await sprayAPI.get('/api/spray/storages');
    const locations = response.data;

    dispatch({
        type: FETCH_LOCATION_LIST,
        payload: locations
    });
    // check if there is only one address
    // set it as location selected
    if (locations.data.length === 1) {
        const payload = {
            name: locations.data[0].name,
            productId: 1,
            locationIndex: 0
        };
        dispatch({
            type: SET_LOCATION,
            payload
        });
    }
};

export const setLocation = (name, productId, locationIndex) => dispatch => {
    const payload = { name, productId, locationIndex };
    dispatch({
        type: SET_LOCATION,
        payload
    });
};

export const postInventoryHistory = history => async (dispatch, getState) => {
    const payloadModel = {
        purchaseOrderId: '',
        date: '2019-12-23T01:04:26.1245524Z',
        total: 0,
        note: {
            name: '',
            text: ''
        },
        receiverId: '',
        supplierId: '',
        details: [
            {
                productId: '',
                quantity: 0,
                price: 0
            }
        ]
    };
    const newInventory = getState().inventory.newInventory;
    let details = [];
    let totalPrice = 0;
    let payload = { ...payloadModel };

    newInventory.products.map(product => {
        product.locations.map(item => {
            let tempDetail = {
                productId: '',
                quantity: 0,
                price: 0,
                storageSiteId: ''
            };

            tempDetail.productId = product.name;
            tempDetail.price = product.price;
            tempDetail.quantity = item.quantity;
            tempDetail.storageSiteId = item.location;

            details.push(tempDetail);
        });

        const price = product.price;
        const amounts = product.locations.reduce((acc, item) => {
            acc += item.quantity;
            return acc;
        }, 0);
        totalPrice += price * amounts;
    });

    payload.purchaseOrderId = newInventory.orderId;
    payload.date = newInventory.selectedDate;
    payload.note = newInventory.notes;
    payload.receiverId = newInventory.receivedBy;
    payload.supplierId = newInventory.selectedSupplier;
    payload.total = totalPrice;
    payload.details = details;

    console.log('p', payload);
    const response = await sprayAPI
        .post('/api/spray/purchaseOrders', payload)
        .then(response => {
            console.log('ok', response);
            dispatch({
                type: CLEAR_NEW_INVENTORY
            });
            history.push('/spray');
        })
        .catch(err => console.log(err));
};
