export const convertJsonToFormData = (data: { [key: string]: any }) => {
    const formData = new FormData();
    for (const key in data) {
        if (data[key]) formData.append(key, data[key]);
    }
    return formData;
};
