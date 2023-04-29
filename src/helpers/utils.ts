import * as _ from 'lodash';
import { isEqual } from './string';

export const isEmpty = (item: string | any[] | undefined | any) => _.isEmpty(item);
export const isValEqual = (left: any, right: any) => _.isEqual(left, right);
export const cloneDeep = <T extends object>(data: T) => _.cloneDeep(data);
export const find = <T extends unknown>(collection: T[], predicate?: (element: T) => boolean) =>
    _.find(collection, predicate);
export const uniq = <T extends unknown>(collection: T[]) => _.uniq(collection);
export const isUniqueEntity = (valueToCompare: string, id?: string, existingEntities?: any[]) =>
    existingEntities?.find(e => e.id !== id && isEqual(e.value, valueToCompare)) === undefined;
