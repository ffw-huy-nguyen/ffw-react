import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getFormattedYearMonthDay } from 'src/helpers/date';
import { LockingPayrollState, resetPayrollLocking, setPayrollLocking } from 'src/store/PayRollLocking';
export const usePayrollLocking = () => {
    const localtion = useLocation();
    const isPaypollPage = localtion.pathname === '/payroll';
    const data = useSelector((state: { payrollLocking: LockingPayrollState }) => state.payrollLocking);

    const dispatch = useDispatch();
    const update = async (state: LockingPayrollState) => {
        isPaypollPage && dispatch(setPayrollLocking(state));
    };

    const reset = () => {
        isPaypollPage && dispatch(resetPayrollLocking());
    };

    const isPayrunSelected = data.isActive || data.isPreviousPayRunSelected;

    const isShowUnlockedStatus =
        (data.isActive || data.isPreviousPayRunSelected) &&
        data.unlockExpireAt &&
        data.unlockExpireAt * 1000 > new Date().getTime();
    return {
        setPayrollLocking: update,
        resetPayrollLocking: reset,
        data: {
            ...data,
            startDate: data.startDate && new Date(data.startDate),
            endDate: data.endDate && new Date(data.endDate),
            startDateString: data.startDate && getFormattedYearMonthDay(new Date(data.startDate)),
            endDateString: data.endDate && getFormattedYearMonthDay(new Date(data.endDate)),
        },
        isLockedPayRunSelected: data.isLockedPayRunSelected && !isShowUnlockedStatus,
        isPayrunSelected,
        isShowUnlockedStatus,
    };
};
