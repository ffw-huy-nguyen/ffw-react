import { ApiEndpoint } from 'src/ApiService/ApiEndpoint';
import { mockDataSource } from './data';

export const useMockQuery = <ResponseData>({ endpoint }: { endpoint: ApiEndpoint }) => {
    const data = mockDataSource[endpoint]?.get as ResponseData;

    return {
        data,
        refetch: () => {},
    };
};
