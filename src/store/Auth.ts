import { getLocalStorageItem, setLocalStorageItem, StorageKey } from 'src/helpers/storage';

enum ActionType {
    SetAuth = 'SET_AUTH',
    SetAuthOption = 'SET_AUTH_OPTION',
}
export const setAuth = (data: AuthState) => ({
    type: ActionType.SetAuth,
    payload: data,
});

export const setAuthOption = (data: AuthOptionState) => ({
    type: ActionType.SetAuthOption,
    payload: data,
});

export type AccessToken = {
    User: AuthState;
    AccountType: string;
    Auth: any;
    OrchardId: string;
};

interface AuthState {
    canLogin: boolean;
    canEditAdmin: boolean;
    canSeeFinancials: boolean;
    spectreModule?: {
        spectreOwner: boolean;
        spectreAdmin: boolean;
    };
    accountType: string;
    hasFullDashboardAccess: boolean;
}

interface AuthOptionState {
    enableOvertimeFeature: boolean;
    hasLots: boolean;
    hasSectors: boolean;
    hasSpray: boolean;
    orchardLocationVersion2: boolean;
    seeInsights: boolean;
}

export type AuthStoreState = AuthOptionState & AuthState;

const localAuthState = getLocalStorageItem(StorageKey.AuthDetail);

const initialState: AuthStoreState = localAuthState
    ? localAuthState
    : {
          canLogin: false,
          canEditAdmin: false,
          canSeeFinancials: false,
          spectreModule: undefined,
          hasSpray: false,
          hasLots: false,
          hasSectors: false,
          seeInsights: false,
          orchardLocationVersion2: false,
          enableOvertimeFeature: false,
          hasFullDashboardAccess: false,
      };

export const authReducer = (state = initialState, action: { type: string; payload: AuthState }) => {
    switch (action.type) {
        case ActionType.SetAuth:
        case ActionType.SetAuthOption:
            const newState = {
                ...state,
                ...action.payload,
            };
            setLocalStorageItem(StorageKey.AuthDetail, newState);
            return newState;
        default:
            return state;
    }
};
