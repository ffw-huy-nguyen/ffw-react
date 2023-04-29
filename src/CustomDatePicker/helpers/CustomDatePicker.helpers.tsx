import { LockedPayRun } from 'src/DataContracts/PayRun';
import {
    getCurrentMonth,
    getCurrentYear,
    getDayOfDate,
    getDiffDays,
    getFirstDayOfMonth,
    getFirstDayOfWeek,
    getFirstDayOfYear,
    getFormattedDate,
    getFormattedDayMonth,
    getFormattedDayMonthYear,
    getFormattedYearMonthDay,
    getFutureDay,
    getLastDayOfMonth,
    getLastDayOfWeek,
    getLastDayOfYear,
    getPreviousDay,
} from 'src/helpers/date';
import { usePayrollLocking } from 'src/hooks/usePayrollLocking';
import { getLockedPayRuns } from 'src/pages/NewPayroll/helper/getLockedPayRun';
import { payrollLockingDefaultData } from 'src/store/PayRollLocking';

export interface stateProps {
    startDate: Date;
    endDate: Date;
    key: string;
    isSelectPayrun?: boolean;
}
export enum DateRangeDropdownLabels {
    Today = 'Today',
    Yesterday = 'Yesterday',
    CurrentPayRun = 'Current Pay Run',
    PreviousPayRun = 'Previous Pay Run',
    CurrentWeek = 'This Week',
    CurrentMonth = 'This Month',
    CurrentYear = 'This Year',
    CustomRange = 'Custom Range',
    SelectPayRun = 'Select Pay Run',
}
type labelListProps = {
    [key: string]: string;
};
export const getTrackBackYearLabels = (trachBackYearAmount: number) => {
    const currentYear = getCurrentYear() - 1;
    var labelList: labelListProps = {};
    for (let i = currentYear; i > currentYear - trachBackYearAmount; i--) {
        labelList[`Year ${i}`] = `Year ${i}`;
    }
    return labelList;
};
type PayRunRangeProps = { startDate: Date; endDate: Date; startingDay: number };
export const isPayRunRange = (data: PayRunRangeProps) => {
    return (
        getDayOfDate(data.startDate) === data.startingDay &&
        new Date(data.endDate).getTime() < new Date().getTime() &&
        getDiffDays(data) == 7
    );
};

