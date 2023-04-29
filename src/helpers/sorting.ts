import { createNewSortInstance } from 'fast-sort';

const naturalSort = createNewSortInstance({
    comparer: new Intl.Collator(undefined, {
        numeric: true,
        sensitivity: 'base',
    }).compare,
});

export const fastSorting = <T extends { [key: string]: any } | null>({
    results,
    orderBy,
    isAscending,
}: {
    results: T[];
    orderBy: string;
    isAscending: boolean;
}) => {
    return isAscending
        ? naturalSort(results).asc(item => item && item[orderBy])
        : naturalSort(results).desc(item => item && item[orderBy]);
};
