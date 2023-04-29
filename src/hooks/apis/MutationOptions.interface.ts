import { AxiosError } from 'axios';

interface TContext<T> {
    previousState: T[] | undefined;
}

export interface MutationOptionsProps<T> {
    onError: (
        err: AxiosError,
        variables: T,
        context: TContext<T> | void | undefined
    ) => Promise<unknown> | void;

    onSuccess?: () => void;

    onMutate?: (
        variables: T
    ) => Promise<TContext<T> | void> | TContext<T> | void;
}
