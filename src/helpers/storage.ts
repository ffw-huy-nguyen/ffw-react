export enum StorageKey {
    SideMenuOpen = 'side-menu-open',
    Token = 'token',
    RefreshToken = 'refresh_token',
    ActiveSubLink = 'activeSubLink',
    ExpandSubMenu = 'expandSubMenu',
    PayrollFilter = 'payroll-filter',
    MetaData = 'meta-data',
    AuthDetail = 'auth-detail',
    PayrollLocking = 'payroll-locking',
}

export const setLocalStorageItem = (name: string, value: any, isKeepType?: boolean) => {
    localStorage.setItem(name, isKeepType ? value : JSON.stringify(value));
};

export const getLocalStorageItem = <T>(name: string, isKeepType?: boolean) => {
    const value = localStorage.getItem(name);
    return value ? (isKeepType ? value : JSON.parse(value)) : (null as T);
};

export const clearLocalStorageItem = (name: string) => {
    localStorage.removeItem(name);
};

export const clearLocalStorage = () => {
    localStorage.clear();
};
