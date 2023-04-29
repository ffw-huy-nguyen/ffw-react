import { routerMiddleware, routerReducer } from 'react-router-redux';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { authReducer } from './Auth';
import * as FeatureFlags from './FeatureFlags';
import * as Harvest from './Harvest';
import * as Insights from './Insights';
import * as LoadingPage from './LoadingPage';
import * as Maps from './Maps';
import * as Metadata from './Metadata';
import * as Payroll from './Payroll';
import { payrollLockingReducer } from './PayRollLocking';
import * as Picking from './Picking';
import * as Scout from './Scout';
import * as Timesheets from './Timesheets';

import inventoryReducer from '../redux/inventory/inventory.reducer';

export default function configureStore(history, initialState) {
    const reducers = {
        metadata: Metadata.reducer,
        harvest: Harvest.reducer,
        picking: Picking.reducer,
        payroll: Payroll.reducer,
        timesheets: Timesheets.reducer,
        maps: Maps.reducer,
        insights: Insights.reducer,
        scout: Scout.reducer,
        inventory: inventoryReducer,
        featureFlags: FeatureFlags.reducer,
        auth: authReducer,
        loadingPageFlag: LoadingPage.reducer,
        payrollLocking: payrollLockingReducer,
    };

    const middleware = [thunk, routerMiddleware(history)];

    // In development, use the browser's Redux dev tools extension if installed
    const enhancers = [];
    const isDevelopment = process.env.NODE_ENV === 'development';
    if (isDevelopment && typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
        enhancers.push(window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__());
    }

    const rootReducer = combineReducers({
        ...reducers,
        routing: routerReducer,
    });

    return createStore(rootReducer, initialState, compose(applyMiddleware(...middleware), ...enhancers));
}
