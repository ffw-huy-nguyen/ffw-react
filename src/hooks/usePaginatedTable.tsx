import { useState } from 'react';
import { getUserPreferences } from 'src/components_v2/common/DynamicSidebar/helpers/syncUserPreferences';
import { getPaginatedResults } from 'src/components_v2/common/Pagination/functions/getPaginatedResults';
import {
    DynamicFields,
    Sorting,
    TableColumn,
    TableData,
} from 'src/components_v2/common/Tables/PaginatedTable/PaginatedTable.interface';
import { PaginationModuleNames } from 'src/components_v2/common/Tables/PaginatedTable/PaginatedTable.interface';

export const usePaginatedTable = <TData extends unknown, TFormatedData extends unknown, TTableData extends TableData>({
    initialTableInfo,
    initialDynamicFields,
    sanitizeData,
    getSortedResult,
    moduleName,
    fixedColumns,
}: {
    initialTableInfo: TTableData;
    initialDynamicFields: DynamicFields;
    sanitizeData?: (data: TData[]) => TFormatedData[];
    moduleName: PaginationModuleNames;
    getSortedResult: (list: TFormatedData[], filters: Sorting, filterByLineType?: boolean) => TFormatedData[];
    fixedColumns?: TableColumn[];
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [tableInfo, setTableInfo] = useState(initialTableInfo);
    const [data, setData] = useState<TFormatedData[]>([]);
    const filteredResults = getSortedResult(data, tableInfo, true);

    const [dynamicFields, setDynamicFields] = useState(initialDynamicFields);

    const totalPages = Math.ceil((filteredResults?.length || 0) / tableInfo.pagination.rowsPerPage);

    const paginatedResults = getPaginatedResults({
        list: filteredResults,
        currentPage: tableInfo.pagination.current > totalPages ? 1 : tableInfo.pagination.current,
        rowsPerPage: tableInfo.pagination.rowsPerPage,
    });

    const syncUserPreferences = async () => {
        const references = await getUserPreferences(moduleName, 'columns', initialDynamicFields.list);
        if (references) {
            setDynamicFields({ ...dynamicFields, list: [...references] });
        }
    };

    const handleSetData = (data: any) => {
        const newData = sanitizeData ? sanitizeData(data) : data;
        setData(newData);
    };

    const handleSortData = (sortColumn: string) => {
        let oldState = {
            column: tableInfo.sortColumn,
            isAscending: tableInfo.isAscending,
        };

        let newState;

        if (sortColumn !== oldState.column) {
            newState = {
                column: sortColumn,
                isAscending: true,
            };
        } else {
            newState = {
                column: oldState.column,
                isAscending: !oldState.isAscending,
            };
        }

        setTableInfo({
            ...tableInfo,
            sortColumn: newState.column,
            isAscending: newState.isAscending,
        });
    };

    const handleUpdateDynamicFields = (fields: TableColumn[]) => {
        const columnsDisplayInTable = fixedColumns?.length ? [...fixedColumns, ...fields] : fields;
        setDynamicFields({ list: columnsDisplayInTable, open: false });
    };

    return {
        isLoaded,
        tableInfo,
        paginatedResults,
        filteredResults,
        setTableInfo,
        dynamicFields,
        setDynamicFields,
        handleUpdateDynamicFields,
        setIsLoaded,
        allData: data,
        handleSetData,
        handleSortData,
        syncUserPreferences,
    };
};
