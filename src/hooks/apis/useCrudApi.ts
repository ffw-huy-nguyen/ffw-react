import { useDeleteApi } from './useDeleteApi';
import { useGetApi } from './useGetApi';
import { usePostApi } from './usePostApi';
import { usePutApi } from './usePutApi';

interface CrudApiProps<Model, InputData> {
    endpoint: string;
    queryKey: string;
    findRemoveItem?: (item: Model, deleteItem: Model) => boolean;
    findUpdateItem?: (item: Model, updateItem: Model) => boolean;
    params?: InputData;
    id?: string;
    refreshAfterMutating?: boolean;
    afterRefetch?: VoidFunction;
}

export const useCrudApi = <Model extends { id: string }, InputData, ResponseData>(
    props: CrudApiProps<Model, InputData>
) => {
    const baseProps = {
        endpoint: props.endpoint,
        queryKey: props.queryKey,
        refreshAfterMutating: props.refreshAfterMutating,
        afterRefetch: props.afterRefetch,
    };

    const removeItemFilter = props.findRemoveItem ?? ((item: Model, deleteItem: Model) => item.id !== deleteItem.id);
    const updateItemFilter = props.findUpdateItem ?? ((item: Model, newItem: Model) => item.id === newItem.id);

    // Create item
    const {
        isLoading: isCreating,
        isSuccess: isCreated,
        mutateAsync: createItem,
    } = usePostApi({
        ...baseProps,
    });

    // Update item
    const {
        isLoading: isUpdating,
        isSuccess: isUpdated,
        mutateAsync: updateItem,
    } = usePutApi({
        ...baseProps,
        findItem: updateItemFilter,
    });

    // Delete item
    const {
        isLoading: isDeleting,
        isSuccess: isDeleted,
        mutateAsync: deleteItem,
    } = useDeleteApi({
        ...baseProps,
        findItem: removeItemFilter,
    });

    // Get list items
    const {
        isLoading: isLoadingList,
        isSuccess: isLoadedList,
        data: items,
        refetch: getItems,
    } = useGetApi<InputData, ResponseData[]>({
        ...baseProps,
        params: props.params,
    });

    // Get detail
    const detailQuery = [`${props.queryKey}_detail`];
    props.id && detailQuery.push(props.id);
    const {
        isLoading: isLoadingItem,
        isSuccess: isLoadedItem,
        data: item,
        refetch: getItem,
    } = useGetApi<InputData, ResponseData>({
        endpoint: `${props.endpoint}/${props.id}`,
        queryKey: detailQuery,
    });

    return {
        isCreating,
        isCreated,
        createItem,
        isUpdating,
        isUpdated,
        updateItem,
        isDeleting,
        isDeleted,
        deleteItem,
        isLoadingList,
        isLoadedList,
        items,
        getItems,
        isLoadingItem,
        isLoadedItem,
        item,
        getItem,
    };
};
