import { setLocalStorageItem, StorageKey } from './storage';

export const setToken = (token: string, refreshToken?: string) => {
    setLocalStorageItem(StorageKey.Token, token, true);
    setLocalStorageItem(StorageKey.RefreshToken, refreshToken ?? token, true);
};
