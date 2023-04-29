import { ApiEndpoint } from 'src/ApiService/ApiEndpoint';
import { mockDataSource } from './data';

export const useMockMutation = <ResponseData>({ endpoint, method }: { endpoint: ApiEndpoint; method: string }) => {
    const data = mockDataSource[endpoint] && (mockDataSource[endpoint][method] as ResponseData);

    return {
        mutateAsync: (_body: any) => data,
    };
};
