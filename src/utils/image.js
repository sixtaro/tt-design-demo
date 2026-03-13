Image.url = (url, hasBaseUrl) => {
    if (!url) {
        return url;
    }
    if (typeof url === 'object' && url._url) {
        if (url._url.indexOf(window._baseURL) > -1) {
            return window._baseURL_prefix + url._url;
        }
        return window._baseURL_prefix + window._baseURL + '/' + url._url;
    }
    if (url.indexOf(window._baseURL) === 0) {
        return window._baseURL_prefix + url;
    }
    if (url.indexOf('@/') === 0) {
        return url.replace('@', window._pageURL);
    }
    if (url.indexOf('@public/') === 0) {
        return url.replace('@public', window._baseURL_prefix + '/PublicV2');
    }
    if (!hasBaseUrl && url.indexOf('/') === 0) {
        return window._baseURL_prefix + window._baseURL + url;
    }
    if (url.indexOf('~/') === 0) {
        return url.replace('~/', window._baseURL_prefix + window._baseURL);
    }
    if (!hasBaseUrl && url.indexOf('../') === 0) {
        return url.replace('../', window._baseURL_prefix + window._baseURL);
    }
    return url;
};
