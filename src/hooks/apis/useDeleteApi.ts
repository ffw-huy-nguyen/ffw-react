import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { deleteData } from 'src/ApiService';
import { handleError } from './handleError';

interface DeleteApiProps<T> {
    endpoint: string;
    queryKey: string;
    enabled?: boolean;
    findItem?: (item: T, deleteItem: T) => boolean;
}
export const useDeleteApi = <T extends {id: string}>({ endpoint, queryKey, findItem }: DeleteApiProps<T>) => {
    const queryClient = useQueryClient();

    const removeItem = findItem ? findItem : (item: T, deleteItem: T) => item.id !== deleteItem.id;

    return useMutation<T, AxiosError, T, { previousState: T[] | undefined; }>(
        async (item) => {
            return await deleteData(`${endpoint}/${item.id}`);
        },
        {
            onMutate: async (variables: T) => {
                // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
                await queryClient.cancelQueries(queryKey);
                // Snapshot the previous value
                const previousState = queryClient.getQueryData<T[]>(queryKey);

                // Optimistically update to the new value
                if (previousState) {
                    queryClient.setQueryData(queryKey, [...previousState.filter(item => removeItem(item, variables))]);
                }
                // Return a context object with the snapshotted value
                return { previousState };
            },

            onError: (error, _variables, context) => {
                queryClient.setQueryData(queryKey, context?.previousState || []);
                handleError(error, 'Could not delete this item. Please try again.');
            },
        }
    );
};
