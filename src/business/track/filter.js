const apis = ['userasyncjobs', 'getpendingworklist'];
export const isFilter = api => {
    if (api && api._url) {
        return apis.some(item => api._url.includes(item));
    } else {
        return false;
    }
};
