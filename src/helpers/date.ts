import {
    addDays,
    endOfDay,
    endOfMonth,
    endOfWeek,
    endOfYear,
    format,
    getDay,
    getMonth,
    getYear,
    startOfDay,
    startOfMonth,
    startOfWeek,
    startOfYear,
    subDays,
    subMonths,
} from 'date-fns';
import getTime from 'date-fns/getTime';

export const getFormattedDate = (date?: string | number | Date) => {
    return date ? new Date(date) : new Date();
};

const formattedDate = (formatStandard: string, date?: Date | number) => {
    return format(date ?? getFormattedDate(), formatStandard);
};

export const getFormattedDayMonthYear = (date?: Date | number) => {
    return formattedDate('dd MMM yyyy', date);
};

export const getFormattedDayMonth = (date?: Date) => {
    return formattedDate('dd MMM', date);
};
export const getFormattedMonthDayYear = (date?: Date) => {
    return formattedDate('MM/dd/yyyy', date);
};

export const getFormattedHourMin = (date?: Date) => {
    return formattedDate('HH:mm', date);
};

export const getFormattedZeroHour = (date?: Date) => {
    return startOfDay(date ?? getFormattedDate());
};

export const getFormattedMidnight = (date?: Date) => {
    return endOfDay(date ?? getFormattedDate());
};

export const getStartDateOfWeekDiff = (startingDay: number, weekDiffer?: number): Date => {
    //startingDay : 1 => Monday 7 => Sunday
    var startDayOfWeek = 0;
    const currentDay = getDay(new Date());
    const daysDiff = currentDay - startingDay;
    if (daysDiff < 0) startDayOfWeek = 7 + daysDiff;
    if (daysDiff > 0) startDayOfWeek = daysDiff;
    return subDays(new Date(), startDayOfWeek + (weekDiffer ?? 0) * 7);
};

export const getFirstDayOfWeek = (date?: Date) => {
    return addDays(startOfWeek(date ?? getFormattedDate()), 1);
};

export const getLastDayOfWeek = (date?: Date) => {
    return addDays(endOfWeek(date ?? getFormattedDate()), 1);
};

export const getPreviousDay = (daysDiffer?: number, date?: Date) => {
    return daysDiffer ? subDays(getFormattedDate(date), daysDiffer) : addDays(subMonths(getFormattedDate(date), 1), 1);
};

export const getFutureDay = (daysDiffer: number, date?: Date) => {
    return date ? addDays(new Date(date), daysDiffer) : addDays(new Date(), daysDiffer);
};

export const getFirstDayOfMonth = (date?: Date) => {
    return startOfMonth(date ?? getFormattedDate());
};

export const getLastDayOfMonth = (date?: Date) => {
    return endOfMonth(date ?? getFormattedDate());
};

export const getFirstDayOfYear = (date?: Date) => {
    return startOfYear(date ?? getFormattedDate());
};

export const getLastDayOfYear = (date?: Date) => {
    return endOfYear(date ?? getFormattedDate());
};

export const getCurrentYear = (date?: Date) => {
    return getYear(date ?? getFormattedDate());
};

export const getFirstDayOfEarlistYear = (trackBackYears?: number, date?: Date) => {
    const earlistYear = getYear(date ?? getFormattedDate()) - (trackBackYears ?? 10);
    return getFirstDayOfYear(new Date(`01/01/${earlistYear}`));
};

export const getCurrentMonth = (date?: Date) => {
    return getMonth(date ?? new Date());
};

// Convert hours from 6.75 = 6:45
export const formatTime = (time: number) => {
    try {
        const now = format(new Date(), 'yyyy/MM/dd');
        const custTime = addZero(Math.floor(time)) + ':' + addZero(60 * (time % 1)) + ':00';
        const custDt = new Date(`${now} ${custTime}`);
        return getFormattedHourMin(custDt);
    } catch (err) {
        return '';
    }
};

const addZero = (number: number): string => {
    return number < 10 ? '0' + number : `${number}`;
};

export const getTimeStamp = (date: Date) => {
    return Math.round(getTime(date) / 1000);
};

export const getFormattedYearMonthDay = (date?: Date) => {
    return formattedDate('yyyy-MM-dd', date);
};

const getFormattedWeekMonthDayYear = (date: Date) => {
    return date.toDateString();
};

export const formatNumberToDate = (dateNumber: number, formatWithWeek?: true) => {
    const date = new Date(dateNumber * 1000);
    return formatWithWeek ? getFormattedWeekMonthDayYear(date) : getFormattedYearMonthDay(date);
};

export const isDateBetweenRange = (date: Date, range: { startDate: Date; endDate: Date }) => {
    return getTimeStamp(date) >= getTimeStamp(range.startDate) && getTimeStamp(date) <= getTimeStamp(range.endDate);
};

export const compareDates = (date1: Date, date2: Date) => {
    return getTimeStamp(date1) - getTimeStamp(date2);
};

export const getDayOfDate = (date: Date): number => {
    return getDay(date) > 0 ? getDay(date) : 7;
};

export const getDiffDays = (range: { startDate: Date; endDate: Date }) => {
    const diffTime = compareDates(range.endDate, range.startDate);
    return diffTime > 0 ? Math.ceil(diffTime / 86400) : 0;
};
