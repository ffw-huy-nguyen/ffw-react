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

const newInventoryModel = {
    selectedDate: new Date(),
    orderId: 0,

    selectedSupplier: '',
    receivedBy: '',
    notes: {
        name: '',
        text: ''
    },
    photos: [],
    productList: [],
    groupedProducts: [],

    products: [
        {
            id: 1,
            chemType: '',
            name: '',
            price: 0,
            locations: [
                {
                    location: '',
                    quantity: 0
                }
            ]
        }
    ]
};

const INITIAL_STATE = {
    newInventory: newInventoryModel,
    chemicalTypeList: { data: [], paginationDetails: {} },
    supplierList: { data: [], paginationDetails: {} },
    operatorList: { data: [], paginationDetails: {} },
    locationList: { data: [], paginationDetails: {} },
    goBackTabIndex: 0,
    purchaseOrdersData: [],
    inventoryData: { byType: [], byLocation: [] },
    inventoryColumns: { byType: [], byLocation: [] },
    operatorsData: [],
    storageData: []
};

const inventoryReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
    case GO_BACK:
        return {
            ...state,
            goBackTabIndex: action.payload
        };
    case INIT_INVENTORY_COLUMNS:
        return {
            ...state,
            inventoryColumns: {
                byType: action.payload.byType,
                byLocation: action.payload.byLocation
            }
        };
    case INIT_INVENTORY_DATA:
        return {
            ...state,
            inventoryData: {
                byType: action.payload.byType,
                byLocation: action.payload.byLocation
            }
        };
    case INIT_INVENTORY_OPERATORS_DATA:
        return {
            ...state,
            operatorsData: action.payload
        };
    case INIT_INVENTORY_STORAGE_DATA:
        return {
            ...state,
            storageData: action.payload
        };
    case SELECT_DATE:
        return {
            ...state,
            newInventory: {
                ...state.newInventory,
                selectedDate: action.payload
            }
        };
    case FETCH_CHEMICAL_TYPES:
        return {
            ...state,
            chemicalTypeList: action.payload
        };
    case UPDATE_ORDER_ID:
        return {
            ...state,
            newInventory: {
                ...state.newInventory,
                orderId: action.payload
            }
        };
    case FETCH_OPERATORS_LIST:
        return {
            ...state,
            operatorList: action.payload
        };
    case UPDATE_RECEIVED_BY:
        return {
            ...state,
            newInventory: {
                ...state.newInventory,
                receivedBy: action.payload
            }
        };
    case FETCH_SUPPLIER_LIST:
        return {
            ...state,
            supplierList: action.payload
        };
    case SELECT_SUPPLIER:
        return {
            ...state,
            newInventory: {
                ...state.newInventory,
                selectedSupplier: action.payload
            }
        };
    case ADD_CHEM_ROW:
        return {
            ...state,
            newInventory: {
                ...state.newInventory,
                products: [...state.newInventory.products, action.payload]
            }
        };
    case DELETE_CHEM_ROW:
        return {
            ...state,
            newInventory: {
                ...state.newInventory,
                products: state.newInventory.products.filter(
                    item => item.id !== action.payload
                )
            }
        };
    case ADD_SUB_ROW:
        return {
            ...state,
            newInventory: {
                ...state.newInventory,
                products: state.newInventory.products.map(item =>
                    item.id === action.payload.id
                        ? {
                            ...item,
                            locations: [...item.locations, action.payload.newItem]
                        }
                        : item
                )
            }
        };
    case DELETE_SUB_ROW:
        return {
            ...state,
            newInventory: {
                ...state.newInventory,
                products: state.newInventory.products.map(item =>
                    item.id === action.payload.productId
                        ? {
                            ...item,
                            locations: item.locations.filter(
                                (location, index) => index !== action.payload.locationIndex
                            )
                        }
                        : item
                )
            }
        };
    case FETCH_PRODUCTS:
        return {
            ...state,
            newInventory: {
                ...state.newInventory,
                productList: action.payload.products,
                groupedProducts: action.payload.groupedProducts
            }
        };
    case SELECT_CHEM_TYPE:
        return {
            ...state,
            newInventory: {
                ...state.newInventory,
                products: state.newInventory.products.map(item =>
                    item.id === action.payload.productId
                        ? {
                            ...item,
                            chemType: action.payload.type
                        }
                        : item
                )
            }
        };
    case SELECT_CHEM_NAME:
        return {
            ...state,
            newInventory: {
                ...state.newInventory,
                products: state.newInventory.products.map(item =>
                    item.id === action.payload.productId
                        ? {
                            ...item,
                            name: action.payload.name
                        }
                        : item
                )
            }
        };
    case SET_PRICE:
        return {
            ...state,
            newInventory: {
                ...state.newInventory,
                products: state.newInventory.products.map(item =>
                    item.id === action.payload.productId
                        ? {
                            ...item,
                            price: action.payload.price
                        }
                        : item
                )
            }
        };
    case SET_QUANTITY:
        return {
            ...state,
            newInventory: {
                ...state.newInventory,
                products: state.newInventory.products.map(item =>
                    item.id === action.payload.productId
                        ? {
                            ...item,
                            locations: item.locations.map((location, i) =>
                                i === action.payload.locationIndex
                                    ? { ...location, quantity: action.payload.quantity }
                                    : location
                            )
                        }
                        : item
                )
            }
        };
    case FETCH_LOCATION_LIST:
        return {
            ...state,
            locationList: action.payload
        };
    case SET_LOCATION:
        return {
            ...state,
            newInventory: {
                ...state.newInventory,
                products: state.newInventory.products.map(item =>
                    item.id === action.payload.productId
                        ? {
                            ...item,
                            locations: item.locations.map((l, i) =>
                                i === action.payload.locationIndex
                                    ? { ...l, location: action.payload.name }
                                    : l
                            )
                        }
                        : item
                )
            }
        };
    case CLEAR_NEW_INVENTORY:
        return {
            ...state,
            newInventory: newInventoryModel
        };
    default:
        return state;
    }
};

export default inventoryReducer;
