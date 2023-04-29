import { AxiosError } from 'axios';
import { notify } from 'src/components_v2/common/Notification';
import { NotificationMessage } from 'src/DataContracts/NotificationMessage';

export const handleError = (error: AxiosError, message?: string) => {
    if (error.response?.data) {
        if (typeof error.response?.data === 'string') {
            notify({ message: error.response?.data, type: 'error' });
        } else {
            for (const key in error.response.data) {
                if (error.response.data[key]) {
                    let errorFormat = error.response.data[key];
                    if (error.response.data[key].values) errorFormat = error.response.data[key].values;

                    errorFormat.forEach((msg: string) => {
                        notify({ message: msg, type: 'error' });
                    });
                }
            }
        }
    } else {
        notify({ message: message || NotificationMessage.ErrorTryAgain, type: 'error' });
    }
};
