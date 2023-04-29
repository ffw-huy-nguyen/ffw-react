import { useMutation, useQueryClient } from 'react-query';
import { putData } from 'src/ApiService';
import cloneDeep from 'lodash/cloneDeep';
import { handleError } from './handleError';
import { MutationOptionsProps } from './MutationOptions.interface';

interface PutApiProps<T> {
    endpoint: string;
    queryKey: string;
    findItem?: (item: T, newState: T) => boolean;
    refreshAfterMutating?: boolean;
    afterRefetch?: VoidFunction;
}
export const usePutApi = <T extends { id: string }>({
    endpoint,
    queryKey,
    findItem,
    refreshAfterMutating,
    afterRefetch,
}: PutApiProps<T>) => {
    const queryClient = useQueryClient();

    const updateItem = findItem ? findItem : (item: T, newItem: T) => item.id === newItem.id;

    const options: MutationOptionsProps<T> = {
        onError: (error, _variables, context) => {
            queryClient.setQueryData(queryKey, context?.previousState || []);
            handleError(error, 'Could not update this item. Please try again.');
        },
    };

    if (refreshAfterMutating) {
        options.onSuccess = () => {
            queryClient.refetchQueries(queryKey);
            afterRefetch && afterRefetch();
        };
    } else {
        options.onMutate = async (variables: T) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries(queryKey);
            // Snapshot the previous value
            const previousState = queryClient.getQueryData<T[]>(queryKey);

            // Optimistically update to the new value
            if (previousState) {
                const tmp = cloneDeep(previousState);
                const index = tmp.findIndex(item => updateItem(item, variables));
                tmp[index] = variables;
                queryClient.setQueryData(queryKey, [...tmp]);
            }
            // Return a context object with the snapshotted value
            return { previousState };
        };
    }

    return useMutation(async body => {
        return await putData<T>(`${endpoint}/${body.id}`, body);
    }, options);
};