export const useGetLocalSavedStartDate = () => {
    const { setPayrollLocking } = usePayrollLocking();

    const checkDate = async (data: PayRunRangeProps) => {
        try {
            const res = await getLockedPayRuns(data);
            if (isPayRunRange(data)) {
                if (res && res.length === 1) {
                    const lockedPayRun = res[0] as LockedPayRun;
                    if (lockedPayRun.startDate === getFormattedYearMonthDay(data.startDate)) {
                        setPayrollLocking({
                            ...lockedPayRun,
                            isLockedPayRunSelected: true,
                            isActive: true,
                            startDate: new Date(lockedPayRun.startDate),
                            endDate: new Date(lockedPayRun.endDate),
                        });
                    }
                } else {
                    setPayrollLocking({
                        ...payrollLockingDefaultData,
                        isActive: true,
                        startDate: data.startDate,
                        endDate: data.endDate,
                    });
                }
                return true;
            }
            return false;
        } catch (err) {
            return false;
        }
    };

    const getLocalSavedStartDate = async ({
        currentRunStartDate,
        previousRunStartDate,
        isInitialValueNull = false,
        isDateRange = false,
        startDate,
        endDate,
        optionNames,
        startingDay,
        isApplyPayRun,
    }: {
        currentRunStartDate: Date;
        previousRunStartDate: Date;
        isInitialValueNull?: boolean;
        isDateRange?: boolean;
        startDate?: Date;
        endDate?: Date;
        optionNames?: DateRangeDropdownLabels[] | string[];
        startingDay: number;
        isApplyPayRun?: boolean;
    }): Promise<{ dateValue: string; labelName: DateRangeDropdownLabels }> => {
        if (!isDateRange) {
            const value = !startDate && isInitialValueNull ? '' : getFormattedDayMonthYear(startDate);
            return {
                dateValue: value,
                labelName: DateRangeDropdownLabels.CustomRange,
            };
        }
        const startDateWithYear = getFormattedDayMonthYear(startDate);
        const endDateWithYear = getFormattedDayMonthYear(endDate);
        const startDateYear = getCurrentYear(startDate);
        const endDateYear = getCurrentYear(endDate);
        const startDateWithDayMonth = getFormattedDayMonth(startDate);
        const endDateWithDayMonth = getFormattedDayMonth(endDate);
        const currentDateWithYear = getFormattedDayMonthYear();
        const yesterdayDateWithYear = getFormattedDayMonthYear(getPreviousDay(1));
        const currentRunWithYear = {
            start: getFormattedDayMonthYear(currentRunStartDate),
            end: getFormattedDayMonthYear(getFutureDay(6, currentRunStartDate)),
        };
        const previousRunWithYear = {
            start: getFormattedDayMonthYear(previousRunStartDate),
            end: getFormattedDayMonthYear(getFutureDay(6, previousRunStartDate)),
        };

        const isStartOfCurrentWeek = startDateWithDayMonth === getFormattedDayMonth(getFirstDayOfWeek());
        const isEndOfCurrentWeek = endDateWithDayMonth === getFormattedDayMonth(getLastDayOfWeek());

        const isStartFromCurrentMonth = startDateWithDayMonth === getFormattedDayMonth(getFirstDayOfMonth());
        const isEndOfCurrentMonth = endDateWithDayMonth === getFormattedDayMonth(getLastDayOfMonth());

        const isstartOfCurrentYear = startDateWithDayMonth === getFormattedDayMonth(getFirstDayOfYear());
        const isEndOfCurrentYear = endDateWithDayMonth === getFormattedDayMonth(getLastDayOfYear());

        const isStartOfPreviousYear = startDateWithYear === getFormattedDayMonthYear(getFirstDayOfYear(startDate));
        const isEndOfPreviousYear = endDateWithYear === getFormattedDayMonthYear(getLastDayOfYear(endDate));

        var startDateReturnValue = startDateWithDayMonth;
        var returnedName = DateRangeDropdownLabels.CustomRange;

        console.log('startDate && endDate', startDate, endDate)
        if (isApplyPayRun !== false) {
            const isSelectPayrun = startDate && endDate && (await checkDate({ startDate, endDate, startingDay }));
            if (isSelectPayrun) {
                return {
                    dateValue: `${
                        startDateYear === endDateYear ? startDateWithDayMonth : startDateWithYear
                    } - ${endDateWithYear}`,
                    labelName: DateRangeDropdownLabels.SelectPayRun,
                };
            }
        }

        if (startDateWithYear === endDateWithYear) {
            if (yesterdayDateWithYear === startDateWithYear)
                return { dateValue: DateRangeDropdownLabels.Yesterday, labelName: DateRangeDropdownLabels.Yesterday };
            if (currentDateWithYear === startDateWithYear)
                return { dateValue: DateRangeDropdownLabels.Today, labelName: DateRangeDropdownLabels.Today };
            return { dateValue: `${endDateWithYear}`, labelName: DateRangeDropdownLabels.CustomRange };
        }

        if (
            currentRunWithYear.start === startDateWithYear &&
            currentRunWithYear.end === endDateWithYear &&
            optionNames?.includes(DateRangeDropdownLabels.CurrentPayRun)
        ) {
            return {
                dateValue: `${startDateWithDayMonth} - ${endDateWithYear}`,
                labelName: DateRangeDropdownLabels.CurrentPayRun,
            };
        }

        if (
            previousRunWithYear.start === startDateWithYear &&
            previousRunWithYear.end === endDateWithYear &&
            optionNames?.includes(DateRangeDropdownLabels.PreviousPayRun)
        ) {
            return {
                dateValue: `${startDateWithDayMonth} - ${endDateWithYear}`,
                labelName: DateRangeDropdownLabels.PreviousPayRun,
            };
        }

        if (isStartOfCurrentWeek && isEndOfCurrentWeek && optionNames?.includes(DateRangeDropdownLabels.CurrentWeek)) {
            returnedName = DateRangeDropdownLabels.CurrentWeek;
        }
        if (
            isStartFromCurrentMonth &&
            isEndOfCurrentMonth &&
            optionNames?.includes(DateRangeDropdownLabels.CurrentMonth)
        ) {
            returnedName = DateRangeDropdownLabels.CurrentMonth;
        }

        if (isstartOfCurrentYear && isEndOfCurrentYear && optionNames?.includes(DateRangeDropdownLabels.CurrentYear)) {
            returnedName = DateRangeDropdownLabels.CurrentYear;
        }

        if (
            isStartOfPreviousYear &&
            isEndOfPreviousYear &&
            optionNames?.find(item => item === `Year ${startDateYear}`)
        ) {
            returnedName = `Year ${startDateYear}` as DateRangeDropdownLabels;
        }

        if (startDateYear !== endDateYear) {
            startDateReturnValue = startDateWithYear;
        }
        return {
            dateValue: `${startDateReturnValue} - ${endDateWithYear}`,
            labelName: returnedName,
        };
    };

    return getLocalSavedStartDate;
};
export const checkStartDate = (startDate: Date, endDate: Date) => {
    const startDateYear = getCurrentYear(startDate);
    const endDateYear = getCurrentYear(endDate);
    if (startDateYear === endDateYear) return getFormattedDayMonth(startDate);
    return getFormattedDayMonthYear(startDate);
};
export const getCustomRangeBtmDateValue = (startDate?: string | Date, endDate?: string | Date) => {
    const startDateFormatted = getFormattedDayMonthYear(getFormattedDate(startDate));
    const endDateFormatted = getFormattedDayMonthYear(getFormattedDate(endDate));
    return `${startDateFormatted} - ${endDateFormatted}`;
};
export const getCalendarInitialValue = (dateValue: string) => {
    if (dateValue === DateRangeDropdownLabels.Yesterday) {
        return { startDate: getPreviousDay(1), endDate: getPreviousDay(1) };
    }
    if (dateValue === DateRangeDropdownLabels.Today) {
        return { startDate: getFormattedDate(), endDate: getFormattedDate() };
    }
    var startDate = dateValue.substring(0, dateValue.indexOf('-'));
    const endDate = dateValue.substring(startDate.length, dateValue.length);
    const endDateCurrentYear = getCurrentYear(getFormattedDate(endDate));
    const isStartDateWithoutYear = Boolean(startDate.length <= 7 && startDate.length > 0);
    const isStartDateNull = Boolean(startDate.length === 0);

    if (isStartDateWithoutYear) {
        startDate = `${startDate}${endDateCurrentYear}`;
    }
    if (isStartDateNull) {
        startDate = endDate;
    }

    return { startDate: getFormattedDate(startDate), endDate: getFormattedDate(endDate) };
};
export const getSingleDateValue = (dateValue: string) => {
    const startDate = dateValue.substring(0, dateValue.indexOf('-'));
    const endDate = dateValue.substring(startDate.length, dateValue.length);
    return endDate ? getFormattedDayMonthYear(getFormattedDate(endDate)) : '';
};

export const handleDisplayMonth = (monthElement?: HTMLSelectElement, minDate?: Date, maxDate?: Date) => {
    const minDisplayMonth = minDate ? getCurrentMonth(minDate) : -1;
    const maxDisplayMonth = maxDate ? getCurrentMonth(maxDate) : 12;

    for (let i = 0; i < minDisplayMonth; i++) {
        monthElement?.getElementsByTagName('option')[0]?.remove();
    }
    const index = maxDisplayMonth - minDisplayMonth + 1;
    for (let i = 0; i < 12 - maxDisplayMonth; i++) {
        monthElement?.getElementsByTagName('option')[index]?.remove();
    }
    return monthElement;
};
