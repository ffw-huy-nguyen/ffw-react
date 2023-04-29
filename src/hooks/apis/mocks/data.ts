import { ApiEndpoint } from 'src/ApiService/ApiEndpoint';

export const mockDataSource: { [key in ApiEndpoint]?: any } = {
    [ApiEndpoint.LockedPayRun]: {
        get: [
            {
                Id: '1',
                OrchardId: '2',
                StartDate: '2023-01-02 00:00:00',
                EndDate: '2023-01-08 00:00:00',
                CreatedAt: '2023-01-02',
            },
            {
                Id: '1',
                OrchardId: '2',
                StartDate: '2023-01-09 00:00:00',
                EndDate: '2023-01-15 00:00:00',
                CreatedAt: '2023-01-01',
            },
            {
                Id: '1',
                OrchardId: '2',
                StartDate: '2023-01-16 00:00:00',
                EndDate: '2023-01-22 00:00:00',
                CreatedAt: '2023-01-01',
            },
        ],
        post: {
            Id: '1',
            OrchardId: '2',
            StartDate: '2023-01-01',
            EndDate: '2023-01-02',
            CreatedAt: '2023-01-01',
        },
    },
};
