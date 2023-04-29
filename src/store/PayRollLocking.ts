import { getLocalStorageItem, setLocalStorageItem, StorageKey } from 'src/helpers/storage';

export interface LockingPayrollState {
    isActive?: boolean;
    startDate?: Date;
    endDate?: Date;
    isLockedPayRunSelected?: boolean;
    isPreviousPayRunSelected?: boolean;
    id?: string;
    unlockExpireAt?: number;
}

enum ActionType {
    SetSelectPayRun = 'SET_SELECT_PAY_RUN',
    ResetSelectPayRun = 'RESET_SELECT_PAY_RUN',
}

export const setPayrollLocking = (data: LockingPayrollState) => ({
    type: ActionType.SetSelectPayRun,
    payload: data,
});

export const resetPayrollLocking = () => ({
    type: ActionType.ResetSelectPayRun,
});

const localState = getLocalStorageItem(StorageKey.PayrollLocking);

export const payrollLockingDefaultData = {
    isActive: false,
    id: undefined,
    unlockExpireAt: undefined,
    startDate: undefined,
    endDate: undefined,
    isLockedPayRunSelected: false,
    isPreviousPayRunSelected: false,
    orchardId: undefined,
    creationDate: undefined,
};

const initialState: LockingPayrollState = localState ? localState : payrollLockingDefaultData;

const getUnlockExpireAt = (unlockExpireAt?: number) => {
    return unlockExpireAt && unlockExpireAt * 1000 > new Date().getTime() ? unlockExpireAt : undefined;
};

export const payrollLockingReducer = (state = initialState, action: { type: string; payload: LockingPayrollState }) => {
    switch (action.type) {
        case ActionType.SetSelectPayRun:
            const newState = {
                ...state,
                ...action.payload,
                unlockExpireAt: getUnlockExpireAt(action.payload.unlockExpireAt),
            };
            setLocalStorageItem(StorageKey.PayrollLocking, newState);
            return newState;
        case ActionType.ResetSelectPayRun:
            setLocalStorageItem(StorageKey.PayrollLocking, payrollLockingDefaultData);
            return payrollLockingDefaultData;
        default:
            return state;
    }
};
