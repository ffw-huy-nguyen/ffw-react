import { useMutation, useQueryClient } from 'react-query';
import { postData } from 'src/ApiService';
import { ApiEndpoint } from './../../ApiService/ApiEndpoint';
import { handleError } from './handleError';
import { useMockMutation } from './mocks/useMockMutation';
import { MutationOptionsProps } from './MutationOptions.interface';

interface PostApiProps {
    endpoint: ApiEndpoint;
    queryKey: string;
    refreshAfterMutating?: boolean;
    afterRefetch?: VoidFunction;
    isMocking?: boolean;
}

export const usePostApi = <T>({
    endpoint,
    queryKey,
    refreshAfterMutating,
    afterRefetch: afterRefetch,
    isMocking,
}: PostApiProps) => {
    const queryClient = useQueryClient();

    const options: MutationOptionsProps<T> = {
        onError: (error, _variables, context) => {
            queryClient.setQueryData(queryKey, context?.previousState || []);
            handleError(error);
        },
    };

    if (refreshAfterMutating) {
        options.onSuccess = async () => {
            await queryClient.refetchQueries(queryKey);
            afterRefetch && afterRefetch();
        };
    } else {
        options.onMutate = async (variables: T) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries(queryKey);

            // Snapshot the previous value
            const previousState = queryClient.getQueryData<T[]>(queryKey);
            if (previousState) {
                queryClient.setQueryData(queryKey, [...previousState, variables]);
            }
            // Return a context object with the snapshotted value
            return { previousState };
        };
    }

    const mockPostApi = useMockMutation<T>({ endpoint, method: 'post' });

    const postApi = useMutation(
        async body => {
            return await postData(endpoint, body);
        },

        options
    );

    return isMocking ? mockPostApi : postApi;
};
