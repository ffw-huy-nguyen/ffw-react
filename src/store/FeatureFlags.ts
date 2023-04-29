import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { getData } from 'src/ApiService';
import { ApiEndpoint } from 'src/ApiService/ApiEndpoint';
import { notify } from 'src/components_v2/common/Notification';
import { NotificationMessage } from 'src/DataContracts/NotificationMessage';

const getOvertimeFlag = async (): Promise<boolean | undefined> => {
    return getData<boolean>(ApiEndpoint.OvertimeFeatureFlag)
        .then(x => {
            return x;
        })
        .catch(() => {
            notify({ message: NotificationMessage.ErrorTryAgain, type: 'error' });
            return undefined;
        });
};

export const useFetchOvertimeFlag = () => {
    const dispatch = useDispatch();

    const fetchOvertimeFlag = async () => {
        const overtimeFlag = await getOvertimeFlag();
        localStorage.setItem('overtimeFlag', JSON.stringify(overtimeFlag));
        dispatch({
            type: 'SET_OVERTIMEFLAG',
            payload: overtimeFlag,
        });
    };
    return fetchOvertimeFlag;
};

const unloadedState = {
    overtimeFlag: Boolean(localStorage.getItem('overtimeFlag')),
};

export const reducer = (state = unloadedState, action: { type: string; payload: boolean }) => {
    switch (action.type) {
        case 'SET_OVERTIMEFLAG':
            return {
                ...state,
                overtimeFlag: action.payload,
            };
        default:
            return state;
    }
};
