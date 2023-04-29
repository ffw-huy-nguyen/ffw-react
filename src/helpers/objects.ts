import { get, flatten, partition } from 'lodash';

export const objectToQueryString = (obj: { [key: string]: any }) => {
    var str = [];
    for (var p in obj)
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
        }
    return str.join('&');
};

export const joinFromKeyValues = (
    objItem: { [key: string]: any },
    separator: string,
    excludedSearchColumns?: string[]
) => {
    let text = '';
    for (const [key, value] of Object.entries(objItem)) {
        if (!excludedSearchColumns || !excludedSearchColumns.includes(key)) {
            text = `${text}${separator}${value}`;
        }
    }
    return text;
};

export const getObjectValueFromPath = (object: object, path: string) => {
    return get(object, path);
};

export const getPartitionedData = <T, T1 extends unknown>(RawData: T[], partitionData: T1[], groupBy: string) =>
    flatten(partition(RawData, (v: any) => partitionData.includes(v[groupBy])));
