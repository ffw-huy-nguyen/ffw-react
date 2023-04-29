import { joinFromKeyValues } from './objects';

export const quickSearch = <T extends { [key: string]: any }>({
    list,
    keyword,
    excludedSearchColumns,
}: {
    list: T[];
    keyword?: string;
    excludedSearchColumns?: string[];
}) => {
    if (keyword) {
        return list.filter(item => {
            const itemText = joinFromKeyValues(item, '-', excludedSearchColumns);
            return itemText.toLowerCase().search(keyword.toLowerCase()) >= 0;
        });
    }
    return list;
};
