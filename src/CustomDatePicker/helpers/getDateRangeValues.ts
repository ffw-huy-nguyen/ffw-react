import {
    getDayOfDate,
    getFirstDayOfMonth,
    getFirstDayOfWeek,
    getFirstDayOfYear,
    getFormattedDate,
    getFutureDay,
    getLastDayOfMonth,
    getLastDayOfWeek,
    getLastDayOfYear,
    getPreviousDay,
} from 'src/helpers/date';
import { DateRangeDropdownLabels } from './CustomDatePicker.helpers';

export const getDateRangeValues = (
    title: DateRangeDropdownLabels,
    currentRunStartDate: Date,
    previousRunStartDate: Date
) => {
    switch (title) {
        case DateRangeDropdownLabels.Yesterday:
            return {
                startDate: getPreviousDay(1),
                endDate: getPreviousDay(1),
            };
        case DateRangeDropdownLabels.CurrentPayRun:
            return {
                startDate: currentRunStartDate,
                endDate: getFutureDay(6, currentRunStartDate),
            };
        case DateRangeDropdownLabels.PreviousPayRun:
            return {
                startDate: previousRunStartDate,
                endDate: getFutureDay(6, previousRunStartDate),
            };
        case DateRangeDropdownLabels.CurrentMonth:
            return {
                startDate: getFirstDayOfMonth(),
                endDate: getLastDayOfMonth(),
            };
        case DateRangeDropdownLabels.CurrentYear:
            return {
                startDate: getFirstDayOfYear(),
                endDate: getLastDayOfYear(),
            };
        case DateRangeDropdownLabels.CurrentWeek:
            return {
                startDate: getFirstDayOfWeek(),
                endDate: getLastDayOfWeek(),
            };
        case DateRangeDropdownLabels.Today:
            return {
                startDate: getFormattedDate(),
                endDate: getFormattedDate(),
            };
        default:
            return {
                startDate: getFirstDayOfYear(getFormattedDate(`01/01/${title.slice(-4)}`)),
                endDate: getLastDayOfYear(getFormattedDate(`01/01/${title.slice(-4)}`)),
            };
    }
};

export const calculateMinDate = (lockableStartDate: Date, payrollStartingDay: number) => {
    const lockableDay = getDayOfDate(lockableStartDate);
    if (lockableDay > payrollStartingDay) {
        return getPreviousDay(lockableDay - payrollStartingDay, lockableStartDate);
    } else if (lockableDay < payrollStartingDay) {
        return getPreviousDay(7 - (payrollStartingDay - lockableDay), lockableStartDate);
    } else {
        return lockableStartDate;
    }
};
